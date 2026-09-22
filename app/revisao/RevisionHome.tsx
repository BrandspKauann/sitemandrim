'use client';

import { pinyin } from 'pinyin-pro';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClientSession } from '../components/ClientSession';
import PracticeRecorder from '../components/PracticeRecorder';
import RevisionHeader from './RevisionHeader';
import {
  HANZI_CORRECTIONS,
  HOMEWORK,
  KEY_PHRASES,
  LESSON_TOPICS,
  LISTENING_EXERCISES,
  NUMBER_ROWS,
  PINYIN_NOTES,
  VOCABULARY_GROUPS,
  WRITING_EXERCISES,
  type LessonPhrase,
} from './aula1Data';
import {
  AULA2_HANZI_CORRECTIONS,
  AULA2_HOMEWORK,
  AULA2_KEY_PHRASES,
  AULA2_LESSON_TOPICS,
  AULA2_LISTENING_EXERCISES,
  AULA2_NUMBER_ROWS,
  AULA2_PINYIN_NOTES,
  AULA2_VOCABULARY_GROUPS,
  AULA2_WRITING_EXERCISES,
} from './aula2Data';
import {
  AULA3_HANZI_CORRECTIONS,
  AULA3_HOMEWORK,
  AULA3_KEY_PHRASES,
  AULA3_LESSON_TOPICS,
  AULA3_LISTENING_EXERCISES,
  AULA3_NUMBER_ROWS,
  AULA3_PINYIN_NOTES,
  AULA3_VOCABULARY_GROUPS,
  AULA3_WRITING_EXERCISES,
} from './aula3Data';
import styles from './page.module.css';

type StudyMode = 'resumo' | 'escrever' | 'falar' | 'ouvir';
type ExerciseStatus = 'idle' | 'correct' | 'incorrect' | 'revealed';
type LessonId = 'aula1' | 'aula2' | 'aula3';

const LESSONS = {
  aula1: {
    number: '01', tabTitle: 'Aula 1', tabSubtitle: 'Quantidade e família', title: 'Família, números e perguntas',
    objective: 'Falar sobre o que alguém tem e sobre quantidades.',
    description: 'Você revisou 有/没有, números, classificadores, membros da família, 吗/呢 e perguntas com 几 ou 多少. A professora também corrigiu caracteres e pontos de pinyin.',
    topics: LESSON_TOPICS, pinyinNotes: PINYIN_NOTES, numberRows: NUMBER_ROWS, vocabularyGroups: VOCABULARY_GROUPS,
    hanziCorrections: HANZI_CORRECTIONS, keyPhrases: KEY_PHRASES, homework: HOMEWORK,
    writingExercises: WRITING_EXERCISES, listeningExercises: LISTENING_EXERCISES,
    numbersTitle: 'Unidades, dezenas e valores maiores',
    numbersDescription: 'Para quantidades, leia o número completo. Em números de quarto, telefone ou códigos, os algarismos podem ser lidos um por um.',
    numberRule: <><b>1528 como valor:</b> 一千五百二十八. <b>Como número de quarto:</b> 一、五、二、八.</>,
  },
  aula2: {
    number: '02', tabTitle: 'Aula 2', tabSubtitle: 'Datas e habilidades', title: 'Datas, rotina e o que você sabe fazer',
    objective: 'Falar sobre datas, dias da semana, descanso e habilidades.',
    description: 'A aula trabalhou 年/月/日/号, os dias da semana, perguntas com 几号 e 什么时候, o verbo 会, 一些, 也 e vocabulário de comida e rotina.',
    topics: AULA2_LESSON_TOPICS, pinyinNotes: AULA2_PINYIN_NOTES, numberRows: AULA2_NUMBER_ROWS, vocabularyGroups: AULA2_VOCABULARY_GROUPS,
    hanziCorrections: AULA2_HANZI_CORRECTIONS, keyPhrases: AULA2_KEY_PHRASES, homework: AULA2_HOMEWORK,
    writingExercises: AULA2_WRITING_EXERCISES, listeningExercises: AULA2_LISTENING_EXERCISES,
    numbersTitle: 'Datas, meses, semana e horas',
    numbersDescription: 'Leia a informação do maior para o menor: ano, mês, dia, período do dia, hora e minuto.',
    numberRule: <><b>Modelo:</b> 二〇二六年九月十九日上午九点二十一分. <b>Na conversa:</b> 日 pode ser trocado por 号.</>,
  },
  aula3: {
    number: '03', tabTitle: 'Aula 3', tabSubtitle: 'Telefone, lugares e planos', title: 'Telefone, lugares e planos',
    objective: 'Informar telefone, dizer o que quer fazer e explicar para onde e como vai.',
    description: 'A aula trabalhou 手机号, 想/不想, 哪儿/怎么, compras, refeições, meios de transporte e frases com duas ações em sequência.',
    topics: AULA3_LESSON_TOPICS, pinyinNotes: AULA3_PINYIN_NOTES, numberRows: AULA3_NUMBER_ROWS, vocabularyGroups: AULA3_VOCABULARY_GROUPS,
    hanziCorrections: AULA3_HANZI_CORRECTIONS, keyPhrases: AULA3_KEY_PHRASES, homework: AULA3_HOMEWORK,
    writingExercises: AULA3_WRITING_EXERCISES, listeningExercises: AULA3_LISTENING_EXERCISES,
    numbersTitle: 'Números de telefone',
    numbersDescription: 'Em telefone, quarto e códigos, leia os algarismos separadamente. O número 1 costuma soar yāo.',
    numberRule: <><b>Modelo:</b> 6985806 → liù jiǔ bā, wǔ bā líng liù. <b>Com 1:</b> prefira yāo em números de telefone.</>,
  },
} as const;

