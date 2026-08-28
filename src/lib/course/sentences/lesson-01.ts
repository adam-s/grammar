/**
 * Lesson 1 — Introduction. The frame, with guidance.
 *
 * Constructed rather than quoted. Lessons 1–15 need ten clean examples of one
 * pattern each, and literature does not supply that on demand; the sentences
 * here say so in their `source`.
 *
 * Every sentence carries its FULL parse, including labels this lesson has not
 * taught. What the lesson asks for is derived from it by `targetReading` — so
 * there is never a second, staler copy of the answer to keep in step.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { sentence } from '../../grammar/entry.ts';

const CONSTRUCTED = { work: 'constructed', locator: 'lesson 1 — the sentence frame' };
/** No human has read these parses. The field says so rather than a paragraph. */
const UNREVIEWED = { reviewedBy: 'unreviewed', reviewedAt: '2026-08-28' };

export const l01a = sentence(
  'c01-a',
  'lesson 1',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'kettle')]),
          n('VP', 'predicate', [w('V', 'head', 'boiled', { lemma: 'boil', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The kettle came to the boil.' },
    ),
  ],
  'r1',
  CONSTRUCTED,
  UNREVIEWED,
);

export const LESSON_01 = [l01a];
