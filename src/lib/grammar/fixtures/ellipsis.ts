import { build, gap, n, pt, w } from '../build.ts';
import { sentence } from './sentence.ts';

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
  ['Vtr', 'ellipsis', 'vp-ellipsis', 'coordination', 'two-clause'],
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
  ['Vint', 'ellipsis', 'gapping', 'coordination', 'two-clause'],
);
