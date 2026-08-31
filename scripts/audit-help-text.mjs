/**
 * Every piece of help text a learner can be shown, enumerated and audited.
 *
 * Walks every course sentence through its canonical build, and at every
 * state asks the same functions the app asks — `sessionChoices` for the
 * panel, `answer` for the verdicts — for every selection a learner can make
 * there and every row they can press. That yields the complete corpus:
 * first-miss corrections, second-miss reasons, praise, alternate-reading
 * glosses, structural refusals, "Say it" demonstrations, panel prompts,
 * block reasons, and row notes.
 *
 * Two outputs:
 *   1. Mechanical audit (exit code): invariants every string must hold —
 *      whole sentences, no leaked internals, the subject named, the first
 *      miss never revealing the truth. These are the properties a machine
 *      can check; they cannot prove a hint is pedagogically right.
 *   2. `--corpus <file>`: the deduplicated corpus as markdown, grouped by
 *      kind, for a human read — which is the only audit that can judge
 *      usefulness.
 *
 *   node scripts/audit-help-text.mjs            # audit only
 *   node scripts/audit-help-text.mjs --corpus test-results/help-text.md
 */
import { writeFileSync } from 'node:fs';
import { COURSE_LESSONS } from '../src/lib/course/course.ts';
import { scopeThrough } from '../src/lib/course/scope.ts';
import { replaySentence } from '../src/lib/course/sentence-renderer.ts';
import { emptyBuild } from '../src/lib/grammar/builder.ts';
import { isPickable } from '../src/lib/grammar/options.ts';
import { answer, sessionChoices } from '../src/lib/grammar/session.ts';

const corpusPath = (() => {
  const at = process.argv.indexOf('--corpus');
  return at >= 0 ? process.argv[at + 1] : null;
})();

/** Random walks per sentence, off the canonical path. 0 disables. */
const walks = Number(process.argv.find((a) => a.startsWith('--walks='))?.split('=')[1] ?? 0);

/** Deterministic PRNG, so a failing walk can be re-run exactly. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** kind -> text -> { count, example } */
const corpus = new Map();
let situations = 0;

function put(kind, text, example) {
  if (!text) return;
  const byText = corpus.get(kind) ?? new Map();
  corpus.set(kind, byText);
  const hit = byText.get(text);
  if (hit) hit.count += 1;
  else byText.set(text, { count: 1, example });
}

const fresh = (build, selection) => ({
  build,
  selection,
  verdict: null,
  misses: {},
  rejected: {},
  navigation: null,
});

/**
 * Everything one situation can show a learner, harvested: the panel's own
 * copy, a first attempt at every pickable row, and a true second miss.
 */
function harvest(session, sentence, words, scope, where) {
  situations += 1;
  let panel;
  try {
    panel = sessionChoices(session, sentence, words, scope);
  } catch (error) {
    put('ENUMERATION ERROR', `${where}: ${error.message}`, where);
    return;
  }
  put('panel prompt', panel.prompt, where);
  put('panel blocked', panel.blocked, where);
  if (panel.singledOut) put(`say it (${panel.singledOut.kind})`, panel.singledOut.text, where);
  for (const action of panel.actions ?? []) put('action label', action.label, where);
  for (const group of panel.groups) {
    if (group.roleReason) put('group reason', group.roleReason, where);
    for (const option of group.options) {
      if (option.note) put(`note (${option.state})`, option.note, `${where}, ${option.key}`);
    }
  }
  const rows = panel.groups.flatMap((g) => g.options).filter(isPickable);
  const firsts = rows.map((row) => ({
    row,
    after: answer(session, sentence, words, row, scope),
  }));
  // Which rung a wrong answer landed on is the SESSION's fact, not the
  // verdict's: a walk arrives carrying earlier misses, and its first wrong
  // answer here may rightly be the second rung for that question.
  const rungOf = (after) => {
    for (const [key, count] of Object.entries(after.misses)) {
      if (count !== (session.misses[key] ?? 0)) return Math.min(count, 2);
    }
    return 1;
  };
  for (const { row, after } of firsts) {
    const v = after.verdict;
    if (!v) continue;
    const at = `${where}, picked ${row.label}`;
    const kind = v.kind === 'wrong' ? `miss ${rungOf(after)}` : v.kind;
    put(`${kind} text`, v.text, at);
    put(`${kind} test`, v.test, at);
  }
  // A second miss on each wrong row, reached the way a learner reaches it:
  // a DIFFERENT wrong answer to the SAME question first — misses are
  // counted per question, so the other wrong answer must come from the same
  // group or the second pick is still a first miss.
  const wrongs = firsts.filter((f) => f.after.verdict?.kind === 'wrong');
  const groupOf = (key) => panel.groups.find((g) => g.options.some((o) => o.key === key))?.id;
  for (const { row } of wrongs) {
    const other = wrongs.find(
      (f) => f.row.key !== row.key && groupOf(f.row.key) === groupOf(row.key),
    );
    if (!other) continue;
    const mid = answer(session, sentence, words, other.row, scope);
    const midPanel = sessionChoices(mid, sentence, words, scope);
    const again = midPanel.groups.flatMap((g) => g.options).find((o) => o.key === row.key);
    if (!again || !isPickable(again)) continue;
    const v = answer(mid, sentence, words, again, scope).verdict;
    if (v?.kind === 'wrong') {
      const at = `${where}, picked ${row.label} after another miss`;
      put('miss 2 text', v.text, at);
      put('miss 2 test', v.test, at);
    }
  }
  return firsts;
}

