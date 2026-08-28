/**
 * Lesson 22 — Appositives. A second noun phrase naming the same thing.
 *
 * *a banker* renames *the treasurer* — the whole phrase, determiner included.
 * The test is that either half could be dropped and the sentence would still
 * name somebody, which is not true of a postmodifier.
 */
import { appos, bare, det, sv, v } from './shape.ts';

export const LESSON_22 = [
  sv(
    'c22-a',
    22,
    appos('The', 'treasurer', det('a', 'banker')),
    v('resigned', 'resign', 'Vint'),
    'The treasurer, who was a banker, left the post.',
  ),
  sv(
    'c22-b',
    22,
    appos('The', 'surgeon', det('a', 'stranger')),
    v('operated', 'operate', 'Vint'),
    'The surgeon, who nobody knew, operated.',
  ),
  sv(
    'c22-c',
    22,
    appos('The', 'ferry', bare('Mermaid')),
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
  sv(
    'c22-e',
    22,
    appos('The', 'chairman', det('a', 'lawyer')),
    v('objected', 'object', 'Vint'),
    'The chairman, who was a lawyer, objected.',
  ),
  sv(
    'c22-f',
    22,
    appos('That', 'building', det('a', 'warehouse')),
    v('collapsed', 'collapse', 'Vint'),
    'That building, a warehouse, fell down.',
  ),
  sv(
    'c22-g',
    22,
    appos('The', 'inspector', det('a', 'newcomer')),
    v('insisted', 'insist', 'Vint'),
    'The inspector, new to the job, insisted.',
  ),
  sv(
    'c22-h',
    22,
    appos('The', 'engine', det('a', 'diesel')),
    v('failed', 'fail', 'Vint'),
    'The engine, which was a diesel, broke down.',
  ),
  sv(
    'c22-i',
    22,
    appos('Her', 'brother', det('a', 'teacher')),
    v('laughed', 'laugh', 'Vint'),
    'Her brother, who taught, laughed.',
  ),
  sv(
    'c22-j',
    22,
    appos('The', 'archive', det('a', 'cellar')),
    v('flooded', 'flood', 'Vint'),
    'The archive, which was a cellar, filled with water.',
  ),
];
