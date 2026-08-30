const MAX_TEXT_LENGTH = 120;
const MAX_UTF8_BYTES = 500;

type TranslationResponse = {
  responseData?: {
    translatedText?: string;
  };
};

export async function POST(request: Request) {
  let body: { text?: unknown };

  try {
    body = await request.json() as { text?: unknown };
  } catch {
    return Response.json({ error: 'Pedido de tradução inválido.' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) return Response.json({ error: 'Digite uma frase para traduzir.' }, { status: 400 });

  const byteLength = new TextEncoder().encode(text).length;
  if (text.length > MAX_TEXT_LENGTH || byteLength > MAX_UTF8_BYTES) {
    return Response.json({ error: 'A frase é longa demais para tradução.' }, { status: 400 });
  }

  const endpoint = new URL('https://api.mymemory.translated.net/get');
  endpoint.searchParams.set('q', text);
  endpoint.searchParams.set('langpair', 'zh-CN|pt-BR');
  endpoint.searchParams.set('mt', '1');

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Translation service returned ${response.status}`);

    const data = await response.json() as TranslationResponse;
    const translation = data.responseData?.translatedText?.trim();
    if (!translation) throw new Error('Translation service returned an empty result');

    return Response.json({ translation });
  } catch (error) {
    console.error('Portuguese translation failed', error);
    return Response.json({ error: 'Não foi possível traduzir agora.' }, { status: 502 });
  }
}
