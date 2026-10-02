import assert from 'node:assert/strict';
import {existsSync,statSync} from 'node:fs';
import {bank} from '../app/simulado/questionBank.ts';
import {formFor,grade,validateBank,normalizedAnswer} from '../app/simulado/examEngine.ts';
validateBank();
assert.equal(bank.length,170);
assert.equal(new Set(bank.map(q=>q.id)).size,170);
const parts={1:{L1:5,L2:5,L3:5,L4:5,R1:5,R2:5,R3:5,R4:5},2:{L1:5,L2:10,L3:10,R1:5,R2:5,R3:10,R4:5,W1:5,W2:5},3:{L1:10,L2:10,L3:10,R1:10,R2:10,R3:10,W1:5,W2:5}};
for(const level of [1,2,3]){
  const form=formFor(level,'test-seed');
  assert.deepEqual(form,formFor(level,'test-seed'));
  assert.notDeepEqual(form.questions.map(q=>q.options),formFor(level,'other-seed').questions.map(q=>q.options));
  for(const [part,count] of Object.entries(parts[level]))assert.equal(form.questions.filter(q=>q.part===part).length,count);
  for(const q of form.questions){for(const key of ['correct','explanation','models','transcript'])assert.equal(key in q,false,`Answer leak ${q.id} ${key}`);}
  const all=bank.filter(q=>q.level===level);
  const answers=Object.fromEntries(all.map(q=>[q.id,{value:q.correct}]));
  const result=grade(level,answers);
  assert.equal(result.objectiveCorrect,result.objectiveTotal);
  assert.equal(result.pending,level===3?5:0);
  assert.equal(grade(level,{}).objectiveCorrect,0);
  assert.equal(grade(level,{}).pending,0);
  for(const group of new Set(all.map(q=>q.group).filter(Boolean))){const questions=form.questions.filter(q=>q.group===group);assert.equal(questions.length,5);for(const q of questions)assert.deepEqual(q.options,questions[0].options);}
}
assert.equal(normalizedAnswer(' 茶。 '),'茶');
for(const q of bank){
  if(q.audio){const file='public'+q.audio;assert(existsSync(file),`Missing audio ${file}`);assert(statSync(file).size>1000);}
  for(const picture of [...(q.options??[]).map(o=>o.picture),q.picture].filter(Boolean))assert(existsSync(`public/images/simulado/${picture.sheet}.webp`));
}
console.log('HSK simulations: 170 unique items, exact blueprints, answer privacy, reproducible shuffling, grading, group consistency and all media passed.');
