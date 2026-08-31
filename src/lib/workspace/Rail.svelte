<script module lang="ts">
  import type { Component } from 'svelte';

  export interface RailItem {
    id: string;
    label: string;
    icon: Component;
    href?: string;
  }
</script>

<script lang="ts">
  /** The left icon rail. Chooses which panel is showing; owns nothing else. */
  type Props = { items: RailItem[]; active: string; onselect?: (id: string) => void };
  let { items, active = $bindable(), onselect }: Props = $props();

  function select(id: string) {
    active = id;
    onselect?.(id);
  }
</script>

<nav class="rail" aria-label="Sections">
  {#each items as item (item.id)}
    {@const on = active === item.id}
    {#if item.href}
      <a class="item" href={item.href} target="_blank" rel="external noreferrer">
        <item.icon size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>{item.label}</span>
      </a>
    {:else}
      <button
        class="item"
        class:on
        type="button"
        aria-current={on ? 'page' : undefined}
        onclick={() => select(item.id)}
      >
        <item.icon size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>{item.label}</span>
      </button>
    {/if}
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
    text-decoration: none;
    cursor: default;
  }
  a.item {
    cursor: pointer;
  }
  .item span {
    white-space: nowrap;
  }
  .item:hover {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
    color: var(--ink-muted);
  }
  .item.on {
    background: color-mix(in oklab, var(--accent) 16%, transparent);
    color: var(--accent);
  }

  @media (max-width: 700px) {
    .rail {
      box-sizing: border-box;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
      height: calc(var(--mobile-nav-h) + env(safe-area-inset-bottom));
      padding: 4px max(4px, env(safe-area-inset-right)) env(safe-area-inset-bottom)
        max(4px, env(safe-area-inset-left));
      border-top: 1px solid var(--border);
      border-right: 0;
    }
    .item {
      flex: 1;
      min-width: 44px;
      min-height: 44px;
      padding: 4px 2px 3px;
      font-size: 9px;
    }
  }
</style>
