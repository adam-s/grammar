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
 * is doing. Its FUNCTION is relational. The UI may ask for it before the
 * containing VP or S is drawn, then preserve the graded answer when that
 * parent is created —
 *
 *   1. select a span → choose a form → a node exists
 *   2. click the node → choose a compatible function hypothesis
 *
 * That is not a UI convenience. It is Morenberg's form/function separation
 * turned into the interaction. Structural form compatibility filters the menu;
 * verb-frame correctness is left to the grader so construction order never
 * reveals or hides an answer.
 */
import {
  clauseOf,
  governingVerb,
  governingVerbType,
  governingVoice,
  isClauseNode,
  verbs,
} from './clause.ts';
import { hypothesizes, licenses, type LicenseContext, type Verdict } from './rules.ts';
import { isPhraseForm, isPunctuation } from './types.ts';
import type {
  ClauseKind,
  Constituent,
  ConstituentMap,
  Finiteness,
  Form,
  Func,
  PartKind,
  VerbType,
  Voice,
  Word,
} from './types.ts';

export interface BuildState {
  constituents: ConstituentMap;
  /** Monotonic id counter. Ids are never reused, so tween identity is stable. */
  seq: number;
}

export const emptyBuild = (): BuildState => ({ constituents: {}, seq: 0 });

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
    // Punctuation is in the sentence and not in the tree. There is no word
    // class it could take, so every option is refused with the same reason
    // rather than one of them being wrong.
    if (isPunctuation(words[a]!)) {
      return {
        state: 'disabled',
        reason: 'Punctuation marks the sentence; it is not one of the parts it is built from.',
      };
    }
    // Otherwise a single word is always available: name it, rename it, or wrap
    // it in a one-word phrase. Which of those happens the chosen form decides.
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
    // Punctuation inside the run is skipped, not waited for. It never gets a
    // node, so requiring one would make *the mechanic repaired the engine, and
    // the car started* impossible to group at the top.
    if (isPunctuation(words[i]!)) continue;
    if (rootAt(state, i) === null) {
      return {
        state: 'disabled',
        reason: `Name what “${words[i]?.text}” is before grouping it with anything.`,
      };
    }
  }

  // Grouping puts a new node over nodes that are currently loose. If one node
  // already covers all of these words and more, there is nothing loose in here
  // to group, and the pick would have done nothing at all.
  const covering = roots(state).find((id) => {
    const s = state.constituents[id]!.span;
    return s[0] <= a && s[1] >= b && !(s[0] === a && s[1] === b);
  });
  if (covering) {
    const s = state.constituents[covering]!.span;
    const text = words
      .slice(s[0], s[1] + 1)
      .map((w) => w.text)
      .join(' ');
    return {
      state: 'disabled',
      reason: `These words are already inside “${text}”. Ungroup it first.`,
    };
  }

  return { state: 'allowed' };
}

/**
 * Can a new node go over `current` without replacing it?
 *
 * Same-span stacking is not exotic. A clause with no subject — the reduced
 * relative in *the horse **raced past the barn** fell* — is a `Cl` whose only
 * child is a `VP` over the very same words, and a noun phrase with modifiers
 * and no determiner — *old cars* — is an `NP` over a `Nom` over the same words.
 * Neither has anywhere else to live.
 *
 * The menu used to guess which was meant from the form picked, which worked
 * only for the two forms it knew about. It now asks: a loose phrase gets a
 * second group, "or is it inside something bigger?", and the row the learner
 * clicks says which of the two they meant. So this answers only whether the
 * question is worth asking at all.
 */
export function canStackOver(current: Constituent | undefined): boolean {
  // A word is renamed, never stacked on — wrapping a word in a phrase is
  // already the ordinary one-word-phrase move and has its own group.
  if (!current || current.word !== undefined) return false;
  // Inside a group, adding a layer would change what the group is made of.
  return current.parent === null;
}

