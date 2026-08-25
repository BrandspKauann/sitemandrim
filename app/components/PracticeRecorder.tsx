'use client';

import { useEffect, useRef, useState } from 'react';

type PracticeRecorderProps = {
  phrase: string;
  pinyin: string;
  sessionId: string;
  onBeforeRecord?: () => void;
};

type StoredRecording = {
  id: string;
  sessionId?: string;
  blob: Blob;
  createdAt: number;
  phrase: string;
  pinyin: string;
};

type Recording = StoredRecording & {
  url: string;
};

type RecorderStatus = 'idle' | 'requesting' | 'recording' | 'preview';

const DB_NAME = 'tons-de-mandarim';
const STORE_NAME = 'practice-recordings';
const MAX_RECORDINGS = 3;
const MAX_SECONDS = 30;

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadRecordings() {
  const database = await openDatabase();
  return new Promise<StoredRecording[]>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as StoredRecording[]);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

async function persistRecording(recording: StoredRecording) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(recording);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

async function removeRecording(id: string) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

function formatTime(seconds: number) {
  return `00:${String(seconds).padStart(2, '0')}`;
}

function recorderOptions() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  const mimeType = types.find((type) => MediaRecorder.isTypeSupported(type));
  return mimeType ? { mimeType } : undefined;
}

