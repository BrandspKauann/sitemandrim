import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {checkWritingAnswer, writingFocus} from '../app/lib/writingPractice.ts';
let count=0;
for(let lesson=1;lesson<=6;lesson++) {
 const source=readFileSync(new URL(`../app/revisao/aula${lesson}Data.ts`,import.meta.url),'utf8');
 const section=source.split(/export const (?:AULA\d_)?WRITING_EXERCISES = \[/)[1]?.split('];')[0];
 assert.ok(section,`Aula ${lesson}`);
 for(const match of section.matchAll(/prompt: '([^']+)', answer: '([^']+)', hint: '([^']+)'/g)) {
  const [,prompt,answer,hint]=match;
  assert.ok(prompt.length>5&&hint.length>5); assert.ok(checkWritingAnswer(answer,answer)); assert.ok(writingFocus(answer).length>20);
  assert.ok(!hint.includes(answer)); count++;
 }
}
assert.equal(count,78);
const aula7=readFileSync(new URL('../app/revisao/aula7Data.ts',import.meta.url),'utf8');
const writing7=aula7.split('const writing = [')[1].split('] as const')[0];
const ids=[...writing7.matchAll(/\['([^']+)'/g)].map(m=>m[1]);
assert.equal(ids.length,22);
for(const id of ids) { const row=[...aula7.matchAll(/\['([^']+)', '([^']+)', '([^']+)', '([^']+)'\]/g)].find(m=>m[1]===id); assert.ok(row); assert.ok(checkWritingAnswer(row[2],row[2])); }
assert.ok(checkWritingAnswer('小猫在椅子上面睡觉！','小猫在椅子上睡觉。'));
assert.ok(checkWritingAnswer('小猫正在椅子上睡觉呢。','小猫在椅子上睡觉。'));
assert.ok(!checkWritingAnswer('小猫在椅子下睡觉。','小猫在椅子上睡觉。'));
assert.ok(!checkWritingAnswer('小猫在椅子上。','小猫在椅子上睡觉。'));
assert.ok(!checkWritingAnswer('我有两个孩子','我没有两个孩子'));
assert.ok(!checkWritingAnswer('我要看电视','我正在看电视'));
assert.ok(checkWritingAnswer('你下午两点能到吗？','下午两点你能到吗？'));
assert.ok(checkWritingAnswer('你正在做什么？','你在做什么呢？'));
console.log(`${count} enunciados estáticos de Revisão conferidos; alternativas, posições e negações testadas.`);
