/**
 * Lesson 31 — Relative clauses. Where the hole is, and whether anything marks it.
 *
 * All ten gaps in the built set were subject gaps and only *that* and *who*
 * appeared. The zero relative is the sharpest omission: *The book I needed
 * vanished* has no relativizer at all, is completely ordinary, and is the case
 * where the gap is hardest to see — which is what `gap` exists to teach.
 *
 * It and *The book that I needed vanished* are one word apart. A learner who can
 * find the hole in the bare one has understood the machinery; one who can only
 * find the *that* version's has learned to look for *that*.
 */
import { adj, det, modifiedBy, pron, sv, svc, svo, v } from './shape.ts';

export const LESSON_31 = [
  sv(
    'c31-a',
    31,
    modifiedBy('Another', 'witness', {
      marker: 'who',
      subjectGap: true,
      verb: v('hesitated', 'hesitate', 'Vint'),
      kind: 'relative',
    }),
    v('returned', 'return', 'Vint'),
    'A second witness, the one who held back, came again.',
  ),
  sv(
    'c31-b',
    31,
    modifiedBy('The', 'pipe', {
      marker: 'that',
      subjectGap: true,
      verb: v('froze', 'freeze', 'Vint'),
      kind: 'relative',
    }),
    v('burst', 'burst', 'Vint'),
    'The pipe that had iced up split open.',
  ),
  sv(
    'c31-c',
    31,
    modifiedBy('Those', 'shutters', {
      marker: 'that',
      subjectGap: true,
      verb: v('rattled', 'rattle', 'Vint'),
      kind: 'relative',
    }),
    v('broke', 'break', 'Vint'),
    'The shutters that had been shaking gave way.',
  ),
  svo(
    'c31-d',
    31,
    det('The', 'inspector'),
    v('questioned', 'question', 'Vtr'),
    modifiedBy('the', 'driver', {
      marker: 'that',
      subjectGap: true,
      verb: v('complained', 'complain', 'Vint'),
      kind: 'relative',
    }),
    'The inspector challenged the driver who had objected.',
  ),
  svo(
    'c31-e',
    31,
    det('The', 'jury'),
    v('believed', 'believe', 'Vtr'),
    modifiedBy('the', 'surveyor', {
      marker: 'who',
      subjectGap: true,
      verb: v('testified', 'testify', 'Vint'),
      kind: 'relative',
    }),
    'The jury took the word of the surveyor who gave evidence.',
  ),
  sv(
    'c31-f',
    31,
    modifiedBy('The', 'boat', {
      marker: 'that',
      subject: det('the', 'volunteers'),
      verb: v('repaired', 'repair', 'Vtr'),
      objectGap: true,
      kind: 'relative',
    }),
    v('sailed', 'sail', 'Vint'),
    'The boat the helpers had mended went out.',
  ),
  sv(
    'c31-g',
    31,
    modifiedBy('The', 'book', {
      marker: 'that',
      subject: pron('I'),
      verb: v('needed', 'need', 'Vtr'),
      objectGap: true,
      kind: 'relative',
    }),
    v('vanished', 'vanish', 'Vint'),
    'The book I had to have went missing.',
  ),
  sv(
    'c31-h',
    31,
    modifiedBy('The', 'book', {
      subject: pron('I'),
      verb: v('needed', 'need', 'Vtr'),
      objectGap: true,
      kind: 'relative',
    }),
    v('vanished', 'vanish', 'Vint'),
    'The book I had to have went missing.',
  ),
  svo(
    'c31-i',
    31,
    pron('She'),
    v('repaired', 'repair', 'Vtr'),
    modifiedBy('the', 'gate', {
      marker: 'that',
      subject: det('the', 'storm'),
      verb: v('damaged', 'damage', 'Vtr'),
      objectGap: true,
      kind: 'relative',
    }),
    'She mended the gate the storm had harmed.',
  ),
  svc(
    'c31-j',
    31,
    modifiedBy('The', 'engine', {
      marker: 'that',
      subjectGap: true,
      verb: v('stalled', 'stall', 'Vint'),
      kind: 'relative',
    }),
    v('was', 'be', 'Vbe'),
    adj('old'),
    'The engine that had cut out was worn.',
  ),
];
