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

  zoomToFit = (rect: Rect, padding = 96): void => {
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
