'use client';

import { pinyin } from 'pinyin-pro';
import { useMemo, useState } from 'react';

type Syllable = {
  hanzi: string;
  pinyin: string;
  plain: string;
  tone: number;
  portuguese: string;
};

const EXAMPLES = [
  { label: 'Bom dia', phrase: '早上好' },
  { label: 'Obrigado', phrase: '谢谢你' },
  { label: 'Mais devagar', phrase: '请慢一点说' },
  { label: 'Até mais', phrase: '再见' },
];

const INITIALS = [
  ['zh', 'dj'], ['ch', 'tch'], ['sh', 'sh'],
  ['b', 'p'], ['p', 'p'], ['m', 'm'], ['f', 'f'],
  ['d', 't'], ['t', 't'], ['n', 'n'], ['l', 'l'],
  ['g', 'k'], ['k', 'k'], ['h', 'r'],
  ['j', 'dj'], ['q', 'tch'], ['x', 'sh'], ['r', 'j'],
  ['z', 'dz'], ['c', 'ts'], ['s', 's'],
] as const;

const APICAL: Record<string, string> = {
  zhi: 'djrr', chi: 'tchrr', shi: 'shrr', ri: 'jrr', zi: 'dz', ci: 'ts', si: 's',
};

const FINALS: Record<string, string> = {
  a: 'a', ai: 'ai', an: 'an', ang: 'ang', ao: 'au',
  o: 'ô', ou: 'ou', ong: 'ung',
  e: 'â', ei: 'ei', en: 'ân', eng: 'âng', er: 'âr',
  i: 'i', ia: 'ia', ian: 'ien', iang: 'iang', iao: 'iau', ie: 'iê',
  in: 'in', ing: 'ing', iong: 'iung', iu: 'iou',
  u: 'u', ua: 'ua', uai: 'uai', uan: 'uan', uang: 'uang',
  ui: 'uei', un: 'uân', uo: 'uô',
  ü: 'ü', üe: 'üê', üan: 'üen', ün: 'ün',
};

const TONE_LABELS = ['neutro e leve', 'alto e constante', 'sobe', 'desce e sobe', 'cai forte'];

function plainPinyin(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/v/g, 'ü').toLowerCase();
}

function toPortuguese(raw: string) {
  const syllable = plainPinyin(raw);
  if (APICAL[syllable]) return APICAL[syllable];

  if (syllable.startsWith('y')) {
    const yFinals: Record<string, string> = {
      yi: 'i', ya: 'ia', yan: 'ien', yang: 'iang', yao: 'iau', ye: 'iê',
      yin: 'in', ying: 'ing', yong: 'iung', you: 'iou',
      yu: 'ü', yue: 'üê', yuan: 'üen', yun: 'ün',
    };
    return yFinals[syllable] ?? `i${syllable.slice(1)}`;
  }

  if (syllable.startsWith('w')) {
    const wFinals: Record<string, string> = {
      wu: 'u', wa: 'ua', wai: 'uai', wan: 'uan', wang: 'uang',
      wei: 'uei', wen: 'uân', weng: 'uâng', wo: 'uô',
    };
    return wFinals[syllable] ?? `u${syllable.slice(1)}`;
  }

  let initial = '';
  let initialPt = '';
  for (const [candidate, approximation] of INITIALS) {
    if (syllable.startsWith(candidate)) {
      initial = candidate;
      initialPt = approximation;
      break;
    }
  }

  let final = syllable.slice(initial.length);
  if (['j', 'q', 'x'].includes(initial) && final.startsWith('u')) final = `ü${final.slice(1)}`;
  return `${initialPt}${FINALS[final] ?? final}`;
}

function analyze(text: string): Syllable[] {
  if (!text.trim()) return [];
  return pinyin(text, {
    type: 'all', toneType: 'symbol', nonZh: 'removed', toneSandhi: true, segmentit: 2,
  })
    .filter((item) => item.isZh)
    .map((item) => ({
      hanzi: item.origin,
      pinyin: item.pinyin,
      plain: plainPinyin(item.pinyin),
      tone: item.num,
      portuguese: toPortuguese(item.pinyin),
    }));
}

