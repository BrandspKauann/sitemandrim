'use client';

import { useState } from 'react';
import PracticeRecorder from '../components/PracticeRecorder';
import type { StudyItem } from './lesson11Data';
import { LESSON11, type Lesson } from './lessons';
import styles from './preparation.module.css';

const normalize = (value: string) => value.replace(/[\s，。！？、,.!?]/g, '');

export default function LessonPreparation({ lesson = LESSON11, sessionId, onPlay, onStop }: {lesson?: Lesson; sessionId: string; onPlay: (items: StudyItem[], loop: boolean) => void; onStop: () => void}) {
  const lines = lesson.groups.filter(g => g.id.startsWith(`l${lesson.number}-text`)).flatMap(g => g.items);
  const checklist = lesson.checklist;
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [order, setOrder] = useState([2, 0, 3, 1]);
  const [writing, setWriting] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [reveal, setReveal] = useState(false);
  const [line, setLine] = useState(0);
  const [checked, setChecked] = useState<boolean[]>([]);
  const quiz = lesson.quiz[question];
  const exercise = lesson.writing[writing];
  const speech = lines[line];
  function nextQuestion() {
    if (question === lesson.quiz.length - 1) { setFinished(true); return; }
    setQuestion(question + 1); setAnswer(null);
    const shuffled = [0,1,2,3];
    for (let i = 3; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    setOrder(shuffled);
  }
  return <section className={styles.study} aria-label={`Preparação completa da lição ${lesson.number}`}>
    <header><span>ENTENDA ANTES DE DECORAR</span><h2>Os três pontos da lição</h2><p>Use os controles do player acima para velocidade e intervalo. Os exemplos abaixo também podem ser repetidos em loop.</p></header>
    <div className={styles.cards}>{lesson.grammar.map(topic => {
      const examples = lesson.groups.flatMap(g => g.items).filter(item => topic.examples.includes(item.hanzi));
      return <article key={topic.title}><h3>{topic.title}</h3><p>{topic.text}</p><aside>{topic.tip}</aside><ul>{examples.map(item => <li key={item.id}><strong lang="zh-CN">{item.hanzi}</strong><br />{item.pinyin}<br />{item.meaning}</li>)}</ul><button onClick={() => onPlay(examples, false)}>▶ Ouvir exemplos</button><button onClick={() => onPlay(examples, true)}>↻ Loop</button></article>;
    })}</div>
    <article className={styles.panel}><h2>1. Compreensão e gramática</h2><p>20 questões sobre os três diálogos e as estruturas da lição.</p>
      {finished ? <><h3>Resultado: {score} / {lesson.quiz.length}</h3><p>Volte aos exemplos das perguntas que errou e tente novamente.</p><button onClick={() => { setQuestion(0); setAnswer(null); setScore(0); setFinished(false); }}>Recomeçar</button></> : <>
        <small>Questão {question + 1} / {lesson.quiz.length} · {score} acertos</small><h3 lang="zh-CN">{quiz.q}</h3>
        <div className={styles.answers}>{order.map(index => <button key={index} disabled={answer !== null} className={answer !== null && index === quiz.correct ? styles.correct : answer === index ? styles.wrong : ''} onClick={() => { setAnswer(index); if (index === quiz.correct) setScore(score + 1); }}>{quiz.options[index]}</button>)}</div>
        {answer !== null && <div role="status"><p>{answer === quiz.correct ? 'Correto!' : 'Ainda não. Resposta: ' + quiz.options[quiz.correct]}</p><p>{quiz.explanation}</p><button onClick={nextQuestion}>{question === lesson.quiz.length - 1 ? 'Ver resultado' : 'Próxima questão'}</button></div>}
      </>}
    </article>
    <article className={styles.panel}><h2>2. Escreva em chinês</h2><small>Frase {writing + 1} / {lesson.writing.length}</small><h3>{exercise[0]}</h3><label htmlFor="lesson11-writing">Sua resposta</label><textarea id="lesson11-writing" lang="zh-CN" value={input} onChange={event => { setInput(event.target.value); setFeedback(''); }} /><p>Dica: {exercise[2]}</p><button onClick={() => setFeedback(normalize(input) === normalize(exercise[1]) ? 'Correto!' : 'Ainda não coincide com o modelo. Confira a estrutura; outra formulação também pode ser válida.')}>Conferir</button><button onClick={() => setReveal(!reveal)}>{reveal ? 'Ocultar modelo' : 'Ver resposta'}</button><button onClick={() => { setWriting((writing + 1) % lesson.writing.length); setInput(''); setFeedback(''); setReveal(false); }}>Próxima frase</button><p role="status">{feedback}</p>{reveal && <strong lang="zh-CN">{exercise[1]}</strong>}
    </article>
    <article className={styles.panel}><h2>3. Ouça, fale e compare</h2><p>Escolha uma fala, ouça o modelo e depois grave até três tentativas de 30 segundos. A gravação só começa quando você autorizar seu microfone.</p><label htmlFor="lesson11-line">Fala do diálogo</label><select id="lesson11-line" value={line} onChange={event => { onStop(); setLine(Number(event.target.value)); }}>{lines.map((item, index) => <option key={item.id} value={index}>{index + 1}. {item.hanzi}</option>)}</select><h3 lang="zh-CN">{speech.hanzi}</h3><p>{speech.pinyin}</p><p>{speech.meaning}</p><button onClick={() => onPlay([speech], false)}>▶ Ouvir modelo</button><button onClick={() => onPlay([speech], true)}>↻ Repetir modelo</button><button onClick={onStop}>Parar áudio</button><PracticeRecorder key={speech.id} phrase={speech.hanzi} pinyin={speech.pinyin} sessionId={sessionId} storageScope={'hsk1-' + speech.id} maxSeconds={30} onBeforeRecord={onStop} />
    </article>
    <article className={styles.panel}><h2>4. Responda com a sua vida</h2><p>{lesson.prompts}</p><p lang="zh-CN">{lesson.promptsChinese}</p><p>Não basta repetir o livro: tente responder sem ler e leve suas dúvidas para a professora.</p><h3>Atenção ao significado</h3><p>{lesson.notes}</p></article>
    <article className={styles.panel}><h2>Pronto para a aula?</h2>{checklist.map((text, index) => <label className={styles.check} key={text}><input type="checkbox" checked={!!checked[index]} onChange={event => { const next = [...checked]; next[index] = event.target.checked; setChecked(next); }} />{text}</label>)}<p>Este conteúdo pertence à Lição {lesson.number}. Outras lições ficam separadas na lista do HSK1.</p></article>
  </section>;
}
