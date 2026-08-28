/**
 * Lesson 33 — Coordination between clauses.
 *
 * The same joining lesson 26 did inside a noun phrase, done to whole clauses.
 * The outer sentence joins rather than predicates: it has no verb of its own,
 * and each clause inside answers for itself.
 */
import { det, joined, v } from './shape.ts';

export const LESSON_33 = [
  joined(
    'c33-a',
    33,
    { subject: det('The', 'kettle'), verb: v('boiled', 'boil', 'Vint') },
    'and',
    { subject: det('the', 'lights'), verb: v('dimmed', 'dim', 'Vint') },
    'Both things happened.',
  ),
  joined(
    'c33-b',
    33,
    { subject: det('The', 'engine'), verb: v('stalled', 'stall', 'Vint') },
    'and',
    { subject: det('the', 'car'), verb: v('stopped', 'stop', 'Vint') },
    'One followed the other.',
  ),
  joined(
    'c33-c',
    33,
    { subject: det('The', 'tide'), verb: v('turned', 'turn', 'Vint') },
    'but',
    { subject: det('the', 'ferry'), verb: v('waited', 'wait', 'Vint') },
    'The second happened despite the first.',
  ),
  joined(
    'c33-d',
    33,
    { subject: det('The', 'rain'), verb: v('eased', 'ease', 'Vint') },
    'and',
    { subject: det('the', 'crowd'), verb: v('returned', 'return', 'Vint') },
    'The crowd came back once the rain let up.',
  ),
  joined(
    'c33-e',
    33,
    { subject: det('The', 'pipe'), verb: v('froze', 'freeze', 'Vint') },
    'and',
    { subject: det('the', 'ceiling'), verb: v('cracked', 'crack', 'Vint') },
    'Both damages occurred.',
  ),
  joined(
    'c33-f',
    33,
    { subject: det('The', 'clerk'), verb: v('objected', 'object', 'Vint') },
    'but',
    { subject: det('the', 'board'), verb: v('proceeded', 'proceed', 'Vint') },
    'The board went ahead anyway.',
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
    { subject: det('The', 'lock'), verb: v('rusted', 'rust', 'Vint') },
    'and',
    { subject: det('the', 'gate'), verb: v('jammed', 'jam', 'Vint') },
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
