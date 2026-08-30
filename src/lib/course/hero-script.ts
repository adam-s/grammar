/**
 * What the hero derives from a finished replay before it performs.
 *
 * The choreography itself lives in `performance.ts` — an awaited sequence in
 * which every state change follows the completed gesture that causes it. The
 * fixed beat timeline that used to live here is gone on purpose: a clock
 * that commits state on schedule presses pointers onto options that have
 * already unmounted, which is exactly the bug it caused.
 */
import type { BuildState } from '../grammar/builder.ts';
import { layout } from '../grammar/layout.ts';
import type { Word } from '../grammar/types.ts';

/**
 * Reserve the completed tree's depth for the whole performance. Each replay
 * state then shares one word baseline and one artboard height, so building
 * the tree cannot move the lesson copy below it.
 */
export function frameDepth(finished: BuildState, words: Word[]): number {
  return layout(finished.constituents, words).maxDepth;
}
