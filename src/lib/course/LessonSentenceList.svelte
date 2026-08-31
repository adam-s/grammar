<script lang="ts">
  import Check from '@lucide/svelte/icons/check';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import type { SentenceEntry } from '../grammar/types.ts';

  type Props = {
    sentences: SentenceEntry[];
    selectedId?: string | null;
    /** Sentence ids the learner has finished; they wear a check at rest. */
    completed?: string[];
    onselect: (sentenceId: string) => void;
    onreset?: () => void;
  };

  let { sentences, selectedId = null, completed = [], onselect, onreset }: Props = $props();
</script>

<ul>
  {#each sentences as sentence, index (sentence.id)}
    <li>
      <button
        class:selected={sentence.id === selectedId}
        class:done={completed.includes(sentence.id)}
        type="button"
        aria-current={sentence.id === selectedId ? 'true' : undefined}
        aria-label="{sentence.text}, open diagram{completed.includes(sentence.id)
          ? ', finished'
          : ''}"
        onclick={() => onselect(sentence.id)}
      >
        <span class="number">{String(index + 1).padStart(2, '0')}</span>
        <span class="sentence">{sentence.text}</span>
        <!-- A finished sentence wears its check at rest; the pointer brings
             the chevron back, because the row still opens the diagram. -->
        <Check class="check" size={13} strokeWidth={2.25} aria-hidden="true" />
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
    display: grid;
    grid-template-columns: 2rem minmax(0, 1fr) 1.25rem;
    align-items: center;
    width: 100%;
    min-height: var(--panel-row-height);
    padding: 6px 8px;
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
    background: color-mix(in oklab, var(--accent) 17%, transparent);
  }
  .number {
    align-self: center;
    color: var(--ink-faint);
    font-family: var(--font-mono);
    font-size: 9.5px;
    font-variant-numeric: tabular-nums;
  }
  .sentence {
    min-width: 0;
    color: var(--ink);
    font-size: 11.5px;
    font-weight: 480;
    line-height: 1.35;
  }
  /* The chevron carries the affordance the second line used to spell out. It
     stays faint until the row is under the pointer or holds the selection.
     The check shares its cell: a finished row rests on the check, and the
     pointer swaps the chevron back in, because the row still opens. */
  li button :global(.chevron),
  li button :global(.check) {
    grid-column: 3;
    grid-row: 1;
    justify-self: center;
  }
  li button :global(.chevron) {
    color: var(--ink-faint);
    opacity: 0.55;
  }
  li button:hover :global(.chevron),
  li button:focus-visible :global(.chevron),
  li button.selected :global(.chevron) {
    color: var(--ink-muted);
    opacity: 1;
  }
  li button :global(.check) {
    color: var(--success);
    opacity: 0;
  }
  li button.done:not(:hover):not(:focus-visible) :global(.check) {
    opacity: 1;
  }
  li button.done:not(:hover):not(:focus-visible) :global(.chevron) {
    opacity: 0;
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
