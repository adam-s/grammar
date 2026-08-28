/**
 * Lesson 30 — Nominal clauses. One variable at a time, at last.
 *
 * Lesson 28's nominal clauses were all objects without markers; the built lesson
 * 30's were all subjects with them. So between the two lessons the marker and
 * the position moved together, and the commonest nominal clause in English —
 * *She knew that the belt broke* — was in neither.
 *
 * Items 1 and 2 hold the clause still and move it. Items 7 and 8 are the sharper
 * pair: *that* is a determiner at lesson 6, a marker at 29 and a relativizer at
 * 31, and the course never put two of those side by side. Item 5 puts a nominal
 * clause in a subject-complement slot, which appears nowhere in the course.
 */
import {
  adj,
  clauseSubject,
  clauseSubjectIs,
  det,
  isClause,
  pron,
  svClause,
  svo,
  v,
} from './shape.ts';

export const LESSON_30 = [
  svClause(
    'c30-a',
    30,
    pron('She'),
    v('knew', 'know', 'Vtr'),
    {
      marker: 'that',
      subject: det('the', 'belt'),
      verb: v('broke', 'break', 'Vint'),
      kind: 'nominal',
    },
    'She was aware the belt had given way.',
  ),
  clauseSubject(
    'c30-b',
    30,
    {
      marker: 'That',
      subject: det('the', 'belt'),
      verb: v('broke', 'break', 'Vint'),
      kind: 'nominal',
    },
    v('surprised', 'surprise', 'Vtr'),
    det('the', 'driver'),
    'The belt giving way took the driver aback.',
  ),
  svClause(
    'c30-c',
    30,
    pron('We'),
    v('believed', 'believe', 'Vtr'),
    {
      marker: 'that',
      subject: det('the', 'bridge'),
      verb: v('was', 'be', 'Vbe'),
      complement: adj('safe'),
      kind: 'nominal',
    },
    'We took the bridge to be sound.',
  ),
  clauseSubjectIs(
    'c30-d',
    30,
    {
      marker: 'That',
      subject: det('the', 'ferry'),
      verb: v('sank', 'sink', 'Vint'),
      kind: 'nominal',
    },
    v('was', 'be', 'Vbe'),
    adj('obvious'),
    'The ferry going down was plain to see.',
  ),
  isClause(
    'c30-e',
    30,
    det('The', 'trouble'),
    v('was', 'be', 'Vbe'),
    {
      marker: 'that',
      subject: det('the', 'gate'),
      verb: v('failed', 'fail', 'Vint'),
      kind: 'nominal',
    },
    'A failed gate was the difficulty.',
  ),
  clauseSubject(
    'c30-f',
    30,
    {
      marker: 'That',
      subject: det('the', 'wiring'),
      verb: v('failed', 'fail', 'Vint'),
      kind: 'nominal',
    },
    v('worried', 'worry', 'Vtr'),
    det('the', 'inspector'),
    'The wiring giving out troubled the inspector.',
  ),
  svo(
    'c30-g',
    30,
    det('That', 'storm'),
    v('surprised', 'surprise', 'Vtr'),
    det('the', 'driver'),
    'The storm mentioned before took the driver aback.',
  ),
  clauseSubject(
    'c30-h',
    30,
    {
      marker: 'That',
      subject: det('the', 'storm'),
      verb: v('arrived', 'arrive', 'Vint'),
      kind: 'nominal',
    },
    v('surprised', 'surprise', 'Vtr'),
    det('the', 'driver'),
    'The storm turning up took the driver aback.',
  ),
  clauseSubjectIs(
    'c30-i',
    30,
    {
      marker: 'That',
      subject: det('the', 'talks'),
      verb: v('collapsed', 'collapse', 'Vint'),
      kind: 'nominal',
    },
    v('seemed', 'seem', 'Vlink'),
    adj('unlikely'),
    'The talks breaking down looked improbable.',
  ),
  clauseSubject(
    'c30-j',
    30,
    {
      marker: 'That',
      subject: det('the', 'archive'),
      verb: v('flooded', 'flood', 'Vint'),
      kind: 'nominal',
    },
    v('angered', 'anger', 'Vtr'),
    det('the', 'trustees'),
    'The archive filling with water made the trustees cross.',
  ),
];
