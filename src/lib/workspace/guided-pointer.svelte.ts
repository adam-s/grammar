/**
 * One pointer per stage, alive for the whole demonstration.
 *
 * The controller owns nothing but the pointer's body: where it is, what it is
 * doing, and the discipline that makes it read as a hand —
 *
 * - It only ever travels. A new destination retargets the flight from
 *   wherever the pointer is now; nothing teleports.
 * - Flights TRACK their targets. Callers hand in a getter, the flight
 *   re-measures every frame, and a target moved by the camera, a settling
 *   popup, or a pane scroll is followed to where it actually is
 *   (`trackStep` in pointer-motion.ts, which is where that logic is tested).
 * - `press()` waits for the NEWEST flight — not the one that happened to be
 *   in the air when the press was requested — then dips and releases. Await
 *   it, then apply the state change: the visible click and the real one are
 *   the same moment by construction.
 * - Every duration runs on the demonstration's `PausableClock`, and the
 *   flight's frames come from `pausableFrames` on that same clock. Pausing
 *   the clock freezes the pointer mid-glide or mid-press with its remaining
 *   duration intact — the held-frame semantics live in the frame source,
 *   not as a guard inside this loop; nothing here owns a private timeline.
 * - Reduced motion collapses travel and dip to zero but preserves the exact
 *   order of events. The check is injected, so a stage that owns the clock
 *   can own the policy, and `node --test` can drive it.
 */
import { APPEAR_MS, PRESS, REST_MS, startTracking, trackStep } from './pointer-motion.ts';
import { PausableClock, awaitNewest, pausableFrames } from './pointer-clock.ts';
import { prefersReducedMotion } from './responsive.svelte.ts';
import type { Point } from './viewport.ts';

export type PointerPhase =
  'hidden' | 'appearing' | 'idle' | 'moving' | 'dip' | 'release' | 'resting';

export type PointerTarget = Point | (() => Point | null);

export type MoveOptions = {
  /** Called with the pointer's position every frame of the flight — how a
   *  drag feeds the same draft/marquee handlers the real gesture drives. */
  during?: (at: Point) => void;
};

export class GuidedPointer {
  x = $state(0);
  y = $state(0);
  phase = $state<PointerPhase>('hidden');
  /** The button is down: a drag in progress. The layer draws the dip. */
  held = $state(false);
  /** Bound by the layer so client-space callers can be converted. */
  layer: HTMLElement | null = $state(null);

  readonly clock: PausableClock;
  #reduced: () => boolean;
  #frames: ReturnType<typeof pausableFrames>;
  #token = 0;
  #flight: Promise<void> | null = null;

  constructor(
    clock: PausableClock = new PausableClock(),
    reduced: () => boolean = prefersReducedMotion,
  ) {
    this.clock = clock;
    this.#reduced = reduced;
    this.#frames = pausableFrames(clock);
  }

  /** One clocked frame step; resolves on the next UNPAUSED animation frame. */
  #frame(): Promise<void> {
    return new Promise((resolve) => this.#frames.frame(() => resolve()));
  }

