import type { Viewport } from './viewport.ts';

type Frame = (callback: FrameRequestCallback) => number;
type CancelFrame = (id: number) => void;

export interface CameraMotionOptions {
  duration?: number;
  immediate?: boolean;
}

const same = (a: Viewport, b: Viewport) =>
  Math.abs(a.tx - b.tx) < 1e-6 && Math.abs(a.ty - b.ty) < 1e-6 && Math.abs(a.z - b.z) < 1e-9;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * A tiny interruptible camera animator. Any outside viewport write (wheel,
 * pinch, toolbar, or a new gesture) cancels the current motion on its next
 * frame, so automatic assistance never fights the learner.
 */
export function createCameraMotion(
  read: () => Viewport,
  write: (viewport: Viewport) => void,
  frame: Frame = (callback) => requestAnimationFrame(callback),
  cancelFrame: CancelFrame = (id) => cancelAnimationFrame(id),
) {
  let frameId: number | null = null;
  let expected: Viewport | null = null;

  function cancel() {
    if (frameId != null) cancelFrame(frameId);
    frameId = null;
    expected = null;
  }

  function moveTo(target: Viewport, options: CameraMotionOptions = {}) {
    cancel();
    const start = { ...read() };
    if (options.immediate || (options.duration ?? 200) <= 0 || same(start, target)) {
      write({ ...target });
      return;
    }

    const duration = options.duration ?? 200;
    let startTime: number | null = null;
    expected = start;

    const tick: FrameRequestCallback = (time) => {
      if (!expected || !same(read(), expected)) {
        cancel();
        return;
      }
      startTime ??= time;
      const progress = Math.min(1, (time - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      expected = {
        tx: mix(start.tx, target.tx, eased),
        ty: mix(start.ty, target.ty, eased),
        z: mix(start.z, target.z, eased),
      };
      write(expected);
      if (progress < 1) frameId = frame(tick);
      else cancel();
    };

    frameId = frame(tick);
  }

  return {
    moveTo,
    cancel,
    get active() {
      return frameId != null;
    },
  };
}
