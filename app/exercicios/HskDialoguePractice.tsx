'use client';

import { pinyin } from 'pinyin-pro';
import { useEffect, useMemo, useRef, useState } from 'react';
import PracticeRecorder from '../components/PracticeRecorder';
import styles from './page.module.css';

type Speed = 'natural' | 'slow';
type PlayerStatus = 'idle' | 'playing' | 'paused';

type DialogueSyllable = {
  hanzi: string;
  pinyin: string;
};

type DialogueLine = {
  id: string;
  speaker: string;
  speakerHanzi: string;
  speakerKey: 'yixue' | 'yifei';
  hanzi: string;
  translation: string;
  syllables: DialogueSyllable[];
  pinyinTokens: Array<{ text: string; syllableIndex: number }>;
  pinyinText: string;
  positions: Array<{ start: number; end: number }>;
  characters: Array<{ character: string; syllableIndex: number | null }>;
};

type Dialogue = {
  id: string;
  tab: string;
  title: string;
  subtitle: string;
  lines: DialogueLine[];
};

type DialogueLineSource = Omit<DialogueLine, 'syllables' | 'pinyinTokens' | 'pinyinText' | 'positions' | 'characters'>;

const HANZI_PATTERN = /[\u3400-\u9fff]/u;
const LINE_GAP_MS = 800;
const PINYIN_PUNCTUATION: Record<string, string> = {
  '，': ',', '。': '.', '！': '!', '？': '?', '；': ';', '：': ':', '、': ',',
};

function prepareLine(line: DialogueLineSource): DialogueLine {
  const syllables = pinyin(line.hanzi, {
    type: 'all', toneType: 'symbol', nonZh: 'removed', toneSandhi: true, segmentit: 2,
  })
    .filter((item) => item.isZh)
    .map((item) => ({ hanzi: item.origin, pinyin: item.pinyin }));

  const positions: Array<{ start: number; end: number }> = [];
  for (let offset = 0; offset < line.hanzi.length;) {
    const codePoint = line.hanzi.codePointAt(offset);
    if (codePoint === undefined) break;
    const character = String.fromCodePoint(codePoint);
    if (HANZI_PATTERN.test(character)) positions.push({ start: offset, end: offset + character.length });
    offset += character.length;
  }

  let syllableIndex = 0;
  const characters = Array.from(line.hanzi).map((character) => {
    const index = HANZI_PATTERN.test(character) && syllableIndex < syllables.length ? syllableIndex : null;
    if (index !== null) syllableIndex += 1;
    return { character, syllableIndex: index };
  });

  const pinyinTokens = syllables.map((syllable, index) => ({ text: syllable.pinyin, syllableIndex: index }));
  let lastSyllableIndex = -1;
  Array.from(line.hanzi).forEach((character) => {
    if (HANZI_PATTERN.test(character)) {
      lastSyllableIndex += 1;
      return;
    }
    const punctuation = PINYIN_PUNCTUATION[character];
    if (punctuation && lastSyllableIndex >= 0 && pinyinTokens[lastSyllableIndex]) {
      pinyinTokens[lastSyllableIndex].text += punctuation;
    }
  });
  const pinyinText = pinyinTokens.map((token) => token.text).join(' ');

  return {
    ...line,
    syllables,
    pinyinTokens,
    pinyinText,
    positions: positions.slice(0, syllables.length),
    characters,
  };
}