/** Create (or relabel) a node over `span` with `form`. Pure. */
export function wrap(state: BuildState, words: Word[], span: Span, form: Form): BuildState {
  const [a, b] = span;
  const cs: ConstituentMap = cloneMap(state.constituents);
  let seq = state.seq;

  if (a === b) {
    // The thing a one-word phrase goes over is whatever is loose on that word:
    // usually the word leaf, but an existing one-word phrase when the learner
    // is stacking a second layer on it.
    const leaf = roots({ ...state, constituents: cs }).find(
      (id) => cs[id]!.parent === null && cs[id]!.span[0] === a && cs[id]!.span[1] === a,
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
      if (cs[leaf]!.form === form) return state; // a node cannot go inside itself
      const id = `c${++seq}`;
      cs[id] = { form, function: null, parent: null, children: [leaf], span: [a, a] };
      cs[leaf]!.parent = id;
      return { constituents: cs, seq };
    }
    if (leaf && cs[leaf]!.word !== undefined) {
      cs[leaf]!.form = form;
      return { ...state, constituents: cs };
    }
    if (leaf) return state; // a word form cannot rename a phrase
    const id = `c${++seq}`;
    cs[id] = { form, function: null, parent: null, children: [], span: [a, a], word: a };
    return { constituents: cs, seq };
  }

  const kids = roots({ ...state, constituents: cs }).filter(
    (id) => !cs[id]!.gap && inSpan(span, cs[id]!.span[0]),
  );
  if (kids.length === 0) return state;
  // The node's extent is what it actually holds, not what the pointer swept.
  // A selection that runs over the closing period should produce a sentence
  // that ends at the last word, not one that claims the period.
  const lo = Math.min(...kids.map((k) => cs[k]!.span[0]));
  const hi = Math.max(...kids.map((k) => cs[k]!.span[1]));
  const id = `c${++seq}`;
  cs[id] = { form, function: null, parent: null, children: kids, span: [lo, hi] };
  for (const k of kids) cs[k]!.parent = id;
  // Grouping is what puts a fronted phrase and a gap into the same clause.
  return linkFillers({ constituents: cs, seq });
}

/** Assign a function already accepted by the grader as a compatible hypothesis. */
export function setFunction(
  state: BuildState,
  id: string,
  fn: Func | null,
  obligatory = false,
): BuildState {
  if (!state.constituents[id]) return state;
  if (fn !== null && hypothesisFor(state, id, fn).state !== 'allowed') return state;
  const cs = cloneMap(state.constituents);
  cs[id]!.function = fn;
  if (fn === 'adverbial' && obligatory) cs[id]!.obligatory = true;
  else delete cs[id]!.obligatory;
  // Naming a phrase as fronted is what makes it the answer to a gap already in
  // its clause, so the link is checked for here rather than only at creation.
  return linkFillers({ ...state, constituents: cs });
}

/**
 * Classify one verb. `id` is the `V` leaf, so a sentence with two clauses gets
 * two independent answers rather than one that has to serve both.
 */
export function setVerbType(state: BuildState, id: string, verbType: VerbType | null): BuildState {
  const c = state.constituents[id];
  if (!c || c.form !== 'V') return state;
  const cs = cloneMap(state.constituents);
  if (verbType === null) delete cs[id]!.verbType;
  else cs[id]!.verbType = verbType;
  return { ...state, constituents: cs };
}

/**
 * Put one verb in the active or the passive.
 *
 * Voice sits on the same `V` leaf as the type, for the same reason: a sentence
 * can hold a passive clause inside an active one, and one answer per sentence
 * could not say that.
 */
export function setVoice(state: BuildState, id: string, voice: Voice): BuildState {
  const c = state.constituents[id];
  if (!c || c.form !== 'V') return state;
  const cs = cloneMap(state.constituents);
  if (voice === 'active') delete cs[id]!.voice;
  else cs[id]!.voice = voice;
  return { ...state, constituents: cs };
}

/**
 * Put an empty slot into a node: a piece the sentence requires and never says.
 *
 * The one structure the learner cannot reach by selecting words, because it has
 * no words to select. So it is asked of the node that would hold it — "is
 * something missing here?" — and the answer builds it.
 *
 * A subject goes in front of what is already there; anything else goes after,
 * which is where English puts them. The index, when there is one, is not a
 * second decision: a clause holds at most one fronted phrase, so if there is
 * one, that is what fills the gap and nothing else could.
 */
export function addGap(state: BuildState, parentId: string, fn: Func): BuildState {
  const parent = state.constituents[parentId];
  if (!parent || parent.word !== undefined || parent.gap) return state;
  if (parent.children.some((k) => state.constituents[k]?.function === fn)) return state;

  const cs = cloneMap(state.constituents);
  const seq = state.seq + 1;
  const id = `c${seq}`;

  // Where the gap goes is not a decision either: English puts a subject after
  // whatever introduces the clause and before the predicate, and an object
  // after the verb. So the gap slots in among the children by the same order,
  // and takes the word position of whatever it now sits in front of.
  const rank = (f: Func | null): number =>
    f === null ? SLOT_ORDER.length : SLOT_ORDER.indexOf(f) + 1 || SLOT_ORDER.length;
  const after = parent.children.filter((k) => rank(cs[k]!.function) > rank(fn));
  const at = after.length > 0 ? cs[after[0]!]!.span[0] : parent.span[1] + 1;

  cs[id] = {
    form: 'NP',
    function: fn,
    parent: parentId,
    children: [],
    span: [at, at - 1],
    gap: true,
  };

  const cut = parent.children.length - after.length;
  cs[parentId]!.children = [...parent.children.slice(0, cut), id, ...parent.children.slice(cut)];
  return linkFillers({ constituents: cs, seq });
}

