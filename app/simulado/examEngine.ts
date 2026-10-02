import { bank, BANK_VERSION } from './questionBank.ts';
import { PROFILES, type Answer, type ExamResult, type Form, type Level, type PrivateQuestion, type Section } from './types.ts';
export function normalizedAnswer(value: string){ return value.normalize('NFC').replace(/[\s，。！？、,.!?；;：:]/g,'').trim(); }
function hash(value:string){let h=2166136261;for(const c of value)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function formFor(level:Level,seed:string): Form {
  return {level,seed,questions: bank.filter(q=>q.level===level).map(q=>{
    const {correct,explanation,transcript,models,...publicQuestion}=q;
    void correct; void explanation; void transcript; void models;
    const options=q.options?.map(option=>({...option}));
    let state=hash(seed+':'+(q.group??q.id));
    if(options)for(let i=options.length-1;i>0;i--){state=(Math.imul(1664525,state)+1013904223)>>>0;const j=state%(i+1);[options[i],options[j]]=[options[j],options[i]];}
    return {...publicQuestion,options};
  })};
}
export function grade(level:Level,answers:Record<string,Answer>): ExamResult {
  const questions=bank.filter(q=>q.level===level);
  const items=questions.map(q=>{
    const user=answers[q.id]?.value??'';
    const earned=q.kind==='sentence'?(user.trim()?null:0):(q.kind==='choice'?user===q.correct:normalizedAnswer(user)===normalizedAnswer(q.correct))?1:0;
    return {id:q.id,correct:q.correct,user,earned,explanation:q.explanation,transcript:q.transcript,models:q.models};
  });
  const scores=(['listening','reading','writing'] as Section[]).filter(s=>PROFILES[level].counts[s]>0).map(section=>{
    const sectionItems=items.filter(i=>questions.find(q=>q.id===i.id)?.section===section);
    const correct=sectionItems.reduce((a,i)=>a+(i.earned??0),0),pending=sectionItems.filter(i=>i.earned===null).length;
    return {section,correct,total:sectionItems.length,pending,percent:Math.round(100*correct/sectionItems.length)};
  });
  const objective=items.filter(i=>questions.find(q=>q.id===i.id)?.kind!=='sentence');
  return {items,scores,objectiveCorrect:objective.reduce((a,i)=>a+(i.earned??0),0),objectiveTotal:objective.length,pending:items.filter(i=>i.earned===null).length};
}
export function validateBank(){
  for(const level of [1,2,3] as Level[]){
    const questions=bank.filter(q=>q.level===level);
    if(questions.length!==PROFILES[level].total)throw Error(`HSK${level}: invalid total`);
    for(const section of ['listening','reading','writing'] as Section[])if(questions.filter(q=>q.section===section).length!==PROFILES[level].counts[section])throw Error(`HSK${level}: invalid ${section} count`);
    for(const q of questions){if(q.options&&!q.options.some(o=>o.id===q.correct))throw Error(`Invalid answer ${q.id}`);if(q.section==='listening'&&!q.transcript)throw Error(`Missing audio script ${q.id}`);}
  }
}
export { BANK_VERSION };
export function privateItems(level:Level): PrivateQuestion[]{ return bank.filter(q=>q.level===level); }
