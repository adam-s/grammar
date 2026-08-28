/**
 * Lesson 13 — Naming the object. The last phrase describes the OBJECT.
 *
 * The difference lesson 10 set up, one place further along: *the jury found
 * the driver careless* says the driver was careless, not the jury.
 */
import { adj, bare, det, pron, svoc, v } from './shape.ts';

export const LESSON_13 = [
  svoc(
    'c13-a',
    13,
    det('The', 'jury'),
    v('found', 'find', 'Vc'),
    det('the', 'driver'),
    adj('careless'),
    'The jury decided the driver had been careless.',
  ),
  svoc(
    'c13-b',
    13,
    det('The', 'members'),
    v('elected', 'elect', 'Vc'),
    det('the', 'lawyer'),
    det('their', 'chair'),
    'The members chose the lawyer as chair.',
  ),
  svoc(
    'c13-c',
    13,
    det('The', 'committee'),
    v('considered', 'consider', 'Vc'),
    det('the', 'plan'),
    adj('reckless'),
    'The committee judged the plan reckless.',
  ),
  svoc(
    'c13-d',
    13,
    pron('They'),
    v('painted', 'paint', 'Vc'),
    det('the', 'shutters'),
    adj('green'),
    'They made the shutters green with paint.',
  ),
  svoc(
    'c13-e',
    13,
    det('The', 'court'),
    v('declared', 'declare', 'Vc'),
    det('the', 'contract'),
    adj('void'),
    'The court ruled the contract void.',
  ),
  svoc(
    'c13-f',
    13,
    det('The', 'crew'),
    v('made', 'make', 'Vc'),
    det('the', 'cabin'),
    adj('watertight'),
    'The crew rendered the cabin watertight.',
  ),
  svoc(
    'c13-g',
    13,
    det('The', 'papers'),
    v('called', 'call', 'Vc'),
    det('the', 'decision'),
    adj('unfair'),
    'The papers described the decision as unfair.',
  ),
  svoc(
    'c13-h',
    13,
    det('The', 'board'),
    v('appointed', 'appoint', 'Vc'),
    det('the', 'engineer'),
    det('its', 'adviser'),
    'The board made the engineer its adviser.',
  ),
  svoc(
    'c13-i',
    13,
    det('The', 'inspector'),
    v('judged', 'judge', 'Vc'),
    det('the', 'wiring'),
    adj('unsafe'),
    'The inspector held the wiring to be unsafe.',
  ),
  svoc(
    'c13-j',
    13,
    det('The', 'owners'),
    v('named', 'name', 'Vc'),
    det('the', 'boat'),
    bare('Endeavour'),
    'The owners gave the boat the name Endeavour.',
  ),
];
