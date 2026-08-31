import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

import { COURSE_LESSONS, lessonHref } from '$lib/course';
import { site } from '$lib/site';

export function load() {
  // The prerendered redirect page carries this URL verbatim, and the edge
  // serves /grammar (no trailing slash) without canonicalizing it — so a
  // relative target resolves against the parent site and escapes. Absolute
  // in the build; relative only in dev, where the app is served at the root.
  const path = `${lessonHref(COURSE_LESSONS[0]!.id)}/`;
  redirect(307, dev ? `.${path}` : `${site.origin}${path}`);
}
