/**
 * The seven structural audits (docs/taxonomy.md §5).
 *
 * Every frozen reading must pass all seven, in CI, on every commit. They are
 * also the specification the S04 menu enforces live, via `rules.ts` — a parse
 * the learner can build is a parse the audits accept.
 *
 * Each failure is a plain-English sentence, because these strings are read
 * twice: once by whoever is fixing content, and once (for the licensing ones)
 * by a learner being told why a menu item is greyed out.
 */
import {
  clauseNodes,
  governingVerbType,
  governingVoice,
  isCoordination,
  predicateOf,
  verbOfClause,
} from './clause.ts';
import { licenses, hasPassive, requiredFor, slotsFor, HEAD_BEARING, LONG } from './rules.ts';
import {
  CLAUSE_FUNCTIONS,
  isPhraseForm,
  isWordForm,
  type ClauseFunction,
  type Constituent,
  type ConstituentMap,
  type Func,
  type Reading,
  type Word,
} from './types.ts';

export interface AuditReport {
  ok: boolean;
  /** audit name -> failures. Present only for audits that found something. */
  failures: Record<string, string[]>;
  all: string[];
}

type Ctx = { cs: ConstituentMap; words: Word[]; reading: Reading; root: string | null };

/* ------------------------------------------------------------------ 6/7: structure */

/**
 * Single root, one parent each, no cycles, every edge resolvable, leaves and
 * phrases well-formed. Runs FIRST and, if it fails, the rest are skipped —
 * every other audit walks the tree and a cycle would hang them.
 */
export function auditStructure(ctx: Ctx): string[] {
  const { cs } = ctx;
  const f: string[] = [];
  const ids = Object.keys(cs);
  if (ids.length === 0) return ['the reading has no constituents'];

  const roots = ids.filter((id) => cs[id]!.parent === null);
  if (roots.length === 0) f.push('no root: every constituent claims a parent, so there is a cycle');
  if (roots.length > 1) f.push(`${roots.length} roots (${roots.join(', ')}); a sentence has one`);
  if (roots.length === 1 && cs[roots[0]!]!.form !== 'S') {
    f.push(`the root "${roots[0]}" is a ${cs[roots[0]!]!.form}; the root of a sentence is an S`);
  }

  for (const id of ids) {
    const c = cs[id]!;
    const leaf = c.word !== undefined;
    if (leaf) {
      if (c.children.length > 0) f.push(`"${id}" wraps a word but also has children`);
      if (!isWordForm(c.form)) {
        f.push(`"${id}" wraps a word but its form "${c.form}" is a phrase form`);
      }
      if (c.word! < 0 || c.word! >= ctx.words.length) {
        f.push(`"${id}" points at word ${c.word}, which is outside the sentence`);
      }
    } else {
      if (c.children.length === 0) f.push(`"${id}" is a ${c.form} with no children`);
      if (!isPhraseForm(c.form)) {
        f.push(`"${id}" has children but its form "${c.form}" is a word form`);
      }
    }
    for (const kid of c.children) {
      const k = cs[kid];
      if (!k) {
        f.push(`"${id}" claims child "${kid}", which does not exist`);
        continue;
      }
      if (k.parent !== id) {
        f.push(`"${kid}" is listed under "${id}" but its parent is "${k.parent}"`);
      }
    }
    if (c.parent !== null) {
      const p = cs[c.parent];
      if (!p) f.push(`"${id}" points at parent "${c.parent}", which does not exist`);
      else if (!p.children.includes(id)) {
        f.push(`"${c.parent}" does not list "${id}" among its children`);
      }
    }
  }

  // Reachability, recomputed here rather than trusting the parent links above.
  if (roots.length === 1) {
    const seen = new Set<string>();
    const stack = [roots[0]!];
    let guard = ids.length + 1;
    while (stack.length > 0 && guard-- > 0) {
      const id = stack.pop()!;
      if (seen.has(id)) {
        f.push(`"${id}" is reachable twice — the structure is not a tree`);
        break;
      }
      seen.add(id);
      for (const kid of cs[id]?.children ?? []) if (cs[kid]) stack.push(kid);
    }
    if (guard <= 0) f.push('the structure contains a cycle');
    else if (seen.size !== ids.length) {
      const lost = ids.filter((i) => !seen.has(i));
      f.push(`not reachable from the root: ${lost.join(', ')}`);
    }
  }
  return f;
}

/* ------------------------------------------------------------------- 1: coverage */

/** Every word appears in exactly one leaf. No word dropped, none duplicated. */
export function auditCoverage(ctx: Ctx): string[] {
  const f: string[] = [];
  const count = new Map<number, number>();
  for (const c of Object.values(ctx.cs)) {
    if (c.word === undefined) continue;
    count.set(c.word, (count.get(c.word) ?? 0) + 1);
  }
  for (let i = 0; i < ctx.words.length; i++) {
    const n = count.get(i) ?? 0;
    if (n === 0) f.push(`"${ctx.words[i]!.text}" (word ${i}) is not in the diagram`);
    else if (n > 1) f.push(`"${ctx.words[i]!.text}" (word ${i}) appears in ${n} places`);
  }
  return f;
}

