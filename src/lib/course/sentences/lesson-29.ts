/**
 * Lesson 29 — Adverbial clauses.
 *
 * *because* announces the job before the clause arrives: it marks it, and is
 * not one of the parts the clause is built from.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_29 = [
  constructed('c29-a', 29, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'ferry')]),
          n('VP', 'predicate', [
            w('V', 'head', 'waited', { lemma: 'wait', verbType: 'Vint' }),
            n(
              'Cl',
              'adverbial',
              [
                w('Subord', 'marker', 'because'),
                n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'tide')]),
                n('VP', 'predicate', [
                  w('V', 'head', 'turned', { lemma: 'turn', verbType: 'Vint' }),
                ]),
              ],
              { clauseKind: 'adverbial', clauseType: 'SV' },
            ),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'A turning tide is why the ferry waited.' },
    ),
  ]),
];
