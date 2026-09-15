import { NextResponse } from 'next/server';
import { REVISION_COOKIE } from '../../../revisao/revisionAuth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.headers.set('Cache-Control', 'private, no-store');
  response.cookies.set(REVISION_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
