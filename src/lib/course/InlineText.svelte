<script lang="ts">
  /** Renders one line of lesson prose. The parsing is in `inline.ts`. */
  import { parseInline } from './inline.ts';

  type Props = { text: string };
  let { text }: Props = $props();

  const runs = $derived(parseInline(text));
</script>

{#each runs as run, i (i)}{#if run.strong}<strong>{run.text}</strong>{:else if run.em}<em
      >{run.text}</em
    >{:else}{run.text}{/if}{/each}

<style>
  strong {
    font-weight: 650;
  }
  em {
    font-style: italic;
  }
</style>
