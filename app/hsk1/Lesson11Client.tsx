'use client';

import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClientSession } from '../components/ClientSession';
import { deleteLocalImage, listLocalImages, saveLocalImage } from './imageStore';
import type { StudyItem as VocabularyItem } from './lesson11Data';
import { LESSON11, type Lesson } from './lessons';
import LessonPreparation from './LessonPreparation';
import styles from './page.module.css';

type Speed = 'natural' | 'slow';
type PlaybackLanguage = 'mandarin' | 'portuguese';

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

export default function Lesson11Client({ lesson = LESSON11 }: { lesson?: Lesson }) {
  const GROUPS = lesson.groups;
  const { sessionId } = useClientSession();
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
  const [withPortuguese, setWithPortuguese] = useState(true);
  const portugueseRef = useRef(true);

  const selectedGroup = useMemo(
    () => GROUPS.find((group) => group.id === selectedGroupId) ?? GROUPS[0],
    [selectedGroupId, GROUPS],
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
        translation.rate = 1.05;
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
      mandarin.onend = () => {
        if (runId.current !== activeRun) return;
        if (portugueseRef.current) timer.current = window.setTimeout(playPortuguese, 1000);
        else scheduleNext();
      };
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
    <section aria-label={`Conteúdo da Lição ${lesson.number}`}>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Novo HSK · Volume 1 · Lição {lesson.number}</span>
          <h1>{lesson.title}<br /><em>Prepare-se para a aula.</em></h1>
          <p>{lesson.description} As próximas lições entram quando você pedir.</p>
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
            <span>{activeItem?.pinyin ?? selectedGroup.label.split('·')[1]?.trim()}</span>
            <p>{activeItem?.meaning ?? selectedGroup.name}</p>
          </div>
          <div className={styles.mainControls}>
            <button className={styles.playButton} type="button" onClick={() => startQueue(selectedGroup.items, false)}>
              ▶ Ouvir sequência
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
        <label><input type="checkbox" checked={withPortuguese} onChange={(event) => { stop(); portugueseRef.current = event.target.checked; setWithPortuguese(event.target.checked); }} /> Ouvir significado em português (1s depois)</label>
        </aside>
      </section>

      <section className={styles.workspace}>
        <div className={styles.groupTabs} role="tablist" aria-label="Grupos de vocabulário HSK 1">
          {GROUPS.map((group) => (
            <button type="button" role="tab" key={group.id} aria-selected={selectedGroup.id === group.id}
              className={selectedGroup.id === group.id ? styles.activeTab : ''} onClick={() => changeGroup(group.id)}>
              <span>{group.name}</span><small>{group.items.length} itens</small>
            </button>
          ))}
        </div>

        <div className={styles.groupPanel}>
          <div className={styles.groupHeading}>
            <div><span>{selectedGroup.label}</span><h2>{selectedGroup.name}</h2><p>{selectedGroup.description}</p></div>
            <div className={styles.pauseControl}>
              <div><span>Intervalo entre itens</span><strong>{pauseDraft}s</strong></div>
              <input type="range" min="1" max="8" step="1" value={pauseDraft}
                onChange={(event) => setPauseDraft(Number(event.target.value))} aria-label="Segundos entre itens" />
              <button type="button" onClick={savePause}>Salvar intervalo</button>
              <small>Em uso: {pauseSeconds}s</small>
            </div>
          </div>

          <div className={styles.groupPlayer} aria-label={`Controles de reprodução do grupo ${selectedGroup.name}`}>
            <div className={styles.groupPlayerCopy}>
              <span>Reprodução deste grupo</span>
              <strong>{selectedGroup.name}</strong>
              <small>{selectedGroup.items.length} {selectedGroup.items.length === 1 ? 'item' : 'itens'} · {withPortuguese ? 'mandarim + português' : 'só mandarim'}</small>
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

          <ol className={`${styles.wordList} ${selectedGroup.id !== `l${lesson.number}-vocabulary` ? styles.sentenceList : ''}`}>
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
                  <div className={styles.wordDetails}>{item.speaker && <small>{item.speaker}</small>}<b>{item.pinyin}</b><p>{item.meaning}</p></div>
                  {selectedGroup.id === `l${lesson.number}-vocabulary` && <div className={styles.wordImage}>
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
                  </div>}
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

      <LessonPreparation lesson={lesson} sessionId={sessionId} onPlay={startQueue} onStop={stop} />

    </section>
  );
}
