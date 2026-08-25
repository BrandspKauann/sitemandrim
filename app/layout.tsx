import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { ClientSessionProvider } from './components/ClientSession';
import './globals.css';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tons de Mandarim | Pronúncia chinesa para brasileiros',
  description: 'Converta frases em chinês para pinyin com tons, pronúncia aproximada em português e áudio em mandarim.',
  openGraph: {
    title: 'Tons de Mandarim',
    description: 'Escreva em chinês, veja o pinyin com tons e pratique a pronúncia em português.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Tons de Mandarim',
    description: 'Pronúncia chinesa com pinyin, apoio em português e áudio.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={geist.variable}>
        <ClientSessionProvider>{children}</ClientSessionProvider>
      </body>
    </html>
  );
}
