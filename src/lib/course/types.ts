import type { ChapterScope } from '../grammar/options.ts';
import type { SentenceEntry } from '../grammar/types.ts';

/**
 * The labels a lesson is the FIRST to teach.
 *
 * Same shape as the palette's scope, so the two can never drift apart: what a
 * lesson claims to teach is exactly what the palette will let a learner pick.
 * An absent list means "this lesson adds nothing on that axis", which is a
 * different thing from `ChapterScope`'s absent list — there it means
 * "everything". `scopeThrough` is what turns one into the other.
 */
export type Teaches = ChapterScope;

export type CourseLesson = {
  id: string;
  number: number;
  stage: string;
  title: string;
  teaches: Teaches;
  /**
   * The sentences assigned to this lesson, by value.
   *
   * Held directly rather than by id. A list of ids needs a lookup somewhere,
   * and a lookup can miss — the route used to do `FIXTURES.find(...)!` and
   * trust the bang.
   */
  sentences: SentenceEntry[];
};

export type CourseStage = {
  id: string;
  title: string;
  lessons: CourseLesson[];
};
