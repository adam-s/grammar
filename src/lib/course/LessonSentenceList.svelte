<script lang="ts">
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
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
        aria-label="{sentence.text}, open diagram"
        onclick={() => onselect(sentence.id)}
      >
        <span class="sentence">{sentence.text}</span>
        <ChevronRight class="chevron" size={13} strokeWidth={2} aria-hidden="true" />
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
    display: flex;
    gap: 6px;
    align-items: center;
    width: 100%;
    padding: 7px 8px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
  }
  /* The global ring sits 1px outside its box. These rows are the full width of
     the panel, so that offset lands outside the scroll container and gets
     clipped into two rails. Tuck it inside, where it follows the radius. */
  li button:focus-visible {
    outline-width: 1.5px;
    outline-offset: -3px;
  }
  li button:hover {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
  }
  li button.selected {
    background: color-mix(in oklab, var(--accent) 18%, transparent);
  }
  .sentence {
    flex: 1;
    color: var(--ink);
    font-size: 12px;
  }
  /* The chevron carries the affordance the second line used to spell out. It
     stays faint until the row is under the pointer or holds the selection. */
  li button :global(.chevron) {
    flex: none;
    color: var(--ink-faint);
    opacity: 0.55;
  }
  li button:hover :global(.chevron),
  li button:focus-visible :global(.chevron),
  li button.selected :global(.chevron) {
    color: var(--ink-muted);
    opacity: 1;
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
