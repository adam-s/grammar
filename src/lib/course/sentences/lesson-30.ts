/**
 * Lesson 30 — Nominal clauses. A clause filling a noun-shaped slot.
 *
 * Nothing new is named. What is new is where the clause sits: lesson 28 put
 * one in the object slot, and this one is the SUBJECT — so the *it* test from
 * lesson 4 works on it, which is the evidence that it is doing a noun's job.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_30 = [
  constructed('c30-a', 30, [
    build(
      n(
        'S',
        null,
        [
          n(
            'Cl',
            'subject',
            [
              w('Subord', 'marker', 'That'),
              n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'belt')]),
              n('VP', 'predicate', [w('V', 'head', 'broke', { lemma: 'break', verbType: 'Vint' })]),
            ],
            { clauseKind: 'nominal', clauseType: 'SV' },
          ),
          n('VP', 'predicate', [
            w('V', 'head', 'surprised', { lemma: 'surprise', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'driver')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The driver was surprised that the belt had broken.',
      },
    ),
  ]),
];
