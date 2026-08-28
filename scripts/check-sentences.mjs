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
 * - nothing in the file refers to a sentence by its number. The order is
 *   derived from the accumulation contract, so a row number is a fact about
 *   today's arrangement, and sixty-eight cells and a hundred and thirty-one
 *   sentences of prose once said things about rows that had moved;
 * - a step cell that names a construction — preposition, particle, object
 *   complement, passive, appositive — is checked against the tree the course
 *   actually stores for that sentence. That is what catches a cell describing
 *   the sentence next to it;
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

  // Nothing may name a row by its number — not a step cell, not the notes below
  // the table. The order is derived, so a number written down is a claim about
  // an arrangement that the next reorder will move out from under it. Name the
  // sentence instead.
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const ordinal = line.match(/\b(items?|rows?|sentences?)\s+(\d+)\b/i);
      if (!ordinal) return;
      // The table's own `| 4 |` column is the numbering; it is allowed to exist.
      if (/^\|\s*\d+\s*\|/.test(line)) return;
      problems.push(
        `${dir}:${i + 1} refers to "${ordinal[0]}". The order is derived — ` +
          'name the sentence, not its position.',
      );
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
/** The ledger's last column, per `<dir>#<row>`: what it claims about that row. */
const ledgerRows = new Map();
const ledgerClaim = (dir, n) => ledgerRows.get(`${dir}#${n}`) ?? null;

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
    const row = line.match(/^\|\s*(\d+)\s*\|([^|]+)\|(.*)$/);
    if (row && heading) {
      const columns = row[3]
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c.length);
      ledger.get(heading).push({
        n: Number(row[1]),
        text: row[2].trim(),
        last: columns[columns.length - 1] ?? '',
      });
    }
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
    if (dir) for (const r of rows) ledgerRows.set(`${dir}#${r.n}`, r.last);
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

/**
 * A step cell that names a construction, against the tree the course stores.
 *
 * The step column is the only prose that travels with a sentence, and it is the
 * prose most likely to end up on the wrong row. Four cells in the particle
 * lesson called a particle a preposition and a preposition a particle; one
 * nominal clause was called a fused relative; a participial was called a
 * passive the model deliberately does not record. Every one of those is a word
 * the tree can be asked about.
 *
 * A cell that says what a sentence is NOT is left alone — *not a gerund* is a
 * true thing to say about a progressive.
 */
const factsOf = (sentence) => {
  const f = new Set();
  for (const reading of sentence.readings) {
    for (const c of Object.values(reading.constituents)) {
      f.add(`form:${c.form}`);
      if (c.function) f.add(`fn:${c.function}`);
      if (c.verbType) f.add(`vt:${c.verbType}`);
      if (c.partKind) f.add(`part:${c.partKind}`);
      if (c.voice) f.add(`voice:${c.voice}`);
      if (c.clauseKind) f.add(`kind:${c.clauseKind}`);
      if (c.finiteness) f.add(`fin:${c.finiteness}`);
      if (c.fusedWith) f.add('fused');
      if (c.gap) f.add('gap');
    }
  }
  return f;
};

const TERMS = [
  { word: /\bpreposition(al)?\b/i, held: (f) => f.has('form:PP') || f.has('form:P') },
  { word: /\bparticle\b/i, held: (f) => f.has('part:verbal') },
  { word: /\bobject complement\b/i, held: (f) => f.has('fn:objectComplement') },
  {
    // In the passive the indirect object has become the subject, so a step that
    // says so is right about a tree that no longer holds one.
    word: /\btwo objects\b|\bindirect object\b/i,
    held: (f) => f.has('fn:indirectObject') || f.has('voice:passive'),
  },
  { word: /\bpassive\b/i, held: (f) => f.has('voice:passive') },
  { word: /\bappositive\b/i, held: (f) => f.has('fn:appositive') },
  { word: /\bfused\b/i, held: (f) => f.has('fused') },
  { word: /\brelative\b/i, held: (f) => f.has('kind:relative') },
  { word: /\bauxiliar/i, held: (f) => f.has('fn:auxiliary') },
  { word: /\bpronoun\b/i, held: (f) => f.has('form:Pron') },
  { word: /\binfinitive\b|\binfinitival\b/i, held: (f) => f.has('fin:infinitival') },
  { word: /\bgap\b/i, held: (f) => f.has('gap') },
];

