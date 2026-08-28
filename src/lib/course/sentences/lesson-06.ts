/**
 * Lesson 6 — Determiners. The small word that points the noun out.
 *
 * Ten different determiners, so the class is met as a class rather than as
 * *the*: it points a noun out, limits it, or counts it.
 */
import { det, sv, v } from './shape.ts';

export const LESSON_06 = [
  sv('c06-a', 6, det('That', 'storm'), v('passed', 'pass', 'Vint'), 'That storm went by.'),
  sv('c06-b', 6, det('This', 'argument'), v('ended', 'end', 'Vint'), 'This argument finished.'),
  sv('c06-c', 6, det('Every', 'window'), v('rattled', 'rattle', 'Vint'), 'All the windows shook.'),
  sv(
    'c06-d',
    6,
    det('Some', 'guests'),
    v('complained', 'complain', 'Vint'),
    'A few of the guests objected.',
  ),
  sv('c06-e', 6, det('His', 'hands'), v('trembled', 'tremble', 'Vint'), 'His hands shook.'),
  sv(
    'c06-f',
    6,
    det('Those', 'rumours'),
    v('spread', 'spread', 'Vint'),
    'Those rumours got about.',
  ),
  sv(
    'c06-g',
    6,
    det('Another', 'shelf'),
    v('collapsed', 'collapse', 'Vint'),
    'One more shelf gave way.',
  ),
  sv(
    'c06-h',
    6,
    det('Each', 'candidate'),
    v('waited', 'wait', 'Vint'),
    'The candidates waited one by one.',
  ),
  sv('c06-i', 6, det('Her', 'voice'), v('faltered', 'falter', 'Vint'), 'Her voice wavered.'),
  sv(
    'c06-j',
    6,
    det('Both', 'engines'),
    v('failed', 'fail', 'Vint'),
    'The two engines stopped working.',
  ),
];
