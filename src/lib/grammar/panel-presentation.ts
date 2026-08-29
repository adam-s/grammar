import type { OptionState } from './options.ts';

/**
 * Keep a refused answer beside the question it answered.
 *
 * Blocking a wrong row can change the panel's computed next step. That step is
 * useful after a correct answer, but following it after a miss makes ordinary
 * navigation look like approval. A new selection still opens at its natural
 * step; only a wrong answer holds the learner in the category they chose.
 */
export function activeGroupAfterAnswer(
  active: string | null,
  subjectChanged: boolean,
  step: string | null,
  verdict: 'correct' | 'alternate' | 'wrong' | null,
): string | null {
  return !subjectChanged && verdict === 'wrong' ? active : step;
}

/**
 * Suggestions belong in the panel header, where their evidence is visible.
 * The option list stays neutral so it does not repeat the answer as styling.
 */
export function menuOptionState(state: OptionState): OptionState {
  return state === 'suggested' ? 'available' : state;
}
