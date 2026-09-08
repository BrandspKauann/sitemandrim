'use client';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { pinyin } from 'pinyin-pro';
import { REAL_DIALOGUE_AUDIO, REAL_DIALOGUE_LINES, type RealDialogueLine } from './realDialogueData';
import styles from './RealMandarinDialogues.module.css';

type Phase = 'idle' | 'mandarin' | 'pause';
type PlayMode = 'all-once' | 'all-loop' | 'single-once' | 'single-loop';

export type RealMandarinDialoguesHandle = {
  stop: () => void;
};

type Props = {
  onBeforePlay: () => void;
};

const STORAGE_KEY = 'hsk1:dialogue-real-gap';
const HANZI_PATTERN = /[\u3400-\u9fff]/u;
const PUNCTUATION: Record<string, string> = {
  '，': ',', '。': '.', '！': '!', '？': '?', '、': ',',
};
const TONE_MARKS: Record<string, number> = {
  ā: 1, á: 2, ǎ: 3, à: 4,
  ē: 1, é: 2, ě: 3, è: 4,
  ī: 1, í: 2, ǐ: 3, ì: 4,
  ō: 1, ó: 2, ǒ: 3, ò: 4,
  ū: 1, ú: 2, ǔ: 3, ù: 4,
  ǖ: 1, ǘ: 2, ǚ: 3, ǜ: 4,
};
const INITIALS = [
  ['zh', 'dj'], ['ch', 'tch'], ['sh', 'sh'],
  ['b', 'p'], ['p', 'p'], ['m', 'm'], ['f', 'f'],
  ['d', 't'], ['t', 't'], ['n', 'n'], ['l', 'l'],
  ['g', 'k'], ['k', 'k'], ['h', 'r'],
  ['j', 'dj'], ['q', 'tch'], ['x', 'sh'], ['r', 'j'],
  ['z', 'dz'], ['c', 'ts'], ['s', 's'],
] as const;
const APICAL: Record<string, string> = {
  zhi: 'djrr', chi: 'tchrr', shi: 'shrr', ri: 'jrr', zi: 'dz', ci: 'ts', si: 's',
};
const FINALS: Record<string, string> = {
  a: 'a', ai: 'ai', an: 'an', ang: 'ang', ao: 'au',
  o: 'ô', ou: 'ou', ong: 'ung',
  e: 'â', ei: 'ei', en: 'ân', eng: 'âng', er: 'âr',
  i: 'i', ia: 'ia', ian: 'ien', iang: 'iang', iao: 'iau', ie: 'iê',
  in: 'in', ing: 'ing', iong: 'iung', iu: 'iou',
  u: 'u', ua: 'ua', uai: 'uai', uan: 'uan', uang: 'uang',
  ui: 'uei', un: 'uân', uo: 'uô',
  ü: 'ü', üe: 'üê', üan: 'üen', ün: 'ün',
};

function storedGap() {
  if (typeof window === 'undefined') return 1;
  const value = Number(window.sessionStorage.getItem(STORAGE_KEY));
  return Number.isFinite(value) && value >= 1 && value <= 10 ? value : 1;
}

function plainPinyin(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/v/g, 'ü').toLowerCase();
}

function toneNumber(value: string) {
  for (const character of value) {
    const tone = TONE_MARKS[character];
    if (tone) return tone;
  }
  return 0;
}

function portugueseApproximation(value: string) {
  const syllable = plainPinyin(value);
  if (APICAL[syllable]) return APICAL[syllable];

  if (syllable.startsWith('y')) {
    const finals: Record<string, string> = {
      yi: 'i', ya: 'ia', yan: 'ien', yang: 'iang', yao: 'iau', ye: 'iê',
      yin: 'in', ying: 'ing', yong: 'iung', you: 'iou',
      yu: 'ü', yue: 'üê', yuan: 'üen', yun: 'ün',
    };
    return finals[syllable] ?? `i${syllable.slice(1)}`;
  }

  if (syllable.startsWith('w')) {
    const finals: Record<string, string> = {
      wu: 'u', wa: 'ua', wai: 'uai', wan: 'uan', wang: 'uang',
      wei: 'uei', wen: 'uân', weng: 'uâng', wo: 'uô',
    };
    return finals[syllable] ?? `u${syllable.slice(1)}`;
  }

  let initial = '';
  let initialPt = '';
  for (const [candidate, approximation] of INITIALS) {
    if (syllable.startsWith(candidate)) {
      initial = candidate;
      initialPt = approximation;
      break;
    }
  }

  let final = syllable.slice(initial.length);
  if (['j', 'q', 'x'].includes(initial) && final.startsWith('u')) final = `ü${final.slice(1)}`;
  return `${initialPt}${FINALS[final] ?? final}`;
}

