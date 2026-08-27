<script lang="ts">
  /**
   * The right column. Holds the account/share row and the zoom control, then
   * whatever properties the current selection has.
   */
  import type { Snippet } from 'svelte';
  import Play from '@lucide/svelte/icons/play';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import { getWorkspace } from './workspace.svelte.ts';
  import { ZOOM_STOPS, formatZoom } from './viewport.ts';

  type Props = { tabs?: string[]; tab?: string; children?: Snippet };
  let { tabs = ['Design'], tab = $bindable(tabs[0]!), children }: Props = $props();

  const ws = getWorkspace();
  let zoomOpen = $state(false);
</script>

<aside class="inspector" aria-label="Properties">
  <header class="top">
    <div class="who" aria-hidden="true">A</div>
    <span class="spacer"></span>
    <button class="icon" type="button" title="Present" aria-label="Present">
      <Play size={14} strokeWidth={1.75} />
    </button>
    <button class="share" type="button">Share</button>
  </header>

  <div class="tabs">
    {#each tabs as t (t)}
      <button class="tab" class:on={tab === t} type="button" onclick={() => (tab = t)}>{t}</button>
    {/each}
    <span class="spacer"></span>

    <div class="zoom">
      <button
        class="zoombtn"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={zoomOpen}
        onclick={() => (zoomOpen = !zoomOpen)}
      >
        {formatZoom(ws.viewport.z)}
        <ChevronDown size={11} strokeWidth={2} />
      </button>
      {#if zoomOpen}
        <ul class="menu" role="listbox" tabindex="-1" onmouseleave={() => (zoomOpen = false)}>
          {#each ZOOM_STOPS.filter((s) => s >= 0.1 && s <= 8) as s (s)}
            <li>
              <button
                type="button"
                role="option"
                aria-selected={Math.abs(ws.viewport.z - s) < 1e-6}
                onclick={() => {
                  ws.setZoom(s);
                  zoomOpen = false;
                }}>{formatZoom(s)}</button
              >
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>

  <div class="body">
    {@render children?.()}
  </div>
</aside>

<style>
  .inspector {
    display: flex;
    flex-direction: column;
    width: var(--inspector-w);
    min-height: 0;
    background: var(--panel);
    border-left: 1px solid var(--border);
  }
  .top,
  .tabs {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: none;
    padding: 0 8px;
  }
  .top {
    height: var(--topbar-h);
  }
  .tabs {
    height: 34px;
    border-bottom: 1px solid var(--border);
  }
  .spacer {
    flex: 1;
  }
  .who {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--success);
    color: oklch(0.2 0 0);
    font-size: 10px;
    font-weight: 600;
  }
  .icon {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-muted);
    cursor: default;
  }
  .icon:hover {
    background: color-mix(in oklab, var(--ink) 8%, transparent);
    color: var(--ink);
  }
  .share {
    padding: 4px 11px;
    border: 0;
    border-radius: 999px;
    background: var(--accent);
    color: var(--accent-ink);
    font: inherit;
    font-size: 11px;
    font-weight: 500;
    cursor: default;
  }
  .tab {
    padding: 3px 7px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-faint);
    font: inherit;
    font-size: 11px;
    cursor: default;
  }
  .tab.on {
    background: color-mix(in oklab, var(--ink) 10%, transparent);
    color: var(--ink);
  }
  .zoom {
    position: relative;
  }
  .zoombtn,
  .zoom button {
    font: inherit;
  }
  .zoombtn {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 3px 5px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-muted);
    font-size: 11px;
    cursor: default;
  }
  .zoombtn:hover {
    background: color-mix(in oklab, var(--ink) 8%, transparent);
    color: var(--ink);
  }
  .menu {
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    z-index: 20;
    margin: 0;
    padding: 4px;
    list-style: none;
    min-width: 88px;
    background: var(--raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: 0 8px 24px oklch(0 0 0 / 35%);
  }
  .menu button {
    width: 100%;
    padding: 4px 8px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink);
    text-align: left;
    font-size: 11px;
    cursor: default;
  }
  .menu button:hover {
    background: var(--accent);
    color: var(--accent-ink);
  }
  .body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 16px;
  }
</style>
