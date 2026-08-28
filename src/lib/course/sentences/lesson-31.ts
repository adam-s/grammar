/**
 * Lesson 31 — Relative clauses.
 *
 * A postmodifier, the same job lesson 21 gave a prepositional phrase, done by
 * a clause instead. Its subject slot is empty and the noun it modifies is what
 * fills it, which is what the gap after *that* records.
 *
 * The main verbs vary. A relative clause modifies a noun phrase wherever that
 * phrase sits, and *the engine that stalled was old* is as ordinary as
 * anything transitive.
 */
import { adj, det, modifiedBy, sv, svc, svo, v } from './shape.ts';

export const LESSON_31 = [
  svo(
    'c31-a',
    31,
    det('The', 'inspector'),
    v('questioned', 'question', 'Vtr'),
    modifiedBy('the', 'driver', {
      marker: 'that',
      subjectGap: true,
      verb: v('complained', 'complain', 'Vint'),
      kind: 'relative',
    }),
    'The inspector questioned the driver who had complained.',
  ),
  svc(
    'c31-b',
    31,
    modifiedBy('The', 'engine', {
      marker: 'that',
      subjectGap: true,
      verb: v('stalled', 'stall', 'Vint'),
      kind: 'relative',
    }),
    v('was', 'be', 'Vbe'),
    adj('old'),
    'The engine which had stalled was an old one.',
  ),
  sv(
    'c31-c',
    31,
    modifiedBy('Another', 'witness', {
      marker: 'who',
      subjectGap: true,
      verb: v('hesitated', 'hesitate', 'Vint'),
      kind: 'relative',
    }),
    v('returned', 'return', 'Vint'),
    'Another witness who had paused came back.',
  ),
  svo(
    'c31-d',
    31,
    det('The', 'clerk'),
    v('filed', 'file', 'Vtr'),
    modifiedBy('the', 'report', {
      marker: 'that',
      subjectGap: true,
      verb: v('arrived', 'arrive', 'Vint'),
      kind: 'relative',
    }),
    'The clerk filed the report that had come.',
  ),
  sv(
    'c31-e',
    31,
    modifiedBy('The', 'pipe', {
      marker: 'that',
      subjectGap: true,
      verb: v('froze', 'freeze', 'Vint'),
      kind: 'relative',
    }),
    v('burst', 'burst', 'Vint'),
    'The pipe which froze then split.',
  ),
  svo(
    'c31-f',
    31,
    det('The', 'jury'),
    v('believed', 'believe', 'Vtr'),
    modifiedBy('the', 'surveyor', {
      marker: 'who',
      subjectGap: true,
      verb: v('testified', 'testify', 'Vint'),
      kind: 'relative',
    }),
    'The jury believed the surveyor who gave evidence.',
  ),
  svc(
    'c31-g',
    31,
    modifiedBy('The', 'ferry', {
      marker: 'that',
      subjectGap: true,
      verb: v('sailed', 'sail', 'Vint'),
      kind: 'relative',
    }),
    v('seemed', 'seem', 'Vlink'),
    adj('seaworthy'),
    'The ferry which had sailed looked fit for sea.',
  ),
  svo(
    'c31-h',
    31,
    det('The', 'landlord'),
    v('evicted', 'evict', 'Vtr'),
    modifiedBy('the', 'tenant', {
      marker: 'who',
      subjectGap: true,
      verb: v('objected', 'object', 'Vint'),
      kind: 'relative',
    }),
    'The landlord removed the tenant who objected.',
  ),
  sv(
    'c31-i',
    31,
    modifiedBy('The', 'shutters', {
      marker: 'that',
      subjectGap: true,
      verb: v('rattled', 'rattle', 'Vint'),
      kind: 'relative',
    }),
    v('broke', 'break', 'Vint'),
    'The rattling shutters broke.',
  ),
  svo(
    'c31-j',
    31,
    det('The', 'board'),
    v('thanked', 'thank', 'Vtr'),
    modifiedBy('the', 'volunteers', {
      marker: 'who',
      subjectGap: true,
      verb: v('stayed', 'stay', 'Vint'),
      kind: 'relative',
    }),
    'The board thanked the volunteers who remained.',
  ),
];
