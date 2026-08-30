'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useClientSession } from '../components/ClientSession';
import HskDialoguePractice from './HskDialoguePractice';
import styles from './page.module.css';

type Challenge = {
  id: string;
  hanzi: string;
  pinyin: string;
  tone: 1 | 2 | 3 | 4;
  meaning: string;
};

type Phase = 'intro' | 'question' | 'answered' | 'finished';
type Speed = 'natural' | 'slow';

const ROUND_SIZE = 10;

const CHALLENGES: Challenge[] = [
  { id: 'ma1', hanzi: '妈', pinyin: 'mā', tone: 1, meaning: 'mãe' },
  { id: 'ma2', hanzi: '麻', pinyin: 'má', tone: 2, meaning: 'cânhamo' },
  { id: 'ma3', hanzi: '马', pinyin: 'mǎ', tone: 3, meaning: 'cavalo' },
  { id: 'ma4', hanzi: '骂', pinyin: 'mà', tone: 4, meaning: 'xingar' },
  { id: 'ba1', hanzi: '八', pinyin: 'bā', tone: 1, meaning: 'oito' },
  { id: 'ba2', hanzi: '拔', pinyin: 'bá', tone: 2, meaning: 'puxar' },
  { id: 'ba3', hanzi: '把', pinyin: 'bǎ', tone: 3, meaning: 'segurar' },
  { id: 'ba4', hanzi: '爸', pinyin: 'bà', tone: 4, meaning: 'pai' },
  { id: 'yi1', hanzi: '一', pinyin: 'yī', tone: 1, meaning: 'um' },
  { id: 'yi2', hanzi: '姨', pinyin: 'yí', tone: 2, meaning: 'tia' },
  { id: 'yi3', hanzi: '椅', pinyin: 'yǐ', tone: 3, meaning: 'cadeira' },
  { id: 'yi4', hanzi: '易', pinyin: 'yì', tone: 4, meaning: 'fácil' },
  { id: 'wu1', hanzi: '屋', pinyin: 'wū', tone: 1, meaning: 'casa' },
  { id: 'wu2', hanzi: '无', pinyin: 'wú', tone: 2, meaning: 'sem' },
  { id: 'wu3', hanzi: '五', pinyin: 'wǔ', tone: 3, meaning: 'cinco' },
  { id: 'wu4', hanzi: '物', pinyin: 'wù', tone: 4, meaning: 'coisa' },
  { id: 'shi1', hanzi: '师', pinyin: 'shī', tone: 1, meaning: 'professor' },
  { id: 'shi2', hanzi: '十', pinyin: 'shí', tone: 2, meaning: 'dez' },
  { id: 'shi3', hanzi: '史', pinyin: 'shǐ', tone: 3, meaning: 'história' },
  { id: 'shi4', hanzi: '是', pinyin: 'shì', tone: 4, meaning: 'ser / estar' },
  { id: 'tang1', hanzi: '汤', pinyin: 'tāng', tone: 1, meaning: 'sopa' },
  { id: 'tang2', hanzi: '糖', pinyin: 'táng', tone: 2, meaning: 'açúcar' },
  { id: 'tang3', hanzi: '躺', pinyin: 'tǎng', tone: 3, meaning: 'deitar-se' },
  { id: 'tang4', hanzi: '烫', pinyin: 'tàng', tone: 4, meaning: 'muito quente' },
];

const TONES = [
  { number: 1 as const, mark: '—', name: 'alto e estável', example: 'mā' },
  { number: 2 as const, mark: '↗', name: 'sobe', example: 'má' },
  { number: 3 as const, mark: '∨', name: 'desce e sobe', example: 'mǎ' },
  { number: 4 as const, mark: '↘', name: 'cai com força', example: 'mà' },
];

