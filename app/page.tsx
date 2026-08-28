'use client';

import cnchar from 'cnchar';
import cncharInput from 'cnchar-input';
import cncharPoly from 'cnchar-poly';
import cncharWords from 'cnchar-words';
import Link from 'next/link';
import { pinyin } from 'pinyin-pro';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClientSession } from './components/ClientSession';
import PhraseSequence, { type PhraseSequenceHandle, type PhraseStudyItem } from './components/PhraseSequence';
import PracticeRecorder from './components/PracticeRecorder';

cnchar.use(cncharInput, cncharWords, cncharPoly);

type Syllable = {
  hanzi: string;
  pinyin: string;
  plain: string;
  tone: number;
  portuguese: string;
};

type PinyinChoice = {
  syllable: string;
  options: string[];
  selected: string;
};

type PinyinResolution = {
  key: string;
  choices: PinyinChoice[];
};

const EXAMPLES = [
  { label: 'Bom dia', phrase: '早上好' },
  { label: 'Obrigado', phrase: '谢谢你' },
  { label: 'Mais devagar', phrase: '请慢一点说' },
  { label: 'Até mais', phrase: '再见' },
  { label: 'Pinyin: olá', phrase: 'ni hao' },
];

const CLASSROOM_PHRASES = [
  { hanzi: '今天学习第一课', translation: 'Hoje vamos estudar a primeira lição.' },
  { hanzi: '请你读', translation: 'Por favor, leia.' },
  { hanzi: '请坐', translation: 'Por favor, sente-se.' },
  { hanzi: '现在上课', translation: 'Agora vamos começar a aula.' },
  { hanzi: '这是什么？', translation: 'O que é isto?' },
  { hanzi: '请打开书', translation: 'Por favor, abra o livro.' },
  { hanzi: '请问', translation: 'Com licença, posso perguntar?' },
  { hanzi: '下课', translation: 'Fim da aula.' },
  { hanzi: '老师请慢点说', translation: 'Professor(a), por favor, fale mais devagar.' },
  { hanzi: '请再读一遍', translation: 'Por favor, leia mais uma vez.' },
  { hanzi: '请再说一遍', translation: 'Por favor, diga mais uma vez.' },
  { hanzi: '您好', translation: 'Olá — forma respeitosa.' },
  { hanzi: '你好', translation: 'Olá.' },
  { hanzi: '你们', translation: 'Vocês.' },
  { hanzi: '他们', translation: 'Eles.' },
  { hanzi: '大家好', translation: 'Olá a todos.' },
  { hanzi: '同学们好', translation: 'Olá, colegas de classe.' },
  { hanzi: '再见', translation: 'Até logo.' },
];

const COMMON_PINYIN_PHRASES: Record<string, string> = {
  nihao: '你好',
  ninhao: '您好',
  nimenhao: '你们好',
  dajiahao: '大家好',
  tongxuemenhao: '同学们好',
  zaoshanghao: '早上好',
  wanshanghao: '晚上好',
  zaijian: '再见',
  xiexie: '谢谢',
  xiexieni: '谢谢你',
  bukeqi: '不客气',
  duibuqi: '对不起',
  meiguanxi: '没关系',
  qingwen: '请问',
  qingzuo: '请坐',
  qingnidu: '请你读',
  qingdakaishu: '请打开书',
  qingzaiduyibian: '请再读一遍',
  qingzaishuoyibian: '请再说一遍',
  qingmandianshuo: '请慢点说',
  qingmanyidianshuo: '请慢一点说',
  laoshiqingmandianshuo: '老师请慢点说',
  xianzaishangke: '现在上课',
  xiake: '下课',
  zheshishenme: '这是什么',
  jintianxuexidiyike: '今天学习第一课',
  woaini: '我爱你',
  wobuzhidao: '我不知道',
};

