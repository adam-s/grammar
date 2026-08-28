/**
 * Lesson 28 — Main and dependent clauses.
 *
 * *the belt broke* is a whole sentence by shape and is not the sentence here:
 * it is what she knew. A clause can sit inside another clause and take a job
 * there, the same way a noun phrase does.
 */
import { det, pron, svClause, v } from './shape.ts';

export const LESSON_28 = [
  svClause(
    'c28-a',
    28,
    pron('She'),
    v('knew', 'know', 'Vtr'),
    { subject: det('the', 'belt'), verb: v('broke', 'break', 'Vint'), kind: 'nominal' },
    'She was aware that the belt had broken.',
  ),
  svClause(
    'c28-b',
    28,
    det('The', 'driver'),
    v('said', 'say', 'Vtr'),
    { subject: det('the', 'engine'), verb: v('stalled', 'stall', 'Vint'), kind: 'nominal' },
    'The driver reported a stalled engine.',
  ),
  svClause(
    'c28-c',
    28,
    det('Another', 'surveyor'),
    v('reported', 'report', 'Vtr'),
    { subject: det('the', 'wall'), verb: v('leaned', 'lean', 'Vint'), kind: 'nominal' },
    'Another surveyor reported a leaning wall.',
  ),
  svClause(
    'c28-d',
    28,
    pron('He'),
    v('discovered', 'discover', 'Vtr'),
    { subject: det('the', 'archive'), verb: v('flooded', 'flood', 'Vint'), kind: 'nominal' },
    'He found out about the flooded archive.',
  ),
  svClause(
    'c28-e',
    28,
    det('The', 'clerk'),
    v('confirmed', 'confirm', 'Vtr'),
    { subject: det('the', 'deeds'), verb: v('existed', 'exist', 'Vint'), kind: 'nominal' },
    'The clerk confirmed the deeds were real.',
  ),
  svClause(
    'c28-f',
    28,
    pron('They'),
    v('assumed', 'assume', 'Vtr'),
    { subject: det('the', 'ferry'), verb: v('sailed', 'sail', 'Vint'), kind: 'nominal' },
    'They took it that the ferry had gone.',
  ),
  svClause(
    'c28-g',
    28,
    det('The', 'inspector'),
    v('noticed', 'notice', 'Vtr'),
    { subject: det('the', 'wiring'), verb: v('smoked', 'smoke', 'Vint'), kind: 'nominal' },
    'The inspector saw smoke from the wiring.',
  ),
  svClause(
    'c28-h',
    28,
    det('The', 'jury'),
    v('accepted', 'accept', 'Vtr'),
    { subject: det('the', 'witness'), verb: v('hesitated', 'hesitate', 'Vint'), kind: 'nominal' },
    'The jury accepted that the witness had paused.',
  ),
  svClause(
    'c28-i',
    28,
    pron('We'),
    v('forgot', 'forget', 'Vtr'),
    { subject: det('the', 'tide'), verb: v('turned', 'turn', 'Vint'), kind: 'nominal' },
    'We failed to remember the turning tide.',
  ),
  svClause(
    'c28-j',
    28,
    det('Her', 'landlord'),
    v('denied', 'deny', 'Vtr'),
    { subject: det('the', 'roof'), verb: v('leaked', 'leak', 'Vint'), kind: 'nominal' },
    'Her landlord said the roof did not leak.',
  ),
];
