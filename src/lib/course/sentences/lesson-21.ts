/**
 * Lesson 21 — Modifiers after the head. Both modifiers, and nesting.
 *
 * Two gaps in the built set. Its deepest postmodifier was a flat preposition
 * plus noun phrase — zero nesting, while lesson 19 nests two deep after a verb —
 * and, as difficulty.md puts it, *not one of lesson 21's ten sentences uses
 * both* a premodifier and a postmodifier, though lesson 16 taught the
 * premodifier five lessons earlier.
 *
 * Item 7 nests inside the noun phrase, which is the safe kind: *of the shed* can
 * only attach to *the door*, so the depth costs no ambiguity.
 */
import {
  adj,
  adjn,
  adjpostmod,
  det,
  nounmod,
  postmod,
  pp,
  pron,
  sv,
  svc,
  svo,
  v,
} from './shape.ts';

export const LESSON_21 = [
  sv(
    'c21-a',
    21,
    postmod('The', 'map', pp('on', det('the', 'shelf'))),
    v('fell', 'fall', 'Vint'),
    'The map kept on the shelf dropped.',
  ),
  sv(
    'c21-b',
    21,
    postmod('The', 'path', pp('beyond', det('the', 'gate'))),
    v('narrowed', 'narrow', 'Vint'),
    'The path past the gate grew tighter.',
  ),
  sv(
    'c21-c',
    21,
    postmod('The', 'key', pp('to', postmod('the', 'door', pp('of', det('the', 'shed'))))),
    v('vanished', 'vanish', 'Vint'),
    'The key for the shed door went missing.',
  ),
  sv(
    'c21-d',
    21,
    postmod('The', 'ice', pp('under', det('the', 'bridge'))),
    v('thinned', 'thin', 'Vint'),
    'The ice beneath the bridge grew thinner.',
  ),
  sv(
    'c21-e',
    21,
    adjpostmod('The', 'old', 'lock', pp('on', det('the', 'shed'))),
    v('rusted', 'rust', 'Vint'),
    'The worn lock on the shed corroded.',
  ),
  sv(
    'c21-f',
    21,
    adjpostmod('A', 'cheerful', 'child', pp('with', adjn('a', 'red', 'drum'))),
    v('waved', 'wave', 'Vint'),
    'A happy child holding a red drum raised a hand.',
  ),
  svo(
    'c21-g',
    21,
    det('The', 'surveyor'),
    v('measured', 'measure', 'Vtr'),
    postmod('the', 'field', pp('behind', det('the', 'mill'))),
    'The surveyor sized the field behind the mill.',
  ),
  svo(
    'c21-h',
    21,
    postmod('Those', 'workers', pp('from', nounmod('the', 'repair', 'shop'))),
    v('checked', 'check', 'Vtr'),
    det('every', 'window'),
    'The workers sent by the repair shop looked at every window.',
  ),
  svo(
    'c21-i',
    21,
    pron('They'),
    v('repaired', 'repair', 'Vtr'),
    postmod('the', 'crack', pp('across', det('the', 'ceiling'))),
    'They mended the crack running across the ceiling.',
  ),
  svc(
    'c21-j',
    21,
    postmod('The', 'lock', pp('on', det('the', 'shed'))),
    v('was', 'be', 'Vbe'),
    adj('rusty'),
    'The lock on the shed had corroded.',
  ),
];
