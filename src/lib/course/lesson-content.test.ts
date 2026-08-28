import assert from 'node:assert/strict';
import { test } from 'node:test';

import { FIXTURES } from '../grammar/fixtures.ts';
import { COURSE_LESSONS } from './course.ts';
import { countWords } from './inline.ts';
import { LESSON_DOCS, citedSentenceIds, lessonDoc, requiredWords } from './lesson-content.ts';

/* The copy budgets. A lesson that runs
   long fails here rather than being noticed later, if ever. */
const REQUIRED_PROSE = 350;
const LEDE_WORDS = 18;
const CAPTION_WORDS = 24;
const CREDIT_WORDS = 30;

test('every authored lesson belongs to the course', () => {
  const ids = new Set(COURSE_LESSONS.map((lesson) => lesson.id));
  for (const doc of LESSON_DOCS) assert.ok(ids.has(doc.id), `${doc.id} is not a course lesson`);
});

test('every cited sentence is one the app can actually diagram', () => {
  const known = new Set(FIXTURES.map((sentence) => sentence.id));
  for (const doc of LESSON_DOCS) {
    for (const id of citedSentenceIds(doc)) {
      assert.ok(known.has(id), `${doc.id} cites unknown sentence ${id}`);
    }
  }
});

test('required prose stays inside its budget', () => {
  for (const doc of LESSON_DOCS) {
    const words = requiredWords(doc);
    assert.ok(
      words <= REQUIRED_PROSE,
      `${doc.id} needs ${words} words, budget is ${REQUIRED_PROSE}`,
    );
  }
});

test('the lede is one short sentence', () => {
  for (const doc of LESSON_DOCS) {
    assert.ok(countWords(doc.lede) <= LEDE_WORDS, `${doc.id} lede runs long`);
  }
});

test('figure captions stay inside their budget', () => {
  for (const doc of LESSON_DOCS) {
    for (const block of doc.blocks) {
      if (block.kind !== 'diagram') continue;
      assert.ok(countWords(block.caption) <= CAPTION_WORDS, `${doc.id} caption runs long`);
    }
  }
});

/* A credit does not count toward required prose, so a cap is the only thing
   stopping it from becoming somewhere to hide a paragraph. */
test('a credit stays a single line', () => {
  for (const doc of LESSON_DOCS) {
    for (const block of doc.blocks) {
      if (block.kind !== 'credit') continue;
      assert.ok(countWords(block.text) <= CREDIT_WORDS, `${doc.id} credit runs long`);
    }
  }
});

test('the first action arrives before the reader has to scroll far', () => {
  for (const doc of LESSON_DOCS) {
    const upToSentence = doc.blocks.findIndex((block) => block.kind === 'sentence');
    assert.ok(upToSentence >= 0, `${doc.id} never shows a sentence`);
    const before = doc.blocks.slice(0, upToSentence);
    const words =
      countWords(doc.lede) +
      before.reduce(
        (total, block) => total + (block.kind === 'prose' ? countWords(block.text) : 0),
        0,
      );
    assert.ok(words <= 60, `${doc.id} opens with ${words} words of reading before its sentence`);
  }
});

test('the introduction ends by handing the learner a sentence to build', () => {
  const doc = lessonDoc('01-introduction')!;
  const last = doc.blocks.at(-1)!;
  assert.equal(last.kind, 'start');
  assert.equal(last.kind === 'start' && last.sentenceId, 'fix-vint');
});

test('lessons without authored prose report nothing rather than a placeholder', () => {
  assert.equal(lessonDoc('02-sentence-frame'), undefined);
});
