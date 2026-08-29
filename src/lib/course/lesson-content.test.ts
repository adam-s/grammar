import assert from 'node:assert/strict';
import { test } from 'node:test';

import { FIXTURES } from '../grammar/fixtures.ts';
import { COURSE_LESSONS } from './course.ts';
import { LESSON_DOCS, citedSentenceIds, diagramScopes, lessonDoc } from './lesson-content.ts';

/* There are no length budgets here, on purpose. A cap cannot tell a complete
   answer from compressed filler, and every number this file has held — 350
   words of prose, 18 for a lede, 24 for a caption, 60 before the first figure —
   was a guess that edited the page to fit itself. What a page must do is
   answer, cite sentences that exist, and draw nothing it has not taught. Those
   are checked below; length is read, not counted. */
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

/* The contract's scope rule, as a check: a page may explain in any words it
   likes, and may not DRAW a label its reader has not been taught. Pruning is
   `targetReading`, the same function the practice scope uses. */
test('no diagram shows a label the lesson has not reached', () => {
  for (const doc of LESSON_DOCS) {
    const lesson = COURSE_LESSONS.find(({ id }) => id === doc.id)!;
    const scopes = diagramScopes(doc);
    const figures = doc.blocks.filter(
      (block) => block.kind === 'diagram' || block.kind === 'contrast' || block.kind === 'hero',
    );
    assert.ok(figures.length > 0, `${doc.id} has no diagram`);
    for (const { sentenceId, through } of scopes) {
      assert.equal(
        through,
        lesson.number,
        `${doc.id} draws ${sentenceId} at scope ${through ?? 'none'}, not ${lesson.number}`,
      );
    }
  }
});

test('lessons without authored prose report nothing rather than a placeholder', () => {
  assert.equal(lessonDoc('04-noun-phrases'), undefined);
});

test('a lesson page answers its title before it asks anything of the reader', () => {
  // The search-result test, as far as a machine can check it: the first prose
  // block comes before the first section heading, so a reader who arrived from
  // a search engine gets the answer rather than the course's running order.
  for (const doc of LESSON_DOCS) {
    const firstProse = doc.blocks.findIndex((block) => block.kind === 'prose');
    const firstSection = doc.blocks.findIndex((block) => block.kind === 'section');
    assert.ok(firstProse >= 0, `${doc.id} has no prose`);
    assert.ok(
      firstSection === -1 || firstProse < firstSection,
      `${doc.id} opens with a section heading instead of an answer`,
    );
  }
});
