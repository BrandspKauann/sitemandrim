import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Combinações de tons | Tons de Mandarim',
  description: 'Pratique palavras chinesas agrupadas pelas combinações dos tons do mandarim.',
};

export default function TonesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
