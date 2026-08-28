/**
 * Lesson 13 — Naming the object. The count stops deciding it.
 *
 * Lesson 12 and lesson 13 share a surface shape — noun phrase, verb, noun
 * phrase, noun phrase — and the built course never put the two together, so the
 * learner was never asked to choose. Items 5 and 6 are the same five words with
 * different verbs, and item 7 is a two-object sentence dropped in whole.
 *
 * The test is `be`: *the driver **is** careless* holds, and *the guest is a key*
 * does not. It runs today, needs no grammar the learner has not met, and is in
 * neither the app nor the built corpus.
 */
import { adj, bare, det, pron, svoc, svoo, v } from './shape.ts';

export const LESSON_13 = [
  svoc(
    'c13-a',
    13,
    det('The', 'jury'),
    v('found', 'find', 'Vc'),
    det('the', 'driver'),
    adj('careless'),
    'The jury decided the driver had not taken care.',
  ),
  svoc(
    'c13-b',
    13,
    pron('They'),
    v('painted', 'paint', 'Vc'),
    det('the', 'shutters'),
    adj('green'),
    'They made the shutters green with paint.',
  ),
  svoc(
    'c13-c',
    13,
    det('The', 'court'),
    v('declared', 'declare', 'Vc'),
    det('the', 'contract'),
    adj('void'),
    'The court ruled that the contract counted for nothing.',
  ),
  svoc(
    'c13-d',
    13,
    det('The', 'members'),
    v('elected', 'elect', 'Vc'),
    det('the', 'lawyer'),
    det('their', 'chair'),
    'The members voted the lawyer into the chair.',
  ),
  svoo(
    'c13-e',
    13,
    pron('They'),
    v('made', 'make', 'Vg'),
    pron('her'),
    det('a', 'cake'),
    'They baked a cake for her.',
  ),
  svoc(
    'c13-f',
    13,
    pron('They'),
    v('made', 'make', 'Vc'),
    pron('her'),
    det('a', 'partner'),
    'They raised her to partner.',
  ),
  svoo(
    'c13-g',
    13,
    det('The', 'clerk'),
    v('handed', 'hand', 'Vg'),
    det('the', 'visitor'),
    det('a', 'form'),
    'The clerk passed a form to the visitor.',
  ),
  svoc(
    'c13-h',
    13,
    det('The', 'board'),
    v('appointed', 'appoint', 'Vc'),
    det('the', 'engineer'),
    det('its', 'adviser'),
    'The board put the engineer in the adviser post.',
  ),
  svoc(
    'c13-i',
    13,
    det('The', 'owners'),
    v('named', 'name', 'Vc'),
    det('the', 'boat'),
    bare('Endeavour'),
    'The owners gave the boat the name Endeavour.',
  ),
  svoc(
    'c13-j',
    13,
    det('The', 'inspector'),
    v('judged', 'judge', 'Vc'),
    det('the', 'wiring'),
    adj('unsafe'),
    'The inspector ruled the wiring dangerous.',
  ),
];
