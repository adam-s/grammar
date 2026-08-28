import assert from 'node:assert/strict';
import test from 'node:test';

import { COURSE_LESSONS } from './course.ts';
import { lessonHref } from './routes.ts';

test('every lesson has a stable, distinct route', () => {
  const hrefs = COURSE_LESSONS.map((lesson) => lessonHref(lesson.id));

  assert.equal(new Set(hrefs).size, COURSE_LESSONS.length);
  // The shape, not a second copy of the running order. Listing the hrefs here
  // meant every new lesson broke a test that was checking nothing.
  for (const lesson of COURSE_LESSONS) {
    assert.equal(lessonHref(lesson.id), `/lessons/${lesson.id}`);
  }
});

test('lesson route segments are URL-safe', () => {
  assert.equal(lessonHref('a lesson/with spaces'), '/lessons/a%20lesson%2Fwith%20spaces');
});
