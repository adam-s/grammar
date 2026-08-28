/**
 * Lesson 22 — Appositives. A second noun phrase naming the same thing.
 *
 * *a banker* renames *the treasurer* — the whole phrase, determiner included —
 * so it sits inside the noun phrase beside the material it renames rather than
 * under the noun alone. The commas are evidence for that reading and not the
 * reason for it.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_22 = [
  constructed('c22-a', 22, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            w('N', 'head', 'treasurer'),
            pt(','),
            n('NP', 'appositive', [w('Det', 'determiner', 'a'), w('N', 'head', 'banker')]),
            pt(','),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'resigned', { lemma: 'resign', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The treasurer, who was a banker, left the post.' },
    ),
  ]),
];
