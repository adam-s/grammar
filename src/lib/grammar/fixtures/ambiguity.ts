import { build, n, w } from '../build.ts';
import { sentence } from './sentence.ts';

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
          n('Nom', 'head', [
            w('N', 'head', 'man'),
            n('PP', 'postmodifier', [
              w('P', 'head', 'with'),
              n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'telescope')]),
            ]),
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
