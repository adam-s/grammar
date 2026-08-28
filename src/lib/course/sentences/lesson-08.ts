/** Lesson 8 — Verbs that stand alone. The verb that leaves no question open. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_08 = [
  constructed('c08-a', 8, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'lights')]),
          n('VP', 'predicate', [
            w('V', 'head', 'flickered', { lemma: 'flicker', verbType: 'Vint' }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The lights went on and off.' },
    ),
  ]),
];