/* ---------------------------------------------------------------------- 2: order */

/** Left-to-right leaf order equals surface word order. Words never move. */
export function auditOrder(ctx: Ctx): string[] {
  if (ctx.root === null) return [];
  const seq = leafOrder(ctx.cs, ctx.root);
  const f: string[] = [];
  for (let i = 1; i < seq.length; i++) {
    if (seq[i]! <= seq[i - 1]!) {
      f.push(
        `reading the diagram left to right gives "${ctx.words[seq[i]!]?.text}" before ` +
          `"${ctx.words[seq[i - 1]!]?.text}", but the sentence has them the other way round`,
      );
      break;
    }
  }
  return f;
}

function leafOrder(cs: ConstituentMap, root: string): number[] {
  const out: number[] = [];
  const walk = (id: string, depth: number) => {
    if (depth > 200) return;
    const c = cs[id];
    if (!c) return;
    if (c.word !== undefined) out.push(c.word);
    for (const kid of c.children) walk(kid, depth + 1);
  };
  walk(root, 0);
  return out;
}

/* ----------------------------------------------------------------- 3: contiguity */

/** Every constituent covers a contiguous run of words, and `span` says so truly. */
export function auditContiguity(ctx: Ctx): string[] {
  const f: string[] = [];
  for (const [id, c] of Object.entries(ctx.cs)) {
    const leaves = subtreeLeaves(ctx.cs, id);
    if (leaves.length === 0) continue;
    const lo = Math.min(...leaves);
    const hi = Math.max(...leaves);
    if (leaves.length !== hi - lo + 1) {
      f.push(`"${id}" (${c.form}) skips a word — a constituent is a run of words with no gaps`);
    }
    if (c.span[0] !== lo || c.span[1] !== hi) {
      f.push(`"${id}" records span [${c.span[0]}, ${c.span[1]}] but covers [${lo}, ${hi}]`);
    }
  }
  return f;
}

function subtreeLeaves(cs: ConstituentMap, root: string): number[] {
  const out: number[] = [];
  const walk = (id: string, depth: number) => {
    if (depth > 200) return;
    const c = cs[id];
    if (!c) return;
    if (c.word !== undefined) out.push(c.word);
    for (const kid of c.children) walk(kid, depth + 1);
  };
  walk(root, 0);
  return out;
}

/* ------------------------------------------------------------------ 4: licensing */

/** Every function is licensed by its parent, given the verb type and siblings. */
export function auditLicensing(ctx: Ctx): string[] {
  const f: string[] = [];
  for (const [id, c] of Object.entries(ctx.cs)) {
    if (c.parent === null) {
      if (c.function !== null) {
        f.push(`the root "${id}" should have no function, but has "${c.function}"`);
      }
      continue;
    }
    if (c.function === null) {
      f.push(`"${id}" (${c.form}) has no function — every constituent but the root does something`);
      continue;
    }
    const parent = ctx.cs[c.parent];
    if (!parent) continue; // structure audit already reported it
    const siblings = parent.children
      .filter((k) => k !== id)
      .map((k) => ctx.cs[k]?.function)
      .filter((x): x is Func => x != null);
    const v = licenses(c.function, {
      parentForm: parent.form,
      verbType: governingVerbType(ctx.cs, id),
      voice: governingVoice(ctx.cs, id),
      siblings,
      childForm: c.form,
    });
    if (v.state === 'allowed') continue;
    const why = v.state === 'disabled' ? v.reason : `a ${parent.form} has no ${label(c.function)}`;
    f.push(`"${id}" is a ${label(c.function)} under a ${parent.form}: ${why}`);
  }
  return f;
}

/* --------------------------------------------------------- 5: verb-type agreement */

/**
 * Every clause's recorded verb type matches the slots that clause actually
 * filled. A sentence can hold several clauses, and each one answers for itself.
 */
export function auditVerbType(ctx: Ctx): string[] {
  const f: string[] = [];
  if (ctx.root === null) return f;
  for (const clause of clauseNodes(ctx.cs)) f.push(...auditOneClause(ctx, clause));
  return f;
}

