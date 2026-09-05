import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vocabulário HSK 1 | Tons de Mandarim',
  description: 'Pratique palavras do HSK 1 por assunto, com áudio, repetição e intervalo ajustável.',
};

export default function Hsk1Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
