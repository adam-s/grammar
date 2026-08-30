/**
 * The hero's choreography, with no clock of its own.
 *
 * The review that forced this file caught the old design committing state on
 * a fixed phase timer: the palette unmounted, THEN the pointer pressed, and
 * the click ring floated in the blank space where the option had been. The
 * cure is structural — one owner, an awaited sequence, and the rule that
 * every state change FOLLOWS the completed gesture that causes it:
 *
 *   arrive at the words → press → selection appears, palette opens
 *   → arrive at the option (the palette reports arrival, not a timer)
 *   → press while the option is still mounted → the label lands
 *   → pacing → the palette closes → on to the next decision.
 *
 * Timing constants pace the moments BETWEEN completed gestures; they never
 * stand in for completion. Pure over injected gestures, so `node --test` can
 * hold the whole order still and prove the palette outlives the press.
 */

export type Timing = {
  /** After the palette has opened, before the pointer sets out for the menu. */
  open: number;
  /** On the option, before the press — the decision being visibly made. */
  decide: number;
  /** After the label lands, with the palette still up — reading time. */
  commit: number;
  /** Between decisions, once the palette has closed. */
  between: number;
  /** After the last decision before the performance loops. */
  rest: number;
};

/**
 * Deliberately uneven. Equal gaps read as a machine; the long pause sits on
 * `decide` because a decision being made is the thing demonstrated.
 */
export const DEFAULT_TIMING: Timing = {
  open: 260,
  decide: 620,
  commit: 900,
  between: 320,
  rest: 1600,
};

export type Gestures = {
  /** Glide the hand to what step `index` will select. Resolves on arrival. */
  moveToSelection(index: number): Promise<void>;
  /** Dip and release where the hand stands. Resolves when released. */
  press(): Promise<void>;
  /** The click's effect: highlight the selection and open the palette. */
  applySelection(index: number): void;
  /** Take the hand to the step's answer in the palette. Resolves on arrival. */
  aimOption(index: number): Promise<void>;
  /** The click's effect: the label lands. The palette MUST stay mounted. */
  applyChoice(index: number): void;
  /** Close the palette and clear the selection. */
  closePalette(index: number): void;
  /** Pacing between completed gestures, on the demonstration's clock. */
  hold(ms: number): Promise<void>;
};

/**
 * One full pass over the steps. Returns normally when every decision has
 * played, or early — without any further gesture — the moment `alive` says
 * the stage is gone.
 */
export async function perform(
  count: number,
  gestures: Gestures,
  timing: Timing,
  alive: () => boolean,
): Promise<void> {
  for (let index = 0; index < count; index++) {
    if (!alive()) return;
    await gestures.moveToSelection(index);
    if (!alive()) return;
    await gestures.press();
    if (!alive()) return;
    gestures.applySelection(index);
    await gestures.hold(timing.open);
    if (!alive()) return;
    await gestures.aimOption(index);
    if (!alive()) return;
    await gestures.hold(timing.decide);
    if (!alive()) return;
    await gestures.press();
    if (!alive()) return;
    gestures.applyChoice(index);
    await gestures.hold(timing.commit);
    if (!alive()) return;
    gestures.closePalette(index);
    await gestures.hold(timing.between);
  }
}
