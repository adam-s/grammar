/**
 * The guided pointer's motion, as arithmetic.
 *
 * A demonstration pointer reads as a hand only if it obeys the rules a hand
 * obeys: it exists continuously, it travels — never teleports — it takes
 * longer to go farther, it moves in a shallow curve rather than a ruler line,
 * and it presses when it arrives, not at a percentage of somebody's timeline.
 * Every one of those rules is a number or a function here, so the component
 * that renders the pointer decides nothing and `node --test` can hold the
 * choreography still.
 */
import type { Point } from './viewport.ts';

/** Ease-in-out cubic: starts and ends at rest, like a hand. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/**
 * How long a glide takes, from how far it goes.
 *
 * Linear in distance with a floor and a ceiling: a 40px hop should not take
 * the same time as a trip across the panel, and a trip across the stage
 * should still arrive while the narration is talking about it.
 */
export function glideDuration(distance: number): number {
  return Math.round(Math.min(920, Math.max(280, 240 + distance * 0.85)));
}

/**
 * The bow of the path: how far its midpoint leaves the straight line.
 *
 * A shallow arc, and only when the trip is long enough to show one — a short
 * hop that curves reads as a wobble, not a gesture.
 */
export function arcHeight(distance: number): number {
  if (distance < 90) return 0;
  return Math.min(24, distance * 0.1);
}

export type Glide = {
  duration: number;
  /** Position at `elapsed` milliseconds. Clamped: at(≥duration) is `to`. */
  at: (elapsed: number) => Point;
};

/**
 * A finished plan for one movement: eased along a quadratic arc that leaves
 * the straight line by `arcHeight` at its middle and returns to it at both
 * ends, so the pointer lands exactly on its target.
 */
export function glide(from: Point, to: Point): Glide {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  const duration = glideDuration(distance);
  const bow = arcHeight(distance);
  // Perpendicular to travel, one consistent side, so repeated moves between
  // the same rows draw the same gesture rather than alternating snakes.
  const nx = distance === 0 ? 0 : -dy / distance;
  const ny = distance === 0 ? 0 : dx / distance;
  return {
    duration,
    at(elapsed) {
      const t = Math.min(1, Math.max(0, elapsed / duration));
      const e = easeInOutCubic(t);
      // 4t(1-t) is 0 at both ends and 1 at the middle: the arc's profile.
      const lift = bow * 4 * e * (1 - e);
      return {
        x: from.x + dx * e + nx * lift,
        y: from.y + dy * e + ny * lift,
      };
    },
  };
}

export type Tracking = {
  plan: Glide;
  target: Point;
  startedAt: number;
};

/**
 * A flight that follows its target. The stage is alive under the pointer —
 * the camera glides, the palette settles, panes scroll — so a destination
 * measured at take-off can be stale by landing. Each frame the caller hands
 * in the target's CURRENT position; if it has drifted, the flight re-plans
 * from wherever the pointer is now, and it is only done when it has reached
 * the target's latest position.
 */
export function startTracking(from: Point, target: Point, now: number): Tracking {
  return { plan: glide(from, target), target, startedAt: now };
}

export function trackStep(
  state: Tracking,
  now: number,
  target: Point,
): { state: Tracking; at: Point; done: boolean } {
  const drifted = Math.hypot(target.x - state.target.x, target.y - state.target.y) >= 1;
  if (drifted) {
    const here = state.plan.at(now - state.startedAt);
    const next = { plan: glide(here, target), target, startedAt: now };
    return { state: next, at: here, done: false };
  }
  const elapsed = now - state.startedAt;
  return { state, at: state.plan.at(elapsed), done: elapsed >= state.plan.duration };
}

/**
 * The press, in phases the renderer can key off.
 *
 * Dip, then release-with-ring. The ring belongs to the release — a click is
 * seen when the button comes back up — and the whole press is what a caller
 * awaits before performing the pick, so the visible click and the real one
 * are the same moment by construction.
 */
export const PRESS = {
  /** The dip down: the pointer shrinks onto its target. */
  dip: 120,
  /** The release: pointer back to size while the ring expands and fades. */
  release: 240,
} as const;

/** First appearance: fade in place — never a streak in from nowhere. */
export const APPEAR_MS = 200;

/** The pause on a category row before travelling on to the option. */
export const HOVER_MS = 170;

/** Leaving: fade where it stands. */
export const REST_MS = 220;
