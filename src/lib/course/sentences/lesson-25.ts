/**
 * Lesson 25 — Particles. *down* belongs with the verb, not to a phrase.
 *
 * It looks like the preposition of lesson 19 and behaves like nothing of the
 * kind: it takes no complement, and *the address* is the object of *wrote
 * down* rather than of *down*.
 */
import { det, phrasal, pron, svo, v } from './shape.ts';

export const LESSON_25 = [
  svo(
    'c25-a',
    25,
    det('The', 'clerk'),
    phrasal(v('wrote', 'write', 'Vtr'), 'down'),
    det('the', 'address'),
    'The clerk noted the address in writing.',
  ),
  svo(
    'c25-b',
    25,
    det('The', 'engineer'),
    phrasal(v('shut', 'shut', 'Vtr'), 'off'),
    det('the', 'valve'),
    'The engineer closed the valve.',
  ),
  svo(
    'c25-c',
    25,
    pron('She'),
    phrasal(v('looked', 'look', 'Vtr'), 'up'),
    det('the', 'number'),
    'She found the number in a list.',
  ),
  svo(
    'c25-d',
    25,
    det('The', 'committee'),
    phrasal(v('turned', 'turn', 'Vtr'), 'down'),
    det('the', 'offer'),
    'The committee refused the offer.',
  ),
  svo(
    'c25-e',
    25,
    det('The', 'porter'),
    phrasal(v('put', 'put', 'Vtr'), 'away'),
    det('the', 'crates'),
    'The porter stored the crates.',
  ),
  svo(
    'c25-f',
    25,
    pron('They'),
    phrasal(v('called', 'call', 'Vtr'), 'off'),
    det('the', 'search'),
    'They stopped the search.',
  ),
  svo(
    'c25-g',
    25,
    det('The', 'auditor'),
    phrasal(v('drew', 'draw', 'Vtr'), 'up'),
    det('a', 'schedule'),
    'The auditor prepared a schedule.',
  ),
  svo(
    'c25-h',
    25,
    det('The', 'crew'),
    phrasal(v('took', 'take', 'Vtr'), 'apart'),
    det('the', 'scaffold'),
    'The crew dismantled the scaffold.',
  ),
  svo(
    'c25-i',
    25,
    det('The', 'inspector'),
    phrasal(v('pointed', 'point', 'Vtr'), 'out'),
    det('the', 'fault'),
    'The inspector showed where the fault was.',
  ),
  svo(
    'c25-j',
    25,
    det('The', 'landlord'),
    phrasal(v('threw', 'throw', 'Vtr'), 'out'),
    det('the', 'furniture'),
    'The landlord got rid of the furniture.',
  ),
];
