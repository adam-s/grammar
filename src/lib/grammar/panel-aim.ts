/**
 * The demonstration's hand inside the label palette.
 *
 * Taking the pointer to a menu row is workspace choreography, not palette
 * behaviour — it was living inside `LabelPanel.svelte`, which made the
 * palette two components sharing a file. The palette now exposes only its
 * DOM (root, rows, group state) through `PanelAimHost`; the choreography —
 * settle, travel, hover, open, travel again — lives here, on the
 * demonstration's own clock.
 *
 * The route is the one a hand performs: to the category (once the popup has
 * settled), a beat of hover, open the group, wait for the pane and the row
 * to settle, then on to the row. Every leg tracks its target, so a popup
 * nudged mid-flight is followed, not missed.
 */
import { menuPointerTarget } from '../workspace/element-bounds.ts';
import type { GuidedPointer } from '../workspace/guided-pointer.svelte.ts';
import { HOVER_MS } from '../workspace/pointer-motion.ts';
import type { Point } from '../workspace/viewport.ts';

/** What the palette exposes to be aimed at. All reads are live. */
export type PanelAimHost = {
  root: () => HTMLElement | null;
  pointer: () => GuidedPointer | null;
  phone: () => boolean;
  /** The group id whose submenu holds `key`, or null when no group does. */
  groupFor: (key: string) => string | null;
  activeGroup: () => string | null;
  /** Open a group the way a click would — the phone's detail pane included. */
  openGroup: (id: string) => void;
};

/** A row's aim point, in client coordinates for the shared pointer. */
function clientAim(el: Element): Point {
  const r = el.getBoundingClientRect();
  return menuPointerTarget({ x: r.left, y: r.top, w: r.width, h: r.height });
}

/**
 * Scroll the OPTIONS PANE itself, never ancestors: `scrollIntoView` on a
 * row can scroll the page a lesson figure sits in, which is the panel
 * moving the world to suit its pointer instead of the other way round.
 */
function revealRow(row: HTMLElement) {
  const pane = row.closest<HTMLElement>('.pane.secondary');
  if (!pane) return;
  const r = row.getBoundingClientRect();
  const p = pane.getBoundingClientRect();
  if (r.top < p.top) pane.scrollTop += r.top - p.top;
  else if (r.bottom > p.bottom) pane.scrollTop += r.bottom - p.bottom;
}

export function createPanelAim(host: PanelAimHost) {
  let token = 0;

  /**
   * The element `find` returns, once it exists and has HELD STILL — same
   * position and size for three consecutive frames — so the pointer never
   * commits to a destination the panel's own motion is still deciding.
   * Runs on the demonstration's clock: while it is paused nothing is
   * sampled, nothing counts toward the give-up cap, and the wait cannot
   * time out and resolve — a paused demonstration is frozen, this loop
   * included.
   */
  function settled(find: () => HTMLElement | null, mine: number): Promise<HTMLElement | null> {
    const clock = host.pointer()?.clock ?? null;
    return new Promise((resolve) => {
      let last: { x: number; y: number; w: number; h: number } | null = null;
      let still = 0;
      let tries = 0;
      const look = () => {
        if (mine !== token || !host.root()) return resolve(null);
        if (clock?.cancelled) return resolve(find());
        if (clock?.paused) return void requestAnimationFrame(look);
        if (++tries > 90) return resolve(find());
        const el = find();
        if (!el) {
          last = null;
          still = 0;
          return void requestAnimationFrame(look);
        }
        const r = el.getBoundingClientRect();
        const same =
          last &&
          Math.abs(r.x - last.x) < 0.5 &&
          Math.abs(r.y - last.y) < 0.5 &&
          Math.abs(r.width - last.w) < 0.5 &&
          Math.abs(r.height - last.h) < 0.5;
        still = same ? still + 1 : 0;
        if (still >= 2) return resolve(el);
        last = { x: r.x, y: r.y, w: r.width, h: r.height };
        requestAnimationFrame(look);
      };
      requestAnimationFrame(look);
    });
  }

  return {
    /** Abandon any aim in flight — the palette is closing or re-targeting. */
    cancel(): void {
      token++;
    },

    /**
     * Take the stage's pointer to the row for `key`, and resolve only when
     * it has ARRIVED there. The driver awaits this, then presses, then
     * applies the choice — so the palette exposes a completed gesture, not
     * a timer the driver has to out-guess.
     */
    async aim(key: string): Promise<void> {
      const hand = host.pointer();
      if (!hand || !host.root()) return;
      const mine = ++token;
      const alive = () => mine === token && !!host.root();
      const optionRow = () => {
        const root = host.root();
        return root
          ? (Array.from(root.querySelectorAll<HTMLButtonElement>('[data-option]')).find(
              (row) => row.dataset.option === key,
            ) ?? null)
          : null;
      };

      const group = host.groupFor(key);
      if (!group) return;

      if (host.activeGroup() !== group || !optionRow()) {
        // A phone shows the active category as the detail-pane title; the
        // desktop keeps the category row beside its submenu.
        const category = await settled(() => {
          const root = host.root();
          return root
            ? host.phone()
              ? root.querySelector<HTMLElement>('.pane-title')
              : (Array.from(root.querySelectorAll<HTMLElement>('[data-menu-group]')).find(
                  (row) => row.dataset.menuGroup === group,
                ) ?? null)
            : null;
        }, mine);
        if (!alive() || !category) return;
        await hand.moveToClient(() => (category.isConnected ? clientAim(category) : null));
        if (!alive()) return;
        await hand.clock.wait(HOVER_MS);
        if (!alive()) return;
        if (host.activeGroup() !== group) host.openGroup(group);
      }

      const row = await settled(optionRow, mine);
      if (!alive() || !row) return;
      revealRow(row);
      const shownRow = await settled(optionRow, mine);
      if (!alive() || !shownRow) return;
      await hand.moveToClient(() => {
        const el = optionRow();
        return el ? clientAim(el) : null;
      });
    },
  };
}
