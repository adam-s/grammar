/**
 * Lesson 20 — Form is not function.
 *
 * The sentences come in pairs on purpose. The same prepositional phrase, in
 * the same shape, is a required adverbial in one and a phrase the verb could
 * do without in the other. The form never changed; the job did, and only the
 * verb can tell you which.
 */
import { det, pp, pron, svPlus, svoa, v } from './shape.ts';

export const LESSON_20 = [
  svoa(
    'c20-a',
    20,
    pron('They'),
    v('put', 'put', 'Vtr'),
    det('the', 'piano'),
    pp('in', det('the', 'hall')),
    'They placed the piano in the hall.',
  ),
  svPlus(
    'c20-b',
    20,
    det('The', 'quartet'),
    v('rehearsed', 'rehearse', 'Vint'),
    pp('in', det('the', 'hall')),
    'The quartet practised in the hall.',
  ),
  svoa(
    'c20-c',
    20,
    det('Another', 'porter'),
    v('laid', 'lay', 'Vtr'),
    det('the', 'tray'),
    pp('on', det('the', 'sideboard')),
    'The porter set the tray down on the sideboard.',
  ),
  svPlus(
    'c20-d',
    20,
    det('The', 'cat'),
    v('slept', 'sleep', 'Vint'),
    pp('on', det('the', 'sideboard')),
    'The cat was asleep on the sideboard.',
  ),
  svoa(
    'c20-e',
    20,
    det('The', 'clerk'),
    v('filed', 'file', 'Vtr'),
    det('the', 'deeds'),
    pp('under', det('the', 'counter')),
    'The clerk stored the deeds under the counter.',
  ),
  svPlus(
    'c20-f',
    20,
    det('The', 'draught'),
    v('whistled', 'whistle', 'Vint'),
    pp('under', det('the', 'counter')),
    'A draught came whistling under the counter.',
  ),
  svoa(
    'c20-g',
    20,
    pron('She'),
    v('placed', 'place', 'Vtr'),
    det('the', 'lamp'),
    pp('beside', det('the', 'bed')),
    'She stood the lamp beside the bed.',
  ),
  svPlus(
    'c20-h',
    20,
    det('The', 'nurse'),
    v('waited', 'wait', 'Vint'),
    pp('beside', det('the', 'bed')),
    'The nurse stayed beside the bed.',
  ),
  svoa(
    'c20-i',
    20,
    det('The', 'carpenter'),
    v('set', 'set', 'Vtr'),
    det('the', 'beam'),
    pp('across', det('the', 'gap')),
    'The carpenter laid the beam across the gap.',
  ),
  svPlus(
    'c20-j',
    20,
    det('That', 'rope'),
    v('swung', 'swing', 'Vint'),
    pp('across', det('the', 'gap')),
    'The rope swung over the gap.',
  ),
];
