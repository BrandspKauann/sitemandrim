'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './page.module.css';

type ToneRuleChallenge = {
  id: string;
  hanzi: string;
  writtenPinyin: string;
  spokenPinyin: string;
  meaning: string;
  blocks: string;
  original: string;
  answer: string;
  choices: string[];
  explanation: string;
};

const CHALLENGES: ToneRuleChallenge[] = [
  { id: 'nihaoma', hanzi: '你好吗？', writtenPinyin: 'nǐ hǎo ma', spokenPinyin: 'ní hǎo ma', meaning: 'como você está?', blocks: '你好 | 吗', original: '3º + 3º | N', answer: '2º + 3º | N', choices: ['2º + 3º | N', '3º + 3º | N', '2º + 2º | N', '3º + 2º | N'], explanation: '你好 é um bloco 3º + 3º: 你 sobe e 好 mantém o 3º tom.' },
  { id: 'wohenhao', hanzi: '我很好。', writtenPinyin: 'wǒ hěn hǎo', spokenPinyin: 'wǒ hén hǎo', meaning: 'estou muito bem', blocks: '我 | 很好', original: '3º | 3º + 3º', answer: '3º | 2º + 3º', choices: ['3º | 2º + 3º', '2º | 2º + 3º', '3º | 3º + 3º', '2º | 3º + 3º'], explanation: 'O sujeito 我 fica separado. Dentro do bloco 很好, 很 sobe antes de 好.' },
  { id: 'woyehenhao', hanzi: '我也很好。', writtenPinyin: 'wǒ yě hěn hǎo', spokenPinyin: 'wó yě hén hǎo', meaning: 'eu também estou muito bem', blocks: '我也 | 很好', original: '3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º', '3º + 3º | 2º + 3º', '2º + 3º | 3º + 3º', '2º + 2º | 2º + 2º'], explanation: 'Há dois blocos 3º + 3º: 我也 e 很好. O primeiro tom de cada bloco sobe.' },
  { id: 'niyehenhao', hanzi: '你也很好。', writtenPinyin: 'nǐ yě hěn hǎo', spokenPinyin: 'ní yě hén hǎo', meaning: 'você também está muito bem', blocks: '你也 | 很好', original: '3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º', '3º + 3º | 3º + 3º', '3º + 2º | 3º + 2º', '2º + 2º | 2º + 2º'], explanation: '你也 e 很好 são dois blocos independentes; em cada um, o primeiro 3º tom sobe.' },
  { id: 'niyoushuiguoma', hanzi: '你有水果吗？', writtenPinyin: 'nǐ yǒu shuǐguǒ ma', spokenPinyin: 'ní yǒu shuíguǒ ma', meaning: 'você tem frutas?', blocks: '你有 | 水果 | 吗', original: '3º + 3º | 3º + 3º | N', answer: '2º + 3º | 2º + 3º | N', choices: ['2º + 3º | 2º + 3º | N', '3º + 3º | 2º + 3º | N', '2º + 3º | 3º + 3º | N', '2º + 2º | 2º + 2º | N'], explanation: '你有 e 水果 são dois blocos 3º + 3º; o primeiro tom de cada bloco sobe.' },
  { id: 'woyoushuiguo', hanzi: '我有水果。', writtenPinyin: 'wǒ yǒu shuǐguǒ', spokenPinyin: 'wó yǒu shuíguǒ', meaning: 'eu tenho frutas', blocks: '我有 | 水果', original: '3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º', '3º + 3º | 3º + 3º', '2º + 2º | 2º + 2º', '3º + 2º | 3º + 2º'], explanation: '我 sobe antes de 有, e 水 sobe antes de 果.' },
  { id: 'woxiangmaishuiguo', hanzi: '我想买水果。', writtenPinyin: 'wǒ xiǎng mǎi shuǐguǒ', spokenPinyin: 'wǒ xiáng mǎi shuíguǒ', meaning: 'quero comprar frutas', blocks: '我 | 想买 | 水果', original: '3º | 3º + 3º | 3º + 3º', answer: '3º | 2º + 3º | 2º + 3º', choices: ['3º | 2º + 3º | 2º + 3º', '2º | 2º + 3º | 2º + 3º', '3º | 3º + 3º | 2º + 3º', '3º | 2º + 3º | 3º + 3º'], explanation: '我 fica separado. As mudanças acontecem dentro de 想买 e 水果.' },
  { id: 'nixiangmaishuiguoma', hanzi: '你想买水果吗？', writtenPinyin: 'nǐ xiǎng mǎi shuǐguǒ ma', spokenPinyin: 'nǐ xiáng mǎi shuíguǒ ma', meaning: 'você quer comprar frutas?', blocks: '你 | 想买 | 水果 | 吗', original: '3º | 3º + 3º | 3º + 3º | N', answer: '3º | 2º + 3º | 2º + 3º | N', choices: ['3º | 2º + 3º | 2º + 3º | N', '2º | 2º + 3º | 2º + 3º | N', '3º | 3º + 3º | 2º + 3º | N', '3º | 2º + 3º | 3º + 3º | N'], explanation: '你 fica separado; 想 e 水 são os 3º tons que sobem dentro de seus blocos.' },
  { id: 'woyexiangmaishuiguo', hanzi: '我也想买水果。', writtenPinyin: 'wǒ yě xiǎng mǎi shuǐguǒ', spokenPinyin: 'wó yě xiáng mǎi shuíguǒ', meaning: 'eu também quero comprar frutas', blocks: '我也 | 想买 | 水果', original: '3º + 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º | 2º + 3º', '3º + 3º | 2º + 3º | 2º + 3º', '2º + 3º | 3º + 3º | 2º + 3º', '2º + 2º | 2º + 2º | 2º + 2º'], explanation: 'A frase tem três blocos 3º + 3º; o primeiro tom de cada bloco sobe.' },
  { id: 'niyoujigehaizi', hanzi: '你有几个孩子？', writtenPinyin: 'nǐ yǒu jǐ ge háizi', spokenPinyin: 'ní yǒu jǐ ge háizi', meaning: 'quantos filhos você tem?', blocks: '你有 | 几个 | 孩子', original: '3º + 3º | 3º + N | 2º + N', answer: '2º + 3º | 3º + N | 2º + N', choices: ['2º + 3º | 3º + N | 2º + N', '2º + 3º | 2º + N | 2º + N', '3º + 3º | 3º + N | 2º + N', '2º + 2º | 2º + N | 2º + N'], explanation: '你有 muda para 2º + 3º. Em 几个, 个 é neutro, então 几 continua em 3º tom.' },
  { id: 'woyoulianggehaizi', hanzi: '我有两个孩子。', writtenPinyin: 'wǒ yǒu liǎng ge háizi', spokenPinyin: 'wó yǒu liǎng ge háizi', meaning: 'tenho dois filhos', blocks: '我有 | 两个 | 孩子', original: '3º + 3º | 3º + N | 2º + N', answer: '2º + 3º | 3º + N | 2º + N', choices: ['2º + 3º | 3º + N | 2º + N', '2º + 3º | 2º + N | 2º + N', '3º + 3º | 3º + N | 2º + N', '2º + 2º | 2º + N | 2º + N'], explanation: 'A mudança acontece em 我有. 两 não muda antes do tom neutro de 个.' },
  { id: 'woyoulianggegege', hanzi: '我有两个哥哥。', writtenPinyin: 'wǒ yǒu liǎng ge gēge', spokenPinyin: 'wó yǒu liǎng ge gēge', meaning: 'tenho dois irmãos mais velhos', blocks: '我有 | 两个 | 哥哥', original: '3º + 3º | 3º + N | 1º + N', answer: '2º + 3º | 3º + N | 1º + N', choices: ['2º + 3º | 3º + N | 1º + N', '2º + 3º | 2º + N | 1º + N', '3º + 3º | 3º + N | 1º + N', '2º + 2º | 2º + N | 1º + N'], explanation: 'Exatamente como na correção: 我有 muda; 两个 e 哥哥 mantêm seus próprios blocos.' },
  { id: 'woyoulianggejiejie', hanzi: '我有两个姐姐。', writtenPinyin: 'wǒ yǒu liǎng ge jiějie', spokenPinyin: 'wó yǒu liǎng ge jiějie', meaning: 'tenho duas irmãs mais velhas', blocks: '我有 | 两个 | 姐姐', original: '3º + 3º | 3º + N | 3º + N', answer: '2º + 3º | 3º + N | 3º + N', choices: ['2º + 3º | 3º + N | 3º + N', '2º + 3º | 2º + N | 2º + N', '3º + 3º | 3º + N | 3º + N', '2º + 2º | 2º + N | 2º + N'], explanation: '我有 muda. Em 两个 e 姐姐, o segundo tom é neutro, então o 3º tom anterior não sobe.' },
  { id: 'woyoulianggenver', hanzi: '我有两个女儿。', writtenPinyin: 'wǒ yǒu liǎng ge nǚ’ér', spokenPinyin: 'wó yǒu liǎng ge nǚ’ér', meaning: 'tenho duas filhas', blocks: '我有 | 两个 | 女儿', original: '3º + 3º | 3º + N | 3º + 2º', answer: '2º + 3º | 3º + N | 3º + 2º', choices: ['2º + 3º | 3º + N | 3º + 2º', '2º + 3º | 2º + N | 2º + 2º', '3º + 3º | 3º + N | 3º + 2º', '2º + 2º | 2º + N | 2º + 2º'], explanation: 'Só 我有 forma 3º + 3º. 女儿 termina em 2º tom e não ativa essa regra.' },
  { id: 'niyoujigegege', hanzi: '你有几个哥哥？', writtenPinyin: 'nǐ yǒu jǐ ge gēge', spokenPinyin: 'ní yǒu jǐ ge gēge', meaning: 'quantos irmãos mais velhos você tem?', blocks: '你有 | 几个 | 哥哥', original: '3º + 3º | 3º + N | 1º + N', answer: '2º + 3º | 3º + N | 1º + N', choices: ['2º + 3º | 3º + N | 1º + N', '2º + 3º | 2º + N | 1º + N', '3º + 3º | 3º + N | 1º + N', '2º + 2º | 2º + N | 1º + N'], explanation: '你 sobe antes de 有. 几 continua em 3º tom porque 个 é neutro.' },
  { id: 'niyoujigejiejie', hanzi: '你有几个姐姐？', writtenPinyin: 'nǐ yǒu jǐ ge jiějie', spokenPinyin: 'ní yǒu jǐ ge jiějie', meaning: 'quantas irmãs mais velhas você tem?', blocks: '你有 | 几个 | 姐姐', original: '3º + 3º | 3º + N | 3º + N', answer: '2º + 3º | 3º + N | 3º + N', choices: ['2º + 3º | 3º + N | 3º + N', '2º + 3º | 2º + N | 2º + N', '3º + 3º | 3º + N | 3º + N', '2º + 2º | 2º + N | 2º + N'], explanation: 'A única sequência 3º + 3º no mesmo bloco é 你有.' },
  { id: 'woyouliangbayusan', hanzi: '我有两把雨伞。', writtenPinyin: 'wǒ yǒu liǎng bǎ yǔsǎn', spokenPinyin: 'wó yǒu liáng bǎ yúsǎn', meaning: 'tenho dois guarda-chuvas', blocks: '我有 | 两把 | 雨伞', original: '3º + 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º | 2º + 3º', '3º + 3º | 2º + 3º | 2º + 3º', '2º + 3º | 3º + 3º | 2º + 3º', '2º + 2º | 2º + 2º | 2º + 2º'], explanation: 'Os três blocos são 3º + 3º; o primeiro tom de cada bloco sobe.' },
  { id: 'niyoujibayusan', hanzi: '你有几把雨伞？', writtenPinyin: 'nǐ yǒu jǐ bǎ yǔsǎn', spokenPinyin: 'ní yǒu jí bǎ yúsǎn', meaning: 'quantos guarda-chuvas você tem?', blocks: '你有 | 几把 | 雨伞', original: '3º + 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º | 2º + 3º', '3º + 3º | 3º + 3º | 3º + 3º', '2º + 3º | 3º + 3º | 2º + 3º', '2º + 2º | 2º + 2º | 2º + 2º'], explanation: '你有, 几把 e 雨伞 seguem a mesma regra dentro de cada bloco.' },
  { id: 'woxiangmailiangbayusan', hanzi: '我想买两把雨伞。', writtenPinyin: 'wǒ xiǎng mǎi liǎng bǎ yǔsǎn', spokenPinyin: 'wǒ xiáng mǎi liáng bǎ yúsǎn', meaning: 'quero comprar dois guarda-chuvas', blocks: '我 | 想买 | 两把 | 雨伞', original: '3º | 3º + 3º | 3º + 3º | 3º + 3º', answer: '3º | 2º + 3º | 2º + 3º | 2º + 3º', choices: ['3º | 2º + 3º | 2º + 3º | 2º + 3º', '2º | 2º + 3º | 2º + 3º | 2º + 3º', '3º | 3º + 3º | 2º + 3º | 2º + 3º', '3º | 2º + 3º | 3º + 3º | 3º + 3º'], explanation: '我 fica separado; 想, 两 e 雨 sobem dentro de seus respectivos blocos.' },
  { id: 'nixiangmaijibayusan', hanzi: '你想买几把雨伞？', writtenPinyin: 'nǐ xiǎng mǎi jǐ bǎ yǔsǎn', spokenPinyin: 'nǐ xiáng mǎi jí bǎ yúsǎn', meaning: 'quantos guarda-chuvas você quer comprar?', blocks: '你 | 想买 | 几把 | 雨伞', original: '3º | 3º + 3º | 3º + 3º | 3º + 3º', answer: '3º | 2º + 3º | 2º + 3º | 2º + 3º', choices: ['3º | 2º + 3º | 2º + 3º | 2º + 3º', '2º | 2º + 3º | 2º + 3º | 2º + 3º', '3º | 3º + 3º | 3º + 3º | 3º + 3º', '3º | 2º + 3º | 3º + 3º | 2º + 3º'], explanation: 'O 你 isolado permanece 3º; 想, 几 e 雨 sobem em seus blocos 3º + 3º.' },
  { id: 'niyoujibenhanyushu', hanzi: '你有几本汉语书？', writtenPinyin: 'nǐ yǒu jǐ běn Hànyǔ shū', spokenPinyin: 'ní yǒu jí běn Hànyǔ shū', meaning: 'quantos livros de chinês você tem?', blocks: '你有 | 几本 | 汉语书', original: '3º + 3º | 3º + 3º | 4º + 3º + 1º', answer: '2º + 3º | 2º + 3º | 4º + 3º + 1º', choices: ['2º + 3º | 2º + 3º | 4º + 3º + 1º', '3º + 3º | 2º + 3º | 4º + 3º + 1º', '2º + 3º | 3º + 3º | 4º + 2º + 1º', '2º + 2º | 2º + 2º | 4º + 3º + 1º'], explanation: '你 e 几 sobem. Em 汉语书, 语 não está antes de outro 3º tom.' },
  { id: 'woyouwubenhanyushu', hanzi: '我有五本汉语书。', writtenPinyin: 'wǒ yǒu wǔ běn Hànyǔ shū', spokenPinyin: 'wó yǒu wú běn Hànyǔ shū', meaning: 'tenho cinco livros de chinês', blocks: '我有 | 五本 | 汉语书', original: '3º + 3º | 3º + 3º | 4º + 3º + 1º', answer: '2º + 3º | 2º + 3º | 4º + 3º + 1º', choices: ['2º + 3º | 2º + 3º | 4º + 3º + 1º', '3º + 3º | 3º + 3º | 4º + 3º + 1º', '2º + 3º | 3º + 3º | 4º + 2º + 1º', '2º + 2º | 2º + 2º | 4º + 3º + 1º'], explanation: '我 sobe antes de 有 e 五 sobe antes de 本. 汉语书 não muda.' },
  { id: 'nixiangjidianqu', hanzi: '你想几点去？', writtenPinyin: 'nǐ xiǎng jǐ diǎn qù', spokenPinyin: 'ní xiǎng jí diǎn qù', meaning: 'a que horas você quer ir?', blocks: '你想 | 几点 | 去', original: '3º + 3º | 3º + 3º | 4º', answer: '2º + 3º | 2º + 3º | 4º', choices: ['2º + 3º | 2º + 3º | 4º', '3º + 3º | 2º + 3º | 4º', '2º + 3º | 3º + 3º | 4º', '2º + 2º | 2º + 2º | 4º'], explanation: '你想 e 几点 são dois blocos 3º + 3º.' },
  { id: 'woxiangjiudianzou', hanzi: '我想九点走。', writtenPinyin: 'wǒ xiǎng jiǔ diǎn zǒu', spokenPinyin: 'wó xiǎng jiú diǎn zǒu', meaning: 'quero sair às nove', blocks: '我想 | 九点 | 走', original: '3º + 3º | 3º + 3º | 3º', answer: '2º + 3º | 2º + 3º | 3º', choices: ['2º + 3º | 2º + 3º | 3º', '3º + 3º | 2º + 3º | 3º', '2º + 3º | 3º + 3º | 2º', '2º + 2º | 2º + 2º | 3º'], explanation: '我想 e 九点 mudam internamente; 走 fica sozinho em 3º tom.' },
  { id: 'nixiangjidianmaishuiguo', hanzi: '你想几点买水果？', writtenPinyin: 'nǐ xiǎng jǐ diǎn mǎi shuǐguǒ', spokenPinyin: 'ní xiǎng jí diǎn mǎi shuíguǒ', meaning: 'a que horas você quer comprar frutas?', blocks: '你想 | 几点 | 买 | 水果', original: '3º + 3º | 3º + 3º | 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º | 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º | 3º | 2º + 3º', '3º + 3º | 2º + 3º | 3º | 2º + 3º', '2º + 3º | 3º + 3º | 2º | 3º + 3º', '2º + 2º | 2º + 2º | 2º | 2º + 2º'], explanation: '你, 几 e 水 sobem; 买 fica como um bloco isolado em 3º tom.' },
  { id: 'woxiangwudianmaishuiguo', hanzi: '我想五点买水果。', writtenPinyin: 'wǒ xiǎng wǔ diǎn mǎi shuǐguǒ', spokenPinyin: 'wó xiǎng wú diǎn mǎi shuíguǒ', meaning: 'quero comprar frutas às cinco', blocks: '我想 | 五点 | 买 | 水果', original: '3º + 3º | 3º + 3º | 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º | 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º | 3º | 2º + 3º', '3º + 3º | 2º + 3º | 3º | 2º + 3º', '2º + 3º | 3º + 3º | 3º | 3º + 3º', '2º + 2º | 2º + 2º | 2º | 2º + 2º'], explanation: 'A mudança ocorre em 我想, 五点 e 水果; o verbo 买 fica isolado.' },
  { id: 'nixiangjidianxizao', hanzi: '你想几点洗澡？', writtenPinyin: 'nǐ xiǎng jǐ diǎn xǐzǎo', spokenPinyin: 'ní xiǎng jí diǎn xízǎo', meaning: 'a que horas você quer tomar banho?', blocks: '你想 | 几点 | 洗澡', original: '3º + 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º | 2º + 3º', '3º + 3º | 3º + 3º | 3º + 3º', '2º + 3º | 3º + 3º | 2º + 3º', '2º + 2º | 2º + 2º | 2º + 2º'], explanation: 'Os três blocos são 3º + 3º e seguem a mesma transformação.' },
  { id: 'woxiangjiudianxizao', hanzi: '我想九点洗澡。', writtenPinyin: 'wǒ xiǎng jiǔ diǎn xǐzǎo', spokenPinyin: 'wó xiǎng jiú diǎn xízǎo', meaning: 'quero tomar banho às nove', blocks: '我想 | 九点 | 洗澡', original: '3º + 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º | 2º + 3º', '3º + 3º | 2º + 3º | 2º + 3º', '2º + 3º | 3º + 3º | 3º + 3º', '2º + 2º | 2º + 2º | 2º + 2º'], explanation: '我, 九 e 洗 sobem dentro dos três blocos 3º + 3º.' },
  { id: 'nikeyigeiwoma', hanzi: '你可以给我吗？', writtenPinyin: 'nǐ kěyǐ gěi wǒ ma', spokenPinyin: 'nǐ kéyǐ géi wǒ ma', meaning: 'você pode me dar?', blocks: '你 | 可以 | 给我 | 吗', original: '3º | 3º + 3º | 3º + 3º | N', answer: '3º | 2º + 3º | 2º + 3º | N', choices: ['3º | 2º + 3º | 2º + 3º | N', '2º | 2º + 3º | 2º + 3º | N', '3º | 3º + 3º | 2º + 3º | N', '3º | 2º + 3º | 3º + 3º | N'], explanation: '你 fica separado; 可 sobe em 可以 e 给 sobe em 给我.' },
  { id: 'keyigeini', hanzi: '可以给你。', writtenPinyin: 'kěyǐ gěi nǐ', spokenPinyin: 'kéyǐ géi nǐ', meaning: 'posso dar a você', blocks: '可以 | 给你', original: '3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º', '3º + 3º | 2º + 3º', '2º + 3º | 3º + 3º', '2º + 2º | 2º + 2º'], explanation: '可以 e 给你 são dois blocos 3º + 3º.' },
  { id: 'laobanxiangmaishuiguo', hanzi: '老板想买水果。', writtenPinyin: 'lǎobǎn xiǎng mǎi shuǐguǒ', spokenPinyin: 'láobǎn xiáng mǎi shuíguǒ', meaning: 'o chefe quer comprar frutas', blocks: '老板 | 想买 | 水果', original: '3º + 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º | 2º + 3º', '3º + 3º | 2º + 3º | 2º + 3º', '2º + 3º | 3º + 3º | 2º + 3º', '2º + 2º | 2º + 2º | 2º + 2º'], explanation: '老板, 想买 e 水果 aplicam a regra separadamente.' },
  { id: 'laobanyouliangbayusan', hanzi: '老板有两把雨伞。', writtenPinyin: 'lǎobǎn yǒu liǎng bǎ yǔsǎn', spokenPinyin: 'láobǎn yǒu liáng bǎ yúsǎn', meaning: 'o chefe tem dois guarda-chuvas', blocks: '老板 | 有 | 两把 | 雨伞', original: '3º + 3º | 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 3º | 2º + 3º | 2º + 3º', '3º + 3º | 3º | 2º + 3º | 2º + 3º', '2º + 3º | 2º | 3º + 3º | 3º + 3º', '2º + 2º | 2º | 2º + 2º | 2º + 2º'], explanation: '有 fica isolado. As mudanças acontecem em 老板, 两把 e 雨伞.' },
  { id: 'nixiangmainazhongshuiguo', hanzi: '你想买哪种水果？', writtenPinyin: 'nǐ xiǎng mǎi nǎ zhǒng shuǐguǒ', spokenPinyin: 'ní xiǎng mǎi ná zhǒng shuíguǒ', meaning: 'qual fruta você quer comprar?', blocks: '你想 | 买 | 哪种 | 水果', original: '3º + 3º | 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 3º | 2º + 3º | 2º + 3º', '3º + 3º | 3º | 2º + 3º | 2º + 3º', '2º + 3º | 2º | 3º + 3º | 3º + 3º', '2º + 2º | 2º | 2º + 2º | 2º + 2º'], explanation: '买 fica isolado; 你, 哪 e 水 sobem dentro dos outros blocos.' },
  { id: 'woxiangmailiangzhongshuiguo', hanzi: '我想买两种水果。', writtenPinyin: 'wǒ xiǎng mǎi liǎng zhǒng shuǐguǒ', spokenPinyin: 'wó xiǎng mǎi liáng zhǒng shuíguǒ', meaning: 'quero comprar dois tipos de fruta', blocks: '我想 | 买 | 两种 | 水果', original: '3º + 3º | 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 3º | 2º + 3º | 2º + 3º', '3º + 3º | 3º | 2º + 3º | 2º + 3º', '2º + 3º | 2º | 3º + 3º | 3º + 3º', '2º + 2º | 2º | 2º + 2º | 2º + 2º'], explanation: '我, 两 e 水 sobem; 买 permanece como um 3º tom isolado.' },
  { id: 'niyounazhongshuiguo', hanzi: '你有哪种水果？', writtenPinyin: 'nǐ yǒu nǎ zhǒng shuǐguǒ', spokenPinyin: 'ní yǒu ná zhǒng shuíguǒ', meaning: 'qual fruta você tem?', blocks: '你有 | 哪种 | 水果', original: '3º + 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º | 2º + 3º', '3º + 3º | 3º + 3º | 3º + 3º', '2º + 3º | 3º + 3º | 2º + 3º', '2º + 2º | 2º + 2º | 2º + 2º'], explanation: 'A frase é formada por três blocos 3º + 3º.' },
  { id: 'woyouliangzhongshuiguo', hanzi: '我有两种水果。', writtenPinyin: 'wǒ yǒu liǎng zhǒng shuǐguǒ', spokenPinyin: 'wó yǒu liáng zhǒng shuíguǒ', meaning: 'tenho dois tipos de fruta', blocks: '我有 | 两种 | 水果', original: '3º + 3º | 3º + 3º | 3º + 3º', answer: '2º + 3º | 2º + 3º | 2º + 3º', choices: ['2º + 3º | 2º + 3º | 2º + 3º', '3º + 3º | 2º + 3º | 2º + 3º', '2º + 3º | 3º + 3º | 3º + 3º', '2º + 2º | 2º + 2º | 2º + 2º'], explanation: '我, 两 e 水 sobem dentro de seus três blocos 3º + 3º.' },
];

