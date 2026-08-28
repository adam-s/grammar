/**
 * Lesson 36 — Gerund clauses.
 *
 * *Renewing the lease* fills the subject slot, so the *it* test works on it —
 * and its verb still has no tense. A clause can do a noun's job without
 * looking anything like a noun.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_36 = [
  constructed('c36-a', 36, [
    build(
      n(
        'S',
        null,
        [
          n(
            'Cl',
            'subject',
            [
              n('VP', 'predicate', [
                w('V', 'head', 'Renewing', { lemma: 'renew', verbType: 'Vtr' }),
                n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'lease')]),
              ]),
            ],
            { clauseKind: 'nominal', finiteness: 'gerund-participial', clauseType: 'SVO' },
          ),
          n('VP', 'predicate', [
            w('V', 'head', 'took', { lemma: 'take', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'a'), w('N', 'head', 'month')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'It took a month to renew the lease.' },
    ),
  ]),
];
