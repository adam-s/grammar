<script lang="ts">
  /**
   * The full-screen shell: rail, panel, stage, inspector — four columns that
   * fill the viewport exactly once and never scroll as a unit.
   *
   * It supplies the chrome and the camera; the caller supplies what goes in the
   * panel, on the canvas, and in the inspector. Keeping those as snippets is
   * what stops this file from slowly absorbing the whole application.
   */
  import type { Snippet } from 'svelte';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Canvas from './Canvas.svelte';
  import Inspector from './Inspector.svelte';
  import Panel from './Panel.svelte';
  import Rail, { type RailItem } from './Rail.svelte';
  import Toolbar from './Toolbar.svelte';
  import { COMPACT_WORKSPACE_QUERY, useMediaQuery } from './responsive.svelte.ts';
  import { setWorkspace, Workspace as WorkspaceState } from './workspace.svelte.ts';
  import type { Rect } from './viewport.ts';

  type Props = {
    items: RailItem[];
    /**
     * Pass one in when the caller needs to read the selection or drive the
     * camera; context is set by this component, so a parent cannot get at a
     * state object this component created.
     */
    ws?: WorkspaceState;
    active?: string;
    tabs?: string[];
    inspectorKind?: 'properties' | 'navigation';
    inspectorTitle?: string;
    /** What ⇧1 and "zoom to fit" should frame. */
    content?: Rect;
    /** Lessons scroll like documents; diagrams retain the pan-and-zoom canvas. */
    surface?: 'canvas' | 'document';
    /** Changing this identity starts the document at its beginning. */
    documentKey?: string;
    /** Desktop drag-selection rectangle, expressed in world coordinates. */
    onmarquee?: (rect: Rect | null, done: boolean) => void;
    panel?: Snippet<[string, () => void]>;
    inspector?: Snippet<[() => void]>;
    /** Screen-space UI that floats above the canvas but does not pan or zoom. */
    overlay?: Snippet;
    children?: Snippet;
  };
  let {
    items,
    ws = new WorkspaceState(),
    active = $bindable(items[0]?.id ?? ''),
    tabs,
    inspectorKind = 'properties',
    inspectorTitle = 'Contents',
    content,
    surface = 'canvas',
    documentKey,
    onmarquee,
    panel,
    inspector,
    overlay,
    children,
  }: Props = $props();

  // Read once, on purpose: the context is established at construction and the
  // state object is never swapped out under a live tree.
  // svelte-ignore state_referenced_locally
  setWorkspace(ws);

  const title = $derived(items.find((i) => i.id === active)?.label ?? '');
  const rightLabel = $derived(
    inspectorKind === 'navigation' ? inspectorTitle : (tabs?.[0] ?? 'Details'),
  );
  let leftOpen = $state(true);
  let rightOpen = $state(true);
  const compact = useMediaQuery(COMPACT_WORKSPACE_QUERY);
  const rightVisible = $derived(!!inspector && rightOpen);
  let wasCompact = $state(false);
  let documentElement = $state<HTMLDivElement>();
  let previousDocumentKey: string | undefined;

  $effect(() => {
    if (!compact.ready || compact.matches === wasCompact) return;
    wasCompact = compact.matches;
    // Drawers start out of the way on compact screens; a spacious desktop
    // restores the persistent workspace columns.
    leftOpen = !compact.matches;
    rightOpen = !compact.matches;
  });

  $effect(() => {
    if (surface !== 'document') {
      previousDocumentKey = undefined;
      return;
    }
    if (!documentElement || documentKey === previousDocumentKey) return;
    previousDocumentKey = documentKey;
    documentElement.scrollTop = 0;
    documentElement.scrollLeft = 0;
  });

  function openLeft() {
    leftOpen = true;
    if (compact.matches) rightOpen = false;
  }

  function openRight() {
    rightOpen = true;
    if (compact.matches) leftOpen = false;
  }

  function closeDrawers() {
    leftOpen = false;
    rightOpen = false;
  }

  /** Navigation replaces an overlay on compact screens; desktop columns persist. */
  function closeNavigationDrawers() {
    if (compact.matches) closeDrawers();
  }
</script>

<div
  class="app"
  class:responsive-ready={compact.ready}
  class:left-collapsed={!leftOpen}
  class:right-collapsed={!rightVisible}
