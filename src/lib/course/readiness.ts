/**
 * Whether the course is fit to grade anybody.
 *
 * The audits prove a tree is well formed. The replay proves it is reachable.
 * The consistency checks prove the corpus draws one construction one way. None
 * of them can prove that the attachment is the right attachment, that the verb
 * type is the right verb type, or that the paraphrase says what the sentence
 * means — and the history is unambiguous about the gap: reading found content
 * errors after thousands of tests had passed.
 *
 * That matters more here than in a corpus that is only displayed. These
 * readings GRADE. A wrong parse turns a learner's correct analysis into a
 * refusal and then teaches them the stored mistake as the answer.
 *
 * So sign-off is a named person on a dated sentence, and it is not something a
 * test can award itself. This module only reports; `scripts/course-readiness.mjs`
 * is what turns the report into a gate.
 */
import type { SentenceEntry } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';

/** The value `constructed.ts` writes until a person has actually read one. */
export const UNREVIEWED = 'unreviewed';

/** Has a named person put their name to this parse and its glosses? */
export function isReviewed(sentence: SentenceEntry): boolean {
  const { reviewedBy, reviewedAt } = sentence.provenance;
  return (
    reviewedBy.trim().length > 0 &&
    reviewedBy !== UNREVIEWED &&
    /^\d{4}-\d{2}-\d{2}$/.test(reviewedAt)
  );
}

export interface ReviewStatus {
  total: number;
  reviewed: number;
  /** Sentence ids nobody has signed for, in lesson order. */
  outstanding: string[];
  /** Who has signed for what, for a report that names names. */
  reviewers: Map<string, number>;
}

export function reviewStatus(lessons = COURSE_LESSONS): ReviewStatus {
  const outstanding: string[] = [];
  const reviewers = new Map<string, number>();
  let total = 0;
  let reviewed = 0;
  for (const lesson of lessons) {
    for (const sentence of lesson.sentences) {
      total += 1;
      if (isReviewed(sentence)) {
        reviewed += 1;
        const who = sentence.provenance.reviewedBy;
        reviewers.set(who, (reviewers.get(who) ?? 0) + 1);
      } else {
        outstanding.push(sentence.id);
      }
    }
  }
  return { total, reviewed, outstanding, reviewers };
}

/**
 * May this course be used to assess somebody?
 *
 * Only when every reading a learner can be graded against has been read by a
 * person. There is no partial credit here: one wrong parse in four hundred is
 * one learner told they are wrong when they are right.
 */
export const isAssessmentReady = (lessons = COURSE_LESSONS): boolean =>
  reviewStatus(lessons).outstanding.length === 0;
