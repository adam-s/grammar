/**
 * Lesson 21 — Modifiers after the head.
 *
 * *beyond the gate* tells you which path, so it belongs with *path* rather
 * than with the verb — the same phrase in the same shape doing a different job
 * from lesson 18's and lesson 19's.
 *
 * A postmodifier is not a fact about subjects, so half of these put one in an
 * object or a complement instead. That is also where the contrast with lesson
 * 19 bites hardest: the same phrase, one word further left, changes what it
 * belongs to.
 */
import { adj, det, postmod, pp, pron, sv, svc, svo, svoo, v } from './shape.ts';

export const LESSON_21 = [
  sv(
    'c21-a',
    21,
    postmod('The', 'path', pp('beyond', det('the', 'gate'))),
    v('narrowed', 'narrow', 'Vint'),
    'The path past the gate became narrow.',
  ),
  svo(
    'c21-b',
    21,
    det('The', 'surveyor'),
    v('measured', 'measure', 'Vtr'),
    postmod('the', 'field', pp('behind', det('the', 'mill'))),
    'The surveyor measured the field that lies behind the mill.',
  ),
  sv(
    'c21-c',
    21,
    postmod('That', 'chimney', pp('above', det('the', 'kitchen'))),
    v('cracked', 'crack', 'Vint'),
    'That chimney over the kitchen split.',
  ),
  svc(
    'c21-d',
    21,
    postmod('The', 'lock', pp('on', det('the', 'shed'))),
    v('was', 'be', 'Vbe'),
    adj('rusty'),
    'The shed lock had gone rusty.',
  ),
  svo(
    'c21-e',
    21,
    det('The', 'committee'),
    v('rejected', 'reject', 'Vtr'),
    postmod('the', 'plan', pp('for', det('the', 'harbour'))),
    'The committee turned down the harbour plan.',
  ),
  sv(
    'c21-f',
    21,
    postmod('The', 'argument', pp('over', det('the', 'boundary'))),
    v('continued', 'continue', 'Vint'),
    'The boundary argument went on.',
  ),
  svoo(
    'c21-g',
    21,
    det('The', 'clerk'),
    v('showed', 'show', 'Vg'),
    postmod('the', 'visitor', pp('from', det('the', 'ministry'))),
    det('a', 'map'),
    'The clerk showed the ministry visitor a map.',
  ),
  sv(
    'c21-h',
    21,
    postmod('The', 'ice', pp('under', det('the', 'bridge'))),
    v('thinned', 'thin', 'Vint'),
    'The ice beneath the bridge grew thin.',
  ),
  svo(
    'c21-i',
    21,
    pron('They'),
    v('repaired', 'repair', 'Vtr'),
    postmod('the', 'crack', pp('across', det('the', 'ceiling'))),
    'They mended the crack that runs across the ceiling.',
  ),
  sv(
    'c21-j',
    21,
    postmod('That', 'queue', pp('outside', det('the', 'bakery'))),
    v('lengthened', 'lengthen', 'Vint'),
    'That queue at the bakery grew longer.',
  ),
];