for (const lesson of COURSE_LESSONS) {
  const scope = scopeThrough(COURSE_LESSONS, lesson.number);
  for (const sentence of lesson.sentences) {
    const words = sentence.words;
    const replay = replaySentence(sentence);
    // Build states along the canonical path: before each step, plus done.
    const states = [emptyBuild(), ...replay.steps.map((s) => s.state)];
    for (let k = 0; k < states.length; k++) {
      const build = states[k];
      // Selections worth asking at this state: at the start, every single
      // word (learners begin anywhere); afterwards, whatever the canonical
      // path selects next — the situations the course actually steers into.
      const selections = [];
      if (k === 0) {
        for (let i = 0; i < words.length; i++) selections.push({ kind: 'span', span: [i, i] });
      }
      const step = replay.steps[k];
      if (step) {
        selections.push(
          step.kind === 'form'
            ? { kind: 'span', span: step.span }
            : { kind: 'node', id: step.choice.stack ? step.selectNodeId : step.nodeId },
        );
      }
      for (const selection of selections) {
        const where = `${sentence.id}, step ${k}, ${
          selection.kind === 'span'
            ? `“${words
                .slice(selection.span[0], selection.span[1] + 1)
                .map((w) => w.text)
                .join(' ')}”`
            : `node ${selection.id}`
        }`;
        harvest(fresh(build, selection), sentence, words, scope, where);
      }
    }
  }
}

/* ---------------------------------------------------- off-path walks */

// Learners wander. Each walk starts from an empty build and takes LEGAL
// picks in a random order — random selections, random pickable rows,
// wrong answers included — harvesting every situation on the way. This is
// where the strings live that no canonical enumeration reaches: panels over
// half-built structure, misses against off-path trees, say-it tests on
// selections the course never steers into.
if (walks > 0) {
  for (const lesson of COURSE_LESSONS) {
    const scope = scopeThrough(COURSE_LESSONS, lesson.number);
    for (const sentence of lesson.sentences) {
      const words = sentence.words;
      for (let walk = 0; walk < walks; walk++) {
        const rand = mulberry32(walk * 7919 + sentence.id.length * 104729 + lesson.number);
        const among = (list) => list[Math.floor(rand() * list.length)];
        let session = fresh(emptyBuild(), { kind: 'none' });
        for (let step = 0; step < 14; step++) {
          // A random selection: a word, a contiguous run, or a built node.
          const nodes = Object.keys(session.build.constituents);
          const roll = rand();
          let selection;
          if (roll < 0.4 || nodes.length === 0) {
            const i = Math.floor(rand() * words.length);
            selection = { kind: 'span', span: [i, i] };
          } else if (roll < 0.7) {
            const a = Math.floor(rand() * words.length);
            const b = Math.floor(rand() * words.length);
            selection = { kind: 'span', span: [Math.min(a, b), Math.max(a, b)] };
          } else {
            selection = { kind: 'node', id: among(nodes) };
          }
          session = { ...session, selection, verdict: null };
          const where = `${sentence.id}, walk ${walk} step ${step}`;
          const firsts = harvest(session, sentence, words, scope, where);
          if (!firsts || firsts.length === 0) continue;
          // Continue down one of the tried branches — right or wrong, the
          // walk keeps whatever the transaction returned.
          session = among(firsts).after;
        }
      }
    }
  }
}

