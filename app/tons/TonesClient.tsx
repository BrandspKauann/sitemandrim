'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClientSession } from '../components/ClientSession';
import styles from './page.module.css';

type FirstTone = 1 | 2 | 3 | 4;
type Tone = 0 | FirstTone;

type ToneWord = {
  hanzi: string;
  pinyin: string;
  tones: Tone[];
  meaning: string;
  hsk1?: boolean;
};

type ToneGroup = {
  first: FirstTone;
  second: Tone;
  words: ToneWord[];
};

const GROUPS: ToneGroup[] = [
  { first: 1, second: 1, words: [
    { hanzi: '今天', pinyin: 'jīn tiān', tones: [1, 1], meaning: 'hoje', hsk1: true },
    { hanzi: '飞机', pinyin: 'fēi jī', tones: [1, 1], meaning: 'avião', hsk1: true },
    { hanzi: '医生', pinyin: 'yī shēng', tones: [1, 1], meaning: 'médico(a)', hsk1: true },
    { hanzi: '中间', pinyin: 'zhōng jiān', tones: [1, 1], meaning: 'meio / entre' },
    { hanzi: '西瓜', pinyin: 'xī guā', tones: [1, 1], meaning: 'melancia' },
  ] },
  { first: 1, second: 2, words: [
    { hanzi: '中国', pinyin: 'zhōng guó', tones: [1, 2], meaning: 'China', hsk1: true },
    { hanzi: '今年', pinyin: 'jīn nián', tones: [1, 2], meaning: 'este ano' },
    { hanzi: '公园', pinyin: 'gōng yuán', tones: [1, 2], meaning: 'parque' },
    { hanzi: '新闻', pinyin: 'xīn wén', tones: [1, 2], meaning: 'notícia' },
    { hanzi: '工人', pinyin: 'gōng rén', tones: [1, 2], meaning: 'trabalhador(a)' },
  ] },
  { first: 1, second: 3, words: [
    { hanzi: '多少', pinyin: 'duō shǎo', tones: [1, 3], meaning: 'quanto(s)', hsk1: true },
    { hanzi: '身体', pinyin: 'shēn tǐ', tones: [1, 3], meaning: 'corpo / saúde' },
    { hanzi: '开水', pinyin: 'kāi shuǐ', tones: [1, 3], meaning: 'água fervida' },
    { hanzi: '铅笔', pinyin: 'qiān bǐ', tones: [1, 3], meaning: 'lápis' },
    { hanzi: '经理', pinyin: 'jīng lǐ', tones: [1, 3], meaning: 'gerente' },
  ] },
  { first: 1, second: 4, words: [
    { hanzi: '天气', pinyin: 'tiān qì', tones: [1, 4], meaning: 'clima', hsk1: true },
    { hanzi: '商店', pinyin: 'shāng diàn', tones: [1, 4], meaning: 'loja', hsk1: true },
    { hanzi: '工作', pinyin: 'gōng zuò', tones: [1, 4], meaning: 'trabalho / trabalhar', hsk1: true },
    { hanzi: '吃饭', pinyin: 'chī fàn', tones: [1, 4], meaning: 'comer / fazer uma refeição' },
    { hanzi: '高兴', pinyin: 'gāo xìng', tones: [1, 4], meaning: 'feliz', hsk1: true },
  ] },
  { first: 1, second: 0, words: [
    { hanzi: '妈妈', pinyin: 'mā ma', tones: [1, 0], meaning: 'mãe', hsk1: true },
    { hanzi: '杯子', pinyin: 'bēi zi', tones: [1, 0], meaning: 'copo / xícara', hsk1: true },
    { hanzi: '东西', pinyin: 'dōng xi', tones: [1, 0], meaning: 'coisa / objeto', hsk1: true },
    { hanzi: '衣服', pinyin: 'yī fu', tones: [1, 0], meaning: 'roupa', hsk1: true },
    { hanzi: '先生', pinyin: 'xiān sheng', tones: [1, 0], meaning: 'senhor', hsk1: true },
  ] },
  { first: 2, second: 1, words: [
    { hanzi: '明天', pinyin: 'míng tiān', tones: [2, 1], meaning: 'amanhã', hsk1: true },
    { hanzi: '时间', pinyin: 'shí jiān', tones: [2, 1], meaning: 'tempo / horário' },
    { hanzi: '回家', pinyin: 'huí jiā', tones: [2, 1], meaning: 'voltar para casa' },
    { hanzi: '房间', pinyin: 'fáng jiān', tones: [2, 1], meaning: 'quarto / cômodo' },
    { hanzi: '国家', pinyin: 'guó jiā', tones: [2, 1], meaning: 'país' },
  ] },
  { first: 2, second: 2, words: [
    { hanzi: '学习', pinyin: 'xué xí', tones: [2, 2], meaning: 'estudar', hsk1: true },
    { hanzi: '同学', pinyin: 'tóng xué', tones: [2, 2], meaning: 'colega de classe', hsk1: true },
    { hanzi: '人民', pinyin: 'rén mín', tones: [2, 2], meaning: 'povo' },
    { hanzi: '银行', pinyin: 'yín háng', tones: [2, 2], meaning: 'banco' },
    { hanzi: '篮球', pinyin: 'lán qiú', tones: [2, 2], meaning: 'basquete' },
  ] },
  { first: 2, second: 3, words: [
    { hanzi: '苹果', pinyin: 'píng guǒ', tones: [2, 3], meaning: 'maçã', hsk1: true },
    { hanzi: '牛奶', pinyin: 'niú nǎi', tones: [2, 3], meaning: 'leite' },
    { hanzi: '啤酒', pinyin: 'pí jiǔ', tones: [2, 3], meaning: 'cerveja' },
    { hanzi: '词典', pinyin: 'cí diǎn', tones: [2, 3], meaning: 'dicionário' },
    { hanzi: '门口', pinyin: 'mén kǒu', tones: [2, 3], meaning: 'entrada / porta' },
  ] },
  { first: 2, second: 4, words: [
    { hanzi: '学校', pinyin: 'xué xiào', tones: [2, 4], meaning: 'escola', hsk1: true },
    { hanzi: '前面', pinyin: 'qián miàn', tones: [2, 4], meaning: 'em frente', hsk1: true },
    { hanzi: '然后', pinyin: 'rán hòu', tones: [2, 4], meaning: 'depois / então' },
    { hanzi: '文化', pinyin: 'wén huà', tones: [2, 4], meaning: 'cultura' },
    { hanzi: '城市', pinyin: 'chéng shì', tones: [2, 4], meaning: 'cidade' },
  ] },
  { first: 2, second: 0, words: [
    { hanzi: '名字', pinyin: 'míng zi', tones: [2, 0], meaning: 'nome', hsk1: true },
    { hanzi: '朋友', pinyin: 'péng you', tones: [2, 0], meaning: 'amigo(a)', hsk1: true },
    { hanzi: '孩子', pinyin: 'hái zi', tones: [2, 0], meaning: 'criança' },
    { hanzi: '什么', pinyin: 'shén me', tones: [2, 0], meaning: 'o que', hsk1: true },
    { hanzi: '时候', pinyin: 'shí hou', tones: [2, 0], meaning: 'momento / quando', hsk1: true },
  ] },
  { first: 3, second: 1, words: [
    { hanzi: '北京', pinyin: 'běi jīng', tones: [3, 1], meaning: 'Pequim', hsk1: true },
    { hanzi: '老师', pinyin: 'lǎo shī', tones: [3, 1], meaning: 'professor(a)', hsk1: true },
    { hanzi: '每天', pinyin: 'měi tiān', tones: [3, 1], meaning: 'todos os dias' },
    { hanzi: '买单', pinyin: 'mǎi dān', tones: [3, 1], meaning: 'pagar a conta' },
    { hanzi: '雨衣', pinyin: 'yǔ yī', tones: [3, 1], meaning: 'capa de chuva' },
  ] },
  { first: 3, second: 2, words: [
    { hanzi: '女儿', pinyin: 'nǚ ér', tones: [3, 2], meaning: 'filha', hsk1: true },
    { hanzi: '以前', pinyin: 'yǐ qián', tones: [3, 2], meaning: 'antes' },
    { hanzi: '语言', pinyin: 'yǔ yán', tones: [3, 2], meaning: 'idioma' },
    { hanzi: '旅游', pinyin: 'lǚ yóu', tones: [3, 2], meaning: 'viajar / turismo' },
    { hanzi: '女人', pinyin: 'nǚ rén', tones: [3, 2], meaning: 'mulher' },
  ] },
  { first: 3, second: 3, words: [
    { hanzi: '你好', pinyin: 'nǐ hǎo', tones: [3, 3], meaning: 'olá', hsk1: true },
    { hanzi: '水果', pinyin: 'shuǐ guǒ', tones: [3, 3], meaning: 'fruta', hsk1: true },
    { hanzi: '手表', pinyin: 'shǒu biǎo', tones: [3, 3], meaning: 'relógio de pulso' },
    { hanzi: '口语', pinyin: 'kǒu yǔ', tones: [3, 3], meaning: 'língua falada' },
    { hanzi: '雨伞', pinyin: 'yǔ sǎn', tones: [3, 3], meaning: 'guarda-chuva' },
  ] },
  { first: 3, second: 4, words: [
    { hanzi: '考试', pinyin: 'kǎo shì', tones: [3, 4], meaning: 'prova / exame' },
    { hanzi: '感谢', pinyin: 'gǎn xiè', tones: [3, 4], meaning: 'agradecer' },
    { hanzi: '准备', pinyin: 'zhǔn bèi', tones: [3, 4], meaning: 'preparar' },
    { hanzi: '好看', pinyin: 'hǎo kàn', tones: [3, 4], meaning: 'bonito / interessante' },
    { hanzi: '可乐', pinyin: 'kě lè', tones: [3, 4], meaning: 'refrigerante de cola' },
  ] },
  { first: 3, second: 0, words: [
    { hanzi: '姐姐', pinyin: 'jiě jie', tones: [3, 0], meaning: 'irmã mais velha' },
    { hanzi: '椅子', pinyin: 'yǐ zi', tones: [3, 0], meaning: 'cadeira', hsk1: true },
    { hanzi: '我们', pinyin: 'wǒ men', tones: [3, 0], meaning: 'nós', hsk1: true },
    { hanzi: '你们', pinyin: 'nǐ men', tones: [3, 0], meaning: 'vocês' },
    { hanzi: '奶奶', pinyin: 'nǎi nai', tones: [3, 0], meaning: 'avó paterna' },
  ] },
  { first: 4, second: 1, words: [
    { hanzi: '大家', pinyin: 'dà jiā', tones: [4, 1], meaning: 'todos / todo mundo' },
    { hanzi: '放心', pinyin: 'fàng xīn', tones: [4, 1], meaning: 'ficar tranquilo' },
    { hanzi: '现金', pinyin: 'xiàn jīn', tones: [4, 1], meaning: 'dinheiro em espécie' },
    { hanzi: '面包', pinyin: 'miàn bāo', tones: [4, 1], meaning: 'pão' },
    { hanzi: '客厅', pinyin: 'kè tīng', tones: [4, 1], meaning: 'sala de estar' },
  ] },
  { first: 4, second: 2, words: [
    { hanzi: '去年', pinyin: 'qù nián', tones: [4, 2], meaning: 'ano passado' },
    { hanzi: '问题', pinyin: 'wèn tí', tones: [4, 2], meaning: 'pergunta / problema' },
    { hanzi: '地图', pinyin: 'dì tú', tones: [4, 2], meaning: 'mapa' },
    { hanzi: '大学', pinyin: 'dà xué', tones: [4, 2], meaning: 'universidade' },
    { hanzi: '数学', pinyin: 'shù xué', tones: [4, 2], meaning: 'matemática' },
  ] },
  { first: 4, second: 3, words: [
    { hanzi: '汉语', pinyin: 'hàn yǔ', tones: [4, 3], meaning: 'língua chinesa', hsk1: true },
    { hanzi: '电脑', pinyin: 'diàn nǎo', tones: [4, 3], meaning: 'computador', hsk1: true },
    { hanzi: '电影', pinyin: 'diàn yǐng', tones: [4, 3], meaning: 'filme', hsk1: true },
    { hanzi: '下午', pinyin: 'xià wǔ', tones: [4, 3], meaning: 'tarde', hsk1: true },
    { hanzi: '饭馆', pinyin: 'fàn guǎn', tones: [4, 3], meaning: 'restaurante', hsk1: true },
  ] },
  { first: 4, second: 4, words: [
    { hanzi: '再见', pinyin: 'zài jiàn', tones: [4, 4], meaning: 'até logo', hsk1: true },
    { hanzi: '电话', pinyin: 'diàn huà', tones: [4, 4], meaning: 'telefone', hsk1: true },
    { hanzi: '现在', pinyin: 'xiàn zài', tones: [4, 4], meaning: 'agora', hsk1: true },
    { hanzi: '电视', pinyin: 'diàn shì', tones: [4, 4], meaning: 'televisão', hsk1: true },
    { hanzi: '饭店', pinyin: 'fàn diàn', tones: [4, 4], meaning: 'restaurante / hotel' },
  ] },
  { first: 4, second: 0, words: [
    { hanzi: '爸爸', pinyin: 'bà ba', tones: [4, 0], meaning: 'pai', hsk1: true },
    { hanzi: '妹妹', pinyin: 'mèi mei', tones: [4, 0], meaning: 'irmã mais nova' },
    { hanzi: '漂亮', pinyin: 'piào liang', tones: [4, 0], meaning: 'bonito(a)', hsk1: true },
    { hanzi: '认识', pinyin: 'rèn shi', tones: [4, 0], meaning: 'conhecer', hsk1: true },
    { hanzi: '谢谢', pinyin: 'xiè xie', tones: [4, 0], meaning: 'obrigado(a)', hsk1: true },
  ] },
];

