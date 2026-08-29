<script lang="ts">
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import type { CourseLesson } from './types.ts';

  type Props = {
    prev?: CourseLesson;
    next?: CourseLesson;
    onselect: (lessonId: string) => void;
  };

  let { prev, next, onselect }: Props = $props();
</script>

{#if prev || next}
  <nav aria-label="Lessons">
    {#if prev}
      <button
        class="step back"
        type="button"
        aria-label="Previous lesson: {prev.title}"
        onclick={() => onselect(prev.id)}
      >
        <ChevronLeft size={14} strokeWidth={2} aria-hidden="true" />
        <span class="text">
          <span class="dir">Previous</span>
          <span class="name">{prev.title}</span>
        </span>
      </button>
    {/if}
    {#if next}
      <button
        class="step on"
        type="button"
        aria-label="Next lesson: {next.title}"
        onclick={() => onselect(next.id)}
      >
        <span class="text">
          <span class="dir">Next</span>
          <span class="name">{next.title}</span>
        </span>
        <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
      </button>
    {/if}
  </nav>
{/if}

<style>
  nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 14px;
    padding: 10px 4px 0;
    border-top: 1px solid var(--border);
  }
  .step {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 7px 8px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
  }
  .step:hover {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
  }
  .step:focus-visible {
    outline-width: 1.5px;
    outline-offset: -3px;
  }
  .text {
    flex: 1;
    min-width: 0;
  }
  /* The direction is the label; the title alone would read as one more
     practice sentence, since those rows carry the same chevron. */
  .dir {
    display: block;
    color: var(--ink-faint);
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .name {
    display: block;
    color: var(--ink);
    font-size: 12px;
  }
  .back .name {
    color: var(--ink-muted);
  }
  .step.on .name {
    font-weight: 550;
  }
</style>
