'use client';
import {useEffect,useRef,useState} from 'react';
import PracticeRecorder from '../components/PracticeRecorder';
import {useClientSession} from '../components/ClientSession';
import {ORAL_ITEMS} from './oralData';
import Picture from './Picture';
import styles from './page.module.css';
export default function OralPractice(){
  const {sessionId}=useClientSession();
  const [index,setIndex]=useState(0),[reveal,setReveal]=useState(false),[prepEnd,setPrepEnd]=useState(0),[now,setNow]=useState(0),[recording,setRecording]=useState(false);
  const audio=useRef<HTMLAudioElement>(null),item=ORAL_ITEMS[index];
  useEffect(()=>{if(!prepEnd)return;const t=setInterval(()=>setNow(Date.now()),250);return()=>clearInterval(t);},[prepEnd]);
  useEffect(()=>{const player=audio.current;return()=>player?.pause();},[index]);
  const remain=Math.max(0,Math.ceil((prepEnd-now)/1000));
  return <details className={styles.oral}><summary><span>OPCIONAL · SEPARADO DA PROVA ESCRITA</span><strong>HSK 3 · Prática oral</strong><small>8 repetições · 5 imagens · 2 perguntas</small></summary><div className={styles.oralContent}><p>Treine as três tarefas do modelo oral, com gravação da sua voz. A avaliação aqui é pessoal; o app não dá uma nota oficial de pronúncia.</p><div className={styles.oralActions}><button onClick={()=>{setNow(Date.now());setPrepEnd(Date.now()+360000);}}>Iniciar preparação de 6 min</button>{prepEnd>0&&<span role="timer">{remain?`Preparação: ${Math.floor(remain/60)}:${String(remain%60).padStart(2,'0')}`:'Preparação concluída'}</span>}</div><div className={styles.oralTabs} aria-label="Questões orais">{ORAL_ITEMS.map((q,i)=><button key={q.id} disabled={recording} aria-pressed={index===i} onClick={()=>{audio.current?.pause();setIndex(i);setReveal(false);}}>{i+1}</button>)}</div><h3>{item.part==='repeat'?'听后重复 · Ouça e repita':item.part==='picture'?'看图说话 · Fale sobre a imagem':'回答问题 · Responda à pergunta'}</h3><p>Questão {index+1}/15 · {item.seconds} segundos para responder. A gravação para automaticamente no limite.</p>{item.audio&&<><audio ref={audio} controls src={item.audio} preload="none" data-media-title={`HSK 3 oral, questão ${index+1}`} /><button disabled={recording} onClick={()=>setReveal(!reveal)}>{reveal?'Ocultar texto':'Ver texto depois de repetir'}</button></>}{(item.part!=='repeat'||reveal)&&<p className={styles.chinese} lang="zh-CN">{item.text}</p>}{item.picture&&<div className={styles.promptPicture}><Picture picture={item.picture} label="Cena para descrever em mandarim"/></div>}<PracticeRecorder key={item.id} phrase={item.text} pinyin="" sessionId={sessionId} storageScope={`hsk-oral:${item.id}`} maxSeconds={item.seconds} onBeforeRecord={()=>audio.current?.pause()} onRecordingStart={()=>setRecording(true)} onRecordingStop={()=>setRecording(false)}/><p className={styles.fine}>Ouça sua gravação e avalie: respondeu à tarefa? Falou de forma compreensível? Usou frases completas? Mostre à professora para receber uma correção de pronúncia e gramática.</p></div></details>;
}
