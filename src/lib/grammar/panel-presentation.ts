import type { OptionState } from './options.ts';

/**
 * Suggestions belong in the panel header, where their evidence is visible.
 * The option list stays neutral so it does not repeat the answer as styling.
 */
export function menuOptionState(state: OptionState): OptionState {
  return state === 'suggested' ? 'available' : state;
}
