#!/usr/bin/env node
/**
 * The numbers in `docs/course/sentence-review.md`.
 *
 * The ladders are prose, not course data, so nothing else can measure them.
 * They are parsed straight out of the markdown: `### Lesson N — Title`, then
 * `**Plain**` / `**Varied**` / `**Cumulative**`, then numbered items.
 *
 * Definitions:
 *
 * - **Words.** Whitespace-separated, punctuation and the dagger stripped. Not
 *   `metrics.tokens`, which counts commas — these sentences have no parse yet.
 * - **Picks.** Estimated, and marked as such wherever it is quoted. The built
 *   corpus is fitted with a least-squares line through (words, picks) where
 *   picks is `replaySentence(sentence, targetReading(...)).steps.length`. The
 *   fit is only a translation from one unit to the other; a real count needs a
 *   real parse.
 * - **Verb-final.** The last word of the sentence is the lexical verb, so "cut
 *   before the last word" finds the subject-predicate boundary without knowing
 *   what a subject is. This only diagnoses a lesson whose taught decision IS
 *   that cut, which is lessons 1 and 2; elsewhere it is a neutral fact. Judged
 *   against a word list, so it is exact for this corpus and would need
 *   extending for another one.
 * - **Near-pair.** Two sentences in one lesson whose word sets overlap by half
 *   or more (Jaccard >= 0.5). A near-pair is a candidate for a minimal pair; it
 *   is not proof of one, because a restatement overlaps just as strongly as a
 *   contrast does.
 *
 * Usage: node scripts/measure-ladders.mjs [length|shortcuts|pairs|picks|all]
 */
import { readFileSync } from 'node:fs';
import { COURSE_LESSONS } from '../src/lib/course/course.ts';
import { scopeThrough, targetReading } from '../src/lib/course/scope.ts';
import { replaySentence } from '../src/lib/course/sentence-renderer.ts';
import { canonicalReading } from '../src/lib/grammar/types.ts';

const DOC = 'docs/course/sentence-ladders.md';

