type AudioNavigator = Navigator & { audioSession?: { type: string } };

export function installBackgroundAudio(doc: Document, nav: AudioNavigator) {
  let active: HTMLAudioElement | null = null;
  const session = nav.mediaSession;
  const actions: MediaSessionAction[] = ['play', 'pause', 'stop', 'seekbackward', 'seekforward', 'seekto'];

  function position() {
    if (!active || !session?.setPositionState) return;
    try {
      if (Number.isFinite(active.duration) && active.duration > 0) {
        session.setPositionState({ duration: active.duration, playbackRate: active.playbackRate,
          position: Math.max(0, Math.min(active.currentTime, active.duration)) });
      } else session.setPositionState();
    } catch { /* Older browsers may expose only part of Media Session. */ }
  }

  function handler(action: MediaSessionAction, callback: MediaSessionActionHandler | null) {
    try { session?.setActionHandler(action, callback); } catch { /* Unsupported action. */ }
  }

  function clear() {
    active = null;
    if (!session) return;
    session.playbackState = 'none';
    session.metadata = null;
    try { session.setPositionState?.(); } catch { /* Optional API. */ }
    actions.forEach((action) => handler(action, null));
  }

  function seek(time: number) {
    if (!active || !Number.isFinite(active.duration)) return;
    active.currentTime = Math.max(0, Math.min(time, active.duration));
    position();
  }

  function onEvent(event: Event) {
    const audio = event.target;
    if (!(audio instanceof HTMLAudioElement)) return;
    if (event.type === 'play') {
      // Request the playback audio category on browsers (notably Safari) that
      // implement it. No microphone or silent keep-alive workaround is used.
      try { if (nav.audioSession) nav.audioSession.type = 'playback'; } catch { /* Optional API. */ }
      active = audio;
      if (!session) return;
      const title = audio.dataset.mediaTitle || 'Prática de mandarim';
      if (typeof MediaMetadata !== 'undefined') session.metadata = new MediaMetadata({ title, artist: 'Tons de Mandarim' });
      session.playbackState = 'playing';
      handler('play', () => { void active?.play().catch(() => undefined); });
      handler('pause', () => active?.pause());
      handler('stop', () => {
        const current = active;
        current?.pause();
        if (current) { current.currentTime = 0; current.dispatchEvent(new Event('background-audio-stop')); }
        clear();
      });
      handler('seekbackward', (details) => seek((active?.currentTime ?? 0) - (details.seekOffset ?? 10)));
      handler('seekforward', (details) => seek((active?.currentTime ?? 0) + (details.seekOffset ?? 10)));
      handler('seekto', (details) => { if (details.seekTime !== undefined) seek(details.seekTime); });
    } else if (audio === active && session) {
      if (event.type === 'pause' || event.type === 'ended') session.playbackState = 'paused';
    }
    if (audio === active) position();
  }

  const events = ['play', 'pause', 'ended', 'timeupdate', 'durationchange', 'ratechange', 'seeked'];
  events.forEach((event) => doc.addEventListener(event, onEvent, true));
  const observer = new MutationObserver(() => { if (active && !active.isConnected) clear(); });
  observer.observe(doc.body, { childList: true, subtree: true });
  return () => {
    events.forEach((event) => doc.removeEventListener(event, onEvent, true));
    observer.disconnect();
    clear();
  };
}
