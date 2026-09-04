'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { PhraseSequenceHandle, PhraseStudyItem } from './PhraseSequence';

type RecordedNumberSequenceProps = {
  items: PhraseStudyItem[];
  onBeforePlay?: () => void;
};

const NUMBER_START_TIMES = [0.09, 1.12, 2.01, 3.09, 4.28, 5.26, 6.37, 7.64, 8.68, 9.68];

const RecordedNumberSequence = forwardRef<PhraseSequenceHandle, RecordedNumberSequenceProps>(
  function RecordedNumberSequence({ items, onBeforePlay }, ref) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
    const [activeIndex, setActiveIndex] = useState(-1);
    const [repeat, setRepeat] = useState(false);
    const [speed, setSpeed] = useState<'natural' | 'slow'>('natural');
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');

    function stop(reset = true) {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      if (reset) audio.currentTime = 0;
      setStatus('idle');
      setActiveIndex(-1);
      setProgress(0);
    }

    useImperativeHandle(ref, () => ({ stop: () => stop() }));

    useEffect(() => () => audioRef.current?.pause(), []);

    async function play(fromStart = false) {
      const audio = audioRef.current;
      if (!audio) return;

      if (!audio.paused && !fromStart) {
        audio.pause();
        return;
      }

      onBeforePlay?.();
      if (fromStart || audio.ended) audio.currentTime = 0;
      audio.playbackRate = speed === 'slow' ? 0.72 : 1;
      try {
        await audio.play();
        setMessage('');
      } catch {
        setMessage('Não foi possível reproduzir a gravação neste navegador.');
      }
    }

    function followAudio(audio: HTMLAudioElement) {
      let nextIndex = -1;
      for (let index = 0; index < NUMBER_START_TIMES.length; index += 1) {
        if (audio.currentTime >= NUMBER_START_TIMES[index]) nextIndex = index;
        else break;
      }
      setActiveIndex(nextIndex);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    }

    function changeSpeed(nextSpeed: 'natural' | 'slow') {
      setSpeed(nextSpeed);
      if (audioRef.current) audioRef.current.playbackRate = nextSpeed === 'slow' ? 0.72 : 1;
    }

    const stageItem = items[activeIndex >= 0 ? activeIndex : 0];

    return (
      <section className="lesson-section numbers-section" id="numeros-em-chines" aria-labelledby="numeros-em-chines-title">
        <div className="lesson-shell">
          <div className="lesson-heading">
            <div>
              <span className="section-kicker">Contagem em mandarim</span>
              <h2 id="numeros-em-chines-title">Números em chinês.</h2>
              <p>
                Acompanhe a voz original contando de um a dez. O destaque se move junto com a gravação para mostrar
                o ideograma, o pinyin e uma aproximação da pronúncia em português.
              </p>
            </div>
            <span className="lesson-count">10 números</span>
          </div>

          <div className="lesson-player numbers-player">
            <div className="lesson-player-top">
              <span>{status === 'playing' ? 'Pronunciando agora' : status === 'paused' ? 'Gravação pausada' : 'Áudio original pronto'}</span>
              <strong>{activeIndex >= 0 ? `${activeIndex + 1}/10` : '1–10'}</strong>
            </div>

            {stageItem && (
              <div className={`lesson-stage ${status === 'playing' ? 'is-speaking' : ''}`}>
                <div className="lesson-stage-number">{String(stageItem.id).padStart(2, '0')}</div>
                <div className="lesson-stage-copy">
                  <strong lang="zh-CN">{stageItem.hanzi}</strong>
                  <span>{stageItem.pinyin}</span>
                  <p>Como ler: {stageItem.portuguese}</p>
                  <em>{stageItem.translation}</em>
                </div>
                <div className="lesson-sound-bars" aria-hidden="true"><i /><i /><i /><i /></div>
              </div>
            )}

            <div className="lesson-progress" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>

            <div className="lesson-controls">
              <button className="lesson-play-all" type="button" onClick={() => play()}>
                {status === 'playing' ? 'Ⅱ Pausar gravação' : '▶ Reproduzir números 1–10'}
              </button>
              <button type="button" onClick={() => play(true)}>↺ Ouvir do começo</button>
              <button type="button" onClick={() => stop()} disabled={status === 'idle'}>Parar</button>
            </div>

            <div className="lesson-options">
              <div className="lesson-speed" aria-label="Velocidade da gravação dos números">
                <button type="button" className={speed === 'natural' ? 'active' : ''}
                  onClick={() => changeSpeed('natural')} aria-pressed={speed === 'natural'}>Natural</button>
                <button type="button" className={speed === 'slow' ? 'active' : ''}
                  onClick={() => changeSpeed('slow')} aria-pressed={speed === 'slow'}>Devagar 0,72×</button>
              </div>
              <button className={`lesson-repeat ${repeat ? 'active' : ''}`} type="button"
                onClick={() => setRepeat((current) => !current)} aria-pressed={repeat}>
                ↻ Loop {repeat ? 'ligado' : 'desligado'}
              </button>
            </div>

            <audio
              ref={audioRef}
              className="numbers-native-audio"
              controls
              loop={repeat}
              preload="metadata"
              src="/audio/numeros-chines-um-a-dez.m4a"
              onPlay={(event) => {
                onBeforePlay?.();
                event.currentTarget.playbackRate = speed === 'slow' ? 0.72 : 1;
                setStatus('playing');
                setMessage('');
              }}
              onPause={(event) => {
                if (!event.currentTarget.ended) setStatus(event.currentTarget.currentTime > 0 ? 'paused' : 'idle');
              }}
              onEnded={() => {
                if (!repeat) {
                  setStatus('idle');
                  setActiveIndex(-1);
                  setProgress(0);
                }
              }}
              onTimeUpdate={(event) => followAudio(event.currentTarget)}
            >
              Seu navegador não consegue reproduzir este áudio.
            </audio>

            {message && <p className="lesson-message" role="status">{message}</p>}
            <p className="numbers-source">
              Áudio extraído do vídeo indicado: <a href="https://www.youtube.com/shorts/R0QVZSu4SII"
                target="_blank" rel="noreferrer">Chinese with Lilian</a>.
            </p>
          </div>

          <ol className="numbers-audio-grid">
            {items.map((item, index) => (
              <li className={index === activeIndex && status === 'playing' ? 'active' : ''} key={item.id}>
                <span>{item.id}</span>
                <strong lang="zh-CN">{item.hanzi}</strong>
                <div><b>{item.pinyin}</b><small>{item.portuguese}</small></div>
                <em>{item.translation}</em>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  },
);

export default RecordedNumberSequence;
