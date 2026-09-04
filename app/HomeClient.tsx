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
import RecordedNumberSequence from './components/RecordedNumberSequence';

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

type TranslationState = {
  source: string;
  text: string;
  alignments: TranslationAlignment[];
  status: 'idle' | 'loading' | 'success' | 'error';
};

type TranslationAlignment = {
  source: string;
  sourceStart: number;
  sourceEnd: number;
  translations: string[];
};

function normalizePortugueseWord(value: string) {
  return value
    .replace(/\([ao]\)/gi, '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^\p{L}\p{N}]/gu, '');
}

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
  { hanzi: '你好！我叫李文。', translation: 'Olá! Eu me chamo Li Wen.' },
  { hanzi: '你好！我叫白家月。', translation: 'Olá! Eu me chamo Bai Jiayue.' },
  { hanzi: '很高兴认识你。', translation: 'Muito prazer em conhecer você.' },
  { hanzi: '认识你我也很高兴。', translation: 'Eu também fico muito feliz em conhecer você.' },
  { hanzi: '我是中国人。', translation: 'Eu sou chinês.' },
  {
    hanzi: '我是法国人。我的中文老师也是中国人。',
    translation: 'Eu sou francesa. Meu professor de chinês também é chinês.',
  },
  { hanzi: '姐姐。', translation: 'Irmã mais velha.' },
  {
    hanzi: '对，还很忙。你也很忙吗？',
    translation: 'Sim, ainda estou muito ocupada. Você também está muito ocupada?',
  },
  { hanzi: '我不太忙。我们很想你。', translation: 'Não estou muito ocupada. Sentimos muito a sua falta.' },
  { hanzi: '我也想你们。', translation: 'Eu também sinto falta de vocês.' },
  { hanzi: '我有两个孩子。', translation: 'Eu tenho dois filhos.' },
  { hanzi: '你女朋友是哪国人？', translation: 'De que país é a sua namorada?' },
  { hanzi: '这是我女朋友。', translation: 'Esta é a minha namorada.' },
  { hanzi: '这是谁？', translation: 'Quem é esta pessoa?' },
  { hanzi: '今天我休息。', translation: 'Hoje estou de folga.' },
  { hanzi: '你的手机号是多少？', translation: 'Qual é o número do seu celular?' },
  { hanzi: '同学们，再见！', translation: 'Colegas, até logo!' },
  { hanzi: '不客气！', translation: 'De nada!' },
  { hanzi: '妈种麻，我放马。', translation: 'Mamãe planta cânhamo; eu solto o cavalo.' },
  { hanzi: '马吃麻，妈骂马。', translation: 'O cavalo come cânhamo; mamãe repreende o cavalo.' },
  { hanzi: '请问，你叫什么名字？', translation: 'Com licença, como você se chama?' },
  { hanzi: '我叫陈天中。', translation: 'Eu me chamo Chen Tianzhong.' },
  {
    hanzi: '你好，陈天中！我不是安妮，我是白家月。',
    translation: 'Olá, Chen Tianzhong! Eu não sou Annie; sou Bai Jiayue.',
  },
  { hanzi: '没关系！', translation: 'Não tem problema!' },
  {
    hanzi: '你也很忙吗？你是他的中文老师吗？',
    translation: 'Você também está muito ocupado(a)? Você é o(a) professor(a) de chinês dele?',
  },
  { hanzi: '你有姐姐吗？', translation: 'Você tem uma irmã mais velha?' },
  { hanzi: '一飞忙吗？', translation: 'Yifei está ocupada?' },
  { hanzi: '她很忙。她有多少个学生？', translation: 'Ela está muito ocupada. Quantos alunos ela tem?' },
  { hanzi: '她有二十个学生。', translation: 'Ela tem vinte alunos.' },
  {
    hanzi: '我有两个哥哥，你呢？我没有哥哥。',
    translation: 'Eu tenho dois irmãos mais velhos. E você? Eu não tenho irmãos mais velhos.',
  },
  { hanzi: '你家有几口人？', translation: 'Quantas pessoas há na sua família?' },
  {
    hanzi: '我家有四口人，爸爸、妈妈、妹妹和我。',
    translation: 'Minha família tem quatro pessoas: meu pai, minha mãe, minha irmã mais nova e eu.',
  },
  {
    hanzi: '是的。我有两个孩子，一个儿子，一个女儿。',
    translation: 'Sim. Eu tenho dois filhos: um filho e uma filha.',
  },
  { hanzi: '您儿子几岁？', translation: 'Quantos anos tem o seu filho?' },
  { hanzi: '他今年五岁。', translation: 'Ele tem cinco anos.' },
  { hanzi: '您女儿多大？', translation: 'Quantos anos tem a sua filha?' },
  { hanzi: '她今年十二。', translation: 'Ela tem doze anos.' },
];

