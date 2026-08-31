import { redirect } from '@sveltejs/kit';

import { COURSE_LESSONS, lessonHref } from '$lib/course';

export function load() {
  // Relative on purpose: the prerendered redirect page carries this URL
  // verbatim, and the site lives under a subpath (adamsohn.com/grammar/) an
  // absolute /lessons/… would escape.
  redirect(307, `.${lessonHref(COURSE_LESSONS[0]!.id)}/`);
}
