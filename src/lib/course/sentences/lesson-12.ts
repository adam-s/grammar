/**
 * Lesson 12 — Two objects. Someone is given something.
 *
 * The receiver comes first and neither slot can be dropped: *the porter
 * handed the guest* is not a sentence, and neither is *the porter handed a
 * key* in the sense this one has.
 */
import { det, pron, svoo, v } from './shape.ts';

export const LESSON_12 = [
  svoo(
    'c12-a',
    12,
    det('The', 'porter'),
    v('handed', 'hand', 'Vg'),
    det('the', 'guest'),
    det('a', 'key'),
    'The porter gave the guest a key.',
  ),
  svoo(
    'c12-b',
    12,
    det('The', 'bank'),
    v('sold', 'sell', 'Vg'),
    det('the', 'couple'),
    det('a', 'mortgage'),
    'The bank sold a mortgage to the couple.',
  ),
  svoo(
    'c12-c',
    12,
    pron('She'),
    v('told', 'tell', 'Vg'),
    det('the', 'children'),
    det('a', 'story'),
    'She recounted a story to the children.',
  ),
  svoo(
    'c12-d',
    12,
    det('The', 'teacher'),
    v('gave', 'give', 'Vg'),
    det('the', 'class'),
    det('a', 'warning'),
    'The teacher warned the class.',
  ),
  svoo(
    'c12-e',
    12,
    det('The', 'landlord'),
    v('offered', 'offer', 'Vg'),
    det('the', 'tenant'),
    det('a', 'lease'),
    'The landlord proposed a lease to the tenant.',
  ),
  svoo(
    'c12-f',
    12,
    det('The', 'nurse'),
    v('brought', 'bring', 'Vg'),
    det('the', 'patient'),
    det('a', 'blanket'),
    'The nurse fetched the patient a blanket.',
  ),
  svoo(
    'c12-g',
    12,
    det('The', 'clerk'),
    v('showed', 'show', 'Vg'),
    det('the', 'visitor'),
    det('a', 'map'),
    'The clerk displayed a map to the visitor.',
  ),
  svoo(
    'c12-h',
    12,
    pron('He'),
    v('wrote', 'write', 'Vg'),
    det('his', 'sister'),
    det('a', 'postcard'),
    'He composed a postcard for his sister.',
  ),
  svoo(
    'c12-i',
    12,
    det('The', 'charity'),
    v('sent', 'send', 'Vg'),
    det('the', 'village'),
    det('a', 'pump'),
    'The charity dispatched a pump to the village.',
  ),
  svoo(
    'c12-j',
    12,
    det('The', 'coach'),
    v('taught', 'teach', 'Vg'),
    det('the', 'squad'),
    det('a', 'routine'),
    'The coach instructed the squad in a routine.',
  ),
];
