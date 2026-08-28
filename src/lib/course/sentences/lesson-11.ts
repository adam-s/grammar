/**
 * Lesson 11 — The verb _be_. Separated from the other linking verbs, at last.
 *
 * The built set contained no linking verb but _be_, so the lesson only asked the
 * learner to notice which lesson they were in. *The bread tasted stale* and *The
 * bread was stale* are identical apart from the verb, and `Vlink` and `Vbe` have
 * to be told apart.
 *
 * What the built set did right is kept: adjective and noun-phrase complements
 * alternate under one function, which is the whole doctrine of the app in a
 * single lesson — `AdjP` and `NP` are different answers to *what form*, and the
 * same answer to *what job*.
 */
import { adj, det, pron, svc, v } from './shape.ts';

export const LESSON_11 = [
  svc(
    'c11-a',
    11,
    det('The', 'answer'),
    v('was', 'be', 'Vbe'),
    adj('obvious'),
    'The answer was easy to see.',
  ),
  svc(
    'c11-b',
    11,
    det('These', 'apples'),
    v('are', 'be', 'Vbe'),
    adj('ripe'),
    'These apples are ready to eat.',
  ),
  svc(
    'c11-c',
    11,
    det('The', 'winner'),
    v('was', 'be', 'Vbe'),
    det('a', 'stranger'),
    'The winner was somebody nobody knew.',
  ),
  svc(
    'c11-d',
    11,
    det('The', 'bread'),
    v('tasted', 'taste', 'Vlink'),
    adj('stale'),
    'The bread had gone dry.',
  ),
  svc(
    'c11-e',
    11,
    det('The', 'bread'),
    v('was', 'be', 'Vbe'),
    adj('stale'),
    'The bread had gone dry and hard.',
  ),
  svc(
    'c11-f',
    11,
    det('The', 'evidence'),
    v('was', 'be', 'Vbe'),
    adj('thin'),
    'There was little to go on.',
  ),
  svc(
    'c11-g',
    11,
    det('That', 'building'),
    v('is', 'be', 'Vbe'),
    det('a', 'museum'),
    'That building holds a collection.',
  ),
  svc(
    'c11-h',
    11,
    det('The', 'streets'),
    v('were', 'be', 'Vbe'),
    adj('deserted'),
    'Nobody was out on the streets.',
  ),
  svc('c11-i', 11, pron('He'), v('is', 'be', 'Vbe'), det('a', 'doctor'), 'He works in medicine.'),
  svc(
    'c11-j',
    11,
    pron('She'),
    v('is', 'be', 'Vbe'),
    det('the', 'treasurer'),
    'She holds the money post.',
  ),
];
