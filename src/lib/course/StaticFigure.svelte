<script lang="ts">
  /**
   * A finished sentence, drawn once.
   *
   * The lesson figures used to run the workspace camera: measure the box, fit
   * the diagram into it, hold a viewport, offer zoom controls. That machinery
   * exists for a canvas somebody pans around, and putting it behind a static
   * picture cost three things a reader could see — the drawing sat off-centre
   * in both axes, the box was two thirds empty because a fixed height was
   * fitted rather than followed, and a zoom control floated over the artwork in
   * every figure, twice in a contrast.
   *
   * None of it was buying anything. `Diagram` already emits a viewBox and
   * vector geometry, so the browser can scale and centre it exactly. This is
   * the whole renderer: the same drawing, the same pure layout, and no camera.
   */
  import Diagram from '../grammar/Diagram.svelte';
  import { READABLE_ZOOM_FLOOR } from '../grammar/node-label.ts';
  import type { Selection } from '../grammar/options.ts';
  import type { Func, Reading, SentenceEntry } from '../grammar/types.ts';
  import { focusedFigure } from './figure-focus.ts';
  import { replaySentence } from './sentence-renderer.ts';

  type Props = {
    sentence: SentenceEntry;
    /** The tree pruned to what the lesson has taught. */
    reading?: Reading;
    /** Crop to the constituent doing this job; the rest of the sentence goes. */
    focus?: Func;
    /** Draw into this width so a compared pair shares one scale. */
    frameWidth?: number;
    /**
     * Never shrink below the app's readability floor; scroll sideways instead.
     * The lesson contract asks that a figure stay readable on a narrow screen
     * without shrinking labels below that floor.
     */
    readable?: boolean;
  };
  let { sentence, reading, focus, frameWidth = 0, readable = false }: Props = $props();

  let box = $state<HTMLDivElement>();
  let boxWidth = $state(0);
  /** Wider than its box: say so, and make the box reachable by keyboard. */
  let scrolls = $state(false);
  $effect(() => {
    void boxWidth;
    void figure;
    if (box) scrolls = readable && box.scrollWidth > box.clientWidth + 1;
  });

  const build = $derived(replaySentence(sentence, reading).final);
  // A missing focus target draws nothing rather than quietly showing the whole
  // sentence — figure-focus.test.ts keeps authored pages off this branch.
  const figure = $derived(
    focus === undefined
      ? { words: sentence.words, constituents: build.constituents }
      : focusedFigure(sentence.words, build.constituents, focus),
  );
  const nothing: Selection = { kind: 'none' };
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="figure-graph"
  class:readable
  bind:this={box}
  bind:clientWidth={boxWidth}
  role={scrolls ? 'region' : undefined}
  aria-label={scrolls ? 'Diagram, wider than the screen: scroll sideways' : undefined}
  tabindex={scrolls ? 0 : undefined}
>
  {#if figure}
    <Diagram
      words={figure.words}
      constituents={figure.constituents}
      selection={nothing}
      interactive={false}
      fluid
      trim
      {frameWidth}
      minScale={readable ? READABLE_ZOOM_FLOOR : 0}
    />
  {/if}
</div>
{#if scrolls}
  <p class="scroll-hint" aria-hidden="true">Swipe sideways to see the whole diagram →</p>
{/if}

<style>
  .figure-graph {
    display: block;
    width: 100%;
  }
  .figure-graph.readable {
    overflow-x: auto;
    overscroll-behavior-x: contain;
  }
  .scroll-hint {
    margin: 2px 0 0;
    color: var(--ink-muted);
    font-size: 12px;
    text-align: center;
  }
</style>
