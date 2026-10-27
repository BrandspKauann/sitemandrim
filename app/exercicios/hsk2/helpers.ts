import { pinyin } from 'pinyin-pro';
import type { Lesson } from '../../hsk1/lessons';
import type { StudyGroup, StudyItem } from '../../hsk1/lesson11Data';
export type Row = readonly [string,string,string?];
// Leituras lexicais conferidas no livro: nomes não recebem sandhi de 一;
// sufixos neutros e erhua não devem ser tratados como caracteres isolados.
const readings:Record<string,string>={
 '王一飞':'Wáng Yīfēi','王一雪':'Wáng Yīxuě','一飞':'Yīfēi','白家月':'Bái Jiāyuè','安妮':'Ānnī','李文':'Lǐ Wén','陈天中':'Chén Tiānzhōng','刘明':'Liú Míng','刘小雪':'Liú Xiǎoxuě','西安':"Xī’ān",'北京':'Běijīng',
 '不好意思':'bù hǎoyìsi','意思':'yìsi','时候':'shíhou','东西':'dōngxi','谢谢':'xièxie','哪儿':'nǎr','这儿':'zhèr','那儿':'nàr','有点儿':'yǒudiǎnr','点儿':'diǎnr','裤子':'kùzi','饺子':'jiǎozi','朋友':'péngyou','学生':'xuésheng','个':'ge','还是':'háishi','早上':'zǎoshang','上边':'shàngbian','里边':'lǐbian',
 '一个':'yí ge','两个':'liǎng ge','哪个':'nǎ ge','这个':'zhè ge','那个':'nà ge',
 '看看':'kànkan','试试':'shìshi','洗洗':'xǐxi','想一想':'xiǎng yi xiǎng','看了看':'kàn le kan','帮帮忙':'bāngbang máng','帮了帮忙':'bāng le bang máng',
};
const lexicalPattern=new RegExp(Object.keys(readings).sort((a,b)=>b.length-a.length).join('|'),'g');
export function reading(hanzi:string){
 const parts:string[]=[];let start=0;
 for(const match of hanzi.matchAll(lexicalPattern)){
  if(match.index>start)parts.push(pinyin(hanzi.slice(start,match.index),{toneType:'symbol',toneSandhi:true,nonZh:'consecutive'}));
  parts.push(readings[match[0]]);start=match.index+match[0].length;
 }
 if(start<hanzi.length)parts.push(pinyin(hanzi.slice(start),{toneType:'symbol',toneSandhi:true,nonZh:'consecutive'}));
 return parts.join(' ').replace(/\s+([，。！？；：、])/g,'$1').replace(/([，。！？；：、])\s*/g,'$1 ').trim();
}
export function group(n:number,key:string,name:string,description:string,rows:ReadonlyArray<Row>):StudyGroup {
 return {id:`h2-l${n}-${key}`,name,label:key==='vocabulary'?'生词 · shēngcí':name,description,items:rows.map(([hanzi,meaning,speaker],i):StudyItem=>({id:`h2-l${n}-${key}-${i+1}`,hanzi,meaning,pinyin:reading(hanzi),...(speaker?{speaker}:{})}))};
}
type Input = {number:number;title:string;pages:string;groups:StudyGroup[];grammar:Lesson['grammar'];checks:Lesson['quiz'];writing:ReadonlyArray<readonly [string,string]>;prompts:string;promptsChinese:string;notes:string};
export function makeLesson(input:Input):Lesson {
 const texts=input.groups.filter(g=>g.id.includes('-text')).flatMap(g=>g.items);
 const meanings=[...new Set(texts.map(i=>i.meaning))];
 const meaningQuiz=texts.slice(0,12).map((item,i)=>{
  const others=[...meanings.slice(i+1),...meanings.slice(0,i)].filter(m=>m!==item.meaning).slice(0,3);
  const correct=i%4;const options=[...others];options.splice(correct,0,item.meaning);
  return {q:`Qual é o significado de: ${item.hanzi}`,options,correct,explanation:item.meaning};
 });
 const all=input.groups.flatMap(g=>g.items);
 return {number:input.number,course:'HSK2',title:input.title,description:`Páginas ${input.pages} do livro: vocabulário, três diálogos e um texto narrativo, gramática e prática.`,groups:input.groups,grammar:input.grammar,quiz:[...meaningQuiz,...input.checks],writing:input.writing.map(([hanzi,hint])=>{const item=all.find(x=>x.hanzi===hanzi);if(!item)throw Error(`Frase ausente: ${hanzi}`);return [item.meaning,hanzi,hint] as const;}),prompts:input.prompts,promptsChinese:input.promptsChinese,notes:input.notes+' As traduções são em português brasileiro. Áudio com a voz padrão do site, não a gravação oficial do livro. Os exercícios interativos são prática complementar baseada nos textos.',checklist:['Reconheci o vocabulário e conferi seus significados.','Ouvi e repeti os três diálogos.','Li e ouvi o texto narrativo, frase por frase.','Entendi os três pontos gramaticais e fiz o teste.','Treinei a escrita sem olhar a resposta.','Gravei minha fala e preparei respostas pessoais para a aula.']};
}
