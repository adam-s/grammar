/**
 * Lesson 39 — Punctuation is evidence.
 *
 * The comma is a reason to try a reading, not the reading itself. Here it
 * separates two coordinated clauses, and the tree is what says so: the comma
 * takes no label and joins nothing. Compare these with lesson 33's, which are
 * the same sentences without it.
 */
import { det, joined, v } from './shape.ts';

export const LESSON_39 = [
  joined(
    'c39-a',
    39,
    {
      subject: det('The', 'surveyor'),
      verb: v('measured', 'measure', 'Vtr'),
      object: det('the', 'field'),
    },
    'and',
    {
      subject: det('the', 'clerk'),
      verb: v('recorded', 'record', 'Vtr'),
      object: det('the', 'result'),
    },
    'Two people each did a job.',
    true,
  ),
  joined(
    'c39-b',
    39,
    {
      subject: det('The', 'porter'),
      verb: v('stacked', 'stack', 'Vtr'),
      object: det('the', 'crates'),
    },
    'and',
    {
      subject: det('the', 'driver'),
      verb: v('signed', 'sign', 'Vtr'),
      object: det('the', 'docket'),
    },
    'Each did their own task.',
    true,
  ),
  joined(
    'c39-c',
    39,
    {
      subject: det('The', 'auditor'),
      verb: v('checked', 'check', 'Vtr'),
      object: det('the', 'ledger'),
    },
    'but',
    {
      subject: det('the', 'board'),
      verb: v('ignored', 'ignore', 'Vtr'),
      object: det('the', 'warning'),
    },
    'The board disregarded the check.',
    true,
  ),
  joined(
    'c39-d',
    39,
    {
      subject: det('The', 'nurse'),
      verb: v('carried', 'carry', 'Vtr'),
      object: det('the', 'tray'),
    },
    'and',
    { subject: det('the', 'porter'), verb: v('opened', 'open', 'Vtr'), object: det('the', 'door') },
    'They worked together.',
    true,
  ),
  joined(
    'c39-e',
    39,
    {
      subject: det('The', 'jury'),
      verb: v('heard', 'hear', 'Vtr'),
      object: det('the', 'evidence'),
    },
    'and',
    {
      subject: det('the', 'judge'),
      verb: v('reviewed', 'review', 'Vtr'),
      object: det('the', 'case'),
    },
    'Both stages happened.',
    true,
  ),
  joined(
    'c39-f',
    39,
    { subject: det('The', 'baker'), verb: v('opened', 'open', 'Vtr'), object: det('the', 'shop') },
    'but',
    {
      subject: det('the', 'queue'),
      verb: v('blocked', 'block', 'Vtr'),
      object: det('the', 'street'),
    },
    'Opening caused a blockage.',
    true,
  ),
  joined(
    'c39-g',
    39,
    {
      subject: det('The', 'crew'),
      verb: v('cleared', 'clear', 'Vtr'),
      object: det('the', 'track'),
    },
    'and',
    { subject: det('the', 'guard'), verb: v('waved', 'wave', 'Vtr'), object: det('the', 'flag') },
    'The track was cleared and signalled.',
    true,
  ),
  joined(
    'c39-h',
    39,
    {
      subject: det('The', 'landlord'),
      verb: v('raised', 'raise', 'Vtr'),
      object: det('the', 'rent'),
    },
    'and',
    {
      subject: det('the', 'tenants'),
      verb: v('left', 'leave', 'Vtr'),
      object: det('the', 'building'),
    },
    'The rise emptied the building.',
    true,
  ),
  joined(
    'c39-i',
    39,
    {
      subject: det('The', 'inspector'),
      verb: v('tested', 'test', 'Vtr'),
      object: det('the', 'wiring'),
    },
    'and',
    { subject: det('the', 'clerk'), verb: v('filed', 'file', 'Vtr'), object: det('the', 'report') },
    'Test then paperwork.',
    true,
  ),
  joined(
    'c39-j',
    39,
    {
      subject: det('The', 'quartet'),
      verb: v('finished', 'finish', 'Vtr'),
      object: det('the', 'piece'),
    },
    'and',
    {
      subject: det('the', 'audience'),
      verb: v('left', 'leave', 'Vtr'),
      object: det('the', 'hall'),
    },
    'The piece ended and people went.',
    true,
  ),
];