function shuffledChallenges() {
  return [...CHALLENGES]
    .map((challenge) => ({ challenge, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ challenge }) => ({
      ...challenge,
      choices: [...challenge.choices]
        .map((choice) => ({ choice, order: Math.random() }))
        .sort((a, b) => a.order - b.order)
        .map(({ choice }) => choice),
    }));
}

export default function ToneRulesGame() {
  const [deck, setDeck] = useState<ToneRuleChallenge[]>(() => shuffledChallenges());
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const challenge = deck[index];
  const isCorrect = choice === challenge.answer;
  const progress = finished ? 100 : ((index + 1) / deck.length) * 100;
  const correctIndex = useMemo(() => challenge.choices.indexOf(challenge.answer), [challenge]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function choose(nextChoice: string) {
    if (choice) return;
    setChoice(nextChoice);
    if (nextChoice === challenge.answer) setScore((current) => current + 1);
  }

  function next() {
    if (index >= deck.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setChoice(null);
  }

  function restart() {
    window.speechSynthesis?.cancel();
    setDeck(shuffledChallenges());
    setIndex(0);
    setChoice(null);
    setScore(0);
    setFinished(false);
  }

  function speak() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(challenge.hanzi);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((item) => item.lang.toLowerCase() === 'zh-cn')
      ?? voices.find((item) => item.lang.toLowerCase().startsWith('zh'));
    utterance.lang = voice?.lang ?? 'zh-CN';
    utterance.rate = 0.72;
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  if (finished) {
    return (
      <section className={styles.ruleGame} aria-live="polite">
        <div className={styles.ruleFinished}>
          <span>规则训练完成 · treino concluído</span>
          <strong>{score}<small>/ {deck.length}</small></strong>
          <h1>{score >= 30 ? 'Você dominou as mudanças de tom.' : score >= 22 ? 'Muito bem — revise os blocos que mudaram.' : 'Repita e observe os blocos de sentido.'}</h1>
          <p>O jogo trabalha exclusivamente sequências com vários 3º tons, sempre respeitando os blocos de sentido.</p>
          <button type="button" onClick={restart}>↻ Jogar novamente</button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.ruleGame} aria-labelledby="tone-rule-title">
      <header className={styles.ruleGameHeader}>
        <div>
          <span>Regra do terceiro tom</span>
          <h1 id="tone-rule-title">Qual é a sequência correta?</h1>
          <p>Separe a frase pelos blocos e escolha quais 3º tons sobem para o 2º tom na pronúncia.</p>
        </div>
        <div className={styles.ruleScore}><strong>{score}</strong><span>acertos</span><small>{index + 1}/{deck.length}</small></div>
      </header>

      <div className={styles.ruleProgress} aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>

      <div className={styles.ruleQuestion}>
        <div className={styles.rulePrompt}>
          <span className={styles.ruleCounter}>Questão {index + 1} · {challenge.meaning}</span>
          <strong lang="zh-CN">{challenge.hanzi}</strong>
          <p className={styles.ruleWrittenPinyin}>{challenge.writtenPinyin}</p>
          <dl>
            <div><dt>Blocos</dt><dd>{challenge.blocks}</dd></div>
            <div><dt>Tons escritos</dt><dd>{challenge.original}</dd></div>
          </dl>
          <p className={styles.ruleInstruction}>Qual sequência você deve pronunciar?</p>
        </div>

        <div className={styles.ruleAnswers}>
          {challenge.choices.map((answer, answerIndex) => {
            const selected = choice === answer;
            const correct = answerIndex === correctIndex;
            return (
              <button
                type="button"
                key={answer}
                onClick={() => choose(answer)}
                disabled={Boolean(choice)}
                className={`${selected ? styles.ruleSelected : ''} ${choice && correct ? styles.ruleCorrect : ''} ${selected && choice && !correct ? styles.ruleWrong : ''}`}
              >
                <span>{String.fromCharCode(65 + answerIndex)}</span>
                <strong>{answer}</strong>
              </button>
            );
          })}

          {choice && (
            <div className={`${styles.ruleFeedback} ${isCorrect ? styles.ruleFeedbackCorrect : styles.ruleFeedbackWrong}`}>
              <span>{isCorrect ? '✓ Resposta correta' : 'Observe a sequência correta'}</span>
              <strong>{challenge.spokenPinyin}</strong>
              <p>{challenge.explanation}</p>
              <div>
                <button type="button" onClick={speak}>{speaking ? '■ Reproduzindo' : '▶ Ouvir pronúncia'}</button>
                <button type="button" onClick={next}>{index === deck.length - 1 ? 'Ver resultado' : 'Próxima questão'} →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
