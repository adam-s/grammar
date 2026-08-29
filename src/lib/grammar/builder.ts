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
  isElision,
  governingVerbType,
  governingVoice,
  verbs,
} from './clause.ts';
import {
  HEAD_FORMS,
  fuses,
  hypothesizes,
  licenses,
  type LicenseContext,
  type Verdict,
} from './rules.ts';
import { isPhraseForm, isPunctuation } from './types.ts';
import type {
  AuxKind,
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

const containsSpan = (outer: Span, inner: Span): boolean =>
  outer[0] <= inner[0] && outer[1] >= inner[1];

const sameSpan = (left: Span, right: Span): boolean => left[0] === right[0] && left[1] === right[1];

/** The deepest phrase that contains `span`, optionally including an exact match. */
function containingPhrase(state: BuildState, span: Span, includeEqual: boolean): string | null {
  return (
    Object.keys(state.constituents)
      .filter((id) => {
        const c = state.constituents[id]!;
        return (
          c.word === undefined &&
          !c.gap &&
          containsSpan(c.span, span) &&
          (includeEqual || !sameSpan(c.span, span))
        );
      })
      .sort((a, b) => {
        const left = state.constituents[a]!.span;
        const right = state.constituents[b]!.span;
        const width = left[1] - left[0] - (right[1] - right[0]);
        return width || depthOf(state, b) - depthOf(state, a);
      })[0] ?? null
  );
}

/** Nodes available to group at one level of the tree. */
function childrenAt(state: BuildState, parent: string | null): string[] {
  return parent === null ? roots(state) : (state.constituents[parent]?.children ?? []);
}

/** Put a child into its parent's ordered list, replacing the children it adopts. */
function installChild(
  cs: ConstituentMap,
  parent: string | null,
  id: string,
  adopted: readonly string[],
  at: number,
) {
  if (parent === null) return;
  const siblings = cs[parent]!.children;
  const adoptedSet = new Set(adopted);
  const first = siblings.findIndex((child) => adoptedSet.has(child));
  if (first !== -1) {
    cs[parent]!.children = siblings.flatMap((child, index) =>
      index === first ? [id] : adoptedSet.has(child) ? [] : [child],
    );
    return;
  }
  const before = siblings.findIndex((child) => cs[child]!.span[0] > at);
  const cut = before === -1 ? siblings.length : before;
  cs[parent]!.children = [...siblings.slice(0, cut), id, ...siblings.slice(cut)];
}

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
 *   - **dragging on words means "build from these words"** — inside the deepest
 *     phrase already containing them when there is one;
 *   - **boxing sibling nodes means "group these nodes"** — one level above
 *     those siblings, even when that level is itself inside a larger phrase;
 *   - **clicking one node names exactly that thing**, and is what relabelling,
 *     functions and ungrouping act on.
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

/** The outermost node covering exactly this span. */
export function nodeOver(state: BuildState, span: Span): string | null {
  return stackOver(state, span).at(-1) ?? null;
}

/** The phrase a word-row selection will be refined inside, if one exists. */
export function containerFor(state: BuildState, span: Span): string | null {
  return containingPhrase(state, span, true);
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
 * A constituent is a run of words with no gaps that does not cut an existing
 * group in half. It may sit inside that group or contain it whole.
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

  // Properly nested boundaries are always compatible. Only a partial overlap
  // is a cut: a selection may contain an old group, or sit wholly inside one,
  // without destroying either boundary.
  for (const id of Object.keys(state.constituents)) {
    if (state.constituents[id]!.gap) continue;
    const s = state.constituents[id]!.span;
    const overlaps = span[0] <= s[1] && s[0] <= span[1];
    if (overlaps && !containsSpan(span, s) && !containsSpan(s, span)) {
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

/** The real-word bounds of a selection, excluding punctuation at its edges. */
function contentBounds(words: Word[], span: Span): Span | null {
  const inside: number[] = [];
  for (let i = span[0]; i <= span[1]; i++) if (!isPunctuation(words[i]!)) inside.push(i);
  return inside.length === 0 ? null : [inside[0]!, inside.at(-1)!];
}

/** Add a phrase at one known level, adopting the direct children in its span. */
function groupAt(
  state: BuildState,
  words: Word[],
  span: Span,
  form: Form,
  parent: string | null,
): BuildState {
  const bounds = contentBounds(words, span);
  if (!bounds) return state;
  const cs = cloneMap(state.constituents);
  const kids = childrenAt(state, parent).filter((id) => {
    const child = state.constituents[id]!;
    return !child.gap && containsSpan(bounds, child.span);
  });
  const seq = state.seq + 1;
  const id = `c${seq}`;
  cs[id] = { form, function: null, parent, children: kids, span: bounds };
  for (const child of kids) cs[child]!.parent = id;
  installChild(cs, parent, id, kids, bounds[0]);
  return linkFillers({ constituents: cs, seq });
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
    const exact = stackOver(state, span);
    const leaf = exact.at(-1);
    // The chosen FORM disambiguates the two things a single-word selection can
    // mean. A word form renames the word ("that is a pronoun, not a noun"); a
    // phrase form wraps it ("that pronoun is a noun phrase"). One-word phrases
    // are ordinary — every pronoun subject is one — so the second case cannot
    // be folded into the first.
    if (isPhraseForm(form)) {
      if (!leaf) {
        // A phrase over a word nobody has named yet. Legal, and unfinished:
        // `auditStructure` is what says a phrase needs something inside it, and
        // it says so when the parse is graded rather than while it is drawn.
        if (isPunctuation(words[a]!)) return state;
        const id = `c${++seq}`;
        const parent = containingPhrase(state, span, true);
        cs[id] = { form, function: null, parent, children: [], span: [a, a] };
        installChild(cs, parent, id, [], a);
        return { constituents: cs, seq };
      }
      if (cs[leaf]!.form === form) return state; // a node cannot go inside itself
      const id = `c${++seq}`;
      const parent = cs[leaf]!.parent;
      cs[id] = { form, function: null, parent, children: [leaf], span: [a, a] };
      cs[leaf]!.parent = id;
      installChild(cs, parent, id, [leaf], a);
      return { constituents: cs, seq };
    }
    const word = exact.find((id) => cs[id]!.word !== undefined);
    if (word) {
      cs[word]!.form = form;
      return { ...state, constituents: cs };
    }
    const parent = containingPhrase(state, span, true);
    const id = `c${++seq}`;
    cs[id] = { form, function: null, parent, children: [], span: [a, a], word: a };
    installChild(cs, parent, id, [], a);
    return { constituents: cs, seq };
  }

  // A same-form wrapper over the same words carries no new structure. The
  // learner-facing transaction reports this as a wrong attempt; the builder
  // also refuses it so no caller can manufacture an endless unary chain.
  const exact = nodeOver(state, span);
  if (exact && state.constituents[exact]!.form === form) return state;

  // A run wholly inside a phrase is grouped among that phrase's children. The
  // old root-only rule mistook this ordinary top-down refinement for a crossing
  // boundary and forced the learner to tear down correct outer structure.
  return groupAt(state, words, span, form, containingPhrase(state, span, false));
}

/**
 * Build from the word row, where an exact outer phrase means "inside this".
 *
 * Clicking a node still edits that exact node, and boxing sibling nodes still
 * groups above them. Dragging across the words is the distinct top-down path:
 * if a phrase already has precisely those bounds, the new detail goes beneath
 * its deepest layer and the established ancestor stays put.
 */
export function wrapInside(state: BuildState, words: Word[], span: Span, form: Form): BuildState {
  if (span[0] === span[1] && !isPhraseForm(form)) return wrap(state, words, span, form);
  const parent = containingPhrase(state, span, true);
  if (!parent) return wrap(state, words, span, form);
  if (
    state.constituents[parent]!.form === form &&
    sameSpan(state.constituents[parent]!.span, span)
  ) {
    return state;
  }
  return groupAt(state, words, span, form, parent);
}

/**
 * Say that one word is doing two jobs: heading its phrase and doing the job the
 * missing head's neighbour would have done.
 *
 * A single move rather than two, because half of it is not a state worth being
 * in — a determiner heading a noun phrase without being fused is exactly what
 * `auditFusion` rejects.
 */
export function setFusion(state: BuildState, id: string, fusedWith: Func): BuildState {
  const c = state.constituents[id];
  if (!c || c.parent === null) return state;
  const parent = state.constituents[c.parent]!;
  if (!fuses(parent.form, c.form, fusedWith)) return state;
  if (parent.children.some((k) => k !== id && state.constituents[k]?.function === 'head')) {
    return state;
  }
  const cs = cloneMap(state.constituents);
  cs[id]!.function = 'head';
  cs[id]!.fusedWith = fusedWith;
  return { ...state, constituents: cs };
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
 * Record a graded job whose immediate parent has not been drawn yet.
 *
 * A learner can recognise the complement in “on my feet” before grouping the
 * PP. The sentence grader supplies the future parent form; this function only
 * checks that the proposed relationship is structurally possible, then stores
 * the job on the child. `groupAt` preserves it when the parent is built later.
 */
export function setFunctionForParent(
  state: BuildState,
  id: string,
  fn: Func,
  parentForm: Form,
  obligatory = false,
): BuildState {
  const c = state.constituents[id];
  if (!c) return state;
  const actual = c.parent ? state.constituents[c.parent] : null;
  if (actual?.form === parentForm) return setFunction(state, id, fn, obligatory);
  if (
    hypothesizes(fn, {
      parentForm,
      childForm: c.form,
      verbType: null,
      siblings: [],
      siblingForms: [],
    }).state !== 'allowed'
  ) {
    return state;
  }

  const cs = cloneMap(state.constituents);
  cs[id]!.function = fn;
  if (fn === 'adverbial' && obligatory) cs[id]!.obligatory = true;
  else delete cs[id]!.obligatory;
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
export function addGap(
  state: BuildState,
  parentId: string,
  fn: Func,
  form: Form = 'NP',
): BuildState {
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
    form,
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
  // Auxiliaries come before the verb they help, so an elided head lands after
  // them: *and he will __ too*, not *and he __ will too*.
  'auxiliary',
  'head',
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
    const c = cs[id]!;
    // A moved gap only. An elided one is not what the fronted phrase came off
    // — *I forgot what __* leaves out the predicate, and *what* was fronted
    // from inside the material that is no longer there to point at.
    if (!c.gap || c.index !== undefined || isElision(cs, id)) continue;
    const filler = frontedAbove(cs, id);
    if (filler) pending.push([filler, id]);
  }
  if (pending.length === 0) return state;

  const next = cloneMap(cs);
  let free = Math.max(0, ...Object.values(next).map((c) => c.index ?? 0));
  for (const [filler, gapId] of pending) {
    // One fronted phrase can answer for several holes — *What did John buy __
    // and Mary sell __?* — so a filler that already has a number keeps it.
    if (next[filler]!.index === undefined) next[filler]!.index = ++free;
    next[gapId]!.index = next[filler]!.index;
  }
  return { ...state, constituents: next };
}

/**
 * The fronted phrase this gap answers to, if there is one.
 *
 * A walk up rather than a look at one clause: a coordination puts the fronted
 * phrase outside the clauses that hold the holes. It stops at a relative or
 * comparative clause with no fronted phrase of its own, because what fills a
 * gap there is the noun outside — never a phrase further out still.
 */
function frontedAbove(cs: ConstituentMap, id: string): string | null {
  let clause = clauseOf(cs, id);
  let guard = 0;
  while (clause && guard++ < 200) {
    const c = cs[clause]!;
    const filler = c.children.find((k) => cs[k]?.function === 'prenucleus');
    if (filler) return filler;
    if (c.clauseKind === 'relative' || c.clauseKind === 'comparative') return null;
    clause = clauseOf(cs, clause);
  }
  return null;
}

/**
 * Say what a tail phrase belongs to.
 *
 * Unlike the filler-gap link this is a real choice: a clause can hold several
 * phrases a tail could have moved off, and *A man came in who I knew* would
 * mean something else if the relative belonged to a different one. So it is
 * asked rather than derived.
 */
export function setAnchor(state: BuildState, tailId: string, anchorId: string): BuildState {
  const tail = state.constituents[tailId];
  const anchor = state.constituents[anchorId];
  const links = tail?.function === 'postnucleus' || isElision(state.constituents, tailId);
  if (!tail || !anchor || !links || tailId === anchorId) return state;
  const cs = cloneMap(state.constituents);
  const index = 1 + Math.max(0, ...Object.values(cs).map((c) => c.index ?? 0));
  cs[tailId]!.index = index;
  cs[anchorId]!.index = index;
  return { ...state, constituents: cs };
}

/**
 * The phrases a tail could have moved off: the other children of its clause,
 * and the phrases inside their predicate. A tail belongs to something said
 * earlier, so nothing after it is a candidate.
 */
export function anchorsFor(state: BuildState, id: string): string[] {
  const node = state.constituents[id];
  if (!node) return [];

  // An elided head copies something said earlier of exactly its own kind, and
  // "earlier" is the whole of the search: nothing after it can be what it
  // repeats.
  if (isElision(state.constituents, id)) {
    return Object.keys(state.constituents)
      .filter((k) => {
        const c = state.constituents[k]!;
        return k !== id && !c.gap && c.form === node.form && c.span[0] < node.span[0];
      })
      .sort((a, b) => state.constituents[a]!.span[0] - state.constituents[b]!.span[0]);
  }

  if (node.function !== 'postnucleus' || node.parent === null) return [];
  const clause = state.constituents[node.parent]!;
  const out: string[] = [];
  for (const k of clause.children) {
    const c = state.constituents[k];
    if (!c || k === id || c.gap || c.span[0] > node.span[0]) continue;
    if (c.form === 'NP' || c.form === 'AdjP' || c.form === 'AdvP') out.push(k);
    // A phrase inside the predicate can be the anchor too — the cleft's
    // singled-out phrase is the verb's complement, not the clause's subject.
    if (c.form === 'VP') {
      for (const g of c.children) {
        const inner = state.constituents[g];
        // `AdvP` too — the loop above takes NP, AdjP and AdvP at the clause, and
        // this one dropped the third. That is why *ran more quietly than we
        // expected* could not be built: the anchor sits inside the predicate.
        if (inner && !inner.gap && ['NP', 'AdjP', 'AdvP'].includes(inner.form)) out.push(g);
      }
    }
  }
  return out;
}

/** An empty slot a node could hold: what it would be, and what shape. */
export interface GappableSlot {
  fn: Func;
  form: Form;
  /**
   * True when the slot is empty because it was never said rather than because
   * it moved. The two are different claims and the palette words them apart.
   */
  elided: boolean;
}

/** The slots a node could hold as a gap: licensed here, and not yet filled. */
export function gappableSlots(state: BuildState, id: string): GappableSlot[] {
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
  const out: GappableSlot[] = candidates
    .filter(
      (fn) =>
        !siblings.includes(fn) &&
        hypothesizes(fn, { parentForm: c.form, verbType: null, siblings, childForm: 'NP' })
          .state === 'allowed',
    )
    .map((fn) => ({ fn, form: 'NP' as Form, elided: false }));

  // A head that is never said. *and he will __* leaves out the whole verb
  // phrase; *and the Queen __ at seven* leaves out just the verb. Which of the
  // two it is is the learner's answer, so both are offered.
  //
  // Only where something earlier could be what it repeats. Nothing is left
  // unsaid the first time it is said, so with no antecedent there is nothing
  // to offer — which also keeps the row off every half-built phrase.
  const saidEarlier = (form: Form) =>
    Object.keys(state.constituents).some((k) => {
      const other = state.constituents[k]!;
      return k !== id && !other.gap && other.form === form && other.span[1] < c.span[0];
    });

  if (!siblings.includes('head') && HEAD_FORMS[c.form]) {
    for (const form of HEAD_FORMS[c.form]!) {
      if (saidEarlier(form)) out.push({ fn: 'head', form, elided: true });
    }
  }

  // A clause may leave out everything it would have said: *I forgot what __*.
  // That is a bigger hole than a missing head, and the only place it fits is
  // the predicate slot, which is why the elision rules cover both.
  if ((c.form === 'S' || c.form === 'Cl') && !siblings.includes('predicate') && saidEarlier('VP')) {
    out.push({ fn: 'predicate', form: 'VP', elided: true });
  }
  return out;
}

/** Say which kind of `Part` a word is: infinitival *to*, or a verbal particle. */
export function setPartKind(state: BuildState, id: string, partKind: PartKind): BuildState {
  const c = state.constituents[id];
  if (!c || c.form !== 'Part') return state;
  const cs = cloneMap(state.constituents);
  cs[id]!.partKind = partKind;
  return { ...state, constituents: cs };
}

/** Say which of the five jobs a helping verb is doing. */
export function setAuxKind(state: BuildState, id: string, auxKind: AuxKind): BuildState {
  const c = state.constituents[id];
  if (!c || c.form !== 'Aux') return state;
  const cs = cloneMap(state.constituents);
  cs[id]!.auxKind = auxKind;
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
/**
 * `fusedWith` is the second job a caller is ABOUT to give this node, not one it
 * already has. Asking "may this be the head" of a determiner is answered no
 * until you say it is also the determiner, and the two arrive together.
 */
export function licenseFor(state: BuildState, id: string, fn: Func, fusedWith?: Func): Verdict {
  const c = state.constituents[id];
  if (!c) return { state: 'hidden' };
  if (c.parent === null && !prospectiveParent(fn)) return unparentedFunction();
  const ctx = functionContext(state, id, fn);
  if (!ctx) return { state: 'hidden' };
  return licenses(fn, fusedWith ? { ...ctx, fusedWith } : ctx);
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
  const others = parent.children.filter((k) => k !== id && state.constituents[k]?.function != null);
  const siblings = others.map((k) => state.constituents[k]!.function!);
  return {
    parentForm: parent.form,
    siblingForms: others.map((k) => state.constituents[k]!.form),
    fusedWith: c.fusedWith,
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
