import { build, n, pt, w } from '../build.ts';
import { sentence } from '../entry.ts';

/** Small fixtures whose only job is to make a menu distinction visible. */
export const determinativePhrase = sentence(
  'fix-determinative-phrase',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            n('DP', 'determiner', [w('Adv', 'premodifier', 'Almost'), w('Det', 'head', 'every')]),
            n('Nom', 'head', [w('N', 'head', 'driver')]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'waited', { lemma: 'wait', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Nearly all of the drivers waited.',
      },
    ),
  ],
  'r1',
);

export const fusedDeterminer = sentence(
  'fix-fused-determiner',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'head', 'Most', { fusedWith: 'determiner' })]),
          n('VP', 'predicate', [w('V', 'head', 'left', { lemma: 'leave', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Most of the relevant people left.' },
    ),
  ],
  'r1',
);

export const fusedPremodifier = sentence(
  'fix-fused-premodifier',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [w('Adj', 'head', 'poor', { fusedWith: 'premodifier' })]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'complained', { lemma: 'complain', verbType: 'Vint' }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The people who are poor complained.' },
    ),
  ],
  'r1',
);

export const modalAuxiliary = sentence(
  'fix-modal-auxiliary',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'can', { xpos: 'MD', lemma: 'can', auxKind: 'modal' }),
            w('V', 'head', 'swim', { xpos: 'VB', lemma: 'swim', verbType: 'Vint' }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She is able to swim.' },
    ),
  ],
  'r1',
);

export const supportingDo = sentence(
  'fix-supporting-do',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'did', { xpos: 'VBD', lemma: 'do', auxKind: 'do' }),
            w('V', 'head', 'leave', { xpos: 'VB', lemma: 'leave', verbType: 'Vint' }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She really left.' },
    ),
  ],
  'r1',
);

export const exclamativeClause = sentence(
  'fix-exclamative-clause',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'I')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'cannot', {
              xpos: 'MD',
              lemma: 'can',
              auxKind: 'modal',
            }),
            w('V', 'head', 'believe', { xpos: 'VB', lemma: 'believe', verbType: 'Vtr' }),
            n(
              'Cl',
              'directObject',
              [
                n('AdvP', 'prenucleus', [w('Adv', 'premodifier', 'how'), w('Adv', 'head', 'fast')]),
                n('NP', 'subject', [w('Pron', 'head', 'she')]),
                n('VP', 'predicate', [w('V', 'head', 'ran', { lemma: 'run', verbType: 'Vint' })]),
              ],
              { clauseKind: 'exclamative', clauseType: 'SV' },
            ),
          ]),
          pt('!'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Her speed was surprisingly great.',
      },
    ),
  ],
  'r1',
);
