'use client';

import { pinyin } from 'pinyin-pro';
import { useEffect, useMemo, useRef, useState } from 'react';
import PracticeRecorder from '../components/PracticeRecorder';
import styles from './page.module.css';

type Speed = 'natural' | 'slow';
type PlayerStatus = 'idle' | 'playing' | 'paused';

type DialogueSyllable = {
  hanzi: string;
  pinyin: string;
};

type DialogueLine = {
  id: string;
  speaker: string;
  speakerHanzi: string;
  speakerKey: 'yixue' | 'yifei' | 'tongle' | 'tianzhong' | 'jiayue';
  useDefaultVoice?: boolean;
  hanzi: string;
  translation: string;
  syllables: DialogueSyllable[];
  pinyinTokens: Array<{ text: string; syllableIndex: number }>;
  pinyinText: string;
  positions: Array<{ start: number; end: number }>;
  characters: Array<{ character: string; syllableIndex: number | null }>;
};

type Dialogue = {
  id: string;
  tab: string;
  lessonLabel: string;
  title: string;
  subtitle: string;
  lines: DialogueLine[];
};

type DialogueLineSource = Omit<DialogueLine, 'syllables' | 'pinyinTokens' | 'pinyinText' | 'positions' | 'characters'>;

const HANZI_PATTERN = /[\u3400-\u9fff]/u;
const LINE_GAP_MS = 800;
const PINYIN_PUNCTUATION: Record<string, string> = {
  '，': ',', '。': '.', '！': '!', '？': '?', '；': ';', '：': ':', '、': ',',
};

function prepareLine(line: DialogueLineSource): DialogueLine {
  const syllables = pinyin(line.hanzi, {
    type: 'all', toneType: 'symbol', nonZh: 'removed', toneSandhi: true, segmentit: 2,
  })
    .filter((item) => item.isZh)
    .map((item) => ({ hanzi: item.origin, pinyin: item.pinyin }));

  const positions: Array<{ start: number; end: number }> = [];
  for (let offset = 0; offset < line.hanzi.length;) {
    const codePoint = line.hanzi.codePointAt(offset);
    if (codePoint === undefined) break;
    const character = String.fromCodePoint(codePoint);
    if (HANZI_PATTERN.test(character)) positions.push({ start: offset, end: offset + character.length });
    offset += character.length;
  }

  let syllableIndex = 0;
  const characters = Array.from(line.hanzi).map((character) => {
    const index = HANZI_PATTERN.test(character) && syllableIndex < syllables.length ? syllableIndex : null;
    if (index !== null) syllableIndex += 1;
    return { character, syllableIndex: index };
  });

  const pinyinTokens = syllables.map((syllable, index) => ({ text: syllable.pinyin, syllableIndex: index }));
  let lastSyllableIndex = -1;
  Array.from(line.hanzi).forEach((character) => {
    if (HANZI_PATTERN.test(character)) {
      lastSyllableIndex += 1;
      return;
    }
    const punctuation = PINYIN_PUNCTUATION[character];
    if (punctuation && lastSyllableIndex >= 0 && pinyinTokens[lastSyllableIndex]) {
      pinyinTokens[lastSyllableIndex].text += punctuation;
    }
  });
  const pinyinText = pinyinTokens.map((token) => token.text).join(' ');

  return {
    ...line,
    syllables,
    pinyinTokens,
    pinyinText,
    positions: positions.slice(0, syllables.length),
    characters,
  };
}

