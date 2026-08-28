/**
 * Lesson 37 — Passive voice.
 *
 * The same event with a different participant in the subject slot. Every label
 * stays what it was — noun phrase, verb phrase, subject — and what changes is
 * the relationship between them, which is why voice is a property and not a
 * shape.
 */
import { det, passive, sv, v } from './shape.ts';

export const LESSON_37 = [
  sv(
    'c37-a',
    37,
    det('The', 'harbour'),
    passive(v('dredged', 'dredge', 'Vtr'), 'was'),
    'Somebody dredged the harbour.',
  ),
  sv(
    'c37-b',
    37,
    det('The', 'deeds'),
    passive(v('filed', 'file', 'Vtr'), 'were'),
    'Somebody filed the deeds.',
  ),
  sv(
    'c37-c',
    37,
    det('The', 'engine'),
    passive(v('repaired', 'repair', 'Vtr'), 'was'),
    'Somebody repaired the engine.',
  ),
  sv(
    'c37-d',
    37,
    det('The', 'wall'),
    passive(v('rebuilt', 'rebuild', 'Vtr'), 'was'),
    'Somebody rebuilt the wall.',
  ),
  sv(
    'c37-e',
    37,
    det('The', 'ledger'),
    passive(v('audited', 'audit', 'Vtr'), 'was'),
    'Somebody audited the ledger.',
  ),
  sv(
    'c37-f',
    37,
    det('The', 'shutters'),
    passive(v('painted', 'paint', 'Vtr'), 'were'),
    'Somebody painted the shutters.',
  ),
  sv(
    'c37-g',
    37,
    det('The', 'claim'),
    passive(v('rejected', 'reject', 'Vtr'), 'was'),
    'Somebody rejected the claim.',
  ),
  sv(
    'c37-h',
    37,
    det('The', 'archive'),
    passive(v('closed', 'close', 'Vtr'), 'was'),
    'Somebody closed the archive.',
  ),
  sv(
    'c37-i',
    37,
    det('The', 'crates'),
    passive(v('stacked', 'stack', 'Vtr'), 'were'),
    'Somebody stacked the crates.',
  ),
  sv(
    'c37-j',
    37,
    det('The', 'path'),
    passive(v('cleared', 'clear', 'Vtr'), 'was'),
    'Somebody cleared the path.',
  ),
];
