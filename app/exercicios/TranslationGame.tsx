'use client';

import { pinyin } from 'pinyin-pro';
import { useEffect, useMemo, useState } from 'react';
import { KEY_PHRASES, type LessonPhrase } from '../revisao/aula1Data';
import { AULA2_KEY_PHRASES } from '../revisao/aula2Data';
import { AULA3_KEY_PHRASES } from '../revisao/aula3Data';
import { AULA4_KEY_PHRASES } from '../revisao/aula4Data';
import { AULA5_KEY_PHRASES } from '../revisao/aula5Data';
import styles from './page.module.css';

type GamePhrase = LessonPhrase & { lesson: string };
type Question = GamePhrase & { choices: string[] };

const ALL_PHRASES: GamePhrase[] = [
  ...KEY_PHRASES.map((phrase) => ({ ...phrase, lesson: 'Aula 1' })),
  ...AULA2_KEY_PHRASES.map((phrase) => ({ ...phrase, lesson: 'Aula 2' })),
  ...AULA3_KEY_PHRASES.map((phrase) => ({ ...phrase, lesson: 'Aula 3' })),
  ...AULA4_KEY_PHRASES.map((phrase) => ({ ...phrase, lesson: 'Aula 4' })),
  ...AULA5_KEY_PHRASES.map((phrase) => ({ ...phrase, lesson: 'Aula 5' })),
].filter((phrase, index, phrases) =>
  phrases.findIndex((candidate) => candidate.hanzi === phrase.hanzi && candidate.translation === phrase.translation) === index,
);

const STOP_WORDS = new Set(['a', 'ao', 'as', 'de', 'da', 'das', 'do', 'dos', 'e', 'em', 'o', 'os', 'um', 'uma']);

function shuffled<T>(items: T[]) {
  return [...items]
    .map((item) => ({ item, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}

function words(value: string) {
  return new Set(value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word)));
}

function similarity(current: GamePhrase, candidate: GamePhrase) {
  const currentWords = words(current.translation);
  const candidateWords = words(candidate.translation);
  const shared = [...currentWords].filter((word) => candidateWords.has(word)).length;
  const sameLesson = current.lesson === candidate.lesson ? 5 : 0;
  const bothQuestions = current.hanzi.endsWith('？') === candidate.hanzi.endsWith('？') ? 4 : 0;
  const lengthDistance = Math.abs(current.translation.length - candidate.translation.length);
  return shared * 12 + sameLesson + bothQuestions - Math.min(lengthDistance, 30) / 5;
}

function makeQuestion(phrase: GamePhrase): Question {
  const uniqueTranslations = new Set<string>();
  const candidates = ALL_PHRASES
    .filter((candidate) => candidate.id !== phrase.id && candidate.translation !== phrase.translation)
    .sort((a, b) => similarity(phrase, b) - similarity(phrase, a));

  const closeCandidates = shuffled(candidates.slice(0, 12));
  const distractors: string[] = [];
  for (const candidate of [...closeCandidates, ...candidates]) {
    if (uniqueTranslations.has(candidate.translation)) continue;
    uniqueTranslations.add(candidate.translation);
    distractors.push(candidate.translation);
    if (distractors.length === 3) break;
  }

  return { ...phrase, choices: shuffled([phrase.translation, ...distractors]) };
}

function createDeck() {
  return shuffled(ALL_PHRASES).map(makeQuestion);
}

function phrasePinyin(phrase: GamePhrase) {
  return phrase.spokenPinyin ?? pinyin(phrase.hanzi, {
    type: 'string', toneType: 'symbol', toneSandhi: true, nonZh: 'consecutive',
  });
}

export const TRANSLATION_PHRASE_COUNT = ALL_PHRASES.length;

export default function TranslationGame() {
  const [deck, setDeck] = useState<Question[]>(() => createDeck());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const question = deck[index];
  const correct = selected === question.translation;
  const progress = finished ? 100 : ((index + 1) / deck.length) * 100;

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function choose(choice: string) {
    if (selected) return;
    setSelected(choice);
    if (choice === question.translation) setScore((value) => value + 1);
  }

  function next() {
    if (index >= deck.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  function restart() {
    window.speechSynthesis?.cancel();
    setDeck(createDeck());
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  function speak() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.hanzi);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((item) => item.lang.toLowerCase() === 'zh-cn')
      ?? voices.find((item) => item.lang.toLowerCase().startsWith('zh'));
    utterance.lang = voice?.lang ?? 'zh-CN';
    utterance.rate = 0.78;
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  if (finished) {
    const percentage = Math.round((score / deck.length) * 100);
    return (
      <section className={styles.translationGame} aria-live="polite">
        <div className={styles.translationFinished}>
          <span>复习完成 · revisão concluída</span>
          <strong>{score}<small>/ {deck.length}</small></strong>
          <h1>{percentage >= 85 ? 'Você reconheceu muito bem as frases.' : percentage >= 60 ? 'Bom resultado — revise as respostas que confundiram.' : 'Vamos repetir para fixar os significados.'}</h1>
          <p>Na próxima tentativa, as frases e as quatro alternativas aparecerão em uma ordem diferente.</p>
          <button type="button" onClick={restart}>↻ Jogar novamente</button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.translationGame} aria-labelledby="translation-game-title">
      <header className={styles.translationGameHeader}>
        <div>
          <span>Tradução das aulas</span>
          <h1 id="translation-game-title">O que esta frase significa?</h1>
          <p>Leia o mandarim e escolha a tradução correta entre quatro alternativas parecidas.</p>
        </div>
        <div className={styles.translationScore}><strong>{score}</strong><span>acertos</span><small>{index + 1}/{deck.length}</small></div>
      </header>

      <div className={styles.translationProgress} aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>

      <div className={styles.translationQuestion}>
        <div className={styles.translationPrompt}>
          <span>{question.lesson} · frase {index + 1}</span>
          <strong lang="zh-CN">{question.hanzi}</strong>
          <p>Escolha o significado em português:</p>
        </div>

        <div className={styles.translationChoices}>
          {question.choices.map((choice, choiceIndex) => {
            const isSelected = selected === choice;
            const isCorrect = choice === question.translation;
            return (
              <button
                type="button"
                key={choice}
                disabled={Boolean(selected)}
                onClick={() => choose(choice)}
                className={`${isSelected ? styles.translationSelected : ''} ${selected && isCorrect ? styles.translationCorrect : ''} ${isSelected && selected && !isCorrect ? styles.translationWrong : ''}`}
              >
                <span>{String.fromCharCode(65 + choiceIndex)}</span>
                <strong>{choice}</strong>
              </button>
            );
          })}

          {selected && (
            <div className={`${styles.translationFeedback} ${correct ? styles.translationFeedbackCorrect : styles.translationFeedbackWrong}`}>
              <span>{correct ? '✓ Resposta correta' : 'A tradução correta é:'}</span>
              <strong>{question.translation}</strong>
              <p lang="zh-Latn">{phrasePinyin(question)}</p>
              <div>
                <button type="button" onClick={speak}>{speaking ? '■ Reproduzindo' : '▶ Ouvir em mandarim'}</button>
                <button type="button" onClick={next}>{index === deck.length - 1 ? 'Ver resultado' : 'Próxima frase'} →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
