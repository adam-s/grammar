/**
 * The clocks a pausable demonstration runs on.
 *
 * The review that forced this file found the Pause button freezing only the
 * narration while the pointer kept flying for another 1.1 seconds. The root
 * cause was structural: every gesture owned a private clock, so nothing could
 * stop them all. Now a demonstration owns ONE `PausableClock`, every wait and
 * every animation frame is derived from it, and pausing the clock pauses
 * everything downstream — mid-glide, mid-press, mid-hold — with the remaining
 * duration preserved for resume.
 *
 * Pure by injection: time and scheduling come in through the constructor, so
 * `node --test` can drive a demonstration's whole temporal behaviour by hand.
 */

type Sleep = (ms: number) => Promise<void>;

const realSleep: Sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const realNow = () => (typeof performance === 'undefined' ? Date.now() : performance.now());

/** How finely `wait` slices real time; pause latency is at most one slice. */
const SLICE_MS = 25;

export class PausableClock {
  #now: () => number;
  #sleep: Sleep;
  #paused = false;
  #cancelled = false;
  /** Total time spent paused, so derived clocks can subtract it. */
  #pausedTotal = 0;
  #pausedAt: number | null = null;

  constructor(now: () => number = realNow, sleep: Sleep = realSleep) {
    this.#now = now;
    this.#sleep = sleep;
  }

  get paused(): boolean {
    return this.#paused;
  }

  get cancelled(): boolean {
    return this.#cancelled;
  }

  /** The demonstration's own time: real time minus every pause. */
  now(): number {
    const held = this.#pausedAt === null ? 0 : this.#now() - this.#pausedAt;
    return this.#now() - this.#pausedTotal - held;
  }

  pause(): void {
    if (this.#paused) return;
    this.#paused = true;
    this.#pausedAt = this.#now();
  }

  resume(): void {
    if (!this.#paused) return;
    this.#paused = false;
    if (this.#pausedAt !== null) this.#pausedTotal += this.#now() - this.#pausedAt;
    this.#pausedAt = null;
  }

  /**
   * The demonstration is over: every pending and future `wait` settles at
   * once. Without this, a component destroyed while its clock was paused
   * left waits polling forever — demonstration time never advances, so the
   * loop never ends. The owner of the demonstration's lifecycle calls this;
   * callers' own liveness guards keep the settled promises from applying
   * any late press or state change.
   */
  cancel(): void {
    this.#cancelled = true;
  }

  /**
   * Wait `ms` of DEMONSTRATION time. Paused time does not count, so a hold
   * interrupted by Pause resumes with exactly its remaining duration. A
   * cancelled clock settles immediately.
   */
  async wait(ms: number): Promise<void> {
    const until = this.now() + ms;
    while (!this.#cancelled && this.now() < until) {
      await this.#sleep(Math.min(SLICE_MS, Math.max(1, until - this.now())));
    }
  }
}

/**
 * A frame source that lies to its animation about time, so pausing freezes
 * the animation mid-flight instead of letting it jump to its end on resume.
 * Wraps requestAnimationFrame; while the clock is paused, callbacks are held
 * and replayed on resume with the pause subtracted from their timestamps.
 */
export function pausableFrames(clock: PausableClock) {
  let held: FrameRequestCallback | null = null;
  let heldId = 0;
  let nextId = 1;
  const live = new Map<number, number>();

  const schedule = (id: number, callback: FrameRequestCallback) => {
    const raw = requestAnimationFrame((time) => {
      live.delete(id);
      if (clock.paused) {
        held = callback;
        heldId = id;
        return;
      }
      void time;
      callback(clock.now());
    });
    live.set(id, raw);
  };

  return {
    frame(callback: FrameRequestCallback): number {
      const id = nextId++;
      schedule(id, callback);
      return id;
    },
    cancelFrame(id: number): void {
      const raw = live.get(id);
      if (raw !== undefined) cancelAnimationFrame(raw);
      live.delete(id);
      if (heldId === id) {
        held = null;
        heldId = 0;
      }
    },
    /** Call after `clock.resume()`: replays the callback a pause caught. */
    releaseHeld(): void {
      if (!held) return;
      const callback = held;
      const id = heldId;
      held = null;
      heldId = 0;
      schedule(id, callback);
    },
  };
}

/**
 * Await the NEWEST motion, not the one that happened to be in the air when
 * the caller looked. A press that awaits a stale flight while the palette
 * launches a fresh one clicks mid-air; this loops until the latest motion at
 * the moment of checking is the one that just finished.
 */
export async function awaitNewest(latest: () => Promise<void> | null): Promise<void> {
  for (;;) {
    const flight = latest();
    if (!flight) return;
    await flight;
    if (latest() === flight) return;
  }
}
