import { redirect } from '@sveltejs/kit';

import { COURSE_LESSONS, lessonHref } from '$lib/course';

export function load() {
  redirect(307, lessonHref(COURSE_LESSONS[0]!.id));
}
