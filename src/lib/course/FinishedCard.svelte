<script lang="ts">
  /**
   * The moment a sentence is finished: say so, and offer the next step.
   *
   * Finishing used to be a small check in a list that, on a phone or tablet,
   * sat inside a closed drawer, so a learner could complete a sentence and not
   * know it. The card is the reward and the hand-off in one: what was done,
   * then one button to the next sentence or lesson.
   *
   * It declares itself with `data-stage-chrome`, so the camera frames the
   * finished tree beneath it rather than behind it.
   */
  import Check from '@lucide/svelte/icons/check';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import X from '@lucide/svelte/icons/x';
  import type { NextStep } from './next-step.ts';

  let {
    labels,
    next,
    compact = false,
    onnext,
    ondismiss,
  }: {
    /** How many labels the lesson asked for; all of them are placed. */
    labels: number;
    next: NextStep;
    /** A phone: shorter words, the same choices. */
    compact?: boolean;
    onnext: (step: Exclude<NextStep, null>) => void;
    ondismiss: () => void;
  } = $props();

  const nextLabel = $derived(
    !next ? '' : next.kind === 'sentence' ? 'Next sentence' : 'Next lesson',
  );
  const nextTitle = $derived(!next ? undefined : next.kind === 'sentence' ? next.text : next.title);
</script>

<div class="finished" data-stage-chrome role="group" aria-label="Sentence finished">
  <span class="mark" aria-hidden="true"><Check size={15} strokeWidth={2.6} /></span>
  <p class="text">
    <strong>Finished.</strong>
    {#if !compact}
      All {labels} label{labels === 1 ? '' : 's'} this lesson asks for are in place.
    {/if}
  </p>
  {#if next}
    <button class="next" type="button" title={nextTitle} onclick={() => onnext(next)}>
      {nextLabel}
      <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
    </button>
  {:else if !compact}
    <p class="end">That was the last sentence of the course.</p>
  {/if}
  <button class="dismiss" type="button" aria-label="Hide this message" onclick={ondismiss}>
    <X size={13} strokeWidth={2} aria-hidden="true" />
  </button>
</div>

<style>
  .finished {
    display: flex;
    position: absolute;
    /* Beneath the top row of floating controls (the sentence actions on a
       laptop, the Lessons and Sentences pills on a phone), never over it. */
    top: 58px;
    left: 50%;
    z-index: 46;
    box-sizing: border-box;
    max-width: calc(100% - 16px);
    gap: 10px;
    align-items: center;
    padding: 6px 6px 6px 10px;
    border: 1px solid color-mix(in oklab, var(--success) 45%, var(--border));
    border-radius: 999px;
    background: color-mix(in oklab, var(--panel) 96%, transparent);
    color: var(--ink);
    box-shadow: 0 4px 16px oklch(0 0 0 / 18%);
    backdrop-filter: blur(10px);
    font-size: 12px;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .mark {
    display: grid;
    flex: none;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--success) 18%, var(--panel));
    color: var(--success);
  }
  .text,
  .end {
    overflow: hidden;
    margin: 0;
    text-overflow: ellipsis;
  }
  .end {
    color: var(--ink-muted);
  }
  .next {
    display: inline-flex;
    flex: none;
    gap: 6px;
    align-items: center;
    min-height: 32px;
    padding: 0 14px;
    border: 0;
    border-radius: 999px;
    background: var(--accent);
    color: var(--accent-ink);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .next:hover {
    background: color-mix(in oklab, var(--accent) 88%, var(--ink));
  }
  .dismiss {
    display: grid;
    flex: none;
    place-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--ink-muted);
    cursor: pointer;
  }
  .dismiss:hover {
    background: color-mix(in oklab, var(--ink) 8%, transparent);
    color: var(--ink);
  }

  /* Finger-sized controls on a phone. */
  @media (max-width: 700px) {
    .next {
      min-height: 44px;
    }
    .dismiss {
      width: 44px;
      height: 44px;
    }
  }
</style>
