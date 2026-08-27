<script lang="ts">
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import type { SentenceEntry } from '../grammar/types.ts';

  type Props = {
    sentences: SentenceEntry[];
    selectedId?: string | null;
    onselect: (sentenceId: string) => void;
    onreset?: () => void;
  };

  let { sentences, selectedId = null, onselect, onreset }: Props = $props();
</script>

<ul>
  {#each sentences as sentence (sentence.id)}
    <li>
      <button
        class:selected={sentence.id === selectedId}
        type="button"
        aria-current={sentence.id === selectedId ? 'true' : undefined}
        onclick={() => onselect(sentence.id)}
      >
        <span class="sentence">{sentence.text}</span>
        <span class="action">Open diagram</span>
      </button>
    </li>
  {/each}
</ul>

{#if selectedId && onreset}
  <button class="reset" type="button" onclick={onreset}>
    <RotateCcw size={12} strokeWidth={1.75} aria-hidden="true" />
    Start this sentence again
  </button>
{/if}

<style>
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li button {
    display: block;
    width: 100%;
    padding: 9px 8px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
  }
  li button:hover {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
  }
  li button.selected {
    background: color-mix(in oklab, var(--accent) 18%, transparent);
  }
  .sentence {
    display: block;
    color: var(--ink);
    font-size: 12px;
  }
  .action {
    display: block;
    margin-top: 2px;
    color: var(--ink-faint);
    font-size: 9.5px;
  }
  .reset {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 10px 8px;
    padding: 5px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-muted);
    font: inherit;
    font-size: 11px;
  }
</style>
