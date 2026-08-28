/**
 * Lesson 16 — Adjectives before nouns.
 *
 * The adjective describes the noun, not the phrase, so the two share a layer
 * inside the noun phrase and the determiner stays outside it.
 *
 * The clause patterns vary on purpose. An adjective before a noun is not a
 * fact about subjects — it happens in objects, in complements, and inside a
 * required place phrase — and ten identical frames would teach the position
 * rather than the rule. It also puts lessons 9 to 14 back to work, which is
 * what the progression contract means by cumulative.
 */
import { adj, adjn, det, pp, sv, svPlus, sva, svc, svo, svoc, svoo, v } from './shape.ts';

export const LESSON_16 = [
  sv(
    'c16-a',
    16,
    adjn('The', 'narrow', 'gate'),
    v('jammed', 'jam', 'Vint'),
    'The narrow gate stuck.',
  ),
  svo(
    'c16-b',
    16,
    det('The', 'clerk'),
    v('filed', 'file', 'Vtr'),
    adjn('the', 'urgent', 'report'),
    'The clerk filed a report marked urgent.',
  ),
  svc(
    'c16-c',
    16,
    adjn('The', 'new', 'tenant'),
    v('seemed', 'seem', 'Vlink'),
    adj('nervous'),
    'The tenant who had just arrived seemed nervous.',
  ),
  sv(
    'c16-d',
    16,
    adjn('His', 'wooden', 'chair'),
    v('splintered', 'splinter', 'Vint'),
    'His wooden chair broke apart.',
  ),
  svoo(
    'c16-e',
    16,
    det('The', 'porter'),
    v('handed', 'hand', 'Vg'),
    adjn('the', 'tired', 'guest'),
    det('a', 'key'),
    'The porter gave the tired guest a key.',
  ),
  sva(
    'c16-f',
    16,
    adjn('The', 'heavy', 'crate'),
    v('is', 'be', 'Vbe'),
    pp('on', det('the', 'ramp')),
    'The heavy crate sits on the ramp.',
  ),
  svoc(
    'c16-g',
    16,
    det('The', 'jury'),
    v('found', 'find', 'Vc'),
    adjn('the', 'young', 'driver'),
    adj('careless'),
    'The jury decided the young driver had been careless.',
  ),
  sv(
    'c16-h',
    16,
    adjn('Those', 'rusted', 'hinges'),
    v('squealed', 'squeal', 'Vint'),
    'The rusted hinges made a noise.',
  ),
  svPlus(
    'c16-i',
    16,
    adjn('The', 'weary', 'marchers'),
    v('halted', 'halt', 'Vint'),
    pp('at', det('the', 'bridge')),
    'The tired marchers stopped at the bridge.',
  ),
  svo(
    'c16-j',
    16,
    det('The', 'storm'),
    v('damaged', 'damage', 'Vtr'),
    adjn('the', 'green', 'shutters'),
    'The storm harmed the green shutters.',
  ),
];
