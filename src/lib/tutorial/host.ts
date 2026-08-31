/**
 * Everything the guided run needs from the page it drives, in one object.
 *
 * The run and the page used to co-own this contract as two dozen separate
 * props — every new behaviour meant a new prop, new wiring, and often a new
 * page-side mirror of a tutorial-side fact. One object names the whole
 * surface: queries into the live build, the real handlers the run performs
 * against, and the measurements only the page can take. The page constructs
 * it once; the run reads everything live.
 */
import type { Selection } from '../grammar/options.ts';
import type { SelectionGestureHooks } from '../workspace/selection-gesture.ts';
import type { Point, Rect } from '../workspace/viewport.ts';

export type TutorialHost = {
  /** The live word row, for pinning the camera while the tree grows. */
  anchorRect: () => Rect | null;
  /** The words a decision is about, in diagram coordinates. */
  focusRect: (selection: Selection) => Rect | null;
  /**
   * Where exactly the thing to be clicked is RENDERED, in client
   * coordinates — measured from the DOM, not derived from layout
   * arithmetic. The app's own motion always wins: whatever the camera and
   * the growing tree have done, a measurement taken after they settle is
   * where the pointer must land.
   */
  pointTarget: (selection: Selection) => Point | null;
  /** Apply a selection the way the page's own handlers would. */
  select: (selection: Selection) => void;
  /**
   * What the page's handlers actually committed, read after a gesture. A
   * performed gesture is only trusted when this matches the script.
   */
  selected: () => Selection;
  /** What the live palette says about a row, read after selecting. */
  offered: (key: string) => { found: boolean; pickable: boolean; state?: string } | null;
  /** Click an option by key, through the same handler the palette uses. */
  pick: (key: string) => { ok: boolean; reason?: string };
  /** What is on the diagram, so a pick that changed nothing is caught. */
  signature: () => string;
  /**
   * The page's selection-gesture hooks — the SAME draft and marquee
   * handlers its real pointer events call. With these, the run PERFORMS
   * each selection; without them it falls back to showing finished
   * selections.
   */
  gestures: SelectionGestureHooks | null;
  /** Whether drag gestures are truly available on this device. */
  canDrag: boolean;
  /**
   * Take the pointer to the palette row for a key and resolve when it has
   * ARRIVED — the palette's own completed gesture, not a timer.
   */
  aimMenu: (key: string) => Promise<void>;
  /** Clear any half-drawn draft or marquee a stopped run left behind. */
  cancelGesture: () => void;
};
