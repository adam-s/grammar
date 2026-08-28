/** Lesson 7 — Pronouns. One word standing in for a whole noun phrase. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_07 = [
  constructed('c07-a', 7, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'hesitated', { lemma: 'hesitate', verbType: 'Vint' }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She paused before acting.' },
    ),
  ]),
];
