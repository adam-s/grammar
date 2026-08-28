/**
 * Lesson 26 — Coordination inside phrases. Equal pieces joined.
 *
 * *and* does the joining and is not one of the things joined — labelling it a
 * coordinate alongside them would say this subject has three parts where it
 * has two.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_26 = [
  constructed('c26-a', 26, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            n('NP', 'coordinate', [w('Det', 'determiner', 'The'), w('N', 'head', 'bread')]),
            w('Conj', 'coordinator', 'and'),
            n('NP', 'coordinate', [w('Det', 'determiner', 'the'), w('N', 'head', 'cheese')]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'vanished', { lemma: 'vanish', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Both the bread and the cheese disappeared.' },
    ),
  ]),
];
