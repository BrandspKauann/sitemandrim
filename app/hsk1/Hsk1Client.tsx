'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClientSession } from '../components/ClientSession';
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
      { id: 'baozi', hanzi: '包子', pinyin: 'bāozi', meaning: 'pãozinho chinês recheado, cozido no vapor' },
      { id: 'cai', hanzi: '菜', pinyin: 'cài', meaning: 'prato de comida / verdura' },
      { id: 'fan', hanzi: '饭', pinyin: 'fàn', meaning: 'refeição / arroz cozido' },
      { id: 'jiaozi', hanzi: '饺子', pinyin: 'jiǎozi', meaning: 'jiaozi / bolinho chinês' },
      { id: 'jidan', hanzi: '鸡蛋', pinyin: 'jīdàn', meaning: 'ovo' },
      { id: 'mianbao', hanzi: '面包', pinyin: 'miànbāo', meaning: 'pão' },
      { id: 'miantiaor', hanzi: '面条儿', pinyin: 'miàntiáor', meaning: 'macarrão' },
      { id: 'mifan', hanzi: '米饭', pinyin: 'mǐfàn', meaning: 'arroz cozido' },
      { id: 'pingguo', hanzi: '苹果', pinyin: 'píngguǒ', meaning: 'maçã' },
      { id: 'shuiguo', hanzi: '水果', pinyin: 'shuǐguǒ', meaning: 'fruta' },
      { id: 'shui', hanzi: '水', pinyin: 'shuǐ', meaning: 'água' },
      { id: 'cha', hanzi: '茶', pinyin: 'chá', meaning: 'chá' },
      { id: 'niunai', hanzi: '牛奶', pinyin: 'niúnǎi', meaning: 'leite' },
      { id: 'chi', hanzi: '吃', pinyin: 'chī', meaning: 'comer' },
      { id: 'he', hanzi: '喝', pinyin: 'hē', meaning: 'beber' },
      { id: 'haochi', hanzi: '好吃', pinyin: 'hǎochī', meaning: 'gostoso / delicioso' },
      { id: 'zuofan', hanzi: '做饭', pinyin: 'zuòfàn', meaning: 'cozinhar / preparar comida' },
      { id: 'fandian', hanzi: '饭店', pinyin: 'fàndiàn', meaning: 'restaurante' },
      { id: 'zaofan', hanzi: '早饭', pinyin: 'zǎofàn', meaning: 'café da manhã' },
      { id: 'wufan', hanzi: '午饭', pinyin: 'wǔfàn', meaning: 'almoço' },
      { id: 'wanfan', hanzi: '晚饭', pinyin: 'wǎnfàn', meaning: 'jantar' },
    ],
  },
];

const PAUSE_STORAGE_KEY = 'hsk1:pause-seconds';

function storedPauseSeconds() {
  if (typeof window === 'undefined') return 1;
  const saved = Number(window.sessionStorage.getItem(PAUSE_STORAGE_KEY));
  return Number.isFinite(saved) && saved >= 1 && saved <= 8 ? saved : 1;
}

export default function Hsk1Client() {
  const { shortId } = useClientSession();
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
  const runId = useRef(0);
  const timer = useRef<number | null>(null);
  const speedRef = useRef<Speed>('slow');
  const pauseSecondsRef = useRef(pauseSeconds);

  const selectedGroup = useMemo(
    () => GROUPS.find((group) => group.id === selectedGroupId) ?? GROUPS[0],
    [selectedGroupId],
  );

  useEffect(() => () => {
    runId.current += 1;
    if (timer.current !== null) window.clearTimeout(timer.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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
    stop();
    setLoopEnabled(false);
    setSelectedGroupId(groupId);
  }

  function changeSpeed(nextSpeed: Speed) {
    speedRef.current = nextSpeed;
    setSpeed(nextSpeed);
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
              return (
                <li className={active ? styles.activeWord : ''} key={item.id}>
                  <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                  <strong lang="zh-CN">{item.hanzi}</strong>
                  <div><b>{item.pinyin}</b><p>{item.meaning}</p></div>
                  <button type="button" onClick={() => active ? stop() : startQueue([item], false)}
                    aria-label={`Ouvir ${item.hanzi}, ${item.pinyin}, e o significado ${item.meaning}`}>
                    {active ? '■ Parar' : '▶ Ouvir os dois'}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.brandMark} aria-hidden="true">词</span>
        <p>Novos grupos poderão ser acrescentados sem misturar os assuntos.</p>
        <Link href="/">Voltar para frases →</Link>
      </footer>
    </main>
  );
}