const DIALOGUES: Dialogue[] = [
  {
    id: 'dialogue-3',
    tab: 'Diálogo 3',
    title: 'Texto 3 (continuação)',
    subtitle: 'Uma conversa entre Wang Yixue e Wang Yifei.',
    lines: ([
      {
        id: 'dialogue-3-line-1', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue',
        hanzi: '喂，一飞！', translation: 'Oi/Alô, Yifei!',
      },
      {
        id: 'dialogue-3-line-2', speaker: 'Wang Yifei', speakerHanzi: '王一飞', speakerKey: 'yifei',
        hanzi: '姐姐！', translation: 'Irmã!',
      },
      {
        id: 'dialogue-3-line-3', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue',
        hanzi: '你工作还忙吗？', translation: 'Você ainda está ocupada com o trabalho?',
      },
      {
        id: 'dialogue-3-line-4', speaker: 'Wang Yifei', speakerHanzi: '王一飞', speakerKey: 'yifei',
        hanzi: '对，还很忙。你也很忙吗？', translation: 'Sim, ainda estou muito ocupada. Você também está muito ocupada?',
      },
      {
        id: 'dialogue-3-line-5', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue',
        hanzi: '我不太忙。我们很想你。', translation: 'Eu não estou muito ocupada. Sentimos muito sua falta.',
      },
      {
        id: 'dialogue-3-line-6', speaker: 'Wang Yifei', speakerHanzi: '王一飞', speakerKey: 'yifei',
        hanzi: '我也想你们。', translation: 'Eu também sinto falta de vocês.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
];

type HskDialoguePracticeProps = {
  sessionId: string;
  onBeforePlay?: () => void;
};

export default function HskDialoguePractice({ sessionId, onBeforePlay }: HskDialoguePracticeProps) {
  const [selectedDialogueId, setSelectedDialogueId] = useState(DIALOGUES[0].id);
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [speed, setSpeed] = useState<Speed>('slow');
  const [repeat, setRepeat] = useState(false);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [activeRange, setActiveRange] = useState<{ start: number; end: number } | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [message, setMessage] = useState('');
  const [recordingLineId, setRecordingLineId] = useState<string | null>(null);
  const [silentGuide, setSilentGuide] = useState(false);

  const runId = useRef(0);
  const queue = useRef<DialogueLine[]>([]);
  const queueIndex = useRef(0);
  const paused = useRef(false);
  const repeatRef = useRef(false);
  const speedRef = useRef<Speed>('slow');
  const silentRef = useRef(false);
  const timer = useRef<number | null>(null);
  const syncTimer = useRef<number | null>(null);
  const boundarySeen = useRef(false);

  const selectedDialogue = useMemo(
    () => DIALOGUES.find((dialogue) => dialogue.id === selectedDialogueId) ?? DIALOGUES[0],
    [selectedDialogueId],
  );

  function clearTimers() {
    if (timer.current !== null) window.clearTimeout(timer.current);
    if (syncTimer.current !== null) window.clearInterval(syncTimer.current);
    timer.current = null;
    syncTimer.current = null;
  }

  function resetPlayer() {
    setStatus('idle');
    setActiveLineId(null);
    setActiveRange(null);
    setProgress({ current: 0, total: 0 });
    setSilentGuide(false);
    silentRef.current = false;
  }

  function stopPlayback(clearMessage = true) {
    runId.current += 1;
    paused.current = false;
    clearTimers();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (clearMessage) setMessage('');
    resetPlayer();
  }

  useEffect(() => () => {
    runId.current += 1;
    clearTimers();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  function rangeForBoundary(line: DialogueLine, charIndex: number, charLength: number) {
    const boundaryEnd = charIndex + Math.max(charLength, 1);
    const matches = line.positions
      .map((position, index) => ({ position, index }))
      .filter(({ position }) => position.start < boundaryEnd && position.end > charIndex)
      .map(({ index }) => index);
    if (matches.length) return { start: matches[0], end: matches[matches.length - 1] };
    const nearest = line.positions.findIndex((position) => position.start >= charIndex);
    const index = nearest >= 0 ? nearest : line.positions.length - 1;
    return index >= 0 ? { start: index, end: index } : null;
  }

  function beginFallbackSync(line: DialogueLine, activeRun: number) {
    if (!line.syllables.length) return;
    let index = 0;
    setActiveRange({ start: 0, end: 0 });
    syncTimer.current = window.setInterval(() => {
      if (runId.current !== activeRun || boundarySeen.current) {
        if (syncTimer.current !== null) window.clearInterval(syncTimer.current);
        syncTimer.current = null;
        return;
      }
      index = Math.min(index + 1, line.syllables.length - 1);
      setActiveRange({ start: index, end: index });
    }, speedRef.current === 'slow' ? 560 : 350);
  }

  function finishQueue(activeRun: number) {
    if (runId.current !== activeRun) return;
    if (repeatRef.current && queue.current.length && !silentRef.current) {
      queueIndex.current = 0;
      timer.current = window.setTimeout(() => playNext(activeRun), LINE_GAP_MS);
      return;
    }
    resetPlayer();
  }

  function playNext(activeRun: number) {
    if (runId.current !== activeRun || paused.current) return;
    if (queueIndex.current >= queue.current.length) {
      finishQueue(activeRun);
      return;
    }

    const line = queue.current[queueIndex.current];
    setActiveLineId(line.id);
    setActiveRange(null);
    setProgress({ current: queueIndex.current + 1, total: queue.current.length });
    boundarySeen.current = false;

    const utterance = new SpeechSynthesisUtterance(line.hanzi);
    const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith('zh'));
    const voiceIndex = line.speakerKey === 'yifei' ? 1 : 0;
    const mandarinVoice = voices[voiceIndex % Math.max(voices.length, 1)];
    utterance.lang = mandarinVoice?.lang ?? 'zh-CN';
    utterance.rate = speedRef.current === 'slow' ? 0.55 : 0.88;
    utterance.pitch = line.speakerKey === 'yifei' ? 1.04 : 0.96;
    utterance.volume = silentRef.current ? 0 : 1;
    if (mandarinVoice) utterance.voice = mandarinVoice;

    utterance.onstart = () => {
      if (runId.current !== activeRun) return;
      setStatus('playing');
      setMessage('');
      beginFallbackSync(line, activeRun);
    };
    utterance.onboundary = (event) => {
      if (runId.current !== activeRun || event.name === 'sentence') return;
      const range = rangeForBoundary(line, event.charIndex, event.charLength ?? 0);
      if (!range) return;
      boundarySeen.current = true;
      if (syncTimer.current !== null) window.clearInterval(syncTimer.current);
      syncTimer.current = null;
      setActiveRange(range);
    };
    utterance.onend = () => {
      if (runId.current !== activeRun) return;
      if (syncTimer.current !== null) window.clearInterval(syncTimer.current);
      syncTimer.current = null;
      setActiveRange(null);
      queueIndex.current += 1;
      timer.current = window.setTimeout(() => {
        timer.current = null;
        playNext(activeRun);
      }, silentRef.current ? 0 : LINE_GAP_MS);
    };
    utterance.onerror = () => {
      if (runId.current !== activeRun) return;
      setMessage('Não foi possível reproduzir a voz em mandarim neste dispositivo.');
      stopPlayback(false);
    };
    window.speechSynthesis.speak(utterance);
  }

  function startQueue(lines: DialogueLine[], silent = false) {
    if (!lines.length || !('speechSynthesis' in window)) {
      setMessage('A voz em mandarim não está disponível neste navegador.');
      return;
    }
    onBeforePlay?.();
    stopPlayback();
    queue.current = lines;
    queueIndex.current = 0;
    silentRef.current = silent;
    setSilentGuide(silent);
    const activeRun = runId.current + 1;
    runId.current = activeRun;
    setStatus('playing');
    playNext(activeRun);
  }

  function togglePause() {
    if (status === 'idle' || silentGuide) return;
    if (status === 'playing') {
      paused.current = true;
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = null;
      window.speechSynthesis.pause();
      setStatus('paused');
      return;
    }
    paused.current = false;
    window.speechSynthesis.resume();
    setStatus('playing');
    if (!window.speechSynthesis.speaking) playNext(runId.current);
  }

  function changeSpeed(nextSpeed: Speed) {
    speedRef.current = nextSpeed;
    setSpeed(nextSpeed);
  }

  function changeDialogue(dialogueId: string) {
    if (dialogueId === selectedDialogueId) return;
    stopPlayback();
    setSelectedDialogueId(dialogueId);
  }

  function lineIsActive(lineId: string, syllableIndex: number) {
    return activeLineId === lineId && Boolean(activeRange
      && syllableIndex >= activeRange.start
      && syllableIndex <= activeRange.end);
  }

  return (
    <section className={styles.bookExercises} aria-labelledby="hsk-book-title">
      <div className={styles.bookHeading}>
        <div>
          <span>Prática guiada</span>
          <h2 id="hsk-book-title">Exercícios do livro HSK 1</h2>
          <p>Escolha um diálogo, escute cada fala e grave sua própria dublagem para comparar.</p>
        </div>
        <span className={styles.dialogueCount}>{DIALOGUES.length} diálogo</span>
      </div>

      <div className={styles.dialogueTabs} role="tablist" aria-label="Diálogos do livro HSK 1">
        {DIALOGUES.map((dialogue) => (
          <button type="button" role="tab" key={dialogue.id}
            aria-selected={selectedDialogueId === dialogue.id}
            className={selectedDialogueId === dialogue.id ? styles.activeDialogueTab : ''}
            onClick={() => changeDialogue(dialogue.id)}>
            {dialogue.tab}
          </button>
        ))}
      </div>

      <div className={styles.dialoguePanel} role="tabpanel">
        <div className={styles.dialoguePanelHead}>
          <div>
            <span>课文 3</span>
            <h3>{selectedDialogue.title}</h3>
            <p>{selectedDialogue.subtitle}</p>
          </div>
          <span>{selectedDialogue.lines.length} falas</span>
        </div>

        <div className={styles.dialoguePlayer}>
          <div className={styles.dialoguePlayerStatus}>
            <span>{silentGuide ? 'Acompanhando sua gravação' : status === 'playing' ? 'Reproduzindo diálogo' : status === 'paused' ? 'Diálogo pausado' : 'Pronto para praticar'}</span>
            {progress.total > 0 && <strong>{progress.current}/{progress.total}</strong>}
          </div>
          <div className={styles.dialogueControls}>
            <button className={styles.playDialogueButton} type="button"
              onClick={() => startQueue(selectedDialogue.lines)} disabled={recordingLineId !== null}>
              ▶ Ouvir diálogo completo
            </button>
            <button type="button" onClick={togglePause}
              disabled={status === 'idle' || silentGuide || recordingLineId !== null}>
              {status === 'paused' ? 'Continuar' : 'Pausar'}
            </button>
            <button type="button" onClick={() => stopPlayback()}
              disabled={status === 'idle' || recordingLineId !== null}>Parar</button>
            <div className={styles.dialogueSpeed} aria-label="Velocidade do diálogo">
              <button type="button" className={speed === 'slow' ? styles.activeDialogueOption : ''}
                onClick={() => changeSpeed('slow')} aria-pressed={speed === 'slow'}>Devagar</button>
              <button type="button" className={speed === 'natural' ? styles.activeDialogueOption : ''}
                onClick={() => changeSpeed('natural')} aria-pressed={speed === 'natural'}>Natural</button>
            </div>
            <button className={`${styles.repeatDialogue} ${repeat ? styles.activeDialogueOption : ''}`}
              type="button" onClick={() => {
                const next = !repeat;
                repeatRef.current = next;
                setRepeat(next);
              }} aria-pressed={repeat}>↻ Repetir</button>
          </div>
          {message && <p className={styles.dialogueMessage} role="status">{message}</p>}
        </div>

        <ol className={styles.dialogueLines}>
          {selectedDialogue.lines.map((line, index) => {
            const isActive = activeLineId === line.id && status !== 'idle';
            return (
              <li className={isActive ? styles.activeDialogueLine : ''} key={line.id}>
                <div className={styles.dialogueLineHead}>
                  <div>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong><b lang="zh-CN">{line.speakerHanzi}</b> · {line.speaker}</strong>
                  </div>
                  <button type="button" onClick={() => isActive ? stopPlayback() : startQueue([line])}
                    disabled={recordingLineId !== null}
                    aria-label={`Ouvir fala ${index + 1}: ${line.hanzi}`}>
                    {isActive && !silentGuide ? '■ Parar' : '▶ Ouvir fala'}
                  </button>
                </div>

                <p className={styles.dialogueHanzi} lang="zh-CN">
                  {line.characters.map((item, characterIndex) => (
                    <span key={`${item.character}-${characterIndex}`}
                      className={item.syllableIndex !== null && lineIsActive(line.id, item.syllableIndex) ? styles.activeDialogueToken : ''}>
                      {item.character}
                    </span>
                  ))}
                </p>
                <p className={styles.dialoguePinyin}>
                  {line.pinyinTokens.map((token) => (
                    <span key={`${line.id}-pinyin-${token.syllableIndex}`}
                      className={lineIsActive(line.id, token.syllableIndex) ? styles.activeDialogueToken : ''}>
                      {token.text}
                    </span>
                  ))}
                </p>
                <p className={styles.dialogueTranslation}>{line.translation}</p>

                <div className={styles.dialogueRecorder}>
                  <PracticeRecorder
                    phrase={line.hanzi}
                    pinyin={line.pinyinText}
                    sessionId={sessionId}
                    storageScope={`hsk1:${selectedDialogue.id}:${line.id}`}
                    onBeforeRecord={() => {
                      stopPlayback();
                      onBeforePlay?.();
                    }}
                    onRecordingStart={() => {
                      setRecordingLineId(line.id);
                      startQueue([line], true);
                    }}
                    onRecordingStop={() => {
                      setRecordingLineId(null);
                      stopPlayback();
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
