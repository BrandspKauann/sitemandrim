const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
const cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const mod={exports:{}};cache.set(file,mod.exports);const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',js)(id=>id.startsWith('.')?load(path.resolve(path.dirname(file),id+'.ts')):require(id),mod,mod.exports);return mod.exports;}
const ids=new Set();const expected=[14,16,15,16];
for(let n=1;n<=4;n++){
 const l=load(path.join(__dirname,`../app/exercicios/hsk2/lesson${n}.ts`))[`HSK2_LESSON${n}`];
 assert.equal(l.course,'HSK2');assert.equal(l.number,n);assert.equal(l.groups[0].items.length,expected[n-1]);
 assert.equal(l.groups.filter(g=>g.id.includes('-text')).length,4);
 for(const item of l.groups.flatMap(g=>g.items)){assert.ok(item.id.startsWith(`h2-l${n}-`));assert.ok(!ids.has(item.id));ids.add(item.id);for(const k of ['hanzi','pinyin','meaning'])assert.ok(item[k]);}
 assert.equal(l.grammar.length,3);for(const g of l.grammar)for(const ex of g.examples)assert.ok(l.groups.some(g=>g.items.some(i=>i.hanzi===ex)),ex);
 assert.equal(l.quiz.length,20);for(const q of l.quiz){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.options[q.correct]);}
 assert.equal(l.writing.length,12);for(const [pt,zh,hint]of l.writing){assert.ok(l.groups.some(g=>g.items.some(i=>i.hanzi===zh&&i.meaning===pt)));assert.ok(!/[\u4e00-\u9fff]/u.test(hint));}
 console.log(`HSK2 lição ${n}: ${l.groups[0].items.length} entradas, 4 textos, 3 pontos, 20 questões e 12 exercícios de escrita.`);
 if(process.argv.includes('--readings'))for(const g of l.groups)for(const i of g.items)console.log(i.hanzi,'|',i.pinyin);
}
console.log('Conteúdos isolados do HSK1; IDs exclusivos e respostas consistentes.');
const {reading}=load(path.join(__dirname,'../app/exercicios/hsk2/helpers.ts'));
assert.equal(reading('王一飞'),'Wáng Yīfēi');
assert.equal(reading('意思'),'yìsi');assert.equal(reading('裤子'),'kùzi');assert.equal(reading('哪儿'),'nǎr');
assert.ok(reading('你好，谢谢。').includes('，'));assert.ok(reading('你好，谢谢。').endsWith('。'));
console.log('Pinyin: nomes, sufixos neutros, erhua e pontuação verificados.');
