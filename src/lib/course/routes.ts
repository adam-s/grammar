const LESSON_ROUTE = '/lessons';

/** The canonical app URL for a lesson. SvelteKit owns the navigation itself. */
export function lessonHref(lessonId: string): string {
  return `${LESSON_ROUTE}/${encodeURIComponent(lessonId)}`;
}