type StudySource = { hanzi: string; translation: string };

const CHINESE_CALENDAR_DIGITS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'] as const;

function chineseCalendarNumber(value: number) {
  if (value < 10) return CHINESE_CALENDAR_DIGITS[value];
  if (value === 10) return '十';
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  return `${tens > 1 ? CHINESE_CALENDAR_DIGITS[tens] : ''}十${ones ? CHINESE_CALENDAR_DIGITS[ones] : ''}`;
}

const DAYS_OF_MONTH: StudySource[] = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1;
  return { hanzi: `${chineseCalendarNumber(day)}号`, translation: `Dia ${day}` };
});

const DAYS_OF_WEEK: StudySource[] = [
  { hanzi: '星期一', translation: 'Segunda-feira' },
  { hanzi: '星期二', translation: 'Terça-feira' },
  { hanzi: '星期三', translation: 'Quarta-feira' },
  { hanzi: '星期四', translation: 'Quinta-feira' },
  { hanzi: '星期五', translation: 'Sexta-feira' },
  { hanzi: '星期六', translation: 'Sábado' },
  { hanzi: '星期天', translation: 'Domingo' },
];

const MONTHS_OF_YEAR: StudySource[] = [
  { hanzi: '一月', translation: 'Janeiro' },
  { hanzi: '二月', translation: 'Fevereiro' },
  { hanzi: '三月', translation: 'Março' },
  { hanzi: '四月', translation: 'Abril' },
  { hanzi: '五月', translation: 'Maio' },
  { hanzi: '六月', translation: 'Junho' },
  { hanzi: '七月', translation: 'Julho' },
  { hanzi: '八月', translation: 'Agosto' },
  { hanzi: '九月', translation: 'Setembro' },
  { hanzi: '十月', translation: 'Outubro' },
  { hanzi: '十一月', translation: 'Novembro' },
  { hanzi: '十二月', translation: 'Dezembro' },
];

const CHINESE_NUMBERS: StudySource[] = [
  { hanzi: '一', translation: 'Um' },
  { hanzi: '二', translation: 'Dois' },
  { hanzi: '三', translation: 'Três' },
  { hanzi: '四', translation: 'Quatro' },
  { hanzi: '五', translation: 'Cinco' },
  { hanzi: '六', translation: 'Seis' },
  { hanzi: '七', translation: 'Sete' },
  { hanzi: '八', translation: 'Oito' },
  { hanzi: '九', translation: 'Nove' },
  { hanzi: '十', translation: 'Dez' },
];

