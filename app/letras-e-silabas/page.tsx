'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useClientSession } from '../components/ClientSession';
import PracticeRecorder from '../components/PracticeRecorder';
import styles from './page.module.css';

type SoundItem = {
  id: string;
  pinyin: string;
  portuguese: string;
  audio: string;
  note?: string;
};

type InitialRow = {
  initial: string;
  values: string[];
};

const SEQUENCE_GAP = 1000;

const VOWEL_TONE_GROUPS = [
  { vowel: 'a', tones: [['ā', 1, 0.595], ['á', 2, 1.884], ['ǎ', 3, 3.163], ['à', 4, 4.45]] },
  { vowel: 'o', tones: [['ō', 1, 5.853], ['ó', 2, 6.95], ['ǒ', 3, 8.058], ['ò', 4, 9.225]] },
  { vowel: 'e', tones: [['ē', 1, 10.55], ['é', 2, 11.506], ['ě', 3, 12.523], ['è', 4, 13.595]] },
  { vowel: 'i', tones: [['ī', 1, 15.004], ['í', 2, 15.98], ['ǐ', 3, 17.078], ['ì', 4, 18.104]] },
  { vowel: 'u', tones: [['ū', 1, 19.242], ['ú', 2, 20.33], ['ǔ', 3, 21.29], ['ù', 4, 22.291]] },
  { vowel: 'ü', tones: [['ǖ', 1, 23.465], ['ǘ', 2, 24.462], ['ǚ', 3, 25.525], ['ǜ', 4, 26.601]] },
] as const;

const VOWEL_TONES = VOWEL_TONE_GROUPS.flatMap((group) =>
  group.tones.map(([label, tone, start]) => ({ vowel: group.vowel, label, tone, start })),
);

const ZHUYIN_INITIALS: Record<string, string> = {
  b: 'ㄅ', p: 'ㄆ', m: 'ㄇ', f: 'ㄈ', d: 'ㄉ', t: 'ㄊ', n: 'ㄋ', l: 'ㄌ',
  g: 'ㄍ', k: 'ㄎ', h: 'ㄏ', j: 'ㄐ', q: 'ㄑ', x: 'ㄒ',
  zh: 'ㄓ', ch: 'ㄔ', sh: 'ㄕ', r: 'ㄖ', z: 'ㄗ', c: 'ㄘ', s: 'ㄙ',
};

const ZHUYIN_FINALS: Record<string, string> = {
  a: 'ㄚ', o: 'ㄛ', e: 'ㄜ', ai: 'ㄞ', ei: 'ㄟ', ao: 'ㄠ', ou: 'ㄡ',
  an: 'ㄢ', en: 'ㄣ', ang: 'ㄤ', eng: 'ㄥ', er: 'ㄦ',
  i: 'ㄧ', ia: 'ㄧㄚ', ian: 'ㄧㄢ', iang: 'ㄧㄤ', iao: 'ㄧㄠ', ie: 'ㄧㄝ',
  in: 'ㄧㄣ', ing: 'ㄧㄥ', iong: 'ㄩㄥ', iu: 'ㄧㄡ',
  u: 'ㄨ', ua: 'ㄨㄚ', uai: 'ㄨㄞ', uan: 'ㄨㄢ', uang: 'ㄨㄤ',
  ui: 'ㄨㄟ', un: 'ㄨㄣ', uo: 'ㄨㄛ', ong: 'ㄨㄥ',
  ü: 'ㄩ', üe: 'ㄩㄝ', üan: 'ㄩㄢ', ün: 'ㄩㄣ',
};

const ZHUYIN_WHOLE: Record<string, string> = {
  zhi: 'ㄓ', chi: 'ㄔ', shi: 'ㄕ', ri: 'ㄖ', zi: 'ㄗ', ci: 'ㄘ', si: 'ㄙ',
  yi: 'ㄧ', ya: 'ㄧㄚ', yan: 'ㄧㄢ', yang: 'ㄧㄤ', yao: 'ㄧㄠ', ye: 'ㄧㄝ',
  yin: 'ㄧㄣ', ying: 'ㄧㄥ', yo: 'ㄧㄛ', yong: 'ㄩㄥ', you: 'ㄧㄡ',
  yu: 'ㄩ', yue: 'ㄩㄝ', yuan: 'ㄩㄢ', yun: 'ㄩㄣ',
  wu: 'ㄨ', wa: 'ㄨㄚ', wai: 'ㄨㄞ', wan: 'ㄨㄢ', wang: 'ㄨㄤ',
  wei: 'ㄨㄟ', wen: 'ㄨㄣ', weng: 'ㄨㄥ', wo: 'ㄨㄛ',
};

