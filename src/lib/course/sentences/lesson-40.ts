/**
 * Lesson 40 — Final synthesis.
 *
 * One sentence that needs most of the course: a relative clause postmodifying
 * the subject, a required place adverbial, and a nominal clause in the object
 * slot. No new idea — the same first question, asked four times.
 */
import { build, gap, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_40 = [
  constructed('c40-a', 40, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'inspector'),
              n(
                'Cl',
                'postmodifier',
                [
                  w('Subord', 'marker', 'who'),
                  gap('NP', 'subject'),
                  n('VP', 'predicate', [
                    w('V', 'head', 'arrived', { lemma: 'arrive', verbType: 'Vint' }),
                    n('AdvP', 'adverbial', [w('Adv', 'head', 'late')]),
                  ]),
                ],
                { clauseKind: 'relative', clauseType: 'SV' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'reported', { lemma: 'report', verbType: 'Vtr' }),
            n(
              'Cl',
              'directObject',
              [
                w('Subord', 'marker', 'that'),
                n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'wiring')]),
                n('VP', 'predicate', [
                  w('V', 'head', 'was', { lemma: 'be', verbType: 'Vbe' }),
                  n('AdjP', 'subjectComplement', [w('Adj', 'head', 'unsafe')]),
                ]),
              ],
              { clauseKind: 'nominal', clauseType: 'SVC' },
            ),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The late-arriving inspector said the wiring was unsafe.',
      },
    ),
  ]),
];
