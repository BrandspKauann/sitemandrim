import assert from 'node:assert/strict';
import {LESSON11_GROUPS as groups, LESSON11_GRAMMAR as grammar, LESSON11_QUIZ as quiz, LESSON11_WRITING as writing} from '../app/hsk1/lesson11Data.ts';
assert.equal(groups.length,5);
assert.equal(groups[0].items.length,25);
assert.deepEqual(groups.slice(1,4).map(g=>g.items.length),[4,4,6]);
const entries=groups.flatMap(g=>g.items);
assert.equal(new Set(entries.map(i=>i.id)).size,entries.length);
for(const item of entries) for(const key of ['hanzi','pinyin','meaning']) assert.ok(item[key]);
assert.equal(grammar.length,3);
for(const topic of grammar) for(const example of topic.examples) assert.ok(entries.some(i=>i.hanzi===example));
assert.equal(quiz.length,20);
for(const q of quiz) {assert.equal(q.options.length,4); assert.equal(new Set(q.options).size,4); assert.ok(q.correct>=0&&q.correct<4);}
assert.equal(writing.length,12);
for(const [,answer,hint] of writing) assert.ok(!hint.includes(answer));
assert.equal(entries.find(i=>i.id==='l11-d3-6').hanzi,'我昨天问他，他对我说，他不去，他今天要和小朋友玩。');
console.log('Lição 11: 25 palavras, 14 falas, 3 pontos gramaticais, 20 questões e 12 exercícios de escrita verificados.');
