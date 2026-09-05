'use client';

import dynamic from 'next/dynamic';

const Hsk1Client = dynamic(() => import('./Hsk1Client'), {
  ssr: false,
  loading: () => <main className="page-loading">Preparando o vocabulário HSK 1…</main>,
});

export default function Hsk1Page() {
  return <Hsk1Client />;
}
