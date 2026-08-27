/**
 * The learner's partial structure (S04).
 *
 * Everything here is a pure function of state — no DOM, no component — so the
 * whole build flow is testable under `node --test`, and the structure a learner
 * can produce is exactly the structure `audits.ts` accepts.
 *
 * ## Form on create, function on click
 *
 * A constituent's FORM is intrinsic: "the engine" is a noun phrase whatever it
 * is doing. Its FUNCTION is relational: it is a direct object only once it sits
 * under a verb phrase. So the two are asked at different moments —
 *
 *   1. select a span → choose a form → a node exists
 *   2. click a node that now has a parent → choose its function
 *
 * That is not a UI convenience. It is Morenberg's form/function separation
 * turned into the interaction, and it is why a function menu can be filtered by
 * the parent at all: at step 1 there is no parent to filter by.
 */
import { licenses, type Verdict } from './rules.ts';
import { isPhraseForm } from './types.ts';
import type { Constituent, ConstituentMap, Form, Func, VerbType, Word } from './types.ts';

export interface BuildState {
  constituents: ConstituentMap;
  /** Monotonic id counter. Ids are never reused, so tween identity is stable. */
  seq: number;
  verbType: VerbType | null;
}

export const emptyBuild = (): BuildState => ({ constituents: {}, seq: 0, verbType: null });

/**
 * Deep-copy a constituent map.
 *
 * NOT `structuredClone`: the caller holds this state in a Svelte `$state`, which
 * is a Proxy, and `structuredClone` throws on proxies ("could not be cloned").
 * The shape here is small and fully known, so an explicit copy is both correct
 * and faster than a generic one.
 */
function cloneMap(cs: ConstituentMap): ConstituentMap {
  const out: ConstituentMap = {};
  for (const id of Object.keys(cs)) {
    const c = cs[id]!;
    out[id] = { ...c, children: [...c.children], span: [c.span[0], c.span[1]] };
  }
  return out;
}

export type Span = [number, number];

const inSpan = (s: Span, i: number) => i >= s[0] && i <= s[1];

/** Top-level nodes — those the learner has not yet wrapped in anything. */
export function roots(state: BuildState): string[] {
  return Object.keys(state.constituents)
    .filter((id) => state.constituents[id]!.parent === null)
    .sort((a, b) => state.constituents[a]!.span[0] - state.constituents[b]!.span[0]);
}

/** The root covering word `i`, if the learner has labelled it yet. */
export function rootAt(state: BuildState, i: number): string | null {
  return roots(state).find((id) => inSpan(state.constituents[id]!.span, i)) ?? null;
}

/**
 * ## Levels
 *
 * Once anything is nested, a run of words no longer names one thing. "the
 * engine" may be the N leaf, the NP over it, and the direct-object NP over
 * that — a STACK, not a node. So a selection carries a level, and these are the
 * moves between levels.
 *
 * The division of labour that keeps it unambiguous:
 *
 *   - **selecting a span means "make a new group over these words"** — it acts
 *     on the top-level nodes inside the span, so it always means *one level up*
 *     and can never be ambiguous;
 *   - **selecting a node** (by clicking it, or by walking up from a span) names
 *     exactly one thing, and is what relabelling, functions and ungrouping act
 *     on.
 */

/** Every node covering exactly this span, innermost first. */
export function stackOver(state: BuildState, span: Span): string[] {
  return Object.keys(state.constituents)
    .filter((id) => {
      const s = state.constituents[id]!.span;
      return s[0] === span[0] && s[1] === span[1];
    })
    .sort((a, b) => depthOf(state, b) - depthOf(state, a));
}

/** The outermost node covering exactly this span — what a fresh selection means. */
export function nodeOver(state: BuildState, span: Span): string | null {
  return stackOver(state, span).at(-1) ?? null;
}

export function depthOf(state: BuildState, id: string): number {
  let d = 0;
  let cur = state.constituents[id]?.parent ?? null;
  while (cur && d < 200) {
    d++;
    cur = state.constituents[cur]?.parent ?? null;
  }
  return d;
}

/** The smallest node whose span CONTAINS this span. Where ArrowUp goes. */
export function smallestCovering(state: BuildState, span: Span): string | null {
  let best: string | null = null;
  let bestWidth = Infinity;
  for (const id of Object.keys(state.constituents)) {
    const s = state.constituents[id]!.span;
    if (s[0] <= span[0] && s[1] >= span[1]) {
      const width = s[1] - s[0];
      if (width < bestWidth) {
        best = id;
        bestWidth = width;
      }
    }
  }
  return best;
}

/** One level out. */
export function parentOf(state: BuildState, id: string): string | null {
  return state.constituents[id]?.parent ?? null;
}

/** One level in, toward `word`. */
export function childContaining(state: BuildState, id: string, word: number): string | null {
  return (
    state.constituents[id]?.children.find((k) => {
      const s = state.constituents[k]!.span;
      return word >= s[0] && word <= s[1];
    }) ?? null
  );
}

/**
 * May this span become a constituent?
 *
 * Two ways it cannot, and both are the crossing-bracket rule: a constituent is
 * a run of words with no gaps that does not cut an existing group in half.
 */
