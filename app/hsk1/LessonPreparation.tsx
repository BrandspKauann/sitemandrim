'use client';

import { useState } from 'react';
import PracticeRecorder from '../components/PracticeRecorder';
import { LESSON11_GROUPS, LESSON11_GRAMMAR, LESSON11_QUIZ, LESSON11_WRITING, type StudyItem } from './lesson11Data';
import styles from './preparation.module.css';

const normalize = (value: string) => value.replace(/[\s，。！？、,.!?]/g, '');
const lines = LESSON11_GROUPS.filter(g => g.id.startsWith('l11-text')).flatMap(g => g.items);
const checklist = ['Reconheci as 25 palavras sem olhar a tradução.', 'Ouvi e repeti os três diálogos.', 'Entendi A-não-A, andamento e intenção.', 'Treinei as frases por escrito.', 'Gravei minha fala e preparei minhas próprias respostas.'];

export default function LessonPreparation({ sessionId, onPlay, onStop }: {sessionId: string; onPlay: (items: StudyItem[], loop: boolean) => void; onStop: () => void}) {
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
  const quiz = LESSON11_QUIZ[question];
  const exercise = LESSON11_WRITING[writing];
  const speech = lines[line];
  function nextQuestion() {
    if (question === LESSON11_QUIZ.length - 1) { setFinished(true); return; }
    setQuestion(question + 1); setAnswer(null);
    const shuffled = [0,1,2,3];
    for (let i = 3; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    setOrder(shuffled);
  }
  return <section className={styles.study} aria-label="Preparação completa da lição 11">
    <header><span>ENTENDA ANTES DE DECORAR</span><h2>Os três pontos da lição</h2><p>Use os controles do player acima para velocidade e intervalo. Os exemplos abaixo também podem ser repetidos em loop.</p></header>
    <div className={styles.cards}>{LESSON11_GRAMMAR.map(topic => {
      const examples = LESSON11_GROUPS.flatMap(g => g.items).filter(item => topic.examples.includes(item.hanzi));
      return <article key={topic.title}><h3>{topic.title}</h3><p>{topic.text}</p><aside>{topic.tip}</aside><ul>{examples.map(item => <li key={item.id}><strong lang="zh-CN">{item.hanzi}</strong><br />{item.pinyin}<br />{item.meaning}</li>)}</ul><button onClick={() => onPlay(examples, false)}>▶ Ouvir exemplos</button><button onClick={() => onPlay(examples, true)}>↻ Loop</button></article>;
    })}</div>
    <article className={styles.panel}><h2>1. Compreensão e gramática</h2><p>20 questões sobre os três diálogos e as estruturas da lição.</p>
      {finished ? <><h3>Resultado: {score} / {LESSON11_QUIZ.length}</h3><p>Volte aos exemplos das perguntas que errou e tente novamente.</p><button onClick={() => { setQuestion(0); setAnswer(null); setScore(0); setFinished(false); }}>Recomeçar</button></> : <>
        <small>Questão {question + 1} / {LESSON11_QUIZ.length} · {score} acertos</small><h3 lang="zh-CN">{quiz.q}</h3>
        <div className={styles.answers}>{order.map(index => <button key={index} disabled={answer !== null} className={answer !== null && index === quiz.correct ? styles.correct : answer === index ? styles.wrong : ''} onClick={() => { setAnswer(index); if (index === quiz.correct) setScore(score + 1); }}>{quiz.options[index]}</button>)}</div>
        {answer !== null && <div role="status"><p>{answer === quiz.correct ? 'Correto!' : 'Ainda não. Resposta: ' + quiz.options[quiz.correct]}</p><p>{quiz.explanation}</p><button onClick={nextQuestion}>{question === LESSON11_QUIZ.length - 1 ? 'Ver resultado' : 'Próxima questão'}</button></div>}
      </>}
    </article>
    <article className={styles.panel}><h2>2. Escreva em chinês</h2><small>Frase {writing + 1} / {LESSON11_WRITING.length}</small><h3>{exercise[0]}</h3><label htmlFor="lesson11-writing">Sua resposta</label><textarea id="lesson11-writing" lang="zh-CN" value={input} onChange={event => { setInput(event.target.value); setFeedback(''); }} /><p>Dica: {exercise[2]}</p><button onClick={() => setFeedback(normalize(input) === normalize(exercise[1]) ? 'Correto!' : 'Ainda não coincide com o modelo. Confira a estrutura; outra formulação também pode ser válida.')}>Conferir</button><button onClick={() => setReveal(!reveal)}>{reveal ? 'Ocultar modelo' : 'Ver resposta'}</button><button onClick={() => { setWriting((writing + 1) % LESSON11_WRITING.length); setInput(''); setFeedback(''); setReveal(false); }}>Próxima frase</button><p role="status">{feedback}</p>{reveal && <strong lang="zh-CN">{exercise[1]}</strong>}
    </article>
    <article className={styles.panel}><h2>3. Ouça, fale e compare</h2><p>Escolha uma fala, ouça o modelo e depois grave até três tentativas de 30 segundos. A gravação só começa quando você autorizar seu microfone.</p><label htmlFor="lesson11-line">Fala do diálogo</label><select id="lesson11-line" value={line} onChange={event => { onStop(); setLine(Number(event.target.value)); }}>{lines.map((item, index) => <option key={item.id} value={index}>{index + 1}. {item.hanzi}</option>)}</select><h3 lang="zh-CN">{speech.hanzi}</h3><p>{speech.pinyin}</p><p>{speech.meaning}</p><button onClick={() => onPlay([speech], false)}>▶ Ouvir modelo</button><button onClick={() => onPlay([speech], true)}>↻ Repetir modelo</button><button onClick={onStop}>Parar áudio</button><PracticeRecorder key={speech.id} phrase={speech.hanzi} pinyin={speech.pinyin} sessionId={sessionId} storageScope={'hsk1-' + speech.id} maxSeconds={30} onBeforeRecord={onStop} />
    </article>
    <article className={styles.panel}><h2>4. Responda com a sua vida</h2><p>Antes da aula, prepare suas próprias respostas: você dirige? O que está fazendo agora? O que pretende fazer hoje? Você estuda o quê?</p><p lang="zh-CN">你开车不开车？ · 你在做什么呢？ · 你今天要做什么？ · 你学什么？</p><p>Não basta repetir o livro: tente responder sem ler e leve suas dúvidas para a professora.</p><h3>Atenção ao significado</h3><p>读大学 é cursar a universidade; 学医 é estudar medicina. 坐车 é ir como passageiro, não dirigir. 那里 (nàlǐ) é “ali”; 哪里 (nǎlǐ) é “onde”. Em 他对我说, 对 indica para quem se fala, não “correto”.</p></article>
    <article className={styles.panel}><h2>Pronto para a aula?</h2>{checklist.map((text, index) => <label className={styles.check} key={text}><input type="checkbox" checked={!!checked[index]} onChange={event => { const next = [...checked]; next[index] = event.target.checked; setChecked(next); }} />{text}</label>)}<p>Esta é apenas a Lição 11. Quando você pedir, preparo a próxima lição completa do livro.</p></article>
  </section>;
}
