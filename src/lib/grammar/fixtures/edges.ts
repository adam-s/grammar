import { build, n, pt, w } from '../build.ts';
import { sentence } from './sentence.ts';

/* -- punctuation — The mechanic repaired the engine, and the car started.
 *
 * Punctuation is in the sentence and not in the tree. The comma and the period
 * are words a learner can see and click; neither takes a label, and no node
 * covers either. That is not a simplification — a comma is not a word class,
 * and a diagram that gave it one would be claiming something false.
 *
 * Both positions are here on purpose. The period is easy: it falls off the end.
 * The comma is the hard one, because it sits between two coordinates, and
 * `auditContiguity` has to agree that a run of words with a comma in the middle
 * is still a run with no gaps.
 */
export const punctuation = sentence(
  'fix-punctuation',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'mechanic')]),
              n('VP', 'predicate', [
                w('V', 'head', 'repaired', { lemma: 'repair', verbType: 'Vtr' }),
                n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'engine')]),
              ]),
            ],
            { clauseType: 'SVO' },
          ),
          pt(','),
          w('Conj', 'coordinator', 'and'),
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'car')]),
              n('VP', 'predicate', [
                w('V', 'head', 'started', { lemma: 'start', verbType: 'Vint' }),
              ]),
            ],
            { clauseType: 'SV' },
          ),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The repair is why the car started.',
      },
    ),
  ],
  'r1',
  ['Vtr', 'Vint', 'coordination', 'punctuation', 'two-clause'],
);

/* ------------- a supplement — Unfortunately, the engine stalled.
 *
 * *Unfortunately* is in the sentence and fills no slot in it. It is not the
 * subject, not an object, and not an adverbial modifying *stalled* — it
 * comments on the whole thing from outside. Before `supplement` existed there
 * was no honest place to put it, and an interjection could be named but not
 * attached.
 *
 * The comma is doing real work here and still takes no label: it is the
 * evidence that the adverb is set off rather than integrated.
 */
export const supplement = sentence(
  'fix-supplement',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('AdvP', 'supplement', [w('Adv', 'head', 'Unfortunately')]),
          pt(','),
          n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'engine')]),
          n('VP', 'predicate', [w('V', 'head', 'stalled', { lemma: 'stall', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The engine stopped running, and the speaker regrets it.',
      },
    ),
  ],
  'r1',
  ['Vint', 'supplement', 'punctuation'],
);