/* ------------------------------------------------------------- the audit */

const problems = [];
const problem = (kind, text, example, why) =>
  problems.push(`[${kind}] ${why}\n    “${text}”\n    at ${example}`);

// The words a first miss may not contain: every second-miss reason names the
// truth with "it is a/the …" or "— it …", and a first miss must not.
const truthy = /\b(it is (a|an|the)\b|— it\b)/;

for (const [kind, byText] of corpus) {
  for (const [text, { example }] of byText) {
    if (kind === 'ENUMERATION ERROR') {
      problem(kind, text, example, 'the enumeration itself failed');
      continue;
    }
    if (/undefined|\[object|NaN|null/.test(text)) {
      problem(kind, text, example, 'leaked internal value');
    }
    if (/(form|func|vt|aux|fin|kind|part|gap|anchor|fuse):/i.test(text)) {
      problem(kind, text, example, 'leaked option key');
    }
    if (/\s\s|[.]{2}|\s[,.]/.test(text)) {
      problem(kind, text, example, 'broken spacing or punctuation');
    }
    if (/text$/.test(kind) && !/[.?!”]$/.test(text.trim())) {
      problem(kind, text, example, 'a verdict should end like a sentence');
    }
    // A first miss names the words it grades — either opening on the quoted
    // subject (the ladder's template) or quoting the group in the way (a
    // structural refusal, which skips the ladder by design).
    if (kind === 'miss 1 text' && !/“.+”/.test(text)) {
      problem(kind, text, example, 'a first miss should name the words it grades');
    }
    if (kind === 'miss 1 text' && truthy.test(text)) {
      problem(kind, text, example, 'a first miss must not reveal the truth');
    }
    if (/text$/.test(kind) && /\b(Nom|DP|Vtr|Vint|Vbe|Vlink|Vg|Vc)\b/.test(text)) {
      problem(kind, text, example, 'leaked taxonomy code');
    }
  }
}

/* ----------------------------------------------------------- the corpus */

if (corpusPath) {
  const lines = [
    '# Every piece of help text, everywhere it can appear',
    '',
    `Generated by \`scripts/audit-help-text.mjs\` from ${situations} situations`,
    `across ${COURSE_LESSONS.length} lessons. Verdicts that embed the selected`,
    'words are collapsed to templates — the quoted words become “…” — so the',
    'copy itself can be read whole. The count is how many distinct strings',
    'produce the template. Regenerate after copy changes; do not edit by hand.',
    '',
  ];
  const mask = (text) => text.replace(/“[^”]*”/g, '“…”');
  for (const [kind, byText] of [...corpus.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    // Whole transformed sentences ("Say it") cannot template: each is its
    // own piece of copy, and each needs a human ear. List them in full.
    const literal = byText.size <= 200 || kind.startsWith('say it');
    if (literal) {
      lines.push(`## ${kind} (${byText.size} distinct)`, '');
      const sorted = [...byText.entries()].sort((a, b) => b[1].count - a[1].count);
      for (const [text, { count, example }] of sorted) {
        lines.push(`- (${count}×) ${text}`);
        lines.push(`  - e.g. ${example}`);
      }
    } else {
      const templates = new Map();
      for (const [text, { example }] of byText) {
        const t = mask(text);
        const hit = templates.get(t);
        if (hit) hit.count += 1;
        else templates.set(t, { count: 1, example: `${example} — “${text}”` });
      }
      lines.push(`## ${kind} (${byText.size} distinct, ${templates.size} templates)`, '');
      const sorted = [...templates.entries()].sort((a, b) => b[1].count - a[1].count);
      for (const [text, { count, example }] of sorted) {
        lines.push(`- (${count}×) ${text}`);
        lines.push(`  - e.g. ${example}`);
      }
    }
    lines.push('');
  }
  writeFileSync(corpusPath, lines.join('\n'));
  console.log(`corpus: ${corpusPath}`);
}

const distinct = [...corpus.values()].reduce((n, m) => n + m.size, 0);
console.log(`${situations} situations, ${distinct} distinct strings across ${corpus.size} kinds`);
if (problems.length > 0) {
  console.error(`\nFAIL — ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log('every mechanical invariant holds');