const COMMON_PINYIN_WORDS: Record<string, string> = {
  wo: '我', ni: '你', nin: '您', ta: '他', women: '我们', nimen: '你们', tamen: '他们',
  shi: '是', de: '的', le: '了', zai: '在', you: '有', bu: '不', mei: '没', hen: '很',
  ye: '也', dou: '都', ma: '吗', ne: '呢', ba: '吧', ge: '个', zhe: '这', na: '那',
  shenme: '什么', weishenme: '为什么', zenme: '怎么', zenmeyang: '怎么样',
  duoshao: '多少', nage: '哪个', zheli: '这里', nali: '哪里',
  nihao: '你好', zaijian: '再见', xiexie: '谢谢', qingwen: '请问',
  duibuqi: '对不起', meiguanxi: '没关系', bukeqi: '不客气',
  xihuan: '喜欢', xuexi: '学习', hanyu: '汉语', zhongwen: '中文', yingyu: '英语',
  shuohua: '说话', tingdong: '听懂', zhidao: '知道', renshi: '认识', mingbai: '明白',
  zaizuo: '在做', zuoshenme: '做什么', xiangchi: '想吃', chifan: '吃饭',
  heshui: '喝水', shuijiao: '睡觉', gongzuo: '工作', huijia: '回家',
  jintian: '今天', mingtian: '明天', zuotian: '昨天', xianzai: '现在',
  zaoshang: '早上', wanshang: '晚上', shijian: '时间', dianzhong: '点钟',
  mingzi: '名字', jiao: '叫', laoshi: '老师', xuesheng: '学生', tongxue: '同学',
  pengyou: '朋友', jiaren: '家人', baba: '爸爸', mama: '妈妈',
  zhongguo: '中国', beijing: '北京', shanghai: '上海', baxi: '巴西',
  dongxi: '东西', shu: '书', fan: '饭', shui: '水', cha: '茶', qian: '钱',
  keyi: '可以', xiangyao: '想要', xuyao: '需要', yinggai: '应该',
  dakai: '打开', guanbi: '关闭', jinlai: '进来', chuqu: '出去',
};

const HANZI_PATTERN = /[\u3400-\u9fff]/u;
const PINYIN_PATTERN = /[a-zA-ZüÜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/u;
const PINYIN_MARKS: Record<string, string> = {
  ā: 'a', á: 'a', ǎ: 'a', à: 'a',
  ē: 'e', é: 'e', ě: 'e', è: 'e',
  ī: 'i', í: 'i', ǐ: 'i', ì: 'i',
  ō: 'o', ó: 'o', ǒ: 'o', ò: 'o',
  ū: 'u', ú: 'u', ǔ: 'u', ù: 'u',
  ǖ: 'v', ǘ: 'v', ǚ: 'v', ǜ: 'v', ü: 'v',
};

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
const DEFAULT_LOOP_GAP = 1;
const MIN_LOOP_GAP = 1;
const MAX_LOOP_GAP = 30;

function plainPinyin(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/v/g, 'ü').toLowerCase();
}

function isPinyinInput(value: string) {
  const text = value.trim();
  return Boolean(text) && !HANZI_PATTERN.test(text) && PINYIN_PATTERN.test(text);
}

function normalizePinyinInput(value: string) {
  return Array.from(value.toLowerCase())
    .map((character) => PINYIN_MARKS[character] ?? character)
    .join('')
    .replace(/u:/g, 'v')
    .replace(/5/g, '0')
    .replace(/[^a-zv0-4]/g, '');
}

function hanziCharacters(value: string) {
  return Array.from(value).filter((character) => HANZI_PATTERN.test(character));
}

function uniqueHanzi(value: string) {
  return Array.from(new Set(hanziCharacters(value)));
}

