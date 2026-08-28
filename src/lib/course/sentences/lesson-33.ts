/**
 * Lesson 33 — Coordination between clauses.
 *
 * The same joining lesson 26 did inside a noun phrase, done to whole clauses.
 * The outer sentence joins rather than predicates: it has no verb of its own,
 * and each clause inside answers for itself.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_33 = [
  constructed('c33-a', 33, [
    build(
      n(
        'S',
        null,
        [
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'kettle')]),
              n('VP', 'predicate', [w('V', 'head', 'boiled', { lemma: 'boil', verbType: 'Vint' })]),
            ],
            { clauseType: 'SV' },
          ),
          w('Conj', 'coordinator', 'and'),
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'lights')]),
              n('VP', 'predicate', [w('V', 'head', 'dimmed', { lemma: 'dim', verbType: 'Vint' })]),
            ],
            { clauseType: 'SV' },
          ),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Both things happened.' },
    ),
  ]),
];
