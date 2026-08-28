/**
 * Lesson 34 — Infinitive clauses.
 *
 * *to leave* has a verb and no tense: you cannot change it to *left* without
 * breaking the sentence. The *to* marks the clause rather than belonging to
 * the verb, which is what separates it from lesson 25's particle.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_34 = [
  constructed('c34-a', 34, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'tenant')]),
          n('VP', 'predicate', [
            w('V', 'head', 'wanted', { lemma: 'want', verbType: 'Vtr' }),
            n(
              'Cl',
              'directObject',
              [
                w('Part', 'marker', 'to', { partKind: 'infinitival' }),
                n('VP', 'predicate', [
                  w('V', 'head', 'renew', { lemma: 'renew', verbType: 'Vtr' }),
                  n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'lease')]),
                ]),
              ],
              { clauseKind: 'nominal', finiteness: 'infinitival', clauseType: 'SVO' },
            ),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'What the tenant wanted was to renew the lease.' },
    ),
  ]),
];
