import assert from 'node:assert/strict';
import * as lesson from '../app/revisao/aula7Data.ts';
const phrases = lesson.AULA7_KEY_PHRASES;
assert.equal(phrases.length, 68);
assert.equal(new Set(phrases.map(p => p.id)).size, phrases.length);
for (const p of phrases) assert.ok(p.hanzi && p.translation && p.spokenPinyin);
for (const t of lesson.AULA7_LESSON_TOPICS) assert.ok(t.examples.every(p => phrases.includes(p)));
for (const e of lesson.AULA7_LISTENING_EXERCISES) {
  assert.equal(e.choices[0], phrases.find(p => p.id === e.phraseId)?.translation);
  assert.equal(new Set(e.choices).size, e.choices.length);
}
for (const e of lesson.AULA7_WRITING_EXERCISES) {
  assert.ok(phrases.some(p => p.hanzi === e.answer));
  assert.ok(!/[\u4e00-\u9fff]/u.test(e.hint));
}
assert.equal(lesson.AULA7_LESSON_TOPICS.length, 10);
assert.equal(lesson.AULA7_WRITING_EXERCISES.length, 22);
assert.equal(lesson.AULA7_LISTENING_EXERCISES.length, 20);
assert.ok(phrases.find(p => p.id === 'a7-clothes-not-expensive').spokenPinyin.includes('bú guì'));
assert.ok(phrases.find(p => p.id === 'a7-not-cheap-fruit').spokenPinyin.includes('bù piányi'));
assert.ok(phrases.find(p => p.id === 'a7-want-apples').spokenPinyin.includes('wǒ | xiáng mǎi | liǎng jīn'));
console.log(`Aula 7: ${phrases.length} frases, ${lesson.AULA7_VOCABULARY_GROUPS.flatMap(g => g.words).length} palavras, referências e respostas válidas, dicas sem resposta.`);
