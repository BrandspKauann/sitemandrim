import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lições · Novo HSK | Tons de Mandarim',
  description: 'Prepare a lição 11 completa: vocabulário, três diálogos, gramática, escrita e prática oral com áudio em mandarim e português.',
};

export default function Hsk1Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
