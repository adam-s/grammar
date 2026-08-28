/**
 * Lesson 28 — Main and dependent clauses. The stage turn.
 *
 * Up to here each target sentence had one clause; from here one clause can sit
 * inside another. Every nominal clause here is marker-less, because
 * `form:Subord` arrives at lesson 29 — scope working, not an oversight — and
 * lesson 30 is where the marker and the position stop moving together.
 *
 * Item 8 is the difficulty the lesson can have before the marker exists: *The
 * jury accepted the witness* is a complete sentence, so the learner has to read
 * to the end before deciding whether *the witness* is an object or the subject
 * of something.
 */
import { adj, adjn, adv, det, pron, svClause, v } from './shape.ts';

export const LESSON_28 = [
  svClause(
    'c28-a',
    28,
    det('The', 'driver'),
    v('said', 'say', 'Vtr'),
    { subject: det('the', 'engine'), verb: v('stalled', 'stall', 'Vint'), kind: 'nominal' },
    'The driver reported the engine had cut out.',
  ),
  svClause(
    'c28-b',
    28,
    det('The', 'clerk'),
    v('confirmed', 'confirm', 'Vtr'),
    { subject: det('the', 'deeds'), verb: v('existed', 'exist', 'Vint'), kind: 'nominal' },
    'The clerk verified the deeds were real.',
  ),
  svClause(
    'c28-c',
    28,
    det('The', 'nurse'),
    v('thought', 'think', 'Vtr'),
    { subject: det('the', 'baby'), verb: v('slept', 'sleep', 'Vint'), kind: 'nominal' },
    'The nurse believed the baby was asleep.',
  ),
  svClause(
    'c28-d',
    28,
    det('An', 'inspector'),
    v('noticed', 'notice', 'Vtr'),
    { subject: det('the', 'wiring'), verb: v('smoked', 'smoke', 'Vint'), kind: 'nominal' },
    'An inspector saw the wiring giving off smoke.',
  ),
  svClause(
    'c28-e',
    28,
    det('The', 'jury'),
    v('accepted', 'accept', 'Vtr'),
    { subject: det('the', 'witness'), verb: v('hesitated', 'hesitate', 'Vint'), kind: 'nominal' },
    'The jury allowed that the witness had held back.',
  ),
  svClause(
    'c28-f',
    28,
    pron('She'),
    v('knew', 'know', 'Vtr'),
    { subject: det('the', 'belt'), verb: v('broke', 'break', 'Vint'), kind: 'nominal' },
    'She was aware the belt had broken.',
  ),
  svClause(
    'c28-g',
    28,
    pron('They'),
    v('assumed', 'assume', 'Vtr'),
    { subject: det('the', 'ferry'), verb: v('sailed', 'sail', 'Vint'), kind: 'nominal' },
    'They took it that the ferry had gone.',
  ),
  svClause(
    'c28-h',
    28,
    pron('He'),
    v('discovered', 'discover', 'Vtr'),
    { subject: det('the', 'archive'), verb: v('flooded', 'flood', 'Vint'), kind: 'nominal' },
    'He found out the archive had filled with water.',
  ),
  svClause(
    'c28-i',
    28,
    pron('She'),
    v('knew', 'know', 'Vtr'),
    {
      subject: adjn('the', 'old', 'belt'),
      verb: v('broke', 'break', 'Vint'),
      adverbial: adv('yesterday'),
      kind: 'nominal',
    },
    'She was aware the worn belt had broken the day before.',
  ),
  svClause(
    'c28-j',
    28,
    det('Our', 'guide'),
    v('said', 'say', 'Vtr'),
    {
      subject: adjn('the', 'narrow', 'bridge'),
      verb: v('was', 'be', 'Vbe'),
      complement: adj('safe'),
      kind: 'nominal',
    },
    'Our guide reported the tight bridge could be crossed.',
  ),
];
