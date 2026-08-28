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
 * - the directory names a real lesson, or is an optional `NNx-` companion.
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
  if (ss.length < want[0] || ss.length > want[1])
    problems.push(
      `${dir}: ${ss.length} sentences, expected ${want[0] === want[1] ? want[0] : `${want[0]} to ${want[1]}`}`,
    );
  ss.forEach((s, i) => {
    if (s.n !== i + 1) problems.push(`${dir}: sentence ${i + 1} is numbered ${s.n}`);
    // A dagger marks a construction needing a model check; the step still has to be named.
    const step = s.step.replace(/†/g, '').trim();
    if (step.length < 4) problems.push(`${dir}: sentence ${s.n} does not say what its step is`);
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

const withFile = dirs.filter((d) => existsSync(`${DOCS}/${d}/sentences.md`));
console.log(`sentences.md: ${withFile.length} of ${dirs.length} lesson folders`);
const missing = [...ids].filter((id) => !existsSync(`${DOCS}/${id}/sentences.md`));
if (missing.length)
  console.log(
    `  missing: ${missing.length} — ${missing.slice(0, 5).join(' ')}${missing.length > 5 ? ' …' : ''}`,
  );

if (problems.length) {
  console.error(`\n${problems.length} problems:`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(`checked ${checked} files, no problems`);
