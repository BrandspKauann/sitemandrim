'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

const WORDS = [
  ['bed', '床', 'chuáng', 'cama', 'objeto'],
  ['sofa', '沙发', 'shāfā', 'sofá', 'objeto'],
  ['chair', '椅子', 'yǐzi', 'cadeira', 'objeto'],
  ['wardrobe', '衣柜', 'yīguì', 'guarda-roupa', 'objeto'],
  ['bookshelf', '书架', 'shūjià', 'estante', 'objeto'],
  ['window', '窗户', 'chuānghu', 'janela', 'objeto'],
  ['table', '桌子', 'zhuōzi', 'mesa', 'objeto'],
  ['door', '门', 'mén', 'porta', 'objeto'],
  ['kitchen', '厨房', 'chúfáng', 'cozinha', 'cômodo'],
  ['living-room', '客厅', 'kètīng', 'sala', 'cômodo'],
  ['bedroom', '卧室', 'wòshì', 'quarto de dormir', 'cômodo'],
  ['bathroom', '卫生间', 'wèishēngjiān', 'banheiro', 'cômodo'],
  ['study', '书房', 'shūfáng', 'escritório', 'cômodo'],
  ['school', '学校', 'xuéxiào', 'escola', 'lugar'],
  ['hospital', '医院', 'yīyuàn', 'hospital', 'lugar'],
  ['supermarket', '超市', 'chāoshì', 'supermercado', 'lugar'],
  ['restaurant', '饭店', 'fàndiàn', 'restaurante', 'lugar'],
  ['cinema', '电影院', 'diànyǐngyuàn', 'cinema', 'lugar'],
  ['bookstore', '书店', 'shūdiàn', 'livraria', 'lugar'],
  ['subway', '地铁', 'dìtiě', 'metrô', 'transporte'],
  ['book', '书', 'shū', 'livro', 'objeto'],
  ['pen', '笔', 'bǐ', 'caneta', 'objeto'],
  ['phone', '手机', 'shǒujī', 'celular', 'objeto'],
  ['computer', '台式电脑', 'táishì diànnǎo', 'computador de mesa', 'objeto'],
  ['laptop', '笔记本电脑', 'bǐjìběn diànnǎo', 'notebook', 'objeto'],
  ['television', '电视', 'diànshì', 'televisão', 'objeto'],
  ['apple', '苹果', 'píngguǒ', 'maçã', 'comida'],
  ['noodles', '面条儿', 'miàntiáor', 'macarrão', 'comida'],
  ['dumplings', '饺子', 'jiǎozi', 'bolinho chinês', 'comida'],
  ['vegetables', '蔬菜', 'shūcài', 'vegetais', 'comida'],
  ['baozi', '包子', 'bāozi', 'pão chinês', 'comida'],
  ['rice', '米饭', 'mǐfàn', 'arroz cozido', 'comida'],
  ['milk', '牛奶', 'niúnǎi', 'leite', 'comida'],
  ['tea', '茶', 'chá', 'chá', 'comida'],
  ['park', '公园', 'gōngyuán', 'parque', 'lugar'],
  ['taxi', '出租车', 'chūzūchē', 'táxi', 'transporte'],
  ['house', '房子', 'fángzi', 'casa', 'lugar'],
  ['cat', '猫', 'māo', 'gato', 'animal'],
  ['dog', '狗', 'gǒu', 'cachorro', 'animal'],
  ['mall', '商场', 'shāngchǎng', 'shopping', 'lugar'],
  ['shop', '商店', 'shāngdiàn', 'loja', 'lugar'],
  ['convenience-store', '便利店', 'biànlìdiàn', 'loja de conveniência', 'lugar'],
  ['market', '菜市场', 'càishìchǎng', 'feira', 'lugar'],
  ['stationery-store', '文具店', 'wénjùdiàn', 'papelaria', 'lugar'],
  ['flower-shop', '花店', 'huādiàn', 'floricultura', 'lugar'],
  ['bicycle', '自行车', 'zìxíngchē', 'bicicleta', 'transporte'],
  ['bus', '公交车', 'gōngjiāochē', 'ônibus', 'transporte'],
  ['car', '车', 'chē', 'carro', 'transporte'],
  ['fruit', '水果', 'shuǐguǒ', 'frutas', 'comida'],
  ['shower', '浴室', 'yùshì', 'banheiro com chuveiro', 'cômodo'],
  ['water', '水', 'shuǐ', 'água', 'comida'],
].map(([id, hanzi, pinyin, meaning, category]) => ({ id, hanzi, pinyin, meaning, category }));
export const IMAGE_WORD_COUNT = WORDS.length;
type Word = typeof WORDS[number];
// Broader words can also describe a specific picture; keep those pairs apart.
const OVERLAPPING_PAIRS = [
  ['car', 'taxi'], ['car', 'bus'], ['shop', 'supermarket'], ['shop', 'convenience-store'],
  ['shop', 'bookstore'], ['shop', 'stationery-store'], ['shop', 'flower-shop'],
  ['fruit', 'apple'], ['bathroom', 'shower'],
];
function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}
function deck() {
  return shuffle(WORDS).map((word) => {
    const others = shuffle(WORDS.filter((other) => other.id !== word.id && !OVERLAPPING_PAIRS.some((pair) => pair.includes(word.id) && pair.includes(other.id))));
    const nearby = others.filter((other) => other.category === word.category);
    const candidates = [...nearby, ...others.filter((other) => other.category !== word.category)];
    return { ...word, choices: shuffle([word, ...candidates.slice(0, 3)]) };
  });
}

