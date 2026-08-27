import assert from 'node:assert/strict';
import test from 'node:test';
import { FIXTURES } from '../grammar/fixtures.ts';
import { COURSE_LESSONS, COURSE_STAGES } from './course.ts';

test('course lessons have stable order, concise copy, and valid sentences', () => {
  const sentenceIds = new Set(FIXTURES.map((sentence) => sentence.id));
  const lessonIds = new Set<string>();

  assert.ok(COURSE_STAGES.length > 0);
  for (const [index, lesson] of COURSE_LESSONS.entries()) {
    assert.equal(lesson.number, index + 1);
    assert.ok(!lessonIds.has(lesson.id));
    lessonIds.add(lesson.id);
    assert.ok(lesson.title.split(/\s+/).length <= 5);
    for (const sentenceId of lesson.sentenceIds) assert.ok(sentenceIds.has(sentenceId));
  }
});
