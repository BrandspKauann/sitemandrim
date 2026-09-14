import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import RevisionHome from './RevisionHome';
import RevisionLogin from './RevisionLogin';
import { REVISION_COOKIE, revisionPassword, validRevisionCookie } from './revisionAuth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Revisão das aulas | Tons de Mandarim',
  description: 'Área protegida para revisar escrita, fala e compreensão das aulas de mandarim.',
  robots: { index: false, follow: false },
};

export default async function RevisionPage() {
  const cookieStore = await cookies();
  const configured = Boolean(revisionPassword());
  const authenticated = configured && await validRevisionCookie(cookieStore.get(REVISION_COOKIE)?.value);
  return authenticated ? <RevisionHome /> : <RevisionLogin configured={configured} />;
}
