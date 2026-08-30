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
  };
  let { sentence, reading, focus, frameWidth = 0 }: Props = $props();

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

<div class="figure-graph">
  {#if figure}
    <Diagram
      words={figure.words}
      constituents={figure.constituents}
      selection={nothing}
      interactive={false}
      fluid
      trim
      {frameWidth}
    />
  {/if}
</div>

<style>
  .figure-graph {
    display: block;
    width: 100%;
  }
</style>
