<script lang="ts">
  /** A collapsible titled group of properties. */
  import type { Snippet } from 'svelte';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';

  type Props = { title: string; open?: boolean; children?: Snippet };
  let { title, open = $bindable(true), children }: Props = $props();
</script>

<section class="sec">
  <button class="head" type="button" aria-expanded={open} onclick={() => (open = !open)}>
    {#if open}
      <ChevronDown size={12} strokeWidth={2} aria-hidden="true" />
    {:else}
      <ChevronRight size={12} strokeWidth={2} aria-hidden="true" />
    {/if}
    <span>{title}</span>
  </button>
  {#if open}
    <div class="rows">{@render children?.()}</div>
  {/if}
</section>

<style>
  .sec {
    border-bottom: 1px solid var(--border);
    padding: 4px 8px 10px;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    padding: 7px 2px 5px;
    border: 0;
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    text-align: left;
    cursor: default;
  }
  .rows {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
</style>
