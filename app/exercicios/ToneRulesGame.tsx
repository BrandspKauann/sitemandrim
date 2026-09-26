'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './page.module.css';

type ToneRuleChallenge = {
  id: string;
  hanzi: string;
  writtenPinyin: string;
  spokenPinyin: string;
  meaning: string;
  blocks: string;
  original: string;
  answer: string;
  choices: string[];
  explanation: string;
};

const THIRD_CHOICES = ['3º + 3º', '2º + 3º', '3º + 2º', '2º + 2º'];

const CHALLENGES: ToneRuleChallenge[] = [
  { id: 'nihao', hanzi: '你好', writtenPinyin: 'nǐ hǎo', spokenPinyin: 'ní hǎo', meaning: 'olá', blocks: '你好', original: '3º + 3º', answer: '2º + 3º', choices: THIRD_CHOICES, explanation: 'Dois 3º tons no mesmo bloco: o primeiro passa a soar como 2º tom.' },
  { id: 'henhao', hanzi: '很好', writtenPinyin: 'hěn hǎo', spokenPinyin: 'hén hǎo', meaning: 'muito bom', blocks: '很好', original: '3º + 3º', answer: '2º + 3º', choices: ['2º + 3º', '3º + 3º', '2º + 2º', '3º + 2º'], explanation: '很 e 好 formam um bloco 3º + 3º; 很 sobe na fala.' },
  { id: 'keyi', hanzi: '可以', writtenPinyin: 'kě yǐ', spokenPinyin: 'ké yǐ', meaning: 'poder / pode', blocks: '可以', original: '3º + 3º', answer: '2º + 3º', choices: ['3º + 2º', '2º + 2º', '2º + 3º', '3º + 3º'], explanation: 'No bloco 可以, 可 muda para o movimento do 2º tom.' },
  { id: 'shuiguo', hanzi: '水果', writtenPinyin: 'shuǐ guǒ', spokenPinyin: 'shuí guǒ', meaning: 'fruta', blocks: '水果', original: '3º + 3º', answer: '2º + 3º', choices: ['3º + 3º', '3º + 2º', '2º + 2º', '2º + 3º'], explanation: '水 sobe antes do 3º tom de 果.' },
  { id: 'xiangmai', hanzi: '想买', writtenPinyin: 'xiǎng mǎi', spokenPinyin: 'xiáng mǎi', meaning: 'querer comprar', blocks: '想买', original: '3º + 3º', answer: '2º + 3º', choices: ['2º + 2º', '2º + 3º', '3º + 3º', '3º + 2º'], explanation: '想 e 买 ficam juntos; 想 é realizado como 2º tom.' },
  { id: 'liangdian', hanzi: '两点', writtenPinyin: 'liǎng diǎn', spokenPinyin: 'liáng diǎn', meaning: 'duas horas', blocks: '两点', original: '3º + 3º', answer: '2º + 3º', choices: ['3º + 3º', '2º + 3º', '3º + 2º', '2º + 2º'], explanation: '两点 é um bloco de horário; 两 sobe antes de 点.' },
  { id: 'jiudian', hanzi: '九点', writtenPinyin: 'jiǔ diǎn', spokenPinyin: 'jiú diǎn', meaning: 'nove horas', blocks: '九点', original: '3º + 3º', answer: '2º + 3º', choices: ['3º + 2º', '3º + 3º', '2º + 3º', '2º + 2º'], explanation: '九 e 点 são 3º tons no mesmo bloco; 九 sobe.' },
  { id: 'wudian', hanzi: '五点', writtenPinyin: 'wǔ diǎn', spokenPinyin: 'wú diǎn', meaning: 'cinco horas', blocks: '五点', original: '3º + 3º', answer: '2º + 3º', choices: ['2º + 3º', '3º + 3º', '2º + 2º', '3º + 2º'], explanation: '五 passa a 2º tom antes do 3º tom de 点.' },
  { id: 'jidian', hanzi: '几点', writtenPinyin: 'jǐ diǎn', spokenPinyin: 'jí diǎn', meaning: 'que horas', blocks: '几点', original: '3º + 3º', answer: '2º + 3º', choices: ['3º + 3º', '3º + 2º', '2º + 3º', '2º + 2º'], explanation: '几 sobe antes de 点: jí diǎn.' },
  { id: 'yufa', hanzi: '语法', writtenPinyin: 'yǔ fǎ', spokenPinyin: 'yú fǎ', meaning: 'gramática', blocks: '语法', original: '3º + 3º', answer: '2º + 3º', choices: ['2º + 2º', '3º + 2º', '3º + 3º', '2º + 3º'], explanation: '语法 forma uma palavra; 语 sobe antes de 法.' },
  { id: 'laoban', hanzi: '老板', writtenPinyin: 'lǎo bǎn', spokenPinyin: 'láo bǎn', meaning: 'chefe / dono', blocks: '老板', original: '3º + 3º', answer: '2º + 3º', choices: ['2º + 3º', '2º + 2º', '3º + 3º', '3º + 2º'], explanation: '老 é realizado como 2º tom antes de 板.' },
  { id: 'yusan', hanzi: '雨伞', writtenPinyin: 'yǔ sǎn', spokenPinyin: 'yú sǎn', meaning: 'guarda-chuva', blocks: '雨伞', original: '3º + 3º', answer: '2º + 3º', choices: ['3º + 2º', '2º + 3º', '3º + 3º', '2º + 2º'], explanation: 'Na palavra 雨伞, o tom de 雨 sobe.' },
  { id: 'xizao', hanzi: '洗澡', writtenPinyin: 'xǐ zǎo', spokenPinyin: 'xí zǎo', meaning: 'tomar banho', blocks: '洗澡', original: '3º + 3º', answer: '2º + 3º', choices: ['3º + 3º', '2º + 2º', '3º + 2º', '2º + 3º'], explanation: '洗 e 澡 formam uma palavra; 洗 muda para 2º tom.' },
  { id: 'woyou', hanzi: '我有', writtenPinyin: 'wǒ yǒu', spokenPinyin: 'wó yǒu', meaning: 'eu tenho', blocks: '我有', original: '3º + 3º', answer: '2º + 3º', choices: ['2º + 2º', '3º + 3º', '2º + 3º', '3º + 2º'], explanation: 'Como no exemplo corrigido pela professora, 我有 é lido 2º + 3º.' },
  { id: 'nixiang', hanzi: '你想', writtenPinyin: 'nǐ xiǎng', spokenPinyin: 'ní xiǎng', meaning: 'você quer', blocks: '你想', original: '3º + 3º', answer: '2º + 3º', choices: ['3º + 2º', '2º + 3º', '2º + 2º', '3º + 3º'], explanation: 'No bloco 你想, 你 sobe e 想 mantém o 3º tom.' },
  { id: 'full-gege', hanzi: '我有两个哥哥', writtenPinyin: 'wǒ yǒu liǎng ge gēge', spokenPinyin: 'wó yǒu liǎng ge gēge', meaning: 'eu tenho dois irmãos mais velhos', blocks: '我有 | 两个 | 哥哥', original: '3º + 3º | 3º + N | 1º + N', answer: '2º + 3º | 3º + N | 1º + N', choices: ['2º + 3º | 3º + N | 1º + N', '2º + 2º | 2º + N | 1º + N', '3º + 3º | 2º + N | 1º + N', '2º + 3º | 2º + N | 1º + N'], explanation: 'A mudança acontece em 我有. 两 pertence ao bloco 两个 e continua em 3º tom antes do neutro 个.' },
  { id: 'wohenhao', hanzi: '我很好', writtenPinyin: 'wǒ hěn hǎo', spokenPinyin: 'wǒ hén hǎo', meaning: 'eu estou muito bem', blocks: '我 | 很好', original: '3º | 3º + 3º', answer: '3º | 2º + 3º', choices: ['2º | 2º + 3º', '3º | 3º + 3º', '3º | 2º + 3º', '2º | 3º + 3º'], explanation: 'O bloco adjetival é 很好; o 我 fica separado e 很 sobe antes de 好.' },
  { id: 'maishuiguo', hanzi: '买水果', writtenPinyin: 'mǎi shuǐguǒ', spokenPinyin: 'mǎi shuíguǒ', meaning: 'comprar frutas', blocks: '买 | 水果', original: '3º | 3º + 3º', answer: '3º | 2º + 3º', choices: ['3º | 3º + 3º', '2º | 2º + 3º', '3º | 2º + 3º', '2º | 3º + 3º'], explanation: '买 é um verbo separado. A mudança ocorre dentro da palavra 水果.' },
  { id: 'xiangmaishuiguo', hanzi: '想买水果', writtenPinyin: 'xiǎng mǎi shuǐguǒ', spokenPinyin: 'xiáng mǎi shuíguǒ', meaning: 'querer comprar frutas', blocks: '想买 | 水果', original: '3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º', choices: ['3º + 3º | 3º + 3º', '2º + 3º | 3º + 3º', '2º + 3º | 2º + 3º', '2º + 2º | 2º + 2º'], explanation: 'Há dois blocos 3º + 3º: 想买 e 水果. O primeiro tom de cada bloco sobe.' },
  { id: 'henhaochi', hanzi: '很好吃', writtenPinyin: 'hěn hǎochī', spokenPinyin: 'hén hǎochī', meaning: 'muito gostoso', blocks: '很好吃', original: '3º + 3º + 1º', answer: '2º + 3º + 1º', choices: ['3º + 3º + 1º', '2º + 3º + 1º', '2º + 2º + 1º', '3º + 2º + 1º'], explanation: '很 sobe antes de 好; 吃 permanece no 1º tom.' },
  { id: 'laoshi', hanzi: '老师', writtenPinyin: 'lǎoshī', spokenPinyin: 'lǎoshī', meaning: 'professor(a)', blocks: '老师', original: '3º + 1º', answer: '3º + 1º', choices: ['2º + 1º', '3º + 1º', '3º + 2º', '2º + 3º'], explanation: 'A regra do 3º tom só se ativa antes de outro 3º tom. Aqui nada muda.' },
  { id: 'shangwu', hanzi: '上午', writtenPinyin: 'shàngwǔ', spokenPinyin: 'shàngwǔ', meaning: 'manhã', blocks: '上午', original: '4º + 3º', answer: '4º + 3º', choices: ['2º + 3º', '4º + 2º', '4º + 3º', '3º + 3º'], explanation: '上 é 4º tom e 午 é 3º; não há dois 3º tons juntos.' },
  { id: 'xiawu', hanzi: '下午', writtenPinyin: 'xiàwǔ', spokenPinyin: 'xiàwǔ', meaning: 'tarde', blocks: '下午', original: '4º + 3º', answer: '4º + 3º', choices: ['4º + 3º', '2º + 3º', '4º + 2º', '3º + 3º'], explanation: '下 mantém a queda do 4º tom antes de 午.' },
  { id: 'hengaoxing', hanzi: '很高兴', writtenPinyin: 'hěn gāoxìng', spokenPinyin: 'hěn gāoxìng', meaning: 'muito feliz', blocks: '很 | 高兴', original: '3º | 1º + 4º', answer: '3º | 1º + 4º', choices: ['2º | 1º + 4º', '3º | 1º + 4º', '3º | 2º + 4º', '2º | 1º + 2º'], explanation: 'Depois de 很 vem 高, que é 1º tom. Portanto 很 não vira 2º tom.' },
  { id: 'yitian', hanzi: '一天', writtenPinyin: 'yī tiān', spokenPinyin: 'yì tiān', meaning: 'um dia', blocks: '一天', original: '1º + 1º', answer: '4º + 1º', choices: ['1º + 1º', '2º + 1º', '4º + 1º', '1º + 4º'], explanation: '一 muda para 4º tom antes de 1º, 2º ou 3º tom.' },
  { id: 'yinian', hanzi: '一年', writtenPinyin: 'yī nián', spokenPinyin: 'yì nián', meaning: 'um ano', blocks: '一年', original: '1º + 2º', answer: '4º + 2º', choices: ['4º + 2º', '1º + 2º', '2º + 2º', '4º + 1º'], explanation: 'Antes do 2º tom de 年, 一 é pronunciado no 4º tom.' },
  { id: 'yiqi', hanzi: '一起', writtenPinyin: 'yī qǐ', spokenPinyin: 'yì qǐ', meaning: 'juntos', blocks: '一起', original: '1º + 3º', answer: '4º + 3º', choices: ['1º + 3º', '2º + 3º', '4º + 2º', '4º + 3º'], explanation: 'Antes do 3º tom de 起, 一 passa ao 4º tom.' },
  { id: 'yiyang', hanzi: '一样', writtenPinyin: 'yī yàng', spokenPinyin: 'yí yàng', meaning: 'igual', blocks: '一样', original: '1º + 4º', answer: '2º + 4º', choices: ['4º + 4º', '1º + 4º', '2º + 4º', '2º + 2º'], explanation: 'Antes de um 4º tom, 一 muda para 2º tom.' },
  { id: 'yige', hanzi: '一个', writtenPinyin: 'yī ge', spokenPinyin: 'yí ge', meaning: 'um / uma', blocks: '一个', original: '1º + N', answer: '2º + N', choices: ['1º + N', '4º + N', '2º + N', '2º + 4º'], explanation: 'Em 一个, 个 fica neutro na fala, mas 一 assume o 2º tom desta expressão frequente.' },
  { id: 'buyao', hanzi: '不要', writtenPinyin: 'bù yào', spokenPinyin: 'bú yào', meaning: 'não querer / não faça', blocks: '不要', original: '4º + 4º', answer: '2º + 4º', choices: ['4º + 4º', '2º + 4º', '4º + 2º', '2º + 2º'], explanation: '不 muda para 2º tom quando vem imediatamente antes de um 4º tom.' },
  { id: 'bushi', hanzi: '不是', writtenPinyin: 'bù shì', spokenPinyin: 'bú shì', meaning: 'não ser', blocks: '不是', original: '4º + 4º', answer: '2º + 4º', choices: ['2º + 4º', '4º + 4º', '2º + 2º', '4º + 2º'], explanation: '是 é 4º tom, por isso 不 sobe para o 2º tom.' },
  { id: 'buhui', hanzi: '不会', writtenPinyin: 'bù huì', spokenPinyin: 'bú huì', meaning: 'não saber / não vai', blocks: '不会', original: '4º + 4º', answer: '2º + 4º', choices: ['4º + 2º', '2º + 2º', '4º + 4º', '2º + 4º'], explanation: '会 é 4º tom; 不 é realizado no 2º tom.' },
  { id: 'bukeqi', hanzi: '不客气', writtenPinyin: 'bù kèqi', spokenPinyin: 'bú kèqi', meaning: 'de nada', blocks: '不客气', original: '4º + 4º + N', answer: '2º + 4º + N', choices: ['4º + 4º + N', '2º + 4º + N', '2º + 2º + N', '4º + 2º + N'], explanation: '不 fica antes do 4º tom de 客 e sobe; 气 é neutro nesta expressão.' },
  { id: 'buxiang', hanzi: '不想', writtenPinyin: 'bù xiǎng', spokenPinyin: 'bù xiǎng', meaning: 'não querer', blocks: '不想', original: '4º + 3º', answer: '4º + 3º', choices: ['2º + 3º', '4º + 3º', '4º + 2º', '2º + 4º'], explanation: '想 é 3º tom. A mudança de 不 acontece somente antes de 4º tom.' },
  { id: 'yidian', hanzi: '一点', writtenPinyin: 'yī diǎn', spokenPinyin: 'yì diǎn', meaning: 'um pouco / uma hora', blocks: '一点', original: '1º + 3º', answer: '4º + 3º', choices: ['2º + 3º', '1º + 3º', '4º + 3º', '4º + 2º'], explanation: 'Antes do 3º tom de 点, 一 é pronunciado no 4º tom.' },
  { id: 'diyi', hanzi: '第一', writtenPinyin: 'dì yī', spokenPinyin: 'dì yī', meaning: 'primeiro', blocks: '第一', original: '4º + 1º', answer: '4º + 1º', choices: ['4º + 1º', '4º + 4º', '4º + 2º', '2º + 1º'], explanation: 'No número ordinal com 第, 一 conserva o 1º tom.' },
];

