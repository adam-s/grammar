/** Lesson 5 — Find the head. The one word the phrase is named after. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_05 = [
  constructed('c05-a', 5, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'river')]),
          n('VP', 'predicate', [w('V', 'head', 'froze', { lemma: 'freeze', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The river turned to ice.' },
    ),
  ]),
];
