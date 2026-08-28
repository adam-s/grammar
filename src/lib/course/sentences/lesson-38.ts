/**
 * Lesson 38 — Interjections and sentence-edge words.
 *
 * *Unfortunately* is not the subject, the predicate, or anything inside them.
 * It comments on the whole sentence from outside the frame, which is a real
 * job and needs a name that is honestly not a clause role.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_38 = [
  constructed('c38-a', 38, [
    build(
      n(
        'S',
        null,
        [
          n('AdvP', 'supplement', [w('Adv', 'head', 'Unfortunately')]),
          pt(','),
          n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'ferry')]),
          n('VP', 'predicate', [w('V', 'head', 'sank', { lemma: 'sink', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The ferry sank, and the speaker regrets it.' },
    ),
  ]),
];
