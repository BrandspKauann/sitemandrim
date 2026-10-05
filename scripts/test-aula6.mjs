import assert from 'node:assert/strict';
import * as lesson from '../app/revisao/aula6Data.ts';
const phrases = lesson.AULA6_KEY_PHRASES;
assert.equal(phrases.length, 61);
assert.equal(new Set(phrases.map(p => p.id)).size, phrases.length);
for (const p of phrases) assert.ok(p.hanzi && p.translation && p.spokenPinyin);
for (const topic of lesson.AULA6_LESSON_TOPICS) assert.ok(topic.examples.every(Boolean));
for (const exercise of lesson.AULA6_LISTENING_EXERCISES) {
  const phrase = phrases.find(p => p.id === exercise.phraseId);
  assert.ok(phrase);
  assert.equal(exercise.choices[0], phrase.translation);
  assert.equal(new Set(exercise.choices).size, exercise.choices.length);
}
for (const exercise of lesson.AULA6_WRITING_EXERCISES) {
  assert.ok(phrases.some(p => p.hanzi === exercise.answer));
  assert.ok(!exercise.hint.match(/[\u4e00-\u9fff]/u), 'Hints must not disclose the Chinese answer');
}
assert.ok(phrases.find(p => p.id === 'a6-first-china').spokenPinyin.includes('dì yī'));
assert.ok(phrases.find(p => p.id === 'a6-half-hour-tv').spokenPinyin.includes('xiǎoshí'));
assert.ok(phrases.find(p => p.id === 'a6-also-dog').spokenPinyin.includes('yé yǒu'));
assert.equal(lesson.AULA6_VOCABULARY_GROUPS.flatMap(g => g.words).length, 55);
console.log('Aula 6: 61 phrases, 55 words, valid topic/answer links, safe hints and tone cases passed.');