function zhuyinFor(syllable: string) {
  if (ZHUYIN_WHOLE[syllable]) return ZHUYIN_WHOLE[syllable];
  const initial = findInitial(syllable);
  let final = syllable.slice(initial.length);
  if (['j', 'q', 'x'].includes(initial) && final.startsWith('u')) final = `ü${final.slice(1)}`;
  return `${ZHUYIN_INITIALS[initial] ?? ''}${ZHUYIN_FINALS[final] ?? ''}` || syllable;
}

const INITIALS: SoundItem[] = [
  ['b', 'p suave, sem sopro', 'bo'], ['p', 'p bem soprado', 'po'], ['m', 'm', 'mo'],
  ['f', 'f', 'fo'], ['d', 't suave, sem sopro', 'de'], ['t', 't bem soprado', 'te'],
  ['n', 'n', 'ne'], ['l', 'l', 'le'], ['g', 'k suave, sem sopro', 'ge'],
  ['k', 'k bem soprado', 'ke'], ['h', "rr de 'rato', mais áspero", 'he'],
  ['j', 'aprox. dj, bem frontal', 'ji'], ['q', 'aprox. tch, soprado e frontal', 'qi'],
  ['x', 'aprox. x/ch, suave e frontal', 'xi'], ['zh', 'dj com a língua curvada', 'zhi'],
  ['ch', 'tch retroflexo com sopro', 'chi'], ['sh', 'sh com a língua curvada', 'shi'],
  ['r', 'som retroflexo entre r/j', 'ri'], ['z', 'dz/ts sem sopro', 'zi'],
  ['c', 'ts bem soprado', 'ci'], ['s', 's', 'si'], ['y', 'geralmente i / y', 'yi'],
  ['w', 'aproximadamente u / w', 'wu'],
].map(([pinyin, portuguese]) => ({
  id: `initial-${pinyin}`,
  pinyin,
  portuguese,
  audio: ZHUYIN_INITIALS[pinyin] ?? zhuyinFor(pinyin),
}));

const FINAL_GROUPS = [
  {
    id: 'simple', title: 'Vogais simples', subtitle: 'Sons fundamentais',
    values: [['a', 'á'], ['o', 'ô / ó'], ['e', 'â, aberto e recuado'], ['i', 'i'], ['u', 'u'], ['ü', "ü: diga 'i' com os lábios de 'u'"]],
  },
  {
    id: 'compound', title: 'Vogais compostas', subtitle: 'Duas vogais combinadas',
    values: [['ai', 'ái'], ['ei', 'êi'], ['ui', 'uêi'], ['ao', 'áu'], ['ou', 'ôu'], ['iu', 'iôu'], ['ie', 'iê'], ['üe', 'üê']],
  },
  {
    id: 'special', title: 'Final especial', subtitle: 'Som retroflexo',
    values: [['er', 'âr, com final retroflexo']],
  },
  {
    id: 'front-nasal', title: 'Nasais anteriores', subtitle: 'Terminam mais à frente',
    values: [['an', 'án'], ['en', 'ân'], ['in', 'in'], ['un', 'uân'], ['ün', 'ün']],
  },
  {
    id: 'back-nasal', title: 'Nasais posteriores', subtitle: 'Terminam no fundo da boca',
    values: [['ang', 'áng'], ['eng', 'âng'], ['ing', 'ing'], ['ong', 'ung']],
  },
].map((group) => ({
  ...group,
  items: group.values.map(([pinyin, portuguese]) => ({
    id: `final-${pinyin}`, pinyin, portuguese, audio: zhuyinFor(pinyin),
  })),
}));

