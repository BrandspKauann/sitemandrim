import assert from 'node:assert/strict';
import { installBackgroundAudio } from '../app/components/backgroundAudioSession.ts';

class FakeAudio extends EventTarget {
  dataset = { mediaTitle: 'Teste de mandarim' };
  duration = 60;
  currentTime = 12;
  playbackRate = 1;
  isConnected = true;
  paused = false;
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
}
globalThis.HTMLAudioElement = FakeAudio;
globalThis.MediaMetadata = class { constructor(data) { Object.assign(this, data); } };
let changed;
globalThis.MutationObserver = class {
  constructor(callback) { changed = callback; }
  observe() {}
  disconnect() {}
};
const listeners = new Map();
const doc = { body: {}, addEventListener: (type, callback) => listeners.set(type, callback),
  removeEventListener: (type) => listeners.delete(type) };
const handlers = new Map();
const session = { setActionHandler: (type, callback) => handlers.set(type, callback),
  setPositionState: (position) => { session.position = position; } };
const nav = { mediaSession: session, audioSession: {} };
const cleanup = installBackgroundAudio(doc, nav);
const audio = new FakeAudio();
listeners.get('play')({ type: 'play', target: audio });
assert.equal(nav.audioSession.type, 'playback');
assert.equal(session.playbackState, 'playing');
assert.equal(session.metadata.title, 'Teste de mandarim');
assert.equal(session.position.position, 12);
handlers.get('seekforward')({ seekOffset: 10 });
assert.equal(audio.currentTime, 22);
handlers.get('seekto')({ seekTime: 999 });
assert.equal(audio.currentTime, 60);
handlers.get('pause')({});
assert.equal(audio.paused, true);
handlers.get('play')({});
assert.equal(audio.paused, false);
handlers.get('stop')({});
assert.equal(audio.currentTime, 0);
assert.equal(session.playbackState, 'none');
listeners.get('play')({ type: 'play', target: audio });
audio.isConnected = false;
changed();
assert.equal(session.metadata, null);
cleanup();
assert.equal(listeners.size, 0);
// A browser with neither optional API must still keep normal audio working.
installBackgroundAudio(doc, {})();
console.log('Background audio: media controls, seeking, cleanup and fallback passed.');
