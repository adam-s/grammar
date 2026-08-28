/** Lesson 1 — Introduction. The frame, found with guidance. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_01 = [
  constructed('c01-a', 1, [
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
  ]),
];
