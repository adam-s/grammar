/**
 * Lesson 33 — Coordination between clauses. All three coordinators.
 *
 * The built set had seven *and* and three *but* and no *or*, and no comma
 * anywhere — the last deliberately, because lesson 39 is built on the same
 * shapes WITH commas and the two lessons are a controlled pair. That pairing is
 * the only punctuation contrast in the course and is kept exactly.
 *
 * Both halves stand alone, which is what separates coordination from
 * subordination: lesson 29's *because the gate was locked* cannot.
 */
import { det, joined, pron, v } from './shape.ts';

export const LESSON_33 = [
  joined(
    'c33-a',
    33,
    { subject: pron('We'), verb: v('waited', 'wait', 'Vint') },
    'or',
    { subject: pron('they'), verb: v('left', 'leave', 'Vint') },
    'Either we stayed put or they went.',
  ),
  joined(
    'c33-b',
    33,
    { subject: det('The', 'kettle'), verb: v('boiled', 'boil', 'Vint') },
    'and',
    { subject: det('the', 'lights'), verb: v('dimmed', 'dim', 'Vint') },
    'The kettle came to the boil and the lights went down.',
  ),
  joined(
    'c33-c',
    33,
    { subject: det('The', 'tide'), verb: v('turned', 'turn', 'Vint') },
    'but',
    { subject: det('the', 'ferry'), verb: v('waited', 'wait', 'Vint') },
    'The tide changed, and even so the ferry stayed put.',
  ),
  joined(
    'c33-d',
    33,
    { subject: det('The', 'rain'), verb: v('eased', 'ease', 'Vint') },
    'and',
    { subject: det('the', 'streets'), verb: v('dried', 'dry', 'Vint') },
    'The rain let up and the streets lost their water.',
  ),
  joined(
    'c33-e',
    33,
    { subject: det('The', 'talks'), verb: v('resumed', 'resume', 'Vint') },
    'and',
    { subject: det('the', 'strike'), verb: v('ended', 'end', 'Vint') },
    'The talks started again and the strike finished.',
  ),
  joined(
    'c33-f',
    33,
    { subject: det('The', 'snow'), verb: v('melted', 'melt', 'Vint') },
    'and',
    { subject: det('the', 'river'), verb: v('rose', 'rise', 'Vint') },
    'The snow thawed and the river came up.',
  ),
  joined(
    'c33-g',
    33,
    { subject: det('That', 'lock'), verb: v('rusted', 'rust', 'Vint') },
    'and',
    { subject: det('the', 'gate'), verb: v('jammed', 'jam', 'Vint') },
    'That lock corroded and the gate stuck fast.',
  ),
  joined(
    'c33-h',
    33,
    { subject: det('The', 'quartet'), verb: v('rehearsed', 'rehearse', 'Vint') },
    'but',
    { subject: det('the', 'audience'), verb: v('left', 'leave', 'Vint') },
    'The quartet practised, and even so the listeners went.',
  ),
  joined(
    'c33-i',
    33,
    { subject: det('The', 'engine'), verb: v('stalled', 'stall', 'Vint') },
    'and',
    {
      subject: det('the', 'driver'),
      verb: v('called', 'call', 'Vtr'),
      object: det('a', 'mechanic'),
    },
    'The engine cut out and the driver rang for help.',
  ),
  joined(
    'c33-j',
    33,
    { subject: det('The', 'clerk'), verb: v('read', 'read', 'Vtr'), object: det('the', 'minute') },
    'but',
    { subject: det('the', 'board'), verb: v('proceeded', 'proceed', 'Vint') },
    'The clerk went through the minute, and even so the board carried on.',
  ),
];