/**
 * Surface order of the slots inside a clause and a verb phrase.
 *
 * Only used to place a gap, which has no words to place it by. Everything with
 * words is placed by its words.
 */
const SLOT_ORDER: readonly Func[] = [
  'prenucleus',
  'marker',
  'subject',
  'predicate',
  'head',
  'auxiliary',
  'particle',
  'indirectObject',
  'directObject',
  'objectComplement',
  'subjectComplement',
  'adverbial',
];

/**
 * Tie each gap to the fronted phrase that fills it.
 *
 * Not a decision the learner makes, because there is never more than one answer
 * to it: a clause holds at most one fronted phrase, so if a clause has one and
 * a gap, they are the same thing. Asking would be a question with one option.
 *
 * Run after every edit that could bring the two into the same clause. Neither
 * exists at the moment the other is built — a learner makes the gap inside a
 * bare verb phrase, and the clause that joins them comes later — so the link
 * cannot be made when either one is created.
 */
export function linkFillers(state: BuildState): BuildState {
  const cs = state.constituents;
  const pending: [string, string][] = [];
  for (const id of Object.keys(cs)) {
    if (!isClauseNode(cs, id)) continue;
    const filler = cs[id]!.children.find((k) => cs[k]?.function === 'prenucleus');
    if (!filler || cs[filler]!.index !== undefined) continue;
    const gapId = Object.keys(cs).find(
      (k) => cs[k]!.gap && cs[k]!.index === undefined && clauseOf(cs, k) === id,
    );
    if (gapId) pending.push([filler, gapId]);
  }
  if (pending.length === 0) return state;

  const next = cloneMap(cs);
  let index = Math.max(0, ...Object.values(next).map((c) => c.index ?? 0));
  for (const [filler, gapId] of pending) {
    index += 1;
    next[filler]!.index = index;
    next[gapId]!.index = index;
  }
  return { ...state, constituents: next };
}

/** The slots a node could hold as a gap: licensed here, and not yet filled. */
export function gappableSlots(state: BuildState, id: string): Func[] {
  const c = state.constituents[id];
  if (!c || c.word !== undefined || c.gap) return [];
  const candidates: Func[] =
    c.form === 'VP'
      ? ['directObject', 'indirectObject', 'subjectComplement', 'objectComplement']
      : c.form === 'S' || c.form === 'Cl'
        ? ['subject']
        : [];
  const siblings = c.children
    .map((k) => state.constituents[k]?.function)
    .filter((x): x is Func => x != null);
  // `hypothesizes`, not `licenses`, for the reason the rest of the palette uses
  // it: whether this verb takes an object is the question being asked, and a
  // row that disappeared until the verb was classified would answer it.
  return candidates.filter(
    (fn) =>
      !siblings.includes(fn) &&
      hypothesizes(fn, { parentForm: c.form, verbType: null, siblings, childForm: 'NP' }).state ===
        'allowed',
  );
}

/** Say which kind of `Part` a word is: infinitival *to*, or a verbal particle. */
export function setPartKind(state: BuildState, id: string, partKind: PartKind): BuildState {
  const c = state.constituents[id];
  if (!c || c.form !== 'Part') return state;
  const cs = cloneMap(state.constituents);
  cs[id]!.partKind = partKind;
  return { ...state, constituents: cs };
}

/** Say what job an embedded clause is doing. */
export function setClauseKind(state: BuildState, id: string, clauseKind: ClauseKind): BuildState {
  const c = state.constituents[id];
  if (!c || c.form !== 'Cl') return state;
  const cs = cloneMap(state.constituents);
  cs[id]!.clauseKind = clauseKind;
  return { ...state, constituents: cs };
}

/** Say what verb form a clause has. Finite is the standing answer. */
export function setFiniteness(state: BuildState, id: string, finiteness: Finiteness): BuildState {
  const c = state.constituents[id];
  if (!c || (c.form !== 'S' && c.form !== 'Cl')) return state;
  const cs = cloneMap(state.constituents);
  if (finiteness === 'finite') delete cs[id]!.finiteness;
  else cs[id]!.finiteness = finiteness;
  return { ...state, constituents: cs };
}

/**
 * Classify the one verb in a single-clause build.
 *
 * A convenience, and deliberately a no-op when the build has more than one verb:
 * with two clauses the question "what kind of verb is it" has two answers, and
 * real interaction always names the node the learner selected.
 */
