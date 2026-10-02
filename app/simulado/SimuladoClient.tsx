'use client';
import Link from 'next/link';
import {useCallback,useEffect,useRef,useState} from 'react';
import {pinyin} from 'pinyin-pro';
import Picture from './Picture';
import OralPractice from './OralPractice';
import {PROFILES,SECTION_LABELS,type Answer,type ExamResult,type Form,type Level,type Section} from './types';
import styles from './page.module.css';

type Attempt={id:string;version:string;level:Level;seed:string;mode:'exam'|'practice';startedAt:number;deadline:number;section:Section;index:number;answers:Record<string,Answer>;playLimit:number;finishedAt?:number;result?:ExamResult;rubric?:Record<string,number>};
const ACTIVE_KEY='tons-de-mandarim:hsk-active-v1',HISTORY_KEY='tons-de-mandarim:hsk-history-v1';
const SECTIONS:Section[]=['listening','reading','writing'];
function clock(ms:number){const s=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;}
function loadHistory():Attempt[]{try{return JSON.parse(localStorage.getItem(HISTORY_KEY)??'[]');}catch{return [];}}
function download(content:string,name:string,type:string){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function Chinese({text,showPinyin}:{text:string;showPinyin:boolean}){return <div className={styles.chinese} lang="zh-CN">{text.split('\n').map((line,i)=><div key={i}>{showPinyin&&<small lang="zh-Latn">{pinyin(line)}</small>}<span>{line}</span></div>)}</div>;}
export default function SimuladoClient(){
  const [level,setLevel]=useState<Level>(1),[mode,setMode]=useState<'exam'|'practice'>('exam');
  const [playLimit,setPlayLimit]=useState(2),[attempt,setAttempt]=useState<Attempt|null>(null),[form,setForm]=useState<Form|null>(null);
  const [resume,setResume]=useState<Attempt|null>(null),[history,setHistory]=useState<Attempt[]>([]);
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[storageWarning,setStorageWarning]=useState('');
  const [now,setNow]=useState(0),[playing,setPlaying]=useState(false),[speed,setSpeed]=useState(1),[reviewOnlyErrors,setReviewOnlyErrors]=useState(false);
  const [confirm,setConfirm]=useState<'finish'|'section'|'leave'|null>(null),[nextAt,setNextAt]=useState(0);
  const audio=useRef<HTMLAudioElement>(null),audioTimer=useRef<ReturnType<typeof setTimeout>|null>(null),formRef=useRef<Form|null>(null),attemptRef=useRef<Attempt|null>(null);
  const dialog=useRef<HTMLDivElement>(null);
  const question=form?.questions[attempt?.index??0];
  const stopped=!!attempt?.finishedAt;
  const strict=attempt?.mode==='exam'&&!stopped;
  const answered=form?.questions.filter(q=>attempt?.answers[q.id]?.value.trim()).length??0;
  const clearAudio=useCallback(()=>{audio.current?.pause();if(audioTimer.current)clearTimeout(audioTimer.current);setPlaying(false);setNextAt(0);},[]);
  useEffect(()=>{formRef.current=form;attemptRef.current=attempt;},[form,attempt]);
  useEffect(()=>{
    let saved:Attempt|null=null;try{saved=JSON.parse(sessionStorage.getItem(ACTIVE_KEY)??'null');}catch{}
    queueMicrotask(()=>{setResume(saved?.finishedAt?null:saved);setHistory(loadHistory());setNow(Date.now());});
    const timer=setInterval(()=>setNow(Date.now()),250);
    return()=>{clearInterval(timer);if(audioTimer.current)clearTimeout(audioTimer.current);};
  },[]);
  useEffect(()=>{const player=audio.current;return()=>player?.pause();},[question?.id]);
  useEffect(()=>{
    if(!confirm)return;
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){setConfirm(null);return;}
      if(event.key!=='Tab')return;
      const buttons=dialog.current?.querySelectorAll<HTMLButtonElement>('button');if(!buttons?.length)return;
      const first=buttons[0],last=buttons[buttons.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
  },[confirm]);
  useEffect(()=>{
    if(!attempt)return;
    try{if(attempt.finishedAt)sessionStorage.removeItem(ACTIVE_KEY);else sessionStorage.setItem(ACTIVE_KEY,JSON.stringify(attempt));}
    catch{queueMicrotask(()=>setStorageWarning('O navegador não permitiu salvar esta tentativa. Não feche a página durante a prova.'));}
  },[attempt]);
  useEffect(()=>{
    if(!attempt||stopped||!storageWarning)return;
    const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();};window.addEventListener('beforeunload',warn);
    return()=>window.removeEventListener('beforeunload',warn);
  },[attempt,stopped,storageWarning]);

  const finish=useCallback(async()=>{
    const active=attemptRef.current;if(!active||active.finishedAt)return;
    clearAudio();setBusy(true);setError('');setConfirm(null);
    try{
      const response=await fetch('/api/simulado',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({level:active.level,version:active.version,answers:active.answers})});
      const result=await response.json() as ExamResult & {error?:string};if(!response.ok)throw Error(result.error??'Não foi possível corrigir.');
      const finished={...active,finishedAt:Date.now(),result:result as ExamResult};setAttempt(finished);setNextAt(0);
      const all=[finished,...loadHistory().filter(item=>item.id!==finished.id)].slice(0,40);
      try{localStorage.setItem(HISTORY_KEY,JSON.stringify(all));}catch{setStorageWarning('Resultado disponível aqui, mas não foi possível salvá-lo no navegador. Exporte antes de sair.');}
      setHistory(all);window.scrollTo({top:0,behavior:'smooth'});
    }catch(e){setError(e instanceof Error?e.message:'Falha ao enviar. Suas respostas continuam salvas.');}
    finally{setBusy(false);}
  },[clearAudio]);
  const nextSection=useCallback(()=>{
    const active=attemptRef.current,loaded=formRef.current;if(!active||!loaded)return;
    const next=SECTIONS.slice(SECTIONS.indexOf(active.section)+1).find(s=>PROFILES[active.level].counts[s]>0);
    clearAudio();setConfirm(null);
    if(!next){void finish();return;}
    setAttempt({...active,section:next,index:loaded.questions.findIndex(q=>q.section===next),deadline:Math.min(active.deadline,Date.now())+PROFILES[active.level].minutes[next]*60000});
  },[clearAudio,finish]);
  const move=useCallback((index:number)=>{
    const active=attemptRef.current,loaded=formRef.current;if(!active||!loaded||!loaded.questions[index])return;
    if(active.mode==='exam'&&!active.finishedAt&&loaded.questions[index].section!==active.section)return;
    clearAudio();setAttempt({...active,index,...(active.mode==='practice'?{section:loaded.questions[index].section}:{})});
  },[clearAudio]);
  useEffect(()=>{
    if(!strict||!attempt||busy)return;
    if(now>=attempt.deadline){queueMicrotask(()=>nextSection());return;}
    if(nextAt&&now>=nextAt){const next=(attempt.index??0)+1;queueMicrotask(()=>{setNextAt(0);if(form?.questions[next]?.section===attempt.section)move(next);else nextSection();});}
  },[now,nextAt,strict,attempt,busy,form,move,nextSection]);
  const answer=useCallback((value:string)=>{
    const active=attemptRef.current,loaded=formRef.current;if(!active||active.finishedAt||!loaded)return;
    const id=loaded.questions[active.index].id;
    setAttempt({...active,answers:{...active.answers,[id]:{...active.answers[id],value}}});
  },[]);
  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{
      if(!question||stopped||confirm||busy||event.ctrlKey||event.metaKey||event.altKey||(event.target instanceof HTMLElement&&/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)))return;
      const index=event.key.toLowerCase().charCodeAt(0)-97;
      if(index>=0&&index<(question.options?.length??0)){event.preventDefault();answer(question.options![index].id);}
    };window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
  },[question,stopped,confirm,busy,answer]);
  async function openAttempt(saved?:Attempt){
    setBusy(true);setError('');
    try{
      const seed=saved?.seed??crypto.randomUUID();const chosen=saved?.level??level;
      const response=await fetch(`/api/simulado?level=${chosen}&seed=${encodeURIComponent(seed)}`);const data=await response.json() as Form & {version:string;error?:string};if(!response.ok)throw Error(data.error??'Falha ao carregar o simulado.');
      if(saved&&saved.version!==data.version)throw Error('O banco de questões mudou. Exporte o resultado anterior e inicie uma nova tentativa.');
      setForm(data);setAttempt(saved??{id:crypto.randomUUID(),version:data.version,level:chosen,seed,mode,startedAt:Date.now(),deadline:Date.now()+PROFILES[chosen].minutes.listening*60000,section:'listening',index:0,answers:{},playLimit});
      setResume(null);setReviewOnlyErrors(false);setSpeed(1);window.scrollTo({top:0,behavior:'smooth'});
    }catch(e){setError(e instanceof Error?e.message:'Falha ao carregar.');}finally{setBusy(false);}
  }
  function play(){
    const active=attemptRef.current,loaded=formRef.current,player=audio.current;if(!active||!loaded||!player)return;
    const q=loaded.questions[active.index],plays=active.answers[q.id]?.plays??0;
    if(active.mode==='exam'&&!active.finishedAt&&plays>=active.playLimit)return;
    player.playbackRate=active.mode==='exam'&&!active.finishedAt?1:speed;player.currentTime=0;setError('');
    void player.play().catch(()=>setError('Não foi possível iniciar o áudio. Clique em “Ouvir áudio” novamente e confira sua conexão.'));
  }
  function onPlay(){
    setPlaying(true);setNextAt(0);setAttempt(active=>{
      if(!active||active.finishedAt||!question)return active;
      return {...active,answers:{...active.answers,[question.id]:{...active.answers[question.id],value:active.answers[question.id]?.value??'',plays:(active.answers[question.id]?.plays??0)+1}}};
    });
  }
  function onEnded(){
    setPlaying(false);const active=attemptRef.current;if(!active||active.mode!=='exam'||active.finishedAt||!question)return;
    if((active.answers[question.id]?.plays??0)<active.playLimit)audioTimer.current=setTimeout(()=>play(),1000);
    else setNextAt(Date.now()+10000);
  }
  // A short delay gives each question's audio element time to load after navigation.
  useEffect(()=>{
    if(!strict||!question?.audio)return;
    const timer=setTimeout(()=>{if((attemptRef.current?.answers[question.id]?.plays??0)<(attemptRef.current?.playLimit??0))play();},600);
    return()=>clearTimeout(timer);
    // play reads current state from refs; only changing the item should start a new recording.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[question?.id,strict]);

  function rubric(id:string,value:number){
    if(!attempt)return;const updated={...attempt,rubric:{...attempt.rubric,[id]:value}};setAttempt(updated);
    const all=[updated,...loadHistory().filter(item=>item.id!==updated.id)].slice(0,40);setHistory(all);try{localStorage.setItem(HISTORY_KEY,JSON.stringify(all));}catch{setStorageWarning('Não foi possível salvar a autoavaliação.');}
  }
  function exportResult(format:'json'|'csv'){
    if(!attempt?.result)return;
    if(format==='json')download(JSON.stringify(attempt,null,2),`hsk-${attempt.level}-${attempt.id.slice(0,8)}.json`,'application/json');
    else {const rows=[['Questão','Seção','Sua resposta','Gabarito','Pontos de prática','Reproduções'],...attempt.result.items.map(i=>[i.id,form?.questions.find(q=>q.id===i.id)?.section,i.user,i.correct,i.earned??(attempt.rubric?.[i.id]!==undefined?attempt.rubric[i.id]/4:'Autoavaliação pendente'),attempt.answers[i.id]?.plays??0])];download('\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(';')).join('\n'),`hsk-${attempt.level}.csv`,'text/csv;charset=utf-8');}
  }
  const profile=PROFILES[level];
  return <div className={styles.page}>
    <header className={styles.header}><Link className={styles.brand} href="/"><span>考</span>Tons de Mandarim</Link><nav aria-label="Navegação principal">{[['/','Frases'],['/letras-e-silabas','Letras e sílabas'],['/exercicios','Exercícios'],['/tons','Tons'],['/hsk1','HSK1'],['/revisao','Revisão'],['/simulado','Simulado HSK']].map(([href,label])=><Link key={href} href={href} aria-current={href==='/simulado'?'page':undefined}>{label}</Link>)}</nav></header>
    <main className={styles.main}>
      {!attempt&&<>
        <div className={styles.hero}><div><p className={styles.eyebrow}>模拟考试 · NOVO HSK 3.0</p><h1>Treine como se fosse<br/><em>o dia da prova.</em></h1><p>Ouça, leia e responda no seu ritmo — ou coloque o relógio para correr. Três provas completas para descobrir o que já sabe e o que precisa revisar.</p></div><div className={styles.heroStamp}><span>汉语</span><strong>1 / 2 / 3</strong><small>170 questões autorais<br/>27 cenas · áudio em mandarim</small></div></div>
        {resume&&<div className={styles.notice}><div><strong>Você tem uma tentativa em andamento · HSK {resume.level}</strong><p>Suas respostas estão salvas nesta aba. No modo prova, o relógio continua correndo mesmo fora da página.</p></div><button onClick={()=>void openAttempt(resume)} disabled={busy}>Continuar tentativa</button></div>}
        <section aria-label="Escolher nível" className={styles.levels}>{([1,2,3] as Level[]).map(n=><button key={n} aria-pressed={level===n} onClick={()=>setLevel(n)} className={level===n?styles.chosenLevel:''}><small>NOVO HSK · {['一级','二级','三级'][n-1]}</small><strong>HSK {n}</strong><span>{PROFILES[n].total} questões</span><p>{n===1?'Escuta e leitura':'Escuta, leitura e escrita'}</p><footer>{PROFILES[n].vocabulary.toLocaleString('pt-BR')} palavras cumulativas</footer></button>)}</section>
        <section className={styles.setup}><div><p className={styles.eyebrow}>PREPARE-SE</p><h2>Seu simulado HSK {level}</h2><div className={styles.modeButtons}><button onClick={()=>setMode('exam')} aria-pressed={mode==='exam'}><strong>Modo prova</strong><small>Cronômetro por seção, áudio natural e sem dicas.</small></button><button onClick={()=>setMode('practice')} aria-pressed={mode==='practice'}><strong>Modo treino</strong><small>Sem limite de tempo, áudio livre e opção devagar.</small></button></div><label className={styles.configLabel}>Reproduções por questão no modo prova <select value={playLimit} onChange={e=>setPlayLimit(Number(e.target.value))}><option value={1}>1 vez</option><option value={2}>2 vezes</option></select></label><p className={styles.fine}>Limite configurável do app, não uma regra oficial confirmada. O áudio avança automaticamente após 10 segundos de resposta. No treino, você navega livremente.</p><button className={styles.primary} onClick={()=>void openAttempt()} disabled={busy}>{busy?'Preparando…':'Começar simulado →'}</button></div><aside><h3>O que você vai encontrar</h3>{SECTIONS.filter(s=>profile.counts[s]).map(s=><div className={styles.structure} key={s}><span>{SECTION_LABELS[s]}</span><strong>{profile.counts[s]} questões · {profile.minutes[s]} min</strong></div>)}<p>Tempo de resposta neste app: <strong>{Object.values(profile.minutes).reduce((a,b)=>a+b,0)} minutos</strong>. O total oficial aproximado de {profile.global} minutos inclui procedimentos administrativos que não repetimos aqui.</p><p>Use fones de ouvido. Para escrever, ative um teclado chinês (pinyin). As questões dos níveis 1 e 2 têm apoio em pinyin, como nas amostras consultadas.</p><button onClick={()=>{const a=new Audio('/audio/simulado/h1-01.mp3');void a.play().catch(()=>setError('Não foi possível reproduzir. Confira sua conexão e o volume.'));}}>▶ Testar som</button></aside></section>
        {!!history.length&&<section className={styles.history}><h2>Suas últimas tentativas</h2><p className={styles.fine}>Salvas neste navegador, sem compartilhar com outros visitantes.</p>{history.slice(0,10).map(item=><button key={item.id} onClick={()=>void openAttempt(item)} disabled={busy}><strong>HSK {item.level} · {item.mode==='exam'?'Prova':'Treino'}</strong><span>{new Date(item.finishedAt??item.startedAt).toLocaleString('pt-BR')}</span><b>{item.result?.objectiveCorrect}/{item.result?.objectiveTotal} objetivas</b><span>Ver resultado →</span></button>)}</section>}
        <OralPractice/>
        <details className={styles.sources}><summary>Formato, fontes e limites deste simulado</summary><p>Questões e imagens autorais, áudio sintético em mandarim. Não é uma prova oficial, nem uma cópia de exames CTI. As alternativas são embaralhadas em cada tentativa; o conteúdo desta primeira versão é fixo. A escrita livre recebe exemplos e autoavaliação, não uma correção automática de gramática.</p><p>Base: pacote de amostras HSK 3.0 consultado em 2 de outubro de 2026. HSK 2, escrita parte 1: associação de componentes para completar caracteres — aqui apresentada como decomposição digital, em vez de caligrafia com traços ausentes.</p><a href="https://www.chinesetest.cn/" target="_blank" rel="noreferrer">CTI · Portal e materiais HSK 3.0</a><a href="https://admin.chinesetest.cn/gonewcontent.do?id=51236758" target="_blank" rel="noreferrer">CTI · Aviso do piloto e durações</a><a href="https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip" target="_blank" rel="noreferrer">Pacote oficial de amostras</a></details>
      </>}
      {attempt&&form&&!stopped&&question&&<>
        <div className={styles.examBar}><div><small>NOVO HSK {attempt.level} · {attempt.mode==='exam'?'MODO PROVA':'MODO TREINO'}</small><h1>{SECTION_LABELS[attempt.section]}</h1></div><div className={styles.timer} role="timer" aria-label="Tempo restante da seção">{strict?clock(attempt.deadline-now):'Sem limite'}<small>{answered}/{form.questions.length} respondidas</small></div><button onClick={()=>setConfirm('leave')}>Salvar e sair</button></div>
        <div className={styles.workspace}><aside className={styles.navigator}><h2>Mapa da prova</h2>{SECTIONS.filter(s=>PROFILES[attempt.level].counts[s]).map(s=><section key={s}><h3>{SECTION_LABELS[s]}</h3><div>{form.questions.map((q,i)=>q.section===s&&<button key={q.id} disabled={strict&&q.section!==attempt.section} aria-label={`Questão ${i+1}${attempt.answers[q.id]?.value?', respondida':''}`} aria-current={i===attempt.index?'step':undefined} className={[attempt.answers[q.id]?.value?styles.answered:'',attempt.answers[q.id]?.flagged?styles.flagged:''].join(' ')} onClick={()=>move(i)}>{i+1}</button>)}</div></section>)}<p><i/>Respondida · ⚑ marcada para revisar</p><button className={styles.primary} onClick={()=>setConfirm('finish')}>Entregar prova</button></aside>
          <article className={styles.question} key={question.id}><div className={styles.questionTop}><span>QUESTÃO {attempt.index+1} / {form.questions.length} · PARTE {question.part}</span><button aria-pressed={!!attempt.answers[question.id]?.flagged} onClick={()=>setAttempt({...attempt,answers:{...attempt.answers,[question.id]:{...attempt.answers[question.id],value:attempt.answers[question.id]?.value??'',flagged:!attempt.answers[question.id]?.flagged}}})}>⚑ {attempt.answers[question.id]?.flagged?'Marcada':'Marcar'}</button></div><h2 lang="zh-CN">{question.instructionZh}</h2><p>{question.instruction}</p>{question.group&&<p className={styles.groupNote}>Grupo compartilhado · As seis alternativas são as mesmas nas cinco questões deste bloco. Uma sobra.</p>}
            {question.audio&&<div className={styles.audioPanel}><audio ref={audio} src={question.audio} preload="auto" onPlay={onPlay} onPause={()=>setPlaying(false)} onEnded={onEnded} onError={()=>setError('O arquivo de áudio não carregou. Confira a conexão e tente novamente.')} data-media-title={`Simulado HSK ${attempt.level}, questão ${attempt.index+1}`} /><button className={styles.primary} onClick={play} disabled={playing||(strict&&(attempt.answers[question.id]?.plays??0)>=attempt.playLimit)}>{playing?'◉ Reproduzindo…':'▶ Ouvir áudio'}</button><span>{strict?`${attempt.answers[question.id]?.plays??0}/${attempt.playLimit} reproduções`:'Repetição livre'}</span>{!strict&&<label>Velocidade <select value={speed} onChange={e=>{setSpeed(Number(e.target.value));if(audio.current)audio.current.playbackRate=Number(e.target.value);}}><option value={1}>Natural</option><option value={0.75}>Devagar · 0,75×</option><option value={0.6}>Devagar · 0,6×</option></select></label>}{nextAt>0&&<small>Próxima questão em {Math.max(0,Math.ceil((nextAt-now)/1000))} s</small>}</div>}
            {question.stem&&<Chinese text={question.stem} showPinyin={attempt.level<3&&question.section!=='writing'}/>}
            {question.picture&&<div className={styles.promptPicture}><Picture picture={question.picture} label="Imagem para produção de uma frase"/></div>}
            {question.options?<div role="radiogroup" aria-label="Alternativas" className={question.options[0]?.picture?styles.imageOptions:styles.options}>{question.options.map((option,i)=><button role="radio" aria-checked={attempt.answers[question.id]?.value===option.id} key={option.id} onClick={()=>answer(option.id)} className={attempt.answers[question.id]?.value===option.id?styles.selected:''}><b>{String.fromCharCode(65+i)}</b>{option.picture?<Picture picture={option.picture} label={`Alternativa ${String.fromCharCode(65+i)}`}/>:<Chinese text={option.text??''} showPinyin={attempt.level<3&&question.section!=='writing'}/>}</button>)}</div>:<label className={styles.writeLabel}>Sua resposta em chinês<textarea lang="zh-CN" maxLength={question.kind==='sentence'?300:30} value={attempt.answers[question.id]?.value??''} onChange={e=>answer(e.target.value)} placeholder={question.kind==='sentence'?'Escreva uma frase completa…':'Digite os caracteres…'}/><small>Use seu teclado chinês. Pinyin digitado como resposta não conta como caractere.</small></label>}
            <footer className={styles.questionFooter}><button disabled={attempt.index===0||(strict&&form.questions[attempt.index-1]?.section!==attempt.section)} onClick={()=>move(attempt.index-1)}>← Anterior</button><button onClick={()=>{const next=attempt.index+1;if(next>=form.questions.length)setConfirm('finish');else if(strict&&form.questions[next].section!==attempt.section)setConfirm('section');else move(next);}}>{attempt.index===form.questions.length-1?'Concluir':strict&&form.questions[attempt.index+1]?.section!==attempt.section?'Concluir seção':'Próxima →'}</button></footer>
          </article>
        </div>
      </>}
      {attempt?.result&&stopped&&form&&<section className={styles.results}><p className={styles.eyebrow}>SIMULADO CONCLUÍDO · HSK {attempt.level}</p><h1>Seu próximo passo<br/><em>começa aqui.</em></h1><p>{attempt.result.objectiveCorrect} de {attempt.result.objectiveTotal} questões objetivas corretas · {Math.round(100*attempt.result.objectiveCorrect/attempt.result.objectiveTotal)}% de acerto</p><p className={styles.fine}>Resultado de prática do app, não a pontuação oficial CTI. Não atribuímos aprovação oficial. A produção de frases deve ser avaliada separadamente.</p><div className={styles.scoreCards}>{attempt.result.scores.map(s=>{const qs=form.questions.filter(q=>q.section===s.section);const pending=qs.filter(q=>attempt.result!.items.find(i=>i.id===q.id)?.earned===null);const assessed=pending.every(q=>attempt.rubric?.[q.id]!==undefined);const points=s.correct+pending.reduce((a,q)=>a+(attempt.rubric?.[q.id]??0)/4,0);return <article key={s.section}><small>{SECTION_LABELS[s.section]}</small><strong>{Math.round(100*points/s.total)}<span>/100</span></strong><p>{pending.length&&!assessed?'Parcial · falta autoavaliar as frases':pending.length?'Inclui sua autoavaliação':'Questões objetivas'}</p></article>;})}</div><div className={styles.resultActions}><button onClick={()=>{clearAudio();setAttempt(null);setForm(null);}}>Novo simulado</button><button onClick={()=>exportResult('csv')}>Exportar CSV</button><button onClick={()=>exportResult('json')}>Exportar JSON</button><button onClick={()=>window.print()}>Imprimir / salvar PDF</button></div><label className={styles.filter}><input type="checkbox" checked={reviewOnlyErrors} onChange={e=>setReviewOnlyErrors(e.target.checked)}/>Mostrar somente erros e escrita para revisar</label><div className={styles.reviewList}>{attempt.result.items.filter(i=>!reviewOnlyErrors||i.earned!==1).map(item=>{const q=form.questions.find(q=>q.id===item.id)!;const choice=q.options?.find(o=>o.id===item.user),correct=q.options?.find(o=>o.id===item.correct);return <article key={item.id}><header><b>{item.id.toUpperCase()} · {q.part}</b><span className={item.earned===1?styles.correct:styles.incorrect}>{item.earned===null?'Autoavaliação':item.earned===1?'✓ Correta':item.user?'✕ Revisar':'Não respondida'}</span></header>{q.stem&&<Chinese text={q.stem} showPinyin/>}{q.picture&&<div className={styles.promptPicture}><Picture picture={q.picture} label="Imagem da questão"/></div>}{item.transcript&&<div className={styles.transcript}><small>TRANSCRIÇÃO DO ÁUDIO</small><Chinese text={item.transcript.replaceAll('|','\n')} showPinyin/><audio controls preload="none" src={q.audio} data-media-title={`Revisão ${q.id}`} /></div>}<p><strong>Sua resposta: </strong>{choice?.text??(choice?.picture?'imagem selecionada':item.user||'Em branco')}</p>{choice?.picture&&<div className={styles.miniPicture}><Picture picture={choice.picture} label="Sua imagem selecionada"/></div>}{q.kind!=='sentence'&&<><p><strong>Resposta: </strong>{correct?.text??(correct?.picture?'imagem abaixo':item.correct)}</p>{correct?.picture&&<div className={styles.miniPicture}><Picture picture={correct.picture} label="Imagem correta"/></div>}</>}<p>{item.explanation}</p>{item.models&&<><p><strong>Exemplos possíveis — outras frases podem estar corretas:</strong></p>{item.models.map(model=><Chinese key={model} text={model} showPinyin/>)}<label>Autoavalie de 0 a 4 <select value={attempt.rubric?.[item.id]??''} onChange={e=>rubric(item.id,Number(e.target.value))}><option value="" disabled>Escolher nota</option><option value={0}>0 · sem relação / em branco</option><option value={1}>1 · palavras relevantes, sem frase compreensível</option><option value={2}>2 · sentido claro, erros importantes</option><option value={3}>3 · frase compreensível, pequenos erros</option><option value={4}>4 · completa, correta, usa a palavra e descreve a imagem</option></select></label><p className={styles.fine}>Confira com sua professora se tiver dúvida. O app não valida automaticamente a gramática.</p></>}</article>;})}</div></section>}
      {error&&<div role="alert" className={styles.error}>{error}{attempt&&!stopped&&<button onClick={()=>{setError('');if(now>=attempt.deadline)void finish();}}>Tentar novamente</button>}</div>}
      {storageWarning&&<p role="status" className={styles.error}>{storageWarning}</p>}
    </main>
    {confirm&&<div className={styles.overlay} ref={dialog}><section role="dialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">{confirm==='finish'?'Entregar o simulado?':confirm==='section'?'Concluir esta seção?':'Salvar e sair?'}</h2><p>{confirm==='finish'?`Você respondeu ${answered} de ${form?.questions.length} questões. As demais ficarão em branco.`:confirm==='section'?'No modo prova, você não poderá voltar a esta seção.':'As respostas ficam salvas nesta aba, mas o relógio do modo prova continua correndo.'}</p><div><button autoFocus onClick={()=>setConfirm(null)}>Continuar aqui</button><button className={styles.primary} onClick={()=>{if(confirm==='finish')void finish();else if(confirm==='section')nextSection();else {clearAudio();setResume(attempt);setAttempt(null);setForm(null);setConfirm(null);}}}>{confirm==='finish'?'Entregar':confirm==='section'?'Próxima seção':'Salvar e sair'}</button></div></section></div>}
  </div>;
}
