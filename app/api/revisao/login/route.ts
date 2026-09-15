import { NextResponse } from 'next/server';
import {
  REVISION_COOKIE,
  createRevisionSession,
  revisionPassword,
  safeEqual,
} from '../../../revisao/revisionAuth';

type LoginBody = {
  password?: unknown;
};

export async function POST(request: Request) {
  const configuredPassword = revisionPassword();
  if (!configuredPassword) {
    return NextResponse.json({ error: 'O acesso à revisão ainda não foi configurado.' }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as LoginBody | null;
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!password) {
    return NextResponse.json({ error: 'Digite a senha.' }, { status: 400 });
  }
  if (!safeEqual(password, configuredPassword)) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set('Cache-Control', 'private, no-store');
  response.cookies.set(REVISION_COOKIE, await createRevisionSession(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
  return response;
}
