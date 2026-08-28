/**
 * Lesson 21 — Modifiers after the head.
 *
 * *beyond the gate* tells you which path, so it belongs with *path* rather
 * than with the verb — the same phrase in the same shape doing a different job
 * from lesson 18's and lesson 19's.
 */
import { det, postmod, pp, sv, v } from './shape.ts';

export const LESSON_21 = [
  sv(
    'c21-a',
    21,
    postmod('The', 'path', pp('beyond', det('the', 'gate'))),
    v('narrowed', 'narrow', 'Vint'),
    'The path past the gate became narrow.',
  ),
  sv(
    'c21-b',
    21,
    postmod('The', 'cottage', pp('by', det('the', 'weir'))),
    v('flooded', 'flood', 'Vint'),
    'The cottage next to the weir filled with water.',
  ),
  sv(
    'c21-c',
    21,
    postmod('The', 'chimney', pp('above', det('the', 'kitchen'))),
    v('cracked', 'crack', 'Vint'),
    'The chimney over the kitchen split.',
  ),
  sv(
    'c21-d',
    21,
    postmod('The', 'rumour', pp('about', det('the', 'merger'))),
    v('spread', 'spread', 'Vint'),
    'The merger rumour got about.',
  ),
  sv(
    'c21-e',
    21,
    postmod('The', 'lock', pp('on', det('the', 'shed'))),
    v('rusted', 'rust', 'Vint'),
    'The shed lock went rusty.',
  ),
  sv(
    'c21-f',
    21,
    postmod('The', 'argument', pp('over', det('the', 'boundary'))),
    v('continued', 'continue', 'Vint'),
    'The boundary argument went on.',
  ),
  sv(
    'c21-g',
    21,
    postmod('The', 'queue', pp('outside', det('the', 'bakery'))),
    v('lengthened', 'lengthen', 'Vint'),
    'The queue at the bakery grew longer.',
  ),
  sv(
    'c21-h',
    21,
    postmod('The', 'ice', pp('under', det('the', 'bridge'))),
    v('thinned', 'thin', 'Vint'),
    'The ice beneath the bridge grew thin.',
  ),
  sv(
    'c21-i',
    21,
    postmod('The', 'shouting', pp('from', det('the', 'yard'))),
    v('stopped', 'stop', 'Vint'),
    'The yard went quiet.',
  ),
  sv(
    'c21-j',
    21,
    postmod('The', 'crack', pp('across', det('the', 'ceiling'))),
    v('widened', 'widen', 'Vint'),
    'The ceiling crack grew wider.',
  ),
];