const SEMANTIC_EQUIVALENTS: Record<string, string[]> = {
  我: ['eu', 'meu', 'minha'],
  你: ['você', 'seu', 'sua', 'te'],
  您: ['você', 'senhor', 'senhora'],
  他: ['ele', 'dele'],
  她: ['ela', 'dela'],
  我们: ['nós', 'nosso', 'nossa'],
  你们: ['vocês', 'seus', 'suas'],
  他们: ['eles', 'delas', 'deles'],
  大家: ['todos', 'todo mundo'],
  人: ['pessoa', 'pessoas'],
  老师: ['professor', 'professora'],
  学生: ['aluno', 'aluna', 'estudante'],
  同学: ['colega', 'colegas'],
  朋友: ['amigo', 'amiga', 'amigos', 'amigas'],
  中文: ['chinês', 'língua chinesa'],
  汉语: ['chinês', 'mandarim'],
  中国: ['China', 'chinês', 'chinesa'],
  中国人: ['chinês', 'chinesa'],
  法国: ['França', 'francês', 'francesa'],
  巴西: ['Brasil', 'brasileiro', 'brasileira'],
  名字: ['nome'],
  书: ['livro'],
  课: ['aula', 'lição'],
  第一课: ['primeira lição', 'primeira aula'],
  家: ['casa', 'família'],
  学校: ['escola'],
  工作: ['trabalho', 'trabalhar', 'trabalha'],
  是: ['é', 'sou', 'são', 'ser'],
  有: ['tem', 'tenho', 'ter', 'há'],
  叫: ['chamo', 'chama', 'chamar', 'nome'],
  认识: ['conhecer', 'conheço', 'conhecer você'],
  学习: ['estudar', 'estudo', 'estudamos', 'aprender'],
  读: ['ler', 'leia', 'lê'],
  说: ['falar', 'fale', 'fala', 'dizer', 'diga'],
  听: ['ouvir', 'escutar', 'ouça'],
  看: ['ver', 'olhar', 'veja'],
  写: ['escrever', 'escreva'],
  坐: ['sentar', 'sente-se', 'sente'],
  打开: ['abrir', 'abra'],
  喜欢: ['gostar', 'gosto', 'gosta'],
  知道: ['saber', 'sei', 'sabe'],
  明白: ['entender', 'entendo', 'entende'],
  吃: ['comer', 'coma'],
  喝: ['beber', 'beba'],
  去: ['ir', 'vá'],
  来: ['vir', 'venha'],
  回: ['voltar', 'retornar'],
  问: ['perguntar', 'pergunta'],
  请: ['por favor', 'por gentileza'],
  谢谢: ['obrigado', 'obrigada', 'agradeço'],
  再见: ['até logo', 'tchau'],
  你好: ['olá', 'oi'],
  您好: ['olá', 'bom dia'],
  早上好: ['bom dia'],
  晚上好: ['boa noite'],
  不客气: ['de nada'],
  对不起: ['desculpe', 'sinto muito'],
  没关系: ['não tem problema', 'tudo bem'],
  今天: ['hoje'],
  明天: ['amanhã'],
  昨天: ['ontem'],
  现在: ['agora'],
  还: ['ainda', 'também'],
  也: ['também'],
  都: ['todos', 'todas'],
  很: ['muito', 'bem'],
  再: ['novamente', 'de novo', 'mais uma vez'],
  一遍: ['uma vez'],
  好: ['bom', 'boa', 'bem', 'olá'],
  高兴: ['feliz', 'prazer', 'contente'],
  忙: ['ocupado', 'ocupada', 'ocupados', 'ocupadas'],
  慢: ['devagar', 'lento', 'lenta'],
  慢点: ['mais devagar', 'devagar'],
  快: ['rápido', 'rápida', 'depressa'],
  大: ['grande'],
  小: ['pequeno', 'pequena'],
  什么: ['o que', 'qual'],
  为什么: ['por que', 'porque'],
  怎么: ['como'],
  哪里: ['onde'],
  谁: ['quem'],
  上课: ['começar a aula', 'aula'],
  下课: ['fim da aula', 'terminar a aula'],
};

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
const PINYIN_PUNCTUATION: Record<string, string> = {
  '，': ',', '。': '.', '！': '!', '？': '?', '；': ';', '：': ':', '、': ',',
  ',': ',', '.': '.', '!': '!', '?': '?', ';': ';', ':': ':',
};
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

function pinyinWithPunctuation(text: string, reading: Syllable[]) {
  const tokens = reading.map((syllable) => syllable.pinyin);
  let lastSyllableIndex = -1;

  Array.from(text).forEach((character) => {
    if (HANZI_PATTERN.test(character)) {
      lastSyllableIndex += 1;
      return;
    }

    const punctuation = PINYIN_PUNCTUATION[character];
    if (punctuation && lastSyllableIndex >= 0 && tokens[lastSyllableIndex]) {
      tokens[lastSyllableIndex] += punctuation;
    }
  });

  return tokens.join(' ');
}