const INITIAL_ROWS: InitialRow[] = [
  { initial: 'b', values: 'ba bai ban bang bao bei ben beng bi bian biao bie bin bing bo bu'.split(' ') },
  { initial: 'p', values: 'pa pai pan pang pao pei pen peng pi pian piao pie pin ping po pou pu'.split(' ') },
  { initial: 'm', values: 'ma mai man mang mao me mei men meng mi mian miao mie min ming miu mo mou mu'.split(' ') },
  { initial: 'f', values: 'fa fan fang fei fen feng fo fou fu'.split(' ') },
  { initial: 'd', values: 'da dai dan dang dao de dei den deng di dian diao die ding diu dong dou du duan dui dun duo'.split(' ') },
  { initial: 't', values: 'ta tai tan tang tao te teng ti tian tiao tie ting tong tou tu tuan tui tun tuo'.split(' ') },
  { initial: 'n', values: 'na nai nan nang nao ne nei nen neng ni nian niang niao nie nin ning niu nong nou nu nuan nü nüe nuo'.split(' ') },
  { initial: 'l', values: 'la lai lan lang lao le lei leng li lian liang liao lie lin ling liu long lou lu luan lun luo lü lüe'.split(' ') },
  { initial: 'g', values: 'ga gai gan gang gao ge gei gen geng gong gou gu gua guai guan guang gui gun guo'.split(' ') },
  { initial: 'k', values: 'ka kai kan kang kao ke ken keng kong kou ku kua kuai kuan kuang kui kun kuo'.split(' ') },
  { initial: 'h', values: 'ha hai han hang hao he hei hen heng hong hou hu hua huai huan huang hui hun huo'.split(' ') },
  { initial: 'j', values: 'ji jia jian jiang jiao jie jin jing jiong jiu ju juan jue jun'.split(' ') },
  { initial: 'q', values: 'qi qia qian qiang qiao qie qin qing qiong qiu qu quan que qun'.split(' ') },
  { initial: 'x', values: 'xi xia xian xiang xiao xie xin xing xiong xiu xu xuan xue xun'.split(' ') },
  { initial: 'zh', values: 'zha zhai zhan zhang zhao zhe zhei zhen zheng zhi zhong zhou zhu zhua zhuai zhuan zhuang zhui zhun zhuo'.split(' ') },
  { initial: 'ch', values: 'cha chai chan chang chao che chen cheng chi chong chou chu chua chuai chuan chuang chui chun chuo'.split(' ') },
  { initial: 'sh', values: 'sha shai shan shang shao she shei shen sheng shi shou shu shua shuai shuan shuang shui shun shuo'.split(' ') },
  { initial: 'r', values: 'ran rang rao re ren reng ri rong rou ru ruan rui run ruo'.split(' ') },
  { initial: 'z', values: 'za zai zan zang zao ze zei zen zeng zi zong zou zu zuan zui zun zuo'.split(' ') },
  { initial: 'c', values: 'ca cai can cang cao ce cen ceng ci cong cou cu cuan cui cun cuo'.split(' ') },
  { initial: 's', values: 'sa sai san sang sao se sen seng si song sou su suan sui sun suo'.split(' ') },
  { initial: 'y', values: 'ya yan yang yao ye yi yin ying yo yong you yu yuan yue yun'.split(' ') },
  { initial: 'w', values: 'wa wai wan wang wei wen weng wo wu'.split(' ') },
];

const FINAL_SEQUENCE = [
  'a', 'o', 'e', 'i', 'u', 'ü',
  'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 'üe',
  'er', 'an', 'en', 'in', 'un', 'ün', 'ang', 'eng', 'ing', 'ong',
];

const Y_FINAL_KEYS: Record<string, string> = {
  ya: 'a', yo: 'o', yi: 'i', yu: 'ü', yao: 'ao', you: 'ou', ye: 'ie', yue: 'üe',
  yan: 'an', yin: 'in', yun: 'ün', yang: 'ang', ying: 'ing', yong: 'ong',
};

const W_FINAL_KEYS: Record<string, string> = {
  wa: 'a', wo: 'o', wu: 'u', wai: 'ai', wei: 'ui',
  wan: 'an', wen: 'en', wang: 'ang', weng: 'eng',
};

const GROUP_DEFINITIONS = [
  { id: 'bpmf', title: 'B, P, M e F', initials: ['b', 'p', 'm', 'f'] },
  { id: 'dtnl', title: 'D, T, N e L', initials: ['d', 't', 'n', 'l'] },
  { id: 'gkh', title: 'G, K e H', initials: ['g', 'k', 'h'] },
  { id: 'jqx', title: 'J, Q e X', initials: ['j', 'q', 'x'] },
  { id: 'retroflex', title: 'ZH, CH, SH e R', initials: ['zh', 'ch', 'sh', 'r'] },
  { id: 'zcs', title: 'Z, C e S', initials: ['z', 'c', 's'] },
  { id: 'yw', title: 'Y e W', initials: ['y', 'w'] },
];

