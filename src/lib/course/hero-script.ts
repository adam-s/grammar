/**
 * Turn a sentence's replay into a timed performance.
 *
 * The hero on the introduction has to teach the interaction without words: a
 * run of words lights up, the menu opens beside it, one option is picked, and
 * the label lands on the diagram. So each decision is not one moment but four,
 * and the timing is what makes it read as somebody working rather than as a
 * slideshow.
 *
 * All of it is arithmetic over a list, so it belongs here rather than in a
 * component, and a beat that lands in the wrong order is a failing test rather
 * than something you have to catch by eye.
 */
import type { BuildState } from '../grammar/builder.ts';
import { layout } from '../grammar/layout.ts';
import type { Word } from '../grammar/types.ts';
import type { RenderStep } from './sentence-renderer.ts';

/** What the figure is doing at a given moment. */
export type Phase =
  /** The words are lit, and nothing has opened yet. */
  | 'select'
  /** The menu is open, no option marked. */
  | 'open'
  /** The menu is open with one option under the pointer. */
  | 'aim'
  /** The option was taken; the label is on the diagram. */
  | 'commit';

export type Beat = {
  /** Index into the replay's steps. */
  step: number;
  phase: Phase;
  /** Milliseconds from the start of the performance. */
  at: number;
};

export type Timing = {
  select: number;
  open: number;
  aim: number;
  commit: number;
  /** Held after the last commit before the loop restarts. */
  rest: number;
};

/**
 * Reserve the completed tree's depth for the whole performance. Each replay
 * state then shares one word baseline and one artboard height, so building the
 * tree cannot move the lesson copy below it.
 */
export function frameDepth(finished: BuildState, words: Word[]): number {
  return layout(finished.constituents, words).maxDepth;
}

/**
 * Deliberately uneven. Equal gaps read as a machine; a longer pause on `aim`
 * reads as a decision being made, which is the thing being demonstrated.
 */
export const DEFAULT_TIMING: Timing = {
  select: 260,
  open: 200,
  aim: 420,
  commit: 340,
  rest: 1400,
};

const PHASES: Phase[] = ['select', 'open', 'aim', 'commit'];

export function script(steps: RenderStep[], timing: Timing = DEFAULT_TIMING): Beat[] {
  const beats: Beat[] = [];
  let at = 0;
  for (let step = 0; step < steps.length; step++) {
    for (const phase of PHASES) {
      beats.push({ step, phase, at });
      at += timing[phase];
    }
  }
  return beats;
}

/** How long one pass takes, including the rest before it loops. */
export function duration(steps: RenderStep[], timing: Timing = DEFAULT_TIMING): number {
  const per = timing.select + timing.open + timing.aim + timing.commit;
  return steps.length * per + timing.rest;
}

/**
 * The beat showing at `elapsed`, wrapping so the figure loops for as long as it
 * is on screen. Returns null only for an empty replay.
 */
export function beatAt(
  beats: Beat[],
  elapsed: number,
  total: number,
): (Beat & { index: number }) | null {
  if (beats.length === 0 || total <= 0) return null;
  const t = ((elapsed % total) + total) % total;
  let index = 0;
  for (let i = 0; i < beats.length; i++) {
    if (beats[i]!.at <= t) index = i;
    else break;
  }
  return { ...beats[index]!, index };
}

/**
 * The build state to draw for a beat.
 *
 * Before the option is taken, the diagram must still show the PREVIOUS state —
 * otherwise the label appears while the menu is still deciding, and the figure
 * teaches the interaction backwards.
 */
export function stateIndexFor(beat: Beat): number {
  return beat.phase === 'commit' ? beat.step : beat.step - 1;
}
