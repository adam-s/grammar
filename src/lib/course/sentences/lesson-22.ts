/**
 * Lesson 22 — Appositives. A second noun phrase naming the same thing.
 *
 * *a banker* renames *the treasurer* — the whole phrase, determiner included.
 * The test is that either half could be dropped and the sentence would still
 * name somebody, which is not true of a postmodifier.
 *
 * Half of these rename an object rather than a subject, because an appositive
 * is not a fact about subjects and ten in the same slot would have taught the
 * slot instead of the rule.
 */
import { adj, appos, bare, det, svc, sv, svo, v } from './shape.ts';

export const LESSON_22 = [
  sv(
    'c22-a',
    22,
    appos('The', 'treasurer', det('a', 'banker')),
    v('resigned', 'resign', 'Vint'),
    'The treasurer, who was a banker, left the post.',
  ),
  svo(
    'c22-b',
    22,
    det('The', 'court'),
    v('questioned', 'question', 'Vtr'),
    appos('the', 'surgeon', det('a', 'stranger')),
    'The court questioned the surgeon, who was a stranger.',
  ),
  sv(
    'c22-c',
    22,
    appos('That', 'ferry', bare('Mermaid')),
    v('sailed', 'sail', 'Vint'),
    'The ferry, called Mermaid, sailed.',
  ),
  sv(
    'c22-d',
    22,
    appos('The', 'witness', det('a', 'neighbour')),
    v('hesitated', 'hesitate', 'Vint'),
    'The witness, who lived next door, paused.',
  ),
  svc(
    'c22-e',
    22,
    appos('The', 'chairman', det('a', 'lawyer')),
    v('was', 'be', 'Vbe'),
    adj('unmoved'),
    'The chairman, a lawyer, was not persuaded.',
  ),
  sv(
    'c22-f',
    22,
    appos('That', 'building', det('a', 'warehouse')),
    v('collapsed', 'collapse', 'Vint'),
    'That building, a warehouse, fell down.',
  ),
  svo(
    'c22-g',
    22,
    det('The', 'board'),
    v('appointed', 'appoint', 'Vtr'),
    appos('the', 'engineer', det('a', 'newcomer')),
    'The board gave the post to the engineer, who was new.',
  ),
  sv(
    'c22-h',
    22,
    appos('The', 'engine', det('a', 'diesel')),
    v('failed', 'fail', 'Vint'),
    'The engine, which was a diesel, broke down.',
  ),
  svo(
    'c22-i',
    22,
    det('The', 'inspector'),
    v('interviewed', 'interview', 'Vtr'),
    appos('her', 'brother', det('a', 'teacher')),
    'The inspector spoke to her brother, who taught.',
  ),
  sv(
    'c22-j',
    22,
    appos('That', 'archive', det('a', 'cellar')),
    v('flooded', 'flood', 'Vint'),
    'The archive, which was a cellar, filled with water.',
  ),
];
