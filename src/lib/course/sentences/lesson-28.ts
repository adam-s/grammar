/**
 * Lesson 28 — Main and dependent clauses.
 *
 * *the engine stalled* is a whole sentence by shape and is not the sentence
 * here: it is what she knew. A clause can sit inside another clause and take a
 * job there, the same way a noun phrase does.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_28 = [
  constructed('c28-a', 28, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'knew', { lemma: 'know', verbType: 'Vtr' }),
            n(
              'Cl',
              'directObject',
              [
                n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'belt')]),
                n('VP', 'predicate', [
                  w('V', 'head', 'broke', { lemma: 'break', verbType: 'Vint' }),
                ]),
              ],
              { clauseKind: 'nominal', clauseType: 'SV' },
            ),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She was aware that the belt had broken.' },
    ),
  ]),
];
