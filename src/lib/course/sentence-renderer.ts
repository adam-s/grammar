/**
 * Build a finished sentence through the same operations available to a learner.
 * The answer supplies decisions, but its tree is never handed to the renderer.
 */
import { verbs } from '../grammar/clause.ts';
import {
  addGap,
  canStackOver,
  setAnchor,
  emptyBuild,
  nodeOver,
  setAuxKind,
  setClauseKind,
  setFusion,
  setFiniteness,
  setFunction,
  setPartKind,
  setVerbType,
  setVoice,
  wrap,
  type BuildState,
  type Span,
} from '../grammar/builder.ts';
import {
  canonicalReading,
  type Constituent,
  type Form,
  type Func,
  type AuxKind,
  type ClauseKind,
  type Finiteness,
  type PartKind,
  type Reading,
  type SentenceEntry,
  type VerbType,
  type Voice,
} from '../grammar/types.ts';

export type RenderStep = {
  kind:
    | 'form'
    | 'function'
    | 'verb-type'
    | 'voice'
    | 'part-kind'
    | 'finiteness'
    | 'clause-kind'
    | 'aux-kind'
    | 'gap'
    | 'anchor';
  canonicalId: string | null;
  state: BuildState;
  /** The words the decision is about — what a learner would have selected. */
  span: Span;
  /** The node in `state` the decision landed on. */
  nodeId: string;
  /**
   * For a stacked form, the node that existed before this step and must be
   * selected to put the new layer over it.
   */
  selectNodeId?: string;
  /** The palette option a learner would have clicked to produce this step. */
  choice: {
    form?: Form;
    func?: Func;
    obligatory?: boolean;
    verbType?: VerbType;
    voice?: Voice;
    partKind?: PartKind;
    auxKind?: AuxKind;
    finiteness?: Finiteness;
    clauseKind?: ClauseKind;
    /** The form goes OVER what is already there rather than replacing it. */
    stack?: true;
    /** This step builds an empty slot rather than labelling words. */
    gap?: true;
    /** The second job this node does, when it does two. */
    fusedWith?: Func;
    /** This step says what a tail or elided phrase points at: the anchor's span. */
    anchor?: Span;
    /** The anchor's form. A span alone does not name a node. */
    anchorForm?: Form;
  };
};

export type SentenceReplay = { steps: RenderStep[]; final: BuildState };

/** The learner-facing option key that performs one replayed decision. */
export function replayOptionKey(choice: RenderStep['choice']): string {
  if (choice.anchor !== undefined) {
    return `anchor:${choice.anchorForm}:${choice.anchor[0]}-${choice.anchor[1]}`;
  }
  if (choice.fusedWith !== undefined) return `func:head+${choice.fusedWith}`;
  if (choice.gap && choice.func !== undefined) return `gap:${choice.func}:${choice.form}`;
  if (choice.form !== undefined) return `${choice.stack ? 'stack' : 'form'}:${choice.form}`;
  if (choice.func !== undefined) {
    return choice.func === 'adverbial' && choice.obligatory
      ? 'func:obligatoryAdverbial'
      : `func:${choice.func}`;
  }
  if (choice.voice !== undefined) return `voice:${choice.voice}`;
  if (choice.partKind !== undefined) return `part:${choice.partKind}`;
  if (choice.auxKind !== undefined) return `aux:${choice.auxKind}`;
  if (choice.finiteness !== undefined) return `fin:${choice.finiteness}`;
  if (choice.clauseKind !== undefined) return `kind:${choice.clauseKind}`;
  return `vt:${choice.verbType}`;
}

function roots(reading: ReturnType<typeof canonicalReading>): string[] {
  return Object.keys(reading.constituents)
    .filter((id) => reading.constituents[id]!.parent === null)
    .sort((a, b) => reading.constituents[a]!.span[0] - reading.constituents[b]!.span[0]);
}

/**
 * Children first is the builder's natural order: words, then their phrases.
 *
 * Gaps are left out. They have no words to select, so they cannot be built
 * before the node that holds them — they are added from the parent instead,
 * once it exists.
 */
