/**
 * The workspace's live state: where the camera is, which tool is armed, what is
 * selected.
 *
 * Created per-component-tree and passed through context rather than exported as
 * a module singleton — a singleton would be shared across SSR requests, and it
 * makes two workspaces on one page impossible. All the arithmetic lives in
 * `viewport.ts`; this only holds state and delegates.
 */
import { getContext, setContext } from 'svelte';
import {
  centerOn,
  fit,
  nextStop,
  panBy,
  zoomTo,
  type Point,
  type Rect,
  type Size,
  type Viewport,
} from './viewport.ts';
import { fitPadding } from './stage-resize.ts';

export type ToolId = 'select' | 'hand' | 'frame' | 'text' | 'comment';

export class Workspace {
  viewport = $state<Viewport>({ tx: 0, ty: 0, z: 1 });
  tool = $state<ToolId>('select');
  /** Space held: a momentary hand tool that reverts on keyup. */
  spaceDown = $state(false);
  selection = $state<string[]>([]);
  /** The stage's pixel size, kept current by a ResizeObserver. */
  stage = $state<Size>({ w: 0, h: 0 });

  /** True while the pointer should grab the canvas instead of its contents. */
  get panning(): boolean {
    return this.tool === 'hand' || this.spaceDown;
  }

  get center(): Point {
    return { x: this.stage.w / 2, y: this.stage.h / 2 };
  }

  /** True once the canvas has a real layout box and its camera can be framed. */
  get stageReady(): boolean {
    return this.stage.w > 0 && this.stage.h > 0;
  }

  isSelected = (id: string): boolean => this.selection.includes(id);

  select = (id: string, additive = false): void => {
    if (!additive) {
      this.selection = [id];
    } else if (this.isSelected(id)) {
      this.selection = this.selection.filter((s) => s !== id);
    } else {
      this.selection = [...this.selection, id];
    }
  };

  clearSelection = (): void => {
    this.selection = [];
  };

  pan = (dx: number, dy: number): void => {
    this.viewport = panBy(this.viewport, dx, dy);
  };

  /** `focus` defaults to the middle of the stage, which is what a menu wants. */
  setZoom = (z: number, focus: Point = this.center): void => {
    this.viewport = zoomTo(this.viewport, z, focus);
  };

  zoomBy = (factor: number, focus: Point = this.center): void => {
    this.setZoom(this.viewport.z * factor, focus);
  };

  zoomStep = (dir: 1 | -1, focus: Point = this.center): void => {
    this.setZoom(nextStop(this.viewport.z, dir), focus);
  };

  /**
   * The smallest zoom an automatic fit may choose. 0 means no floor.
   *
   * Set by whoever knows what is being drawn — the workspace cannot know that a
   * 13px label stops being readable below about 0.7, and should not import
   * something that does. See `READABLE_ZOOM_FLOOR` in `grammar/node-label.ts`.
   */
  fitFloor = 0;

  /**
   * Frame the work FOR the learner, and never smaller than it can be read at.
   *
   * "Show the whole tree" and "keep the labels legible" are two wishes, and
   * this grants the second. The longest course sentences fitted a 390px phone
   * at 38%, where a 13px node label renders at five pixels and a 7.5px
   * qualifier at three: structurally perfect and unreadable.
   *
   * Below the floor it shows the START of the diagram rather than all of it. A
   * sentence is read and built left to right, so the left edge is where the
   * work is, and the rest is a pan away — a smaller cost than a tree nobody can
   * read.
   */
  zoomToFit = (rect: Rect, padding = fitPadding(this.stage)): void => {
    if (rect.w <= 0 || rect.h <= 0 || this.stage.w === 0) return;
    const whole = fit(rect, this.stage, padding);
    if (this.fitFloor <= 0 || whole.z >= this.fitFloor) {
      this.viewport = whole;
      return;
    }
    const visible = Math.max(1, this.stage.w - padding * 2) / this.fitFloor;
    this.viewport = centerOn({ ...rect, w: Math.min(rect.w, visible) }, this.stage, this.fitFloor);
  };

  /**
   * Show all of it, whatever that costs in size.
   *
   * What the Fit control and ⇧! mean: the learner has ASKED for the overview,
   * and answering "no, here is a readable part of it" would be refusing the
   * request they made.
   */
  zoomToWhole = (rect: Rect, padding = fitPadding(this.stage)): void => {
    if (rect.w <= 0 || rect.h <= 0 || this.stage.w === 0) return;
    this.viewport = fit(rect, this.stage, padding);
  };

  /** 100%, recentred on `rect` — the ⌘0 that also finds your work again. */
  resetZoom = (rect?: Rect): void => {
    this.viewport = rect ? centerOn(rect, this.stage, 1) : { ...this.viewport, z: 1 };
  };
}

const KEY = Symbol('workspace');

export const setWorkspace = (ws: Workspace = new Workspace()): Workspace => setContext(KEY, ws);

export const getWorkspace = (): Workspace => getContext<Workspace>(KEY);
