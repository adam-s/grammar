import { build, gap, n, pt, w } from '../build.ts';
import { sentence } from '../entry.ts';

/* ------- a fronted phrase and its gap — He knew what she repaired.
 *
 * The other way a gap is filled. *repaired* is transitive and there is no noun
 * phrase after it; the thing repaired is named at the front of its clause
 * instead. Here the filler IS in the sentence, so the gap and the phrase are
 * tied by an index — one thing, said once, in a place the grammar does not
 * usually put it.
 *
 * An embedded question rather than a direct one, and deliberately. *What did
 * she repair?* moves the auxiliary as well, which is `fix-question` below.
 * This fixture tests the filler and the gap, and nothing else.
 */
export const frontedPhrase = sentence(
  'fix-fronted-phrase',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'He')]),
          n('VP', 'predicate', [
            w('V', 'head', 'knew', { lemma: 'know', verbType: 'Vtr' }),
            n(
              'Cl',
              'directObject',
              [
                n('NP', 'prenucleus', [w('Pron', 'head', 'what', { xpos: 'WP' })], { index: 1 }),
                n('NP', 'subject', [w('Pron', 'head', 'she')]),
                n('VP', 'predicate', [
                  w('V', 'head', 'repaired', { lemma: 'repair', verbType: 'Vtr' }),
                  gap('NP', 'directObject', { index: 1 }),
                ]),
              ],
              { clauseKind: 'interrogative', clauseType: 'SVO' },
            ),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'He knew which thing she had repaired.',
      },
    ),
  ],
  'r1',
);

/* ------------- a question — What did the mechanic repair?
 *
 * Two moves in one sentence, and neither needs a discontinuous node.
 *
 * *What* is fronted and ties to the empty object slot after *repair*, the same
 * as in the embedded version. *did* has moved too, in front of the subject —
 * so it hangs off the clause rather than off the verb phrase it helps. That is
 * the whole of what subject-auxiliary inversion is, and writing the auxiliary
 * where it is actually said says it.
 *
 * An earlier draft of docs/model-gaps.md had this filed under discontinuity.
 * Nothing here is split, and — as `fix-tail-clause` below shows — neither is
 * the extraposed relative that was supposed to be the case that needed it.
 */
export const question = sentence(
  'fix-question',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'prenucleus', [w('Pron', 'head', 'What', { xpos: 'WP' })], { index: 1 }),
          w('Aux', 'auxiliary', 'did', { xpos: 'VBD', lemma: 'do', auxKind: 'do' }),
          n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'mechanic')]),
          n('VP', 'predicate', [
            w('V', 'head', 'repair', { xpos: 'VB', lemma: 'repair', verbType: 'Vtr' }),
            gap('NP', 'directObject', { index: 1 }),
          ]),
          pt('?'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The question asks which thing the mechanic repaired.',
      },
    ),
  ],
  'r1',
);

/* ------- extraposition — It is a good thing that we left.
 *
 * English dislikes a long subject in front of a short verb, so it says *it*
 * where the subject goes and puts the content at the end. Neither half stands
 * alone: *It is a good thing* leaves you asking what *it* was, and *that we
 * left is a good thing* is the same sentence unmoved.
 *
 * So the two are a pair, and the audit holds them to it — a placeholder with
 * nothing at the end, or content at the end with nothing holding its place, is
 * half a claim.
 */
export const extraposition = sentence(
  'fix-extraposition',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'placeholderSubject', [w('Pron', 'head', 'It')]),
          n('VP', 'predicate', [
            w('V', 'head', 'is', { xpos: 'VBZ', lemma: 'be', verbType: 'Vbe' }),
            n('NP', 'subjectComplement', [
              w('Det', 'determiner', 'a'),
              n('Nom', 'head', [w('Adj', 'premodifier', 'good'), w('N', 'head', 'thing')]),
            ]),
          ]),
          n(
            'Cl',
            'extraposed',
            [
              w('Subord', 'marker', 'that'),
              n('NP', 'subject', [w('Pron', 'head', 'we')]),
              n('VP', 'predicate', [w('V', 'head', 'left', { lemma: 'leave', verbType: 'Vint' })]),
            ],
            { clauseKind: 'nominal', clauseType: 'SV' },
          ),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'That we left is a good thing.',
      },
    ),
  ],
  'r1',
);

/* -------- extraposition from a noun phrase — A man came in who I knew.
 *
 * The sentence this project spent a night believing needed a node whose pieces
 * are apart. *who I knew* modifies *a man*, and three words sit between them.
 *
 * It does not need one. English moves heavy material to the end rather than
 * leaving it in the middle, so the relative clause is written where it is said
 * — in the tail position — with a link back to what it belongs to. The diagram
 * says both things at once and every node stays a run of words.
 *
 * Two links, and they are different. The clause is tied to *a man*, which is
 * what it modifies. Inside it, the gap after *knew* is tied to *who*, which is
 * the ordinary filler-gap link.
 */
