import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lições · Novo HSK | Tons de Mandarim',
  description: 'Estude as lições 11 e 12 separadamente, com vocabulário, diálogos, gramática, escrita e prática oral em mandarim e português.',
};

export default function Hsk1Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
