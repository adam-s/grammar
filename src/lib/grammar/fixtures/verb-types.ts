import { build, n, w } from '../build.ts';
import { sentence } from './sentence.ts';

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
