import assert from 'node:assert/strict';
import test from 'node:test';
import { COURSE_LESSONS, COURSE_STAGES } from './course.ts';
import { scopeThrough, type FullScope } from './scope.ts';

const AXES: (keyof FullScope)[] = ['forms', 'functions', 'verbTypes', 'clauseKinds'];

test('course lessons have stable order, concise copy, and distinct sentences', () => {
  const lessonIds = new Set<string>();
  const sentenceIds = new Set<string>();

  assert.ok(COURSE_STAGES.length > 0);
  for (const [index, lesson] of COURSE_LESSONS.entries()) {
    assert.equal(lesson.number, index + 1);
    assert.ok(!lessonIds.has(lesson.id));
    lessonIds.add(lesson.id);
    assert.ok(lesson.title.split(/\s+/).length <= 5);
    for (const sentence of lesson.sentences) {
      assert.ok(!sentenceIds.has(sentence.id), `${sentence.id} is assigned to two lessons`);
      sentenceIds.add(sentence.id);
    }
  }
});

/**
 * `teaches` means FIRST taught. A label claimed by two lessons has no first
 * lesson, so the scope ladder built from it would be a guess.
 */
test('no label is introduced twice', () => {
  for (const axis of AXES) {
    const seen = new Map<string, string>();
    for (const lesson of COURSE_LESSONS) {
      for (const label of lesson.teaches[axis] ?? []) {
        const earlier = seen.get(label);
        assert.equal(earlier, undefined, `${axis} "${label}": lesson ${earlier} and ${lesson.id}`);
        seen.set(label, lesson.id);
      }
    }
  }
});

test('scope only ever grows, and lesson one already teaches something', () => {
  let previous = 0;
  for (const lesson of COURSE_LESSONS) {
    const scope = scopeThrough(COURSE_LESSONS, lesson.number);
    const size = AXES.reduce((n, axis) => n + scope[axis].length, 0);
    assert.ok(size >= previous, `${lesson.id} narrowed the scope`);
    previous = size;
  }
  assert.ok(previous > 0);
  assert.ok(scopeThrough(COURSE_LESSONS, 1).forms.length > 0, 'lesson 1 must be buildable');
});