const THREE_CHARACTER_WORDS: ToneWord[] = [
  { hanzi: '出租车', pinyin: 'chū zū chē', tones: [1, 1, 1], meaning: 'táxi', hsk1: true },
  { hanzi: '星期一', pinyin: 'xīng qī yī', tones: [1, 1, 1], meaning: 'segunda-feira', hsk1: true },
  { hanzi: '中国人', pinyin: 'zhōng guó rén', tones: [1, 2, 2], meaning: 'pessoa chinesa' },
  { hanzi: '没关系', pinyin: 'méi guān xi', tones: [2, 1, 0], meaning: 'não tem problema', hsk1: true },
  { hanzi: '小学生', pinyin: 'xiǎo xué shēng', tones: [3, 2, 1], meaning: 'aluno(a) do primário' },
  { hanzi: '火车站', pinyin: 'huǒ chē zhàn', tones: [3, 1, 4], meaning: 'estação de trem', hsk1: true },
  { hanzi: '打电话', pinyin: 'dǎ diàn huà', tones: [3, 4, 4], meaning: 'telefonar', hsk1: true },
  { hanzi: '对不起', pinyin: 'duì bu qǐ', tones: [4, 0, 3], meaning: 'desculpe', hsk1: true },
  { hanzi: '电影院', pinyin: 'diàn yǐng yuàn', tones: [4, 3, 4], meaning: 'cinema' },
  { hanzi: '星期天', pinyin: 'xīng qī tiān', tones: [1, 1, 1], meaning: 'domingo', hsk1: true },
];

