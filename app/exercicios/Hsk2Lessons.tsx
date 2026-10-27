'use client';
import {useState} from 'react';
import LessonPlayer from '../hsk1/Lesson11Client';
import {HSK2_LESSON1} from './hsk2/lesson1';
import {HSK2_LESSON2} from './hsk2/lesson2';
import {HSK2_LESSON3} from './hsk2/lesson3';
import {HSK2_LESSON4} from './hsk2/lesson4';
import styles from './hsk2Lessons.module.css';
const lessons=[HSK2_LESSON1,HSK2_LESSON2,HSK2_LESSON3,HSK2_LESSON4];
export default function Hsk2Lessons(){
 const [number,setNumber]=useState<number|null>(null);
 const selected=lessons.find(l=>l.number===number);
 return <section id="hsk2" aria-label="Lições do HSK2">
  <header className={styles.header}><span>Novo HSK · Volume 2</span><h1>Seu próximo passo: HSK2.</h1><p>Escolha uma lição. Vocabulário, três diálogos e um texto narrativo ficam separados, com pinyin, tradução, áudio chinês/português, looping e exercícios.</p>
   <div className={styles.tabs} role="tablist" aria-label="Lições do HSK2">{lessons.map(l=><button type="button" role="tab" aria-selected={number===l.number} key={l.number} onClick={()=>setNumber(l.number)}><b>Lição {l.number}</b><span lang="zh-CN">{l.title}</span><small>{l.groups[0].items.length} palavras · 4 textos · 20 questões</small></button>)}</div>
   {selected&&<button className={styles.back} type="button" onClick={()=>setNumber(null)}>← Fechar lição</button>}
  </header>
  {selected?<LessonPlayer key={`hsk2-${selected.number}`} lesson={selected}/>:<p className={styles.hint}>Abra uma das quatro lições acima para começar. As lições do HSK1 continuam preservadas na própria aba.</p>}
 </section>;
}
