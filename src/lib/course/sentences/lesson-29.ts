/**
 * Lesson 29 — Adverbial clauses.
 *
 * The subordinator announces the job before the clause arrives: it marks the
 * clause and is not one of the parts the clause is built from.
 */
import { det, pron, svWhy, v } from './shape.ts';

export const LESSON_29 = [
  svWhy(
    'c29-a',
    29,
    det('The', 'ferry'),
    v('waited', 'wait', 'Vint'),
    {
      marker: 'because',
      subject: det('the', 'tide'),
      verb: v('turned', 'turn', 'Vint'),
      kind: 'adverbial',
    },
    'A turning tide is why the ferry waited.',
  ),
  svWhy(
    'c29-b',
    29,
    det('The', 'lights'),
    v('failed', 'fail', 'Vint'),
    {
      marker: 'when',
      subject: det('the', 'storm'),
      verb: v('arrived', 'arrive', 'Vint'),
      kind: 'adverbial',
    },
    'The lights went out at the storm.',
  ),
  svWhy(
    'c29-c',
    29,
    det('The', 'crowd'),
    v('dispersed', 'disperse', 'Vint'),
    {
      marker: 'after',
      subject: det('the', 'speaker'),
      verb: v('left', 'leave', 'Vint'),
      kind: 'adverbial',
    },
    'The crowd broke up once the speaker had gone.',
  ),
  svWhy(
    'c29-d',
    29,
    pron('She'),
    v('waited', 'wait', 'Vint'),
    {
      marker: 'until',
      subject: det('the', 'rain'),
      verb: v('stopped', 'stop', 'Vint'),
      kind: 'adverbial',
    },
    'She stayed put until the rain ended.',
  ),
  svWhy(
    'c29-e',
    29,
    det('The', 'pipes'),
    v('burst', 'burst', 'Vint'),
    {
      marker: 'because',
      subject: det('the', 'water'),
      verb: v('froze', 'freeze', 'Vint'),
      kind: 'adverbial',
    },
    'Frozen water is why the pipes split.',
  ),
  svWhy(
    'c29-f',
    29,
    det('The', 'talks'),
    v('collapsed', 'collapse', 'Vint'),
    {
      marker: 'before',
      subject: det('the', 'deadline'),
      verb: v('passed', 'pass', 'Vint'),
      kind: 'adverbial',
    },
    'The talks broke down ahead of the deadline.',
  ),
  svWhy(
    'c29-g',
    29,
    det('The', 'engine'),
    v('restarted', 'restart', 'Vint'),
    {
      marker: 'once',
      subject: det('the', 'belt'),
      verb: v('cooled', 'cool', 'Vint'),
      kind: 'adverbial',
    },
    'A cooled belt let the engine start again.',
  ),
  svWhy(
    'c29-h',
    29,
    det('The', 'audience'),
    v('applauded', 'applaud', 'Vint'),
    {
      marker: 'when',
      subject: det('the', 'quartet'),
      verb: v('finished', 'finish', 'Vint'),
      kind: 'adverbial',
    },
    'The audience clapped at the end.',
  ),
  svWhy(
    'c29-i',
    29,
    pron('They'),
    v('objected', 'object', 'Vint'),
    {
      marker: 'because',
      subject: det('the', 'boundary'),
      verb: v('shifted', 'shift', 'Vint'),
      kind: 'adverbial',
    },
    'A moved boundary is why they objected.',
  ),
  svWhy(
    'c29-j',
    29,
    det('The', 'shutters'),
    v('rattled', 'rattle', 'Vint'),
    {
      marker: 'whenever',
      subject: det('the', 'wind'),
      verb: v('rose', 'rise', 'Vint'),
      kind: 'adverbial',
    },
    'Rising wind always shook the shutters.',
  ),
];
