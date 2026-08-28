/**
 * Lesson 39 — Punctuation is evidence.
 *
 * The comma is a reason to try a reading, not the reading itself. Here it
 * separates two coordinated clauses, and the tree is what says so: the comma
 * takes no label and joins nothing.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_39 = [
  constructed('c39-a', 39, [
    build(
      n(
        'S',
        null,
        [
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'surveyor')]),
              n('VP', 'predicate', [
                w('V', 'head', 'measured', { lemma: 'measure', verbType: 'Vtr' }),
                n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'field')]),
              ]),
            ],
            { clauseType: 'SVO' },
          ),
          pt(','),
          w('Conj', 'coordinator', 'and'),
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'clerk')]),
              n('VP', 'predicate', [
                w('V', 'head', 'recorded', { lemma: 'record', verbType: 'Vtr' }),
                n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'result')]),
              ]),
            ],
            { clauseType: 'SVO' },
          ),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Two people each did a job.' },
    ),
  ]),
];