const INITIAL_SOUNDS: Record<string, string> = {
  b: 'p', p: 'p', m: 'm', f: 'f', d: 't', t: 't', n: 'n', l: 'l',
  g: 'k', k: 'k', h: 'rr', j: 'dj', q: 'tch', x: 'sh',
  zh: 'dj', ch: 'tch', sh: 'sh', r: 'r', z: 'dz', c: 'ts', s: 's',
};

const FINAL_SOUNDS: Record<string, string> = {
  a: 'á', ai: 'ái', an: 'án', ang: 'áng', ao: 'áu',
  o: 'ô', ou: 'ôu', ong: 'ung',
  e: 'â', ei: 'êi', en: 'ân', eng: 'âng', er: 'âr',
  i: 'i', ia: 'iá', ian: 'ién', iang: 'iáng', iao: 'iáu', ie: 'iê',
  in: 'in', ing: 'ing', iong: 'iung', iu: 'iôu',
  u: 'u', ua: 'uá', uai: 'uái', uan: 'uán', uang: 'uáng',
  ui: 'uêi', un: 'uân', uo: 'uô',
  ü: 'ü', üe: 'üê', üan: 'üen', ün: 'ün',
};

const APICAL_SOUNDS: Record<string, string> = {
  zhi: 'djr', chi: 'tchr', shi: 'shr', ri: 'jr',
  zi: 'dz/ts + vogal especial', ci: 'ts + vogal especial', si: 's + vogal especial',
};

const Y_SOUNDS: Record<string, string> = {
  yi: 'i', ya: 'iá', yan: 'ién', yang: 'iáng', yao: 'iáu', ye: 'iê',
  yin: 'in', ying: 'ing', yo: 'iô', yong: 'iung', you: 'iôu',
  yu: 'ü', yue: 'üê', yuan: 'üen', yun: 'ün',
};

const W_SOUNDS: Record<string, string> = {
  wu: 'u', wa: 'uá', wai: 'uái', wan: 'uán', wang: 'uáng',
  wei: 'uêi', wen: 'uân', weng: 'uâng', wo: 'uô',
};

const PDF_OVERRIDES: Record<string, string> = {
  re: 'râ/jâ', ri: 'jr', ru: 'ru', rui: 'ruêi', rao: 'ráu', rou: 'rôu',
  za: 'dzá/tsá', ze: 'dzâ/tsâ', zi: 'dz/ts + vogal especial', zu: 'dzu/tsu',
};

const ASPIRATED = new Set(['p', 't', 'k', 'q', 'ch', 'c']);
const UNASPIRATED = new Set(['b', 'd', 'g', 'zh', 'z']);
const RETROFLEX = new Set(['zh', 'ch', 'sh', 'r']);
const FRONTAL = new Set(['j', 'q', 'x']);

function findInitial(syllable: string) {
  return ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's']
    .find((initial) => syllable.startsWith(initial)) ?? '';
}

function portugueseFor(syllable: string) {
  if (PDF_OVERRIDES[syllable]) return PDF_OVERRIDES[syllable];
  if (APICAL_SOUNDS[syllable]) return APICAL_SOUNDS[syllable];
  if (Y_SOUNDS[syllable]) return Y_SOUNDS[syllable];
  if (W_SOUNDS[syllable]) return W_SOUNDS[syllable];

  const initial = findInitial(syllable);
  let final = syllable.slice(initial.length);
  if (FRONTAL.has(initial) && final.startsWith('u')) final = `ü${final.slice(1)}`;
  return `${INITIAL_SOUNDS[initial] ?? initial}${FINAL_SOUNDS[final] ?? final}`;
}

function noteFor(syllable: string) {
  const initial = findInitial(syllable);
  const notes: string[] = [];
  if (ASPIRATED.has(initial)) notes.push('com sopro');
  if (UNASPIRATED.has(initial)) notes.push('sem sopro');
  if (RETROFLEX.has(initial)) notes.push('retroflexo');
  if (FRONTAL.has(initial)) notes.push('frontal');
  return notes.join(' · ') || undefined;
}

function sequenceKey(initial: string, syllable: string) {
  if (initial === 'y') return Y_FINAL_KEYS[syllable] ?? '';
  if (initial === 'w') return W_FINAL_KEYS[syllable] ?? '';

  let final = syllable.slice(initial.length);
  if (['j', 'q', 'x'].includes(initial) && final.startsWith('u')) final = `ü${final.slice(1)}`;
  return final;
}

