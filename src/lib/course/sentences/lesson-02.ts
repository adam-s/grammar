/** Lesson 2 — A sentence has two parts. The same frame, unaided, on a subject
    that is plainly several words. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_02 = [
  constructed('c02-a', 2, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [w('Adj', 'premodifier', 'old'), w('N', 'head', 'clock')]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'stopped', { lemma: 'stop', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The old clock stopped running.' },
    ),
  ]),
];
