'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import RevisionHeader from './RevisionHeader';
import styles from './page.module.css';

const PRACTICE_AREAS = [
  { marker: '写', name: 'Escrever', description: 'Ditados, reconstrução de frases e exercícios com os caracteres usados na aula.' },
  { marker: '说', name: 'Falar', description: 'Repetição guiada, gravação e comparação da sua pronúncia com o mandarim.' },
  { marker: '听', name: 'Ouvir', description: 'Trechos curtos, compreensão e identificação das palavras trabalhadas pela professora.' },
];

export default function RevisionHome() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  async function leave() {
    setLeaving(true);
    try {
      await fetch('/api/revisao/logout', { method: 'POST', credentials: 'same-origin' });
      router.refresh();
    } finally {
      setLeaving(false);
    }
  }

  return (
    <main className={styles.page}>
      <RevisionHeader />
      <section className={styles.reviewArea}>
        <div className={styles.reviewHeading}>
          <div>
            <span className={styles.eyebrow}>Meu caderno de revisão</span>
            <h1>Revisão das aulas</h1>
            <p>Cada transcrição será transformada em uma aula separada, com prática de escrita, fala e escuta.</p>
          </div>
          <button className={styles.leaveButton} type="button" onClick={() => void leave()} disabled={leaving}>
            {leaving ? 'Saindo…' : 'Sair da área protegida'}
          </button>
        </div>

        <div className={styles.lessonTabs} role="tablist" aria-label="Aulas disponíveis">
          <button className={styles.activeLesson} type="button" role="tab" aria-selected="true">
            <span>Aula 1</span>
            <small>Em preparação</small>
          </button>
        </div>

        <section className={styles.lessonPanel} aria-labelledby="lesson-one-title">
          <div className={styles.lessonTitle}>
            <div>
              <span>Aula 01</span>
              <h2 id="lesson-one-title">Conteúdo da primeira aula</h2>
            </div>
            <b>Aguardando o resumo correto</b>
          </div>

          <div className={styles.emptyLesson}>
            <strong>下一步 · próximo passo</strong>
            <h3>Envie a transcrição da aula.</h3>
            <p>O arquivo recebido até agora é uma credencial técnica, não o resumo. Quando a transcrição correta for enviada, esta aula receberá as frases, explicações e exercícios correspondentes.</p>
          </div>

          <div className={styles.practiceGrid}>
            {PRACTICE_AREAS.map((area) => (
              <article key={area.name}>
                <span lang="zh-CN">{area.marker}</span>
                <div><h3>{area.name}</h3><p>{area.description}</p></div>
                <small>Será liberado com o conteúdo da aula</small>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
