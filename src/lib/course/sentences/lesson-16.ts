/**
 * Lesson 16 — Adjectives before nouns.
 *
 * The adjective describes the noun, not the phrase, so the two share a layer
 * inside the noun phrase and the determiner stays outside it. Ten different
 * determiners and ten different adjectives, so neither reads as part of the
 * rule.
 */
import { adjn, sv, v } from './shape.ts';

export const LESSON_16 = [
  sv(
    'c16-a',
    16,
    adjn('The', 'narrow', 'gate'),
    v('jammed', 'jam', 'Vint'),
    'The narrow gate stuck.',
  ),
  sv(
    'c16-b',
    16,
    adjn('That', 'broken', 'window'),
    v('whistled', 'whistle', 'Vint'),
    'Wind came through the broken window.',
  ),
  sv(
    'c16-c',
    16,
    adjn('The', 'green', 'shutters'),
    v('faded', 'fade', 'Vint'),
    'The green shutters lost their colour.',
  ),
  sv(
    'c16-d',
    16,
    adjn('His', 'wooden', 'chair'),
    v('splintered', 'splinter', 'Vint'),
    'His wooden chair broke apart.',
  ),
  sv(
    'c16-e',
    16,
    adjn('The', 'frozen', 'pipe'),
    v('burst', 'burst', 'Vint'),
    'The frozen pipe split open.',
  ),
  sv(
    'c16-f',
    16,
    adjn('Some', 'ripe', 'plums'),
    v('dropped', 'drop', 'Vint'),
    'A few ripe plums fell.',
  ),
  sv(
    'c16-g',
    16,
    adjn('The', 'weary', 'marchers'),
    v('halted', 'halt', 'Vint'),
    'The tired marchers stopped.',
  ),
  sv(
    'c16-h',
    16,
    adjn('Her', 'silver', 'bracelet'),
    v('glinted', 'glint', 'Vint'),
    'Her silver bracelet caught the light.',
  ),
  sv(
    'c16-i',
    16,
    adjn('Those', 'rusted', 'hinges'),
    v('squealed', 'squeal', 'Vint'),
    'The rusted hinges made a noise.',
  ),
  sv(
    'c16-j',
    16,
    adjn('Every', 'wet', 'branch'),
    v('sagged', 'sag', 'Vint'),
    'All the wet branches drooped.',
  ),
];
