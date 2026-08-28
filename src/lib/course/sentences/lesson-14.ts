/** Lesson 14 — When an adverbial is required. Take the place phrase away and
    what is left is not a sentence. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_14 = [
  constructed('c14-a', 14, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'keys')]),
          n('VP', 'predicate', [
            w('V', 'head', 'are', { lemma: 'be', verbType: 'Vbe' }),
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
          pt('.'),
        ],
        { clauseType: 'SVA' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The keys are lying on the table.' },
    ),
  ]),
];
