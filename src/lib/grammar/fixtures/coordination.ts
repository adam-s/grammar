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

/* ------------- coordinated adjectives — Our calm and patient guide explained.
 *
 * Every coordination in either corpus joined two noun phrases, and all ten of
 * lesson 26's sat in subject position — so the lesson showed one of the many
 * things coordination joins, in one of the places it can sit.
 *
 * Only like joins to like, which is why coordination is itself a constituency
 * test. Two adjective phrases join and the result is an adjective phrase, doing
 * the premodifier's job that either would have done alone.
 */
export const coordinatedAdjectives = sentence(
  'fix-coordinated-adjectives',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'Our'),
            n('Nom', 'head', [
              n('AdjP', 'premodifier', [
                n('AdjP', 'coordinate', [w('Adj', 'head', 'calm')]),
                w('Conj', 'coordinator', 'and'),
                n('AdjP', 'coordinate', [w('Adj', 'head', 'patient')]),
              ]),
              w('N', 'head', 'guide'),
            ]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'explained', { lemma: 'explain', verbType: 'Vint' }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Our guide, who is both calm and patient, set it out.',
      },
    ),
  ],
  'r1',
);

/* ------------- coordinated prepositional phrases — We walked through the gate
 * and across the field.
 *
 * The same rule one form over. Two prepositional phrases join and the result is
 * a prepositional phrase, filling the one adverbial slot that either would have
 * filled alone — which is the evidence that the pair is a single constituent
 * rather than two adverbials in a row.
 */
export const coordinatedPhrases = sentence(
  'fix-coordinated-phrases',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'We')]),
          n('VP', 'predicate', [
            w('V', 'head', 'walked', { lemma: 'walk', verbType: 'Vint' }),
            n('PP', 'adverbial', [
              n('PP', 'coordinate', [
                w('P', 'head', 'through'),
                n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'gate')]),
              ]),
              w('Conj', 'coordinator', 'and'),
              n('PP', 'coordinate', [
                w('P', 'head', 'across'),
                n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'field')]),
              ]),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'We went on foot past the gate and over the field.' },
    ),
  ],
  'r1',
);

/* ------------- a coordination inside the nominal — the old men and women.
 *
 * Coordination one layer below the noun phrase, which is what makes the scope
 * of a premodifier a real question. If *old* sits inside the first coordinate
 * it reaches only *men*; if it sits above the pair it reaches both.
 *
 * Only the second is drawn here. The first needs no new shape — it is an
 * ordinary premodifier inside an ordinary coordinate — and the two together are
 * the ambiguity lesson 27 was missing, having had ten sentences of one type.
 */
export const coordinatedNominal = sentence(
  'fix-coordinated-nominal',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'They')]),
          n('VP', 'predicate', [
            w('V', 'head', 'met', { lemma: 'meet', verbType: 'Vtr' }),
            n('NP', 'directObject', [
              w('Det', 'determiner', 'the'),
              n('Nom', 'head', [
                w('Adj', 'premodifier', 'old'),
                n('Nom', 'head', [
                  n('Nom', 'coordinate', [w('N', 'head', 'men')]),
                  w('Conj', 'coordinator', 'and'),
                  n('Nom', 'coordinate', [w('N', 'head', 'women')]),
                ]),
              ]),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'They met people who were old, both men and women.' },
    ),
  ],
  'r1',
);