export function canWrap(state: BuildState, words: Word[], span: Span): Verdict {
  const [a, b] = span;
  if (a < 0 || b >= words.length || a > b) return { state: 'hidden' };

  if (a === b) {
    // A single word is always available: name it, rename it, or wrap it in a
    // one-word phrase. Which of those happens is decided by the form chosen.
    return { state: 'allowed' };
  }

  for (const id of roots(state)) {
    const s = state.constituents[id]!.span;
    const startsIn = inSpan(span, s[0]);
    const endsIn = inSpan(span, s[1]);
    if (startsIn !== endsIn) {
      const text = words
        .slice(s[0], s[1] + 1)
        .map((w) => w.text)
        .join(' ');
      return {
        state: 'disabled',
        reason: `That would cut “${text}” in half. A group has to be taken whole.`,
      };
    }
  }

  for (let i = a; i <= b; i++) {
    if (rootAt(state, i) === null) {
      return {
        state: 'disabled',
        reason: `Name what “${words[i]?.text}” is before grouping it with anything.`,
      };
    }
  }
  return { state: 'allowed' };
}

/** Create (or relabel) a node over `span` with `form`. Pure. */
export function wrap(state: BuildState, words: Word[], span: Span, form: Form): BuildState {
  const [a, b] = span;
  const cs: ConstituentMap = cloneMap(state.constituents);
  let seq = state.seq;

  if (a === b) {
    const leaf = roots({ ...state, constituents: cs }).find(
      (id) => cs[id]!.word === a && cs[id]!.parent === null,
    );
    // The chosen FORM disambiguates the two things a single-word selection can
    // mean. A word form renames the word ("that is a pronoun, not a noun"); a
    // phrase form wraps it ("that pronoun is a noun phrase"). One-word phrases
    // are ordinary — every pronoun subject is one — so the second case cannot
    // be folded into the first.
    if (isPhraseForm(form)) {
      if (!leaf) {
        return state; // nothing to wrap yet; canWrap() explains why
      }
      const id = `c${++seq}`;
      cs[id] = { form, function: null, parent: null, children: [leaf], span: [a, a] };
      cs[leaf]!.parent = id;
      return { constituents: cs, seq, verbType: state.verbType };
    }
    if (leaf) {
      cs[leaf]!.form = form;
      return { ...state, constituents: cs };
    }
    const id = `c${++seq}`;
    cs[id] = { form, function: null, parent: null, children: [], span: [a, a], word: a };
    return { constituents: cs, seq, verbType: state.verbType };
  }

  const kids = roots({ ...state, constituents: cs }).filter((id) => inSpan(span, cs[id]!.span[0]));
  const id = `c${++seq}`;
  cs[id] = { form, function: null, parent: null, children: kids, span: [a, b] };
  for (const k of kids) cs[k]!.parent = id;
  return { constituents: cs, seq, verbType: state.verbType };
}

/** Assign a node's function. Only meaningful once it has a parent. */
export function setFunction(state: BuildState, id: string, fn: Func | null): BuildState {
  if (!state.constituents[id]) return state;
  const cs = cloneMap(state.constituents);
  cs[id]!.function = fn;
  return { ...state, constituents: cs };
}

export function setVerbType(state: BuildState, verbType: VerbType | null): BuildState {
  return { ...state, verbType };
}

/** Remove a node, returning its children to the top level. Never orphans a word. */
export function unwrap(state: BuildState, id: string): BuildState {
  const c = state.constituents[id];
  if (!c) return state;
  const cs = cloneMap(state.constituents);
  const parent = c.parent;
  for (const k of c.children) cs[k]!.parent = parent;
  if (parent && cs[parent]) {
    cs[parent]!.children = cs[parent]!.children.flatMap((x) => (x === id ? c.children : [x]));
  }
  delete cs[id];
  return { ...state, constituents: cs };
}

/**
 * Is the function `fn` available for node `id`, given its parent and siblings?
 * Delegates to the same `licenses()` the audits use — one rule set, so what a
 * learner can build is what the content must satisfy.
 */
export function licenseFor(state: BuildState, id: string, fn: Func): Verdict {
  const c = state.constituents[id];
  if (!c) return { state: 'hidden' };
  if (c.parent === null) {
    return {
      state: 'disabled',
      reason: 'This is not part of anything yet — group it first, then say what it does.',
    };
  }
  const parent = state.constituents[c.parent]!;
  const siblings = parent.children
    .filter((k) => k !== id)
    .map((k) => state.constituents[k]?.function)
    .filter((x): x is Func => x != null);
  return licenses(fn, {
    parentForm: parent.form,
    verbType: state.verbType,
    siblings,
    childForm: c.form,
  });
}

/** Structure complete enough to grade: one root that covers every word. */
export function isComplete(state: BuildState, words: Word[]): boolean {
  const r = roots(state);
  if (r.length !== 1) return false;
  const s = state.constituents[r[0]!]!.span;
  return s[0] === 0 && s[1] === words.length - 1;
}

/** A snapshot the renderer can draw — the same shape a frozen Reading carries. */
export function asConstituents(state: BuildState): ConstituentMap {
  return state.constituents;
}

export type { Constituent };
