import type { SentenceEntry } from '../grammar/types.ts';

/**
 * The decisions a lesson is the FIRST to teach, written the way the palette
 * writes them: `form:NP`, `func:subject`, `vt:Vtr`, `fin:infinitival`.
 *
 * The same strings the learner's clicks produce, so what a lesson claims to
 * teach and what the palette will accept cannot drift apart. Empty means the
 * lesson adds a test rather than a term, which is a real kind of lesson.
 */
export type Teaches = readonly string[];

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
