<script module lang="ts">
  import type { Component } from 'svelte';

  export interface RailItem {
    id: string;
    label: string;
    icon: Component;
  }
</script>

<script lang="ts">
  /** The left icon rail. Chooses which panel is showing; owns nothing else. */
  type Props = { items: RailItem[]; active: string };
  let { items, active = $bindable() }: Props = $props();
</script>

<nav class="rail" aria-label="Sections">
  {#each items as item (item.id)}
    {@const on = active === item.id}
    <button
      class="item"
      class:on
      type="button"
      aria-current={on ? 'page' : undefined}
      onclick={() => (active = item.id)}
    >
      <item.icon size={18} strokeWidth={1.5} aria-hidden="true" />
      <span>{item.label}</span>
    </button>
  {/each}
</nav>

<style>
  .rail {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: var(--rail-w);
    padding: 8px 4px;
    background: var(--rail);
    border-right: 1px solid var(--border);
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 7px 2px 6px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-faint);
    font: inherit;
    font-size: 9px;
    letter-spacing: 0.01em;
    cursor: default;
  }
  .item:hover {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
    color: var(--ink-muted);
  }
  .item.on {
    background: color-mix(in oklab, var(--accent) 16%, transparent);
    color: var(--accent);
  }
</style>
