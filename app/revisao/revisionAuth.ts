export const REVISION_COOKIE = '__Host-tons-de-mandarim-revisao';
export const REVISION_SESSION_SECONDS = 60 * 60 * 12;

const TOKEN_MESSAGE = 'tons-de-mandarim:revisao:v2';

export function revisionPassword() {
  return process.env.REVISAO_PASSWORD ?? '';
}

async function signRevisionSession(password: string, payload: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(`${TOKEN_MESSAGE}:${payload}`)));
  return Array.from(signature, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createRevisionSession() {
  const password = revisionPassword();
  if (!password) throw new Error('Revisão sem senha configurada.');
  const issuedAt = Date.now();
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(24)),
    (byte) => byte.toString(16).padStart(2, '0')).join('');
  const payload = `${issuedAt}.${nonce}`;
  return `${payload}.${await signRevisionSession(password, payload)}`;
}

export function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export async function validRevisionCookie(value?: string) {
  const password = revisionPassword();
  if (!password || !value) return false;
  const match = /^(\d{13})\.([0-9a-f]{48})\.([0-9a-f]{64})$/.exec(value);
  if (!match) return false;
  const issuedAt = Number(match[1]);
  const age = Date.now() - issuedAt;
  if (!Number.isSafeInteger(issuedAt) || age < 0 || age > REVISION_SESSION_SECONDS * 1000) return false;
  return safeEqual(match[3], await signRevisionSession(password, `${match[1]}.${match[2]}`));
}
