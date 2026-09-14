import Link from 'next/link';
import styles from './page.module.css';

export default function RevisionHeader() {
  return (
    <header className={styles.topbar}>
      <Link className={styles.brand} href="/" aria-label="Tons de Mandarim, início">
        <span className={styles.brandMark} aria-hidden="true">复</span>
        <span>Tons de Mandarim</span>
      </Link>
      <nav className={styles.nav} aria-label="Navegação principal">
        <Link href="/">Frases</Link>
        <Link href="/letras-e-silabas">Letras e sílabas</Link>
        <Link href="/exercicios">Exercícios</Link>
        <Link href="/tons">Tons</Link>
        <Link href="/hsk1">HSK1</Link>
        <Link className={styles.activeNav} href="/revisao">Revisão</Link>
      </nav>
    </header>
  );
}
