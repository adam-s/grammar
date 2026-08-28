/**
 * Lesson 34 — Infinitive clauses. What the clause holds of its own.
 *
 * No infinitive clause anywhere in the course has an overt subject, so nothing
 * shows that an infinitive clause is a CLAUSE at all — every example has an
 * invisible subject matching the main one, which makes *to renew the lease* look
 * like part of the verb phrase.
 *
 * That gap is open on purpose. *We asked the driver to wait* was built here for
 * a while, with the infinitive as an `objectComplement`, and the label was wrong:
 * an object complement renames or describes the direct object, and *to wait*
 * says what the driver is to do. Object control needs a representation the model
 * does not have; README.md and docs/course/difficulty.md carry the question.
 *
 * What the lesson can show is material INSIDE the clause: *The driver promised to
 * wait outside* puts an adverbial there and *The council agreed to fund the
 * repairs* an object. *The box was too heavy to lift* puts the whole infinitive
 * inside an adjective phrase, which difficulty.md assigns here.
 */
import { adjWithCl, adv, det, pron, svClause, v } from './shape.ts';

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
  svClause(
    'c34-c',
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
    'c34-d',
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
  svClause(
    'c34-e',
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
    'c34-f',
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
  svClause(
    'c34-g',
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
    'c34-h',
    34,
    det('The', 'driver'),
    v('promised', 'promise', 'Vtr'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('wait', 'wait', 'Vint'),
      adverbial: adv('outside'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'The driver gave his word that he would stay out there.',
  ),
  svClause(
    'c34-i',
    34,
    det('The', 'council'),
    v('agreed', 'agree', 'Vtr'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('fund', 'fund', 'Vtr'),
      object: det('the', 'repairs'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'The council settled on paying for the work.',
  ),
  adjWithCl(
    'c34-j',
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
];
