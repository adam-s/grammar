<script lang="ts">
  import Check from '@lucide/svelte/icons/check';
  import type { CourseStage } from './types.ts';

  type Props = {
    stages: CourseStage[];
    lessonId: string;
    completed?: string[];
    onselect: (lessonId: string) => void;
  };

  let { stages, lessonId, completed = [], onselect }: Props = $props();
</script>

<nav aria-label="Course lessons">
  {#each stages as stage (stage.id)}
    <section>
      <h2>{stage.title}</h2>
      <ol>
        {#each stage.lessons as lesson (lesson.id)}
          <li>
            <button
              class:current={lesson.id === lessonId}
              type="button"
              aria-current={lesson.id === lessonId ? 'page' : undefined}
              aria-label={`${lesson.number}. ${lesson.title}`}
              onclick={() => onselect(lesson.id)}
            >
              <span class="number">{String(lesson.number).padStart(2, '0')}</span>
              <span class="title">{lesson.title}</span>
              <span class="progress" aria-hidden="true">
                {#if completed.includes(lesson.id)}<Check size={14} strokeWidth={2.25} />{/if}
              </span>
            </button>
          </li>
        {/each}
      </ol>
    </section>
  {/each}
</nav>

<style>
  nav {
    padding: 10px 8px;
  }
  section + section {
    margin-top: 20px;
  }
  h2 {
    margin: 0 8px 7px;
    color: var(--ink-faint);
    font-size: 10px;
    font-weight: 650;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  button {
    display: grid;
    grid-template-columns: 2rem minmax(0, 1fr) 1.25rem;
    align-items: center;
    width: 100%;
    min-height: 38px;
    padding: 0 8px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-muted);
    font: inherit;
    text-align: left;
  }
  button:hover {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
    color: var(--ink);
  }
  button.current {
    background: color-mix(in oklab, var(--accent) 17%, transparent);
    color: var(--ink);
  }
  .number {
    color: var(--ink-faint);
    font-family: var(--font-mono);
    font-size: 9.5px;
    font-variant-numeric: tabular-nums;
  }
  .title {
    overflow: hidden;
    font-size: 11.5px;
    font-weight: 520;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .progress {
    display: grid;
    place-items: center;
    color: var(--success);
  }
</style>
