<script lang="ts">
  /** The left panel: a titled, internally scrolling column of a fixed width. */
  import type { Snippet } from 'svelte';

  type Props = { title: string; actions?: Snippet; children?: Snippet };
  let { title, actions, children }: Props = $props();
</script>

<aside class="panel" aria-label={title}>
  <header>
    <h1>{title}</h1>
    {@render actions?.()}
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
    margin: 0;
    font-size: 12px;
    font-weight: 600;
  }
  .body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 4px 8px 16px;
  }
</style>