function applyCommonPinyinWords(split: string[], characters: string[]) {
  const plainSyllables = split.map((syllable) => syllable.replace(/[0-4]/g, ''));
  let index = 0;

  while (index < plainSyllables.length) {
    let matchedLength = 0;
    for (let length = Math.min(4, plainSyllables.length - index); length >= 1; length -= 1) {
      const key = plainSyllables.slice(index, index + length).join('');
      const word = COMMON_PINYIN_WORDS[key];
      const wordCharacters = word ? Array.from(word) : [];
      if (wordCharacters.length !== length) continue;

      wordCharacters.forEach((character, offset) => {
        characters[index + offset] = character;
      });
      matchedLength = length;
      break;
    }
    index += matchedLength || 1;
  }
}

function resolvePinyin(value: string): PinyinResolution | null {
  if (!isPinyinInput(value)) return null;

  const normalized = normalizePinyinInput(value);
  if (!normalized || normalized.length > 80) return null;

  const plainKey = normalized.replace(/[0-4]/g, '');
  const preferredPhrase = COMMON_PINYIN_PHRASES[plainKey];
  const preferredCharacters = preferredPhrase ? Array.from(preferredPhrase) : [];

  try {
    const results = cnchar.input(normalized, { associate: true });
    const usable = results.filter((result) => (
      result.split.length > 0
      && result.words.length === result.split.length
      && result.words.every((word) => hanziCharacters(word).length > 0)
    ));

    if (!usable.length) return null;

    const matchingPreferredLength = preferredCharacters.length
      ? usable.filter((result) => result.split.length === preferredCharacters.length)
      : [];
    const candidates = matchingPreferredLength.length ? matchingPreferredLength : usable;
    const best = [...candidates].sort((a, b) => a.split.length - b.split.length)[0];
    const contextualCharacters = best.words.map((word) => hanziCharacters(word)[0] ?? '');

    best.association.forEach((association, index) => {
      const associatedWord = association?.split(/\s+/)[0];
      if (!associatedWord || associatedWord === '-') return;
      hanziCharacters(associatedWord).forEach((character, offset) => {
        if (index + offset < contextualCharacters.length) {
          contextualCharacters[index + offset] = character;
        }
      });
    });

    applyCommonPinyinWords(best.split, contextualCharacters);

    const choices = best.split.map((syllable, index) => {
      const selected = preferredCharacters[index] ?? contextualCharacters[index];
      const options = uniqueHanzi(`${selected}${best.words[index]}`).slice(0, 22);
      return { syllable, options, selected };
    });

    return choices.every((choice) => choice.selected)
      ? { key: `${normalized}:${best.split.join('-')}`, choices }
      : null;
  } catch {
    return null;
  }
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
  const { sessionId, shortId } = useClientSession();
  const [phrase, setPhrase] = useState('今天学习第一课');
  const [pinyinSelection, setPinyinSelection] = useState<{ key: string; characters: string[] }>({
    key: '', characters: [],
  });
  const [audioSpeed, setAudioSpeed] = useState<'natural' | 'slow'>('natural');
  const [audioLoop, setAudioLoop] = useState(false);
  const [loopGapDraft, setLoopGapDraft] = useState(DEFAULT_LOOP_GAP);
  const [savedLoopGap, setSavedLoopGap] = useState(DEFAULT_LOOP_GAP);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioMessage, setAudioMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const speechRun = useRef(0);
  const loopEnabled = useRef(false);
  const speedSetting = useRef<'natural' | 'slow'>('natural');
  const loopGapSetting = useRef(DEFAULT_LOOP_GAP);
  const loopTimer = useRef<number | null>(null);
  const loopReplay = useRef<(() => void) | null>(null);
  const phraseSequenceRef = useRef<PhraseSequenceHandle | null>(null);
  const pinyinDetected = isPinyinInput(phrase);
  const pinyinResolution = useMemo(() => resolvePinyin(phrase), [phrase]);
  const defaultCharacters = pinyinResolution?.choices.map((choice) => choice.selected) ?? [];
  const selectedCharacters = pinyinResolution && pinyinSelection.key === pinyinResolution.key
    && pinyinSelection.characters.length === pinyinResolution.choices.length
    ? pinyinSelection.characters
    : defaultCharacters;
  const resolvedPhrase = pinyinResolution ? selectedCharacters.join('') : phrase;
  const syllables = useMemo(() => analyze(resolvedPhrase), [resolvedPhrase]);
  const pinyinLine = syllables.map((item) => item.pinyin).join(' ');
  const portugueseLine = syllables.map((item) => `${item.portuguese} (${item.tone})`).join(' ');
  const studyPhrases = useMemo<PhraseStudyItem[]>(() => CLASSROOM_PHRASES.map((item, index) => {
    const reading = analyze(item.hanzi);
    return {
      id: index + 1,
      hanzi: item.hanzi,
      translation: item.translation,
      pinyin: reading.map((syllable) => syllable.pinyin).join(' '),
      portuguese: reading.map((syllable) => `${syllable.portuguese} (${syllable.tone})`).join(' '),
    };
  }), []);

  useEffect(() => () => {
    speechRun.current += 1;
    if (loopTimer.current) window.clearTimeout(loopTimer.current);
    loopReplay.current = null;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    try {
      const stored = Number(window.sessionStorage.getItem(`tons-de-mandarim:loop-gap:${sessionId}`));
      if (!Number.isInteger(stored) || stored < MIN_LOOP_GAP || stored > MAX_LOOP_GAP) return;
      loopGapSetting.current = stored;
      queueMicrotask(() => {
        setLoopGapDraft(stored);
        setSavedLoopGap(stored);
      });
    } catch { /* The timer still works without browser persistence. */ }
  }, [sessionId]);

  function chooseCharacter(index: number, character: string) {
    if (!pinyinResolution) return;
    const nextCharacters = [...selectedCharacters];
    nextCharacters[index] = character;
    setPinyinSelection({ key: pinyinResolution.key, characters: nextCharacters });
  }

  function stopSpeaking() {
    speechRun.current += 1;
    if (loopTimer.current) {
      window.clearTimeout(loopTimer.current);
      loopTimer.current = null;
    }
    loopReplay.current = null;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setAudioMessage('');
  }

  function changePhrase(value: string) {
    if (isSpeaking) stopSpeaking();
    setPhrase(value);
  }

  function changeSpeed(speed: 'natural' | 'slow') {
    speedSetting.current = speed;
    setAudioSpeed(speed);
  }

  function toggleLoop() {
    const nextValue = !audioLoop;
    loopEnabled.current = nextValue;
    setAudioLoop(nextValue);

    if (!nextValue && loopTimer.current) {
      window.clearTimeout(loopTimer.current);
      loopTimer.current = null;
      loopReplay.current = null;
      speechRun.current += 1;
      setIsSpeaking(false);
    }
  }

  function saveLoopGap() {
    const seconds = Math.min(MAX_LOOP_GAP, Math.max(MIN_LOOP_GAP, Math.round(loopGapDraft)));
    loopGapSetting.current = seconds;
    setLoopGapDraft(seconds);
    setSavedLoopGap(seconds);
    try { window.sessionStorage.setItem(`tons-de-mandarim:loop-gap:${sessionId}`, String(seconds)); } catch { /* Saving in memory is enough for this visit. */ }

    if (loopTimer.current && loopReplay.current) {
      window.clearTimeout(loopTimer.current);
      loopTimer.current = window.setTimeout(() => {
        loopTimer.current = null;
        const replay = loopReplay.current;
        loopReplay.current = null;
        replay?.();
      }, seconds * 1000);
    }
  }

  function speak() {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    phraseSequenceRef.current?.stop();

    if (!resolvedPhrase.trim() || !('speechSynthesis' in window)) {
      setAudioMessage('O áudio não está disponível neste navegador.');
      return;
    }

    window.speechSynthesis.cancel();
    const runId = speechRun.current + 1;
    speechRun.current = runId;

    const playPhrase = () => {
      if (speechRun.current !== runId) return;

      const utterance = new SpeechSynthesisUtterance(resolvedPhrase);
      const voices = window.speechSynthesis.getVoices();
      const mandarinVoice = voices.find((voice) => voice.lang.toLowerCase() === 'zh-cn')
        ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));

      utterance.lang = 'zh-CN';
      utterance.rate = speedSetting.current === 'slow' ? 0.55 : 0.88;
      utterance.pitch = 1;
      if (mandarinVoice) utterance.voice = mandarinVoice;
      utterance.onstart = () => {
        if (speechRun.current !== runId) return;
        setIsSpeaking(true);
        setAudioMessage('');
      };
      utterance.onend = () => {
        if (speechRun.current !== runId) return;
        if (loopEnabled.current) {
          loopReplay.current = playPhrase;
          loopTimer.current = window.setTimeout(() => {
            loopTimer.current = null;
            const replay = loopReplay.current;
            loopReplay.current = null;
            replay?.();
          }, loopGapSetting.current * 1000);
          return;
        }
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        if (speechRun.current !== runId) return;
        setIsSpeaking(false);
        setAudioMessage('Não foi possível iniciar a voz em mandarim neste dispositivo.');
      };
      window.speechSynthesis.speak(utterance);
    };

    playPhrase();
  }

  async function copyResult() {
    if (!syllables.length) return;
    try {
      await navigator.clipboard.writeText(`${resolvedPhrase.trim()}\n${pinyinLine}\n${portugueseLine}`);
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
        <nav className="topnav" aria-label="Navegação principal">
          <span className="session-badge" title="Esta sessão não compartilha dados com outros visitantes">
            <i aria-hidden="true" />
            <span>Sessão {shortId || 'privada'}</span>
          </span>
          <Link className="syllables-link" href="/letras-e-silabas">Letras e sílabas</Link>
          <Link className="syllables-link" href="/exercicios">Exercícios</Link>
          <a className="how-link" href="#como-funciona">Como funciona</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>中文</span> Pronúncia sem mistério</div>
          <h1>Escreva em chinês.<br /><em>Escute e pronuncie.</em></h1>
          <p className="hero-description">
            Digite em ideogramas ou em pinyin. Veja os tons e uma aproximação fonética pensada para quem fala português.
          </p>
          <div className="tone-key" aria-label="Legenda dos tons">
            {[1, 2, 3, 4].map((tone) => (
              <span key={tone}><i className={`tone-dot tone-${tone}`} /> {tone}º tom</span>
            ))}
          </div>
        </div>

        <div className="workspace-card">
          <div className="workspace-heading">
            <label htmlFor="phrase">Sua frase em chinês ou pinyin</label>
            {pinyinDetected && <span className="input-kind">Pinyin detectado</span>}
          </div>
          <div className="input-wrap">
            <textarea
              id="phrase" value={phrase} maxLength={120}
              onChange={(event) => changePhrase(event.target.value)}
              placeholder="Ex.: 你好, ni hao ou nǐ hǎo" spellCheck={false}
              className={pinyinDetected ? 'pinyin-input' : ''}
            />
            <button className="clear-button" type="button" onClick={() => changePhrase('')}
              aria-label="Limpar frase" hidden={!phrase}>×</button>
            <span className="counter">{phrase.length}/120</span>
          </div>

          {pinyinResolution && (
            <div className="pinyin-resolver">
              <div className="resolver-main">
                <span>Interpretação em ideogramas</span>
                <strong lang="zh-CN">{resolvedPhrase}</strong>
              </div>
              <details className="candidate-details">
                <summary>Corrigir ideogramas</summary>
                <p>O mesmo pinyin pode formar palavras diferentes. Escolha o caractere desejado:</p>
                <div className="candidate-grid">
                  {pinyinResolution.choices.map((choice, index) => (
                    <div className="candidate-row" key={`${choice.syllable}-${index}`}>
                      <span>{choice.syllable}</span>
                      <div className="candidate-options">
                        {choice.options.map((character) => (
                          <button key={character} type="button"
                            className={selectedCharacters[index] === character ? 'selected' : ''}
                            onClick={() => chooseCharacter(index, character)}
                            aria-pressed={selectedCharacters[index] === character}>
                            {character}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

          {pinyinDetected && !pinyinResolution && (
            <p className="input-warning" role="status">
              Não reconheci esse pinyin. Separe as sílabas com espaços ou confira a escrita.
            </p>
          )}

          {syllables.length > 0 && (
            <div className="inline-result" aria-live="polite">
              <div><span>Pinyin com tons</span><strong>{pinyinLine}</strong></div>
              <div><span>Pronúncia em português</span><strong>{portugueseLine}</strong></div>
            </div>
          )}

          <div className="examples" aria-label="Exemplos rápidos">
            <span>Experimente:</span>
            {EXAMPLES.map((example) => (
              <button key={example.phrase} type="button" onClick={() => changePhrase(example.phrase)}>
                {example.label}
              </button>
            ))}
          </div>

          <div className="audio-row">
            <button className="play-button" type="button" onClick={speak} disabled={!syllables.length}>
              <span className="play-icon" aria-hidden="true">{isSpeaking ? '◼' : '▶'}</span>
              {isSpeaking ? 'Parar áudio' : 'Ouvir em mandarim'}
            </button>
            <div className="audio-options">
              <div className="speed-control" aria-label="Velocidade do áudio">
                <button type="button" className={audioSpeed === 'natural' ? 'active' : ''}
                  onClick={() => changeSpeed('natural')} aria-pressed={audioSpeed === 'natural'}>Natural</button>
                <button type="button" className={audioSpeed === 'slow' ? 'active' : ''}
                  onClick={() => changeSpeed('slow')} aria-pressed={audioSpeed === 'slow'}>Devagar <span>0,6×</span></button>
              </div>
              <button className={`loop-control ${audioLoop ? 'active' : ''}`} type="button"
                onClick={toggleLoop} aria-pressed={audioLoop} aria-label="Repetir frase em loop"
                title="Repetir frase continuamente">
                <span aria-hidden="true">↻</span> Loop
              </button>
            </div>
          </div>
          <div className="loop-timer-control">
            <div className="loop-timer-heading">
              <label htmlFor="loop-gap">Pausa entre as repetições do loop</label>
              <output htmlFor="loop-gap">{loopGapDraft} {loopGapDraft === 1 ? 'segundo' : 'segundos'}</output>
            </div>
            <input id="loop-gap" type="range" min={MIN_LOOP_GAP} max={MAX_LOOP_GAP} step="1"
              value={loopGapDraft} onChange={(event) => setLoopGapDraft(Number(event.target.value))}
              aria-label="Segundos de pausa entre as repetições" />
            <div className="loop-timer-footer">
              <span>Em uso: {savedLoopGap}s</span>
              <button type="button" onClick={saveLoopGap} disabled={loopGapDraft === savedLoopGap}>
                {loopGapDraft === savedLoopGap ? '✓ Salvo' : 'Salvar intervalo'}
              </button>
            </div>
          </div>
          {audioMessage && <p className="audio-message" role="status">{audioMessage}</p>}

          <PracticeRecorder
            phrase={resolvedPhrase.trim()}
            pinyin={pinyinLine}
            sessionId={sessionId}
            onBeforeRecord={() => {
              stopSpeaking();
              phraseSequenceRef.current?.stop();
            }}
          />
        </div>
      </section>

      <PhraseSequence ref={phraseSequenceRef} items={studyPhrases} sessionId={sessionId}
        onBeforePlay={stopSpeaking} />

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
              <p lang="zh-CN">{resolvedPhrase.trim()}</p>
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
            <h3>Comece com ideogramas ou pinyin</h3>
            <p>A interpretação, o pinyin com tons e a pronúncia aproximada aparecerão aqui.</p>
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
