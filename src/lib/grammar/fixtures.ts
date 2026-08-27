/**
 * Hand-authored fixtures (S01): one sentence per verb type, plus one genuinely
 * ambiguous sentence carrying two readings.
 *
 * These are the contract's worked examples. Every audit test, the layout test,
 * and the motion lab run off them, and they exist before any corpus does — so
 * the engine can be finished and proved while the pipeline is still being
 * built (see docs/slices/README.md, the de-risking note).
 */
import { build, n, textOf, w, type BuiltReading } from './build.ts';
import type { SentenceEntry } from './types.ts';

function sentence(
  id: string,
  locator: string,
  built: BuiltReading[],
  canonicalId: string,
  features: string[],
): SentenceEntry {
  const words = built[0]!.words;
  const depth = Math.max(...built.map((b) => depthOf(b)));
  return {
    id,
    text: textOf(words),
    source: { work: 'fixture', gutenbergId: 0, locator },
    words,
    readings: built.map((b) => b.reading),
    canonicalId,
    features,
    metrics: { tokens: words.length, clauses: clausesOf(built[0]!), depth },
    provenance: {
      parser: 'hand',
      reviewedBy: 'contract',
      reviewedAt: '2026-08-27',
      audits: 'pass',
    },
  };
}

/** Clause nodes in the canonical reading. Was hardcoded to 1, which stopped
 * being true the moment a fixture held two clauses. */
function clausesOf(b: BuiltReading): number {
  return Object.values(b.reading.constituents).filter((c) => c.form === 'S' || c.form === 'Cl')
    .length;
}

function depthOf(b: BuiltReading): number {
  const cs = b.reading.constituents;
  let max = 0;
  const walk = (id: string, d: number) => {
    max = Math.max(max, d);
    for (const k of cs[id]?.children ?? []) walk(k, d + 1);
  };
  const root = Object.keys(cs).find((k) => cs[k]!.parent === null);
  if (root) walk(root, 0);
  return max;
}

/* -------------------------------------------------- Vint — The engine stalled. */

export const vint = sentence(
  'fix-vint',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'engine')]),
          n('VP', 'predicate', [w('V', 'head', 'stalled', { verbType: 'Vint' })]),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The engine stopped running.',
      },
    ),
  ],
  'r1',
  ['Vint', 'determiner'],
);

/* ---------------------------------------------- Vtr — She repaired the engine. */

export const vtr = sentence(
  'fix-vtr',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'repaired', { lemma: 'repair', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'engine')]),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She fixed the engine.',
      },
    ),
  ],
  'r1',
  ['Vtr', 'directObject'],
);

/* ------------------------------------- Vbe — The keys are on the table. (S V A) */

export const vbe = sentence(
  'fix-vbe',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            w('N', 'head', 'keys', { xpos: 'NNS' }),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'are', { xpos: 'VBP', lemma: 'be', verbType: 'Vbe' }),
            // The adverbial `be` REQUIRES. Drop it and the sentence breaks —
            // this is the S V O A / obligatory-adverbial encoding decision.
            n(
              'PP',
              'adverbial',
              [
                w('P', 'head', 'on'),
                n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'table')]),
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
        gloss: 'The keys are located on the table.',
      },
    ),
  ],
  'r1',
  ['Vbe', 'obligatory-adverbial', 'PP'],
);

/* ------------------------------------------ Vlink — The soup tasted salty. */

export const vlink = sentence(
  'fix-vlink',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'soup')]),
          n('VP', 'predicate', [
            w('V', 'head', 'tasted', { lemma: 'taste', verbType: 'Vlink' }),
            n('AdjP', 'subjectComplement', [w('Adj', 'head', 'salty')]),
          ]),
        ],
        { clauseType: 'SVC' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The soup had a salty flavour.',
      },
    ),
  ],
  'r1',
  ['Vlink', 'subjectComplement', 'AdjP'],
);

/* --------------------------------------------- Vg — He gave her the keys. */

export const vg = sentence(
  'fix-vg',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'He')]),
          n('VP', 'predicate', [
            w('V', 'head', 'gave', { lemma: 'give', verbType: 'Vg' }),
            n('NP', 'indirectObject', [w('Pron', 'head', 'her')]),
            n('NP', 'directObject', [
              w('Det', 'determiner', 'the'),
              w('N', 'head', 'keys', { xpos: 'NNS' }),
            ]),
          ]),
        ],
        { clauseType: 'SVOO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'He handed the keys to her.',
      },
    ),
  ],
  'r1',
  ['Vg', 'indirectObject'],
);

/* ------------------------------------ Vc — They considered him reliable. */

export const vc = sentence(
  'fix-vc',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'They')]),
          n('VP', 'predicate', [
            w('V', 'head', 'considered', { lemma: 'consider', verbType: 'Vc' }),
            n('NP', 'directObject', [w('Pron', 'head', 'him')]),
            n('AdjP', 'objectComplement', [w('Adj', 'head', 'reliable')]),
          ]),
        ],
        { clauseType: 'SVOC' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'They thought he was reliable.',
      },
    ),
  ],
  'r1',
  ['Vc', 'objectComplement'],
);

/* ------------------------- ambiguous — I saw the man with the telescope. */

