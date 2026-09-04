'use client';

import dynamic from 'next/dynamic';

const ExercisesClient = dynamic(() => import('./ExercisesClient'), {
  ssr: false,
  loading: () => (
    <main className="page-loading" aria-live="polite">
      <span className="brand-mark" aria-hidden="true">声</span>
      <p>Preparando seus exercícios…</p>
    </main>
  ),
});

export default function ExercisesPage() {
  return <ExercisesClient />;
}
