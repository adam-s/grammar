<script lang="ts">
  import type { SentenceEntry } from '../grammar/types.ts';
  import SentenceGraph from './SentenceGraph.svelte';

  type Props = { sentences: SentenceEntry[] };
  let { sentences }: Props = $props();
</script>

<div class="graphs" aria-label="Rendered sentence diagrams">
  {#each sentences as sentence (sentence.id)}
    <SentenceGraph {sentence} />
  {/each}
</div>

<style>
  .graphs {
    box-sizing: border-box;
    display: grid;
    align-content: start;
    justify-items: center;
    width: 100%;
    min-height: 100%;
    gap: clamp(44px, 8vh, 92px);
    padding: clamp(72px, 11vh, 132px) clamp(24px, 7vw, 96px);
  }
  @media (max-width: 700px) {
    .graphs {
      gap: 40px;
      padding: 88px 18px 72px;
    }
  }
</style>