export default function PracticeRecorder({ phrase, pinyin, sessionId, onBeforeRecord }: PracticeRecorderProps) {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [preview, setPreview] = useState<Recording | null>(null);
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const discardRef = useRef(false);
  const contextRef = useRef({ phrase: '', pinyin: '' });
  const urlsRef = useRef(new Set<string>());
  const mountedRef = useRef(true);

  function makeUrl(blob: Blob) {
    const url = URL.createObjectURL(blob);
    urlsRef.current.add(url);
    return url;
  }

  function releaseUrl(url: string) {
    URL.revokeObjectURL(url);
    urlsRef.current.delete(url);
  }

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function releaseMicrophone() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    if (!sessionId) return;
    mountedRef.current = true;
    const recordingUrls = urlsRef.current;
    let cancelled = false;
    loadRecordings()
      .then((saved) => {
        if (cancelled) return;
        const sessionRecordings = saved.filter((recording) => (
          recording.sessionId === sessionId || !recording.sessionId
        ));
        const restored = sessionRecordings
          .sort((a, b) => a.createdAt - b.createdAt)
          .slice(-MAX_RECORDINGS)
          .map((recording) => ({ ...recording, sessionId, url: makeUrl(recording.blob) }));
        setRecordings(restored);
        restored
          .filter((recording) => !sessionRecordings.find((savedRecording) => savedRecording.id === recording.id)?.sessionId)
          .forEach((recording) => {
            void persistRecording({
              id: recording.id,
              sessionId,
              blob: recording.blob,
              createdAt: recording.createdAt,
              phrase: recording.phrase,
              pinyin: recording.pinyin,
            });
          });
      })
      .catch(() => {
        if (!cancelled) setMessage('As gravações funcionarão nesta sessão, mas este navegador não permitiu guardá-las após atualizar a página.');
      });

    return () => {
      cancelled = true;
      mountedRef.current = false;
      discardRef.current = true;
      clearTimer();
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      releaseMicrophone();
      recordingUrls.forEach((url) => URL.revokeObjectURL(url));
      recordingUrls.clear();
    };
  }, [sessionId]);

  async function startRecording() {
    if (!sessionId) {
      setMessage('Aguarde um instante enquanto sua sessão privada é preparada.');
      return;
    }
    if (recordings.length >= MAX_RECORDINGS) {
      setMessage('Você já salvou 3 tentativas. Exclua uma para gravar novamente.');
      return;
    }
    if (!phrase.trim()) {
      setMessage('Digite uma frase antes de começar a gravar.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setMessage('Este navegador não oferece gravação por microfone. Abra o site no Chrome, Edge ou Safari atualizado.');
      return;
    }

    setStatus('requesting');
    setMessage('Permita o uso do microfone para começar.');
    onBeforeRecord?.();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const recorder = new MediaRecorder(stream, recorderOptions());
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      discardRef.current = false;
      contextRef.current = { phrase: phrase.trim(), pinyin };

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        clearTimer();
        releaseMicrophone();
        recorderRef.current = null;
        if (!mountedRef.current || discardRef.current) return;

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        chunksRef.current = [];
        if (!blob.size) {
          setStatus('idle');
          setMessage('Não foi possível captar áudio. Verifique o microfone e tente novamente.');
          return;
        }

        const captured = contextRef.current;
        setPreview({
          id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}`,
          sessionId,
          blob,
          url: makeUrl(blob),
          createdAt: Date.now(),
          phrase: captured.phrase,
          pinyin: captured.pinyin,
        });
        setStatus('preview');
        setMessage('Ouça sua gravação. Você pode salvar ou descartar esta tentativa.');
      };
      recorder.onerror = () => {
        clearTimer();
        releaseMicrophone();
        recorderRef.current = null;
        setStatus('idle');
        setMessage('A gravação foi interrompida pelo navegador. Tente novamente.');
      };

      startedAtRef.current = Date.now();
      setSeconds(0);
      setStatus('recording');
      setMessage('Gravando sua pronúncia…');
      recorder.start(250);
      timerRef.current = window.setInterval(() => {
        const elapsed = Math.min(MAX_SECONDS, Math.floor((Date.now() - startedAtRef.current) / 1000));
        setSeconds(elapsed);
        if (elapsed >= MAX_SECONDS && recorder.state === 'recording') recorder.stop();
      }, 200);
    } catch (error) {
      releaseMicrophone();
      setStatus('idle');
      const name = error instanceof DOMException ? error.name : '';
      setMessage(name === 'NotAllowedError'
        ? 'O microfone foi bloqueado. Permita o acesso nas configurações do site e tente novamente.'
        : 'Não consegui acessar o microfone. Verifique se ele está conectado e disponível.');
    }
  }

  function finishRecording() {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  }

  function discardRecording() {
    discardRef.current = true;
    clearTimer();
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    else releaseMicrophone();
    recorderRef.current = null;
    chunksRef.current = [];
    setSeconds(0);
    setStatus('idle');
    setMessage('Gravação descartada.');
  }

  function discardPreview() {
    if (preview) releaseUrl(preview.url);
    setPreview(null);
    setSeconds(0);
    setStatus('idle');
    setMessage('Tentativa descartada.');
  }

  async function savePreview() {
    if (!preview || recordings.length >= MAX_RECORDINGS) return;
    const stored: StoredRecording = {
      id: preview.id,
      sessionId,
      blob: preview.blob,
      createdAt: preview.createdAt,
      phrase: preview.phrase,
      pinyin: preview.pinyin,
    };
    try {
      await persistRecording(stored);
      setMessage('Tentativa salva neste navegador.');
    } catch {
      setMessage('Tentativa salva nesta sessão. O navegador não permitiu guardá-la após uma atualização.');
    }
    setRecordings((current) => [...current, preview].slice(-MAX_RECORDINGS));
    setPreview(null);
    setSeconds(0);
    setStatus('idle');
  }

  async function deleteRecording(recording: Recording) {
    try { await removeRecording(recording.id); } catch { /* The in-memory copy can still be removed. */ }
    releaseUrl(recording.url);
    setRecordings((current) => current.filter((item) => item.id !== recording.id));
    setMessage('Tentativa excluída. Você pode gravar outra.');
  }

  const slotsLeft = MAX_RECORDINGS - recordings.length;
  const isBusy = status === 'recording' || status === 'requesting';

  return (
    <section className="practice-recorder" aria-labelledby="practice-recorder-title">
      <div className="recorder-heading">
        <div>
          <span className="recorder-kicker">Compare sua pronúncia</span>
          <h2 id="practice-recorder-title">Grave sua voz</h2>
        </div>
        <span className="recording-slots">{recordings.length}/{MAX_RECORDINGS} salvas</span>
      </div>

      {status === 'recording' && (
        <div className="recording-live" role="status">
          <div className="recording-live-top">
            <span><i aria-hidden="true" /> Gravando</span>
            <strong>{formatTime(seconds)} / 00:30</strong>
          </div>
          <div className="recording-progress" aria-hidden="true"><i style={{ width: `${(seconds / MAX_SECONDS) * 100}%` }} /></div>
          <div className="recording-actions">
            <button className="finish-recording" type="button" onClick={finishRecording}>■ Concluir gravação</button>
            <button className="discard-recording" type="button" onClick={discardRecording}>Descartar agora</button>
          </div>
        </div>
      )}

      {status === 'requesting' && (
        <div className="permission-state" role="status">
          <span className="permission-pulse" aria-hidden="true" />
          <p>Aguardando a permissão do microfone…</p>
        </div>
      )}

      {status === 'preview' && preview && (
        <div className="recording-preview">
          <div className="preview-copy">
            <span>Prévia da tentativa</span>
            <strong>{preview.phrase}</strong>
            {preview.pinyin && <small>{preview.pinyin}</small>}
          </div>
          <audio controls src={preview.url} preload="metadata">Seu navegador não consegue reproduzir esta gravação.</audio>
          <div className="preview-actions">
            <button className="save-recording" type="button" onClick={savePreview}>Salvar tentativa</button>
            <button type="button" onClick={discardPreview}>Descartar</button>
          </div>
        </div>
      )}

      {status === 'idle' && (
        <div className="recorder-start">
          <button className="record-button" type="button" onClick={startRecording}
            disabled={slotsLeft === 0}>
            <span aria-hidden="true">●</span>
            {slotsLeft > 0 ? 'Gravar minha voz' : 'Limite de 3 gravações'}
          </button>
          <p>{slotsLeft > 0
            ? `${slotsLeft} ${slotsLeft === 1 ? 'espaço disponível' : 'espaços disponíveis'} · até 30 segundos por tentativa`
            : 'Exclua uma tentativa para gravar novamente.'}</p>
        </div>
      )}

      {recordings.length > 0 ? (
        <ol className="saved-recordings" aria-label="Minhas gravações salvas">
          {recordings.map((recording, index) => (
            <li key={recording.id}>
              <div className="saved-recording-copy">
                <span>Tentativa {index + 1}</span>
                <strong>{recording.phrase}</strong>
                {recording.pinyin && <small>{recording.pinyin}</small>}
              </div>
              <audio controls src={recording.url} preload="metadata">Seu navegador não consegue reproduzir esta gravação.</audio>
              <button className="delete-recording" type="button" onClick={() => deleteRecording(recording)}
                aria-label={`Excluir tentativa ${index + 1}`}>Excluir</button>
            </li>
          ))}
        </ol>
      ) : !isBusy && status !== 'preview' && (
        <p className="recordings-empty">Suas tentativas aparecerão aqui para você ouvir e comparar com o mandarim.</p>
      )}

      {message && <p className="recorder-message" role="status">{message}</p>}
      <p className="privacy-note">
        {sessionId ? `Sessão ${sessionId.replaceAll('-', '').slice(0, 8).toUpperCase()} · ` : ''}
        As gravações ficam privadas e salvas somente neste navegador.
      </p>
    </section>
  );
}
