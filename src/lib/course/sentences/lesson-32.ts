/**
 * Lesson 32 — Comparative clauses.
 *
 * *than* introduces a comparison, and the clause after it is missing the very
 * thing being compared: *we expected* has an object slot with nothing in it.
 * The empty slot and the phrase it answers to are tied together, which is what
 * makes this a comparison rather than two unrelated statements.
 */
import { build, gap, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_32 = [
  constructed('c32-a', 32, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'bill')]),
          n('VP', 'predicate', [
            w('V', 'head', 'was', { lemma: 'be', verbType: 'Vbe' }),
            n('AdjP', 'subjectComplement', [w('Adj', 'head', 'larger')], { index: 1 }),
          ]),
          n(
            'Cl',
            'postnucleus',
            [
              w('Subord', 'marker', 'than'),
              n('NP', 'subject', [w('Pron', 'head', 'we')]),
              n('VP', 'predicate', [
                w('V', 'head', 'expected', { lemma: 'expect', verbType: 'Vtr' }),
                gap('NP', 'directObject'),
              ]),
            ],
            { clauseKind: 'comparative', clauseType: 'SVO', index: 1 },
          ),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The bill came to more than we had expected.' },
    ),
  ]),
];