const MODES: Array<{ id: StudyMode; marker: string; name: string; description: string }> = [
  { id: 'resumo', marker: '课', name: 'Resumo', description: 'Toda a matéria organizada' },
  { id: 'escrever', marker: '写', name: 'Escrever', description: 'Reconstruir frases em hanzi' },
  { id: 'falar', marker: '说', name: 'Falar', description: 'Ouvir, repetir e gravar' },
  { id: 'ouvir', marker: '听', name: 'Ouvir', description: 'Entender sem ver a frase' },
];

function getPinyin(text: string) {
  return pinyin(text, {
    type: 'string',
    toneType: 'symbol',
    nonZh: 'consecutive',
    toneSandhi: true,
  })
    .replace(/\s+([，。！？；：、])/g, '$1')
    .replace(/([，。！？；：、])(?=\S)/g, '$1 ')
    .trim();
}

function getSpokenPinyin(phrase: LessonPhrase) {
  return phrase.spokenPinyin ?? getPinyin(phrase.hanzi);
}

function normalizedAnswer(value: string) {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s，。！？；：、,.!?;:'“”"‘’()（）]/g, '');
}

function MandarinButton({ phrase, slow = false, label }: { phrase: LessonPhrase; slow?: boolean; label?: string }) {
  const [playing, setPlaying] = useState(false);
  const runRef = useRef(0);

  useEffect(() => () => {
    runRef.current += 1;
  }, []);

  function play() {
    if (!('speechSynthesis' in window)) return;
    runRef.current += 1;
    const run = runRef.current;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase.hanzi);
    const voices = window.speechSynthesis.getVoices();
    const mandarinVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh-cn'))
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    utterance.lang = mandarinVoice?.lang ?? 'zh-CN';
    utterance.rate = slow ? 0.58 : 0.88;
    if (mandarinVoice) utterance.voice = mandarinVoice;
    utterance.onstart = () => {
      if (runRef.current === run) setPlaying(true);
    };
    utterance.onend = utterance.onerror = () => {
      if (runRef.current === run) setPlaying(false);
    };
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button type="button" onClick={play} aria-label={`${slow ? 'Ouvir devagar' : 'Ouvir'}: ${phrase.translation}`}>
      {playing ? '■ Reproduzindo' : label ?? (slow ? '▶ Devagar' : '▶ Ouvir')}
    </button>
  );
}

