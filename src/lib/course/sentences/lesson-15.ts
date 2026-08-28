/**
 * Lesson 15 — The six types, one procedure. Where counting stops working.
 *
 * Items 1 to 7 are the paradigm, one sentence per frame, in the order the verb
 * adds demands. Items 8 and 9 are why the procedure is needed: five words each,
 * three noun phrases each, and only the `be` test tells them apart — *she is a
 * genius* holds, *she is a taxi* does not.
 *
 * The hardest sentence in the lesson is one of the shortest, which is the whole
 * argument of docs/course/difficulty.md in one row.
 */
import { adj, det, pp, pron, sv, sva, svc, svo, svoa, svoc, svoo, v } from './shape.ts';

export const LESSON_15 = [
  sv(
    'c15-a',
    15,
    det('Those', 'negotiations'),
    v('collapsed', 'collapse', 'Vint'),
    'Those talks broke down.',
  ),
  svo(
    'c15-b',
    15,
    det('The', 'auditor'),
    v('questioned', 'question', 'Vtr'),
    det('the', 'figures'),
    'The auditor challenged the numbers.',
  ),
  svoo(
    'c15-c',
    15,
    det('The', 'foreman'),
    v('gave', 'give', 'Vg'),
    det('the', 'apprentice'),
    det('a', 'warning'),
    'The foreman warned the trainee.',
  ),
  svoo(
    'c15-d',
    15,
    pron('They'),
    v('called', 'call', 'Vg'),
    pron('her'),
    det('a', 'taxi'),
    'They booked a cab for her.',
  ),
  svc(
    'c15-e',
    15,
    det('The', 'explanation'),
    v('sounded', 'sound', 'Vlink'),
    adj('plausible'),
    'The account seemed believable.',
  ),
  svc(
    'c15-f',
    15,
    det('That', 'chairman'),
    v('was', 'be', 'Vbe'),
    det('a', 'banker'),
    'That chairman worked in banking.',
  ),
  sva(
    'c15-g',
    15,
    det('The', 'archive'),
    v('is', 'be', 'Vbe'),
    pp('below', det('the', 'stairs')),
    'The records are kept under the stairs.',
  ),
  svoc(
    'c15-h',
    15,
    det('The', 'inspector'),
    v('declared', 'declare', 'Vc'),
    det('the', 'building'),
    adj('unsafe'),
    'The inspector ruled the building dangerous.',
  ),
  svoc(
    'c15-i',
    15,
    pron('They'),
    v('called', 'call', 'Vc'),
    pron('her'),
    det('a', 'genius'),
    'They said she was brilliant.',
  ),
  // `keep` was wrong here for the same reason `file` was wrong at lesson 20:
  // *She kept the milk* is a complete ordinary sentence, so the place phrase was
  // not required and the removal test would have rejected a correct learner.
  // `put` demands a location in the plain sense of the word.
  svoa(
    'c15-j',
    15,
    pron('She'),
    v('put', 'put', 'Vtr'),
    det('the', 'letter'),
    pp('on', det('the', 'desk')),
    'She set the letter down on the desk.',
  ),
];