const SYLLABLE_ROWS = INITIAL_ROWS.map((row) => ({
  ...row,
  items: row.values
    .map((pinyin) => ({ pinyin, order: FINAL_SEQUENCE.indexOf(sequenceKey(row.initial, pinyin)) }))
    .filter(({ order }) => order >= 0)
    .sort((a, b) => a.order - b.order)
    .map(({ pinyin }) => ({
      id: `syllable-${pinyin}`,
      pinyin,
      portuguese: portugueseFor(pinyin),
      audio: zhuyinFor(pinyin),
      note: noteFor(pinyin),
    })),
}));

const SYLLABLE_GROUPS = GROUP_DEFINITIONS.map((group) => ({
  ...group,
  rows: group.initials.map((initial) => SYLLABLE_ROWS.find((row) => row.initial === initial)!),
}));

const FINAL_ITEMS = FINAL_GROUPS.flatMap((group) => group.items);
const SYLLABLE_ITEMS = SYLLABLE_ROWS.flatMap((row) => row.items);
const ALL_ITEMS = [...INITIALS, ...FINAL_ITEMS, ...SYLLABLE_ITEMS];

export default function LettersAndSyllablesPage() {
  const { sessionId, shortId } = useClientSession();
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentItem, setCurrentItem] = useState<SoundItem | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [speed, setSpeed] = useState<'natural' | 'slow'>('natural');
  const [repeat, setRepeat] = useState(false);
  const [message, setMessage] = useState('');
  const [recordedAudioPlaying, setRecordedAudioPlaying] = useState(false);
  const [recordedAudioLoop, setRecordedAudioLoop] = useState(false);
  const [activeVowelTone, setActiveVowelTone] = useState(-1);

  const queue = useRef<SoundItem[]>([]);
  const queueIndex = useRef(0);
  const runId = useRef(0);
  const paused = useRef(false);
  const utteranceActive = useRef(false);
  const speedRef = useRef<'natural' | 'slow'>('natural');
  const repeatRef = useRef(false);
  const timer = useRef<number | null>(null);
  const vowelAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => {
    runId.current += 1;
    if (timer.current) window.clearTimeout(timer.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    vowelAudioRef.current?.pause();
  }, []);

  function stopRecordedVowels(reset = true) {
    const audio = vowelAudioRef.current;
    if (!audio) return;
    audio.pause();
    if (reset) audio.currentTime = 0;
    setRecordedAudioPlaying(false);
    setActiveVowelTone(-1);
  }

  function resetPlayback() {
    setStatus('idle');
    setCurrentItem(null);
    setProgress({ current: 0, total: 0 });
    utteranceActive.current = false;
  }

  function stopPlayback(clearMessage = true) {
    runId.current += 1;
    paused.current = false;
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (clearMessage) setMessage('');
    resetPlayback();
  }

  function playNext(activeRun: number) {
    if (runId.current !== activeRun || paused.current) return;

    if (queueIndex.current >= queue.current.length) {
      if (repeatRef.current && queue.current.length) {
        queueIndex.current = 0;
        timer.current = window.setTimeout(() => {
          timer.current = null;
          playNext(activeRun);
        }, SEQUENCE_GAP);
        return;
      }
      resetPlayback();
      return;
    }

    const item = queue.current[queueIndex.current];
    setCurrentItem(item);
    setProgress({ current: queueIndex.current + 1, total: queue.current.length });

    const utterance = new SpeechSynthesisUtterance(item.audio);
    const voices = window.speechSynthesis.getVoices();
    const mandarinVoice = voices.find((voice) => voice.lang.toLowerCase() === 'zh-tw')
      ?? voices.find((voice) => voice.lang.toLowerCase() === 'zh-cn')
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));

    utterance.lang = mandarinVoice?.lang ?? 'zh-TW';
    utterance.rate = speedRef.current === 'slow' ? 0.5 : 0.76;
    utterance.pitch = 1;
    if (mandarinVoice) utterance.voice = mandarinVoice;
    utterance.onstart = () => {
      if (runId.current !== activeRun) return;
      utteranceActive.current = true;
      setStatus('playing');
      setMessage('');
    };
    utterance.onend = () => {
      if (runId.current !== activeRun) return;
      utteranceActive.current = false;
      queueIndex.current += 1;
      timer.current = window.setTimeout(() => {
        timer.current = null;
        playNext(activeRun);
      }, SEQUENCE_GAP);
    };
    utterance.onerror = () => {
      if (runId.current !== activeRun) return;
      setMessage('Não foi possível iniciar a voz em mandarim neste dispositivo.');
      stopPlayback(false);
    };
    window.speechSynthesis.speak(utterance);
  }

  function startQueue(items: SoundItem[]) {
    if (!items.length || !('speechSynthesis' in window)) {
      setMessage('O áudio não está disponível neste navegador.');
      return;
    }
    stopRecordedVowels();
    stopPlayback();
    queue.current = items;
    queueIndex.current = 0;
    const activeRun = runId.current + 1;
    runId.current = activeRun;
    setStatus('playing');
    setProgress({ current: 1, total: items.length });
    playNext(activeRun);
  }

  function togglePause() {
    if (status === 'idle') return;
    if (status === 'playing') {
      paused.current = true;
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
      if (utteranceActive.current) window.speechSynthesis.pause();
      setStatus('paused');
      return;
    }

    paused.current = false;
    setStatus('playing');
    if (utteranceActive.current) window.speechSynthesis.resume();
    else playNext(runId.current);
  }

  function changeSpeed(value: 'natural' | 'slow') {
    speedRef.current = value;
    setSpeed(value);
  }

  function toggleRepeat() {
    const nextValue = !repeat;
    repeatRef.current = nextValue;
    setRepeat(nextValue);
  }

  async function toggleRecordedVowels(fromStart = false) {
    const audio = vowelAudioRef.current;
    if (!audio) return;

    stopPlayback();
    if (!audio.paused && !fromStart) {
      audio.pause();
      return;
    }
    if (fromStart) audio.currentTime = 0;
    try {
      await audio.play();
      setMessage('');
    } catch {
      setMessage('Não foi possível reproduzir o áudio gravado neste navegador.');
    }
  }

  function followRecordedVowels(currentTime: number) {
    let nextIndex = -1;
    for (let index = 0; index < VOWEL_TONES.length; index += 1) {
      if (currentTime >= VOWEL_TONES[index].start) nextIndex = index;
      else break;
    }
    setActiveVowelTone(nextIndex);
  }

  function soundButton(item: SoundItem) {
    const active = currentItem?.id === item.id && status !== 'idle';
    return (
      <button key={item.id} type="button" className={`${styles.soundCard} ${active ? styles.activeSound : ''}`}
        onClick={() => startQueue([item])} aria-label={`Ouvir ${item.pinyin}: ${item.portuguese}`}>
        <span className={styles.soundPinyin}>{item.pinyin}</span>
        <span className={styles.soundPortuguese}>{item.portuguese}</span>
        {item.note && <small>{item.note}</small>}
        <i aria-hidden="true">{active ? '■' : '▶'}</i>
      </button>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="Tons de Mandarim, início">
          <span className={styles.brandMark} aria-hidden="true">声</span>
          <span>Tons de Mandarim</span>
        </Link>
        <nav className={styles.nav} aria-label="Navegação principal">
          <span className="session-badge" title="Esta sessão não compartilha dados com outros visitantes">
            <i aria-hidden="true" />
            <span>Sessão {shortId || 'privada'}</span>
          </span>
          <Link href="/">Frases</Link>
          <Link className={styles.activeNav} href="/letras-e-silabas">Letras e sílabas</Link>
          <Link href="/exercicios">Exercícios</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Pinyin do zero</span>
          <h1>Letras e sílabas.<br /><em>Escute uma por uma.</em></h1>
          <p>Pratique os sons básicos do pinyin sem marcas de tom, com uma aproximação pensada para quem fala português.</p>
          <div className={styles.heroBadges}>
            <span>{INITIALS.length} iniciais</span>
            <span>{FINAL_ITEMS.length} finais</span>
            <span>{SYLLABLE_ITEMS.length} sílabas</span>
          </div>
        </div>

        <div className={styles.player} aria-live="polite">
          <div className={styles.playerTop}>
            <span className={styles.playerLabel}>{status === 'idle' ? 'Pronto para praticar' : status === 'paused' ? 'Reprodução pausada' : 'Reproduzindo agora'}</span>
            {progress.total > 0 && <span className={styles.progress}>{progress.current}/{progress.total}</span>}
          </div>
          <div className={styles.nowPlaying}>
            <strong>{currentItem?.pinyin ?? 'Escolha um som ou uma sequência'}</strong>
            <span>{currentItem ? `Como em português: ${currentItem.portuguese}` : 'Você pode ouvir um item, um grupo ou a tabela completa.'}</span>
          </div>
          <div className={styles.mainControls}>
            <button className={styles.primaryButton} type="button" onClick={() => startQueue(ALL_ITEMS)}>
              <span aria-hidden="true">▶</span> Ouvir tudo
            </button>
            <button type="button" onClick={togglePause} disabled={status === 'idle'}>
              {status === 'paused' ? 'Continuar' : 'Pausar'}
            </button>
            <button type="button" onClick={() => stopPlayback()} disabled={status === 'idle'}>Parar</button>
          </div>
          <div className={styles.playerOptions}>
            <div className={styles.segmented} aria-label="Velocidade do áudio">
              <button type="button" className={speed === 'natural' ? styles.selected : ''}
                onClick={() => changeSpeed('natural')} aria-pressed={speed === 'natural'}>Natural</button>
              <button type="button" className={speed === 'slow' ? styles.selected : ''}
                onClick={() => changeSpeed('slow')} aria-pressed={speed === 'slow'}>Devagar</button>
            </div>
            <button type="button" className={`${styles.repeatButton} ${repeat ? styles.selected : ''}`}
              onClick={toggleRepeat} aria-pressed={repeat}>↻ Repetir lista</button>
          </div>
          {message && <p className={styles.audioMessage} role="status">{message}</p>}
        </div>
      </section>

      <section className={styles.notice}>
        <strong>Importante:</strong>
        <p>Os acentos na versão em português indicam apenas como aproximar a leitura e não representam os quatro tons. O áudio usa símbolos fonéticos chineses para evitar a leitura em inglês, mas a voz pode acrescentar entonação natural. Há uma pausa de 1 segundo entre os itens.</p>
      </section>

      <section className={styles.vowelAudioSection} id="vogais-com-tons">
        <div className={styles.vowelAudioCopy}>
          <span className={styles.eyebrow}>Áudio real · quatro tons</span>
          <h2>Acompanhe as vogais em mandarim.</h2>
          <p>O som foi extraído do vídeo enviado. A reprodução segue a ordem <strong>a, o, e, i, u e ü</strong>, passando pelos quatro tons de cada vogal.</p>
          <div className={styles.recordedControls}>
            <button className={styles.recordedPlay} type="button" onClick={() => toggleRecordedVowels()}>
              <span aria-hidden="true">{recordedAudioPlaying ? 'Ⅱ' : '▶'}</span>
              {recordedAudioPlaying ? 'Pausar gravação' : 'Reproduzir vogais'}
            </button>
            <button type="button" onClick={() => toggleRecordedVowels(true)}>↺ Ouvir do começo</button>
            <button
              className={recordedAudioLoop ? styles.recordedOptionActive : ''}
              type="button"
              onClick={() => setRecordedAudioLoop((current) => !current)}
              aria-pressed={recordedAudioLoop}
            >
              ↻ Loop {recordedAudioLoop ? 'ligado' : 'desligado'}
            </button>
          </div>
          <audio
            ref={vowelAudioRef}
            className={styles.recordedAudio}
            controls
            loop={recordedAudioLoop}
            preload="metadata"
            src="/audio/vogais-mandarim-quatro-tons.m4a"
            onPlay={() => {
              stopPlayback();
              setRecordedAudioPlaying(true);
            }}
            onPause={() => setRecordedAudioPlaying(false)}
            onEnded={() => {
              setRecordedAudioPlaying(false);
              setActiveVowelTone(-1);
            }}
            onTimeUpdate={(event) => followRecordedVowels(event.currentTarget.currentTime)}
          >
            Seu navegador não consegue reproduzir este áudio.
          </audio>
        </div>

        <div className={`${styles.vowelToneBoard} ${recordedAudioPlaying ? styles.vowelBoardPlaying : ''}`}>
          <div className={styles.vowelBoardTop}>
            <span>{recordedAudioPlaying ? 'A voz está pronunciando' : 'Sequência da gravação'}</span>
            <strong aria-live="polite">
              {activeVowelTone >= 0
                ? `${VOWEL_TONES[activeVowelTone].label} · ${VOWEL_TONES[activeVowelTone].tone}º tom`
                : '24 sons'}
            </strong>
          </div>
          <div className={styles.vowelToneGroups}>
            {VOWEL_TONE_GROUPS.map((group) => (
              <div className={styles.vowelToneGroup} key={group.vowel}>
                <span className={styles.vowelName}>{group.vowel}</span>
                <div>
                  {group.tones.map(([label, tone]) => {
                    const toneIndex = VOWEL_TONES.findIndex((item) => item.label === label);
                    return (
                      <span
                        className={`${styles.toneCell} ${toneIndex === activeVowelTone ? styles.activeTone : ''}`}
                        key={label}
                        title={`${tone}º tom`}
                        aria-label={`${label}, ${tone}º tom`}
                      >
                        <b>{label}</b>
                        <small>{tone}º</small>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p>O destaque acompanha cada som para você saber qual vogal e qual tom estão sendo pronunciados.</p>
        </div>

        <div className={styles.vowelRecorder}>
          <PracticeRecorder
            phrase="Vogais a, o, e, i, u e ü nos quatro tons"
            pinyin="ā á ǎ à · ō ó ǒ ò · ē é ě è · ī í ǐ ì · ū ú ǔ ù · ǖ ǘ ǚ ǜ"
            sessionId={sessionId}
            storageScope="vowel-tones"
            onBeforeRecord={() => {
              stopPlayback();
              stopRecordedVowels();
            }}
          />
        </div>
      </section>

      <section className={styles.contentSection} id="sons-basicos">
        <div className={styles.sectionHeading}>
          <div><span>01 · Fundamentos</span><h2>Iniciais e finais</h2></div>
          <button type="button" onClick={() => startQueue([...INITIALS, ...FINAL_ITEMS])}>▶ Ouvir sons básicos</button>
        </div>

        <article className={styles.initialPanel}>
          <div className={styles.panelHeading}>
            <div><span>Consoantes</span><h3>Iniciais</h3></div>
            <button type="button" onClick={() => startQueue(INITIALS)}>▶ Ouvir iniciais</button>
          </div>
          <p className={styles.panelNote}>O áudio usa símbolos fonéticos chineses, não letras lidas em inglês. Nas iniciais, observe principalmente o sopro e a posição da língua.</p>
          <div className={styles.initialGrid}>{INITIALS.map(soundButton)}</div>
        </article>

        <div className={styles.finalColumns}>
          {FINAL_GROUPS.map((group) => (
            <article className={styles.finalColumn} key={group.id}>
              <div className={styles.columnHeading}>
                <div><span>{group.subtitle}</span><h3>{group.title}</h3></div>
                <button type="button" onClick={() => startQueue(group.items)} aria-label={`Ouvir coluna ${group.title}`}>▶</button>
              </div>
              <div className={styles.columnSounds}>{group.items.map(soundButton)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.contentSection} ${styles.syllableSection}`} id="silabas">
        <div className={styles.sectionHeading}>
          <div><span>02 · Tabela completa</span><h2>Sílabas por grupo</h2></div>
          <button type="button" onClick={() => startQueue(SYLLABLE_ITEMS)}>▶ Ouvir todas as sílabas</button>
        </div>
        <p className={styles.sectionIntro}>
          Cada letra segue a ordem <strong>a · o · e · i · u · ü · ai · ei · ui · ao · ou · iu · ie · üe · er · an · en · in · un · ün · ang · eng · ing · ong</strong>. Combinações que não existem em mandarim são puladas automaticamente.
        </p>

        <div className={styles.groupGrid}>
          {SYLLABLE_GROUPS.map((group) => {
            const groupItems = group.rows.flatMap((row) => row.items);
            return (
              <article className={styles.syllableGroup} key={group.id}>
                <div className={styles.groupHeading}>
                  <div><span>Grupo de iniciais</span><h3>{group.title}</h3></div>
                  <button type="button" onClick={() => startQueue(groupItems)}>▶ Ouvir grupo</button>
                </div>
                {group.rows.map((row) => (
                  <div className={styles.syllableRow} key={row.initial}>
                    <button className={styles.initialPlay} type="button" onClick={() => startQueue(row.items)}
                      aria-label={`Ouvir todas as sílabas com ${row.initial}`}>
                      <strong>{row.initial}</strong><span>▶ linha</span>
                    </button>
                    <div className={styles.syllableCards}>{row.items.map(soundButton)}</div>
                  </div>
                ))}
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.specialNote}>
        <span>Som que merece atenção</span>
        <h2>O “i” especial não é o “i” do português.</h2>
        <p>Em <strong>zhi, chi, shi, ri, zi, ci</strong> e <strong>si</strong>, a vogal depende da posição da consoante. Use a escrita em português apenas como apoio e compare sempre com o áudio.</p>
      </section>

      <footer className={styles.footer}>
        <span className={styles.brandMark} aria-hidden="true">声</span>
        <p>Guia de apoio para brasileiros. As aproximações não substituem a pronúncia nativa.</p>
        <Link href="/">Voltar para frases →</Link>
      </footer>
    </main>
  );
}
