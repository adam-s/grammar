<script lang="ts">
  /** The left panel: a titled, internally scrolling column of a fixed width. */
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import type { Snippet } from 'svelte';

  type Props = {
    title: string;
    actions?: Snippet;
    oncollapse?: () => void;
    children?: Snippet;
  };
  let { title, actions, oncollapse, children }: Props = $props();
</script>

<aside class="panel" aria-label={title}>
  <header>
    <h1>{title}</h1>
    <div class="actions">
      {@render actions?.()}
      {#if oncollapse}
        <button type="button" aria-label="Collapse left sidebar" onclick={oncollapse}>
          <ChevronLeft size={14} strokeWidth={2} />
        </button>
      {/if}
    </div>
  </header>
  <div class="body">
    {@render children?.()}
  </div>
</aside>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    width: var(--panel-w);
    min-height: 0;
    background: var(--panel);
    border-right: 1px solid var(--border);
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    height: var(--topbar-h);
    flex: none;
    padding: 0 8px 0 12px;
  }
  h1 {
    flex: 1;
    margin: 0;
    font-size: 12px;
    font-weight: 600;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .actions button {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-muted);
  }
  .actions button:hover {
    background: color-mix(in oklab, var(--ink) 8%, transparent);
    color: var(--ink);
  }
  .body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 4px 8px 16px;
  }

  @media (max-width: 1100px) {
    .panel {
      position: fixed;
      z-index: 60;
      inset: 0 auto 0 0;
      box-sizing: border-box;
      width: min(88vw, var(--panel-w));
      padding-top: env(safe-area-inset-top);
      box-shadow: 12px 0 34px oklch(0 0 0 / 38%);
    }
    header {
      min-height: 44px;
    }
    .actions button {
      width: 44px;
      height: 44px;
    }
  }

  @media (max-width: 700px) {
    .panel {
      bottom: calc(var(--mobile-nav-h) + env(safe-area-inset-bottom));
    }
  }
</style>
