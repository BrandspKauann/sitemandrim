'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClientSession } from '../components/ClientSession';
import { deleteLocalImage, listLocalImages, saveLocalImage } from './imageStore';
import RealMandarinDialogues, { type RealMandarinDialoguesHandle } from './RealMandarinDialogues';
import styles from './page.module.css';

type VocabularyItem = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
};

type VocabularyGroup = {
  id: string;
  name: string;
  label: string;
  description: string;
  items: VocabularyItem[];
};

type Speed = 'natural' | 'slow';
type PlaybackLanguage = 'mandarin' | 'portuguese';

const GROUPS: VocabularyGroup[] = [
  {
    id: 'comidas',
    name: 'Comidas',
    label: '食物 · shíwù',
    description: 'Alimentos, bebidas, ações e refeições para reconhecer, escutar e repetir.',
    items: [
      { id: 'baozi', hanzi: '包子', pinyin: 'bāozi', meaning: 'pão' },
      { id: 'cai', hanzi: '菜', pinyin: 'cài', meaning: 'prato de comida' },
      { id: 'fan', hanzi: '饭', pinyin: 'fàn', meaning: 'refeição' },
      { id: 'jiaozi', hanzi: '饺子', pinyin: 'jiǎozi', meaning: 'bolinho chinês' },
      { id: 'jidan', hanzi: '鸡蛋', pinyin: 'jīdàn', meaning: 'ovo' },
      { id: 'mianbao', hanzi: '面包', pinyin: 'miànbāo', meaning: 'pão' },
      { id: 'miantiaor', hanzi: '面条儿', pinyin: 'miàntiáor', meaning: 'macarrão' },
      { id: 'mifan', hanzi: '米饭', pinyin: 'mǐfàn', meaning: 'arroz' },
      { id: 'pingguo', hanzi: '苹果', pinyin: 'píngguǒ', meaning: 'maçã' },
      { id: 'shuiguo', hanzi: '水果', pinyin: 'shuǐguǒ', meaning: 'fruta' },
      { id: 'shui', hanzi: '水', pinyin: 'shuǐ', meaning: 'água' },
      { id: 'cha', hanzi: '茶', pinyin: 'chá', meaning: 'chá' },
      { id: 'niunai', hanzi: '牛奶', pinyin: 'niúnǎi', meaning: 'leite' },
      { id: 'chi', hanzi: '吃', pinyin: 'chī', meaning: 'comer' },
      { id: 'he', hanzi: '喝', pinyin: 'hē', meaning: 'beber' },
      { id: 'haochi', hanzi: '好吃', pinyin: 'hǎochī', meaning: 'gostoso' },
      { id: 'zuofan', hanzi: '做饭', pinyin: 'zuòfàn', meaning: 'cozinhar' },
      { id: 'fandian', hanzi: '饭店', pinyin: 'fàndiàn', meaning: 'restaurante' },
      { id: 'zaofan', hanzi: '早饭', pinyin: 'zǎofàn', meaning: 'café da manhã' },
      { id: 'wufan', hanzi: '午饭', pinyin: 'wǔfàn', meaning: 'almoço' },
      { id: 'wanfan', hanzi: '晚饭', pinyin: 'wǎnfàn', meaning: 'jantar' },
    ],
  },
  {
    id: 'verbos',
    name: 'Verbos',
    label: '动词 · dòngcí',
    description: 'Ações essenciais para reconhecer, escutar e repetir.',
    items: [
      { id: 'ai', hanzi: '爱', pinyin: 'ài', meaning: 'amar' },
      { id: 'bing', hanzi: '病', pinyin: 'bìng', meaning: 'estar doente' },
      { id: 'chang', hanzi: '唱', pinyin: 'chàng', meaning: 'cantar' },
      { id: 'chi', hanzi: '吃', pinyin: 'chī', meaning: 'comer' },
      { id: 'chuan', hanzi: '穿', pinyin: 'chuān', meaning: 'vestir' },
      { id: 'dadianhua', hanzi: '打电话', pinyin: 'dǎ diànhuà', meaning: 'telefonar' },
      { id: 'dao', hanzi: '到', pinyin: 'dào', meaning: 'chegar' },
      { id: 'du', hanzi: '读', pinyin: 'dú', meaning: 'ler' },
      { id: 'dushu', hanzi: '读书', pinyin: 'dúshū', meaning: 'ler livros' },
      { id: 'duibuqi', hanzi: '对不起', pinyin: 'duìbuqǐ', meaning: 'desculpar-se' },
      { id: 'fen', hanzi: '分', pinyin: 'fēn', meaning: 'dividir' },
      { id: 'gei', hanzi: '给', pinyin: 'gěi', meaning: 'dar' },
      { id: 'gongzuo', hanzi: '工作', pinyin: 'gōngzuò', meaning: 'trabalhar' },
      { id: 'he', hanzi: '喝', pinyin: 'hē', meaning: 'beber' },
      { id: 'hui-voltar', hanzi: '回', pinyin: 'huí', meaning: 'voltar' },
      { id: 'hui-saber', hanzi: '会', pinyin: 'huì', meaning: 'saber fazer' },
      { id: 'jian', hanzi: '见', pinyin: 'jiàn', meaning: 'encontrar alguém' },
      { id: 'jiao', hanzi: '叫', pinyin: 'jiào', meaning: 'chamar' },
      { id: 'juede', hanzi: '觉得', pinyin: 'juéde', meaning: 'achar' },
      { id: 'kai', hanzi: '开', pinyin: 'kāi', meaning: 'abrir' },
      { id: 'kaiche', hanzi: '开车', pinyin: 'kāichē', meaning: 'dirigir' },
      { id: 'kan', hanzi: '看', pinyin: 'kàn', meaning: 'olhar ou assistir' },
      { id: 'kanbing', hanzi: '看病', pinyin: 'kànbìng', meaning: 'ir ao médico' },
      { id: 'kanjian', hanzi: '看见', pinyin: 'kànjiàn', meaning: 'avistar' },
      { id: 'keyi', hanzi: '可以', pinyin: 'kěyǐ', meaning: 'poder' },
      { id: 'lai', hanzi: '来', pinyin: 'lái', meaning: 'vir' },
      { id: 'mai-comprar', hanzi: '买', pinyin: 'mǎi', meaning: 'comprar' },
      { id: 'mai-vender', hanzi: '卖', pinyin: 'mài', meaning: 'vender' },
      { id: 'meishi', hanzi: '没事', pinyin: 'méishì', meaning: 'tudo bem' },
      { id: 'meiyou', hanzi: '没有', pinyin: 'méiyǒu', meaning: 'não ter' },
      { id: 'neng', hanzi: '能', pinyin: 'néng', meaning: 'conseguir' },
      { id: 'qichuang', hanzi: '起床', pinyin: 'qǐchuáng', meaning: 'levantar' },
      { id: 'qing', hanzi: '请', pinyin: 'qǐng', meaning: 'pedir' },
      { id: 'qingwen', hanzi: '请问', pinyin: 'qǐngwèn', meaning: 'pedir informação' },
      { id: 'qu', hanzi: '去', pinyin: 'qù', meaning: 'ir' },
      { id: 'renshi', hanzi: '认识', pinyin: 'rènshi', meaning: 'conhecer' },
      { id: 'shang', hanzi: '上', pinyin: 'shàng', meaning: 'subir' },
      { id: 'shangban', hanzi: '上班', pinyin: 'shàngbān', meaning: 'ir trabalhar' },
      { id: 'shangke', hanzi: '上课', pinyin: 'shàngkè', meaning: 'ter aula' },
      { id: 'shangxue', hanzi: '上学', pinyin: 'shàngxué', meaning: 'ir à escola' },
      { id: 'shengbing', hanzi: '生病', pinyin: 'shēngbìng', meaning: 'ficar doente' },
      { id: 'shi', hanzi: '是', pinyin: 'shì', meaning: 'ser' },
      { id: 'shui-dormir', hanzi: '睡', pinyin: 'shuì', meaning: 'dormir por um tempo' },
      { id: 'shuijiao', hanzi: '睡觉', pinyin: 'shuìjiào', meaning: 'ir dormir' },
      { id: 'shuo', hanzi: '说', pinyin: 'shuō', meaning: 'falar' },
      { id: 'shuohua', hanzi: '说话', pinyin: 'shuōhuà', meaning: 'conversar' },
      { id: 'ting', hanzi: '听', pinyin: 'tīng', meaning: 'ouvir' },
      { id: 'tingjian', hanzi: '听见', pinyin: 'tīngjiàn', meaning: 'escutar' },
      { id: 'wan', hanzi: '玩', pinyin: 'wán', meaning: 'brincar' },
      { id: 'wen', hanzi: '问', pinyin: 'wèn', meaning: 'fazer uma pergunta' },
      { id: 'xihuan', hanzi: '喜欢', pinyin: 'xǐhuan', meaning: 'gostar' },
      { id: 'xia', hanzi: '下', pinyin: 'xià', meaning: 'descer' },
      { id: 'xiayu', hanzi: '下雨', pinyin: 'xiàyǔ', meaning: 'chover' },
      { id: 'xiaban', hanzi: '下班', pinyin: 'xiàbān', meaning: 'sair do trabalho' },
      { id: 'xiake', hanzi: '下课', pinyin: 'xiàkè', meaning: 'terminar a aula' },
      { id: 'xiang', hanzi: '想', pinyin: 'xiǎng', meaning: 'pensar ou ter vontade' },
      { id: 'xie', hanzi: '写', pinyin: 'xiě', meaning: 'escrever' },
      { id: 'xiexie', hanzi: '谢谢', pinyin: 'xièxie', meaning: 'agradecer' },
      { id: 'xiuxi', hanzi: '休息', pinyin: 'xiūxi', meaning: 'descansar' },
      { id: 'xue', hanzi: '学', pinyin: 'xué', meaning: 'aprender' },
      { id: 'xuexi', hanzi: '学习', pinyin: 'xuéxí', meaning: 'estudar uma matéria' },
      { id: 'yao', hanzi: '要', pinyin: 'yào', meaning: 'querer ou precisar' },
      { id: 'you', hanzi: '有', pinyin: 'yǒu', meaning: 'ter' },
      { id: 'zai', hanzi: '在', pinyin: 'zài', meaning: 'estar' },
      { id: 'zaijian', hanzi: '再见', pinyin: 'zàijiàn', meaning: 'despedir-se' },
      { id: 'zhao', hanzi: '找', pinyin: 'zhǎo', meaning: 'procurar' },
      { id: 'zhidao', hanzi: '知道', pinyin: 'zhīdào', meaning: 'saber' },
      { id: 'zhu', hanzi: '住', pinyin: 'zhù', meaning: 'morar' },
      { id: 'zuo-sentar', hanzi: '坐', pinyin: 'zuò', meaning: 'sentar' },
      { id: 'zuo-fazer', hanzi: '做', pinyin: 'zuò', meaning: 'fazer' },
      { id: 'zuofan-verbo', hanzi: '做饭', pinyin: 'zuòfàn', meaning: 'cozinhar' },
    ],
  },
  {
    id: 'nacionalidades',
    name: 'Nacionalidades',
    label: '国籍 · guójí',
    description: 'Países, nacionalidades e idiomas para dizer de onde uma pessoa é e qual língua ela fala.',
    items: [
      { id: 'zhongguo', hanzi: '中国', pinyin: 'zhōngguó', meaning: 'China' },
      { id: 'zhongguoren', hanzi: '中国人', pinyin: 'zhōngguó rén', meaning: 'chinês' },
      { id: 'zhongwen', hanzi: '中文', pinyin: 'zhōngwén', meaning: 'língua chinesa' },
      { id: 'baxi', hanzi: '巴西', pinyin: 'bāxī', meaning: 'Brasil' },
      { id: 'baxiren', hanzi: '巴西人', pinyin: 'bāxī rén', meaning: 'brasileiro' },
      { id: 'putaoyayu', hanzi: '葡萄牙语', pinyin: 'pútáoyáyǔ', meaning: 'língua portuguesa' },
      { id: 'meiguo', hanzi: '美国', pinyin: 'měiguó', meaning: 'Estados Unidos' },
      { id: 'meiguoren', hanzi: '美国人', pinyin: 'měiguó rén', meaning: 'americano' },
      { id: 'yingyu-meiguo', hanzi: '英语', pinyin: 'yīngyǔ', meaning: 'língua inglesa' },
      { id: 'yingguo', hanzi: '英国', pinyin: 'yīngguó', meaning: 'Reino Unido' },
      { id: 'yingguoren', hanzi: '英国人', pinyin: 'yīngguó rén', meaning: 'britânico' },
      { id: 'yingyu-yingguo', hanzi: '英语', pinyin: 'yīngyǔ', meaning: 'língua inglesa' },
      { id: 'faguo', hanzi: '法国', pinyin: 'fǎguó', meaning: 'França' },
      { id: 'faguoren', hanzi: '法国人', pinyin: 'fǎguó rén', meaning: 'francês' },
      { id: 'fayu', hanzi: '法语', pinyin: 'fǎyǔ', meaning: 'língua francesa' },
      { id: 'riben', hanzi: '日本', pinyin: 'rìběn', meaning: 'Japão' },
      { id: 'ribenren', hanzi: '日本人', pinyin: 'rìběn rén', meaning: 'japonês' },
      { id: 'riyu', hanzi: '日语', pinyin: 'rìyǔ', meaning: 'língua japonesa' },
      { id: 'hanguo', hanzi: '韩国', pinyin: 'hánguó', meaning: 'Coreia do Sul' },
      { id: 'hanguoren', hanzi: '韩国人', pinyin: 'hánguó rén', meaning: 'sul-coreano' },
      { id: 'hanyu', hanzi: '韩语', pinyin: 'hányǔ', meaning: 'língua coreana' },
    ],
  },
];

