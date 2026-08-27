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
  import Canvas from './Canvas.svelte';
  import Inspector from './Inspector.svelte';
  import Panel from './Panel.svelte';
  import Rail, { type RailItem } from './Rail.svelte';
  import Toolbar from './Toolbar.svelte';
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
    /** What ⇧1 and "zoom to fit" should frame. */
    content?: Rect;
    panel?: Snippet<[string]>;
    inspector?: Snippet;
    children?: Snippet;
  };
  let {
    items,
    ws = new WorkspaceState(),
    active = $bindable(items[0]?.id ?? ''),
    tabs,
    content,
    panel,
    inspector,
    children,
  }: Props = $props();

  // Read once, on purpose: the context is established at construction and the
  // state object is never swapped out under a live tree.
  // svelte-ignore state_referenced_locally
  setWorkspace(ws);

  const title = $derived(items.find((i) => i.id === active)?.label ?? '');
</script>

<div class="app">
  <Rail {items} bind:active />

  <Panel {title}>
    {@render panel?.(active)}
  </Panel>

  <main class="stage">
    <Canvas {content}>
      {@render children?.()}
    </Canvas>
    <Toolbar {content} />
  </main>

  <Inspector {tabs}>
    {@render inspector?.()}
  </Inspector>
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
  .stage {
    position: relative;
    min-width: 0;
    min-height: 0;
  }
</style>