const telescopeInstrument = build(
  n(
    'S',
    null,
    [
      n('NP', 'subject', [w('Pron', 'head', 'I')]),
      n('VP', 'predicate', [
        w('V', 'head', 'saw', { lemma: 'see', verbType: 'Vtr' }),
        n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'man')]),
        n('PP', 'adverbial', [
          w('P', 'head', 'with'),
          n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'telescope')]),
        ]),
      ]),
    ],
    { clauseType: 'SVO' },
  ),
  {
    id: 'r1',
    status: 'canonical',
    gloss: 'You used the telescope to see him.',
  },
);

const telescopeModifier = build(
  n(
    'S',
    null,
    [
      n('NP', 'subject', [w('Pron', 'head', 'I')]),
      n('VP', 'predicate', [
        w('V', 'head', 'saw', { lemma: 'see', verbType: 'Vtr' }),
        n('NP', 'directObject', [
          w('Det', 'determiner', 'the'),
          w('N', 'head', 'man'),
          n('PP', 'postmodifier', [
            w('P', 'head', 'with'),
            n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'telescope')]),
          ]),
        ]),
      ]),
    ],
    { clauseType: 'SVO' },
  ),
  {
    id: 'r2',
    status: 'alternate',
    gloss: 'The man who had the telescope.',
  },
);

export const ambiguous = sentence(
  'fix-ambiguous',
  'contract fixture',
  [telescopeInstrument, telescopeModifier],
  'r1',
  ['Vtr', 'PP-attachment', 'ambiguity'],
);

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
            w('N', 'head', 'horse'),
            n(
              'Cl',
              'postmodifier',
              [
                n('VP', 'predicate', [
                  w('V', 'head', 'raced', { lemma: 'race', verbType: 'Vint' }),
                  n('PP', 'adverbial', [
                    w('P', 'head', 'past'),
                    n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'barn')]),
                  ]),
                ]),
              ],
              { clauseKind: 'relative', clauseType: 'SV' },
            ),
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
                  w('N', 'head', 'table'),
                  n('PP', 'postmodifier', [
                    w('P', 'head', 'in'),
                    n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'hall')]),
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

/* ---------------- coordination — The engine stalled and the car stopped.
 *
 * One sentence made of two. The outer `S` joins rather than predicates, so it
 * has no verb of its own and is not asked what kind it has; each clause inside
 * answers for itself.
 *
 * The join is honest about what it cannot yet say: *and* is labelled a
 * coordinate along with the clauses it joins, because there is no `coordinator`
 * function to give it. That gap is recorded in docs/model-gaps.md.
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
          w('Conj', 'coordinate', 'and'),
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
  ['Vint', 'coordination', 'two-clause'],
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

/* ---- an auxiliary chain — The mechanic has been repairing the engine.
 *
 * Two helping verbs and one main verb. Morenberg treats *has been repairing*
 * as one verb doing one job, so the phrase is headed by *repairing* and the
 * two auxiliaries hang off it under the `auxiliary` function. Making them
 * premodifiers would have been the cheap wrong answer: a premodifier narrows
 * its head, and *has* does not narrow *repairing*, it tenses it.
 *
 * Two rather than one, because `auxiliary` is the only function in the model
 * that may repeat, and a fixture with one would not prove it.
 */
export const auxiliaryChain = sentence(
  'fix-auxiliary-chain',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'mechanic')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'has', { xpos: 'VBZ', lemma: 'have' }),
            w('Aux', 'auxiliary', 'been', { xpos: 'VBN', lemma: 'be' }),
            w('V', 'head', 'repairing', { xpos: 'VBG', lemma: 'repair', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'engine')]),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The mechanic started repairing the engine and is still at it.',
      },
    ),
  ],
  'r1',
  ['Vtr', 'auxiliary', 'auxiliary-chain', 'directObject'],
);

/* ---- the passive — The engine was repaired by the mechanic.
 *
 * The payoff of the two changes above. *repaired* is still a transitive verb —
 * it still acts on the engine — but the passive has moved that object into the
 * subject slot, so the predicate has no direct object left to find. The verb
 * carries `voice`, next to its type and for the same reason: one sentence can
 * hold a passive clause inside an active one.
 *
 * *by the mechanic* is an ordinary adverbial. It is not obligatory: *The engine
 * was repaired* is a whole sentence, which is most of why English has a passive
 * at all — it lets the doer go unsaid.
 */
export const passive = sentence(
  'fix-passive',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'engine')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'was', { xpos: 'VBD', lemma: 'be' }),
            w('V', 'head', 'repaired', {
              xpos: 'VBN',
              lemma: 'repair',
              verbType: 'Vtr',
              voice: 'passive',
            }),
            n('PP', 'adverbial', [
              w('P', 'head', 'by'),
              n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'mechanic')]),
            ]),
          ]),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The mechanic repaired the engine, said the other way round.',
      },
    ),
  ],
  'r1',
  ['Vtr', 'passive', 'auxiliary', 'voice'],
);

/** Every good fixture. All must pass all seven audits. */
export const FIXTURES: readonly SentenceEntry[] = [
  vint,
  vtr,
  vbe,
  vlink,
  vg,
  vc,
  ambiguous,
  gardenPath,
  objectClause,
  deepNesting,
  coordination,
  adverbialClause,
  auxiliaryChain,
  passive,
];

export const BY_ID: Record<string, SentenceEntry> = Object.fromEntries(
  FIXTURES.map((s) => [s.id, s]),
);