let termsChecked = 0;
for (const lesson of COURSE_LESSONS) {
  const dir = dirs.find((d) => d.startsWith(String(lesson.number).padStart(2, '0') + '-'));
  if (!dir || !existsSync(`${DOCS}/${dir}/sentences.md`)) continue;
  const rows = readSentences(`${DOCS}/${dir}/sentences.md`);
  lesson.sentences.forEach((sentence, i) => {
    const row = rows[i];
    if (!row) return;
    const step = row.step.replace(/[*_`†]/g, '');
    // A denial is a claim about what the tree does not hold, and this check
    // cannot tell the two apart, so it stays out of them.
    if (/\b(not|never|no|nothing)\b/i.test(step)) return;
    const facts = factsOf(sentence);
    const missed = TERMS.filter((term) => term.word.test(step) && !term.held(facts));
    termsChecked += TERMS.filter((term) => term.word.test(step)).length;
    if (missed.length) {
      problems.push(
        `${dir} row ${i + 1}: the step says "${step}" and no reading of ` +
          `"${sentence.text}" holds one. A step describes its own sentence.`,
      );
    }
  });
}

/**
 * A page may not say a decision is unused while the course uses it.
 *
 * These pages measure two corpora: the one the sentences replaced, in the past
 * tense, and the live rows a reader reaches a few lines later. The openings were
 * written against the first and adopted as the second, so lesson 24 said
 * `aux:do` appeared in none of the four hundred sentences directly above two
 * sentences that use it.
 *
 * A decision key is written the way the palette writes it — `aux:do`,
 * `form:Interj` — so a claim about one is checkable. A sentence that says a
 * decision is absent has to be about the corpus that no longer exists, and say
 * so.
 */
const USED = new Set();
for (const lesson of COURSE_LESSONS) {
  for (const sentence of lesson.sentences) {
    for (const reading of sentence.readings) {
      for (const c of Object.values(reading.constituents)) {
        USED.add(`form:${c.form}`);
        if (c.function) USED.add(`func:${c.function}`);
        if (c.verbType) USED.add(`vt:${c.verbType}`);
        if (c.clauseKind) USED.add(`kind:${c.clauseKind}`);
        if (c.auxKind) USED.add(`aux:${c.auxKind}`);
        if (c.finiteness) USED.add(`fin:${c.finiteness}`);
        if (c.partKind) USED.add(`part:${c.partKind}`);
        if (c.voice) USED.add(`voice:${c.voice}`);
      }
    }
  }
}

/**
 * Claims about a decision going UNUSED, not every sentence with "no" in it.
 * `func:supplement` "fills no slot" is a definition; `aux:do` "appears nowhere
 * in the course" is a measurement, and measurements go stale.
 */
const ABSENCE =
  /(appears? (?:nowhere|in none)|used in none|never (?:used|exercised|appears)|taught and never|no (?:course )?sentence (?:uses|has|carries|contains)|none of the (?:400|four hundred)|nowhere in the (?:course|corpus)|unused)/i;
/** The past tense, or a phrase that names the corpus being talked about. */
const SCOPED = /\b(was|were|had|did|used to|replaced|before the conversion|this replaced)\b/i;

let claimsChecked = 0;
for (const dir of dirs) {
  for (const name of ['sentences.md', 'README.md']) {
    const file = `${DOCS}/${dir}/${name}`;
    if (!existsSync(file)) continue;
    const text = readFileSync(file, 'utf8');
    // Sentences, roughly: enough to keep a claim and its scope together.
    const prose = text
      .split('\n')
      // A table row is a list of cells, not a claim with a scope.
      .filter((line) => !/^\s*\|/.test(line))
      .join(' ');
    for (const claim of prose.split(/(?<=[.!?])\s+/)) {
      const keys = [...claim.matchAll(/`((?:form|func|vt|kind|aux|fin|part|voice):[A-Za-z]+)`/g)];
      if (!keys.length || !ABSENCE.test(claim)) continue;
      for (const [, key] of keys) {
        if (!USED.has(key)) continue;
        claimsChecked += 1;
        if (!SCOPED.test(claim)) {
          problems.push(
            `${dir}/${name}: "${claim.trim().slice(0, 120)}" says ${key} is absent, ` +
              'and the course uses it. Say which corpus, in the past tense.',
          );
        }
      }
    }
  }
}

/**
 * The optional lessons have proposals and no built sentences, and the ledger
 * says of each row whether it is in the corpus. That is the one per-row fact
 * the ledger carries, so it is the one worth checking.
 */
const BUILT = new Set(
  COURSE_LESSONS.flatMap((lesson) =>
    lesson.sentences.map((s) => s.text.replace(/\s+/g, ' ').trim().toLowerCase()),
  ),
);
for (const dir of dirs.filter((d) => /^\d\d[a-z]-/.test(d))) {
  const file = `${DOCS}/${dir}/sentences.md`;
  if (!existsSync(file)) continue;
  for (const row of readSentences(file)) {
    const text = row.text
      .replace(/[*_`†]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const inCorpus = BUILT.has(text.toLowerCase());
    const claim = ledgerClaim(dir, row.n);
    if (claim === null) continue;
    const says = /in the corpus/i.test(claim);
    if (says !== inCorpus) {
      problems.push(
        `ledger: ${dir} row ${row.n} — "${text}" is ${inCorpus ? '' : 'not '}built, ` +
          `and the ledger says "${claim}".`,
      );
    }
  }
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
console.log(
  `checked ${checked} files, ${termsChecked} step claims and ${claimsChecked} absence claims, no problems`,
);
