#!/usr/bin/env node
/**
 * Check every `docs/course/<lesson>/sentences.md` against the rules
 * `docs/course/difficulty.md` states, as far as prose can be checked.
 *
 * These are proposals with no parse, so the two rules that need one — reach
 * accumulation and the one-step limit — cannot be checked here and are not
 * claimed. What IS checkable:
 *
 * - ten sentences numbered 1 to 10, or two to six for an optional lesson, which
 *   is a demonstration rather than a practice set;
 * - the length ceiling: within a lesson `max(tokens) − min(tokens) <= 4`, and
 *   adjacent sentences differ by at most 3. A ceiling, not a target, and stated
 *   as a range so that padding every sentence equally fails it too;
 *   `metrics.tokens` counts punctuation, so this does too;
 * - every sentence says what its step is, because a step nobody can name is the
 *   length ladder wearing a difficulty ladder's label;
 * - the directory names a real lesson, or is an optional `NNx-` companion;
 * - `proposal-review.md`, the authoring ledger, holds exactly the same sentences
 *   in exactly the same order. The ledger is a second copy of all 413 proposals,
 *   so nothing but a check keeps the two in step, and a ledger that has drifted
 *   records approval against a sentence that no longer exists.
 *
 * Exit 1 on any failure. Usage: node scripts/check-sentences.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { COURSE_LESSONS } from '../src/lib/course/course.ts';

const DOCS = 'docs/course';
const ids = new Set(COURSE_LESSONS.map((l) => l.id));
const problems = [];

/** Tokens the way `metrics.tokens` counts them: words plus punctuation marks. */
const tokens = (text) =>
  text
    .replace(/\s*([,.;:!?])/g, ' $1 ')
    .trim()
    .split(/\s+/).length;

/** Rows of the `| # | Sentence | The step |` table. */
function readSentences(file) {
  const out = [];
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\|\s*(\d+)\s*\|(.+?)\|(.+?)\|\s*$/);
    if (m) out.push({ n: Number(m[1]), text: m[2].trim(), step: m[3].trim() });
  }
  return out;
}

const dirs = readdirSync(DOCS)
  .filter((d) => statSync(`${DOCS}/${d}`).isDirectory())
  .sort();