const DIALOGUES: Dialogue[] = [
  {
    id: 'dialogue-3',
    tab: 'Diálogo 3',
    lessonLabel: '课文 3',
    title: 'Texto 3 (continuação)',
    subtitle: 'Uma conversa entre Wang Yixue e Wang Yifei.',
    lines: ([
      {
        id: 'dialogue-3-line-1', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue',
        hanzi: '喂，一飞！', translation: 'Oi/Alô, Yifei!',
      },
      {
        id: 'dialogue-3-line-2', speaker: 'Wang Yifei', speakerHanzi: '王一飞', speakerKey: 'yifei',
        hanzi: '姐姐！', translation: 'Irmã!',
      },
      {
        id: 'dialogue-3-line-3', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue',
        hanzi: '你工作还忙吗？', translation: 'Você ainda está ocupada com o trabalho?',
      },
      {
        id: 'dialogue-3-line-4', speaker: 'Wang Yifei', speakerHanzi: '王一飞', speakerKey: 'yifei',
        hanzi: '对，还很忙。你也很忙吗？', translation: 'Sim, ainda estou muito ocupada. Você também está muito ocupada?',
      },
      {
        id: 'dialogue-3-line-5', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue',
        hanzi: '我不太忙。我们很想你。', translation: 'Eu não estou muito ocupada. Sentimos muito sua falta.',
      },
      {
        id: 'dialogue-3-line-6', speaker: 'Wang Yifei', speakerHanzi: '王一飞', speakerKey: 'yifei',
        hanzi: '我也想你们。', translation: 'Eu também sinto falta de vocês.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-4',
    tab: 'Diálogo 4',
    lessonLabel: '课文 4',
    title: 'Texto 4',
    subtitle: 'Uma conversa entre Wang Yixue e Yang Tongle.',
    lines: ([
      {
        id: 'dialogue-4-line-1', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '你会做饭吗？', translation: 'Você sabe cozinhar?',
      },
      {
        id: 'dialogue-4-line-2', speaker: 'Yang Tongle', speakerHanzi: '杨同乐', speakerKey: 'tongle', useDefaultVoice: true,
        hanzi: '我会做。', translation: 'Sei cozinhar.',
      },
      {
        id: 'dialogue-4-line-3', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '你会做什么？', translation: 'O que você sabe cozinhar?',
      },
      {
        id: 'dialogue-4-line-4', speaker: 'Yang Tongle', speakerHanzi: '杨同乐', speakerKey: 'tongle', useDefaultVoice: true,
        hanzi: '我会做面条儿、饺子，也会做一些菜。星期天我也做饭。',
        translation: 'Sei fazer macarrão, jiaozi (bolinhos chineses) e também alguns pratos. Aos domingos, também cozinho.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-5',
    tab: 'Diálogo 5',
    lessonLabel: '课文 5',
    title: 'Texto 5',
    subtitle: 'Uma conversa entre Wang Yixue e Yang Tongle.',
    lines: ([
      {
        id: 'dialogue-5-line-1', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '同乐，下班吗？', translation: 'Tongle, já terminou o expediente?',
      },
      {
        id: 'dialogue-5-line-2', speaker: 'Yang Tongle', speakerHanzi: '杨同乐', speakerKey: 'tongle', useDefaultVoice: true,
        hanzi: '下班。', translation: 'Sim, terminei o expediente.',
      },
      {
        id: 'dialogue-5-line-3', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '这是你的新电脑吗？', translation: 'Este é o seu computador novo?',
      },
      {
        id: 'dialogue-5-line-4', speaker: 'Yang Tongle', speakerHanzi: '杨同乐', speakerKey: 'tongle', useDefaultVoice: true,
        hanzi: '是的，是我的新电脑。', translation: 'Sim, é o meu computador novo.',
      },
      {
        id: 'dialogue-5-line-5', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '真好看！', translation: 'É muito bonito!',
      },
      {
        id: 'dialogue-5-line-6', speaker: 'Yang Tongle', speakerHanzi: '杨同乐', speakerKey: 'tongle', useDefaultVoice: true,
        hanzi: '我也很喜欢它。', translation: 'Eu também gosto muito dele.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-6',
    tab: 'Diálogo 6',
    lessonLabel: '课文 6',
    title: 'Texto 6',
    subtitle: 'Uma conversa entre Chen Tianzhong e Bai Jiayue.',
    lines: ([
      {
        id: 'dialogue-6-line-1', speaker: 'Chen Tianzhong', speakerHanzi: '陈天中', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '家月，明天你去哪儿？', translation: 'Jiayue, aonde você vai amanhã?',
      },
      {
        id: 'dialogue-6-line-2', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '我想去超市买东西。', translation: 'Quero ir ao supermercado comprar algumas coisas.',
      },
      {
        id: 'dialogue-6-line-3', speaker: 'Chen Tianzhong', speakerHanzi: '陈天中', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '你去超市买什么？', translation: 'O que você vai comprar no supermercado?',
      },
      {
        id: 'dialogue-6-line-4', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '我想买些牛奶。', translation: 'Quero comprar um pouco de leite.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-7',
    tab: 'Diálogo 7',
    lessonLabel: '课文 7',
    title: 'Data e dia da semana',
    subtitle: 'Uma conversa entre Wang Yixue e Liu Ming.',
    lines: ([
      {
        id: 'dialogue-7-line-1', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '今天几号？', translation: 'Que dia é hoje?',
      },
      {
        id: 'dialogue-7-line-2', speaker: 'Liu Ming', speakerHanzi: '刘明', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '今天九月八号。', translation: 'Hoje é 8 de setembro.',
      },
      {
        id: 'dialogue-7-line-3', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '星期几？', translation: 'Que dia da semana é?',
      },
      {
        id: 'dialogue-7-line-4', speaker: 'Liu Ming', speakerHanzi: '刘明', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '星期日。今天我休息。', translation: 'Domingo. Hoje eu descanso.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-8',
    tab: 'Diálogo 8',
    lessonLabel: '课文 8',
    title: 'Números de celular',
    subtitle: 'Li Wen e Bai Jiayue trocam seus números de celular.',
    lines: ([
      {
        id: 'dialogue-8-line-1', speaker: 'Li Wen', speakerHanzi: '李文', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '家月，你的手机号是多少？', translation: 'Jiayue, qual é o número do seu celular?',
      },
      {
        id: 'dialogue-8-line-2', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '我的手机号是三三六零幺四九三幺九零。', translation: 'Meu número de celular é +33 601493190.',
      },
      {
        id: 'dialogue-8-line-3', speaker: 'Li Wen', speakerHanzi: '李文', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '我的手机号是八六幺三五五二七二幺幺六零。', translation: 'Meu número de celular é +86 13552721160.',
      },
      {
        id: 'dialogue-8-line-4', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '好的。', translation: 'Está bem.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-9',
    tab: 'Diálogo 9',
    lessonLabel: '课文 9',
    title: 'Jantar e transporte',
    subtitle: 'A família escolhe o que comer e como ir ao restaurante.',
    lines: ([
      {
        id: 'dialogue-9-line-1', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '星期天我们去哪儿吃晚饭？', translation: 'Onde vamos jantar no domingo?',
      },
      {
        id: 'dialogue-9-line-2', speaker: 'Liu Ming', speakerHanzi: '刘明', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '我还想去西安饭店。', translation: 'Eu ainda quero ir ao restaurante Xi’an.',
      },
      {
        id: 'dialogue-9-line-3', speaker: 'Liu Xiaoxue', speakerHanzi: '刘小雪', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '那边的包子非常好吃，我想吃包子。', translation: 'Os baozi de lá são muito gostosos; quero comer baozi.',
      },
      {
        id: 'dialogue-9-line-4', speaker: 'Liu Xiaoming', speakerHanzi: '刘小明', speakerKey: 'yifei', useDefaultVoice: true,
        hanzi: '妈妈，我想吃米饭，不想吃包子。', translation: 'Mamãe, quero comer arroz; não quero comer baozi.',
      },
      {
        id: 'dialogue-9-line-5', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '好的。我们怎么去？', translation: 'Está bem. Como vamos?',
      },
      {
        id: 'dialogue-9-line-6', speaker: 'Liu Ming', speakerHanzi: '刘明', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '坐出租车去。', translation: 'Vamos de táxi.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-10',
    tab: 'Diálogo 10',
    lessonLabel: '课文 10',
    title: 'Cinema e compromissos',
    subtitle: 'Li Wen e Bai Jiayue tentam combinar um horário para ir ao cinema.',
    lines: ([
      {
        id: 'dialogue-10-line-1', speaker: 'Li Wen', speakerHanzi: '李文', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '下午我想去电影院看电影，你去吗？', translation: 'À tarde, quero ir ao cinema assistir a um filme. Você vai?',
      },
      {
        id: 'dialogue-10-line-2', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '我不想去，下午还有事。', translation: 'Não quero ir. Ainda tenho um compromisso à tarde.',
      },
      {
        id: 'dialogue-10-line-3', speaker: 'Li Wen', speakerHanzi: '李文', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '好的。明天呢？', translation: 'Está bem. E amanhã?',
      },
      {
        id: 'dialogue-10-line-4', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '我明天下午两点还上课呢，四点半下课。', translation: 'Amanhã ainda tenho aula às duas da tarde e termino às quatro e meia.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-11',
    tab: 'Diálogo 11',
    lessonLabel: '课文 11',
    title: 'Em casa e antes do trabalho',
    subtitle: 'Wang Yixue e Liu Ming falam por telefone sobre horários e uma compra.',
    lines: ([
      {
        id: 'dialogue-11-line-1', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '喂，你在哪儿呢？', translation: 'Alô, onde você está?',
      },
      {
        id: 'dialogue-11-line-2', speaker: 'Liu Ming', speakerHanzi: '刘明', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '我在家里呢。', translation: 'Estou em casa.',
      },
      {
        id: 'dialogue-11-line-3', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '我晚上六点半下班。', translation: 'Saio do trabalho às seis e meia da noite.',
      },
      {
        id: 'dialogue-11-line-4', speaker: 'Liu Ming', speakerHanzi: '刘明', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '我八点去医院上班。', translation: 'Vou trabalhar no hospital às oito.',
      },
      {
        id: 'dialogue-11-line-5', speaker: 'Wang Yixue', speakerHanzi: '王一雪', speakerKey: 'yixue', useDefaultVoice: true,
        hanzi: '好的，你去店里买些菜吧。', translation: 'Está bem. Vá à loja comprar algumas verduras.',
      },
      {
        id: 'dialogue-11-line-6', speaker: 'Liu Ming', speakerHanzi: '刘明', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '好，我十分钟后去。', translation: 'Está bem. Vou daqui a dez minutos.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-12',
    tab: 'Diálogo 12',
    lessonLabel: '课文 12',
    title: 'O gatinho fora do quarto',
    subtitle: 'Bai Jiayue e Chen Tianzhong procuram um gatinho.',
    lines: ([
      {
        id: 'dialogue-12-line-1', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '房间外有一只小猫。', translation: 'Há um gatinho fora do quarto.',
      },
      {
        id: 'dialogue-12-line-2', speaker: 'Chen Tianzhong', speakerHanzi: '陈天中', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '我没看见，它在哪儿呢？', translation: 'Eu não vi. Onde ele está?',
      },
      {
        id: 'dialogue-12-line-3', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '它在桌子下呢。', translation: 'Ele está debaixo da mesa.',
      },
      {
        id: 'dialogue-12-line-4', speaker: 'Chen Tianzhong', speakerHanzi: '陈天中', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '这只小猫真漂亮！', translation: 'Este gatinho é muito bonito!',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-13',
    tab: 'Diálogo 13',
    lessonLabel: '课文 13',
    title: 'Combinando um encontro',
    subtitle: 'Bai Jiayue e Li Wen combinam o lugar e o horário do encontro.',
    lines: ([
      {
        id: 'dialogue-13-line-1', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '我们在哪儿见呢？', translation: 'Onde vamos nos encontrar?',
      },
      {
        id: 'dialogue-13-line-2', speaker: 'Li Wen', speakerHanzi: '李文', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '在学校书店前见吧。', translation: 'Vamos nos encontrar em frente à livraria da escola.',
      },
      {
        id: 'dialogue-13-line-3', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '好的。下午两点你能到吗？', translation: 'Está bem. Você consegue chegar às duas da tarde?',
      },
      {
        id: 'dialogue-13-line-4', speaker: 'Li Wen', speakerHanzi: '李文', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '我能到。我在学校吃午饭。', translation: 'Eu consigo chegar. Vou almoçar na escola.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-14',
    tab: 'Diálogo 14',
    lessonLabel: '课文 14',
    title: 'Médicos ocupados',
    subtitle: 'Liu Ming e o doutor Hu conversam sobre o trabalho no hospital.',
    lines: ([
      {
        id: 'dialogue-14-line-1', speaker: 'Liu Ming', speakerHanzi: '刘明', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '小胡，还没吃饭呢？', translation: 'Xiao Hu, ainda não comeu?',
      },
      {
        id: 'dialogue-14-line-2', speaker: 'Doutor Hu', speakerHanzi: '胡医生', speakerKey: 'yifei', useDefaultVoice: true,
        hanzi: '没吃呢。', translation: 'Ainda não comi.',
      },
      {
        id: 'dialogue-14-line-3', speaker: 'Liu Ming', speakerHanzi: '刘明', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '大医院病人多，医生非常忙。', translation: 'Hospitais grandes têm muitos pacientes, e os médicos ficam muito ocupados.',
      },
      {
        id: 'dialogue-14-line-4', speaker: 'Doutor Hu', speakerHanzi: '胡医生', speakerKey: 'yifei', useDefaultVoice: true,
        hanzi: '是的。我爸爸也在医院工作，他也非常忙。', translation: 'Sim. Meu pai também trabalha no hospital e também é muito ocupado.',
      },
      {
        id: 'dialogue-14-line-5', speaker: 'Liu Ming', speakerHanzi: '刘明', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '你家有两个医生？', translation: 'Há dois médicos na sua família?',
      },
      {
        id: 'dialogue-14-line-6', speaker: 'Doutor Hu', speakerHanzi: '胡医生', speakerKey: 'yifei', useDefaultVoice: true,
        hanzi: '对。', translation: 'Sim.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-15',
    tab: 'Diálogo 15',
    lessonLabel: '课文 15',
    title: 'Encontro no cinema',
    subtitle: 'Li Wen e Bai Jiayue combinam um filme e o ponto de encontro.',
    lines: ([
      {
        id: 'dialogue-15-line-1', speaker: 'Li Wen', speakerHanzi: '李文', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '学校前边有一家电影院。', translation: 'Há um cinema em frente à escola.',
      },
      {
        id: 'dialogue-15-line-2', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '对。我们晚上去那个电影院看电影吧。', translation: 'Sim. Vamos àquele cinema assistir a um filme à noite.',
      },
      {
        id: 'dialogue-15-line-3', speaker: 'Li Wen', speakerHanzi: '李文', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '好！我们七点在电影院外边见，好吗？', translation: 'Ótimo! Vamos nos encontrar fora do cinema às sete, está bem?',
      },
      {
        id: 'dialogue-15-line-4', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '好的，晚上七点见！', translation: 'Está bem. Nos vemos às sete da noite!',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
  {
    id: 'dialogue-16',
    tab: 'Diálogo 16',
    lessonLabel: '课文 16',
    title: 'O livro sobre a cadeira',
    subtitle: 'Bai Jiayue e Chen Tianzhong conversam sobre um livro e os planos de amanhã.',
    lines: ([
      {
        id: 'dialogue-16-line-1', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '椅子上有一本中文书，那是谁的书？', translation: 'Há um livro de chinês sobre a cadeira. De quem é esse livro?',
      },
      {
        id: 'dialogue-16-line-2', speaker: 'Chen Tianzhong', speakerHanzi: '陈天中', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '是我的书，谢谢。这是我的第二本中文书。', translation: 'É o meu livro, obrigado. Este é o meu segundo livro de chinês.',
      },
      {
        id: 'dialogue-16-line-3', speaker: 'Bai Jiayue', speakerHanzi: '白家月', speakerKey: 'jiayue', useDefaultVoice: true,
        hanzi: '不客气。你明天上午在哪儿？', translation: 'De nada. Onde você estará amanhã de manhã?',
      },
      {
        id: 'dialogue-16-line-4', speaker: 'Chen Tianzhong', speakerHanzi: '陈天中', speakerKey: 'tianzhong', useDefaultVoice: true,
        hanzi: '我明天上午在学校学习。', translation: 'Amanhã de manhã, estudarei na escola.',
      },
    ] satisfies DialogueLineSource[]).map(prepareLine),
  },
];

type HskDialoguePracticeProps = {
  sessionId: string;
  onBeforePlay?: () => void;
};

export default function HskDialoguePractice({ sessionId, onBeforePlay }: HskDialoguePracticeProps) {
  const [selectedDialogueId, setSelectedDialogueId] = useState(DIALOGUES[0].id);
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [speed, setSpeed] = useState<Speed>('slow');
  const [repeat, setRepeat] = useState(false);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [activeRange, setActiveRange] = useState<{ start: number; end: number } | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [message, setMessage] = useState('');
  const [recordingLineId, setRecordingLineId] = useState<string | null>(null);
  const [silentGuide, setSilentGuide] = useState(false);

  const runId = useRef(0);
  const queue = useRef<DialogueLine[]>([]);
  const queueIndex = useRef(0);
  const paused = useRef(false);
  const repeatRef = useRef(false);
  const speedRef = useRef<Speed>('slow');
  const silentRef = useRef(false);
  const timer = useRef<number | null>(null);
  const syncTimer = useRef<number | null>(null);
  const boundarySeen = useRef(false);

  const selectedDialogue = useMemo(
    () => DIALOGUES.find((dialogue) => dialogue.id === selectedDialogueId) ?? DIALOGUES[0],
    [selectedDialogueId],
  );

  function clearTimers() {
    if (timer.current !== null) window.clearTimeout(timer.current);
    if (syncTimer.current !== null) window.clearInterval(syncTimer.current);
    timer.current = null;
    syncTimer.current = null;
  }

  function resetPlayer() {
    setStatus('idle');
    setActiveLineId(null);
    setActiveRange(null);
    setProgress({ current: 0, total: 0 });
    setSilentGuide(false);
    silentRef.current = false;
  }

  function stopPlayback(clearMessage = true) {
    runId.current += 1;
    paused.current = false;
    clearTimers();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (clearMessage) setMessage('');
    resetPlayer();
  }

  useEffect(() => () => {
    runId.current += 1;
    clearTimers();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  function rangeForBoundary(line: DialogueLine, charIndex: number, charLength: number) {
    const boundaryEnd = charIndex + Math.max(charLength, 1);
    const matches = line.positions
      .map((position, index) => ({ position, index }))
      .filter(({ position }) => position.start < boundaryEnd && position.end > charIndex)
      .map(({ index }) => index);
    if (matches.length) return { start: matches[0], end: matches[matches.length - 1] };
    const nearest = line.positions.findIndex((position) => position.start >= charIndex);
    const index = nearest >= 0 ? nearest : line.positions.length - 1;
    return index >= 0 ? { start: index, end: index } : null;
  }

  function beginFallbackSync(line: DialogueLine, activeRun: number) {
    if (!line.syllables.length) return;
    let index = 0;
    setActiveRange({ start: 0, end: 0 });
    syncTimer.current = window.setInterval(() => {
      if (runId.current !== activeRun || boundarySeen.current) {
        if (syncTimer.current !== null) window.clearInterval(syncTimer.current);
        syncTimer.current = null;
        return;
      }
      index = Math.min(index + 1, line.syllables.length - 1);
      setActiveRange({ start: index, end: index });
    }, speedRef.current === 'slow' ? 560 : 350);
  }

  function finishQueue(activeRun: number) {
    if (runId.current !== activeRun) return;
    if (repeatRef.current && queue.current.length && !silentRef.current) {
      queueIndex.current = 0;
      timer.current = window.setTimeout(() => playNext(activeRun), LINE_GAP_MS);
      return;
    }
    resetPlayer();
  }

  function playNext(activeRun: number) {
    if (runId.current !== activeRun || paused.current) return;
    if (queueIndex.current >= queue.current.length) {
      finishQueue(activeRun);
      return;
    }

    const line = queue.current[queueIndex.current];
    setActiveLineId(line.id);
    setActiveRange(null);
    setProgress({ current: queueIndex.current + 1, total: queue.current.length });
    boundarySeen.current = false;

    const utterance = new SpeechSynthesisUtterance(line.hanzi);
    const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith('zh'));
    const voiceIndex = line.useDefaultVoice ? 0 : line.speakerKey === 'yifei' ? 1 : 0;
    const mandarinVoice = voices[voiceIndex % Math.max(voices.length, 1)];
    utterance.lang = mandarinVoice?.lang ?? 'zh-CN';
    utterance.rate = speedRef.current === 'slow' ? 0.55 : 0.88;
    utterance.pitch = line.useDefaultVoice ? 1 : line.speakerKey === 'yifei' ? 1.04 : 0.96;
    utterance.volume = silentRef.current ? 0 : 1;
    if (mandarinVoice) utterance.voice = mandarinVoice;

    utterance.onstart = () => {
      if (runId.current !== activeRun) return;
      setStatus('playing');
      setMessage('');
      beginFallbackSync(line, activeRun);
    };
    utterance.onboundary = (event) => {
      if (runId.current !== activeRun || event.name === 'sentence') return;
      const range = rangeForBoundary(line, event.charIndex, event.charLength ?? 0);
      if (!range) return;
      boundarySeen.current = true;
      if (syncTimer.current !== null) window.clearInterval(syncTimer.current);
      syncTimer.current = null;
      setActiveRange(range);
    };
    utterance.onend = () => {
      if (runId.current !== activeRun) return;
      if (syncTimer.current !== null) window.clearInterval(syncTimer.current);
      syncTimer.current = null;
      setActiveRange(null);
      queueIndex.current += 1;
      timer.current = window.setTimeout(() => {
        timer.current = null;
        playNext(activeRun);
      }, silentRef.current ? 0 : LINE_GAP_MS);
    };
    utterance.onerror = () => {
      if (runId.current !== activeRun) return;
      setMessage('Não foi possível reproduzir a voz em mandarim neste dispositivo.');
      stopPlayback(false);
    };
    window.speechSynthesis.speak(utterance);
  }

  function startQueue(lines: DialogueLine[], silent = false) {
    if (!lines.length || !('speechSynthesis' in window)) {
      setMessage('A voz em mandarim não está disponível neste navegador.');
      return;
    }
    onBeforePlay?.();
    stopPlayback();
    queue.current = lines;
    queueIndex.current = 0;
    silentRef.current = silent;
    setSilentGuide(silent);
    const activeRun = runId.current + 1;
    runId.current = activeRun;
    setStatus('playing');
    playNext(activeRun);
  }

  function togglePause() {
    if (status === 'idle' || silentGuide) return;
    if (status === 'playing') {
      paused.current = true;
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = null;
      window.speechSynthesis.pause();
      setStatus('paused');
      return;
    }
    paused.current = false;
    window.speechSynthesis.resume();
    setStatus('playing');
    if (!window.speechSynthesis.speaking) playNext(runId.current);
  }

  function changeSpeed(nextSpeed: Speed) {
    speedRef.current = nextSpeed;
    setSpeed(nextSpeed);
  }

  function changeDialogue(dialogueId: string) {
    if (dialogueId === selectedDialogueId) return;
    stopPlayback();
    setSelectedDialogueId(dialogueId);
  }

  function lineIsActive(lineId: string, syllableIndex: number) {
    return activeLineId === lineId && Boolean(activeRange
      && syllableIndex >= activeRange.start
      && syllableIndex <= activeRange.end);
  }

  return (
    <section className={styles.bookExercises} aria-labelledby="hsk-book-title">
      <div className={styles.bookHeading}>
        <div>
          <span>Prática guiada</span>
          <h2 id="hsk-book-title">Exercícios do livro HSK 1</h2>
          <p>Escolha um diálogo, escute cada fala e grave sua própria dublagem para comparar.</p>
        </div>
        <span className={styles.dialogueCount}>{DIALOGUES.length} diálogos</span>
      </div>

      <div className={styles.dialogueTabs} role="tablist" aria-label="Diálogos do livro HSK 1">
        {DIALOGUES.map((dialogue) => (
          <button type="button" role="tab" key={dialogue.id}
            aria-selected={selectedDialogueId === dialogue.id}
            className={selectedDialogueId === dialogue.id ? styles.activeDialogueTab : ''}
            onClick={() => changeDialogue(dialogue.id)}>
            {dialogue.tab}
          </button>
        ))}
      </div>

      <div className={styles.dialoguePanel} role="tabpanel">
        <div className={styles.dialoguePanelHead}>
          <div>
            <span>{selectedDialogue.lessonLabel}</span>
            <h3>{selectedDialogue.title}</h3>
            <p>{selectedDialogue.subtitle}</p>
          </div>
          <span>{selectedDialogue.lines.length} falas</span>
        </div>

        <div className={styles.dialoguePlayer}>
          <div className={styles.dialoguePlayerStatus}>
            <span>{silentGuide ? 'Acompanhando sua gravação' : status === 'playing' ? 'Reproduzindo diálogo' : status === 'paused' ? 'Diálogo pausado' : 'Pronto para praticar'}</span>
            {progress.total > 0 && <strong>{progress.current}/{progress.total}</strong>}
          </div>
          <div className={styles.dialogueControls}>
            <button className={styles.playDialogueButton} type="button"
              onClick={() => startQueue(selectedDialogue.lines)} disabled={recordingLineId !== null}>
              ▶ Ouvir diálogo completo
            </button>
            <button type="button" onClick={togglePause}
              disabled={status === 'idle' || silentGuide || recordingLineId !== null}>
              {status === 'paused' ? 'Continuar' : 'Pausar'}
            </button>
            <button type="button" onClick={() => stopPlayback()}
              disabled={status === 'idle' || recordingLineId !== null}>Parar</button>
            <div className={styles.dialogueSpeed} aria-label="Velocidade do diálogo">
              <button type="button" className={speed === 'slow' ? styles.activeDialogueOption : ''}
                onClick={() => changeSpeed('slow')} aria-pressed={speed === 'slow'}>Devagar</button>
              <button type="button" className={speed === 'natural' ? styles.activeDialogueOption : ''}
                onClick={() => changeSpeed('natural')} aria-pressed={speed === 'natural'}>Natural</button>
            </div>
            <button className={`${styles.repeatDialogue} ${repeat ? styles.activeDialogueOption : ''}`}
              type="button" onClick={() => {
                const next = !repeat;
                repeatRef.current = next;
                setRepeat(next);
              }} aria-pressed={repeat}>↻ Repetir</button>
          </div>
          {message && <p className={styles.dialogueMessage} role="status">{message}</p>}
        </div>

        <ol className={styles.dialogueLines}>
          {selectedDialogue.lines.map((line, index) => {
            const isActive = activeLineId === line.id && status !== 'idle';
            return (
              <li className={isActive ? styles.activeDialogueLine : ''} key={line.id}>
                <div className={styles.dialogueLineHead}>
                  <div>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong><b lang="zh-CN">{line.speakerHanzi}</b> · {line.speaker}</strong>
                  </div>
                  <button type="button" onClick={() => isActive ? stopPlayback() : startQueue([line])}
                    disabled={recordingLineId !== null}
                    aria-label={`Ouvir fala ${index + 1}: ${line.hanzi}`}>
                    {isActive && !silentGuide ? '■ Parar' : '▶ Ouvir fala'}
                  </button>
                </div>

                <p className={styles.dialogueHanzi} lang="zh-CN">
                  {line.characters.map((item, characterIndex) => (
                    <span key={`${item.character}-${characterIndex}`}
                      className={item.syllableIndex !== null && lineIsActive(line.id, item.syllableIndex) ? styles.activeDialogueToken : ''}>
                      {item.character}
                    </span>
                  ))}
                </p>
                <p className={styles.dialoguePinyin}>
                  {line.pinyinTokens.map((token) => (
                    <span key={`${line.id}-pinyin-${token.syllableIndex}`}
                      className={lineIsActive(line.id, token.syllableIndex) ? styles.activeDialogueToken : ''}>
                      {token.text}
                    </span>
                  ))}
                </p>
                <p className={styles.dialogueTranslation}>{line.translation}</p>

                <div className={styles.dialogueRecorder}>
                  <PracticeRecorder
                    phrase={line.hanzi}
                    pinyin={line.pinyinText}
                    sessionId={sessionId}
                    storageScope={`hsk1:${selectedDialogue.id}:${line.id}`}
                    onBeforeRecord={() => {
                      stopPlayback();
                      onBeforePlay?.();
                    }}
                    onRecordingStart={() => {
                      setRecordingLineId(line.id);
                      startQueue([line], true);
                    }}
                    onRecordingStop={() => {
                      setRecordingLineId(null);
                      stopPlayback();
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