const FIRST_TONES: FirstTone[] = [1, 2, 3, 4];
const SECOND_TONES: Tone[] = [1, 2, 3, 4, 0];
const TONE_NAMES: Record<Tone, string> = {
  0: 'Tom neutro', 1: '1º tom', 2: '2º tom', 3: '3º tom', 4: '4º tom',
};

function tonePattern(tones: Tone[]) {
  return tones.map((tone) => tone || 'N').join('–');
}

export default function TonesClient() {
  const { shortId } = useClientSession();
  const [firstTone, setFirstTone] = useState<FirstTone>(1);
  const [speed, setSpeed] = useState<'natural' | 'slow'>('slow');
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [status, setStatus] = useState<'idle' | 'playing'>('idle');
  const [currentWord, setCurrentWord] = useState<ToneWord | null>(null);
  const [activeSequenceId, setActiveSequenceId] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [message, setMessage] = useState('');
  const runId = useRef(0);
  const timer = useRef<number | null>(null);
  const loopEnabledRef = useRef(false);

  const visibleGroups = useMemo(
    () => SECOND_TONES.map((second) => GROUPS.find((group) => group.first === firstTone && group.second === second)!),
    [firstTone],
  );

  useEffect(() => () => {
    runId.current += 1;
    if (timer.current) window.clearTimeout(timer.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  function stop() {
    runId.current += 1;
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setStatus('idle');
    setCurrentWord(null);
    setActiveSequenceId(null);
    setProgress({ current: 0, total: 0 });
  }

  function playWords(words: ToneWord[], sequenceId: string | null = null) {
    if (!words.length || !('speechSynthesis' in window)) {
      setMessage('A voz em mandarim não está disponível neste navegador.');
      return;
    }

    stop();
    const activeRun = runId.current + 1;
    runId.current = activeRun;
    setActiveSequenceId(sequenceId);
    let index = 0;

    const playNext = () => {
      if (runId.current !== activeRun) return;
      if (index >= words.length) {
        setStatus('idle');
        setCurrentWord(null);
        setActiveSequenceId(null);
        setProgress({ current: 0, total: 0 });
        return;
      }

      const word = words[index];
      setCurrentWord(word);
      setProgress({ current: index + 1, total: words.length });
      const utterance = new SpeechSynthesisUtterance(word.hanzi);
      const voices = window.speechSynthesis.getVoices();
      const mandarinVoice = voices.find((voice) => voice.lang.toLowerCase() === 'zh-cn')
        ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
      utterance.lang = mandarinVoice?.lang ?? 'zh-CN';
      utterance.rate = speed === 'slow' ? 0.52 : 0.84;
      utterance.pitch = 1;
      if (mandarinVoice) utterance.voice = mandarinVoice;
      utterance.onstart = () => {
        if (runId.current !== activeRun) return;
        setStatus('playing');
        setMessage('');
      };
      utterance.onend = () => {
        if (runId.current !== activeRun) return;
        index += 1;
        if (index >= words.length && loopEnabledRef.current) {
          timer.current = window.setTimeout(() => {
            if (runId.current !== activeRun) return;
            if (!loopEnabledRef.current) {
              setStatus('idle');
              setCurrentWord(null);
              setActiveSequenceId(null);
              setProgress({ current: 0, total: 0 });
              return;
            }
            index = 0;
            playNext();
          }, 1000);
          return;
        }
        timer.current = window.setTimeout(playNext, words.length > 1 ? 700 : 0);
      };
      utterance.onerror = () => {
        if (runId.current !== activeRun) return;
        stop();
        setMessage('Não consegui reproduzir esta palavra. Tente novamente.');
      };
      window.speechSynthesis.speak(utterance);
    };

    playNext();
  }

  function chooseFirstTone(tone: FirstTone) {
    stop();
    setFirstTone(tone);
  }

  function toggleLoop() {
    const nextValue = !loopEnabledRef.current;
    loopEnabledRef.current = nextValue;
    setLoopEnabled(nextValue);
  }

  function playOnce(words: ToneWord[], sequenceId: string) {
    loopEnabledRef.current = false;
    setLoopEnabled(false);
    playWords(words, sequenceId);
  }

  function playInLoop(words: ToneWord[], sequenceId: string) {
    if (status === 'playing' && loopEnabledRef.current && activeSequenceId === sequenceId) {
      stop();
      return;
    }
    loopEnabledRef.current = true;
    setLoopEnabled(true);
    playWords(words, sequenceId);
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
          <Link href="/letras-e-silabas">Letras e sílabas</Link>
          <Link href="/exercicios">Exercícios</Link>
          <Link className={styles.activeNav} href="/tons">Tons</Link>
        </nav>
      </header>

      <section className={styles.intro}>
        <div>
          <span className={styles.eyebrow}>Vocabulário por combinação</span>
          <h1>Junte os tons.<br /><em>Treine o movimento.</em></h1>
          <p>Escolha o tom da primeira sílaba. Depois pratique sua combinação com cada tom seguinte, inclusive o neutro.</p>
        </div>
        <aside className={styles.nowPlaying} aria-live="polite">
          <span>{status === 'playing' ? 'Falando agora' : 'Player de combinações'}</span>
          <div>
            <strong lang="zh-CN">{currentWord?.hanzi ?? '声调'}</strong>
            <p>{currentWord ? `${currentWord.pinyin} · ${currentWord.meaning}` : 'Escolha uma palavra ou reproduza um grupo inteiro.'}</p>
          </div>
          <div className={styles.playerFooter}>
            <div className={styles.speedControl} aria-label="Velocidade do áudio">
              <button type="button" className={speed === 'slow' ? styles.selected : ''}
                onClick={() => setSpeed('slow')} aria-pressed={speed === 'slow'}>Devagar</button>
              <button type="button" className={speed === 'natural' ? styles.selected : ''}
                onClick={() => setSpeed('natural')} aria-pressed={speed === 'natural'}>Natural</button>
            </div>
            <button className={`${styles.loopButton} ${loopEnabled ? styles.loopActive : ''}`} type="button"
              onClick={toggleLoop} aria-pressed={loopEnabled}>
              ↻ Loop
            </button>
            <button className={styles.stopButton} type="button" onClick={stop} disabled={status === 'idle'}>Parar</button>
            {progress.total > 1 && <b>{progress.current}/{progress.total}</b>}
          </div>
          {loopEnabled && <p className={styles.loopHint}>Loop ligado: repetição com 1 segundo de pausa.</p>}
          {message && <p className={styles.message} role="status">{message}</p>}
        </aside>
      </section>

      <section className={styles.studyArea} aria-labelledby="tone-selector-title">
        <div className={styles.selectorHeading}>
          <div>
            <span>Primeira sílaba</span>
            <h2 id="tone-selector-title">Escolha o primeiro tom</h2>
          </div>
          <p><strong>100 palavras</strong> organizadas em 20 combinações</p>
        </div>
        <div className={styles.firstToneTabs} role="tablist" aria-label="Tom da primeira sílaba">
          {FIRST_TONES.map((tone) => (
            <button type="button" role="tab" key={tone} className={firstTone === tone ? styles.activeTab : ''}
              onClick={() => chooseFirstTone(tone)} aria-selected={firstTone === tone}>
              <i className={`${styles.toneDot} ${styles[`tone${tone}`]}`} aria-hidden="true" />
              <span>{tone}º tom primeiro</span>
              <small>combinações {tone}–1 até {tone}–N</small>
            </button>
          ))}
        </div>

        <div className={styles.groups}>
          {visibleGroups.map((group) => {
            const sequenceId = `group-${group.first}-${group.second}`;
            const groupPlaying = status === 'playing' && activeSequenceId === sequenceId;
            const groupLooping = groupPlaying && loopEnabled;
            return (
              <section className={styles.group} key={`${group.first}-${group.second}`}>
                <div className={styles.groupHeading}>
                  <div>
                    <span>Padrão {tonePattern([group.first, group.second])}</span>
                    <h3>{TONE_NAMES[group.first]} + {TONE_NAMES[group.second].toLocaleLowerCase('pt-BR')}</h3>
                  </div>
                  <div className={styles.groupActions}>
                    <button type="button" onClick={() => groupPlaying && !groupLooping ? stop() : playOnce(group.words, sequenceId)}>
                      {groupPlaying && !groupLooping ? '■ Parar' : `▶ Ouvir as ${group.words.length}`}
                    </button>
                    <button type="button" className={groupLooping ? styles.activeGroupLoop : ''}
                      onClick={() => playInLoop(group.words, sequenceId)} aria-pressed={groupLooping}>
                      {groupLooping ? '■ Parar loop' : '↻ Ouvir em loop'}
                    </button>
                  </div>
                </div>
                <div className={styles.wordGrid}>
                  {group.words.map((word) => {
                    const active = currentWord?.hanzi === word.hanzi && status === 'playing';
                    return (
                      <button className={`${styles.wordCard} ${active ? styles.activeWord : ''}`} type="button"
                        key={word.hanzi} onClick={() => playWords([word])} aria-label={`Ouvir ${word.hanzi}, ${word.pinyin}`}>
                        <span className={styles.wordTop}>
                          <b>{word.hsk1 ? 'HSK 1' : 'Básico'}</b>
                          <i aria-hidden="true">{active ? '■' : '▶'}</i>
                        </span>
                        <strong lang="zh-CN">{word.hanzi}</strong>
                        <span className={styles.pinyin}>
                          {word.pinyin.split(' ').map((syllable, index) => (
                            <em className={styles[`textTone${word.tones[index]}`]} key={`${syllable}-${index}`}>{syllable}</em>
                          ))}
                        </span>
                        <small>{word.meaning}</small>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <aside className={styles.sandhiNote}>
        <span aria-hidden="true">注意</span>
        <div><strong>Os grupos mostram os tons originais do dicionário.</strong><p>Na fala natural, alguns tons se ajustam. Em uma sequência 3–3, como <b lang="zh-CN">你好</b>, a primeira sílaba costuma soar como 2º tom. O áudio ajuda você a perceber essa mudança.</p></div>
      </aside>

      <section className={styles.threeSection}>
        <div className={styles.threeHeading}>
          <span>Três caracteres</span>
          <h2>Sequências maiores para praticar.</h2>
          <div>
            <p>Use o padrão completo para acompanhar o movimento de três sílabas.</p>
            <div className={styles.threeActions}>
              <button type="button" onClick={() => activeSequenceId === 'three-characters' && !loopEnabled ? stop() : playOnce(THREE_CHARACTER_WORDS, 'three-characters')}>
                {activeSequenceId === 'three-characters' && status === 'playing' && !loopEnabled ? '■ Parar' : '▶ Ouvir as 10'}
              </button>
              <button type="button" className={activeSequenceId === 'three-characters' && status === 'playing' && loopEnabled ? styles.activeThreeLoop : ''}
                onClick={() => playInLoop(THREE_CHARACTER_WORDS, 'three-characters')}
                aria-pressed={activeSequenceId === 'three-characters' && status === 'playing' && loopEnabled}>
                {activeSequenceId === 'three-characters' && status === 'playing' && loopEnabled ? '■ Parar loop' : '↻ Ouvir em loop'}
              </button>
            </div>
          </div>
        </div>
        <div className={styles.threeGrid}>
          {THREE_CHARACTER_WORDS.map((word) => {
            const active = currentWord?.hanzi === word.hanzi && status === 'playing';
            return (
              <button className={`${styles.threeCard} ${active ? styles.activeWord : ''}`} type="button"
                key={word.hanzi} onClick={() => playWords([word])}>
                <span className={styles.pattern}>{tonePattern(word.tones)}</span>
                <strong lang="zh-CN">{word.hanzi}</strong>
                <span>{word.pinyin}</span>
                <small>{word.meaning}</small>
                <i aria-hidden="true">{active ? '■' : '▶'}</i>
              </button>
            );
          })}
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.brandMark} aria-hidden="true">声</span>
        <p>Comece devagar, imite o desenho dos dois tons e só depois aumente a velocidade.</p>
        <Link href="/exercicios">Treinar identificação de tons →</Link>
      </footer>
    </main>
  );
}
