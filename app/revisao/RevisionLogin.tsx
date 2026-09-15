'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import RevisionHeader from './RevisionHeader';
import styles from './page.module.css';

export default function RevisionLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/revisao/login', {
        method: 'POST',
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? 'Não foi possível liberar o acesso.');
        return;
      }
      setPassword('');
      router.refresh();
    } catch {
      setError('Não foi possível liberar o acesso. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <RevisionHeader />
      <section className={styles.loginArea}>
        <div className={styles.loginCopy}>
          <span className={styles.eyebrow}>复习 · fùxí</span>
          <h1>Revisão das aulas.</h1>
          <p>Um espaço reservado para praticar o conteúdo trabalhado com a professora: escrever, falar e ouvir.</p>
          <div className={styles.accessNote}>
            <span aria-hidden="true">锁</span>
            <p>O material das aulas fica separado do restante do site e só aparece depois da senha correta.</p>
          </div>
        </div>

        <form className={styles.loginCard} onSubmit={submit}>
          <span className={styles.cardLabel}>Conteúdo protegido</span>
          <h2>Digite a senha</h2>
          <p>O acesso vale apenas nesta sessão do navegador, por até 12 horas. Outros visitantes precisam digitar a própria senha.</p>
          <label htmlFor="revision-password">Senha da revisão</label>
          <div className={styles.passwordField}>
            <input id="revision-password" type={showPassword ? 'text' : 'password'} value={password}
              onChange={(event) => setPassword(event.target.value)} autoComplete="current-password"
              disabled={!configured || submitting} required autoFocus />
            <button type="button" onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          {!configured && <p className={styles.error} role="alert">O acesso ainda não foi configurado no servidor.</p>}
          <button className={styles.enterButton} type="submit" disabled={!configured || submitting || !password}>
            {submitting ? 'Verificando…' : 'Entrar na revisão'}
          </button>
        </form>
      </section>
    </main>
  );
}