function auditOneClause(ctx: Ctx, clauseId: string): string[] {
  const f: string[] = [];
  // A coordination joins clauses; it does not predicate anything itself, so it
  // has no verb to classify. The clauses inside it are checked on their own.
  if (isCoordination(ctx.cs, clauseId)) return f;
  const where = ctx.cs[clauseId]!.form === 'S' ? 'the sentence' : `the clause "${clauseId}"`;
  const verbId = verbOfClause(ctx.cs, clauseId);
  const vt = verbId ? (ctx.cs[verbId]!.verbType ?? null) : null;
  const vpId = predicateOf(ctx.cs, clauseId);
  if (!vpId) {
    f.push(`${where} has no predicate, so its verb type cannot be checked`);
    return f;
  }
  if (vt === null) {
    f.push(`${where} has no classified verb — every clause records what kind its verb is`);
    return f;
  }
  const vp = ctx.cs[vpId]!;
  const filled = vp.children
    .map((k) => ctx.cs[k]?.function)
    .filter(
      (x): x is ClauseFunction => x != null && (CLAUSE_FUNCTIONS as readonly string[]).includes(x),
    );

  const voice = ctx.cs[verbId!]!.voice ?? 'active';
  const said = voice === 'passive' ? `a passive ${LONG[vt]} verb` : `a ${LONG[vt]} verb`;

  if (voice === 'passive') {
    if (!hasPassive(vt)) {
      f.push(
        `${where} is marked passive, but a ${LONG[vt]} verb has no object to move ` +
          'into the subject, so it has no passive',
      );
    }
    // *was repaired*, not *repaired*. A participle with no helping verb in
    // front of it is a different structure — a reduced relative — and building
    // one needs a gap where the subject would be (docs/model-gaps.md).
    if (!vp.children.some((k) => ctx.cs[k]?.function === 'auxiliary')) {
      f.push(`${where} is marked passive but has no helping verb: the passive needs "be"`);
    }
  }

  const permitted = slotsFor(vt, voice);
  for (const fn of filled) {
    if (fn === 'adverbial') continue;
    if (!permitted.includes(fn)) {
      f.push(`this is recorded as ${said}, but the predicate has ${a(label(fn))}`);
    }
  }
  for (const need of requiredFor(vt, voice)) {
    if (!filled.includes(need)) {
      f.push(`${said} needs ${a(label(need))}, and the predicate has none`);
    }
  }
  // The S V O A / obligatory-adverbial rule: `be` is satisfied by a subject
  // complement OR an adverbial the verb requires, and by nothing else.
  if (vt === 'Vbe') {
    const hasSC = filled.includes('subjectComplement');
    const hasObligAdv = vp.children.some(
      (k) => ctx.cs[k]?.function === 'adverbial' && ctx.cs[k]?.obligatory === true,
    );
    if (!hasSC && !hasObligAdv) {
      f.push(
        '"be" needs either a subject complement or an adverbial it requires ' +
          '(mark that adverbial `obligatory`)',
      );
    }
  }
  return f;
}

/* ----------------------------------------------------------------------- 7: head */

/** Every phrase has exactly one head. `S` and `Cl` are clauses, not phrases. */
export function auditHead(ctx: Ctx): string[] {
  const f: string[] = [];
  for (const [id, c] of Object.entries(ctx.cs)) {
    if (c.word !== undefined) continue;
    if (!HEAD_BEARING.includes(c.form)) continue;
    const heads = c.children.filter((k) => ctx.cs[k]?.function === 'head');
    if (heads.length === 0) f.push(`"${id}" is a ${c.form} with no head`);
    else if (heads.length > 1) {
      f.push(`"${id}" is a ${c.form} with ${heads.length} heads; a phrase has one`);
    }
  }
  return f;
}

/* -------------------------------------------------------------------- the runner */

const AUDITS: readonly [string, (ctx: Ctx) => string[]][] = [
  ['coverage', auditCoverage],
  ['order', auditOrder],
  ['contiguity', auditContiguity],
  ['licensing', auditLicensing],
  ['verbType', auditVerbType],
  ['head', auditHead],
];

/**
 * Run all seven. `structure` runs first and short-circuits: the other six walk
 * the tree, and a broken tree makes their output noise rather than signal.
 */
export function auditReading(reading: Reading, words: Word[]): AuditReport {
  const cs = reading.constituents;
  const rootIds = Object.keys(cs).filter((id) => cs[id]!.parent === null);
  const ctx: Ctx = { cs, words, reading, root: rootIds.length === 1 ? rootIds[0]! : null };

  const structure = auditStructure(ctx);
  if (structure.length > 0) {
    return { ok: false, failures: { structure }, all: structure };
  }
  const failures: Record<string, string[]> = {};
  const all: string[] = [];
  for (const [name, fn] of AUDITS) {
    const found = fn(ctx);
    if (found.length > 0) {
      failures[name] = found;
      all.push(...found);
    }
  }
  return { ok: all.length === 0, failures, all };
}

/** "an object complement", not "a object complement". These strings are read. */
const a = (noun: string): string => `${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun}`;

/** Plain-language name for a function, for messages a learner may read. */
export function label(fn: Func): string {
  switch (fn) {
    case 'directObject':
      return 'direct object';
    case 'indirectObject':
      return 'indirect object';
    case 'subjectComplement':
      return 'subject complement';
    case 'objectComplement':
      return 'object complement';
    case 'auxiliary':
      return 'helping verb';
    default:
      return fn;
  }
}

export function assertClean(reading: Reading, words: Word[], where: string): void {
  const r = auditReading(reading, words);
  if (!r.ok) throw new Error(`${where}: ${r.all.join('; ')}`);
}

export function isConstituent(x: unknown): x is Constituent {
  return typeof x === 'object' && x !== null && 'form' in x && 'span' in x;
}
