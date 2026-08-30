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
 * - Every duration runs on the demonstration's `PausableClock`. Pausing the
 *   clock freezes the pointer mid-glide or mid-press with its remaining
 *   duration intact; nothing here owns a private timeline.
 * - Reduced motion collapses travel and dip to zero but preserves the exact
 *   order of events.
 */
import { APPEAR_MS, PRESS, REST_MS, startTracking, trackStep } from './pointer-motion.ts';
import { PausableClock, awaitNewest } from './pointer-clock.ts';
import type { Point } from './viewport.ts';

export type PointerPhase =
  'hidden' | 'appearing' | 'idle' | 'moving' | 'dip' | 'release' | 'resting';

export type PointerTarget = Point | (() => Point | null);

export class GuidedPointer {
  x = $state(0);
  y = $state(0);
  phase = $state<PointerPhase>('hidden');
  /** Bound by the layer so client-space callers can be converted. */
  layer: HTMLElement | null = $state(null);

  readonly clock: PausableClock;
  #token = 0;
  #flight: Promise<void> | null = null;

  constructor(clock: PausableClock = new PausableClock()) {
    this.clock = clock;
  }

  #reduced(): boolean {
    return (
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /** One clocked frame step; resolves on the next animation frame. */
  #frame(): Promise<void> {
    return new Promise((resolve) =>
      typeof requestAnimationFrame === 'undefined'
        ? setTimeout(resolve, 16)
        : requestAnimationFrame(() => resolve()),
    );
  }

  #resolve(target: PointerTarget): Point | null {
    return typeof target === 'function' ? target() : target;
  }

  /**
   * Travel to a target, following it if it moves. Resolves when the pointer
   * has landed on the target's latest position. From hidden, it appears in
   * place at the target instead of streaking in from nowhere.
   */
  moveTo(target: PointerTarget): Promise<void> {
    const mine = ++this.#token;
    const trip = (async () => {
      let aim = this.#resolve(target);
      if (!aim) return;
      if (this.phase === 'hidden' || this.phase === 'resting' || this.#reduced()) {
        this.x = aim.x;
        this.y = aim.y;
        if (this.phase !== 'idle' && this.phase !== 'moving') {
          this.phase = 'appearing';
          if (!this.#reduced()) await this.clock.wait(APPEAR_MS);
          if (mine !== this.#token) return;
        }
        this.phase = 'idle';
        return;
      }
      if (Math.hypot(aim.x - this.x, aim.y - this.y) < 1) {
        this.phase = 'idle';
        return;
      }
      this.phase = 'moving';
      let tracking = startTracking({ x: this.x, y: this.y }, aim, this.clock.now());
      for (;;) {
        await this.#frame();
        if (mine !== this.#token) return;
        aim = this.#resolve(target) ?? aim;
        const step = trackStep(tracking, this.clock.now(), aim);
        tracking = step.state;
        this.x = step.at.x;
        this.y = step.at.y;
        if (step.done) break;
      }
      this.phase = 'idle';
    })();
    this.#flight = trip;
    return trip;
  }

  /** The same trip, aimed with client (viewport) coordinates. */
  moveToClient(target: PointerTarget): Promise<void> {
    const toLocal = (): Point | null => {
      const aim = this.#resolve(target);
      const box = this.layer?.getBoundingClientRect();
      if (!aim || !box) return null;
      return { x: aim.x - box.left, y: aim.y - box.top };
    };
    return this.moveTo(toLocal);
  }

  /**
   * Press where the pointer stands: wait for the NEWEST flight to land, then
   * dip, then release with the click ring. Await it, then apply the change
   * the click stands for — the two are one gesture.
   */
  async press(): Promise<void> {
    await awaitNewest(() => this.#flight);
    if (this.phase === 'hidden' || this.phase === 'resting') return;
    const mine = ++this.#token;
    if (!this.#reduced()) {
      this.phase = 'dip';
      await this.clock.wait(PRESS.dip);
      if (mine !== this.#token) return;
    }
    this.phase = 'release';
    await this.clock.wait(PRESS.release);
    if (mine !== this.#token) return;
    this.phase = 'idle';
  }

  /** Leave the stage: fade where it stands, ready to reappear anywhere. */
  rest(): void {
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
    this.phase = 'hidden';
  }
}
