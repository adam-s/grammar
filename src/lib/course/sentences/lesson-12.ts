/** Lesson 12 — Two objects. Someone is given something: the receiver comes
    first, and neither slot can be dropped. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_12 = [
  constructed('c12-a', 12, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'porter')]),
          n('VP', 'predicate', [
            w('V', 'head', 'handed', { lemma: 'hand', verbType: 'Vg' }),
            n('NP', 'indirectObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'guest')]),
            n('NP', 'directObject', [w('Det', 'determiner', 'a'), w('N', 'head', 'key')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVOO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The porter gave the guest a key.' },
    ),
  ]),
];
