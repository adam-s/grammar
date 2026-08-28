/**
 * Lesson 4 — Noun phrases. Where the subject ends.
 *
 * Each subject runs long enough that the eye cannot settle it, so the *it*
 * test has real work to do: replace the whole run and the sentence survives;
 * replace part of it and it does not.
 */
import { det, postmod, pp, sv, v } from './shape.ts';

export const LESSON_04 = [
  sv(
    'c04-a',
    4,
    postmod('The', 'man', pp('in', det('the', 'coat'))),
    v('laughed', 'laugh', 'Vint'),
    'The man wearing the coat laughed.',
  ),
  sv(
    'c04-b',
    4,
    postmod('The', 'book', pp('on', det('the', 'shelf'))),
    v('fell', 'fall', 'Vint'),
    'The book that was on the shelf fell.',
  ),
  sv(
    'c04-c',
    4,
    postmod('The', 'house', pp('at', det('the', 'corner'))),
    v('burned', 'burn', 'Vint'),
    'The house at the corner caught fire.',
  ),
  sv(
    'c04-d',
    4,
    postmod('The', 'path', pp('through', det('the', 'wood'))),
    v('flooded', 'flood', 'Vint'),
    'The path through the wood filled with water.',
  ),
  sv(
    'c04-e',
    4,
    postmod('The', 'window', pp('above', det('the', 'sink'))),
    v('rattled', 'rattle', 'Vint'),
    'The window above the sink shook.',
  ),
  sv(
    'c04-f',
    4,
    postmod('The', 'letter', pp('from', det('the', 'bank'))),
    v('arrived', 'arrive', 'Vint'),
    'The bank sent a letter and it arrived.',
  ),
  sv(
    'c04-g',
    4,
    postmod('The', 'noise', pp('under', det('the', 'floor'))),
    v('continued', 'continue', 'Vint'),
    'The noise beneath the floor kept on.',
  ),
  sv(
    'c04-h',
    4,
    postmod('The', 'gate', pp('beside', det('the', 'barn'))),
    v('opened', 'open', 'Vint'),
    'The gate next to the barn opened.',
  ),
  sv(
    'c04-i',
    4,
    postmod('The', 'clock', pp('in', det('the', 'hall'))),
    v('stopped', 'stop', 'Vint'),
    'The hall clock stopped.',
  ),
  sv(
    'c04-j',
    4,
    postmod('The', 'stream', pp('behind', det('the', 'mill'))),
    v('froze', 'freeze', 'Vint'),
    'The stream behind the mill turned to ice.',
  ),
];
