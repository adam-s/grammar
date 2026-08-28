/**
 * Lesson 29 — Adverbial clauses.
 *
 * The subordinator announces the job before the clause arrives: it marks the
 * clause and is not one of the parts the clause is built from.
 *
 * The MAIN clause varies. An adverbial clause can hang off any of the verb
 * types, and ten sentences whose main clause was always S V would have taught
 * that it cannot — while quietly retiring lessons 9 to 13.
 */
import { adj, det, pron, svWhy, svcWhy, svoWhy, v } from './shape.ts';

const when = (marker: string, subject: ReturnType<typeof det>, verb: ReturnType<typeof v>) => ({
  marker,
  subject,
  verb,
  kind: 'adverbial' as const,
});

export const LESSON_29 = [
  svWhy(
    'c29-a',
    29,
    det('The', 'ferry'),
    v('waited', 'wait', 'Vint'),
    when('because', det('the', 'tide'), v('turned', 'turn', 'Vint')),
    'A turning tide is why the ferry waited.',
  ),
  svoWhy(
    'c29-b',
    29,
    det('The', 'crew'),
    v('cleared', 'clear', 'Vtr'),
    det('the', 'track'),
    when('after', det('the', 'storm'), v('passed', 'pass', 'Vint')),
    'Once the storm was over the crew cleared the track.',
  ),
  svWhy(
    'c29-c',
    29,
    det('The', 'crowd'),
    v('dispersed', 'disperse', 'Vint'),
    when('after', det('the', 'speaker'), v('left', 'leave', 'Vint')),
    'The crowd broke up once the speaker had gone.',
  ),
  svcWhy(
    'c29-d',
    29,
    det('The', 'room'),
    v('stayed', 'stay', 'Vlink'),
    adj('cold'),
    when('until', det('the', 'fire'), v('caught', 'catch', 'Vint')),
    'The room was cold until the fire took.',
  ),
  svWhy(
    'c29-e',
    29,
    det('The', 'pipes'),
    v('burst', 'burst', 'Vint'),
    when('because', det('the', 'water'), v('froze', 'freeze', 'Vint')),
    'Frozen water is why the pipes split.',
  ),
  svoWhy(
    'c29-f',
    29,
    det('The', 'board'),
    v('approved', 'approve', 'Vtr'),
    det('the', 'plan'),
    when('when', det('the', 'auditor'), v('reported', 'report', 'Vint')),
    'The auditor reported and then the board approved.',
  ),
  svWhy(
    'c29-g',
    29,
    det('The', 'engine'),
    v('restarted', 'restart', 'Vint'),
    when('once', det('the', 'belt'), v('cooled', 'cool', 'Vint')),
    'A cooled belt let the engine start again.',
  ),
  svcWhy(
    'c29-h',
    29,
    det('The', 'evidence'),
    v('seemed', 'seem', 'Vlink'),
    adj('thin'),
    when('after', det('the', 'witness'), v('hesitated', 'hesitate', 'Vint')),
    'The pause made the evidence look thin.',
  ),
  svWhy(
    'c29-i',
    29,
    pron('They'),
    v('objected', 'object', 'Vint'),
    when('because', det('the', 'boundary'), v('shifted', 'shift', 'Vint')),
    'A moved boundary is why they objected.',
  ),
  svWhy(
    'c29-j',
    29,
    det('The', 'shutters'),
    v('rattled', 'rattle', 'Vint'),
    when('whenever', det('the', 'wind'), v('rose', 'rise', 'Vint')),
    'Rising wind always shook the shutters.',
  ),
];
