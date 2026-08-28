/**
 * Lesson 17 — Adjective phrases. An adjective can bring words of its own.
 *
 * *unusually calm* is still one complement doing one job; the adverb is inside
 * it, modifying the adjective, not the verb. Take the adverb away and the
 * sentence stands, which is how you know where it belongs.
 *
 * Some of these describe the subject and some describe the OBJECT, because an
 * adjective phrase is not a fact about subject complements — and telling the
 * two apart is lesson 13, put back to work.
 */
import { advadj, det, pron, svc, svoc, v } from './shape.ts';

export const LESSON_17 = [
  svc(
    'c17-a',
    17,
    det('The', 'candidate'),
    v('seemed', 'seem', 'Vlink'),
    advadj('unusually', 'calm'),
    'The candidate appeared calmer than expected.',
  ),
  svoc(
    'c17-b',
    17,
    det('The', 'jury'),
    v('found', 'find', 'Vc'),
    det('the', 'driver'),
    advadj('entirely', 'blameless'),
    'The jury decided the driver was not at fault at all.',
  ),
  svc(
    'c17-c',
    17,
    det('The', 'answer'),
    v('was', 'be', 'Vbe'),
    advadj('perfectly', 'clear'),
    'The answer was easy to understand.',
  ),
  svc(
    'c17-d',
    17,
    det('That', 'road'),
    v('grew', 'grow', 'Vlink'),
    advadj('steadily', 'steeper'),
    'That road became steeper as it went.',
  ),
  svoc(
    'c17-e',
    17,
    det('The', 'inspector'),
    v('judged', 'judge', 'Vc'),
    det('the', 'wiring'),
    advadj('barely', 'adequate'),
    'The inspector thought the wiring only just passed.',
  ),
  svc(
    'c17-f',
    17,
    det('That', 'chairman'),
    v('remained', 'remain', 'Vlink'),
    advadj('oddly', 'silent'),
    'That chairman went on saying nothing.',
  ),
  svc(
    'c17-g',
    17,
    det('The', 'proposal'),
    v('sounded', 'sound', 'Vlink'),
    advadj('faintly', 'absurd'),
    'The proposal seemed slightly ridiculous.',
  ),
  svoc(
    'c17-h',
    17,
    det('The', 'court'),
    v('declared', 'declare', 'Vc'),
    det('the', 'contract'),
    advadj('wholly', 'void'),
    'The court ruled the contract void throughout.',
  ),
  svc(
    'c17-i',
    17,
    det('The', 'milk'),
    v('tasted', 'taste', 'Vlink'),
    advadj('slightly', 'sour'),
    'The milk had gone a little sour.',
  ),
  svc(
    'c17-j',
    17,
    pron('He'),
    v('looked', 'look', 'Vlink'),
    advadj('thoroughly', 'lost'),
    'He appeared completely lost.',
  ),
];
