'use client';

import dynamic from 'next/dynamic';

const TonesClient = dynamic(() => import('./TonesClient'), {
  ssr: false,
  loading: () => (
    <main className="page-loading" aria-live="polite">
      <span className="brand-mark" aria-hidden="true">声</span>
      <p>Preparando as combinações de tons…</p>
    </main>
  ),
});

export default function TonesPage() {
  return <TonesClient />;
}
