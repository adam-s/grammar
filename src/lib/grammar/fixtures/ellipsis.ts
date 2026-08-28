import { build, gap, n, pt, w } from '../build.ts';
import { sentence } from '../entry.ts';

/* --- verb-phrase ellipsis — She repaired the engine, and he will too.
 *
 * The second clause says *he will* and stops. There is no verb after *will*,
 * no object, and no confusion about what happened — the reader takes both from
 * the clause before it.
 *
 * That is the whole story about where an elided clause's verb type comes from:
 * it borrows one. `verbOfClause` follows the link, so *he will __* is a
 * transitive clause with no direct object in it, and `auditVerbType` stops
 * asking for one because the frame belongs to the clause it copied.
 *
 * An elision runs the other way from a filler-gap link. Nothing was moved out
 * of here; something was left unsaid because it had already been said. So the
 * index always exists — an elided phrase cannot be read without knowing what it
 * copies — and it always points backwards.
 */
export const vpEllipsis = sentence(
  'fix-vp-ellipsis',
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
              n('NP', 'subject', [w('Pron', 'head', 'She')]),
              n(
                'VP',
                'predicate',
                [
                  w('V', 'head', 'repaired', { lemma: 'repair', verbType: 'Vtr' }),
                  n('NP', 'directObject', [
                    w('Det', 'determiner', 'the'),
                    n('Nom', 'head', [w('N', 'head', 'engine')]),
                  ]),
                ],
                { index: 1 },
              ),
            ],
            { clauseKind: 'nominal', clauseType: 'SVO' },
          ),
          pt(','),
          w('Conj', 'coordinator', 'and'),
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Pron', 'head', 'he')]),
              n('VP', 'predicate', [
                w('Aux', 'auxiliary', 'will', { xpos: 'MD', auxKind: 'modal' }),
                gap('VP', 'head', { index: 1 }),
                n('AdvP', 'adverbial', [w('Adv', 'head', 'too')]),
              ]),
            ],
            { clauseKind: 'nominal', clauseType: 'SVO' },
          ),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She repaired the engine, and he is going to repair one as well.',
      },
    ),
  ],
  'r1',
);

/* ---- gapping — The PM arrived at six and the Queen at seven.
 *
 * The second clause keeps its subject and its adverbial and drops the verb out
 * of the middle. What is unsaid here is a single word, which is why an elided
 * gap may take a word form where a moved one may not: nothing was displaced,
 * so there is no phrase that went anywhere.
 *
 * The name is Ross's, and it is exact — the verb has been gapped out.
 */
export const gapping = sentence(
  'fix-gapping',
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
              n('NP', 'subject', [
                w('Det', 'determiner', 'The'),
                n('Nom', 'head', [w('N', 'head', 'PM', { xpos: 'NNP' })]),
              ]),
              n('VP', 'predicate', [
                w('V', 'head', 'arrived', { lemma: 'arrive', verbType: 'Vint', index: 1 }),
                n('PP', 'adverbial', [
                  w('P', 'head', 'at'),
                  n('NP', 'complement', [w('Num', 'head', 'six')]),
                ]),
              ]),
            ],
            { clauseKind: 'nominal', clauseType: 'SV' },
          ),
          w('Conj', 'coordinator', 'and'),
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [
                w('Det', 'determiner', 'the'),
                n('Nom', 'head', [w('N', 'head', 'Queen', { xpos: 'NNP' })]),
              ]),
              n('VP', 'predicate', [
                gap('V', 'head', { index: 1 }),
                n('PP', 'adverbial', [
                  w('P', 'head', 'at'),
                  n('NP', 'complement', [w('Num', 'head', 'seven')]),
                ]),
              ]),
            ],
            { clauseKind: 'nominal', clauseType: 'SV' },
          ),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The PM arrived at six and the Queen arrived at seven.',
      },
    ),
  ],
  'r1',
);

/* ---- sluicing — She repaired something, but I forgot what.
 *
 * The third family, and the biggest thing left unsaid: everything the clause
 * would have said, except the one word being asked about. *what __* is a whole
 * clause with a fronted phrase and nothing else.
 *
 * So the elided piece here is the predicate itself rather than its head, and
 * the clause borrows its verb one step further out than a verb-phrase ellipsis
 * does. Same link, bigger hole.
 *
 * *what* points at nothing. The gap it was fronted off is inside the material
 * that was never said, so there is nothing on the page to tie it to — which is
 * the honest answer and the reason nothing requires a fronted phrase to be
 * tied to anything.
 */
export const sluicing = sentence(
  'fix-sluicing',
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
              n('NP', 'subject', [w('Pron', 'head', 'She')]),
              n(
                'VP',
                'predicate',
                [
                  w('V', 'head', 'repaired', { lemma: 'repair', verbType: 'Vtr' }),
                  n('NP', 'directObject', [w('Pron', 'head', 'something')]),
                ],
                { index: 1 },
              ),
            ],
            { clauseKind: 'nominal', clauseType: 'SVO' },
          ),
          pt(','),
          w('Conj', 'coordinator', 'but'),
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Pron', 'head', 'I')]),
              n('VP', 'predicate', [
                w('V', 'head', 'forgot', { lemma: 'forget', verbType: 'Vtr' }),
                n(
                  'Cl',
                  'directObject',
                  [
                    n('NP', 'prenucleus', [w('Pron', 'head', 'what', { xpos: 'WP' })]),
                    gap('VP', 'predicate', { index: 1 }),
                  ],
                  { clauseKind: 'interrogative', clauseType: 'SVO' },
                ),
              ]),
            ],
            { clauseKind: 'nominal', clauseType: 'SVO' },
          ),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She repaired a thing, and the speaker has forgotten which thing.',
      },
    ),
  ],
  'r1',
);

/* --- stripping — She repaired the engine, and the car too.
 *
 * The fourth. Everything goes but one phrase and the word marking it as an
 * addition — no subject, no verb, just *the car too* leaning on the clause
 * before it.
 *
 * A clause with no subject at all, which nothing in the model ever required.
 * The verb is elided the way gapping elides it, and the slots come with it, so
 * *the car* is licensed as an object by a verb that is not there.
 */
export const stripping = sentence(
  'fix-stripping',
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
              n('NP', 'subject', [w('Pron', 'head', 'She')]),
              n('VP', 'predicate', [
                w('V', 'head', 'repaired', { lemma: 'repair', verbType: 'Vtr', index: 1 }),
                n('NP', 'directObject', [
                  w('Det', 'determiner', 'the'),
                  n('Nom', 'head', [w('N', 'head', 'engine')]),
                ]),
              ]),
            ],
            { clauseKind: 'nominal', clauseType: 'SVO' },
          ),
          pt(','),
          w('Conj', 'coordinator', 'and'),
          n(
            'Cl',
            'coordinate',
            [
              n('VP', 'predicate', [
                gap('V', 'head', { index: 1 }),
                n('NP', 'directObject', [
                  w('Det', 'determiner', 'the'),
                  n('Nom', 'head', [w('N', 'head', 'car')]),
                ]),
                n('AdvP', 'adverbial', [w('Adv', 'head', 'too')]),
              ]),
            ],
            { clauseKind: 'nominal', clauseType: 'SVO' },
          ),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She repaired the engine and she repaired the car as well.',
      },
    ),
  ],
  'r1',
);
