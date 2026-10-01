'use client';

import { pinyin } from 'pinyin-pro';
import { useEffect, useRef, useState } from 'react';
import type { VocabularyGroup } from './aula1Data';
import styles from './page.module.css';

type Word = VocabularyGroup['words'][number];

export default function VocabularyPractice({ groups }: { groups: VocabularyGroup[] }) {
  const [slow, setSlow] = useState(false);
  const [loop, setLoop] = useState(false);
  const [interval, setIntervalValue] = useState(1);
  const [draftInterval, setDraftInterval] = useState('1');
  const [active, setActive] = useState<Word | null>(null);
  const [phase, setPhase] = useState('');
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState('');
  const run = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<(() => void) | null>(null);
  const deadline = useRef(0);
  const remaining = useRef(0);
  const pausedRef = useRef(false);
  const options = useRef({ slow, loop, interval });
  options.current = { slow, loop, interval };

  function stop() {
    run.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    pending.current = null;
    pausedRef.current = false;
    window.speechSynthesis?.cancel();
    setActive(null);
    setPaused(false);
    setPhase('');
  }

  useEffect(() => () => {
    run.current += 1;
    if (timer.current) clearTimeout(timer.current);
    window.speechSynthesis?.cancel();
  }, []);

  function wait(ms: number, callback: () => void) {
    remaining.current = ms;
    pending.current = callback;
    deadline.current = performance.now() + ms;
    if (!pausedRef.current) timer.current = setTimeout(() => {
      timer.current = null;
      pending.current = null;
      callback();
    }, ms);
  }

  function play(words: Word[]) {
    stop();
    if (!('speechSynthesis' in window)) {
      setMessage('A reprodução de voz não está disponível neste navegador.');
      return;
    }
    setMessage('');
    const token = run.current;
    function speak(text: string, language: 'zh-CN' | 'pt-BR', done: () => void) {
      if (run.current !== token) return;
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((item) => item.lang.toLowerCase() === language.toLowerCase())
        ?? voices.find((item) => item.lang.toLowerCase().startsWith(language.split('-')[0]));
      utterance.lang = voice?.lang ?? language;
      if (voice) utterance.voice = voice;
      utterance.rate = language === 'pt-BR' ? 1.08 : options.current.slow ? 0.58 : 0.88;
      utterance.onend = () => { if (run.current === token) done(); };
      utterance.onerror = (event) => {
        if (run.current !== token || event.error === 'canceled' || event.error === 'interrupted') return;
        stop();
        setMessage('Não foi possível reproduzir a voz. Tente novamente.');
      };
      window.speechSynthesis.speak(utterance);
    }
    function next(index: number) {
      if (run.current !== token) return;
      const word = words[index];
      setActive(word);
      setPhase('Mandarim');
      speak(word.hanzi, 'zh-CN', () => {
        setPhase('Português em 1 segundo');
        wait(1000, () => {
          if (run.current !== token) return;
          setPhase('Português');
          speak(word.translation, 'pt-BR', () => {
            if (index + 1 < words.length || options.current.loop) {
              setPhase('Intervalo');
              wait(options.current.interval * 1000, () => next((index + 1) % words.length));
            } else stop();
          });
        });
      });
    }
    if (words.length) next(0);
  }

  function togglePause() {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    if (pausedRef.current) {
      window.speechSynthesis.pause();
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        remaining.current = Math.max(0, deadline.current - performance.now());
      }
    } else {
      window.speechSynthesis.resume();
      if (pending.current) wait(remaining.current, pending.current);
    }
  }

  return <>
    <div className={styles.vocabularyPlayer}>
      <p aria-live="polite">{active ? `${active.hanzi} · ${paused ? 'Pausado' : phase}` : 'Mandarim → pausa de 1 segundo → significado em português'}</p>
      <div className={styles.vocabularyControls}>
        <button type="button" onClick={() => play(groups.flatMap((group) => group.words))}>▶ Ouvir todas as palavras</button>
        <button type="button" disabled={!active} onClick={togglePause}>{paused ? 'Continuar' : 'Pausar'}</button>
        <button type="button" disabled={!active} onClick={stop}>Parar</button>
        <button type="button" aria-pressed={!slow} onClick={() => setSlow(false)}>Natural</button>
        <button type="button" aria-pressed={slow} onClick={() => setSlow(true)}>Devagar</button>
        <button type="button" aria-pressed={loop} onClick={() => setLoop(!loop)}>↻ Loop {loop ? 'ativado' : 'desativado'}</button>
      </div>
      <label>Intervalo entre palavras e repetições
        <input type="number" min="1" max="60" step="0.5" value={draftInterval} onChange={(event) => setDraftInterval(event.target.value)} /> segundos
        <button type="button" onClick={() => { const value = Number(draftInterval); if (Number.isFinite(value) && value >= 1 && value <= 60) { setIntervalValue(value); setMessage('Intervalo salvo.'); } else setMessage('Escolha um intervalo de 1 a 60 segundos.'); }}>Salvar</button>
        <small>Em uso: {interval}s</small>
      </label>
      {message && <p role="status">{message}</p>}
    </div>
    <div className={styles.vocabularyGroups}>
      {groups.map((group, groupIndex) => <details key={group.title} open={groupIndex === 0}>
        <summary><span>{group.title}</span><small>{group.words.length} itens</small></summary>
        <p>{group.description}</p>
        <button className={styles.vocabularyGroupPlay} type="button" onClick={() => play(group.words)}>▶ Ouvir este grupo</button>
        <div className={styles.wordGrid}>{group.words.map((word) => <article key={word.hanzi} className={active === word ? styles.activeVocabularyWord : undefined}>
          <span lang="zh-CN">{word.hanzi}</span>
          <b>{pinyin(word.hanzi, { toneType: 'symbol', toneSandhi: true })}</b>
          <small>{word.translation}</small>
          {word.note && <em>{word.note}</em>}
          <button type="button" onClick={() => play([word])}>▶ Ouvir os dois</button>
        </article>)}</div>
      </details>)}
    </div>
  </>;
}
