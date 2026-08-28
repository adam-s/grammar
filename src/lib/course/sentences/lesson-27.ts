/**
 * Lesson 27 — Attachment changes meaning. Two kinds of ambiguity, not one.
 *
 * This is the only lesson in the course whose sentences carry two readings, and
 * the model holds both rather than working around them. What the built set did
 * not do is vary the ambiguity: all ten were verb, noun phrase, prepositional
 * phrase, so a learner could pattern-match through without asking what attaches
 * where.
 *
 * Items 5 and 10 are coordination scope, available since lesson 26 and a
 * genuinely different shape. Item 8 is lesson 19's sentence coming back eight
 * lessons later with more in it.
 *
 * There is no test here, and that is the lesson. Both attachments are
 * grammatical; only what the sentence is about picks one.
 */
import { ambiguous, ambiguousScope, det, pron, v } from './shape.ts';

export const LESSON_27 = [
  ambiguous(
    'c27-a',
    27,
    pron('She'),
    v('watched', 'watch', 'Vtr'),
    'the',
    'boy',
    'with',
    det('the', 'binoculars'),
    'She used the binoculars to watch him.',
    'The boy who had the binoculars.',
  ),
  ambiguous(
    'c27-b',
    27,
    det('That', 'guard'),
    v('stopped', 'stop', 'Vtr'),
    'the',
    'man',
    'with',
    det('the', 'torch'),
    'The guard used a torch to stop him.',
    'The man who was carrying the torch.',
  ),
  ambiguous(
    'c27-c',
    27,
    det('The', 'reporter'),
    v('interviewed', 'interview', 'Vtr'),
    'the',
    'actor',
    'in',
    det('the', 'garden'),
    'The interview happened in the garden.',
    'The actor who was in the garden.',
  ),
  ambiguous(
    'c27-d',
    27,
    pron('We'),
    v('found', 'find', 'Vtr'),
    'the',
    'key',
    'under',
    det('the', 'mat'),
    'We looked under the mat and found it.',
    'The key that was kept under the mat.',
  ),
  ambiguousScope(
    'c27-e',
    27,
    det('The', 'guide'),
    v('met', 'meet', 'Vtr'),
    'the',
    'old',
    'men',
    'and',
    'women',
    'Only the men were old.',
    'All of them were old.',
  ),
  ambiguous(
    'c27-f',
    27,
    pron('He'),
    v('painted', 'paint', 'Vtr'),
    'the',
    'shed',
    'behind',
    det('the', 'house'),
    'He stood behind the house to paint it.',
    'The shed that stands behind the house.',
  ),
  ambiguous(
    'c27-g',
    27,
    det('The', 'nurse'),
    v('carried', 'carry', 'Vtr'),
    'the',
    'tray',
    'on',
    det('a', 'trolley'),
    'The nurse used a trolley to carry it.',
    'The tray that was sitting on a trolley.',
  ),
  ambiguous(
    'c27-h',
    27,
    pron('She'),
    v('read', 'read', 'Vtr'),
    'the',
    'report',
    'on',
    det('the', 'train'),
    'She read it during the journey.',
    'The report about the train.',
  ),
  ambiguous(
    'c27-i',
    27,
    det('The', 'inspector'),
    v('photographed', 'photograph', 'Vtr'),
    'the',
    'driver',
    'beside',
    det('the', 'bus'),
    'The inspector stood beside the bus to take it.',
    'The driver who was standing beside the bus.',
  ),
  ambiguousScope(
    'c27-j',
    27,
    pron('They'),
    v('packed', 'pack', 'Vtr'),
    'the',
    'damaged',
    'books',
    'and',
    'maps',
    'Only the books were damaged.',
    'Both the books and the maps were damaged.',
  ),
];
