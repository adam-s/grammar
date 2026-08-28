/** Lesson 3 — Find the main verb. The word at the centre of the predicate, and
    the job it does there. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_03 = [
  constructed('c03-a', 3, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'visitors')]),
          n('VP', 'predicate', [w('V', 'head', 'waited', { lemma: 'wait', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The visitors stayed where they were.' },
    ),
  ]),
];
