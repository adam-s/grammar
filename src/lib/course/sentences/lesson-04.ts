/** Lesson 4 — Noun phrases. A subject long enough that the *it* test is the
    only comfortable way to find where it ends. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_04 = [
  constructed('c04-a', 4, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'man'),
              n('PP', 'postmodifier', [
                w('P', 'head', 'in'),
                n('NP', 'complement', [
                  w('Det', 'determiner', 'the'),
                  n('Nom', 'head', [w('Adj', 'premodifier', 'grey'), w('N', 'head', 'coat')]),
                ]),
              ]),
            ]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'laughed', { lemma: 'laugh', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The man wearing the grey coat laughed.' },
    ),
  ]),
];
