/**
 * Lesson 34 — Infinitive clauses. With subjects of their own.
 *
 * No infinitive clause anywhere in the course had an overt subject, so nothing
 * showed that an infinitive clause is a CLAUSE at all — every example had an
 * invisible subject matching the main one, which makes *to renew the lease* look
 * like part of the verb phrase.
 *
 * In item 4, *the driver* is the object of *asked* AND the subject of *to wait*,
 * and that is only visible once the clause has a subject. Item 8 puts the
 * infinitive inside an adjective phrase, which difficulty.md assigns here.
 */
import { adjWithCl, det, pron, svClause, svoClause, v } from './shape.ts';

export const LESSON_34 = [
  svClause(
    'c34-a',
    34,
    det('The', 'tenant'),
    v('wanted', 'want', 'Vtr'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('renew', 'renew', 'Vtr'),
      object: det('the', 'lease'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'The tenant hoped for another term on the lease.',
  ),
  svClause(
    'c34-b',
    34,
    pron('She'),
    v('hoped', 'hope', 'Vtr'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('finish', 'finish', 'Vtr'),
      object: det('the', 'survey'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'She wanted the survey done.',
  ),
  svClause(
    'c34-c',
    34,
    det('Our', 'crew'),
    v('tried', 'try', 'Vtr'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('restart', 'restart', 'Vtr'),
      object: det('the', 'engine'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'The crew made an attempt at getting the engine going.',
  ),
  svoClause(
    'c34-d',
    34,
    pron('We'),
    v('asked', 'ask', 'Vc'),
    det('the', 'driver'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('wait', 'wait', 'Vint'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'We put it to the driver that he should stay put.',
  ),
  svoClause(
    'c34-e',
    34,
    det('The', 'guide'),
    v('expected', 'expect', 'Vc'),
    det('the', 'visitors'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('arrive', 'arrive', 'Vint'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'The guide reckoned the visitors would turn up.',
  ),
  svClause(
    'c34-f',
    34,
    det('The', 'clerk'),
    v('refused', 'refuse', 'Vtr'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('sign', 'sign', 'Vtr'),
      object: det('the', 'deed'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'The clerk would not put a name to the deed.',
  ),
  svClause(
    'c34-g',
    34,
    pron('They'),
    v('planned', 'plan', 'Vtr'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('dredge', 'dredge', 'Vtr'),
      object: det('that', 'harbour'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'They meant to clear the harbour bed.',
  ),
  adjWithCl(
    'c34-h',
    34,
    det('The', 'box'),
    v('was', 'be', 'Vbe'),
    'too',
    'heavy',
    {
      marker: 'to',
      infinitival: true,
      verb: v('lift', 'lift', 'Vtr'),
      objectGap: true,
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'The box weighed more than anyone could raise.',
  ),
  svClause(
    'c34-i',
    34,
    pron('He'),
    v('offered', 'offer', 'Vtr'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('clear', 'clear', 'Vtr'),
      object: det('the', 'path'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'He put himself forward to free the path.',
  ),
  svClause(
    'c34-j',
    34,
    det('That', 'jury'),
    v('declined', 'decline', 'Vtr'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('accept', 'accept', 'Vtr'),
      object: det('the', 'claim'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'The jury would not allow the claim.',
  ),
];