  #resolve(target: PointerTarget): Point | null {
    return typeof target === 'function' ? target() : target;
  }

  /**
   * Travel to a target, following it if it moves. Resolves when the pointer
   * has landed on the target's latest position. From hidden, it appears in
   * place at the target instead of streaking in from nowhere.
   */
  moveTo(target: PointerTarget, options: MoveOptions = {}): Promise<void> {
    const mine = ++this.#token;
    const trip = (async () => {
      let aim = this.#resolve(target);
      if (!aim) return;
      if (this.phase === 'hidden' || this.phase === 'resting' || this.#reduced()) {
        this.x = aim.x;
        this.y = aim.y;
        // Reduced motion collapses the travel but not the events: a drag's
        // waypoints still fire so drafts and marquees reach the same state.
        options.during?.({ x: aim.x, y: aim.y });
        if (this.phase !== 'idle' && this.phase !== 'moving') {
          this.phase = 'appearing';
          if (!this.#reduced()) await this.clock.wait(APPEAR_MS);
          if (mine !== this.#token) return;
        }
        this.phase = 'idle';
        return;
      }
      if (Math.hypot(aim.x - this.x, aim.y - this.y) < 1) {
        options.during?.({ x: this.x, y: this.y });
        this.phase = 'idle';
        return;
      }
      this.phase = 'moving';
      let tracking = startTracking({ x: this.x, y: this.y }, aim, this.clock.now());
      for (;;) {
        // Frames are held while the clock is paused, so a paused flight
        // writes nothing — neither position nor `during` — and a resumed one
        // continues with its remaining travel intact.
        await this.#frame();
        if (mine !== this.#token) return;
        aim = this.#resolve(target) ?? aim;
        const step = trackStep(tracking, this.clock.now(), aim);
        tracking = step.state;
        this.x = step.at.x;
        this.y = step.at.y;
        options.during?.({ x: this.x, y: this.y });
        if (step.done) break;
      }
      this.phase = 'idle';
    })();
    this.#flight = trip;
    return trip;
  }

  /** Where the hand's hotspot is right now, in client coordinates. */
  clientPoint(): Point | null {
    const box = this.layer?.getBoundingClientRect();
    return box ? { x: this.x + box.left, y: this.y + box.top } : null;
  }

  /** The same trip, aimed with client (viewport) coordinates. */
  moveToClient(target: PointerTarget, options: MoveOptions = {}): Promise<void> {
    const toLocal = (): Point | null => {
      const aim = this.#resolve(target);
      const box = this.layer?.getBoundingClientRect();
      if (!aim || !box) return null;
      return { x: aim.x - box.left, y: aim.y - box.top };
    };
    const during = options.during;
    return this.moveTo(
      toLocal,
      during
        ? {
            during: (at) => {
              const box = this.layer?.getBoundingClientRect();
              if (box) during({ x: at.x + box.left, y: at.y + box.top });
            },
          }
        : {},
    );
  }

  /**
   * Press AND HOLD: land, dip, stay down. The drag that follows keeps the
   * dipped look, and `release()` lets go with the click ring. `press()` is
   * the two back to back.
   */
  async pressDown(): Promise<void> {
    await awaitNewest(() => this.#flight);
    if (this.phase === 'hidden' || this.phase === 'resting') return;
    const mine = ++this.#token;
    this.held = true;
    if (!this.#reduced()) {
      this.phase = 'dip';
      await this.clock.wait(PRESS.dip);
      if (mine !== this.#token) return;
    }
    this.phase = 'idle';
  }

  /** Let go where the pointer stands: the release ring, button back up. */
  async release(): Promise<void> {
    await awaitNewest(() => this.#flight);
    if (this.phase === 'hidden' || this.phase === 'resting') {
      this.held = false;
      return;
    }
    const mine = ++this.#token;
    this.held = false;
    this.phase = 'release';
    await this.clock.wait(PRESS.release);
    if (mine !== this.#token) return;
    this.phase = 'idle';
  }

  /**
   * Press where the pointer stands: wait for the NEWEST flight to land, then
   * dip, then release with the click ring. Await it, then apply the change
   * the click stands for — the two are one gesture.
   */
  async press(): Promise<void> {
    await this.pressDown();
    await this.release();
  }

  /** Leave the stage: fade where it stands, ready to reappear anywhere. */
  rest(): void {
    // The button comes up the moment the hand leaves — Stop must not depend
    // on an aborted gesture eventually unwinding to its release() before the
    // pressed look clears, or a quick relaunch reappears still dipped.
    this.held = false;
    if (this.phase === 'hidden') return;
    const mine = ++this.#token;
    this.phase = 'resting';
    void this.clock.wait(REST_MS).then(() => {
      if (mine === this.#token) this.phase = 'hidden';
    });
  }

  /** Stop everything now, without a farewell. */
  cancel(): void {
    this.#token++;
    this.#flight = null;
    this.held = false;
    this.phase = 'hidden';
  }
}
