/**
 * Lesson 7 — Pronouns. One word standing where a whole noun phrase would.
 *
 * The noun phrase is still there and still the subject; it is simply made of
 * one word, which is the point that lesson 4's *it* test was building toward.
 */
import { pron, sv, v } from './shape.ts';

export const LESSON_07 = [
  sv('c07-a', 7, pron('She'), v('hesitated', 'hesitate', 'Vint'), 'She paused before acting.'),
  sv('c07-b', 7, pron('He'), v('apologised', 'apologise', 'Vint'), 'He said sorry.'),
  sv('c07-c', 7, pron('They'), v('agreed', 'agree', 'Vint'), 'They came to an agreement.'),
  sv('c07-d', 7, pron('It'), v('worked', 'work', 'Vint'), 'The thing functioned.'),
  sv('c07-e', 7, pron('We'), v('waited', 'wait', 'Vint'), 'We stayed where we were.'),
  sv(
    'c07-f',
    7,
    pron('Everyone'),
    v('listened', 'listen', 'Vint'),
    'All the people paid attention.',
  ),
  sv('c07-g', 7, pron('Nobody'), v('answered', 'answer', 'Vint'), 'No person replied.'),
  sv('c07-h', 7, pron('You'), v('laughed', 'laugh', 'Vint'), 'You found it funny.'),
  sv('c07-i', 7, pron('Someone'), v('knocked', 'knock', 'Vint'), 'A person knocked.'),
  sv('c07-j', 7, pron('I'), v('hesitated', 'hesitate', 'Vint'), 'I paused.'),
];