function shuffledChallenges() {
  return [...CHALLENGES]
    .map((challenge) => ({ challenge, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ challenge }) => challenge);
}

export default function ToneRulesGame() {
  const [deck, setDeck] = useState<ToneRuleChallenge[]>(() => shuffledChallenges());
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const challenge = deck[index];
  const isCorrect = choice === challenge.answer;
  const progress = finished ? 100 : ((index + 1) / deck.length) * 100;
  const correctIndex = useMemo(() => challenge.choices.indexOf(challenge.answer), [challenge]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function choose(nextChoice: string) {
    if (choice) return;
    setChoice(nextChoice);
    if (nextChoice === challenge.answer) setScore((current) => current + 1);
  }

  function next() {
    if (index >= deck.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setChoice(null);
  }

  function restart() {
    window.speechSynthesis?.cancel();
    setDeck(shuffledChallenges());
    setIndex(0);
    setChoice(null);
    setScore(0);
    setFinished(false);
  }

  function speak() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(challenge.hanzi);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((item) => item.lang.toLowerCase() === 'zh-cn')
      ?? voices.find((item) => item.lang.toLowerCase().startsWith('zh'));
    utterance.lang = voice?.lang ?? 'zh-CN';
    utterance.rate = 0.72;
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  if (finished) {
    return (
      <section className={styles.ruleGame} aria-live="polite">
        <div className={styles.ruleFinished}>
          <span>规则训练完成 · treino concluído</span>
          <strong>{score}<small>/ {deck.length}</small></strong>
          <h1>{score >= 30 ? 'Você dominou as mudanças de tom.' : score >= 22 ? 'Muito bem — revise os blocos que mudaram.' : 'Repita e observe os blocos de sentido.'}</h1>
          <p>O jogo mistura 3º tom, mudanças de 一 e 不 e casos em que o tom permanece igual.</p>
          <button type="button" onClick={restart}>↻ Jogar novamente</button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.ruleGame} aria-labelledby="tone-rule-title">
      <header className={styles.ruleGameHeader}>
        <div>
          <span>Regras de pronúncia</span>
          <h1 id="tone-rule-title">Como os tons ficam na fala?</h1>
          <p>Leia o hanzi e o pinyin escrito. Depois escolha a sequência realmente pronunciada.</p>
        </div>
        <div className={styles.ruleScore}><strong>{score}</strong><span>acertos</span><small>{index + 1}/{deck.length}</small></div>
      </header>

      <div className={styles.ruleProgress} aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>

      <div className={styles.ruleQuestion}>
        <div className={styles.rulePrompt}>
          <span className={styles.ruleCounter}>Questão {index + 1} · {challenge.meaning}</span>
          <strong lang="zh-CN">{challenge.hanzi}</strong>
          <p className={styles.ruleWrittenPinyin}>{challenge.writtenPinyin}</p>
          <dl>
            <div><dt>Blocos</dt><dd>{challenge.blocks}</dd></div>
            <div><dt>Tons escritos</dt><dd>{challenge.original}</dd></div>
          </dl>
          <p className={styles.ruleInstruction}>Qual sequência você deve pronunciar?</p>
        </div>

        <div className={styles.ruleAnswers}>
          {challenge.choices.map((answer, answerIndex) => {
            const selected = choice === answer;
            const correct = answerIndex === correctIndex;
            return (
              <button
                type="button"
                key={answer}
                onClick={() => choose(answer)}
                disabled={Boolean(choice)}
                className={`${selected ? styles.ruleSelected : ''} ${choice && correct ? styles.ruleCorrect : ''} ${selected && choice && !correct ? styles.ruleWrong : ''}`}
              >
                <span>{String.fromCharCode(65 + answerIndex)}</span>
                <strong>{answer}</strong>
              </button>
            );
          })}

          {choice && (
            <div className={`${styles.ruleFeedback} ${isCorrect ? styles.ruleFeedbackCorrect : styles.ruleFeedbackWrong}`}>
              <span>{isCorrect ? '✓ Resposta correta' : 'Observe a sequência correta'}</span>
              <strong>{challenge.spokenPinyin}</strong>
              <p>{challenge.explanation}</p>
              <div>
                <button type="button" onClick={speak}>{speaking ? '■ Reproduzindo' : '▶ Ouvir pronúncia'}</button>
                <button type="button" onClick={next}>{index === deck.length - 1 ? 'Ver resultado' : 'Próxima questão'} →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