const HOMEWORK_AUDIO_CUES = [
  { start: 0, end: 2.72, hanzi: '今天几月几日？', pinyin: 'jīntiān jǐ yuè jǐ rì?', translation: 'Qual é a data de hoje?' },
  { start: 2.72, end: 6.48, hanzi: '今天五月二十日。', pinyin: 'jīntiān wǔ yuè èrshí rì.', translation: 'Hoje é 20 de maio.' },
  { start: 7, end: 10.14, hanzi: '昨天几月几日？', pinyin: 'zuótiān jǐ yuè jǐ rì?', translation: 'Qual foi a data de ontem?' },
  { start: 10.14, end: 13.9, hanzi: '昨天五月十九日。', pinyin: 'zuótiān wǔ yuè shíjiǔ rì.', translation: 'Ontem foi 19 de maio.' },
  { start: 13.9, end: 17.42, hanzi: '明天几月几日？', pinyin: 'míngtiān jǐ yuè jǐ rì?', translation: 'Qual será a data de amanhã?' },
  { start: 17.42, end: 21.02, hanzi: '明天五月二十一日。', pinyin: 'míngtiān wǔ yuè èrshíyī rì.', translation: 'Amanhã será 21 de maio.' },
  { start: 21.02, end: 23.38, hanzi: '今天', pinyin: 'jīntiān', translation: 'hoje' },
  { start: 24, end: 26.06, hanzi: '昨天', pinyin: 'zuótiān', translation: 'ontem' },
  { start: 27, end: 28.98, hanzi: '明天', pinyin: 'míngtiān', translation: 'amanhã' },
  { start: 28.98, end: 32.64, hanzi: '几日', pinyin: 'jǐ rì', translation: 'que dia?' },
  { start: 32.64, end: 34.9, hanzi: '月', pinyin: 'yuè', translation: 'mês' },
  { start: 34.9, end: 37.4, hanzi: '日', pinyin: 'rì', translation: 'dia' },
] as const;

