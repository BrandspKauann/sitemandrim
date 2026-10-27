'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useClientSession } from '../components/ClientSession';
import Lesson11Client from './Lesson11Client';
import styles from './page.module.css';
import { LESSON11, LESSON12, LESSON13, LESSON14, LESSON15 } from './lessons';
import { HSK2_LESSON1 } from '../exercicios/hsk2/lesson1';
import { HSK2_LESSON2 } from '../exercicios/hsk2/lesson2';
import { HSK2_LESSON3 } from '../exercicios/hsk2/lesson3';
import { HSK2_LESSON4 } from '../exercicios/hsk2/lesson4';

// Each lesson owns its study content and playback state. Add new lessons here.
const LESSONS = [LESSON11, LESSON12, LESSON13, LESSON14, LESSON15].map(lesson => ({id: `lesson-${lesson.number}`, name: `Lição ${lesson.number}`, ...lesson}));
const HSK2_LESSONS = [HSK2_LESSON1, HSK2_LESSON2, HSK2_LESSON3, HSK2_LESSON4].map(lesson => ({id:`hsk2-lesson-${lesson.number}`,name:`Lição ${lesson.number}`,...lesson}));

export default function Hsk1Client() {
  const { shortId } = useClientSession();
  const [level, setLevel] = useState<'HSK1' | 'HSK2'>(() => typeof window !== 'undefined' && window.location.hash === '#hsk2' ? 'HSK2' : 'HSK1');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const lessons = level === 'HSK1' ? LESSONS : HSK2_LESSONS;
  const selectedLesson = lessons.find(lesson => lesson.id === selectedLessonId);
  return <main className={styles.page}>
    <header className={styles.topbar}>
      <Link className={styles.brand} href="/" aria-label="Tons de Mandarim, início"><span className={styles.brandMark} aria-hidden="true">词</span><span>Tons de Mandarim</span></Link>
      <nav className={styles.nav} aria-label="Navegação principal">
        <span className="session-badge"><i aria-hidden="true" /><span>Sessão {shortId || 'privada'}</span></span>
        <Link href="/">Frases</Link><Link href="/letras-e-silabas">Letras e sílabas</Link><Link href="/exercicios">Exercícios</Link><Link href="/tons">Tons</Link><Link className={styles.activeNav} href="/hsk">HSK</Link><Link href="/revisao">Revisão</Link><Link href="/simulado">Simulado HSK</Link>
      </nav>
    </header>
    <div className={styles.levelTabs} role="tablist" aria-label="Níveis HSK">{(['HSK1','HSK2'] as const).map(value => <button key={value} type="button" role="tab" aria-selected={level===value} onClick={() => { setSelectedLessonId(null); setLevel(value); window.history.replaceState(null,'',value==='HSK2'?'#hsk2':'#hsk1'); }}>{value}<small>{value==='HSK1'?'Lições 11 a 15':'Lições 1 a 4'}</small></button>)}</div>
    {selectedLesson ? <>
      <div className={styles.lessonNavigation}><button type="button" onClick={() => setSelectedLessonId(null)}>← Todas as lições do {level}</button><strong>{level} / {selectedLesson.name}</strong></div>
      <Lesson11Client key={selectedLesson.id} lesson={selectedLesson} />
    </> : <section className={styles.lessonCatalog} aria-label={`Lições do ${level}`}>
      <span className={styles.eyebrow}>Novo HSK · Volume {level==='HSK1'?1:2}</span><h1>{level} · Estude por lição.</h1><p>Escolha uma lição para abrir seu vocabulário, diálogos, áudio e exercícios. Cada nível e cada lição ficam separados.</p>
      <div className={styles.lessonCards}>{lessons.map(lesson => <button key={lesson.id} type="button" onClick={() => setSelectedLessonId(lesson.id)} aria-label={'Abrir ' + lesson.name}><span>{lesson.name}</span><strong lang="zh-CN">{lesson.title}</strong><p>{lesson.description}</p><small>{lesson.groups[0].items.length} palavras · {level==='HSK2'?'4 textos':'3 diálogos'} · gramática · escrita · prática oral</small><b>Abrir lição →</b></button>)}</div>
      <p>As próximas lições serão adicionadas quando você pedir.</p>
    </section>}
    <footer className={styles.footer}><span className={styles.brandMark} aria-hidden="true">词</span><p>Seu estudo organizado por lições.</p><Link href="/">Voltar para frases →</Link></footer>
  </main>;
}