export const tailClause = sentence(
  'fix-tail-clause',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n(
            'NP',
            'subject',
            [w('Det', 'determiner', 'A'), n('Nom', 'head', [w('N', 'head', 'man')])],
            { index: 1 },
          ),
          n('VP', 'predicate', [
            w('V', 'head', 'came', { lemma: 'come', verbType: 'Vint' }),
            w('Part', 'particle', 'in', { xpos: 'RP', partKind: 'verbal' }),
          ]),
          n(
            'Cl',
            'postnucleus',
            [
              n('NP', 'prenucleus', [w('Pron', 'head', 'who', { xpos: 'WP' })], { index: 2 }),
              n('NP', 'subject', [w('Pron', 'head', 'I')]),
              n('VP', 'predicate', [
                w('V', 'head', 'knew', { lemma: 'know', verbType: 'Vtr' }),
                gap('NP', 'directObject', { index: 2 }),
              ]),
            ],
            { clauseKind: 'relative', clauseType: 'SVO', index: 1 },
          ),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Someone I knew came in.',
      },
    ),
  ],
  'r1',
);

/* ------- a cleft — It was John who broke the belt.
 *
 * *It* is not a thing, and *was John* is not what happened. The sentence takes
 * an ordinary clause and splits it in two so one part can be singled out.
 *
 * Written the same way as the tail clause above: the relative sits at the end
 * and points back at what it belongs to, which here is the phrase being singled
 * out. Nothing is discontinuous.
 */
export const cleft = sentence(
  'fix-cleft',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'It')]),
          n('VP', 'predicate', [
            w('V', 'head', 'was', { xpos: 'VBD', lemma: 'be', verbType: 'Vbe' }),
            n('NP', 'subjectComplement', [w('N', 'head', 'John', { xpos: 'NNP' })], { index: 1 }),
          ]),
          n(
            'Cl',
            'postnucleus',
            [
              w('Subord', 'marker', 'who'),
              gap('NP', 'subject'),
              n('VP', 'predicate', [
                w('V', 'head', 'broke', { lemma: 'break', verbType: 'Vtr' }),
                n('NP', 'directObject', [
                  w('Det', 'determiner', 'the'),
                  n('Nom', 'head', [w('N', 'head', 'belt')]),
                ]),
              ]),
            ],
            { clauseKind: 'relative', clauseType: 'SVO', index: 1 },
          ),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'John, and nobody else, broke the belt.',
      },
    ),
  ],
  'r1',
);

/* --- a comparative — More people came than we expected.
 *
 * *than we expected* completes *more*, and the verb sits between them. Same
 * shape as the two above, and the third family that was said to need a split
 * node and does not.
 */
export const comparative = sentence(
  'fix-comparative',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n(
            'NP',
            'subject',
            [
              n('DP', 'determiner', [w('Det', 'head', 'More')]),
              n('Nom', 'head', [w('N', 'head', 'people')]),
            ],
            { index: 1 },
          ),
          n('VP', 'predicate', [w('V', 'head', 'came', { lemma: 'come', verbType: 'Vint' })]),
          n(
            'Cl',
            'postnucleus',
            [
              w('Subord', 'marker', 'than'),
              n('NP', 'subject', [w('Pron', 'head', 'we')]),
              n('VP', 'predicate', [
                w('V', 'head', 'expected', { lemma: 'expect', verbType: 'Vtr' }),
                gap('NP', 'directObject'),
              ]),
            ],
            { clauseKind: 'comparative', clauseType: 'SVO', index: 1 },
          ),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The number who came was above what we expected.',
      },
    ),
  ],
  'r1',
);

/* ---- one question of two clauses — What did John buy and Mary sell?
 *
 * *What* is asked once and answered twice: *buy* has no object and neither
 * does *sell*, and both holes are the same question. Linguists call it
 * across-the-board extraction, and it is the construction usually given as the
 * reason a syntax tree needs a node with two parents.
 *
 * It does not need one here. An index joins a phrase to the holes it answers
 * for, and nothing said it had to be one hole — one phrase can answer for
 * several, though a hole still has exactly one answer.
 *
 * The fronted phrase sits outside the clauses that hold the holes, which is why
 * "is there a fronted phrase for this gap" is a walk up rather than a look at
 * one clause.
 */
export const acrossTheBoard = sentence(
  'fix-across-the-board',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'prenucleus', [w('Pron', 'head', 'What', { xpos: 'WP' })], { index: 1 }),
          w('Aux', 'auxiliary', 'did', { xpos: 'VBD', lemma: 'do', auxKind: 'do' }),
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [n('Nom', 'head', [w('N', 'head', 'John', { xpos: 'NNP' })])]),
              n('VP', 'predicate', [
                w('V', 'head', 'buy', { xpos: 'VB', verbType: 'Vtr' }),
                gap('NP', 'directObject', { index: 1 }),
              ]),
            ],
            { clauseKind: 'nominal', clauseType: 'SVO' },
          ),
          w('Conj', 'coordinator', 'and'),
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [n('Nom', 'head', [w('N', 'head', 'Mary', { xpos: 'NNP' })])]),
              n('VP', 'predicate', [
                w('V', 'head', 'sell', { xpos: 'VB', verbType: 'Vtr' }),
                gap('NP', 'directObject', { index: 1 }),
              ]),
            ],
            { clauseKind: 'nominal', clauseType: 'SVO' },
          ),
          pt('?'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The question asks which one thing John bought and Mary sold.',
      },
    ),
  ],
  'r1',
);
