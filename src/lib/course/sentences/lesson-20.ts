/**
 * Lesson 20 — Form is not function.
 *
 * The same prepositional phrase, *in the hall*, is a required adverbial here
 * and an ordinary one in lesson 18's sentences. The form never changed; the
 * job did.
 */
import { det, pp, pron, svoa, v } from './shape.ts';

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
];