export default function ImageVocabularyGame() {
  const [questions, setQuestions] = useState<ReturnType<typeof deck>>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  function start(reviewOnly = false) {
    const nextDeck = deck();
    setQuestions(reviewOnly ? nextDeck.filter((item) => missed.includes(item.id)) : nextDeck);
    setIndex(0); setSelected(null); setScore(0); setMissed([]); setFinished(false);
  }
  function choose(word: Word) {
    if (selected) return;
    setSelected(word.id);
    if (word.id === questions[index].id) setScore((value) => value + 1);
    else setMissed((items) => [...items, questions[index].id]);
  }
  function speak(word: Word) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.hanzi);
    const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith('zh'));
    utterance.lang = voice?.lang ?? 'zh-CN';
    if (voice) utterance.voice = voice;
    utterance.rate = .8;
    window.speechSynthesis.speak(utterance);
  }
  if (!questions.length || finished) return <section className={styles.translationGame}>
    <div className={styles.translationFinished}>
      <span>看图识词 · Objetos e lugares</span>
      {finished && <strong>{score}<small>/ {questions.length}</small></strong>}
      <h1>{finished ? 'Sua rodada terminou.' : 'Qual palavra combina com a imagem?'}</h1>
      <p>{IMAGE_WORD_COUNT} imagens de objetos, cômodos, lugares, alimentos e animais das aulas. Escolha entre quatro palavras em chinês e pinyin.</p>
      <button type="button" onClick={() => start()}>{finished ? '↻ Jogar novamente' : 'Começar o jogo'}</button>
      {finished && missed.length > 0 && <button type="button" onClick={() => start(true)}>Revisar as {missed.length} que errei</button>}
    </div>
  </section>;
  const question = questions[index];
  return <section className={styles.translationGame} aria-labelledby="image-game-title">
    <header className={styles.translationGameHeader}>
      <div><span>Vocabulário visual</span><h1 id="image-game-title">O que aparece na imagem?</h1><p>Escolha a palavra em mandarim. O significado será revelado depois da resposta.</p></div>
      <div className={styles.translationScore}><strong>{score}</strong><span>acertos</span><small>{index + 1}/{questions.length}</small></div>
    </header>
    <div className={styles.translationProgress}><i style={{ width: `${100 * (index + 1) / questions.length}%` }} /></div>
    <div className={styles.translationQuestion}>
      <div className={styles.imageQuizPrompt}>
        {/* Generic alt text preserves the challenge without revealing the answer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/vocabulary-game/${question.id}.webp`} alt="Imagem do vocabulário para identificar" width="640" height="640" />
      </div>
      <div className={`${styles.translationChoices} ${styles.imageQuizChoices}`}>
        {question.choices.map((word, position) => <button type="button" key={word.id} disabled={Boolean(selected)} onClick={() => choose(word)} className={`${selected && word.id === question.id ? styles.translationCorrect : ''} ${selected === word.id && word.id !== question.id ? styles.translationWrong : ''}`}>
          <span>{String.fromCharCode(65 + position)}</span><div><strong lang="zh-CN">{word.hanzi}</strong><small>{word.pinyin}</small></div>
        </button>)}
        {selected && <div className={`${styles.translationFeedback} ${selected === question.id ? styles.translationFeedbackCorrect : styles.translationFeedbackWrong}`} role="status">
          <span>{selected === question.id ? '✓ Você acertou!' : 'A resposta correta é:'}</span>
          <strong lang="zh-CN">{question.hanzi} · {question.pinyin}</strong><p>{question.meaning}</p>
          <div><button type="button" onClick={() => speak(question)}>▶ Ouvir em mandarim</button><button type="button" onClick={() => { window.speechSynthesis?.cancel(); if (index === questions.length - 1) setFinished(true); else { setIndex(index + 1); setSelected(null); } }}>{index === questions.length - 1 ? 'Ver resultado' : 'Próxima imagem'} →</button></div>
        </div>}
      </div>
    </div>
  </section>;
}
