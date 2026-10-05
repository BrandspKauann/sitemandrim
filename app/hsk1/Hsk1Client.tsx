'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useClientSession } from '../components/ClientSession';
import Lesson11Client from './Lesson11Client';
import styles from './page.module.css';

// Each lesson owns its study content and playback state. Add new lessons here.
const LESSONS = [{ id: 'lesson-11', name: 'Lição 11', title: '我读大学呢', description: 'Estou cursando a universidade · páginas 78–85', Content: Lesson11Client }];

export default function Hsk1Client() {
  const { shortId } = useClientSession();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const selectedLesson = LESSONS.find(lesson => lesson.id === selectedLessonId);
  return <main className={styles.page}>
    <header className={styles.topbar}>
      <Link className={styles.brand} href="/" aria-label="Tons de Mandarim, início"><span className={styles.brandMark} aria-hidden="true">词</span><span>Tons de Mandarim</span></Link>
      <nav className={styles.nav} aria-label="Navegação principal">
        <span className="session-badge"><i aria-hidden="true" /><span>Sessão {shortId || 'privada'}</span></span>
        <Link href="/">Frases</Link><Link href="/letras-e-silabas">Letras e sílabas</Link><Link href="/exercicios">Exercícios</Link><Link href="/tons">Tons</Link><Link className={styles.activeNav} href="/hsk1">HSK1</Link><Link href="/revisao">Revisão</Link><Link href="/simulado">Simulado HSK</Link>
      </nav>
    </header>
    {selectedLesson ? <>
      <div className={styles.lessonNavigation}><button type="button" onClick={() => setSelectedLessonId(null)}>← Todas as lições</button><strong>HSK1 / {selectedLesson.name}</strong></div>
      <selectedLesson.Content key={selectedLesson.id} />
    </> : <section className={styles.lessonCatalog} aria-label="Lições do HSK1">
      <span className={styles.eyebrow}>Novo HSK · Volume 1</span><h1>Estude por lição.</h1><p>Escolha uma lição para abrir seu vocabulário, diálogos, áudio e exercícios. Cada lição fica separada das outras.</p>
      <div className={styles.lessonCards}>{LESSONS.map(lesson => <button key={lesson.id} type="button" onClick={() => setSelectedLessonId(lesson.id)} aria-label={'Abrir ' + lesson.name}><span>{lesson.name}</span><strong lang="zh-CN">{lesson.title}</strong><p>{lesson.description}</p><small>25 palavras · 3 diálogos · gramática · escrita · prática oral</small><b>Abrir lição →</b></button>)}</div>
      <p>As próximas lições serão adicionadas quando você pedir.</p>
    </section>}
    <footer className={styles.footer}><span className={styles.brandMark} aria-hidden="true">词</span><p>Seu estudo organizado por lições.</p><Link href="/">Voltar para frases →</Link></footer>
  </main>;
}
