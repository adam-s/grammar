/**
 * Lesson 30 — Nominal clauses. A clause filling a noun-shaped slot.
 *
 * Nothing new is named. What is new is where the clause sits: lesson 28 put
 * one in the object slot, and these are SUBJECTS — so the *it* test from
 * lesson 4 works on them, which is the evidence they are doing a noun's job.
 *
 * Some of them link rather than act. *That the belt broke was obvious* is the
 * commonest thing anyone says about a clause in the subject slot, and ten
 * transitive main verbs would have made a subject clause look like something
 * that has to do things to people.
 */
import { adj, clauseSubject, clauseSubjectIs, det, v } from './shape.ts';

export const LESSON_30 = [
  clauseSubject(
    'c30-a',
    30,
    {
      marker: 'That',
      subject: det('the', 'belt'),
      verb: v('broke', 'break', 'Vint'),
      kind: 'nominal',
    },
    v('surprised', 'surprise', 'Vtr'),
    det('the', 'driver'),
    'The driver was surprised that the belt had broken.',
  ),
  clauseSubjectIs(
    'c30-b',
    30,
    {
      marker: 'That',
      subject: det('the', 'ferry'),
      verb: v('sank', 'sink', 'Vint'),
      kind: 'nominal',
    },
    v('was', 'be', 'Vbe'),
    adj('obvious'),
    'Everyone could see that the ferry had sunk.',
  ),
  clauseSubject(
    'c30-c',
    30,
    {
      marker: 'That',
      subject: det('the', 'wiring'),
      verb: v('failed', 'fail', 'Vint'),
      kind: 'nominal',
    },
    v('worried', 'worry', 'Vtr'),
    det('that', 'inspector'),
    'The failing wiring worried that inspector.',
  ),
  clauseSubject(
    'c30-d',
    30,
    {
      marker: 'That',
      subject: det('the', 'archive'),
      verb: v('flooded', 'flood', 'Vint'),
      kind: 'nominal',
    },
    v('angered', 'anger', 'Vtr'),
    det('the', 'trustees'),
    'The trustees were angry about the flood.',
  ),
  clauseSubjectIs(
    'c30-e',
    30,
    {
      marker: 'That',
      subject: det('the', 'talks'),
      verb: v('collapsed', 'collapse', 'Vint'),
      kind: 'nominal',
    },
    v('seemed', 'seem', 'Vlink'),
    adj('unlikely'),
    'It did not seem likely that the talks had collapsed.',
  ),
  clauseSubject(
    'c30-f',
    30,
    {
      marker: 'That',
      subject: det('the', 'witness'),
      verb: v('hesitated', 'hesitate', 'Vint'),
      kind: 'nominal',
    },
    v('interested', 'interest', 'Vtr'),
    det('the', 'jury'),
    'The pause interested the jury.',
  ),
  clauseSubject(
    'c30-g',
    30,
    {
      marker: 'That',
      subject: det('the', 'engine'),
      verb: v('restarted', 'restart', 'Vint'),
      kind: 'nominal',
    },
    v('relieved', 'relieve', 'Vtr'),
    det('the', 'crew'),
    'The crew were relieved it started again.',
  ),
  clauseSubjectIs(
    'c30-h',
    30,
    {
      marker: 'That',
      subject: det('the', 'boundary'),
      verb: v('shifted', 'shift', 'Vint'),
      kind: 'nominal',
    },
    v('was', 'be', 'Vbe'),
    adj('clear'),
    'It was plain that the boundary had shifted.',
  ),
  clauseSubject(
    'c30-i',
    30,
    {
      marker: 'That',
      subject: det('the', 'lock'),
      verb: v('rusted', 'rust', 'Vint'),
      kind: 'nominal',
    },
    v('annoyed', 'annoy', 'Vtr'),
    det('her', 'landlord'),
    'The rusted lock annoyed her landlord.',
  ),
  clauseSubject(
    'c30-j',
    30,
    {
      marker: 'That',
      subject: det('the', 'queue'),
      verb: v('lengthened', 'lengthen', 'Vint'),
      kind: 'nominal',
    },
    v('alarmed', 'alarm', 'Vtr'),
    det('the', 'baker'),
    'The growing queue alarmed the baker.',
  ),
];
