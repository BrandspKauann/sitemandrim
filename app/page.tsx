'use client';

import dynamic from 'next/dynamic';

const HomeClient = dynamic(() => import('./HomeClient'), {
  ssr: false,
  loading: () => (
    <main className="page-loading" aria-live="polite">
      <span className="brand-mark" aria-hidden="true">声</span>
      <p>Preparando seu espaço de estudo…</p>
    </main>
  ),
});

export default function HomePage() {
  return <HomeClient />;
}
