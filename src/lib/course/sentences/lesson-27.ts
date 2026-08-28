/**
 * Lesson 27 — Attachment changes meaning. The first real payoff.
 *
 * One string of words, two well-formed drawings, and each drawing earns a
 * different paraphrase. Nothing here is new: both readings use only what
 * lessons 1–21 taught. What is new is that the diagram, not the words, is what
 * settles which sentence this is.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

const words = () => [w('Pron', 'head', 'She')];

/** *with the binoculars* tells you how she watched. */
const instrument = build(
  n(
    'S',
    null,
    [
      n('NP', 'subject', words()),
      n('VP', 'predicate', [
        w('V', 'head', 'watched', { lemma: 'watch', verbType: 'Vtr' }),
        n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'boy')]),
        n('PP', 'adverbial', [
          w('P', 'head', 'with'),
          n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'binoculars')]),
        ]),
      ]),
      pt('.'),
    ],
    { clauseType: 'SVO' },
  ),
  { id: 'r1', status: 'canonical', gloss: 'She used the binoculars to watch him.' },
);

/** *with the binoculars* tells you which boy. */
const whichBoy = build(
  n(
    'S',
    null,
    [
      n('NP', 'subject', words()),
      n('VP', 'predicate', [
        w('V', 'head', 'watched', { lemma: 'watch', verbType: 'Vtr' }),
        n('NP', 'directObject', [
          w('Det', 'determiner', 'the'),
          n('Nom', 'head', [
            w('N', 'head', 'boy'),
            n('PP', 'postmodifier', [
              w('P', 'head', 'with'),
              n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'binoculars')]),
            ]),
          ]),
        ]),
      ]),
      pt('.'),
    ],
    { clauseType: 'SVO' },
  ),
  { id: 'r2', status: 'alternate', gloss: 'The boy who had the binoculars.' },
);

export const LESSON_27 = [constructed('c27-a', 27, [instrument, whichBoy], 'r1')];
