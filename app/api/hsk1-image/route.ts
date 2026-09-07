import { env } from 'cloudflare:workers';

const MAX_IMAGE_BYTES = 100 * 1024 * 1024;
const SESSION_PATTERN = /^[a-zA-Z0-9-]{8,80}$/;
const ID_PATTERN = /^[a-z0-9-]{1,80}$/;

function imageBucket() {
  return (env as Record<string, unknown>).HSK1_IMAGES as R2Bucket | undefined;
}

function requestParts(request: Request, itemRequired: boolean) {
  const url = new URL(request.url);
  const session = url.searchParams.get('session') ?? '';
  const group = url.searchParams.get('group') ?? '';
  const item = url.searchParams.get('item') ?? '';

  if (!SESSION_PATTERN.test(session) || !ID_PATTERN.test(group) || (itemRequired && !ID_PATTERN.test(item))) {
    return null;
  }

  return {
    item,
    key: `hsk1/${session}/${group}/${item}.image`,
    prefix: `hsk1/${session}/${group}/`,
  };
}

function storageUnavailable() {
  return Response.json({ error: 'O armazenamento de imagens não está disponível agora.' }, { status: 503 });
}

export async function GET(request: Request) {
  const bucket = imageBucket();
  if (!bucket) return storageUnavailable();

  const url = new URL(request.url);
  const hasItem = url.searchParams.has('item');
  const parts = requestParts(request, hasItem);
  if (!parts) return Response.json({ error: 'Pedido inválido.' }, { status: 400 });

  if (!hasItem) {
    const objects = await bucket.list({ prefix: parts.prefix, limit: 500 });
    const items = objects.objects.map((object) => object.key.slice(parts.prefix.length).replace(/\.image$/, ''));
    return Response.json({ items }, { headers: { 'Cache-Control': 'private, no-store' } });
  }

  const object = await bucket.get(parts.key);
  if (!object) return new Response(null, { status: 404 });

  const headers = new Headers({
    'Cache-Control': 'private, no-store',
    ETag: object.httpEtag,
  });
  object.writeHttpMetadata(headers);
  return new Response(object.body, { headers });
}

export async function PUT(request: Request) {
  const bucket = imageBucket();
  if (!bucket) return storageUnavailable();

  const parts = requestParts(request, true);
  if (!parts) return Response.json({ error: 'Pedido inválido.' }, { status: 400 });

  const contentType = request.headers.get('content-type') ?? '';
  const contentLength = Number(request.headers.get('content-length'));
  if (!contentType.startsWith('image/')) {
    return Response.json({ error: 'Escolha um arquivo de imagem.' }, { status: 415 });
  }
  if (!Number.isFinite(contentLength) || contentLength <= 0 || contentLength > MAX_IMAGE_BYTES) {
    return Response.json({ error: 'A imagem deve ter no máximo 100 MB.' }, { status: 413 });
  }
  if (!request.body) return Response.json({ error: 'A imagem está vazia.' }, { status: 400 });

  await bucket.put(parts.key, request.body, {
    httpMetadata: { contentType },
    customMetadata: { uploadedAt: new Date().toISOString() },
  });

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const bucket = imageBucket();
  if (!bucket) return storageUnavailable();

  const parts = requestParts(request, true);
  if (!parts) return Response.json({ error: 'Pedido inválido.' }, { status: 400 });
  await bucket.delete(parts.key);
  return Response.json({ ok: true });
}