export default function Home() {
  const [phrase, setPhrase] = useState('今天学习第一课');
  const [audioSpeed, setAudioSpeed] = useState<'natural' | 'slow'>('natural');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioMessage, setAudioMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const syllables = useMemo(() => analyze(phrase), [phrase]);
  const pinyinLine = syllables.map((item) => item.pinyin).join(' ');
  const portugueseLine = syllables.map((item) => `${item.portuguese} (${item.tone})`).join(' ');

  function speak() {
    if (!phrase.trim() || !('speechSynthesis' in window)) {
      setAudioMessage('O áudio não está disponível neste navegador.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    const voices = window.speechSynthesis.getVoices();
    const mandarinVoice = voices.find((voice) => voice.lang.toLowerCase() === 'zh-cn')
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));

    utterance.lang = 'zh-CN';
    utterance.rate = audioSpeed === 'slow' ? 0.55 : 0.88;
    utterance.pitch = 1;
    if (mandarinVoice) utterance.voice = mandarinVoice;
    utterance.onstart = () => { setIsSpeaking(true); setAudioMessage(''); };
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setAudioMessage('Não foi possível iniciar a voz em mandarim neste dispositivo.');
    };
    window.speechSynthesis.speak(utterance);
  }

  async function copyResult() {
    if (!syllables.length) return;
    try {
      await navigator.clipboard.writeText(`${phrase.trim()}\n${pinyinLine}\n${portugueseLine}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { setCopied(false); }
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Tons de Mandarim, início">
          <span className="brand-mark" aria-hidden="true">声</span>
          <span>Tons de Mandarim</span>
        </a>
        <a className="how-link" href="#como-funciona">Como funciona</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>中文</span> Pronúncia sem mistério</div>
          <h1>Escreva em chinês.<br /><em>Escute e pronuncie.</em></h1>
          <p className="hero-description">
            Transforme qualquer frase em mandarim em pinyin com tons e numa aproximação fonética pensada para quem fala português.
          </p>
          <div className="tone-key" aria-label="Legenda dos tons">
            {[1, 2, 3, 4].map((tone) => (
              <span key={tone}><i className={`tone-dot tone-${tone}`} /> {tone}º tom</span>
            ))}
          </div>
        </div>

        <div className="workspace-card">
          <label htmlFor="phrase">Sua frase em chinês</label>
          <div className="input-wrap">
            <textarea
              id="phrase" value={phrase} maxLength={120}
              onChange={(event) => setPhrase(event.target.value)}
              placeholder="Digite ou cole uma frase…" spellCheck={false}
            />
            <button className="clear-button" type="button" onClick={() => setPhrase('')}
              aria-label="Limpar frase" hidden={!phrase}>×</button>
            <span className="counter">{phrase.length}/120</span>
          </div>

          <div className="examples" aria-label="Exemplos rápidos">
            <span>Experimente:</span>
            {EXAMPLES.map((example) => (
              <button key={example.phrase} type="button" onClick={() => setPhrase(example.phrase)}>
                {example.label}
              </button>
            ))}
          </div>

          <div className="audio-row">
            <button className="play-button" type="button" onClick={speak} disabled={!syllables.length}>
              <span className="play-icon" aria-hidden="true">{isSpeaking ? '◼' : '▶'}</span>
              {isSpeaking ? 'Ouvindo…' : 'Ouvir em mandarim'}
            </button>
            <div className="speed-control" aria-label="Velocidade do áudio">
              <button type="button" className={audioSpeed === 'natural' ? 'active' : ''}
                onClick={() => setAudioSpeed('natural')} aria-pressed={audioSpeed === 'natural'}>Natural</button>
              <button type="button" className={audioSpeed === 'slow' ? 'active' : ''}
                onClick={() => setAudioSpeed('slow')} aria-pressed={audioSpeed === 'slow'}>Devagar <span>0,6×</span></button>
            </div>
          </div>
          {audioMessage && <p className="audio-message" role="status">{audioMessage}</p>}
        </div>
      </section>

      <section className="result-section" aria-live="polite">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Leitura da frase</span>
            <h2>Sua pronúncia, passo a passo</h2>
          </div>
          <button className="copy-button" type="button" onClick={copyResult} disabled={!syllables.length}>
            {copied ? '✓ Copiado' : 'Copiar resultado'}
          </button>
        </div>

        {syllables.length ? (
          <div className="result-card">
            <div className="result-block hanzi-block">
              <span className="result-label"><i>1</i> Ideogramas</span>
              <p lang="zh-CN">{phrase.trim()}</p>
            </div>
            <div className="result-block">
              <span className="result-label"><i>2</i> Pinyin com tons</span>
              <div className="syllable-line pinyin-line">
                {syllables.map((item, index) => (
                  <span key={`${item.hanzi}-${index}`} className={`tone-text-${item.tone || 0}`}>{item.pinyin}</span>
                ))}
              </div>
            </div>
            <div className="result-block portuguese-block">
              <div className="label-row">
                <span className="result-label"><i>3</i> Como um brasileiro falaria</span>
                <span className="support-badge">Apoio fonético</span>
              </div>
              <div className="syllable-line portuguese-line">
                {syllables.map((item, index) => (
                  <span className="pt-syllable" key={`${item.hanzi}-pt-${index}`}>
                    {item.portuguese}<b className={`tone-badge tone-bg-${item.tone || 0}`}>{item.tone}</b>
                  </span>
                ))}
              </div>
              <p className="tone-reading">
                {Array.from(new Set(syllables.map((item) => item.tone))).map((tone) => `${tone} = ${TONE_LABELS[tone]}`).join(' · ')}
              </p>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">你</span>
            <h3>Comece com uma frase em chinês</h3>
            <p>Os ideogramas, o pinyin e a pronúncia aproximada aparecerão aqui.</p>
          </div>
        )}
      </section>

      <section className="method-section" id="como-funciona">
        <div className="method-intro">
          <span className="section-kicker">Antes de praticar</span>
          <h2>Use o português como ponte.<br />O pinyin é a referência.</h2>
        </div>
        <div className="method-grid">
          <article><span className="method-number">01</span><h3>Leia os ideogramas</h3><p>Veja a frase completa e associe cada caractere ao som logo abaixo.</p></article>
          <article><span className="method-number">02</span><h3>Observe os tons</h3><p>As marcas do pinyin mostram a melodia. Os números ajudam a memorizar o movimento.</p></article>
          <article><span className="method-number">03</span><h3>Escute e repita</h3><p>Comece devagar, imite o áudio e depois retome a velocidade natural.</p></article>
        </div>
      </section>

      <footer>
        <div className="footer-mark" aria-hidden="true">声</div>
        <p>A pronúncia em português é uma aproximação para estudo. Alguns sons do mandarim não existem em português.</p>
      </footer>
    </main>
  );
}