function HomeworkAudioLoop() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [repeat, setRepeat] = useState(true);
  const [pauseSeconds, setPauseSeconds] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const [activeCue, setActiveCue] = useState(-1);

  useEffect(() => () => {
    if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
  }, []);

  function cancelReplay() {
    if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
    replayTimerRef.current = null;
    setWaiting(false);
  }

  function handleEnded() {
    cancelReplay();
    setActiveCue(-1);
    if (!repeat) return;
    setWaiting(true);
    replayTimerRef.current = setTimeout(() => {
      replayTimerRef.current = null;
      setWaiting(false);
      if (!audioRef.current) return;
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
    }, pauseSeconds * 1000);
  }

  function updateActiveCue() {
    const currentTime = audioRef.current?.currentTime ?? 0;
    setActiveCue(HOMEWORK_AUDIO_CUES.findIndex((cue) => currentTime >= cue.start && currentTime < cue.end));
  }

  function playCue(index: number) {
    const audio = audioRef.current;
    if (!audio) return;
    cancelReplay();
    audio.currentTime = HOMEWORK_AUDIO_CUES[index].start;
    setActiveCue(index);
    void audio.play();
  }

  function toggleRepeat() {
    setRepeat((current) => {
      if (current) cancelReplay();
      return !current;
    });
  }

  return (
    <div className={styles.homeworkAudio}>
      <div className={styles.homeworkAudioHeading}>
        <div>
          <span>Áudio da lição de casa</span>
          <strong>Escute e repita com a fala original</strong>
        </div>
        <span>{waiting ? `Repetindo em ${pauseSeconds}s` : repeat ? 'Loop ativo' : 'Uma reprodução'}</span>
      </div>
      <audio ref={audioRef} controls preload="metadata" src="/audio/revisao/aula-3-licao-de-casa.mp3"
        onEnded={handleEnded} onTimeUpdate={updateActiveCue} onSeeked={updateActiveCue} onPlay={cancelReplay} onPause={() => {
          if (audioRef.current && !audioRef.current.ended) cancelReplay();
        }}>
        Seu navegador não conseguiu reproduzir este áudio.
      </audio>
      <div className={styles.homeworkAudioControls}>
        <button type="button" className={repeat ? styles.activeAudioLoop : ''} onClick={toggleRepeat}
          aria-pressed={repeat}>↻ Reproduzir em looping</button>
        <label htmlFor="homework-loop-pause">
          Pausa entre repetições
          <input id="homework-loop-pause" type="range" min="1" max="10" step="1" value={pauseSeconds}
            onChange={(event) => setPauseSeconds(Number(event.target.value))} />
          <b>{pauseSeconds} {pauseSeconds === 1 ? 'segundo' : 'segundos'}</b>
        </label>
      </div>
      <div className={styles.homeworkTranscript} aria-label="Texto sincronizado com o áudio">
        <div>
          <span>Acompanhe a gravação</span>
          <p>A linha em destaque mostra o trecho que está sendo pronunciado. Clique em qualquer linha para começar a ouvir dali.</p>
        </div>
        <ol>
          {HOMEWORK_AUDIO_CUES.map((cue, index) => (
            <li key={`${cue.start}-${cue.hanzi}`} className={activeCue === index ? styles.activeHomeworkCue : ''}>
              <button type="button" onClick={() => playCue(index)} aria-label={`Ouvir: ${cue.translation}`}>
                <span lang="zh-CN">{cue.hanzi}</span>
                <b>{cue.pinyin}</b>
                <small>{cue.translation}</small>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function RevisionHome() {
  const router = useRouter();
  const { sessionId } = useClientSession();
  const [leaving, setLeaving] = useState(false);
  const [mode, setMode] = useState<StudyMode>('resumo');
  const [lessonId, setLessonId] = useState<LessonId>('aula1');
  const [writingIndex, setWritingIndex] = useState(0);
  const [writingValue, setWritingValue] = useState('');
  const [writingStatus, setWritingStatus] = useState<ExerciseStatus>('idle');
  const [speakingId, setSpeakingId] = useState(KEY_PHRASES[0].id);
  const [listeningIndex, setListeningIndex] = useState(0);
  const [listeningChoice, setListeningChoice] = useState<string | null>(null);
  const [listeningScore, setListeningScore] = useState(0);

  const lesson = LESSONS[lessonId];
  const speakingPhrase = useMemo(
    () => lesson.keyPhrases.find((phrase) => phrase.id === speakingId) ?? lesson.keyPhrases[0],
    [lesson, speakingId],
  );
  const listeningExercise = lesson.listeningExercises[listeningIndex];
  const listeningPhrase = lesson.keyPhrases.find((phrase) => phrase.id === listeningExercise.phraseId) ?? lesson.keyPhrases[0];
  const writingExercise = lesson.writingExercises[writingIndex];

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  async function leave() {
    setLeaving(true);
    try {
      await fetch('/api/revisao/logout', { method: 'POST', credentials: 'same-origin' });
      router.refresh();
    } finally {
      setLeaving(false);
    }
  }

  function changeMode(nextMode: StudyMode) {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setMode(nextMode);
  }

  function changeLesson(nextLesson: LessonId) {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const next = LESSONS[nextLesson];
    setLessonId(nextLesson);
    setMode('resumo');
    setWritingIndex(0);
    setWritingValue('');
    setWritingStatus('idle');
    setSpeakingId(next.keyPhrases[0].id);
    setListeningIndex(0);
    setListeningChoice(null);
    setListeningScore(0);
  }

  function checkWriting() {
    if (!writingValue.trim()) return;
    setWritingStatus(normalizedAnswer(writingValue) === normalizedAnswer(writingExercise.answer) ? 'correct' : 'incorrect');
  }

  function nextWriting() {
    setWritingIndex((current) => (current + 1) % lesson.writingExercises.length);
    setWritingValue('');
    setWritingStatus('idle');
  }

  function chooseListening(choice: string) {
    if (listeningChoice !== null) return;
    setListeningChoice(choice);
    if (choice === listeningPhrase.translation) setListeningScore((score) => score + 1);
  }

  function nextListening() {
    setListeningChoice(null);
    setListeningIndex((current) => (current + 1) % lesson.listeningExercises.length);
  }

  return (
    <main className={styles.page}>
      <RevisionHeader />
      <section className={styles.reviewArea}>
        <div className={styles.reviewHeading}>
          <div>
            <span className={styles.eyebrow}>Meu caderno de revisão</span>
            <h1>Revisão das aulas</h1>
            <p>O conteúdo da professora, reorganizado para você revisar a matéria e praticar de verdade.</p>
          </div>
          <button className={styles.leaveButton} type="button" onClick={() => void leave()} disabled={leaving}>
            {leaving ? 'Saindo…' : 'Sair da área protegida'}
          </button>
        </div>

        <div className={styles.lessonTabs} role="tablist" aria-label="Aulas disponíveis">
          {(Object.keys(LESSONS) as LessonId[]).map((id) => (
            <button key={id} className={lessonId === id ? styles.activeLesson : ''} type="button" role="tab"
              aria-selected={lessonId === id} onClick={() => changeLesson(id)}>
              <span>{LESSONS[id].tabTitle}</span>
              <small>{LESSONS[id].tabSubtitle}</small>
            </button>
          ))}
        </div>

        <section className={styles.lessonPanel} aria-labelledby="lesson-title">
          <div className={styles.lessonTitle}>
            <div>
              <span>Aula {lesson.number} · resumo completo</span>
              <h2 id="lesson-title">{lesson.title}</h2>
            </div>
            <b>{lesson.keyPhrases.length} frases para praticar</b>
          </div>

          <div className={styles.lessonOverview}>
            <div>
              <span>Objetivo da aula</span>
              <h3>{lesson.objective}</h3>
              <p>{lesson.description}</p>
            </div>
            <dl>
              <div><dt>Gramática</dt><dd>6 blocos</dd></div>
              <div><dt>Vocabulário</dt><dd>{lesson.vocabularyGroups.reduce((total, group) => total + group.words.length, 0)} itens</dd></div>
              <div><dt>Prática</dt><dd>escrita, fala e escuta</dd></div>
            </dl>
          </div>

          <div className={styles.studyModes} role="tablist" aria-label={`Modos de estudo da ${lesson.tabTitle}`}>
            {MODES.map((item) => (
              <button key={item.id} type="button" role="tab" aria-selected={mode === item.id}
                className={mode === item.id ? styles.activeMode : ''} onClick={() => changeMode(item.id)}>
                <span lang="zh-CN">{item.marker}</span>
                <div><strong>{item.name}</strong><small>{item.description}</small></div>
              </button>
            ))}
          </div>

          {mode === 'resumo' && (
            <div className={styles.summaryMode} role="tabpanel">
              <section className={styles.contentSection} aria-labelledby="grammar-title">
                <div className={styles.sectionHeading}>
                  <span>01 · Gramática central</span>
                  <h3 id="grammar-title">As estruturas que você precisa dominar</h3>
                </div>
                <div className={styles.topicGrid}>
                  {lesson.topics.map((topic) => (
                    <article key={topic.title} className={styles.topicCard}>
                      <div className={styles.topicCardHead}><span lang="zh-CN">{topic.marker}</span><h4>{topic.title}</h4></div>
                      <p>{topic.summary}</p>
                      <ul>{topic.points.map((point) => <li key={point}>{point}</li>)}</ul>
                      <div className={styles.topicExamples}>
                        {topic.examples.map((example) => (
                          <div key={example.id}>
                            <span lang="zh-CN">{example.hanzi}</span>
                            <small>{getPinyin(example.hanzi)}</small>
                            <em>{example.translation}</em>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.contentSection} aria-labelledby="pinyin-title">
                <div className={styles.sectionHeading}>
                  <span>02 · Pronúncia e pinyin</span>
                  <h3 id="pinyin-title">Correções feitas durante a aula</h3>
                </div>
                <div className={styles.noteGrid}>
                  {lesson.pinyinNotes.map((note, index) => (
                    <article key={note.title}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div><h4>{note.title}</h4><p>{note.detail}</p></div>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.contentSection} aria-labelledby="numbers-title">
                <div className={styles.sectionHeading}>
                  <span>03 · Números</span>
                  <h3 id="numbers-title">{lesson.numbersTitle}</h3>
                  <p>{lesson.numbersDescription}</p>
                </div>
                <div className={styles.numberTable}>
                  {lesson.numberRows.map((row) => (
                    <div key={row.hanzi}>
                      <span lang="zh-CN">{row.hanzi}</span>
                      <b>{getPinyin(row.hanzi)}</b>
                      <small>{row.translation}</small>
                    </div>
                  ))}
                </div>
                <div className={styles.numberRule}>
                  <strong>Exemplo da professora</strong>
                  <p>{lesson.numberRule}</p>
                </div>
              </section>

              <section className={styles.contentSection} aria-labelledby="vocabulary-title">
                <div className={styles.sectionHeading}>
                  <span>04 · Vocabulário</span>
                  <h3 id="vocabulary-title">Palavras trabalhadas na aula</h3>
                </div>
                <div className={styles.vocabularyGroups}>
                  {lesson.vocabularyGroups.map((group, groupIndex) => (
                    <details key={group.title} open={groupIndex === 0}>
                      <summary><span>{group.title}</span><small>{group.words.length} itens</small></summary>
                      <p>{group.description}</p>
                      <div className={styles.wordGrid}>
                        {group.words.map((word) => (
                          <article key={word.hanzi}>
                            <span lang="zh-CN">{word.hanzi}</span>
                            <b>{getPinyin(word.hanzi)}</b>
                            <small>{word.translation}</small>
                            {word.note && <em>{word.note}</em>}
                          </article>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <section className={styles.contentSection} aria-labelledby="hanzi-title">
                <div className={styles.sectionHeading}>
                  <span>05 · Escrita dos caracteres</span>
                  <h3 id="hanzi-title">O que corrigir no caderno</h3>
                </div>
                <div className={styles.hanziCorrections}>
                  {lesson.hanziCorrections.map((item) => (
                    <article key={item.hanzi}>
                      <span lang="zh-CN">{item.hanzi}</span>
                      <div><h4>{item.title}</h4><p>{item.detail}</p></div>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.contentSection} aria-labelledby="phrases-title">
                <div className={styles.sectionHeading}>
                  <span>06 · Frases da aula</span>
                  <h3 id="phrases-title">Leia, escute e repita</h3>
                  <p>O pinyin abaixo segue blocos de fala. A barra | mostra onde uma mudança tonal não deve atravessar.</p>
                </div>
                <ol className={styles.phraseList}>
                  {lesson.keyPhrases.map((phrase, index) => (
                    <li key={phrase.id}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <strong lang="zh-CN">{phrase.hanzi}</strong>
                        <b>{getSpokenPinyin(phrase)}</b>
                        <p>{phrase.translation}</p>
                        {phrase.note && <small>{phrase.note}</small>}
                      </div>
                      <div className={styles.phraseAudio}>
                        <MandarinButton phrase={phrase} />
                        <MandarinButton phrase={phrase} slow />
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className={styles.homework} aria-labelledby="homework-title">
                <div>
                  <span>课后练习 · depois da aula</span>
                  <h3 id="homework-title">Plano de revisão</h3>
                </div>
                <ol>{lesson.homework.map((item) => <li key={item}>{item}</li>)}</ol>
                {lessonId === 'aula3' && <HomeworkAudioLoop />}
              </section>
            </div>
          )}

          {mode === 'escrever' && (
            <section className={styles.exerciseMode} role="tabpanel" aria-labelledby="writing-title">
              <div className={styles.exerciseIntro}>
                <span>写 · prática de escrita</span>
                <h3 id="writing-title">Monte a frase em caracteres</h3>
                <p>Leia a frase em português, escreva em mandarim e confira. Pontuação e espaços não alteram o resultado.</p>
              </div>
              <div className={styles.exerciseProgress}><i style={{ width: `${((writingIndex + 1) / lesson.writingExercises.length) * 100}%` }} /></div>
              <div className={styles.writingCard}>
                <div className={styles.exerciseCounter}>Frase {writingIndex + 1} de {lesson.writingExercises.length}</div>
                <p>{writingExercise.prompt}</p>
                <label htmlFor="writing-answer">Escreva em chinês</label>
                <textarea id="writing-answer" value={writingValue} onChange={(event) => {
                  setWritingValue(event.target.value);
                  setWritingStatus('idle');
                }} placeholder="Digite os caracteres aqui" autoComplete="off" />
                <small>Dica: {writingExercise.hint}</small>
                {writingStatus !== 'idle' && (
                  <div className={`${styles.writingFeedback} ${writingStatus === 'correct' ? styles.correct : writingStatus === 'incorrect' ? styles.incorrect : ''}`} role="status">
                    {writingStatus === 'correct' ? (
                      <><strong>Correto!</strong><span lang="zh-CN">{writingExercise.answer}</span></>
                    ) : writingStatus === 'incorrect' ? (
                      <><strong>Ainda não.</strong><span>Confira a ordem, os classificadores e tente novamente.</span></>
                    ) : (
                      <><strong>Resposta</strong><span lang="zh-CN">{writingExercise.answer}</span><small>{getPinyin(writingExercise.answer)}</small></>
                    )}
                  </div>
                )}
                <div className={styles.exerciseActions}>
                  <button className={styles.primaryAction} type="button" onClick={checkWriting} disabled={!writingValue.trim()}>Conferir</button>
                  <button type="button" onClick={() => setWritingStatus('revealed')}>Ver resposta</button>
                  <button type="button" onClick={nextWriting}>Próxima frase</button>
                </div>
              </div>
            </section>
          )}

          {mode === 'falar' && (
            <section className={styles.exerciseMode} role="tabpanel" aria-labelledby="speaking-title">
              <div className={styles.exerciseIntro}>
                <span>说 · prática de fala</span>
                <h3 id="speaking-title">Escute, repita e compare</h3>
                <p>Escolha uma frase, ouça a voz em mandarim e grave até três tentativas de 30 segundos.</p>
              </div>
              <div className={styles.speakingPicker}>
                <label htmlFor="speaking-phrase">Frase para praticar</label>
                <select id="speaking-phrase" value={speakingId} onChange={(event) => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setSpeakingId(event.target.value);
                }}>
                  {lesson.keyPhrases.map((phrase, index) => <option key={phrase.id} value={phrase.id}>{index + 1}. {phrase.hanzi}</option>)}
                </select>
              </div>
              <div className={styles.speakingStage}>
                <span lang="zh-CN">{speakingPhrase.hanzi}</span>
                <b>{getPinyin(speakingPhrase.hanzi)}</b>
                <p>{speakingPhrase.translation}</p>
                {speakingPhrase.note && <small>{speakingPhrase.note}</small>}
                <div className={styles.speakingActions}>
                  <MandarinButton phrase={speakingPhrase} label="▶ Ouvir natural" />
                  <MandarinButton phrase={speakingPhrase} slow label="▶ Ouvir devagar" />
                </div>
              </div>
              <div className={styles.speakingRecorder}>
                <PracticeRecorder key={`${lessonId}-${speakingPhrase.id}`} phrase={speakingPhrase.hanzi}
                  pinyin={getPinyin(speakingPhrase.hanzi)} sessionId={sessionId}
                  storageScope={`revisao-${lessonId}-${speakingPhrase.id}`}
                  onBeforeRecord={() => window.speechSynthesis?.cancel()} />
              </div>
            </section>
          )}

          {mode === 'ouvir' && (
            <section className={styles.exerciseMode} role="tabpanel" aria-labelledby="listening-title">
              <div className={styles.exerciseIntro}>
                <span>听 · compreensão auditiva</span>
                <h3 id="listening-title">Ouça antes de olhar</h3>
                <p>Reproduza a frase e escolha o significado. O hanzi e o pinyin só aparecem depois da resposta.</p>
              </div>
              <div className={styles.listeningScore}>
                <span>Questão {listeningIndex + 1} de {lesson.listeningExercises.length}</span>
                <strong>{listeningScore} acertos</strong>
              </div>
              <div className={styles.listeningCard}>
                <div className={styles.listeningPrompt}>
                  <span aria-hidden="true">听</span>
                  <div><h4>Qual é o significado?</h4><p>Você pode ouvir quantas vezes precisar.</p></div>
                  <div className={styles.listeningAudio}>
                    <MandarinButton phrase={listeningPhrase} label="▶ Natural" />
                    <MandarinButton phrase={listeningPhrase} slow label="▶ Devagar" />
                  </div>
                </div>
                <div className={styles.choiceList}>
                  {listeningExercise.choices.map((choice) => {
                    const answered = listeningChoice !== null;
                    const isCorrect = choice === listeningPhrase.translation;
                    const isSelected = choice === listeningChoice;
                    const className = answered && isCorrect ? styles.correctChoice : answered && isSelected ? styles.wrongChoice : '';
                    return <button type="button" key={choice} className={className} onClick={() => chooseListening(choice)} disabled={answered}>{choice}</button>;
                  })}
                </div>
                {listeningChoice !== null && (
                  <div className={styles.listeningReveal} role="status">
                    <strong>{listeningChoice === listeningPhrase.translation ? 'Você acertou.' : 'Revise e escute novamente.'}</strong>
                    <span lang="zh-CN">{listeningPhrase.hanzi}</span>
                    <b>{getPinyin(listeningPhrase.hanzi)}</b>
                    <p>{listeningPhrase.translation}</p>
                    <button type="button" onClick={nextListening}>Próxima questão</button>
                  </div>
                )}
              </div>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}