/** Every numbered sentence in the ladders, with its lesson and band. */
function readLadders() {
  const out = [];
  let lesson = null;
  let band = null;
  for (const line of readFileSync(DOC, 'utf8').split('\n')) {
    let m;
    if ((m = line.match(/^### Lesson (\d+) — (.*)$/))) {
      lesson = { n: Number(m[1]), title: m[2] };
    } else if ((m = line.match(/^\*\*(Plain|Varied|Cumulative)\*\*/))) {
      band = m[1];
    } else if (lesson && (m = line.match(/^(\d+)\. (.+)$/))) {
      out.push({
        lesson: lesson.n,
        title: lesson.title,
        band,
        i: Number(m[1]),
        text: m[2].replace(/\s*†\s*$/, ''),
        dagger: m[2].includes('†'),
      });
    }
  }
  return out;
}

const words = (s) => s.replace(/[.,]/g, '').trim().split(/\s+/);
const byLesson = (all) => {
  const m = new Map();
  for (const s of all) (m.get(s.lesson) ?? m.set(s.lesson, []).get(s.lesson)).push(s);
  return m;
};

/** The last word is the lexical verb, so "cut before the last word" solves it. */
const VERB_FINAL =
  /^(sing|rang|flickered|creaked|sneezed|barked|fell|smiled|scattered|vanished|stopped|laughed|shouted|waited|landed|sputtered|stalled|rattled|waved|disappeared|snapped|cheered|opened|buzzed|squeaked|returned|remained|paused|agreed|knocked|moved|rested|arrived|failed|collapsed|objected|slept|drifted|broke|left|played|crossed|protested|complained|stayed|hid|came|rusted|shook|woke)$/;

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const jaccard = (a, b) => {
  const A = new Set(a);
  const B = new Set(b);
  let hits = 0;
  for (const x of A) if (B.has(x)) hits++;
  return hits / (A.size + B.size - hits);
};

function lengths(all) {
  console.log('lesson                                  plain varied cumul  max   every sentence');
  for (const [n, ls] of [...byLesson(all)].sort((a, b) => a[0] - b[0])) {
    const w = ls.map((s) => words(s.text).length);
    const f = (a) => mean(a).toFixed(1).padStart(5);
    console.log(
      `${String(n).padStart(2)} ${ls[0].title.slice(0, 34).padEnd(36)}${f(w.slice(0, 3))}${f(w.slice(3, 7))}${f(w.slice(7))}${String(Math.max(...w)).padStart(5)}   ${w.join(' ')}`,
    );
  }
  const w = all.map((s) => words(s.text).length);
  console.log(
    `\n${all.length} sentences, ${all.filter((s) => s.dagger).length} daggered; ` +
      `mean ${mean(w).toFixed(2)} words, ${Math.min(...w)}–${Math.max(...w)}`,
  );
  let rises = 0;
  for (const [, ls] of byLesson(all)) {
    const w2 = ls.map((s) => words(s.text).length);
    if (mean(w2.slice(7)) > mean(w2.slice(3, 7))) rises++;
  }
  console.log(`the cumulative band is longer than the varied band in ${rises} of 40 lessons`);
}

function shortcuts(all) {
  for (const [n, ls] of [...byLesson(all)].sort((a, b) => a[0] - b[0])) {
    const hit = ls.filter((s) => VERB_FINAL.test(words(s.text).pop().toLowerCase()));
    if (hit.length >= 5) {
      console.log(
        `L${String(n).padStart(2)}  the verb is the final word in ${hit.length}/${ls.length}: ${hit.map((s) => s.i).join(',')}`,
      );
    }
  }
}

function pairs(all) {
  let withAny = 0;
  for (const [n, ls] of [...byLesson(all)].sort((a, b) => a[0] - b[0])) {
    const found = [];
    for (let i = 0; i < ls.length; i++) {
      for (let j = i + 1; j < ls.length; j++) {
        if (jaccard(words(ls[i].text.toLowerCase()), words(ls[j].text.toLowerCase())) >= 0.5) {
          found.push(`${ls[i].i}~${ls[j].i}`);
        }
      }
    }
    if (found.length) withAny++;
    console.log(
      `L${String(n).padStart(2)}  near-pairs ${String(found.length).padStart(2)}  ${found.join(' ')}`,
    );
  }
  console.log(`\n${withAny} of 40 lessons contain any near-pair at all`);
}

/** How many picks a word buys, measured on the corpus that is actually built. */
function picks() {
  const pts = [];
  for (const lesson of COURSE_LESSONS) {
    const scope = scopeThrough(COURSE_LESSONS, lesson.number);
    for (const s of lesson.sentences) {
      const target = targetReading(canonicalReading(s), scope);
      pts.push({
        w: s.text
          .replace(/[.,;:!?]/g, '')
          .trim()
          .split(/\s+/).length,
        p: replaySentence(s, target).steps.length,
      });
    }
  }
  const n = pts.length;
  const sx = pts.reduce((a, p) => a + p.w, 0);
  const sy = pts.reduce((a, p) => a + p.p, 0);
  const slope =
    (n * pts.reduce((a, p) => a + p.w * p.p, 0) - sx * sy) /
    (n * pts.reduce((a, p) => a + p.w * p.w, 0) - sx * sx);
  const intercept = (sy - slope * sx) / n;
  console.log(
    `built corpus: ${n} sentences, mean ${(sx / n).toFixed(2)} words, mean ${(sy / n).toFixed(1)} picks`,
  );
  console.log(
    `picks ≈ ${slope.toFixed(2)} × words ${intercept < 0 ? '−' : '+'} ${Math.abs(intercept).toFixed(1)}`,
  );
  for (const w of [3, 5, 7, 9, 12, 15, 20]) {
    console.log(`  ${String(w).padStart(2)} words → ~${Math.round(slope * w + intercept)} picks`);
  }
}

const all = readLadders();
const what = process.argv[2] ?? 'all';
if (what === 'length' || what === 'all') lengths(all);
if (what === 'shortcuts' || what === 'all') {
  console.log('');
  shortcuts(all);
}
if (what === 'pairs' || what === 'all') {
  console.log('');
  pairs(all);
}
if (what === 'picks' || what === 'all') {
  console.log('');
  picks();
}