function buildReading(hanzi: string) {
  const syllables = pinyin(hanzi, {
    type: 'all', toneType: 'symbol', nonZh: 'removed', toneSandhi: true, segmentit: 2,
  }).filter((item) => item.isZh);
  const pinyinTokens = syllables.map((item) => item.pinyin);
  let index = -1;

  Array.from(hanzi).forEach((character) => {
    if (HANZI_PATTERN.test(character)) {
      index += 1;
      return;
    }
    if (PUNCTUATION[character] && index >= 0 && pinyinTokens[index]) {
      pinyinTokens[index] += PUNCTUATION[character];
    }
  });

  return {
    pinyin: pinyinTokens.join(' '),
    portuguese: syllables
      .map((item) => `${portugueseApproximation(item.pinyin)} (${item.num ?? toneNumber(item.pinyin)})`)
      .join(' '),
  };
}

const RealMandarinDialogues = forwardRef<RealMandarinDialoguesHandle, Props>(function RealMandarinDialogues(
  { onBeforePlay },
  forwardedRef,
) {
  const lines = useMemo(() => REAL_DIALOGUE_LINES.map((line) => ({ ...line, ...buildReading(line.hanzi) })), []);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const runId = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const timer = useRef<number | null>(null);
  const gapRef = useRef(1);
  const stopRef = useRef<() => void>(() => undefined);
  const [phase, setPhase] = useState<Phase>('idle');
  const [mode, setMode] = useState<PlayMode | null>(null);
  const [activeLine, setActiveLine] = useState<RealDialogueLine | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [gapDraft, setGapDraft] = useState(storedGap);
  const [savedGap, setSavedGap] = useState(storedGap);
  const [message, setMessage] = useState('');

  function clearScheduledWork() {
    if (animationFrame.current !== null) {
      window.cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function stop() {
    runId.current += 1;
    clearScheduledWork();
    audioRef.current?.pause();
    setPhase('idle');
    setMode(null);
    setActiveLine(null);
    setProgress({ current: 0, total: 0 });
  }

  stopRef.current = stop;

  useEffect(() => {
    if (typeof forwardedRef === 'function') forwardedRef({ stop: () => stopRef.current() });
    else if (forwardedRef) forwardedRef.current = { stop: () => stopRef.current() };
    return () => {
      if (typeof forwardedRef === 'function') forwardedRef(null);
      else if (forwardedRef) forwardedRef.current = null;
    };
  }, [forwardedRef]);

  useEffect(() => {
    gapRef.current = savedGap;
  }, [savedGap]);

  useEffect(() => () => stopRef.current(), []);

  function scheduleNext(activeRun: number, queue: typeof lines, currentIndex: number, shouldLoop: boolean) {
    if (runId.current !== activeRun) return;
    setPhase('pause');
    timer.current = window.setTimeout(() => {
      if (runId.current !== activeRun) return;
      const nextIndex = currentIndex + 1;
      if (nextIndex < queue.length) {
        void playLine(activeRun, queue, nextIndex, shouldLoop);
      } else if (shouldLoop) {
        void playLine(activeRun, queue, 0, shouldLoop);
      } else {
        stop();
      }
    }, gapRef.current * 1000);
  }

  async function playLine(activeRun: number, queue: typeof lines, currentIndex: number, shouldLoop: boolean) {
    const audio = audioRef.current;
    if (!audio || runId.current !== activeRun) return;
    const line = queue[currentIndex];
    clearScheduledWork();
    audio.pause();
    audio.currentTime = line.start;
    setActiveLine(line);
    setProgress({ current: currentIndex + 1, total: queue.length });
    setPhase('mandarin');
    setMessage('');

    try {
      await audio.play();
    } catch {
      if (runId.current !== activeRun) return;
      setMessage('O navegador bloqueou o áudio. Toque novamente em reproduzir.');
      stop();
      return;
    }

    const watchEnd = () => {
      if (runId.current !== activeRun) return;
      if (audio.currentTime >= line.end || audio.ended) {
        audio.pause();
        animationFrame.current = null;
        scheduleNext(activeRun, queue, currentIndex, shouldLoop);
        return;
      }
      animationFrame.current = window.requestAnimationFrame(watchEnd);
    };
    animationFrame.current = window.requestAnimationFrame(watchEnd);
  }

  function start(queue: typeof lines, nextMode: PlayMode) {
    if (!queue.length) return;
    stop();
    onBeforePlay();
    const activeRun = runId.current + 1;
    runId.current = activeRun;
    setMode(nextMode);
    setProgress({ current: 1, total: queue.length });
    void playLine(activeRun, queue, 0, nextMode.endsWith('loop'));
  }

  function saveGap() {
    setSavedGap(gapDraft);
    gapRef.current = gapDraft;
    window.sessionStorage.setItem(STORAGE_KEY, String(gapDraft));
    setMessage(`Intervalo atualizado para ${gapDraft} ${gapDraft === 1 ? 'segundo' : 'segundos'}.`);
  }

  const activeReading = activeLine ? lines.find((line) => line.id === activeLine.id) : null;
  const playing = phase !== 'idle';

  return (
    <section className={styles.section} id="dialogos-mandarim-real" aria-labelledby="real-dialogue-title">
      <audio ref={audioRef} src={REAL_DIALOGUE_AUDIO} preload="metadata" />
      <div className={styles.intro}>
        <div>
          <span className={styles.eyebrow}>Escuta com voz real</span>
          <h2 id="real-dialogue-title">Diálogos em mandarim real</h2>
          <p>Uma semana na vida da senhorita Wang, dividida em 47 frases. A reprodução usa somente o áudio original em mandarim; o significado em português continua disponível para leitura.</p>
        </div>
        <div className={styles.summary}>
          <strong>一周的生活</strong>
          <span>Yì zhōu de shēnghuó</span>
          <small>Uma semana de vida</small>
        </div>
      </div>

      <div className={styles.player} aria-live="polite">
        <div className={styles.playerTop}>
          <div>
            <span>{phase === 'mandarin' ? 'Áudio original em mandarim' : phase === 'pause' ? 'Intervalo entre frases' : 'Pronto para começar'}</span>
            <strong>{progress.total ? `${progress.current}/${progress.total}` : '47 frases'}</strong>
          </div>
          <div className={styles.phaseDots} aria-label="Idioma do áudio">
            <i className={phase === 'mandarin' ? styles.currentPhase : ''}>中</i><span>Somente mandarim</span>
          </div>
        </div>
        <div className={styles.stage}>
          <strong lang="zh-CN">{activeLine?.hanzi ?? '先听，再理解。'}</strong>
          <span>{activeReading?.pinyin ?? 'Ouça primeiro, entenda depois.'}</span>
          <p>{activeLine?.translation ?? 'Acompanhe uma frase de cada vez.'}</p>
        </div>
        <div className={styles.controls}>
          <button className={styles.primary} type="button" onClick={() => start(lines, 'all-once')}>▶ Ouvir as 47 em mandarim</button>
          <button className={mode === 'all-loop' && playing ? styles.looping : ''} type="button"
            onClick={() => mode === 'all-loop' && playing ? stop() : start(lines, 'all-loop')}>
            {mode === 'all-loop' && playing ? '■ Parar loop' : '↻ Reproduzir tudo em loop'}
          </button>
          <button type="button" onClick={stop} disabled={!playing}>■ Parar</button>
        </div>
        <div className={styles.gapControl}>
          <div><span>Intervalo entre as frases</span><strong>{gapDraft}s</strong></div>
          <input type="range" min="1" max="10" step="1" value={gapDraft}
            onChange={(event) => setGapDraft(Number(event.target.value))} aria-label="Intervalo entre as frases" />
          <button type="button" onClick={saveGap}>Salvar intervalo</button>
          <small>Em uso: {savedGap}s</small>
        </div>
        {message && <p className={styles.message} role="status">{message}</p>}
      </div>

      <ol className={styles.lines}>
        {lines.map((line) => {
          const isActive = activeLine?.id === line.id && playing;
          const isLooping = isActive && mode === 'single-loop';
          return (
            <li className={isActive ? styles.activeLine : ''} key={line.id}>
              <span className={styles.number}>{String(line.id).padStart(2, '0')}</span>
              <div className={styles.lineText}>
                <strong lang="zh-CN">{line.hanzi}</strong>
                <b>{line.pinyin}</b>
                <span>{line.portuguese}</span>
                <p>{line.translation}</p>
              </div>
              <div className={styles.lineActions}>
                <button type="button" onClick={() => isActive && mode === 'single-once' ? stop() : start([line], 'single-once')}>
                  {isActive && mode === 'single-once' ? '■ Parar' : '▶ Ouvir frase'}
                </button>
                <button type="button" className={isLooping ? styles.lineLooping : ''}
                  onClick={() => isLooping ? stop() : start([line], 'single-loop')} aria-pressed={isLooping}>
                  {isLooping ? '■ Parar loop' : '↻ Loop'}
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
});

export default RealMandarinDialogues;
