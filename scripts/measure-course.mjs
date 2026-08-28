#!/usr/bin/env node
/**
 * The numbers in `docs/course/difficulty.md`.
 *
 * That document called its measurements "real and reproducible" while the code
 * that produced them lived in a scratch directory and was thrown away. Two of
 * them did not survive re-derivation: the shape counts were 67 and 46 because
 * the script had quietly mixed `parent > child/function` shapes with invented
 * entries for gaps and fusion, and the per-sentence difficulty numbers were all
 * exactly one above what `replaySentence` reports.
 *
 * So the metric is defined here and nowhere else, and the document quotes this.
 *
 * Definitions, in full:
 *
 * - **Reading.** The canonical reading only, unless a section says otherwise.
 *   Alternates are a different question and would double-count lesson 27.
 * - **Target.** For anything per-lesson, the reading pruned by `targetReading`
 *   to that lesson's cumulative scope — what the lesson actually asks for, not
 *   the whole parse.
 * - **Difficulty.** `replaySentence(sentence, target).steps.length`: the number
 *   of picks a learner makes. Not a proxy — it is the palette's own count, and
 *   it is what `--action=build-sweep` reports.
 * - **Structural shape.** `parent > child/function`, the same string
 *   `consistency.test.ts` uses. Nothing else. A gap, a link and a fusion are
 *   properties of a node, not shapes, and are counted separately when counted.
 * - **Reach.** The distinct earlier lessons whose FIRST-taught decisions appear
 *   in a sentence. A decision is `form:X`, `func:X`, `vt:X` or `kind:X`; its
 *   lesson is the first whose `teaches` contains it; lessons at or after the
 *   sentence's own do not count.
 * - **Tokens.** `metrics.tokens`, which counts punctuation.
 *
 * Usage: node scripts/measure-course.mjs [shapes|difficulty|reach|all]
 */
import { COURSE_LESSONS } from '../src/lib/course/course.ts';
import { scopeThrough, targetReading } from '../src/lib/course/scope.ts';
import { replaySentence } from '../src/lib/course/sentence-renderer.ts';
import { FIXTURES } from '../src/lib/grammar/fixtures.ts';
import { canonicalReading } from '../src/lib/grammar/types.ts';

const LESSON_SENTENCES = COURSE_LESSONS.flatMap((l) => l.sentences);

const firstTaught = new Map();
for (const lesson of COURSE_LESSONS) {
  for (const decision of lesson.teaches) {
    if (!firstTaught.has(decision)) firstTaught.set(decision, lesson.number);
  }
}

/** `parent > child/function`, exactly as `consistency.test.ts` writes it. */
function shapesOf(entries) {
  const out = new Set();
  for (const entry of entries) {
    for (const reading of entry.readings) {
      const cs = reading.constituents;
      for (const id of Object.keys(cs)) {
        const c = cs[id];
        out.add(`${c.parent ? cs[c.parent].form : 'ROOT'} > ${c.form}/${c.function}`);
      }
    }
  }
  return out;
}

/** Node properties, which are not shapes and are counted apart from them. */
function propertiesOf(entries) {
  const out = new Set();
  for (const entry of entries) {
    for (const reading of entry.readings) {
      for (const id of Object.keys(reading.constituents)) {
        const c = reading.constituents[id];
        if (c.gap) out.add(`gap ${c.form}/${c.function}`);
        if (c.fusedWith) out.add(`fusion head+${c.fusedWith}`);
        if (c.index !== undefined) out.add('coindexed pair');
      }
    }
  }
  return out;
}

const targetFor = (lesson, sentence) =>
  targetReading(canonicalReading(sentence), scopeThrough(COURSE_LESSONS, lesson.number));

/** Picks a learner makes: the palette's own count. */
const difficulty = (lesson, sentence) =>
  replaySentence(sentence, targetFor(lesson, sentence)).steps.length;

/** The set of earlier lessons a sentence draws on. Set, not size. */
function reachSet(lesson, sentence) {
  const cs = canonicalReading(sentence).constituents;
  const from = new Set();
  for (const id of Object.keys(cs)) {
    const c = cs[id];
    const decisions = [`form:${c.form}`];
    if (c.function) decisions.push(`func:${c.function}`);
    if (c.verbType) decisions.push(`vt:${c.verbType}`);
    if (c.clauseKind) decisions.push(`kind:${c.clauseKind}`);
    for (const d of decisions) {
      const n = firstTaught.get(d);
      if (n !== undefined && n < lesson.number) from.add(n);
    }
  }
  return from;
}

function shapes() {
  const fix = shapesOf([...FIXTURES]);
  const course = shapesOf(LESSON_SENTENCES);
  const missing = [...fix].filter((s) => !course.has(s)).sort();
  console.log(`shapes  fixtures ${fix.size}  course ${course.size}  in fixtures only ${missing.length}`);
  for (const s of missing) console.log('  ' + s);
  const fp = propertiesOf([...FIXTURES]);
  const cp = propertiesOf(LESSON_SENTENCES);
  const missingProps = [...fp].filter((p) => !cp.has(p)).sort();
  console.log(`\nproperties  fixtures ${fp.size}  course ${cp.size}  in fixtures only ${missingProps.length}`);
  for (const p of missingProps) console.log('  ' + p);
}

function difficultyReport() {
  let neverFalls = 0;
  for (const lesson of COURSE_LESSONS) {
    const d = lesson.sentences.map((s) => difficulty(lesson, s));
    const falls = d.some((v, i) => i > 0 && v < d[i - 1]);
    const flat = new Set(d).size === 1;
    if (!falls) neverFalls++;
    console.log(
      `${String(lesson.number).padStart(2)} ${falls ? 'unordered' : flat ? 'constant ' : 'rising   '} ${d.join(' ')}`,
    );
  }
  console.log(`\n${neverFalls} of ${COURSE_LESSONS.length} lessons never decrease`);
}

function reachReport() {
  for (const lesson of COURSE_LESSONS) {
    const sets = lesson.sentences.map((s) => reachSet(lesson, s));
    // Does each step keep what the step before it used?
    let nested = 0;
    for (let i = 1; i < sets.length; i++) {
      if ([...sets[i - 1]].every((n) => sets[i].has(n))) nested++;
    }
    console.log(
      `${String(lesson.number).padStart(2)}  sizes ${sets.map((s) => s.size).join(' ')}` +
        `   steps that keep the one before: ${nested}/${sets.length - 1}`,
    );
  }
}

const what = process.argv[2] ?? 'all';
if (what === 'shapes' || what === 'all') shapes();
if (what === 'difficulty' || what === 'all') {
  console.log('');
  difficultyReport();
}
if (what === 'reach' || what === 'all') {
  console.log('');
  reachReport();
}