const PAUSE_STORAGE_KEY = 'hsk1:pause-seconds';
const MAX_IMAGE_BYTES = 100 * 1024 * 1024;

function imageMapKey(sessionId: string, groupId: string, itemId: string) {
  return `${sessionId}:${groupId}:${itemId}`;
}

function imageEndpoint(sessionId: string, groupId: string, itemId?: string) {
  const params = new URLSearchParams({ session: sessionId, group: groupId });
  if (itemId) params.set('item', itemId);
  return `/api/hsk1-image?${params.toString()}`;
}

function storedPauseSeconds() {
  if (typeof window === 'undefined') return 1;
  const saved = Number(window.sessionStorage.getItem(PAUSE_STORAGE_KEY));
  return Number.isFinite(saved) && saved >= 1 && saved <= 8 ? saved : 1;
}

export default function Hsk1Client() {
  const { sessionId, shortId } = useClientSession();
  const [selectedGroupId, setSelectedGroupId] = useState(GROUPS[0].id);
  const [speed, setSpeed] = useState<Speed>('slow');
  const [status, setStatus] = useState<'idle' | 'playing'>('idle');
  const [activeItem, setActiveItem] = useState<VocabularyItem | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<PlaybackLanguage | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [pauseDraft, setPauseDraft] = useState(storedPauseSeconds);
  const [pauseSeconds, setPauseSeconds] = useState(storedPauseSeconds);
  const [message, setMessage] = useState('');
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState('');
  const runId = useRef(0);
  const timer = useRef<number | null>(null);
  const speedRef = useRef<Speed>('slow');
  const pauseSecondsRef = useRef(pauseSeconds);
  const objectUrlsRef = useRef(new Set<string>());
  const realDialogueRef = useRef<RealMandarinDialoguesHandle>(null);

  const selectedGroup = useMemo(
    () => GROUPS.find((group) => group.id === selectedGroupId) ?? GROUPS[0],
    [selectedGroupId],
  );

  useEffect(() => {
    if (!sessionId) return;
    const controller = new AbortController();

    async function loadImages() {
      const prefix = `${sessionId}:${selectedGroup.id}:`;
      try {
        const localImages = await listLocalImages(prefix);
        if (controller.signal.aborted) return;
        const localEntries = Object.fromEntries(localImages.map((record) => {
          const url = URL.createObjectURL(record.blob);
          objectUrlsRef.current.add(url);
          return [record.key, url];
        }));
        setImageUrls((current) => ({ ...current, ...localEntries }));
      } catch {
        // The cloud remains the primary store when this browser blocks IndexedDB.
      }

      try {
        const response = await fetch(imageEndpoint(sessionId, selectedGroup.id), {
          cache: 'no-store',
          credentials: 'same-origin',
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json() as { items?: string[] };
        const loadedAt = Date.now();
        const nextEntries = Object.fromEntries((data.items ?? []).map((itemId) => [
          imageMapKey(sessionId, selectedGroup.id, itemId),
          `${imageEndpoint(sessionId, selectedGroup.id, itemId)}&v=${loadedAt}`,
        ]));
        setImageUrls((current) => ({ ...current, ...nextEntries }));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    void loadImages();
    return () => controller.abort();
  }, [sessionId, selectedGroup.id]);

  useEffect(() => () => {
    runId.current += 1;
    if (timer.current !== null) window.clearTimeout(timer.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
  }, []);

  function finishPlayback() {
    setStatus('idle');
    setActiveItem(null);
    setActiveLanguage(null);
    setProgress({ current: 0, total: 0 });
  }

  function stop() {
    runId.current += 1;
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    finishPlayback();
  }

  function startQueue(items: VocabularyItem[], shouldLoop: boolean) {
    if (!items.length || !('speechSynthesis' in window)) {
      setMessage('A voz em mandarim não está disponível neste navegador.');
      return;
    }

    realDialogueRef.current?.stop();
    stop();
    setLoopEnabled(shouldLoop);
    const activeRun = runId.current + 1;
    runId.current = activeRun;
    let index = 0;

    const playNext = () => {
      if (runId.current !== activeRun) return;
      if (index >= items.length) {
        if (!shouldLoop) {
          finishPlayback();
          return;
        }
        index = 0;
      }

      const item = items[index];
      setActiveItem(item);
      setProgress({ current: index + 1, total: items.length });
      const voices = window.speechSynthesis.getVoices();
      const mandarinVoice = voices.find((candidate) => candidate.lang.toLowerCase() === 'zh-cn')
        ?? voices.find((candidate) => candidate.lang.toLowerCase().startsWith('zh'));
      const portugueseVoice = voices.find((candidate) => candidate.lang.toLowerCase() === 'pt-br')
        ?? voices.find((candidate) => candidate.lang.toLowerCase().startsWith('pt'));

      const handleError = () => {
        if (runId.current !== activeRun) return;
        stop();
        setMessage('Não consegui reproduzir esta palavra. Tente novamente.');
      };

      const scheduleNext = () => {
        if (runId.current !== activeRun) return;
        index += 1;
        if (index >= items.length && !shouldLoop) {
          finishPlayback();
          return;
        }
        timer.current = window.setTimeout(playNext, pauseSecondsRef.current * 1000);
      };

      const playPortuguese = () => {
        if (runId.current !== activeRun) return;
        const translation = new SpeechSynthesisUtterance(item.meaning);
        translation.lang = portugueseVoice?.lang ?? 'pt-BR';
        translation.rate = speedRef.current === 'slow' ? 0.72 : 0.96;
        translation.pitch = 1;
        if (portugueseVoice) translation.voice = portugueseVoice;
        translation.onstart = () => {
          if (runId.current !== activeRun) return;
          setActiveLanguage('portuguese');
        };
        translation.onend = scheduleNext;
        translation.onerror = handleError;
        window.speechSynthesis.speak(translation);
      };

      const mandarin = new SpeechSynthesisUtterance(item.hanzi);
      mandarin.lang = mandarinVoice?.lang ?? 'zh-CN';
      mandarin.rate = speedRef.current === 'slow' ? 0.52 : 0.86;
      mandarin.pitch = 1;
      if (mandarinVoice) mandarin.voice = mandarinVoice;
      mandarin.onstart = () => {
        if (runId.current !== activeRun) return;
        setStatus('playing');
        setActiveLanguage('mandarin');
        setMessage('');
      };
      mandarin.onend = playPortuguese;
      mandarin.onerror = handleError;
      window.speechSynthesis.speak(mandarin);
    };

    playNext();
  }

  function savePause() {
    setPauseSeconds(pauseDraft);
    pauseSecondsRef.current = pauseDraft;
    window.sessionStorage.setItem(PAUSE_STORAGE_KEY, String(pauseDraft));
    setMessage(`Intervalo atualizado para ${pauseDraft} ${pauseDraft === 1 ? 'segundo' : 'segundos'}.`);
  }

  function changeGroup(groupId: string) {
    realDialogueRef.current?.stop();
    stop();
    setLoopEnabled(false);
    setSelectedGroupId(groupId);
  }

  function changeSpeed(nextSpeed: Speed) {
    speedRef.current = nextSpeed;
    setSpeed(nextSpeed);
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>, item: VocabularyItem) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file || !sessionId) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Escolha um arquivo de imagem.');
      input.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setMessage('A imagem deve ter no máximo 100 MB.');
      input.value = '';
      return;
    }

    const key = imageMapKey(sessionId, selectedGroup.id, item.id);
    setUploadingImage(key);
    setMessage('');
    try {
      const response = await fetch(imageEndpoint(sessionId, selectedGroup.id, item.id), {
        method: 'PUT',
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { 'Content-Type': file.type, 'X-Image-Size': String(file.size) },
        body: file,
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'Não consegui salvar a imagem.');
      await deleteLocalImage(key).catch(() => undefined);
      setImageUrls((current) => ({
        ...current,
        [key]: `${imageEndpoint(sessionId, selectedGroup.id, item.id)}&v=${Date.now()}`,
      }));
      setMessage(`Imagem associada a ${item.hanzi}.`);
    } catch (error) {
      try {
        await saveLocalImage(key, file);
        const localUrl = URL.createObjectURL(file);
        objectUrlsRef.current.add(localUrl);
        setImageUrls((current) => {
          const previousUrl = current[key];
          if (previousUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previousUrl);
            objectUrlsRef.current.delete(previousUrl);
          }
          return { ...current, [key]: localUrl };
        });
        setMessage(`Imagem associada a ${item.hanzi} e salva neste navegador.`);
      } catch {
        setMessage(error instanceof Error ? error.message : 'Não consegui salvar a imagem.');
      }
    } finally {
      setUploadingImage('');
      input.value = '';
    }
  }

  async function removeImage(item: VocabularyItem) {
    if (!sessionId || !window.confirm(`Remover a imagem de ${item.hanzi}?`)) return;
    const key = imageMapKey(sessionId, selectedGroup.id, item.id);
    const isLocalImage = imageUrls[key]?.startsWith('blob:') ?? false;
    setUploadingImage(key);
    setMessage('');
    try {
      const response = await fetch(imageEndpoint(sessionId, selectedGroup.id, item.id), {
        method: 'DELETE',
        cache: 'no-store',
        credentials: 'same-origin',
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      const localRemoved = await deleteLocalImage(key).then(() => true).catch(() => false);
      if (!response.ok && !(isLocalImage && localRemoved)) {
        throw new Error(result.error ?? 'Não consegui remover a imagem.');
      }
      setImageUrls((current) => {
        const next = { ...current };
        if (next[key]?.startsWith('blob:')) {
          URL.revokeObjectURL(next[key]);
          objectUrlsRef.current.delete(next[key]);
        }
        delete next[key];
        return next;
      });
      setMessage(`Imagem de ${item.hanzi} removida${response.ok ? '' : ' deste navegador'}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não consegui remover a imagem.');
    } finally {
      setUploadingImage('');
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="Tons de Mandarim, início">
          <span className={styles.brandMark} aria-hidden="true">词</span>
          <span>Tons de Mandarim</span>
        </Link>
        <nav className={styles.nav} aria-label="Navegação principal">
          <span className="session-badge" title="Esta sessão não compartilha dados com outros visitantes">
            <i aria-hidden="true" /><span>Sessão {shortId || 'privada'}</span>
          </span>
          <Link href="/">Frases</Link>
          <Link href="/letras-e-silabas">Letras e sílabas</Link>
          <Link href="/exercicios">Exercícios</Link>
          <Link href="/tons">Tons</Link>
          <Link className={styles.activeNav} href="/hsk1">HSK1</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Vocabulário por assunto</span>
          <h1>Aprenda em grupos.<br /><em>Escute em sequência.</em></h1>
          <p>Pratique palavras do HSK 1 em blocos menores. Ouça, acompanhe o destaque e repita no seu próprio ritmo.</p>
        </div>
        <aside className={styles.player} aria-live="polite">
          <div className={styles.playerStatus}>
            <span>{status === 'playing'
              ? `${activeLanguage === 'portuguese' ? 'Significado em português' : 'Pronúncia em mandarim'}${loopEnabled ? ' · loop' : ''}`
              : 'Player chinês + português'}</span>
            {progress.total > 0 && <b>{progress.current}/{progress.total}</b>}
          </div>
          <div className={styles.stage}>
            <strong lang="zh-CN">{activeItem?.hanzi ?? selectedGroup.label.split('·')[0].trim()}</strong>
            <span>{activeItem?.pinyin ?? selectedGroup.label.split('·')[1].trim()}</span>
            <p>{activeItem?.meaning ?? selectedGroup.name}</p>
          </div>
          <div className={styles.mainControls}>
            <button className={styles.playButton} type="button" onClick={() => startQueue(selectedGroup.items, false)}>
              ▶ Chinês + português
            </button>
            <button className={`${styles.loopButton} ${loopEnabled && status === 'playing' ? styles.activeLoop : ''}`}
              type="button" onClick={() => loopEnabled && status === 'playing' ? stop() : startQueue(selectedGroup.items, true)}>
              {loopEnabled && status === 'playing' ? '■ Parar loop' : '↻ Ouvir em loop'}
            </button>
            <button type="button" onClick={stop} disabled={status === 'idle'}>Parar</button>
          </div>
          <div className={styles.playerOptions}>
            <span>Velocidade</span>
            <div>
              <button type="button" className={speed === 'slow' ? styles.selected : ''}
                onClick={() => changeSpeed('slow')} aria-pressed={speed === 'slow'}>Devagar</button>
              <button type="button" className={speed === 'natural' ? styles.selected : ''}
                onClick={() => changeSpeed('natural')} aria-pressed={speed === 'natural'}>Natural</button>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.workspace}>
        <div className={styles.groupTabs} role="tablist" aria-label="Grupos de vocabulário HSK 1">
          {GROUPS.map((group) => (
            <button type="button" role="tab" key={group.id} aria-selected={selectedGroup.id === group.id}
              className={selectedGroup.id === group.id ? styles.activeTab : ''} onClick={() => changeGroup(group.id)}>
              <span>{group.name}</span><small>{group.items.length} palavras</small>
            </button>
          ))}
        </div>

        <div className={styles.groupPanel}>
          <div className={styles.groupHeading}>
            <div><span>{selectedGroup.label}</span><h2>{selectedGroup.name}</h2><p>{selectedGroup.description}</p></div>
            <div className={styles.pauseControl}>
              <div><span>Intervalo entre palavras</span><strong>{pauseDraft}s</strong></div>
              <input type="range" min="1" max="8" step="1" value={pauseDraft}
                onChange={(event) => setPauseDraft(Number(event.target.value))} aria-label="Segundos entre as palavras" />
              <button type="button" onClick={savePause}>Salvar intervalo</button>
              <small>Em uso: {pauseSeconds}s</small>
            </div>
          </div>

          <div className={styles.groupPlayer} aria-label={`Controles de reprodução do grupo ${selectedGroup.name}`}>
            <div className={styles.groupPlayerCopy}>
              <span>Reprodução deste grupo</span>
              <strong>{selectedGroup.name}</strong>
              <small>{selectedGroup.items.length} {selectedGroup.items.length === 1 ? 'palavra' : 'palavras'} · mandarim + português</small>
            </div>
            <div className={styles.groupPlayerControls}>
              <button className={styles.groupPlayButton} type="button" onClick={() => startQueue(selectedGroup.items, false)}>
                ▶ Ouvir grupo inteiro
              </button>
              <button
                className={loopEnabled && status === 'playing' ? styles.groupLoopActive : ''}
                type="button"
                onClick={() => loopEnabled && status === 'playing' ? stop() : startQueue(selectedGroup.items, true)}
              >
                {loopEnabled && status === 'playing' ? '■ Parar loop' : '↻ Reproduzir em loop'}
              </button>
              <button type="button" onClick={stop} disabled={status === 'idle'}>■ Parar</button>
            </div>
          </div>

          {message && <p className={styles.message} role="status">{message}</p>}

          <ol className={styles.wordList}>
            {selectedGroup.items.map((item, index) => {
              const active = status === 'playing' && activeItem?.id === item.id;
              const loopingThisItem = active && loopEnabled && progress.total === 1;
              const itemImageKey = imageMapKey(sessionId, selectedGroup.id, item.id);
              const imageUrl = imageUrls[itemImageKey];
              const imageBusy = uploadingImage === itemImageKey;
              return (
                <li className={active ? styles.activeWord : ''} key={item.id}>
                  <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                  <strong lang="zh-CN">{item.hanzi}</strong>
                  <div className={styles.wordDetails}><b>{item.pinyin}</b><p>{item.meaning}</p></div>
                  <div className={styles.wordImage}>
                    {imageUrl ? (
                      <div className={styles.savedImage}>
                        {/* User-selected images are displayed from this session's private storage. */}
                        <Image src={imageUrl} alt={`${item.meaning}: imagem associada a ${item.hanzi}`}
                          width={320} height={220} unoptimized />
                        <div>
                          <label className={imageBusy ? styles.imageDisabled : ''}>
                            <input type="file" accept="image/*" disabled={imageBusy}
                              onChange={(event) => void uploadImage(event, item)} />
                            {imageBusy ? 'Salvando…' : 'Trocar'}
                          </label>
                          <button type="button" disabled={imageBusy} onClick={() => void removeImage(item)}>Remover</button>
                        </div>
                      </div>
                    ) : (
                      <label className={`${styles.imageUpload} ${imageBusy || !sessionId ? styles.imageDisabled : ''}`}>
                        <input type="file" accept="image/*" disabled={imageBusy || !sessionId}
                          onChange={(event) => void uploadImage(event, item)} />
                        <span aria-hidden="true">＋</span>
                        <b>{imageBusy ? 'Salvando…' : 'Adicionar imagem'}</b>
                        <small>até 100 MB</small>
                      </label>
                    )}
                  </div>
                  <div className={styles.wordActions}>
                    <button type="button" onClick={() => active ? stop() : startQueue([item], false)}
                      aria-label={`Ouvir ${item.hanzi}, ${item.pinyin}, e o significado ${item.meaning}`}>
                      {active ? '■ Parar' : '▶ Ouvir uma vez'}
                    </button>
                    <button type="button" className={loopingThisItem ? styles.wordLoopActive : ''}
                      onClick={() => loopingThisItem ? stop() : startQueue([item], true)}
                      aria-pressed={loopingThisItem}
                      aria-label={`${loopingThisItem ? 'Parar' : 'Repetir em loop'} ${item.hanzi}, ${item.pinyin}, e ${item.meaning}`}>
                      {loopingThisItem ? '■ Parar loop' : '↻ Loop'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <RealMandarinDialogues ref={realDialogueRef} onBeforePlay={stop} />

      <footer className={styles.footer}>
        <span className={styles.brandMark} aria-hidden="true">词</span>
        <p>Novos grupos poderão ser acrescentados sem misturar os assuntos.</p>
        <Link href="/">Voltar para frases →</Link>
      </footer>
    </main>
  );
}
