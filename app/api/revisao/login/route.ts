import { NextResponse } from 'next/server';
import {
  REVISION_COOKIE,
  REVISION_COOKIE_MAX_AGE,
  revisionPassword,
  revisionToken,
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
  const [receivedToken, expectedToken] = await Promise.all([
    revisionToken(password),
    revisionToken(configuredPassword),
  ]);

  if (!safeEqual(receivedToken, expectedToken)) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(REVISION_COOKIE, expectedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: REVISION_COOKIE_MAX_AGE,
  });
  return response;
}
