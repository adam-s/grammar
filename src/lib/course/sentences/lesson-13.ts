/** Lesson 13 — Naming the object. The last phrase describes the OBJECT, not the
    subject: the difference lesson 10 set up. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_13 = [
  constructed('c13-a', 13, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'jury')]),
          n('VP', 'predicate', [
            w('V', 'head', 'found', { lemma: 'find', verbType: 'Vc' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'driver')]),
            n('AdjP', 'objectComplement', [w('Adj', 'head', 'careless')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVOC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The jury decided the driver had been careless.' },
    ),
  ]),
];
