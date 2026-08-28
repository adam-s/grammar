/**
 * Lesson 10 — Linking verbs. The word after the verb describes the SUBJECT.
 *
 * That is what makes it a complement and not an object: *the soup tasted
 * salty* says the soup was salty, and *the mechanic replaced the belt* says
 * nothing about the mechanic.
 */
import { adj, det, pron, svc, v } from './shape.ts';

export const LESSON_10 = [
  svc(
    'c10-a',
    10,
    det('The', 'soup'),
    v('tasted', 'taste', 'Vlink'),
    adj('salty'),
    'The soup was salty to taste.',
  ),
  svc(
    'c10-b',
    10,
    det('The', 'room'),
    v('seemed', 'seem', 'Vlink'),
    adj('empty'),
    'The room gave an impression of being empty.',
  ),
  svc(
    'c10-c',
    10,
    det('The', 'milk'),
    v('turned', 'turn', 'Vlink'),
    adj('sour'),
    'The milk went sour.',
  ),
  svc(
    'c10-d',
    10,
    det('The', 'sky'),
    v('grew', 'grow', 'Vlink'),
    adj('dark'),
    'The sky became dark.',
  ),
  svc('c10-e', 10, pron('He'), v('looked', 'look', 'Vlink'), adj('tired'), 'He appeared tired.'),
  svc(
    'c10-f',
    10,
    det('The', 'story'),
    v('sounded', 'sound', 'Vlink'),
    adj('unlikely'),
    'The story gave an impression of being unlikely.',
  ),
  svc(
    'c10-g',
    10,
    det('The', 'water'),
    v('felt', 'feel', 'Vlink'),
    adj('cold'),
    'The water was cold to the touch.',
  ),
  svc(
    'c10-h',
    10,
    det('Those', 'streets'),
    v('stayed', 'stay', 'Vlink'),
    adj('quiet'),
    'The streets remained quiet.',
  ),
  svc(
    'c10-i',
    10,
    det('That', 'bread'),
    v('smelled', 'smell', 'Vlink'),
    adj('fresh'),
    'The bread had a fresh smell.',
  ),
  svc(
    'c10-j',
    10,
    det('The', 'crowd'),
    v('remained', 'remain', 'Vlink'),
    adj('calm'),
    'The crowd went on being calm.',
  ),
];
