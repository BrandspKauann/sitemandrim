const MAX_TEXT_LENGTH = 120;
const MAX_UTF8_BYTES = 500;
const MAX_ALIGNMENT_SEGMENTS = 32;

type ProviderResponse = {
  responseData?: {
    translatedText?: string;
  };
  matches?: Array<{
    translation?: string;
  }>;
};

type ProviderResult = {
  translation: string;
  candidates: string[];
};

const providerCache = new Map<string, ProviderResult>();

async function translateWithProvider(text: string): Promise<ProviderResult> {
  const cached = providerCache.get(text);
  if (cached) return cached;

  const endpoint = new URL('https://api.mymemory.translated.net/get');
  endpoint.searchParams.set('q', text);
  endpoint.searchParams.set('langpair', 'zh-CN|pt-BR');
  endpoint.searchParams.set('mt', '1');

  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Translation service returned ${response.status}`);

  const data = await response.json() as ProviderResponse;
  const translation = data.responseData?.translatedText?.trim();
  if (!translation) throw new Error('Translation service returned an empty result');

  const candidates = Array.from(new Set([
    translation,
    ...(data.matches ?? []).map((match) => match.translation?.trim()).filter((item): item is string => Boolean(item)),
  ])).slice(0, 6);
  const result = { translation, candidates };
  providerCache.set(text, result);
  return result;
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, mapper: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

export async function POST(request: Request) {
  let body: { text?: unknown; preferredTranslation?: unknown };

  try {
    body = await request.json() as { text?: unknown; preferredTranslation?: unknown };
  } catch {
    return Response.json({ error: 'Pedido de tradução inválido.' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const preferredTranslation = typeof body.preferredTranslation === 'string'
    ? body.preferredTranslation.trim().slice(0, 500)
    : '';
  if (!text) return Response.json({ error: 'Digite uma frase para traduzir.' }, { status: 400 });

  const byteLength = new TextEncoder().encode(text).length;
  if (text.length > MAX_TEXT_LENGTH || byteLength > MAX_UTF8_BYTES) {
    return Response.json({ error: 'A frase é longa demais para tradução.' }, { status: 400 });
  }

  try {
    const fullTranslation = preferredTranslation || (await translateWithProvider(text)).translation;
    const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' });
    const segments = Array.from(segmenter.segment(text))
      .filter((segment) => segment.isWordLike && /[\u3400-\u9fff]/u.test(segment.segment))
      .slice(0, MAX_ALIGNMENT_SEGMENTS);
    const uniqueWords = Array.from(new Set(segments.map((segment) => segment.segment)));
    const translatedWords = await mapWithConcurrency(uniqueWords, 5, translateWithProvider);
    const candidatesByWord = new Map(uniqueWords.map((word, index) => [word, translatedWords[index].candidates]));

    const alignments = segments.map((segment) => ({
      source: segment.segment,
      sourceStart: segment.index,
      sourceEnd: segment.index + segment.segment.length,
      translations: candidatesByWord.get(segment.segment) ?? [],
    }));

    return Response.json({ translation: fullTranslation, alignments });
  } catch (error) {
    console.error('Portuguese translation failed', error);
    return Response.json({ error: 'Não foi possível traduzir agora.' }, { status: 502 });
  }
}
