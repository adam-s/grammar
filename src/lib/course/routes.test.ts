import assert from 'node:assert/strict';
import test from 'node:test';

import { COURSE_LESSONS } from './course.ts';
import { lessonHref } from './routes.ts';

test('every lesson has a stable, distinct route', () => {
  const hrefs = COURSE_LESSONS.map((lesson) => lessonHref(lesson.id));

  assert.equal(new Set(hrefs).size, COURSE_LESSONS.length);
  assert.deepEqual(hrefs, ['/lessons/01-introduction', '/lessons/02-sentence-frame']);
});

test('lesson route segments are URL-safe', () => {
  assert.equal(lessonHref('a lesson/with spaces'), '/lessons/a%20lesson%2Fwith%20spaces');
});
