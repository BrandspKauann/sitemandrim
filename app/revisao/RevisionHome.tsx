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
import styles from './page.module.css';

type StudyMode = 'resumo' | 'escrever' | 'falar' | 'ouvir';
type ExerciseStatus = 'idle' | 'correct' | 'incorrect' | 'revealed';

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

export default function RevisionHome() {
  const router = useRouter();
  const { sessionId } = useClientSession();
  const [leaving, setLeaving] = useState(false);
  const [mode, setMode] = useState<StudyMode>('resumo');
  const [writingIndex, setWritingIndex] = useState(0);
  const [writingValue, setWritingValue] = useState('');
  const [writingStatus, setWritingStatus] = useState<ExerciseStatus>('idle');
  const [speakingId, setSpeakingId] = useState(KEY_PHRASES[0].id);
  const [listeningIndex, setListeningIndex] = useState(0);
  const [listeningChoice, setListeningChoice] = useState<string | null>(null);
  const [listeningScore, setListeningScore] = useState(0);

  const speakingPhrase = useMemo(
    () => KEY_PHRASES.find((phrase) => phrase.id === speakingId) ?? KEY_PHRASES[0],
    [speakingId],
  );
  const listeningExercise = LISTENING_EXERCISES[listeningIndex];
  const listeningPhrase = KEY_PHRASES.find((phrase) => phrase.id === listeningExercise.phraseId) ?? KEY_PHRASES[0];
  const writingExercise = WRITING_EXERCISES[writingIndex];

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

  function checkWriting() {
    if (!writingValue.trim()) return;
    setWritingStatus(normalizedAnswer(writingValue) === normalizedAnswer(writingExercise.answer) ? 'correct' : 'incorrect');
  }

  function nextWriting() {
    setWritingIndex((current) => (current + 1) % WRITING_EXERCISES.length);
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
    setListeningIndex((current) => (current + 1) % LISTENING_EXERCISES.length);
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
          <button className={styles.activeLesson} type="button" role="tab" aria-selected="true">
            <span>Aula 1</span>
            <small>Quantidade e família</small>
          </button>
        </div>

        <section className={styles.lessonPanel} aria-labelledby="lesson-one-title">
          <div className={styles.lessonTitle}>
            <div>
              <span>Aula 01 · resumo completo</span>
              <h2 id="lesson-one-title">Família, números e perguntas</h2>
            </div>
            <b>{KEY_PHRASES.length} frases para praticar</b>
          </div>

          <div className={styles.lessonOverview}>
            <div>
              <span>Objetivo da aula</span>
              <h3>Falar sobre o que alguém tem e sobre quantidades.</h3>
              <p>Você revisou 有/没有, números, classificadores, membros da família, 吗/呢 e perguntas com 几 ou 多少. A professora também corrigiu caracteres e pontos de pinyin.</p>
            </div>
            <dl>
              <div><dt>Gramática</dt><dd>6 blocos</dd></div>
              <div><dt>Vocabulário</dt><dd>{VOCABULARY_GROUPS.reduce((total, group) => total + group.words.length, 0)} itens</dd></div>
              <div><dt>Prática</dt><dd>escrita, fala e escuta</dd></div>
            </dl>
          </div>

          <div className={styles.studyModes} role="tablist" aria-label="Modos de estudo da Aula 1">
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
                  {LESSON_TOPICS.map((topic) => (
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
                  {PINYIN_NOTES.map((note, index) => (
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
                  <h3 id="numbers-title">Unidades, dezenas e valores maiores</h3>
                  <p>Para quantidades, leia o número completo. Em números de quarto, telefone ou códigos, os algarismos podem ser lidos um por um.</p>
                </div>
                <div className={styles.numberTable}>
                  {NUMBER_ROWS.map((row) => (
                    <div key={row.hanzi}>
                      <span lang="zh-CN">{row.hanzi}</span>
                      <b>{getPinyin(row.hanzi)}</b>
                      <small>{row.translation}</small>
                    </div>
                  ))}
                </div>
                <div className={styles.numberRule}>
                  <strong>Exemplo da professora</strong>
                  <p><b>1528 como valor:</b> 一千五百二十八. <b>Como número de quarto:</b> 一、五、二、八.</p>
                </div>
              </section>

              <section className={styles.contentSection} aria-labelledby="vocabulary-title">
                <div className={styles.sectionHeading}>
                  <span>04 · Vocabulário</span>
                  <h3 id="vocabulary-title">Palavras trabalhadas na aula</h3>
                </div>
                <div className={styles.vocabularyGroups}>
                  {VOCABULARY_GROUPS.map((group) => (
                    <details key={group.title} open={group === VOCABULARY_GROUPS[0]}>
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
                  {HANZI_CORRECTIONS.map((item) => (
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
                </div>
                <ol className={styles.phraseList}>
                  {KEY_PHRASES.map((phrase, index) => (
                    <li key={phrase.id}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <strong lang="zh-CN">{phrase.hanzi}</strong>
                        <b>{getPinyin(phrase.hanzi)}</b>
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
                <ol>{HOMEWORK.map((item) => <li key={item}>{item}</li>)}</ol>
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
              <div className={styles.exerciseProgress}><i style={{ width: `${((writingIndex + 1) / WRITING_EXERCISES.length) * 100}%` }} /></div>
              <div className={styles.writingCard}>
                <div className={styles.exerciseCounter}>Frase {writingIndex + 1} de {WRITING_EXERCISES.length}</div>
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
                  {KEY_PHRASES.map((phrase, index) => <option key={phrase.id} value={phrase.id}>{index + 1}. {phrase.hanzi}</option>)}
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
                <PracticeRecorder key={speakingPhrase.id} phrase={speakingPhrase.hanzi}
                  pinyin={getPinyin(speakingPhrase.hanzi)} sessionId={sessionId}
                  storageScope={`revisao-aula1-${speakingPhrase.id}`}
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
                <span>Questão {listeningIndex + 1} de {LISTENING_EXERCISES.length}</span>
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
