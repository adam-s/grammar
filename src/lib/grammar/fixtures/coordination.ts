import { build, n, pt, w } from '../build.ts';
import { sentence } from '../entry.ts';

/* ---------------- coordination — The engine stalled and the car stopped.
 *
 * One sentence made of two. The outer `S` joins rather than predicates, so it
 * has no verb of its own and is not asked what kind it has; each clause inside
 * answers for itself.
 *
 * *and* is the coordinator: it does the joining, and is not one of the things
 * joined. Labelling it a coordinate alongside them said this sentence had three
 * parts where it has two.
 */
export const coordination = sentence(
  'fix-coordination',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'engine')]),
              n('VP', 'predicate', [
                w('V', 'head', 'stalled', { lemma: 'stall', verbType: 'Vint' }),
              ]),
            ],
            { clauseType: 'SV' },
          ),
          w('Conj', 'coordinator', 'and'),
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'car')]),
              n('VP', 'predicate', [
                w('V', 'head', 'stopped', { lemma: 'stop', verbType: 'Vint' }),
              ]),
            ],
            { clauseType: 'SV' },
          ),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Both things happened.',
      },
    ),
  ],
  'r1',
);

/* ---------- a coordinated subject — The cat and the dog ran.
 *
 * Joining is not confined to clauses, and a joined noun phrase has no head:
 * neither *the cat* nor *the dog* is the one the phrase is named after. That is
 * the same reason a joined clause is not asked what kind of verb it has, and
 * `auditHead` now excuses a join for it.
 */
export const coordinatedSubject = sentence(
  'fix-coordinated-subject',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            n('NP', 'coordinate', [w('Det', 'determiner', 'The'), w('N', 'head', 'cat')]),
            w('Conj', 'coordinator', 'and'),
            n('NP', 'coordinate', [w('Det', 'determiner', 'the'), w('N', 'head', 'dog')]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'ran', { lemma: 'run', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Both animals ran.',
      },
    ),
  ],
  'r1',
);
