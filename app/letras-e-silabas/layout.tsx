import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Letras e sílabas do pinyin | Tons de Mandarim',
  description: 'Pratique iniciais, finais e sílabas do pinyin com áudio em mandarim e aproximações de pronúncia em português.',
};

export default function LettersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
