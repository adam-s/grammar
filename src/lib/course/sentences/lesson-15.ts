/**
 * Lesson 15 — The six types, one procedure. All seven patterns in one set.
 *
 * Nothing new is taught here. The point is that the same first question —
 * find the verb, ask what it needs — settles every one of them, so the
 * sentences arrive unsorted and the learner has to run the procedure rather
 * than remember which lesson they are in.
 */
import { adj, det, pp, pron, sv, sva, svc, svo, svoa, svoc, svoo, v } from './shape.ts';

export const LESSON_15 = [
  svoa(
    'c15-a',
    15,
    pron('She'),
    v('put', 'put', 'Vtr'),
    det('the', 'letter'),
    pp('on', det('the', 'desk')),
    'She placed the letter on the desk.',
  ),
  sv(
    'c15-b',
    15,
    det('Those', 'negotiations'),
    v('collapsed', 'collapse', 'Vint'),
    'Those negotiations broke down.',
  ),
  svo(
    'c15-c',
    15,
    det('The', 'auditor'),
    v('questioned', 'question', 'Vtr'),
    det('the', 'figures'),
    'The auditor challenged the figures.',
  ),
  svc(
    'c15-d',
    15,
    det('The', 'explanation'),
    v('sounded', 'sound', 'Vlink'),
    adj('plausible'),
    'The explanation seemed believable.',
  ),
  svoo(
    'c15-e',
    15,
    det('The', 'foreman'),
    v('gave', 'give', 'Vg'),
    det('the', 'apprentice'),
    det('a', 'warning'),
    'The foreman warned the apprentice.',
  ),
  svoc(
    'c15-f',
    15,
    det('The', 'inspector'),
    v('declared', 'declare', 'Vc'),
    det('the', 'building'),
    adj('unsafe'),
    'The inspector ruled the building unsafe.',
  ),
  sva(
    'c15-g',
    15,
    det('The', 'archive'),
    v('is', 'be', 'Vbe'),
    pp('below', det('the', 'stairs')),
    'The archive is kept below the stairs.',
  ),
  svo(
    'c15-h',
    15,
    det('The', 'flood'),
    v('destroyed', 'destroy', 'Vtr'),
    det('the', 'harvest'),
    'The flood ruined the harvest.',
  ),
  svc(
    'c15-i',
    15,
    det('That', 'chairman'),
    v('was', 'be', 'Vbe'),
    det('a', 'banker'),
    'That chairman worked as a banker.',
  ),
  svoa(
    'c15-j',
    15,
    det('The', 'porters'),
    // `carried` is not the verb for this pattern: *The porters carried the
    // crates* is already a sentence, so the place phrase would be an ordinary
    // adverbial and not a required one. `placed` cannot be left bare.
    v('placed', 'place', 'Vtr'),
    det('the', 'crates'),
    pp('in', det('the', 'hall')),
    'The porters set the crates down in the hall.',
  ),
];
