<script lang="ts">
  /**
   * The wordless demonstration under a lesson title — presented to fit the
   * reader's screen.
   *
   * On a desktop the article has room to carry the performance inline, so it
   * autoplays there. On a phone it must not: the palette's phone presentation
   * is a fixed bottom sheet, and a passive demonstration that parks a
   * half-viewport sheet over an article the reader is trying to scroll is the
   * animation demanding attention the prose has already earned. So at the
   * phone breakpoint the article gets a quiet poster instead — the finished
   * diagram, in normal document flow, with nothing fixed and nothing moving.
   */
  import type { Reading, SentenceEntry } from '../grammar/types.ts';
  import { PHONE_QUERY, useMediaQuery } from '../workspace/responsive.svelte.ts';
  import HeroStage from './HeroStage.svelte';
  import StaticFigure from './StaticFigure.svelte';

  /** The pruned tree, when the lesson shows only part of the parse. */
  type Props = { sentence: SentenceEntry; reading?: Reading };
  let { sentence, reading }: Props = $props();

  const phone = useMediaQuery(PHONE_QUERY);
</script>

{#if !phone.matches}
  <figure
    class="hero"
    aria-label="A diagram of “{sentence.text}” being built, one decision at a time"
  >
    <HeroStage {sentence} {reading} mode="inline" />
  </figure>
{:else}
  <figure class="hero poster" aria-label="The finished diagram of “{sentence.text}”">
    <StaticFigure {sentence} {reading} />
  </figure>
{/if}

<style>
  .hero {
    width: 100%;
    margin: 0;
  }

  .poster {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* The poster is a figure, not the show: cap the diagram so the lesson's
     first paragraph stays in reach on tall-diagram sentences. The fluid SVG
     scales whole through its viewBox — nothing is cropped. */
  .poster :global(svg.diagram) {
    max-height: 420px;
    max-height: min(46svh, 420px);
  }
</style>
