/**
 * The structural audits.
 *
 * Every frozen reading must pass all of them, in CI, on every commit. They are
 * also the specification the S04 menu enforces live, via `rules.ts` — a parse
 * the learner can build is a parse the audits accept.
 *
 * Each failure is a plain-English sentence, because these strings are read
 * twice: once by whoever is fixing content, and once (for the licensing ones)
 * by a learner being told why a menu item is greyed out.
 */
import {
  antecedentOf,
  clauseNodes,
  clauseOf,
  elidedHeadOf,
  governingVerbType,
  governingVoice,
  isCoordination,
  predicateOf,
  verbOfClause,
} from './clause.ts';
import { licenses, hasPassive, requiredFor, slotsFor, HEAD_BEARING, LONG } from './rules.ts';
import {
  CLAUSE_FUNCTIONS,
  gapPosition,
  isEmpty,
  isPhraseForm,
  isPunctuation,
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
    if (c.gap) {
      // A gap is empty by definition, and its span is the only place that can
      // say so: `[at, at - 1]`. Anything else is a node claiming words it does
      // not have.
      if (!isEmpty(c)) {
        f.push(`"${id}" is a gap but its span [${c.span.join(', ')}] covers words`);
      }
      if (c.word !== undefined) f.push(`"${id}" is a gap but also wraps a word`);
      if (c.children.length > 0) f.push(`"${id}" is a gap but has children`);
      // A moved thing is always a phrase, so a gap standing for one is too.
      // An elided thing is whatever was said before, and English is happy to
      // leave a single word unsaid: *the PM arrived at six and the Queen __ at
      // seven*. The form is checked against the antecedent instead, below.
      if (c.function !== 'head' && !isPhraseForm(c.form)) {
        f.push(`"${id}" is a gap of form "${c.form}"; a gap stands where a phrase would`);
      }
      const at = gapPosition(c);
      if (at < 0 || at > ctx.words.length) {
        f.push(`"${id}" is a gap at ${at}, which is outside the sentence`);
      }
      continue;
    }
    if (isEmpty(c)) {
      f.push(`"${id}" covers no words but is not a gap`);
      continue;
    }
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

/**
 * Every word appears in exactly one leaf. No word dropped, none duplicated.
 *
 * Except punctuation, which appears in none. A comma marks the sentence rather
 * than being part of what it is built from, so it has no form to take and no
 * node to sit in — and a diagram that gave it one would be claiming something
 * false about English.
 */
export function auditCoverage(ctx: Ctx): string[] {
  const f: string[] = [];
  const count = new Map<number, number>();
  for (const c of Object.values(ctx.cs)) {
    if (c.word === undefined) continue;
    count.set(c.word, (count.get(c.word) ?? 0) + 1);
  }
  for (let i = 0; i < ctx.words.length; i++) {
    const n = count.get(i) ?? 0;
    const word = ctx.words[i]!;
    if (isPunctuation(word)) {
      if (n > 0) f.push(`"${word.text}" (word ${i}) is punctuation, so it belongs in no node`);
      continue;
    }
    if (n === 0) f.push(`"${word.text}" (word ${i}) is not in the diagram`);
    else if (n > 1) f.push(`"${word.text}" (word ${i}) appears in ${n} places`);
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
    // Counted over the words a node could hold. A comma inside a run is not a
    // hole in the run: *the engine, which stalled,* is contiguous even though
    // two of its indices are punctuation.
    let span = 0;
    for (let i = lo; i <= hi; i++) if (!isPunctuation(ctx.words[i]!)) span++;
    if (leaves.length !== span) {
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
    const others = parent.children.filter((k) => k !== id && ctx.cs[k]?.function != null);
    const siblings = others.map((k) => ctx.cs[k]!.function!);
    const v = licenses(c.function, {
      parentForm: parent.form,
      verbType: governingVerbType(ctx.cs, id),
      voice: governingVoice(ctx.cs, id),
      siblings,
      siblingForms: others.map((k) => ctx.cs[k]!.form),
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
  // An elided predicate borrows its verb, and its slots with it. There is
  // nothing in THIS clause to check against a frame: *and he will __* has no
  // object because the object is in the clause it copies, which answers for
  // both of them. The predicate may be the elided thing itself — *I forgot
  // what __* leaves out everything the clause would have said.
  if (ctx.cs[vpId]!.gap || elidedHeadOf(ctx.cs, vpId)) {
    if (!verbId) {
      f.push(`${where} leaves its verb unsaid and does not say which verb it copies`);
    }
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
    const helpers = vp.children.filter((k) => ctx.cs[k]?.function === 'auxiliary');
    if (helpers.length === 0) {
      f.push(`${where} is marked passive but has no helping verb: the passive needs "be"`);
    } else if (!helpers.some((k) => ctx.cs[k]?.auxKind === 'passive')) {
      f.push(
        `${where} is marked passive, but none of its helping verbs is the passive "be" — ` +
          '*was repairing* and *was repaired* differ in nothing else',
      );
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
    // Or a displaced subject: *There is a problem* completes its *be* with the
    // thing the sentence is about, which is behind the verb rather than in
    // front of it.
    const hasDisplaced = vp.children.some((k) => ctx.cs[k]?.function === 'displaced');
    if (!hasSC && !hasObligAdv && !hasDisplaced) {
      f.push(
        '"be" needs either a subject complement or an adverbial it requires ' +
          '(mark that adverbial `obligatory`)',
      );
    }
  }
  return f;
}

/* ------------------------------------------------------------------ 10: names */

/** A name is flat all through, or it is not flat at all. */
export function auditFlat(ctx: Ctx): string[] {
  const f: string[] = [];
  for (const [id, c] of Object.entries(ctx.cs)) {
    const flat = c.children.filter((k) => ctx.cs[k]?.function === 'flat');
    if (flat.length === 0 || flat.length === c.children.length) continue;
    f.push(
      `"${id}" has ${flat.length} of ${c.children.length} children marked flat; a name ` +
        'with no head has no head anywhere in it',
    );
  }
  return f;
}

/* ------------------------------------------------------- 9: gaps and fillers */

/**
 * Every gap is tied to something, and nothing is tied to two things.
 *
 * A gap is a claim that a slot is filled by material said elsewhere. Two
 * elsewheres exist, and they are different relations:
 *
 *   - **A filler in the same sentence.** *__What__ did she repair __?* — the
 *     gap and the word are one thing said once. `index` links them, and both
 *     ends carry it.
 *   - **An antecedent outside the clause.** *the engine __that stalled__* — the
 *     relative clause's subject gap answers to the nominal it modifies, which
 *     is not inside the clause and cannot be indexed from within it. So a gap
 *     in a relative clause needs no index, and having one would be a claim the
 *     structure cannot support.
 */
export function auditGaps(ctx: Ctx): string[] {
  const f: string[] = [];
  const byIndex = new Map<number, string[]>();
  for (const [id, c] of Object.entries(ctx.cs)) {
    if (c.index === undefined) continue;
    byIndex.set(c.index, [...(byIndex.get(c.index) ?? []), id]);
  }

  for (const [index, ids] of byIndex) {
    if (ids.length !== 2) {
      f.push(`index ${index} is on ${ids.length} nodes (${ids.join(', ')}); a link joins two`);
      continue;
    }
    // One end has to be displaced or unsaid, or the link says nothing: two
    // ordinary phrases sharing a number is a claim with no content.
    const moved = ids.filter((id) => ctx.cs[id]!.gap || ctx.cs[id]!.function === 'postnucleus');
    if (moved.length === 0) {
      f.push(
        `index ${index} joins two phrases that are both where they belong; a link says ` +
          'one of them was moved',
      );
    }
  }

  // A tail phrase says what it belongs to, or it is a supplement instead —
  // material at the edge that fills no role is a different claim.
  for (const [id, c] of Object.entries(ctx.cs)) {
    if (c.function !== 'postnucleus') continue;
    if (c.index === undefined) {
      f.push(`the tail phrase "${id}" does not say what it belongs to`);
    }
  }

  // An auxiliary hanging off a clause is subject-auxiliary inversion, and the
  // whole of what makes it that is coming before the subject. One sitting
  // after the subject is not inverted — it belongs in the verb phrase.
  for (const clause of clauseNodes(ctx.cs)) {
    const kids = ctx.cs[clause]!.children;
    const aux = kids.find((k) => ctx.cs[k]?.function === 'auxiliary');
    const subject = kids.find((k) => ctx.cs[k]?.function === 'subject');
    if (!aux || !subject) continue;
    if (ctx.cs[aux]!.span[0] > ctx.cs[subject]!.span[0]) {
      f.push(
        `"${aux}" hangs off the clause but comes after the subject; an auxiliary that ` +
          'has not moved belongs inside the verb phrase',
      );
    }
  }

  // A placeholder and the thing it stands in for are one claim in two places.
  for (const clause of clauseNodes(ctx.cs)) {
    const kids = ctx.cs[clause]!.children;
    const held = kids.some((k) => ctx.cs[k]?.function === 'placeholderSubject');
    const predicate = predicateOf(ctx.cs, clause);
    const moved =
      kids.some((k) => ctx.cs[k]?.function === 'extraposed') ||
      (predicate !== null &&
        ctx.cs[predicate]!.children.some((k) => ctx.cs[k]?.function === 'displaced'));
    if (held && !moved) {
      f.push(`"${clause}" has a placeholder subject and nothing for it to be holding a place for`);
    }
    if (moved && !held) {
      f.push(`"${clause}" has an extraposed part and nothing holding its place`);
    }
  }

  for (const [id, c] of Object.entries(ctx.cs)) {
    if (!c.gap) continue;
    // An elision is a third kind of link, and it runs the other way from a
    // filler-gap one: nothing was moved out, something was left unsaid because
    // it had already been said. *She repaired the engine, and he will __.*
    //
    // So it always has an index — there is no reading of an elided phrase
    // without knowing what it copies — and what it points at must be a real
    // phrase of the same kind, said earlier.
    if (c.function === 'head' || c.function === 'predicate') {
      const source = antecedentOf(ctx.cs, id);
      if (!source) {
        f.push(`the elided "${c.form}" at ${c.span[0]} does not say what it copies`);
      } else if (ctx.cs[source]!.form !== c.form) {
        f.push(
          `the elided "${c.form}" at ${c.span[0]} copies a ${ctx.cs[source]!.form}; ` +
            'what is left unsaid is the same kind of thing as what was said',
        );
      } else if (ctx.cs[source]!.span[0] > c.span[0]) {
        f.push(`the elided "${c.form}" at ${c.span[0]} copies something said after it`);
      }
      continue;
    }
    // A gap is indexed exactly when its clause holds the phrase that fills it.
    // Where it does not, the antecedent is outside — the nominal a relative
    // clause modifies, or the subject a hollow clause borrows: *The box was too
    // heavy to lift __*. Nothing inside can be pointed at, so pointing would be
    // a claim the structure cannot support.
    const clause = clauseOf(ctx.cs, id);
    const fronted =
      clause !== null && ctx.cs[clause]!.children.some((k) => ctx.cs[k]?.function === 'prenucleus');
    if (c.index === undefined && fronted) {
      f.push(`the gap "${id}" is not tied to the fronted phrase in its own clause`);
    }
    if (c.index !== undefined && !fronted) {
      f.push(
        `the gap "${id}" claims a filler, but its clause has none — what fills it is ` +
          'outside, and there is nothing inside to tie it to',
      );
    }
    if (c.function === null) {
      f.push(`the gap "${id}" has no function — a gap is a slot, and a slot has a job`);
    }
  }
  return f;
}

/* ------------------------------------------------------------- 8: finiteness */

/**
 * Which kind of `Part` a word is, and whether the clause agrees.
 *
 * *She wants **to** leave* and *She looked **up** the word* hold the same word
 * class doing unrelated jobs. One marks a verb with no tense; the other belongs
 * to the verb beside it. Recording which is which is what lets the two be
 * taught apart, so a `Part` with no answer is an unfinished reading — the same
 * standard the verb type is held to.
 */
export function auditFiniteness(ctx: Ctx): string[] {
  const f: string[] = [];
  for (const [id, c] of Object.entries(ctx.cs)) {
    if (c.form === 'Aux' && !c.auxKind) {
      const word = ctx.words[c.span[0]]?.text ?? id;
      f.push(`"${word}" is a helping verb but does not say which job it is doing`);
    }
    if (c.form !== 'Part') continue;
    const word = ctx.words[c.span[0]]?.text ?? id;
    if (!c.partKind) {
      f.push(`"${word}" is a particle but does not say which kind — infinitival or verbal`);
      continue;
    }
    if (c.function === 'marker' && c.partKind !== 'infinitival') {
      f.push(`"${word}" introduces a clause, so it is infinitival "to" rather than a particle`);
    }
    if (c.function === 'particle' && c.partKind !== 'verbal') {
      f.push(`"${word}" belongs to a verb, so it is a verbal particle rather than infinitival`);
    }
  }

  for (const clause of clauseNodes(ctx.cs)) {
    const c = ctx.cs[clause]!;
    // The four kinds name the jobs a clause can do inside another clause. The
    // sentence itself does no such job, and neither does a coordinate: *the
    // engine stalled and the car stopped* is two main clauses joined, not one
    // sitting inside the other. Every clause that does fill a role says which.
    if (c.form === 'Cl' && c.function !== 'coordinate' && !c.clauseKind) {
      f.push(`"${clause}" is a clause but does not say what kind — relative, nominal, adverbial`);
    }
    // A clause may have two introducing words doing different jobs, so ask each
    // question of the marker that answers it.
    const markers = c.children.filter((k) => ctx.cs[k]?.function === 'marker');
    const hasTo = markers.some((k) => ctx.cs[k]!.form === 'Part');
    const hasSubord = markers.some((k) => ctx.cs[k]!.form === 'Subord');
    const finite = c.finiteness ?? 'finite';
    if (hasTo && finite !== 'infinitival') {
      f.push(`"${clause}" is introduced by "to", so the clause is infinitival, not ${finite}`);
    }
    // Only when there is no *to* alongside it. *for anyone to lift* has a
    // subordinator and is not finite, and the *to* is what says so.
    if (hasSubord && !hasTo && finite !== 'finite') {
      f.push(`"${clause}" is introduced by a subordinator, which starts a finite clause`);
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
    // A gap has no head because it has no words. It stands where a phrase would
    // be, and asking what the missing phrase is headed by is asking about
    // something the sentence never said.
    if (c.gap) continue;
    // Neither does a coordination. *The cat and the dog* is two noun phrases
    // joined, and neither is the head of the other — the same reason a joined
    // clause is not asked what kind of verb it has.
    if (isCoordination(ctx.cs, id)) continue;
    // Nor does a name. *New York* has two pieces and neither is the one the
    // phrase is named after; asking which would be inventing an answer.
    if (c.children.every((k) => ctx.cs[k]?.function === 'flat') && c.children.length > 0) continue;
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
  ['finiteness', auditFiniteness],
  ['gaps', auditGaps],
  ['flat', auditFlat],
  ['head', auditHead],
];

/**
 * Run them all. `structure` runs first and short-circuits: the rest walk the
 * tree, and a broken tree makes their output noise rather than signal.
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
    case 'supplement':
      return 'supplement';
    case 'prenucleus':
      return 'fronted phrase';
    case 'postnucleus':
      return 'tail phrase';
    case 'placeholderSubject':
      return 'placeholder subject';
    case 'extraposed':
      return 'extraposed part';
    case 'displaced':
      return 'displaced subject';
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
