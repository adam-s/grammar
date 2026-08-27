import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

import { COURSE_LESSONS } from '$lib/course';

export const entries: EntryGenerator = () =>
  COURSE_LESSONS.map((lesson) => ({ lessonId: lesson.id }));

export const load: PageLoad = ({ params }) => {
  const lesson = COURSE_LESSONS.find(({ id }) => id === params.lessonId);
  if (!lesson) error(404, 'Lesson not found');

  return { lessonId: lesson.id };
};