function postorder(reading: ReturnType<typeof canonicalReading>, id: string, out: string[]): void {
  const constituent = reading.constituents[id];
  if (!constituent) throw new Error(`Unknown constituent ${id}.`);
  if (constituent.gap) return;
  for (const child of constituent.children) postorder(reading, child, out);
  out.push(id);
}

function applyFunction(
  state: BuildState,
  generatedId: string,
  constituent: Constituent,
): BuildState {
  // Fusion is one move, not two: a determiner heading a noun phrase is only
  // licensed because it is also the determiner, so the pair arrives together.
  if (constituent.fusedWith) return setFusion(state, generatedId, constituent.fusedWith);
  return setFunction(state, generatedId, constituent.function, constituent.obligatory === true);
}

/**
 * @param only  Which reading to replay. Defaults to the canonical one — pass a
 *   lesson's pruned target to replay just the part that lesson asks for, which
 *   is the only part its palette will let anyone build.
 */
export function replaySentence(sentence: SentenceEntry, only?: Reading): SentenceReplay {
  const reading = only ?? canonicalReading(sentence);
  const order: string[] = [];
  for (const root of roots(reading)) postorder(reading, root, order);

  let state = emptyBuild();
  const generated = new Map<string, string>();
  const steps: RenderStep[] = [];

  // `wrap` handles naming a word, wrapping a one-word phrase, and grouping a
  // run. This begins at the first surface word: “The” becomes Det before any
  // phrase above it exists.
  for (const canonicalId of order) {
    const constituent = reading.constituents[canonicalId]!;
    const previousSequence = state.seq;
    // A loose phrase already on these words means this form goes over it — the
    // reduced relative's `Cl` over its `VP`. That is a different click from
    // renaming, so the step has to say which one it is.
    const under = nodeOver(state, constituent.span);
    const stack = under ? canStackOver(state.constituents[under]) : false;
    state = wrap(state, sentence.words, constituent.span, constituent.form);
    if (state.seq === previousSequence) {
      throw new Error(`Could not build ${constituent.form} at ${constituent.span.join('–')}.`);
    }
    const generatedId = `c${state.seq}`;
    generated.set(canonicalId, generatedId);
    steps.push({
      kind: 'form',
      canonicalId,
      state,
      span: constituent.span,
      nodeId: generatedId,
      ...(stack && under ? { selectNodeId: under } : {}),
      choice: { form: constituent.form, ...(stack ? { stack: true as const } : {}) },
    });
  }

  // One classification per clause, in surface order, so a sentence with an
  // embedded clause is replayed the way a learner would work through it.
  for (const canonicalId of verbs(reading.constituents)) {
    const verbType = reading.constituents[canonicalId]!.verbType;
    if (!verbType) continue;
    const nodeId = generated.get(canonicalId)!;
    state = setVerbType(state, nodeId, verbType);
    steps.push({
      kind: 'verb-type',
      canonicalId,
      state,
      span: reading.constituents[canonicalId]!.span,
      nodeId,
      choice: { verbType },
    });

    // Active is the standing answer, so only a passive verb costs a step. A
    // replay that clicked `active` on every verb would show a learner doing
    // work they never have to do.
    if (reading.constituents[canonicalId]!.voice === 'passive') {
      state = setVoice(state, nodeId, 'passive');
      steps.push({
        kind: 'voice',
        canonicalId,
        state,
        span: reading.constituents[canonicalId]!.span,
        nodeId,
        choice: { voice: 'passive' },
      });
    }
  }

  // Which kind of `Part` each one is, and what verb form each clause has.
  // Both are answers on a node rather than roles under a parent, so they come
  // with the classifications rather than with the functions below.
  for (const canonicalId of order) {
    const constituent = reading.constituents[canonicalId]!;
    const nodeId = generated.get(canonicalId)!;
    if (constituent.form === 'Aux' && constituent.auxKind) {
      state = setAuxKind(state, nodeId, constituent.auxKind);
      steps.push({
        kind: 'aux-kind',
        canonicalId,
        state,
        span: constituent.span,
        nodeId,
        choice: { auxKind: constituent.auxKind },
      });
    }
    if (constituent.form === 'Part' && constituent.partKind) {
      state = setPartKind(state, nodeId, constituent.partKind);
      steps.push({
        kind: 'part-kind',
        canonicalId,
        state,
        span: constituent.span,
        nodeId,
        choice: { partKind: constituent.partKind },
      });
    }
    if (constituent.form === 'Cl' && constituent.clauseKind) {
      state = setClauseKind(state, nodeId, constituent.clauseKind);
      steps.push({
        kind: 'clause-kind',
        canonicalId,
        state,
        span: constituent.span,
        nodeId,
        choice: { clauseKind: constituent.clauseKind },
      });
    }
    // Finite is the standing answer, so only a non-finite clause costs a step.
    if (constituent.finiteness && constituent.finiteness !== 'finite') {
      state = setFiniteness(state, nodeId, constituent.finiteness);
      steps.push({
        kind: 'finiteness',
        canonicalId,
        state,
        span: constituent.span,
        nodeId,
        choice: { finiteness: constituent.finiteness },
      });
    }
  }

  // A function can depend on a sibling already being established. Repeated
  // passes let the builder's licensing rules decide the order without a second
  // grammar model hidden in this renderer.
  let pending = order.filter(
    (id) => reading.constituents[id]!.function !== null && !reading.constituents[id]!.gap,
  );
  while (pending.length > 0) {
    const nextPending: string[] = [];
    let progressed = false;

    for (const canonicalId of pending) {
      const constituent = reading.constituents[canonicalId]!;
      const next = applyFunction(state, generated.get(canonicalId)!, constituent);
      if (next === state) {
        nextPending.push(canonicalId);
        continue;
      }
      state = next;
      steps.push({
        kind: 'function',
        canonicalId,
        state,
        span: constituent.span,
        nodeId: generated.get(canonicalId)!,
        choice: {
          func: constituent.function!,
          obligatory: constituent.obligatory === true,
          ...(constituent.fusedWith ? { fusedWith: constituent.fusedWith } : {}),
        },
      });
      progressed = true;
    }

    if (!progressed) {
      const blocked = nextPending.map((id) => reading.constituents[id]!.function).join(', ');
      throw new Error(`Could not assign sentence functions: ${blocked}.`);
    }
    pending = nextPending;
  }

  // The empty slots, last: where a gap sits among its siblings follows from
  // what those siblings are doing, so the functions have to be settled first.
  for (const canonicalId of order) {
    const constituent = reading.constituents[canonicalId]!;
    const nodeId = generated.get(canonicalId)!;
    for (const child of constituent.children) {
      const c = reading.constituents[child]!;
      if (!c.gap || c.function === null) continue;
      state = addGap(state, nodeId, c.function, c.form);
      const made = state.constituents[nodeId]!.children.find(
        (k) => state.constituents[k]!.gap && state.constituents[k]!.function === c.function,
      )!;
      generated.set(child, made);
      steps.push({
        kind: 'gap',
        canonicalId: child,
        state,
        span: constituent.span,
        nodeId,
        choice: { func: c.function, form: c.form, gap: true },
      });
    }
  }

  // What each tail phrase belongs to, last: the phrases it could belong to have
  // to exist before one of them can be named.
  for (const canonicalId of Object.keys(reading.constituents)) {
    const constituent = reading.constituents[canonicalId]!;
    const links =
      constituent.function === 'postnucleus' ||
      (constituent.gap === true &&
        (constituent.function === 'head' || constituent.function === 'predicate'));
    if (!links || constituent.index === undefined) continue;
    const anchorCanonical = Object.keys(reading.constituents).find(
      (id) => id !== canonicalId && reading.constituents[id]!.index === constituent.index,
    );
    if (!anchorCanonical) continue;
    const tailId = generated.get(canonicalId)!;
    const anchorId = generated.get(anchorCanonical)!;
    state = setAnchor(state, tailId, anchorId);
    steps.push({
      kind: 'anchor',
      canonicalId,
      state,
      span: constituent.span,
      nodeId: tailId,
      choice: {
        anchor: reading.constituents[anchorCanonical]!.span,
        anchorForm: reading.constituents[anchorCanonical]!.form,
      },
    });
  }

  return { steps, final: state };
}
