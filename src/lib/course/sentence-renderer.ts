/**
 * Build a finished sentence through the same operations available to a learner.
 * The answer supplies decisions, but its tree is never handed to the renderer.
 */
import { verbs } from '../grammar/clause.ts';
import {
  emptyBuild,
  setFunction,
  setVerbType,
  wrap,
  type BuildState,
  type Span,
} from '../grammar/builder.ts';
import {
  canonicalReading,
  type Constituent,
  type Form,
  type Func,
  type SentenceEntry,
  type VerbType,
} from '../grammar/types.ts';

export type RenderStep = {
  kind: 'form' | 'function' | 'verb-type';
  canonicalId: string | null;
  state: BuildState;
  /** The words the decision is about — what a learner would have selected. */
  span: Span;
  /** The node in `state` the decision landed on. */
  nodeId: string;
  /** The palette option a learner would have clicked to produce this step. */
  choice: { form?: Form; func?: Func; obligatory?: boolean; verbType?: VerbType };
};

export type SentenceReplay = { steps: RenderStep[]; final: BuildState };

function roots(reading: ReturnType<typeof canonicalReading>): string[] {
  return Object.keys(reading.constituents)
    .filter((id) => reading.constituents[id]!.parent === null)
    .sort((a, b) => reading.constituents[a]!.span[0] - reading.constituents[b]!.span[0]);
}

/** Children first is the builder's natural order: words, then their phrases. */
function postorder(reading: ReturnType<typeof canonicalReading>, id: string, out: string[]): void {
  const constituent = reading.constituents[id];
  if (!constituent) throw new Error(`Unknown constituent ${id}.`);
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
      choice: { form: constituent.form },
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
  }

  // A function can depend on a sibling already being established. Repeated
  // passes let the builder's licensing rules decide the order without a second
  // grammar model hidden in this renderer.
  let pending = order.filter((id) => reading.constituents[id]!.function !== null);
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

  return { steps, final: state };
}
