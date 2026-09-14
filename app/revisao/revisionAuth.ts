export const REVISION_COOKIE = 'tons-de-mandarim-revisao';
export const REVISION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const TOKEN_MESSAGE = 'tons-de-mandarim:revisao:v1';

export function revisionPassword() {
  return process.env.REVISAO_PASSWORD ?? '';
}

export async function revisionToken(password: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(TOKEN_MESSAGE)));
  return Array.from(signature, (byte) => byte.toString(16).padStart(2, '0')).join('');
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
  return safeEqual(value, await revisionToken(password));
}
