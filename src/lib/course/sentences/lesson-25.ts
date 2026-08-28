/**
 * Lesson 25 — Particles. *down* belongs with the verb, not to a phrase.
 *
 * It looks like the preposition of lesson 19 and behaves like nothing of the
 * kind: it takes no complement, and *the address* is the object of *wrote
 * down* rather than of *down*.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_25 = [
  constructed('c25-a', 25, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'clerk')]),
          n('VP', 'predicate', [
            w('V', 'head', 'wrote', { lemma: 'write', verbType: 'Vtr' }),
            w('Part', 'particle', 'down', { partKind: 'verbal' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'address')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The clerk noted the address in writing.' },
    ),
  ]),
];
