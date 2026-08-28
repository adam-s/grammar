/**
 * Lesson 10 — Linking verbs. One verb, three frames.
 *
 * Every complement in the built set was an adjective and no verb appeared in
 * any other sense, so the substitution test — put *be* in and see whether it
 * holds — never had a sentence to turn down.
 *
 * *grow* does all three jobs and English hands them over for free: *The sky grew
 * dark* links, *A farmer grew some potatoes* takes an object, *Those children
 * grew* takes nothing. *feel* does two, in *The water felt cold* and *She felt
 * the rough cloth*. That is five of the ten doing work no built sentence did, and
 * none of them is longer than six words.
 */
import { adj, adjn, det, pron, sv, svc, svo, v } from './shape.ts';

export const LESSON_10 = [
  svc(
    'c10-a',
    10,
    det('The', 'soup'),
    v('tasted', 'taste', 'Vlink'),
    adj('salty'),
    'The soup had salt in it.',
  ),
  svc(
    'c10-b',
    10,
    det('That', 'room'),
    v('seemed', 'seem', 'Vlink'),
    adj('empty'),
    'That room appeared to hold nothing.',
  ),
  svc(
    'c10-c',
    10,
    det('The', 'sky'),
    v('grew', 'grow', 'Vlink'),
    adj('dark'),
    'The sky became dark.',
  ),
  svc(
    'c10-d',
    10,
    det('Our', 'milk'),
    v('turned', 'turn', 'Vlink'),
    adj('sour'),
    'Our milk went off.',
  ),
  svc(
    'c10-e',
    10,
    det('The', 'water'),
    v('felt', 'feel', 'Vlink'),
    adj('cold'),
    'The water was cold to the touch.',
  ),
  svc(
    'c10-f',
    10,
    det('The', 'crowd'),
    v('remained', 'remain', 'Vlink'),
    adj('calm'),
    'The crowd stayed settled.',
  ),
  svc(
    'c10-g',
    10,
    det('That', 'bread'),
    v('smelled', 'smell', 'Vlink'),
    adj('fresh'),
    'That bread had a new-baked smell.',
  ),
  svo(
    'c10-h',
    10,
    det('A', 'farmer'),
    v('grew', 'grow', 'Vtr'),
    det('some', 'potatoes'),
    'A farmer raised a crop of potatoes.',
  ),
  svo(
    'c10-i',
    10,
    pron('She'),
    v('felt', 'feel', 'Vtr'),
    adjn('the', 'rough', 'cloth'),
    'She touched the coarse fabric.',
  ),
  sv(
    'c10-j',
    10,
    det('Those', 'children'),
    v('grew', 'grow', 'Vint'),
    'Those children got taller.',
  ),
];
