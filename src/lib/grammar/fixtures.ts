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
    metrics: { tokens: words.length, clauses: 1, depth },
    provenance: {
      parser: 'hand',
      reviewedBy: 'contract',
      reviewedAt: '2026-08-27',
      audits: 'pass',
    },
  };
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
      n('S', null, [
        n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'engine')]),
        n('VP', 'predicate', [w('V', 'head', 'stalled')]),
      ]),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The engine stopped running.',
        verbType: 'Vint',
        clauseType: 'SV',
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
      n('S', null, [
        n('NP', 'subject', [w('Pron', 'head', 'She')]),
        n('VP', 'predicate', [
          w('V', 'head', 'repaired', { lemma: 'repair' }),
          n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'engine')]),
        ]),
      ]),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She fixed the engine.',
        verbType: 'Vtr',
        clauseType: 'SVO',
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
      n('S', null, [
        n('NP', 'subject', [
          w('Det', 'determiner', 'The'),
          w('N', 'head', 'keys', { xpos: 'NNS' }),
        ]),
        n('VP', 'predicate', [
          w('V', 'head', 'are', { xpos: 'VBP', lemma: 'be' }),
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
      ]),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The keys are located on the table.',
        verbType: 'Vbe',
        clauseType: 'SVA',
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
      n('S', null, [
        n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'soup')]),
        n('VP', 'predicate', [
          w('V', 'head', 'tasted', { lemma: 'taste' }),
          n('AdjP', 'subjectComplement', [w('Adj', 'head', 'salty')]),
        ]),
      ]),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The soup had a salty flavour.',
        verbType: 'Vlink',
        clauseType: 'SVC',
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
      n('S', null, [
        n('NP', 'subject', [w('Pron', 'head', 'He')]),
        n('VP', 'predicate', [
          w('V', 'head', 'gave', { lemma: 'give' }),
          n('NP', 'indirectObject', [w('Pron', 'head', 'her')]),
          n('NP', 'directObject', [
            w('Det', 'determiner', 'the'),
            w('N', 'head', 'keys', { xpos: 'NNS' }),
          ]),
        ]),
      ]),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'He handed the keys to her.',
        verbType: 'Vg',
        clauseType: 'SVOO',
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
      n('S', null, [
        n('NP', 'subject', [w('Pron', 'head', 'They')]),
        n('VP', 'predicate', [
          w('V', 'head', 'considered', { lemma: 'consider' }),
          n('NP', 'directObject', [w('Pron', 'head', 'him')]),
          n('AdjP', 'objectComplement', [w('Adj', 'head', 'reliable')]),
        ]),
      ]),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'They thought he was reliable.',
        verbType: 'Vc',
        clauseType: 'SVOC',
      },
    ),
  ],
  'r1',
  ['Vc', 'objectComplement'],
);

/* ------------------------- ambiguous — I saw the man with the telescope. */

const telescopeInstrument = build(
  n('S', null, [
    n('NP', 'subject', [w('Pron', 'head', 'I')]),
    n('VP', 'predicate', [
      w('V', 'head', 'saw', { lemma: 'see' }),
      n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'man')]),
      n('PP', 'adverbial', [
        w('P', 'head', 'with'),
        n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'telescope')]),
      ]),
    ]),
  ]),
  {
    id: 'r1',
    status: 'canonical',
    gloss: 'You used the telescope to see him.',
    verbType: 'Vtr',
    clauseType: 'SVO',
  },
);

const telescopeModifier = build(
  n('S', null, [
    n('NP', 'subject', [w('Pron', 'head', 'I')]),
    n('VP', 'predicate', [
      w('V', 'head', 'saw', { lemma: 'see' }),
      n('NP', 'directObject', [
        w('Det', 'determiner', 'the'),
        w('N', 'head', 'man'),
        n('PP', 'postmodifier', [
          w('P', 'head', 'with'),
          n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'telescope')]),
        ]),
      ]),
    ]),
  ]),
  {
    id: 'r2',
    status: 'alternate',
    gloss: 'The man who had the telescope.',
    verbType: 'Vtr',
    clauseType: 'SVO',
  },
);

export const ambiguous = sentence(
  'fix-ambiguous',
  'contract fixture',
  [telescopeInstrument, telescopeModifier],
  'r1',
  ['Vtr', 'PP-attachment', 'ambiguity'],
);

/** Every good fixture. All must pass all seven audits. */
export const FIXTURES: readonly SentenceEntry[] = [vint, vtr, vbe, vlink, vg, vc, ambiguous];

export const BY_ID: Record<string, SentenceEntry> = Object.fromEntries(
  FIXTURES.map((s) => [s.id, s]),
);
