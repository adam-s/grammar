/**
 * Build a finished sentence through the same operations available to a learner.
 * The answer supplies decisions, but its tree is never handed to the renderer.
 */
import { verbs } from '../grammar/clause.ts';
import {
  addGap,
  canStackOver,
  emptyBuild,
  nodeOver,
  setAuxKind,
  setClauseKind,
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
    | 'gap';
  canonicalId: string | null;
  state: BuildState;
  /** The words the decision is about — what a learner would have selected. */
  span: Span;
  /** The node in `state` the decision landed on. */
  nodeId: string;
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
  };
};

export type SentenceReplay = { steps: RenderStep[]; final: BuildState };

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
  return setFunction(state, generatedId, constituent.function, constituent.obligatory === true);
}

export function replaySentence(sentence: SentenceEntry): SentenceReplay {
  const reading = canonicalReading(sentence);
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
        choice: { func: constituent.function!, obligatory: constituent.obligatory === true },
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
      state = addGap(state, nodeId, c.function);
      steps.push({
        kind: 'gap',
        canonicalId: child,
        state,
        span: constituent.span,
        nodeId,
        choice: { func: c.function, gap: true },
      });
    }
  }

  return { steps, final: state };
}