let checked = 0;
for (const dir of dirs) {
  const optional = /^\d\d[a-z]-/.test(dir);
  if (!ids.has(dir) && !optional) problems.push(`${dir}/ names no lesson`);
  const file = `${DOCS}/${dir}/sentences.md`;
  if (!existsSync(file)) continue;
  checked++;
  const ss = readSentences(file);

  // An optional lesson is a demonstration, not a practice set: it needs only
  // enough sentences to show that the trees come out the same, or different.
  const want = optional ? [2, 6] : [10, 10];
  if (ss.length < want[0] || ss.length > want[1]) {
    problems.push(
      `${dir}: ${ss.length} sentences, expected ${want[0] === want[1] ? want[0] : `${want[0]} to ${want[1]}`}`,
    );
  }
  ss.forEach((s, i) => {
    if (s.n !== i + 1) problems.push(`${dir}: sentence ${i + 1} is numbered ${s.n}`);
    // A dagger marks a construction needing a model check; the step still has to be named.
    const step = s.step.replace(/†/g, '').trim();
    if (step.length < 4) problems.push(`${dir}: sentence ${s.n} does not say what its step is`);
    // The cell describes the SENTENCE, not the transition. It used to describe
    // the transition, and then the lessons were reordered to satisfy the
    // accumulation contract and sixty-eight cells became narrative about a
    // sequence that no longer existed — "back to a cardinal" on the second row,
    // "item 1 with commas" on a sentence with neither. A cell that names its
    // neighbours cannot survive a reorder, and the order is now derived.
    if (/\b(back to|item \d|so item|not a one-off|close on|after the pair)\b/i.test(step)) {
      problems.push(
        `${dir}: sentence ${s.n}'s step describes its neighbours — "${step}". ` +
          'Say what THIS sentence does; the order is derived and will move under you.',
      );
    }
  });

  const t = ss.map((s) => tokens(s.text.replace(/[*_`†]/g, '')));
  if (t.length) {
    const spread = Math.max(...t) - Math.min(...t);
    if (spread > 4) problems.push(`${dir}: token spread ${spread} > 4  [${t.join(' ')}]`);
    for (let i = 1; i < t.length; i++) {
      if (Math.abs(t[i] - t[i - 1]) > 3) {
        problems.push(
          `${dir}: sentences ${i} and ${i + 1} differ by ${Math.abs(t[i] - t[i - 1])} tokens`,
        );
      }
    }
  }
}

// ── the ledger ──────────────────────────────────────────────────────────────
const LEDGER = `${DOCS}/proposal-review.md`;
// Its absence used to skip the whole block and still report "no problems", which
// is a check that passes by not running. If the ledger is required it has to be
// required when it is missing too — that is the only case the guard was for.
if (!existsSync(LEDGER)) {
  problems.push(
    `${LEDGER} is missing. It records what a person accepted, one row per proposal; ` +
      'without it nothing says which reading was approved. Restore it, or delete this ' +
      'check and say in difficulty.md that acceptance is recorded somewhere else.',
  );
}
if (existsSync(LEDGER)) {
  const text = readFileSync(LEDGER, 'utf8');
  /** Ledger rows, grouped by the `## Lesson N — Title` heading above them. */
  const ledger = new Map();
  let heading = null;
  for (const line of text.split('\n')) {
    const h = line.match(/^##\s+Lesson\s+(\S+?)\s*(?:—|-|$)/);
    if (h) {
      heading = h[1];
      ledger.set(heading, []);
      continue;
    }
    const row = line.match(/^\|\s*(\d+)\s*\|([^|]+)\|/);
    if (row && heading) ledger.get(heading).push({ n: Number(row[1]), text: row[2].trim() });
  }

  // A ledger heading says "Lesson 7" or "Lesson 18a"; a directory is "07-pronouns".
  const dirFor = (h) => {
    const m = h.match(/^(\d+)([a-z]?)$/);
    if (!m) return null;
    const want = m[1].padStart(2, '0') + m[2];
    return dirs.find((d) => d.startsWith(want + '-')) ?? null;
  };

  const seen = new Set();
  for (const [h, rows] of ledger) {
    const dir = dirFor(h);
    if (!dir) {
      problems.push(`ledger: "Lesson ${h}" matches no lesson folder`);
      continue;
    }
    seen.add(dir);
    const source = readSentences(`${DOCS}/${dir}/sentences.md`);
    if (rows.length !== source.length) {
      problems.push(
        `ledger: lesson ${h} has ${rows.length} rows, ${dir}/sentences.md has ${source.length}`,
      );
    }
    const bare = (t) =>
      t
        .replace(/[*_`†]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    for (let i = 0; i < Math.max(rows.length, source.length); i++) {
      const a = rows[i];
      const b = source[i];
      if (!a) problems.push(`ledger: lesson ${h} is missing row ${b.n} — "${bare(b.text)}"`);
      else if (!b) problems.push(`ledger: lesson ${h} has an extra row ${a.n} — "${bare(a.text)}"`);
      else if (a.n !== b.n) {
        problems.push(
          `ledger: lesson ${h} row ${i + 1} is numbered ${a.n}, sentences.md says ${b.n}`,
        );
      } else if (bare(a.text) !== bare(b.text)) {
        problems.push(
          `ledger: lesson ${h} row ${a.n} says "${bare(a.text)}", sentences.md says "${bare(b.text)}"`,
        );
      }
    }
  }
  for (const dir of dirs) {
    if (existsSync(`${DOCS}/${dir}/sentences.md`) && !seen.has(dir)) {
      problems.push(`ledger: no section for ${dir}, which has proposals`);
    }
  }
}

// ── the live corpus ─────────────────────────────────────────────────────────
// The tables above are prose about the course. This is the course. They drifted
// apart in lesson 20 — the same ten sentences in two orders — and nothing
// noticed, because every check compared documents with documents.
for (const lesson of COURSE_LESSONS) {
  const dir = dirs.find((d) => d.startsWith(String(lesson.number).padStart(2, '0') + '-'));
  if (!dir || !existsSync(`${DOCS}/${dir}/sentences.md`)) continue;
  const rows = readSentences(`${DOCS}/${dir}/sentences.md`);
  if (rows.length !== lesson.sentences.length) {
    problems.push(`${dir}: ${rows.length} rows against ${lesson.sentences.length} built sentences`);
  }
  lesson.sentences.forEach((sentence, i) => {
    const row = rows[i];
    if (!row) return;
    const bare = (t) =>
      t
        .replace(/[*_`†]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (bare(row.text) !== bare(sentence.text)) {
      problems.push(
        `${dir} row ${i + 1}: the document says "${bare(row.text)}" and lesson ` +
          `${lesson.number} sentence ${i + 1} is "${sentence.text}"`,
      );
    }
  });
}

const withFile = dirs.filter((d) => existsSync(`${DOCS}/${d}/sentences.md`));
console.log(`sentences.md: ${withFile.length} of ${dirs.length} lesson folders`);
const missing = [...ids].filter((id) => !existsSync(`${DOCS}/${id}/sentences.md`));
if (missing.length) {
  console.log(
    `  missing: ${missing.length} — ${missing.slice(0, 5).join(' ')}${missing.length > 5 ? ' …' : ''}`,
  );
}

if (problems.length) {
  console.error(`\n${problems.length} problems:`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(`checked ${checked} files, no problems`);
