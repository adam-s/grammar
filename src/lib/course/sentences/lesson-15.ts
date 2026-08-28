/** Lesson 15 — The six types, one procedure. A verb that needs both an object
    and a place, so the procedure has to run all the way through. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_15 = [
  constructed('c15-a', 15, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'put', { lemma: 'put', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'letter')]),
            n(
              'PP',
              'adverbial',
              [
                w('P', 'head', 'on'),
                n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'desk')]),
              ],
              { obligatory: true },
            ),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVOA' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She placed the letter on the desk.' },
    ),
  ]),
];
