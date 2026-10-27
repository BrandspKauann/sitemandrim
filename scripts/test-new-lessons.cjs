const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const cache=new Map();
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file);
 const mod={exports:{}};cache.set(file,mod.exports);
 const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const req=id=>id.startsWith('.')?load(path.resolve(path.dirname(file),id+'.ts')):require(id);
 new Function('require','module','exports',js)(req,mod,mod.exports);return mod.exports;
}
const root=path.resolve(__dirname,'..');
const ids=new Set();
for(const n of [13,14,15]){
 const data=load(path.join(root,`app/hsk1/lesson${n}Data.ts`));
 const groups=data[`LESSON${n}_GROUPS`];
 const entries=groups.flatMap(g=>g.items);
 assert.equal(groups[0].items.length,n===13?20:n===14?26:17);
 assert.deepEqual(groups.filter(g=>/-text[123]$/.test(g.id)).map(g=>g.items.length),n===14?[4,5,6]:[4,4,6]);
 for(const e of entries){assert.ok(e.hanzi&&e.pinyin&&e.meaning);assert.ok(!ids.has(e.id));ids.add(e.id);}
 for(const g of data[`LESSON${n}_GRAMMAR`])for(const ex of g.examples)assert.ok(entries.some(e=>e.hanzi===ex),ex);
 assert.equal(data[`LESSON${n}_QUIZ`].length,20);
 for(const q of data[`LESSON${n}_QUIZ`]){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.correct>=0&&q.correct<4);}
 assert.equal(data[`LESSON${n}_WRITING`].length,12);
 for(const [pt,zh,hint] of data[`LESSON${n}_WRITING`]){assert.ok(pt&&zh&&hint);assert.ok(!hint.includes(zh));}
 console.log(`Lição ${n}: vocabulário, três diálogos, 20 questões e 12 exercícios válidos.`);
}
for(const n of [8,9,10,11]){
 const data=load(path.join(root,`app/revisao/aula${n}Data.ts`))[`AULA${n}`];
 assert.ok(data.keyPhrases.length>=40);assert.equal(data.topics.length,8);
 for(const p of data.keyPhrases){assert.ok(p.hanzi&&p.translation&&p.spokenPinyin);assert.ok(!ids.has(p.id));ids.add(p.id);}
 for(const topic of data.topics)assert.ok(topic.examples.every(p=>data.keyPhrases.includes(p)));
 for(const e of data.writingExercises){assert.ok(data.keyPhrases.some(p=>p.hanzi===e.answer&&p.translation===e.prompt));assert.ok(!/[\u4e00-\u9fff]/u.test(e.hint));}
 for(const e of data.listeningExercises){assert.equal(e.choices[0],data.keyPhrases.find(p=>p.id===e.phraseId)?.translation);assert.equal(new Set(e.choices).size,3);}
 console.log(`Aula ${n}: ${data.keyPhrases.length} frases, ${data.writingExercises.length} exercícios de escrita e ${data.listeningExercises.length} de compreensão.`);
}
const lessonSource=fs.readFileSync(path.join(root,'app/revisao/RevisionHome.tsx'),'utf8');
assert.ok(lessonSource.indexOf('aula7: {')<lessonSource.indexOf('aula8: {'));
const bookSource=fs.readFileSync(path.join(root,'app/hsk1/Hsk1Client.tsx'),'utf8');
assert.ok(bookSource.includes('[LESSON11, LESSON12, LESSON13, LESSON14, LESSON15]'));
console.log('Catálogos mantêm a ordem anterior e isolam cada novo conteúdo.');
