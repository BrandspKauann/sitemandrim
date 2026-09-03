'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export type PhraseStudyItem = {
  id: number;
  hanzi: string;
  pinyin: string;
  portuguese: string;
  translation: string;
};

export type PhraseSequenceHandle = {
  stop: () => void;
};

type PhraseSequenceProps = {
  items: PhraseStudyItem[];
  sessionId: string;
  onBeforePlay?: () => void;
  sectionId?: string;
  kicker?: string;
  title?: string;
  description?: string;
  countLabel?: string;
  playAllLabel?: string;
  itemNoun?: string;
  gapLabel?: string;
};

const DEFAULT_GAP = 2;
const MIN_GAP = 1;
const MAX_GAP = 30;

const PhraseSequence = forwardRef<PhraseSequenceHandle, PhraseSequenceProps>(function PhraseSequence(
  {
    items,
    sessionId,
    onBeforePlay,
    sectionId = 'frases-da-aula',
    kicker = 'Sequência de estudo',
    title = 'Frases da aula, uma por uma.',
    description = 'Escute em ordem, acompanhe o pinyin, use a leitura em português como apoio e confira a tradução.',
    countLabel,
    playAllLabel,
    itemNoun = 'frase',
    gapLabel = 'Pausa entre as frases',
  }, ref,
) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentItem, setCurrentItem] = useState<PhraseStudyItem | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [speed, setSpeed] = useState<'natural' | 'slow'>('slow');
  const [repeat, setRepeat] = useState(false);
  const [gapDraft, setGapDraft] = useState(DEFAULT_GAP);
  const [savedGap, setSavedGap] = useState(DEFAULT_GAP);
  const [message, setMessage] = useState('');

  const queue = useRef<PhraseStudyItem[]>([]);
  const queueIndex = useRef(0);
  const runId = useRef(0);
  const paused = useRef(false);
  const utteranceActive = useRef(false);
  const speedRef = useRef<'natural' | 'slow'>('slow');
  const repeatRef = useRef(false);
  const gapRef = useRef(DEFAULT_GAP);
  const timer = useRef<number | null>(null);
  const nextAction = useRef<(() => void) | null>(null);
  const titleId = `${sectionId}-title`;
  const gapInputId = `${sectionId}-gap`;
  const gapStorageKey = sectionId === 'frases-da-aula'
    ? `tons-de-mandarim:phrase-sequence-gap:${sessionId}`
    : `tons-de-mandarim:phrase-sequence-gap:${sectionId}:${sessionId}`;

  function clearTimer() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function resetPlayback() {
    setStatus('idle');
    setCurrentItem(null);
    setProgress({ current: 0, total: 0 });
    utteranceActive.current = false;
    nextAction.current = null;
  }

  function stopPlayback(clearMessage = true) {
    runId.current += 1;
    paused.current = false;
    clearTimer();
    nextAction.current = null;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (clearMessage) setMessage('');
    resetPlayback();
  }

  useImperativeHandle(ref, () => ({ stop: () => stopPlayback() }));

  useEffect(() => () => {
    runId.current += 1;
    clearTimer();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    try {
      const stored = Number(window.sessionStorage.getItem(gapStorageKey));
      if (!Number.isInteger(stored) || stored < MIN_GAP || stored > MAX_GAP) return;
      gapRef.current = stored;
      queueMicrotask(() => {
        setGapDraft(stored);
        setSavedGap(stored);
      });
    } catch { /* The player still works without browser persistence. */ }
  }, [gapStorageKey, sessionId]);

  function scheduleNext(activeRun: number) {
    nextAction.current = () => playNext(activeRun);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      const next = nextAction.current;
      nextAction.current = null;
      next?.();
    }, gapRef.current * 1000);
  }

  function playNext(activeRun: number) {
    if (runId.current !== activeRun || paused.current) return;

    if (queueIndex.current >= queue.current.length) {
      if (repeatRef.current && queue.current.length) {
        queueIndex.current = 0;
        scheduleNext(activeRun);
        return;
      }
      resetPlayback();
      return;
    }

    const item = queue.current[queueIndex.current];
    setCurrentItem(item);
    setProgress({ current: queueIndex.current + 1, total: queue.current.length });

    const utterance = new SpeechSynthesisUtterance(item.hanzi);
    const voices = window.speechSynthesis.getVoices();
    const mandarinVoice = voices.find((voice) => voice.lang.toLowerCase() === 'zh-cn')
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));

    utterance.lang = mandarinVoice?.lang ?? 'zh-CN';
    utterance.rate = speedRef.current === 'slow' ? 0.55 : 0.88;
    utterance.pitch = 1;
    if (mandarinVoice) utterance.voice = mandarinVoice;
    utterance.onstart = () => {
      if (runId.current !== activeRun) return;
      utteranceActive.current = true;
      setStatus('playing');
      setMessage('');
    };
    utterance.onend = () => {
      if (runId.current !== activeRun) return;
      utteranceActive.current = false;
      queueIndex.current += 1;
      scheduleNext(activeRun);
    };
    utterance.onerror = () => {
      if (runId.current !== activeRun) return;
      setMessage('Não foi possível iniciar a voz em mandarim neste dispositivo.');
      stopPlayback(false);
    };
    window.speechSynthesis.speak(utterance);
  }

  function startQueue(nextQueue: PhraseStudyItem[]) {
    if (!nextQueue.length || !('speechSynthesis' in window)) {
      setMessage('O áudio não está disponível neste navegador.');
      return;
    }
    onBeforePlay?.();
    stopPlayback();
    queue.current = nextQueue;
    queueIndex.current = 0;
    const activeRun = runId.current + 1;
    runId.current = activeRun;
    setStatus('playing');
    setProgress({ current: 1, total: nextQueue.length });
    playNext(activeRun);
  }

  function togglePause() {
    if (status === 'idle') return;
    if (status === 'playing') {
      paused.current = true;
      clearTimer();
      if (utteranceActive.current) window.speechSynthesis.pause();
      setStatus('paused');
      return;
    }

    paused.current = false;
    setStatus('playing');
    if (utteranceActive.current) window.speechSynthesis.resume();
    else {
      const next = nextAction.current;
      nextAction.current = null;
      if (next) next();
      else playNext(runId.current);
    }
  }

  function changeSpeed(value: 'natural' | 'slow') {
    speedRef.current = value;
    setSpeed(value);
  }

  function toggleRepeat() {
    const next = !repeat;
    repeatRef.current = next;
    setRepeat(next);
  }

  function saveGap() {
    const seconds = Math.min(MAX_GAP, Math.max(MIN_GAP, Math.round(gapDraft)));
    gapRef.current = seconds;
    setGapDraft(seconds);
    setSavedGap(seconds);
    try {
      window.sessionStorage.setItem(gapStorageKey, String(seconds));
    } catch { /* Keeping the value in memory is enough for this visit. */ }

    if (timer.current && nextAction.current) {
      clearTimer();
      timer.current = window.setTimeout(() => {
        timer.current = null;
        const next = nextAction.current;
        nextAction.current = null;
        next?.();
      }, seconds * 1000);
    }
  }

  const stageItem = currentItem ?? items[0];
  const speaking = status === 'playing';

  return (
    <section className="lesson-section" id={sectionId} aria-labelledby={titleId}>
      <div className="lesson-shell">
        <div className="lesson-heading">
          <div>
            <span className="section-kicker">{kicker}</span>
            <h2 id={titleId}>{title}</h2>
            <p>{description}</p>
          </div>
          <span className="lesson-count">{countLabel ?? `${items.length} frases`}</span>
        </div>

        <div className="lesson-player">
          <div className="lesson-player-top">
            <span>{status === 'idle' ? 'Pronto para estudar' : status === 'paused' ? 'Sequência pausada' : 'Falando agora'}</span>
            {progress.total > 0 && <strong>{progress.current}/{progress.total}</strong>}
          </div>

          {stageItem && (
            <div className={`lesson-stage ${speaking ? 'is-speaking' : ''}`} key={`${stageItem.id}-${status}`} aria-live="polite">
              <div className="lesson-stage-number">{String(stageItem.id).padStart(2, '0')}</div>
              <div className="lesson-stage-copy">
                <strong lang="zh-CN">{stageItem.hanzi}</strong>
                <span>{stageItem.pinyin}</span>
                <p>Como ler: {stageItem.portuguese}</p>
                <em>{stageItem.translation}</em>
              </div>
              <div className="lesson-sound-bars" aria-hidden="true"><i /><i /><i /><i /></div>
            </div>
          )}

          <div className="lesson-progress" aria-hidden="true">
            <i style={{ width: progress.total ? `${(progress.current / progress.total) * 100}%` : '0%' }} />
          </div>

          <div className="lesson-controls">
            <button className="lesson-play-all" type="button" onClick={() => startQueue(items)}>
              ▶ {playAllLabel ?? `Reproduzir as ${items.length} frases`}
            </button>
            <button type="button" onClick={togglePause} disabled={status === 'idle'}>
              {status === 'paused' ? 'Continuar' : 'Pausar'}
            </button>
            <button type="button" onClick={() => stopPlayback()} disabled={status === 'idle'}>Parar</button>
          </div>

          <div className="lesson-options">
            <div className="lesson-speed" aria-label={`Velocidade: ${title}`}>
              <button type="button" className={speed === 'slow' ? 'active' : ''}
                onClick={() => changeSpeed('slow')} aria-pressed={speed === 'slow'}>Devagar</button>
              <button type="button" className={speed === 'natural' ? 'active' : ''}
                onClick={() => changeSpeed('natural')} aria-pressed={speed === 'natural'}>Natural</button>
            </div>
            <button className={`lesson-repeat ${repeat ? 'active' : ''}`} type="button"
              onClick={toggleRepeat} aria-pressed={repeat}>↻ Repetir sequência</button>
          </div>

          <div className="lesson-gap-control">
            <div><label htmlFor={gapInputId}>{gapLabel}</label><output htmlFor={gapInputId}>{gapDraft}s</output></div>
            <input id={gapInputId} type="range" min={MIN_GAP} max={MAX_GAP} step="1"
              value={gapDraft} onChange={(event) => setGapDraft(Number(event.target.value))} />
            <div className="lesson-gap-footer">
              <span>Em uso: {savedGap}s</span>
              <button type="button" onClick={saveGap} disabled={gapDraft === savedGap}>
                {gapDraft === savedGap ? '✓ Salvo' : 'Salvar intervalo'}
              </button>
            </div>
          </div>
          {message && <p className="lesson-message" role="status">{message}</p>}
        </div>

        <ol className="lesson-list">
          {items.map((item) => {
            const isCurrent = currentItem?.id === item.id && status !== 'idle';
            return (
              <li className={isCurrent ? 'active' : ''} key={item.id}>
                <div className="lesson-card-head">
                  <span>{String(item.id).padStart(2, '0')}</span>
                  <button type="button" onClick={() => startQueue([item])}
                    aria-label={`Ouvir ${itemNoun} ${item.id}: ${item.hanzi}`}>{isCurrent ? '■ Falando' : '▶ Ouvir'}</button>
                </div>
                <strong className="lesson-hanzi" lang="zh-CN">{item.hanzi}</strong>
                <dl>
                  <div><dt>Pinyin</dt><dd>{item.pinyin}</dd></div>
                  <div><dt>Leitura em português</dt><dd>{item.portuguese}</dd></div>
                  <div><dt>Tradução</dt><dd>{item.translation}</dd></div>
                </dl>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
});

export default PhraseSequence;
