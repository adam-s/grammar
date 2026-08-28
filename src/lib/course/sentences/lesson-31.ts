/**
 * Lesson 31 — Relative clauses.
 *
 * A postmodifier, the same job lesson 21 gave a prepositional phrase, done by
 * a clause instead. Its subject slot is empty and the noun it modifies is what
 * fills it, which is what the gap under *that* records.
 */
import { build, gap, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_31 = [
  constructed('c31-a', 31, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'inspector')]),
          n('VP', 'predicate', [
            w('V', 'head', 'questioned', { lemma: 'question', verbType: 'Vtr' }),
            n('NP', 'directObject', [
              w('Det', 'determiner', 'the'),
              n('Nom', 'head', [
                w('N', 'head', 'driver'),
                n(
                  'Cl',
                  'postmodifier',
                  [
                    w('Subord', 'marker', 'that'),
                    gap('NP', 'subject'),
                    n('VP', 'predicate', [
                      w('V', 'head', 'complained', { lemma: 'complain', verbType: 'Vint' }),
                    ]),
                  ],
                  { clauseKind: 'relative', clauseType: 'SV' },
                ),
              ]),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The inspector questioned the driver who had complained.',
      },
    ),
  ]),
];
