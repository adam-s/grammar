/**
 * The tutorial's state machine, with no clock and no DOM in it.
 *
 * A run is two moments per decision — ask, then answer — walked in order until
 * the sentence is finished. What makes that worth its own file is the failure
 * rule: a run advances because the app actually changed, never because time
 * passed. If the palette does not offer the row the script named, or refuses
 * the pick, the run stops and says which one and why. A tutorial that skipped
 * past that would be demonstrating an interaction the learner cannot repeat.
 */
import type { Selection } from '../grammar/options.ts';
import type { Act, TutorialBeat } from './script.ts';

export type RunStatus = 'idle' | 'running' | 'done' | 'stopped' | 'failed';

export type RunState = {
  index: number;
  act: Act;
  status: RunStatus;
  /** Why the run stopped early, in words a learner could read. */
  problem: string | null;
};

export const IDLE: RunState = { index: 0, act: 'ask', status: 'idle', problem: null };

/**
 * How long a moment stays on screen, in milliseconds.
 *
 * Pacing only — never a completion signal, and never a container for a
 * gesture: the run awaits the pointer's arrival and its press before these
 * holds begin, so they buy pure reading time. The answer holds longer than
 * the question because it carries a second line, and because watching the
 * label land is the part worth waiting on.
 */
export const HOLD: Record<Act, number> = { ask: 1500, answer: 2400 };

/** Longest a postcondition may take before the run calls it a failure. */
export const POSTCONDITION_MS = 2000;

/** Longest a whole run may take, however many decisions it holds. */
export const RUNTIME_CAP_MS = 5 * 60 * 1000;

export function begin(beats: TutorialBeat[]): RunState {
  if (beats.length === 0) {
    return {
      index: 0,
      act: 'ask',
      status: 'failed',
      problem: 'This sentence has nothing to build.',
    };
  }
  return { index: 0, act: 'ask', status: 'running', problem: null };
}

/** The next moment: ask becomes answer, and answer becomes the next ask. */
export function advance(state: RunState, beats: TutorialBeat[]): RunState {
  if (state.status !== 'running') return state;
  if (state.act === 'ask') return { ...state, act: 'answer' };
  const index = state.index + 1;
  if (index >= beats.length) return { ...state, status: 'done' };
  return { ...state, index, act: 'ask' };
}

export const stop = (state: RunState): RunState =>
  state.status === 'running' ? { ...state, status: 'stopped' } : state;

export const fail = (state: RunState, problem: string): RunState => ({
  ...state,
  status: 'failed',
  problem,
});

/**
 * Whether the palette is showing what the script expects.
 *
 * Returns the reason it is not, or null when it is. `state` is the option's
 * own state word, so a row that exists but is blocked reports the block rather
 * than claiming the row is missing.
 */
export function selectFault(
  beat: TutorialBeat,
  offered: { found: boolean; state?: string; pickable?: boolean } | null,
): string | null {
  if (!offered?.found) return `The menu never offered “${beat.answer}” for ${beat.subject}.`;
  if (offered.pickable === false) {
    return `“${beat.answer}” is ${offered.state ?? 'not available'} for ${beat.subject}.`;
  }
  return null;
}

const describeSelection = (sel: Selection | null): string => {
  if (!sel || sel.kind === 'none') return 'nothing';
  if (sel.kind === 'span') return `words ${sel.span[0] + 1}–${sel.span[1] + 1}`;
  if (sel.kind === 'node') return `one label (${sel.id})`;
  return `the labels ${[...sel.ids].sort().join(', ')}`;
};

/**
 * Whether a performed gesture committed the selection the script expects.
 *
 * The gesture drivers animate the same draft and marquee handlers the real
 * pointer drives — which means the handlers, not the drivers, decide what got
 * selected. This is the proof the commit matches the script. It names both
 * selections, so a coordinate bug reads as a measurement rather than a
 * mystery. Returns null when the commit is right.
 */
export function gestureFault(expected: Selection, got: Selection | null): string | null {
  if (expected.kind === 'span') {
    const hit =
      got?.kind === 'span' && got.span[0] === expected.span[0] && got.span[1] === expected.span[1];
    return hit
      ? null
      : `The drag selected ${describeSelection(got)}, not ${describeSelection(expected)}.`;
  }
  if (expected.kind === 'nodes') {
    const hit =
      got?.kind === 'nodes' && [...got.ids].sort().join(',') === [...expected.ids].sort().join(',');
    return hit
      ? null
      : `The box took ${describeSelection(got)}, not ${describeSelection(expected)}.`;
  }
  if (expected.kind === 'node') {
    const hit = got?.kind === 'node' && got.id === expected.id;
    return hit
      ? null
      : `The click selected ${describeSelection(got)}, not ${describeSelection(expected)}.`;
  }
  return null;
}

/** Whether the pick landed. Returns the reason it did not, or null. */
export function pickFault(
  beat: TutorialBeat,
  result: { ok: boolean; reason?: string },
  grew: boolean,
): string | null {
  if (!result.ok) {
    return `The menu refused “${beat.answer}”${result.reason ? `: ${result.reason}` : '.'}`;
  }
  if (!grew) return `Picking “${beat.answer}” changed nothing on the diagram.`;
  return null;
}

/** How far through the run this moment is, 0 to 1. */
export function progress(state: RunState, beats: TutorialBeat[]): number {
  if (beats.length === 0) return 0;
  if (state.status === 'done') return 1;
  const moments = beats.length * 2;
  const at = state.index * 2 + (state.act === 'answer' ? 1 : 0);
  return Math.min(1, (at + 1) / moments);
}
