/**
 * Lesson 34 — Infinitive clauses.
 *
 * *to renew* has a verb and no tense: you cannot change it to *renewed*
 * without breaking the sentence. The *to* marks the clause rather than
 * belonging to the verb, which is what separates it from lesson 25's particle.
 */
import { det, pron, svClause, v } from './shape.ts';

const to = {
  marker: 'to',
  infinitival: true as const,
  kind: 'nominal' as const,
  finiteness: 'infinitival' as const,
};

export const LESSON_34 = [
  svClause(
    'c34-a',
    34,
    det('The', 'tenant'),
    v('wanted', 'want', 'Vtr'),
    { ...to, verb: v('renew', 'renew', 'Vtr'), object: det('the', 'lease') },
    'What the tenant wanted was to renew the lease.',
  ),
  svClause(
    'c34-b',
    34,
    det('The', 'board'),
    v('agreed', 'agree', 'Vtr'),
    { ...to, verb: v('fund', 'fund', 'Vtr'), object: det('the', 'repair') },
    'The board settled on funding the repair.',
  ),
  svClause(
    'c34-c',
    34,
    pron('She'),
    v('hoped', 'hope', 'Vtr'),
    { ...to, verb: v('finish', 'finish', 'Vtr'), object: det('the', 'survey') },
    'Her hope was to finish the survey.',
  ),
  svClause(
    'c34-d',
    34,
    det('The', 'crew'),
    v('tried', 'try', 'Vtr'),
    { ...to, verb: v('restart', 'restart', 'Vtr'), object: det('the', 'engine') },
    'They made an attempt at restarting it.',
  ),
  svClause(
    'c34-e',
    34,
    det('The', 'clerk'),
    v('refused', 'refuse', 'Vtr'),
    { ...to, verb: v('sign', 'sign', 'Vtr'), object: det('the', 'deed') },
    'The clerk would not sign.',
  ),
  svClause(
    'c34-f',
    34,
    pron('They'),
    v('planned', 'plan', 'Vtr'),
    { ...to, verb: v('dredge', 'dredge', 'Vtr'), object: det('the', 'harbour') },
    'Their plan was to dredge the harbour.',
  ),
  svClause(
    'c34-g',
    34,
    det('The', 'landlord'),
    v('threatened', 'threaten', 'Vtr'),
    { ...to, verb: v('raise', 'raise', 'Vtr'), object: det('the', 'rent') },
    'The landlord made a threat about the rent.',
  ),
  svClause(
    'c34-h',
    34,
    det('The', 'jury'),
    v('declined', 'decline', 'Vtr'),
    { ...to, verb: v('accept', 'accept', 'Vtr'), object: det('the', 'claim') },
    'The jury would not accept it.',
  ),
  svClause(
    'c34-i',
    34,
    pron('He'),
    v('offered', 'offer', 'Vtr'),
    { ...to, verb: v('clear', 'clear', 'Vtr'), object: det('the', 'path') },
    'His offer was to clear the path.',
  ),
  svClause(
    'c34-j',
    34,
    det('Several', 'trustees'),
    v('voted', 'vote', 'Vtr'),
    { ...to, verb: v('close', 'close', 'Vtr'), object: det('the', 'archive') },
    'The trustees decided by vote to close it.',
  ),
];
