/**
 * Where a learner goes after finishing a sentence.
 *
 * The next sentence in the lesson they have not finished, looking forward
 * first and then wrapping to any they skipped. When the whole lesson is done,
 * the next lesson's page, so its explanation comes before its practice. At
 * the end of the course, nowhere: the card says they finished and offers no
 * button that would lead back to where they already are.
 */
import type { CourseLesson } from './types.ts';

export type NextStep =
  | { kind: 'sentence'; id: string; text: string }
  | { kind: 'lesson'; id: string; title: string }
  | null;

export function nextStep(
  lessons: readonly CourseLesson[],
  lessonId: string,
  sentenceId: string,
  finished: ReadonlySet<string>,
): NextStep {
  const at = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessons[at];
  if (!lesson) return null;
  const here = lesson.sentences.findIndex((s) => s.id === sentenceId);
  const order = [
    ...lesson.sentences.slice(here + 1),
    ...lesson.sentences.slice(0, Math.max(0, here)),
  ];
  const open = order.find((s) => s.id !== sentenceId && !finished.has(s.id));
  if (open) return { kind: 'sentence', id: open.id, text: open.text };
  const after = lessons[at + 1];
  return after ? { kind: 'lesson', id: after.id, title: after.title } : null;
}