export function setOnlyVerbType(state: BuildState, verbType: VerbType | null): BuildState {
  const all = verbs(state.constituents);
  return all.length === 1 ? setVerbType(state, all[0]!, verbType) : state;
}

/** The verb type in force where this node sits. */
export function verbTypeFor(state: BuildState, id: string): VerbType | null {
  return governingVerbType(state.constituents, id);
}

/**
 * The verb a not-yet-parented node would answer to.
 *
 * A clause role can be chosen before its S exists, so there is no clause to
 * walk up to yet. While the tree has a single verb that verb is unambiguous;
 * once there are two, nothing on a loose node says which clause it will join,
 * so the answer is null and the licensing rules fall back to "unclassified".
 */
function looseVerbType(state: BuildState): VerbType | null {
  const all = verbs(state.constituents);
  return all.length === 1 ? (state.constituents[all[0]!]!.verbType ?? null) : null;
}

/** The voice a not-yet-parented node would answer to. Absent means active. */
function looseVoice(state: BuildState): Voice {
  const all = verbs(state.constituents);
  return all.length === 1 ? (state.constituents[all[0]!]!.voice ?? 'active') : 'active';
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

/** Parent implied by a clause role before that parent has been drawn. */
function prospectiveParent(fn: Func): Form | null {
  switch (fn) {
    case 'subject':
    case 'predicate':
      return 'S';
    case 'directObject':
    case 'indirectObject':
    case 'subjectComplement':
    case 'objectComplement':
    case 'adverbial':
      return 'VP';
    default:
      return null;
  }
}

/**
 * Is the function `fn` available for node `id`, given its parent and siblings?
 * Delegates to the same `licenses()` the audits use — one rule set, so what a
 * learner can build is what the content must satisfy.
 */
export function licenseFor(state: BuildState, id: string, fn: Func): Verdict {
  const c = state.constituents[id];
  if (!c) return { state: 'hidden' };
  if (c.parent === null && !prospectiveParent(fn)) return unparentedFunction();
  const ctx = functionContext(state, id, fn);
  return ctx ? licenses(fn, ctx) : { state: 'hidden' };
}

/** Menu affordance: compatible answers stay actionable until graded. */
export function hypothesisFor(state: BuildState, id: string, fn: Func): Verdict {
  const c = state.constituents[id];
  if (!c) return { state: 'hidden' };
  if (c.parent === null && !prospectiveParent(fn)) return unparentedFunction();
  const ctx = functionContext(state, id, fn);
  return ctx ? hypothesizes(fn, ctx) : { state: 'hidden' };
}

const unparentedFunction = (): Verdict => ({
  state: 'disabled',
  reason: 'This is not part of anything yet — group it first, then say what it does.',
});

function functionContext(state: BuildState, id: string, fn: Func): LicenseContext | null {
  const c = state.constituents[id];
  if (!c) return null;
  if (c.parent === null) {
    // Clause roles can be visible before their parent is drawn. Requiring the
    // learner to build VP or S first makes construction order—not grammar—the
    // gate. Treat roots with roles from the same prospective parent as siblings;
    // `wrap` preserves the validated choices when that parent is later created.
    const parentForm = prospectiveParent(fn);
    if (parentForm) {
      const siblings = roots(state)
        .filter((root) => root !== id)
        .map((root) => state.constituents[root]?.function)
        .filter((value): value is Func => value != null && prospectiveParent(value) === parentForm);
      return {
        parentForm,
        verbType: looseVerbType(state),
        voice: looseVoice(state),
        siblings,
        childForm: c.form,
      };
    }
    return null;
  }
  const parent = state.constituents[c.parent]!;
  const siblings = parent.children
    .filter((k) => k !== id)
    .map((k) => state.constituents[k]?.function)
    .filter((x): x is Func => x != null);
  return {
    parentForm: parent.form,
    verbType: governingVerbType(state.constituents, id) ?? looseVerbType(state),
    voice: governingVerb(state.constituents, id)
      ? governingVoice(state.constituents, id)
      : looseVoice(state),
    siblings,
    childForm: c.form,
  };
}

/** Structure complete enough to grade: one root that covers every word. */
export function isComplete(state: BuildState, words: Word[]): boolean {
  const r = roots(state);
  if (r.length !== 1) return false;
  const s = state.constituents[r[0]!]!.span;
  // Punctuation is never inside the tree, so a finished sentence runs from the
  // first real word to the last one rather than to the end of the token list.
  const real = words.filter((w) => !isPunctuation(w)).map((w) => w.i);
  if (real.length === 0) return false;
  return s[0] === real[0] && s[1] === real.at(-1);
}

/** A snapshot the renderer can draw — the same shape a frozen Reading carries. */
export function asConstituents(state: BuildState): ConstituentMap {
  return state.constituents;
}

export type { Constituent };
