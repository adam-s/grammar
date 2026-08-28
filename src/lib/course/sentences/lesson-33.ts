/**
 * Lesson 33 — Coordination between clauses.
 *
 * The same joining lesson 26 did inside a noun phrase, done to whole clauses.
 * The outer sentence joins rather than predicates: it has no verb of its own,
 * and each clause inside answers for itself.
 *
 * Which is exactly why the joined clauses do not all have the same shape here.
 * If each of them answers for itself then one can be S V and the next S V O,
 * and ten pairs of matching intransitives would have hidden that.
 */
import { adj, det, joined, v } from './shape.ts';

export const LESSON_33 = [
  joined(
    'c33-a',
    33,
    { subject: det('The', 'kettle'), verb: v('boiled', 'boil', 'Vint') },
    'and',
    { subject: det('the', 'lights'), verb: v('dimmed', 'dim', 'Vint') },
    'The kettle came to the boil, and the lights went dim.',
  ),
  joined(
    'c33-b',
    33,
    { subject: det('The', 'engine'), verb: v('stalled', 'stall', 'Vint') },
    'and',
    {
      subject: det('the', 'driver'),
      verb: v('called', 'call', 'Vtr'),
      object: det('a', 'mechanic'),
    },
    'The engine stopped, so the driver sent for a mechanic.',
  ),
  joined(
    'c33-c',
    33,
    { subject: det('The', 'tide'), verb: v('turned', 'turn', 'Vint') },
    'but',
    { subject: det('the', 'ferry'), verb: v('waited', 'wait', 'Vint') },
    'The tide changed, but the ferry stayed where it was.',
  ),
  joined(
    'c33-d',
    33,
    { subject: det('The', 'rain'), verb: v('eased', 'ease', 'Vint') },
    'and',
    {
      subject: det('the', 'streets'),
      verb: v('were', 'be', 'Vbe'),
      complement: adj('passable'),
    },
    'The rain let up, and the streets could be used again.',
  ),
  joined(
    'c33-e',
    33,
    { subject: det('The', 'pipe'), verb: v('froze', 'freeze', 'Vint') },
    'and',
    { subject: det('the', 'ceiling'), verb: v('cracked', 'crack', 'Vint') },
    'The pipe froze, and a crack opened in the ceiling.',
  ),
  joined(
    'c33-f',
    33,
    {
      subject: det('The', 'clerk'),
      verb: v('read', 'read', 'Vtr'),
      object: det('the', 'minute'),
    },
    'but',
    { subject: det('the', 'board'), verb: v('proceeded', 'proceed', 'Vint') },
    'The clerk read the minute out, and the board went ahead anyway.',
  ),
  joined(
    'c33-g',
    33,
    { subject: det('The', 'talks'), verb: v('resumed', 'resume', 'Vint') },
    'and',
    { subject: det('the', 'strike'), verb: v('ended', 'end', 'Vint') },
    'Talks restarting ended the strike.',
  ),
  joined(
    'c33-h',
    33,
    { subject: det('That', 'lock'), verb: v('rusted', 'rust', 'Vint') },
    'and',
    {
      subject: det('the', 'gate'),
      verb: v('was', 'be', 'Vbe'),
      complement: adj('immovable'),
    },
    'A rusted lock jammed the gate.',
  ),
  joined(
    'c33-i',
    33,
    { subject: det('The', 'quartet'), verb: v('rehearsed', 'rehearse', 'Vint') },
    'but',
    { subject: det('the', 'audience'), verb: v('left', 'leave', 'Vint') },
    'The audience left despite the rehearsal.',
  ),
  joined(
    'c33-j',
    33,
    { subject: det('The', 'snow'), verb: v('melted', 'melt', 'Vint') },
    'and',
    { subject: det('the', 'river'), verb: v('rose', 'rise', 'Vint') },
    'Melting snow raised the river.',
  ),
];