function prepareStudyItems(items: StudySource[]): PhraseStudyItem[] {
  return items.map((item, index) => {
    const reading = analyze(item.hanzi);
    return {
      id: index + 1,
      hanzi: item.hanzi,
      translation: item.translation,
      pinyin: pinyinWithPunctuation(item.hanzi, reading),
      portuguese: reading.map((syllable) => `${syllable.portuguese} (${syllable.tone})`).join(' '),
    };
  });
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
  const [isSilentGuiding, setIsSilentGuiding] = useState(false);
  const [activeSyllableRange, setActiveSyllableRange] = useState<{ start: number; end: number } | null>(null);
  const [audioMessage, setAudioMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [translation, setTranslation] = useState<TranslationState>({
    source: '', text: '', alignments: [], status: 'idle',
  });
  const [translationRefresh, setTranslationRefresh] = useState(0);
  const translationCache = useRef(new Map<string, Pick<TranslationState, 'text' | 'alignments'>>());
  const speechRun = useRef(0);
  const loopEnabled = useRef(false);
  const speedSetting = useRef<'natural' | 'slow'>('natural');
  const loopGapSetting = useRef(DEFAULT_LOOP_GAP);
  const loopTimer = useRef<number | null>(null);
  const loopReplay = useRef<(() => void) | null>(null);
  const syncStartTimer = useRef<number | null>(null);
  const syncStepTimer = useRef<number | null>(null);
  const boundarySeen = useRef(false);
  const phraseSequenceRef = useRef<PhraseSequenceHandle | null>(null);
  const numberSequenceRef = useRef<PhraseSequenceHandle | null>(null);
  const monthDaySequenceRef = useRef<PhraseSequenceHandle | null>(null);
  const weekSequenceRef = useRef<PhraseSequenceHandle | null>(null);
  const monthSequenceRef = useRef<PhraseSequenceHandle | null>(null);
  const pinyinDetected = isPinyinInput(phrase);
  const pinyinResolution = useMemo(() => resolvePinyin(phrase), [phrase]);
  const defaultCharacters = pinyinResolution?.choices.map((choice) => choice.selected) ?? [];
  const selectedCharacters = pinyinResolution && pinyinSelection.key === pinyinResolution.key
    && pinyinSelection.characters.length === pinyinResolution.choices.length
    ? pinyinSelection.characters
    : defaultCharacters;
  const resolvedPhrase = pinyinResolution ? selectedCharacters.join('') : phrase;
  const syllables = useMemo(() => analyze(resolvedPhrase), [resolvedPhrase]);
  const syllablePositions = useMemo(() => {
    const positions: Array<{ start: number; end: number }> = [];
    for (let offset = 0; offset < resolvedPhrase.length;) {
      const codePoint = resolvedPhrase.codePointAt(offset);
      if (codePoint === undefined) break;
      const character = String.fromCodePoint(codePoint);
      if (HANZI_PATTERN.test(character)) positions.push({ start: offset, end: offset + character.length });
      offset += character.length;
    }
    return positions.slice(0, syllables.length);
  }, [resolvedPhrase, syllables.length]);
  const displayCharacters = useMemo(() => {
    let syllableIndex = 0;
    return Array.from(resolvedPhrase.trim()).map((character) => {
      const index = HANZI_PATTERN.test(character) && syllableIndex < syllables.length ? syllableIndex : null;
      if (index !== null) syllableIndex += 1;
      return { character, syllableIndex: index };
    });
  }, [resolvedPhrase, syllables.length]);
  const pinyinLine = syllables.map((item) => item.pinyin).join(' ');
  const portugueseLine = syllables.map((item) => `${item.portuguese} (${item.tone})`).join(' ');
  const translationWords = useMemo(
    () => translation.status === 'success' ? translation.text.split(/\s+/).filter(Boolean) : [],
    [translation],
  );
  const alignmentTargetWords = useMemo(() => {
    const targetWords = translationWords.map(normalizePortugueseWord);
    const assignedTargets = new Set<number>();

    return translation.alignments.map((alignment, alignmentIndex) => {
      const sourceCenter = (alignment.sourceStart + alignment.sourceEnd) / 2;
      const sourceProgress = resolvedPhrase.length ? sourceCenter / resolvedPhrase.length : 0;

      const semanticCandidates = [
        ...(SEMANTIC_EQUIVALENTS[alignment.source] ?? []),
        ...alignment.translations,
      ];
      for (const candidate of semanticCandidates) {
        const candidateWords = candidate.split(/\s+/).map(normalizePortugueseWord).filter(Boolean);
        if (!candidateWords.length || candidateWords.length > targetWords.length) continue;

        const matches: number[][] = [];
        for (let start = 0; start <= targetWords.length - candidateWords.length; start += 1) {
          const windowMatches = candidateWords.every((word, offset) => targetWords[start + offset] === word);
          if (windowMatches) matches.push(candidateWords.map((_, offset) => start + offset));
        }
        if (!matches.length) continue;

        const bestMatch = matches.sort((left, right) => {
          const leftUsed = left.filter((index) => assignedTargets.has(index)).length;
          const rightUsed = right.filter((index) => assignedTargets.has(index)).length;
          if (leftUsed !== rightUsed) return leftUsed - rightUsed;
          const expected = sourceProgress * Math.max(1, targetWords.length - 1);
          return Math.abs(left[0] - expected) - Math.abs(right[0] - expected);
        })[0];
        bestMatch.forEach((index) => assignedTargets.add(index));
        return { alignmentIndex, targetIndices: bestMatch };
      }

      return { alignmentIndex, targetIndices: [] as number[] };
    });
  }, [resolvedPhrase.length, translation.alignments, translationWords]);
  const activeTranslationWords = useMemo(() => {
    const activeWords = new Set<number>();
    if (!activeSyllableRange) return activeWords;

    const activePositions = syllablePositions.slice(activeSyllableRange.start, activeSyllableRange.end + 1);
    alignmentTargetWords.forEach(({ alignmentIndex, targetIndices }) => {
      const alignment = translation.alignments[alignmentIndex];
      const overlaps = activePositions.some((position) => (
        position.start < alignment.sourceEnd && position.end > alignment.sourceStart
      ));
      if (overlaps) targetIndices.forEach((index) => activeWords.add(index));
    });
    return activeWords;
  }, [activeSyllableRange, alignmentTargetWords, syllablePositions, translation.alignments]);
  const studyPhrases = useMemo(() => prepareStudyItems(CLASSROOM_PHRASES), []);
  const chineseNumbers = useMemo(() => prepareStudyItems(CHINESE_NUMBERS), []);
  const monthDays = useMemo(() => prepareStudyItems(DAYS_OF_MONTH), []);
  const weekDays = useMemo(() => prepareStudyItems(DAYS_OF_WEEK), []);
  const yearMonths = useMemo(() => prepareStudyItems(MONTHS_OF_YEAR), []);

  function stopStudySequences(except: PhraseSequenceHandle | null = null) {
    [phraseSequenceRef.current, numberSequenceRef.current, monthDaySequenceRef.current, weekSequenceRef.current, monthSequenceRef.current]
      .forEach((player) => {
        if (player && player !== except) player.stop();
      });
  }

  useEffect(() => () => {
    speechRun.current += 1;
    if (loopTimer.current) window.clearTimeout(loopTimer.current);
    if (syncStartTimer.current) window.clearTimeout(syncStartTimer.current);
    if (syncStepTimer.current) window.clearInterval(syncStepTimer.current);
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

  useEffect(() => {
    const source = resolvedPhrase.trim();
    let cancelled = false;
    const updateTranslation = (next: TranslationState) => {
      queueMicrotask(() => {
        if (!cancelled) setTranslation(next);
      });
    };

    if (!source || !syllables.length) {
      updateTranslation({ source: '', text: '', alignments: [], status: 'idle' });
      return () => { cancelled = true; };
    }

    const savedPhrase = CLASSROOM_PHRASES.find((item) => item.hanzi === source);
    const cachedTranslation = translationCache.current.get(source);
    if (cachedTranslation) {
      updateTranslation({ source, ...cachedTranslation, status: 'success' });
      return () => { cancelled = true; };
    }

    const controller = new AbortController();
    updateTranslation({ source, text: '', alignments: [], status: 'loading' });
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: source, preferredTranslation: savedPhrase?.translation }),
          signal: controller.signal,
        });
        const data = await response.json() as {
          translation?: string;
          alignments?: TranslationAlignment[];
          error?: string;
        };
        if (!response.ok || !data.translation) throw new Error(data.error ?? 'Translation failed');
        const translatedResult = { text: data.translation, alignments: data.alignments ?? [] };
        translationCache.current.set(source, translatedResult);
        if (!cancelled) setTranslation({ source, ...translatedResult, status: 'success' });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(error);
        if (!cancelled) setTranslation({ source, text: '', alignments: [], status: 'error' });
      }
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [resolvedPhrase, syllables.length, translationRefresh]);

  function chooseCharacter(index: number, character: string) {
    if (!pinyinResolution) return;
    if (isSpeaking) stopSpeaking();
    if (isSilentGuiding) stopSilentGuide();
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
    clearSyncTimers();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveSyllableRange(null);
    setAudioMessage('');
  }

  function clearSyncTimers() {
    if (syncStartTimer.current) {
      window.clearTimeout(syncStartTimer.current);
      syncStartTimer.current = null;
    }
    if (syncStepTimer.current) {
      window.clearInterval(syncStepTimer.current);
      syncStepTimer.current = null;
    }
  }

  function stopSilentGuide() {
    speechRun.current += 1;
    if (loopTimer.current) {
      window.clearTimeout(loopTimer.current);
      loopTimer.current = null;
    }
    loopReplay.current = null;
    clearSyncTimers();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSilentGuiding(false);
    setActiveSyllableRange(null);
  }

  function startSilentGuide(alwaysRepeat = false) {
    if (!resolvedPhrase.trim() || !syllables.length || !('speechSynthesis' in window)) {
      setAudioMessage('O guia silencioso não está disponível neste navegador.');
      return;
    }
    stopStudySequences();
    if (isSpeaking) stopSpeaking();
    stopSilentGuide();

    window.speechSynthesis.cancel();
    const runId = speechRun.current + 1;
    speechRun.current = runId;

    const playMutedPhrase = () => {
      if (speechRun.current !== runId) return;

      const utterance = new SpeechSynthesisUtterance(resolvedPhrase);
      const voices = window.speechSynthesis.getVoices();
      const mandarinVoice = voices.find((voice) => voice.lang.toLowerCase() === 'zh-cn')
        ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));

      utterance.lang = 'zh-CN';
      utterance.rate = speedSetting.current === 'slow' ? 0.55 : 0.88;
      utterance.pitch = 1;
      utterance.volume = 0;
      if (mandarinVoice) utterance.voice = mandarinVoice;
      utterance.onstart = () => {
        if (speechRun.current !== runId) return;
        boundarySeen.current = false;
        clearSyncTimers();
        beginFallbackSync(runId);
        setIsSilentGuiding(true);
        setAudioMessage('Guia silencioso ativo: é a mesma voz chinesa e o mesmo ritmo, mas com o volume zerado.');
      };
      utterance.onboundary = (event) => {
        if (speechRun.current !== runId || event.name === 'sentence') return;
        const range = rangeForBoundary(event.charIndex, event.charLength ?? 0);
        if (!range) return;
        boundarySeen.current = true;
        clearSyncTimers();
        setActiveSyllableRange(range);
      };
      utterance.onend = () => {
        if (speechRun.current !== runId) return;
        clearSyncTimers();
        setActiveSyllableRange(null);
        if (alwaysRepeat || loopEnabled.current) {
          loopReplay.current = playMutedPhrase;
          loopTimer.current = window.setTimeout(() => {
            loopTimer.current = null;
            const replay = loopReplay.current;
            loopReplay.current = null;
            replay?.();
          }, loopGapSetting.current * 1000);
          return;
        }
        setIsSilentGuiding(false);
        setAudioMessage('Guia silencioso concluído. Você pode reproduzi-lo novamente.');
      };
      utterance.onerror = () => {
        if (speechRun.current !== runId) return;
        clearSyncTimers();
        setActiveSyllableRange(null);
        setIsSilentGuiding(false);
        setAudioMessage('Não foi possível iniciar o guia silencioso neste dispositivo.');
      };
      window.speechSynthesis.speak(utterance);
    };

    playMutedPhrase();
  }

  function toggleSilentGuide() {
    if (isSilentGuiding) {
      stopSilentGuide();
      setAudioMessage('Guia silencioso interrompido.');
      return;
    }
    startSilentGuide(false);
  }

  function rangeForBoundary(charIndex: number, charLength: number) {
    if (!syllablePositions.length) return null;
    const boundaryEnd = charIndex + Math.max(charLength, 1);
    const matches = syllablePositions
      .map((position, index) => ({ position, index }))
      .filter(({ position }) => position.start < boundaryEnd && position.end > charIndex)
      .map(({ index }) => index);

    if (matches.length) return { start: matches[0], end: matches[matches.length - 1] };
    const nearest = syllablePositions.findIndex((position) => position.start >= charIndex);
    const index = nearest >= 0 ? nearest : syllablePositions.length - 1;
    return { start: index, end: index };
  }

  function beginFallbackSync(runId: number) {
    if (!syllables.length) return;
    let index = 0;
    setActiveSyllableRange({ start: 0, end: 0 });
    syncStartTimer.current = window.setTimeout(() => {
      syncStartTimer.current = null;
      if (speechRun.current !== runId || boundarySeen.current) return;
      const stepDuration = speedSetting.current === 'slow' ? 560 : 350;
      syncStepTimer.current = window.setInterval(() => {
        if (speechRun.current !== runId || boundarySeen.current) {
          clearSyncTimers();
          return;
        }
        index = Math.min(index + 1, syllables.length - 1);
        setActiveSyllableRange({ start: index, end: index });
      }, stepDuration);
    }, 320);
  }

  function syllableIsActive(index: number) {
    return Boolean(activeSyllableRange
      && index >= activeSyllableRange.start
      && index <= activeSyllableRange.end);
  }

  function translationWordIsActive(index: number) {
    return activeTranslationWords.has(index);
  }

  function changePhrase(value: string) {
    if (isSpeaking) stopSpeaking();
    if (isSilentGuiding) stopSilentGuide();
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
      setIsSilentGuiding(false);
      clearSyncTimers();
      setActiveSyllableRange(null);
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

    stopStudySequences();
    if (isSilentGuiding) stopSilentGuide();

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
        boundarySeen.current = false;
        clearSyncTimers();
        beginFallbackSync(runId);
        setIsSpeaking(true);
        setAudioMessage('');
      };
      utterance.onboundary = (event) => {
        if (speechRun.current !== runId || event.name === 'sentence') return;
        const range = rangeForBoundary(event.charIndex, event.charLength ?? 0);
        if (!range) return;
        boundarySeen.current = true;
        clearSyncTimers();
        setActiveSyllableRange(range);
      };
      utterance.onend = () => {
        if (speechRun.current !== runId) return;
        clearSyncTimers();
        setActiveSyllableRange(null);
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
        clearSyncTimers();
        setActiveSyllableRange(null);
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
      const lines = [resolvedPhrase.trim(), pinyinLine, portugueseLine];
      if (translation.status === 'success') lines.push(translation.text);
      await navigator.clipboard.writeText(lines.join('\n'));
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
              <div className="inline-hanzi-row">
                <span>Acompanhando</span>
                <strong className="sync-line" lang="zh-CN">
                  {displayCharacters.map((item, index) => (
                    <span key={`${item.character}-${index}`}
                      className={`sync-token hanzi-sync-token ${item.syllableIndex !== null && syllableIsActive(item.syllableIndex) ? 'active-sync-token' : ''}`}>
                      {item.character}
                    </span>
                  ))}
                </strong>
              </div>
              <div>
                <span>Pinyin com tons</span>
                <strong className="sync-line">
                  {syllables.map((item, index) => (
                    <span key={`${item.hanzi}-inline-pinyin-${index}`}
                      className={`sync-token ${syllableIsActive(index) ? 'active-sync-token' : ''}`}>{item.pinyin}</span>
                  ))}
                </strong>
              </div>
              <div className="inline-pronunciation">
                <span>Pronúncia em português</span>
                <strong className="sync-line">
                  {syllables.map((item, index) => (
                    <span key={`${item.hanzi}-inline-pt-${index}`}
                      className={`sync-token ${syllableIsActive(index) ? 'active-sync-token' : ''}`}>
                      {item.portuguese} ({item.tone})
                    </span>
                  ))}
                </strong>
              </div>
              <div className="inline-translation">
                <span>Tradução em português</span>
                {translation.status === 'success' && (
                  <strong className="sync-line" lang="pt-BR" aria-label={translation.text}>
                    {translationWords.map((word, index) => (
                      <span className={`sync-token ${translationWordIsActive(index) ? 'active-sync-token' : ''}`}
                        key={`${word}-inline-translation-${index}`}>{word}</span>
                    ))}
                  </strong>
                )}
                {translation.status === 'loading' && <strong className="translation-loading">Traduzindo…</strong>}
                {translation.status === 'error' && (
                  <strong className="translation-error">
                    Não foi possível traduzir agora.
                    <button type="button" onClick={() => setTranslationRefresh((value) => value + 1)}>Tentar novamente</button>
                  </strong>
                )}
              </div>
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
            <div className="primary-audio-actions">
              <button className="play-button" type="button" onClick={speak} disabled={!syllables.length}>
                <span className="play-icon" aria-hidden="true">{isSpeaking ? '◼' : '▶'}</span>
                {isSpeaking ? 'Parar áudio' : 'Ouvir em mandarim'}
              </button>
              <button className={`silent-guide-button ${isSilentGuiding ? 'active' : ''}`} type="button"
                onClick={toggleSilentGuide} disabled={!syllables.length} aria-pressed={isSilentGuiding}>
                <span aria-hidden="true">{isSilentGuiding ? '■' : '◉'}</span>
                {isSilentGuiding ? 'Parar guia' : 'Praticar sem voz'}
              </button>
            </div>
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
              stopSilentGuide();
              stopStudySequences();
            }}
            onRecordingStart={() => startSilentGuide(true)}
            onRecordingStop={stopSilentGuide}
          />
        </div>
      </section>

      <PhraseSequence ref={phraseSequenceRef} items={studyPhrases} sessionId={sessionId}
        onBeforePlay={() => {
          stopSpeaking();
          stopSilentGuide();
          stopStudySequences(phraseSequenceRef.current);
        }} />

      <RecordedNumberSequence
        ref={numberSequenceRef}
        items={chineseNumbers}
        onBeforePlay={() => {
          stopSpeaking();
          stopSilentGuide();
          stopStudySequences(numberSequenceRef.current);
        }}
      />

      <PhraseSequence
        ref={monthDaySequenceRef}
        items={monthDays}
        sessionId={sessionId}
        sectionId="dias-do-mes"
        kicker="Calendário em mandarim"
        title="Dias do mês, do 1 ao 30."
        description="Ouça os dias em ordem usando a forma falada com 号 (hào), comum para dizer datas em mandarim."
        countLabel="30 dias"
        playAllLabel="Reproduzir os dias 1–30"
        itemNoun="dia"
        gapLabel="Pausa entre os dias"
        onBeforePlay={() => {
          stopSpeaking();
          stopSilentGuide();
          stopStudySequences(monthDaySequenceRef.current);
        }}
      />

      <PhraseSequence
        ref={weekSequenceRef}
        items={weekDays}
        sessionId={sessionId}
        sectionId="dias-da-semana"
        kicker="Semana em mandarim"
        title="Dias da semana."
        description="Reproduza de segunda-feira a domingo e acompanhe cada nome em hanzi, pinyin e português."
        countLabel="7 dias"
        playAllLabel="Reproduzir a semana completa"
        itemNoun="dia da semana"
        gapLabel="Pausa entre os dias da semana"
        onBeforePlay={() => {
          stopSpeaking();
          stopSilentGuide();
          stopStudySequences(weekSequenceRef.current);
        }}
      />

      <PhraseSequence
        ref={monthSequenceRef}
        items={yearMonths}
        sessionId={sessionId}
        sectionId="meses-do-ano"
        kicker="Ano em mandarim"
        title="Meses do ano."
        description="Ouça de janeiro a dezembro em sequência ou escolha um mês para praticar separadamente."
        countLabel="12 meses"
        playAllLabel="Reproduzir janeiro–dezembro"
        itemNoun="mês"
        gapLabel="Pausa entre os meses"
        onBeforePlay={() => {
          stopSpeaking();
          stopSilentGuide();
          stopStudySequences(monthSequenceRef.current);
        }}
      />

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
              <p className="sync-line" lang="zh-CN">
                {displayCharacters.map((item, index) => (
                  <span key={`${item.character}-result-${index}`}
                    className={`sync-token hanzi-sync-token ${item.syllableIndex !== null && syllableIsActive(item.syllableIndex) ? 'active-sync-token' : ''}`}>
                    {item.character}
                  </span>
                ))}
              </p>
            </div>
            <div className="result-block">
              <span className="result-label"><i>2</i> Pinyin com tons</span>
              <div className="syllable-line pinyin-line">
                {syllables.map((item, index) => (
                  <span key={`${item.hanzi}-${index}`}
                    className={`sync-token tone-text-${item.tone || 0} ${syllableIsActive(index) ? 'active-sync-token' : ''}`}>
                    {item.pinyin}
                  </span>
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
                  <span className={`pt-syllable sync-token ${syllableIsActive(index) ? 'active-sync-token' : ''}`}
                    key={`${item.hanzi}-pt-${index}`}>
                    {item.portuguese}<b className={`tone-badge tone-bg-${item.tone || 0}`}>{item.tone}</b>
                  </span>
                ))}
              </div>
              <p className="tone-reading">
                {Array.from(new Set(syllables.map((item) => item.tone))).map((tone) => `${tone} = ${TONE_LABELS[tone]}`).join(' · ')}
              </p>
            </div>
            <div className="result-block translation-block">
              <div className="label-row">
                <span className="result-label"><i>4</i> Tradução em português do Brasil</span>
                <span className="support-badge">Tradução automática</span>
              </div>
              {translation.status === 'success' && (
                <p className="sync-line translation-sync-line" lang="pt-BR" aria-label={translation.text}>
                  {translationWords.map((word, index) => (
                    <span className={`sync-token ${translationWordIsActive(index) ? 'active-sync-token' : ''}`}
                      key={`${word}-result-translation-${index}`}>{word}</span>
                  ))}
                </p>
              )}
              {translation.status === 'loading' && <p className="translation-loading">Traduzindo a frase…</p>}
              {translation.status === 'error' && (
                <div className="translation-failed" role="status">
                  <p>Não foi possível buscar a tradução neste momento.</p>
                  <button type="button" onClick={() => setTranslationRefresh((value) => value + 1)}>Tentar novamente</button>
                </div>
              )}
              <small>O destaque pula para a palavra de significado equivalente em português, mesmo quando ela ocupa outra posição na frase. Partículas sem tradução direta podem não destacar nenhuma palavra.</small>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">你</span>
            <h3>Comece com ideogramas ou pinyin</h3>
            <p>A interpretação, o pinyin com tons, a pronúncia aproximada e a tradução aparecerão aqui.</p>
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
