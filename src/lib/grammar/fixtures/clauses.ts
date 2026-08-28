import { build, gap, n, pt, w } from '../build.ts';
import { sentence } from './sentence.ts';

/* ------------------------------ two clauses — The horse raced past the barn fell.
 *
 * The garden-path sentence, and the first fixture whose sentence holds more
 * than one clause. `raced past the barn` is a reduced relative postmodifying
 * `horse`: English lets a writer drop `that was`, and a reader who takes
 * `raced` for the main verb stalls at `fell`.
 *
 * Two verbs, two independent classifications. `raced` is intransitive inside
 * its own clause; `fell` is intransitive in the sentence. Before verb type
 * moved onto the verb, this sentence could not be stored at all.
 */
export const gardenPath = sentence(
  'fix-garden-path',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'horse'),
              n(
                'Cl',
                'postmodifier',
                [
                  n('VP', 'predicate', [
                    w('V', 'head', 'raced', { lemma: 'race', verbType: 'Vint' }),
                    n('PP', 'adverbial', [
                      w('P', 'head', 'past'),
                      n('NP', 'complement', [
                        w('Det', 'determiner', 'the'),
                        w('N', 'head', 'barn'),
                      ]),
                    ]),
                  ]),
                ],
                { clauseKind: 'relative', clauseType: 'SV' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'fell', { lemma: 'fall', verbType: 'Vint' })]),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The horse that had been raced past the barn fell over.',
      },
    ),
  ],
  'r1',
  ['Vint', 'relative-clause', 'reduced-relative', 'garden-path', 'two-clause'],
);

/* ------------------------- a clause as an object — She knew the engine stalled.
 *
 * The second two-clause sentence, and a different shape from the garden path:
 * here the embedded clause is what the verb takes, not what a noun is modified
 * by. `knew` is transitive and its direct object is a whole clause with its own
 * subject and its own intransitive verb.
 */
export const objectClause = sentence(
  'fix-object-clause',
  'contract fixture',
  [
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
                n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'engine')]),
                n('VP', 'predicate', [
                  w('V', 'head', 'stalled', { lemma: 'stall', verbType: 'Vint' }),
                ]),
              ],
              { clauseKind: 'nominal', clauseType: 'SV' },
            ),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She was aware that the engine had stalled.',
      },
    ),
  ],
  'r1',
  ['Vtr', 'Vint', 'nominal-clause', 'two-clause', 'clause-as-object'],
);

/* ------------- deep nesting — The keys are on the table in the hall. (S V A)
 *
 * One clause, but six levels: a prepositional phrase whose complement is a noun
 * phrase carrying another prepositional phrase. Depth without extra clauses is
 * its own test — the layout, the camera, and the palette all have to survive a
 * tree that is tall rather than wide.
 */
export const deepNesting = sentence(
  'fix-deep-nesting',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'keys')]),
          n('VP', 'predicate', [
            w('V', 'head', 'are', { xpos: 'VBP', lemma: 'be', verbType: 'Vbe' }),
            n(
              'PP',
              'adverbial',
              [
                w('P', 'head', 'on'),
                n('NP', 'complement', [
                  w('Det', 'determiner', 'the'),
                  n('Nom', 'head', [
                    w('N', 'head', 'table'),
                    n('PP', 'postmodifier', [
                      w('P', 'head', 'in'),
                      n('NP', 'complement', [
                        w('Det', 'determiner', 'the'),
                        w('N', 'head', 'hall'),
                      ]),
                    ]),
                  ]),
                ]),
              ],
              { obligatory: true },
            ),
          ]),
        ],
        { clauseType: 'SVA' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The keys are on a table that is in the hall.',
      },
    ),
  ],
  'r1',
  ['Vbe', 'obligatory-adverbial', 'PP-in-PP', 'deep'],
);

/* ------- an adverbial clause — The engine stalled because the belt broke.
 *
 * The first sentence with a subordinator. *because* introduces the clause
 * without being part of what it says, which is the `marker` function; before
 * that function existed, `Subord` was hidden everywhere inside a clause and
 * this sentence could not be written at all.
 *
 * Chosen over a *that*-relative deliberately. A subject relative also needs a
 * gap where its subject would be, and gaps are still missing
 * (docs/model-gaps.md); an adverbial clause needs only the marker, so this
 * fixture tests one new thing rather than two.
 */
export const adverbialClause = sentence(
  'fix-adverbial-clause',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'engine')]),
          n('VP', 'predicate', [
            w('V', 'head', 'stalled', { lemma: 'stall', verbType: 'Vint' }),
            n(
              'Cl',
              'adverbial',
              [
                w('Subord', 'marker', 'because'),
                n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'belt')]),
                n('VP', 'predicate', [
                  w('V', 'head', 'broke', { lemma: 'break', verbType: 'Vint' }),
                ]),
              ],
              { clauseKind: 'adverbial', clauseType: 'SV' },
            ),
          ]),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'A broken belt is why the engine stalled.',
      },
    ),
  ],
  'r1',
  ['Vint', 'adverbial-clause', 'subordinator', 'marker', 'two-clause'],
);

/* ----- a subject relative — The engine that stalled was repaired.
 *
 * The sentence the model could not write. *that stalled* is a clause, and a
 * clause has a subject — but there is no word for it, because *the engine* is
 * already doing that job outside. The slot is real: *stalled* requires
 * something to have stalled, and a reader supplies it without being told.
 *
 * So the subject is a gap. It covers no words, it has a function, and it is
 * tied to nothing inside the clause, because what fills it is the nominal the
 * clause is modifying — which is not in the clause at all.
 *
 * *that* is the marker, the same as *because*. It is not the subject: put a
 * subject back and the sentence is *the engine that IT stalled*, which is not
 * English.
 */
export const subjectRelative = sentence(
  'fix-subject-relative',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'engine'),
              n(
                'Cl',
                'postmodifier',
                [
                  w('Subord', 'marker', 'that'),
                  gap('NP', 'subject'),
                  n('VP', 'predicate', [
                    w('V', 'head', 'stalled', { lemma: 'stall', verbType: 'Vint' }),
                  ]),
                ],
                { clauseKind: 'relative', clauseType: 'SV' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'was', { xpos: 'VBD', lemma: 'be', auxKind: 'passive' }),
            w('V', 'head', 'repaired', {
              xpos: 'VBN',
              lemma: 'repair',
              verbType: 'Vtr',
              voice: 'passive',
            }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Somebody repaired the engine that had stalled.',
      },
    ),
  ],
  'r1',
  ['Vint', 'Vtr', 'relative-clause', 'gap', 'passive', 'two-clause'],
);