>
  <div class="nav-slot">
    <Rail
      {items}
      bind:active
      onselect={() => {
        if (compact.matches) openLeft();
      }}
    />
  </div>

  {#if compact.matches && (leftOpen || rightVisible)}
    <button class="backdrop" type="button" aria-label="Close sidebar" onclick={closeDrawers}
    ></button>
  {/if}

  {#if leftOpen}
    <Panel {title} oncollapse={() => (leftOpen = false)}>
      {@render panel?.(active, closeNavigationDrawers)}
    </Panel>
  {/if}

  <main class="stage">
    {#if surface === 'canvas'}
      <Canvas {content} {onmarquee}>
        {@render children?.()}
      </Canvas>
      <Toolbar {content} />
      {@render overlay?.()}
    {:else}
      <!-- `locked` obeys `ws.scrollLocked`: a full-screen overlay somewhere in
           this document asked the scroller to hold still, and the shell that
           owns the scroller is the one that can honour that. -->
      <div
        class="document"
        class:locked={ws.scrollLocked}
        role="region"
        aria-label="Lesson"
        bind:this={documentElement}
      >
        {@render children?.()}
      </div>
    {/if}
    {#if !leftOpen}
      <button class="reopen left" type="button" aria-label="Expand left sidebar" onclick={openLeft}>
        <ChevronRight size={14} strokeWidth={2} />
        <span>{title}</span>
      </button>
    {/if}
    {#if inspector && !rightOpen}
      <button
        class="reopen right"
        type="button"
        aria-label="Expand right sidebar"
        onclick={openRight}
      >
        <span>{rightLabel}</span>
        <ChevronLeft size={14} strokeWidth={2} />
      </button>
    {/if}
  </main>

  {#if rightVisible}
    <Inspector
      {tabs}
      kind={inspectorKind}
      title={inspectorTitle}
      oncollapse={() => (rightOpen = false)}
    >
      {@render inspector?.(closeNavigationDrawers)}
    </Inspector>
  {/if}
</div>

<style>
  .app {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    /* svh, not vh: on iOS the URL bar makes vh taller than the screen, which
       pushes the toolbar under the chrome on exactly the devices least able to
       scroll it back. */
    height: 100svh;
    width: 100vw;
    overflow: hidden;
  }
  .nav-slot {
    display: contents;
  }
  .app.left-collapsed:not(.right-collapsed) {
    grid-template-columns: auto 1fr auto;
  }
  .app.right-collapsed:not(.left-collapsed) {
    grid-template-columns: auto auto 1fr;
  }
  .app.left-collapsed.right-collapsed {
    grid-template-columns: auto 1fr;
  }
  .stage {
    position: relative;
    min-width: 0;
    min-height: 0;
  }
  .document {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .document.locked {
    overflow-y: hidden;
  }
  .reopen {
    position: absolute;
    top: 8px;
    z-index: 40;
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--panel);
    color: var(--ink-muted);
    box-shadow: 0 2px 8px oklch(0 0 0 / 20%);
  }
  .reopen span {
    display: none;
  }
  .reopen:hover {
    color: var(--ink);
    border-color: var(--border-strong);
  }
  .reopen.left {
    left: 8px;
  }
  .reopen.right {
    right: 8px;
  }
  .backdrop {
    display: none;
  }

  @media (max-width: 1100px) {
    .app:not(.responsive-ready) :global(.panel),
    .app:not(.responsive-ready) :global(.inspector) {
      display: none;
    }
    .app,
    .app.left-collapsed:not(.right-collapsed),
    .app.right-collapsed:not(.left-collapsed),
    .app.left-collapsed.right-collapsed {
      grid-template-columns: auto minmax(0, 1fr);
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: block;
      padding: 0;
      border: 0;
      background: oklch(0 0 0 / 42%);
    }
  }

  @media (max-width: 700px) {
    .app,
    .app.left-collapsed:not(.right-collapsed),
    .app.right-collapsed:not(.left-collapsed),
    .app.left-collapsed.right-collapsed {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr) auto;
    }
    .nav-slot {
      z-index: 80;
      display: block;
      grid-row: 2;
      min-width: 0;
    }
    .stage {
      grid-row: 1;
    }
    .backdrop {
      inset: 0 0 calc(var(--mobile-nav-h) + env(safe-area-inset-bottom));
    }
    .reopen {
      top: max(8px, env(safe-area-inset-top));
      display: flex;
      width: auto;
      min-width: 44px;
      height: 44px;
      gap: 6px;
      padding: 0 12px;
      border-radius: 999px;
    }
    .reopen span {
      display: inline;
      max-width: 8rem;
      overflow: hidden;
      font-size: 11px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
