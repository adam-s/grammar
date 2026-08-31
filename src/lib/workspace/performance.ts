/**
 * The demonstration's choreography, with no clock of its own.
 *
 * The review that forced this module caught the old design committing state
 * on a fixed phase timer: the palette unmounted, THEN the pointer pressed,
 * and the click ring floated in the blank space where the option had been.
 * The cure is structural — one owner, an awaited sequence, and the rule that
 * every state change FOLLOWS the completed gesture that causes it:
 *
 *   perform the selection gesture → selection appears, palette opens
 *   → prove the selection landed (callers that can check supply a verify)
 *   → arrive at the option (the palette reports arrival, not a timer)
 *   → press while the option is still mounted; the label lands with it
 *   → prove the label landed → pacing → the palette closes → next decision.
 *
 * Both demonstrations run on this one loop — the lesson hero's endless
 * replay and the tutorial's verified run — so a fix to the order or the
 * pacing cannot reach one and miss the other. Timing constants pace the
 * moments BETWEEN completed gestures; they never stand in for completion.
 * Pure over injected gestures, so `node --test` can hold the whole order
 * still and prove the palette outlives the press.
 *
 * THE STOPPING CONTRACT — what a Stop (or a dead stage) guarantees, split
 * by who owns each piece:
 *
 * 1. This loop: once `alive()` reports false, no further gesture begins and
 *    no apply/verify/close effect is delivered — proven at every boundary
 *    by the abort sweep in performance.test.ts.
 * 2. A gesture already IN FLIGHT when Stop lands may finish unwinding; its
 *    writes are its implementor's to guard. Selection gestures guard theirs
 *    with `guardHooks` (selection-gesture.ts); the tutorial's applyChoice
 *    re-checks liveness after its own await.
 * 3. The pointer neither rests nor cancels itself — the stage that owns it
 *    does, after this loop returns (Tutorial's halt/finish, the hero's
 *    unmount), so a Stop shows the hand leaving rather than vanishing.
 * 4. Camera motions and the palette aim carry their own cancellation
 *    (`camera.cancel()`, panel-aim's token): a Stop during either resolves
 *    the awaited promise without landing, and rule 1 keeps whatever would
 *    have followed from running.
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
  /**
   * PERFORM step `index`'s selection: click its word, drag across its span
   * with the highlight growing, or click its node — the full gesture, press
   * and release included. Resolves when the gesture has finished.
   */
  selectTarget(index: number): Promise<void>;
  /** The gesture's effect: highlight the selection and open the palette. */
  applySelection(index: number): void;
  /**
   * Prove the selection landed and the palette offers the step's row.
   * Resolves with the problem in a learner's words, or null when it did.
   * A demonstration that cannot fail (the hero replays a known answer)
   * simply omits this.
   */
  verifySelection?(index: number): Promise<string | null>;
  /** Take the hand to the step's answer in the palette. Resolves on arrival. */
  aimOption(index: number): Promise<void>;
  /**
   * Press on the option AND land the label: dip, release, and the state
   * change the click stands for, one gesture. The palette MUST stay
   * mounted — the press must be seen on the row it chose.
   */
  applyChoice(index: number): Promise<void> | void;
  /** Prove the choice landed. Resolves with the problem, or null. */
  verifyChoice?(index: number): Promise<string | null>;
  /** Close the palette and clear the selection. */
  closePalette(index: number): void;
  /** Pacing between completed gestures, on the demonstration's clock. */
  hold(ms: number): Promise<void>;
};

/**
 * One full pass over the steps. Resolves null when every decision played (or
 * the moment `alive` says the stage is gone — no further gesture either
 * way), or with the first verify's problem, the pass abandoned where it
 * failed so the caller can say so on screen.
 */
export async function perform(
  count: number,
  gestures: Gestures,
  timing: Timing,
  alive: () => boolean,
): Promise<string | null> {
  for (let index = 0; index < count; index++) {
    if (!alive()) return null;
    await gestures.selectTarget(index);
    if (!alive()) return null;
    gestures.applySelection(index);
    await gestures.hold(timing.open);
    if (!alive()) return null;
    if (gestures.verifySelection) {
      const fault = await gestures.verifySelection(index);
      if (fault) return fault;
      if (!alive()) return null;
    }
    await gestures.aimOption(index);
    if (!alive()) return null;
    await gestures.hold(timing.decide);
    if (!alive()) return null;
    await gestures.applyChoice(index);
    if (!alive()) return null;
    if (gestures.verifyChoice) {
      const fault = await gestures.verifyChoice(index);
      if (fault) return fault;
      if (!alive()) return null;
    }
    await gestures.hold(timing.commit);
    if (!alive()) return null;
    gestures.closePalette(index);
    await gestures.hold(timing.between);
  }
  return null;
}