function shuffledChallenges() {
  return [...CHALLENGES]
    .map((challenge) => ({ challenge, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .slice(0, ROUND_SIZE)
    .map(({ challenge }) => challenge);
}

export default function ExercisesPage() {
  const { sessionId, shortId } = useClientSession();
  const [phase, setPhase] = useState<Phase>('intro');
  const [deck, setDeck] = useState<Challenge[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [speed, setSpeed] = useState<Speed>('slow');
  const [speaking, setSpeaking] = useState(false);
  const [message, setMessage] = useState('');

  const challenge = deck[roundIndex];
  const progress = phase === 'intro' ? 0 : Math.min(((roundIndex + 1) / ROUND_SIZE) * 100, 100);
  const correct = phase === 'answered' && selectedTone === challenge?.tone;
  const toneGuide = useMemo(() => TONES.find((tone) => tone.number === challenge?.tone), [challenge]);

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  function speak(item = challenge) {
    if (!item || !('speechSynthesis' in window)) {
      setMessage('A voz em mandarim não está disponível neste navegador.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.hanzi);
    const voices = window.speechSynthesis.getVoices();
    const mandarinVoice = voices.find((voice) => voice.lang.toLowerCase() === 'zh-cn')
      ?? voices.find((voice) => voice.lang.toLowerCase() === 'zh-tw')
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));

    utterance.lang = mandarinVoice?.lang ?? 'zh-CN';
    utterance.rate = speed === 'slow' ? 0.5 : 0.82;
    utterance.pitch = 1;
    if (mandarinVoice) utterance.voice = mandarinVoice;
    utterance.onstart = () => {
      setSpeaking(true);
      setMessage('');
    };
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      setMessage('Não consegui reproduzir este som. Tente novamente.');
    };
    window.speechSynthesis.speak(utterance);
  }

  function startExercise() {
    const nextDeck = shuffledChallenges();
    setDeck(nextDeck);
    setRoundIndex(0);
    setSelectedTone(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setPhase('question');
    speak(nextDeck[0]);
  }

  function chooseTone(tone: 1 | 2 | 3 | 4) {
    if (phase !== 'question' || !challenge) return;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setSelectedTone(tone);
    if (tone === challenge.tone) {
      const nextStreak = streak + 1;
      setScore((current) => current + 1);
      setStreak(nextStreak);
      setBestStreak((current) => Math.max(current, nextStreak));
    } else {
      setStreak(0);
    }
    setPhase('answered');
  }

  function nextQuestion() {
    if (roundIndex >= ROUND_SIZE - 1) {
      setPhase('finished');
      return;
    }
    const nextIndex = roundIndex + 1;
    setRoundIndex(nextIndex);
    setSelectedTone(null);
    setPhase('question');
    speak(deck[nextIndex]);
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="Tons de Mandarim, início">
          <span className={styles.brandMark} aria-hidden="true">声</span>
          <span>Tons de Mandarim</span>
        </Link>
        <nav className={styles.nav} aria-label="Navegação principal">
          <span className="session-badge" title="Esta sessão não compartilha dados com outros visitantes">
            <i aria-hidden="true" />
            <span>Sessão {shortId || 'privada'}</span>
          </span>
          <Link href="/">Frases</Link>
          <Link href="/letras-e-silabas">Letras e sílabas</Link>
          <Link className={styles.activeNav} href="/exercicios">Exercícios</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Treino de ouvido</span>
          <h1>Escute o caractere.<br /><em>Descubra o tom.</em></h1>
          <p>Você terá dez desafios. Ouça a pronúncia em mandarim e escolha o contorno tonal que reconheceu.</p>
          <div className={styles.heroStats}>
            <span><strong>24</strong> caracteres</span>
            <span><strong>4</strong> tons</span>
            <span><strong>10</strong> rodadas</span>
          </div>
        </div>

        <div className={styles.scoreCard}>
          <span>Seu desempenho</span>
          <div><strong>{score}</strong><small>acertos</small></div>
          <dl>
            <div><dt>Sequência</dt><dd>{streak}</dd></div>
            <div><dt>Melhor</dt><dd>{bestStreak}</dd></div>
            <div><dt>Rodada</dt><dd>{phase === 'intro' ? '—' : `${Math.min(roundIndex + 1, ROUND_SIZE)}/${ROUND_SIZE}`}</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.exerciseArea} aria-live="polite">
        <div className={styles.exerciseTop}>
          <div>
            <span>{phase === 'intro' ? 'Pronto para começar' : phase === 'finished' ? 'Treino concluído' : `Desafio ${roundIndex + 1} de ${ROUND_SIZE}`}</span>
            <div className={styles.progressTrack} aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
          </div>
          <div className={styles.speedControl} aria-label="Velocidade do áudio">
            <button type="button" className={speed === 'slow' ? styles.selectedSpeed : ''} onClick={() => setSpeed('slow')} aria-pressed={speed === 'slow'}>Devagar</button>
            <button type="button" className={speed === 'natural' ? styles.selectedSpeed : ''} onClick={() => setSpeed('natural')} aria-pressed={speed === 'natural'}>Natural</button>
          </div>
        </div>

        {phase === 'intro' && (
          <div className={styles.introState}>
            <span className={styles.listeningIcon} aria-hidden="true">耳</span>
            <h2>Você consegue reconhecer os quatro tons?</h2>
            <p>O pinyin fica escondido até você responder. Você pode repetir cada áudio quantas vezes precisar.</p>
            <button type="button" onClick={startExercise}>▶ Começar exercício</button>
          </div>
        )}

        {(phase === 'question' || phase === 'answered') && challenge && (
          <div className={styles.challengeLayout}>
            <div className={styles.listeningStage}>
              <span className={styles.stageLabel}>{phase === 'question' ? 'Qual tom você ouviu?' : 'Resposta'}</span>
              <strong className={styles.hanzi}>{challenge.hanzi}</strong>
              <button className={`${styles.listenButton} ${speaking ? styles.isSpeaking : ''}`} type="button" onClick={() => speak()}>
                <i aria-hidden="true">{speaking ? '◼' : '▶'}</i>
                {speaking ? 'Reproduzindo' : 'Ouvir novamente'}
              </button>
              {phase === 'question' ? (
                <p>O pinyin será revelado depois da sua escolha.</p>
              ) : (
                <div className={`${styles.answerReveal} ${correct ? styles.correctReveal : styles.wrongReveal}`}>
                  <span>{correct ? '✓ Você acertou' : 'A resposta correta é'}</span>
                  <strong>{challenge.pinyin}</strong>
                  <small>{challenge.tone}º tom · {toneGuide?.name} · “{challenge.meaning}”</small>
                </div>
              )}
            </div>

            <div className={styles.toneChoices}>
              {TONES.map((tone) => {
                const chosen = selectedTone === tone.number;
                const isAnswer = phase === 'answered' && challenge.tone === tone.number;
                return (
                  <button
                    type="button"
                    key={tone.number}
                    className={`${chosen ? styles.chosenTone : ''} ${isAnswer ? styles.answerTone : ''}`}
                    onClick={() => chooseTone(tone.number)}
                    disabled={phase === 'answered'}
                  >
                    <span>{tone.number}º tom</span>
                    <strong>{tone.mark}</strong>
                    <small>{tone.name}</small>
                    <i>{tone.example}</i>
                  </button>
                );
              })}
              {phase === 'answered' && (
                <button className={styles.nextButton} type="button" onClick={nextQuestion}>
                  {roundIndex >= ROUND_SIZE - 1 ? 'Ver resultado' : 'Próximo desafio'} →
                </button>
              )}
            </div>
          </div>
        )}

        {phase === 'finished' && (
          <div className={styles.finishedState}>
            <span>训练完成 · treino concluído</span>
            <strong>{score}<small>/ {ROUND_SIZE}</small></strong>
            <h2>{score >= 8 ? 'Seu ouvido está ficando afiado.' : score >= 5 ? 'Bom começo — continue treinando.' : 'Os tons exigem repetição. Vamos de novo?'}</h2>
            <p>Melhor sequência: {bestStreak} {bestStreak === 1 ? 'acerto' : 'acertos'} consecutivos.</p>
            <button type="button" onClick={startExercise}>↻ Fazer outra rodada</button>
          </div>
        )}

        {message && <p className={styles.audioMessage} role="status">{message}</p>}
      </section>

      <section className={styles.toneLegend}>
        <div><span>Guia rápido</span><h2>O desenho da voz.</h2></div>
        <div className={styles.legendGrid}>
          {TONES.map((tone) => (
            <article key={tone.number}>
              <span>{tone.number}</span><strong>{tone.mark}</strong><p>{tone.name}</p><small>{tone.example}</small>
            </article>
          ))}
        </div>
      </section>

      <HskDialoguePractice sessionId={sessionId} onBeforePlay={() => {
        setSpeaking(false);
        setMessage('');
      }} />

      <footer className={styles.footer}>
        <span className={styles.brandMark} aria-hidden="true">声</span>
        <p>Treine com fones de ouvido e compare o movimento da voz, não apenas a altura final.</p>
        <Link href="/letras-e-silabas">Revisar letras e sílabas →</Link>
      </footer>
    </main>
  );
}
