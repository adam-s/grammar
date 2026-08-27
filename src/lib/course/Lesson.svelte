<script lang="ts">
  /**
   * A lesson as an editorial page: a narrow reading column, figures allowed to
   * widen, and the diagram drawn by the same component the workspace uses.
   *
   * This file owns typography and nothing else. A lesson's words live in
   * `lesson-content.ts`, and its diagram is drawn by `Diagram.svelte`.
   */
  import { FIXTURES } from '../grammar/fixtures.ts';
  import InlineText from './InlineText.svelte';
  import LessonHero from './LessonHero.svelte';
  import SentenceGraph from './SentenceGraph.svelte';
  import type { LessonDoc } from './lesson-content.ts';
  import type { CourseLesson } from './types.ts';

  type Props = {
    lesson: CourseLesson;
    doc: LessonDoc;
    onstart: (sentenceId: string) => void;
  };
  let { lesson, doc, onstart }: Props = $props();

  const sentenceById = (id: string) => FIXTURES.find((sentence) => sentence.id === id)!;
  const number = $derived(String(lesson.number).padStart(2, '0'));
</script>

<article class="lesson">
  <header class="opening">
    <p class="eyebrow">{number} · {lesson.stage}</p>
    <h1>{lesson.title}</h1>
    <p class="lede"><InlineText text={doc.lede} /></p>
  </header>

  {#each doc.blocks as block, i (i)}
    {#if block.kind === 'hero'}
      <LessonHero sentence={sentenceById(block.sentenceId)} />
    {:else if block.kind === 'section'}
      <header class="turn">
        <p class="eyebrow">{block.eyebrow}</p>
        <h2>{block.title}</h2>
      </header>
    {:else if block.kind === 'prose'}
      <p class="prose"><InlineText text={block.text} /></p>
    {:else if block.kind === 'sentence'}
      <p class="subject"><InlineText text={block.text} /></p>
    {:else if block.kind === 'readings'}
      <div class="readings">
        {#each block.rows as row (row.bracketed)}
          <p class="bracketed">{row.bracketed}</p>
          <p class="means">{row.means}</p>
        {/each}
      </div>
    {:else if block.kind === 'diagram'}
      <figure class="figure">
        <SentenceGraph sentence={sentenceById(block.sentenceId)} />
        <figcaption>{block.caption}</figcaption>
      </figure>
    {:else if block.kind === 'rule'}
      <div class="rule">
        <p class="claim"><InlineText text={block.claim} /></p>
        <p class="prose"><InlineText text={block.text} /></p>
      </div>
    {:else if block.kind === 'credit'}
      <p class="prose"><InlineText text={block.text} /></p>
    {:else if block.kind === 'start'}
      <div class="start">
        <button type="button" onclick={() => onstart(block.sentenceId)}>
          Start with <span class="quoted">{sentenceById(block.sentenceId).text}</span>
        </button>
        <p class="prose"><InlineText text={block.text} /></p>
      </div>
    {/if}
  {/each}
</article>

<style>
  .lesson {
    --measure: 40rem;
    --figure: 55rem;

    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: clamp(56px, 9vh, 108px) clamp(20px, 6vw, 72px) clamp(96px, 18vh, 200px);
    color: var(--ink);
    font-family: var(--font-serif);
    text-wrap: pretty;
  }

  .lesson > :global(*) {
    width: 100%;
    max-width: var(--measure);
  }

  /* The demonstration is the widest thing on the page, and it comes first. */
  .lesson > :global(.hero) {
    max-width: var(--figure);
    margin: clamp(18px, 3vh, 32px) 0 clamp(20px, 3vh, 34px);
  }

  /* ------------------------------------------------------------- openings */

  .opening {
    margin-bottom: 8px;
  }

  .eyebrow {
    margin: 0 0 14px;
    color: var(--ink-faint);
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: clamp(29px, 4.4vw, 44px);
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.015em;
  }

  .lede {
    margin: 18px 0 0;
    color: var(--ink-muted);
    font-size: clamp(18px, 2.1vw, 21px);
    font-style: italic;
    line-height: 1.55;
  }

  .turn {
    margin: clamp(48px, 7vh, 76px) 0 0;
    padding-top: 26px;
    border-top: 1px solid var(--border);
  }

  h2 {
    margin: 0;
    font-size: clamp(23px, 3vw, 32px);
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  /* ---------------------------------------------------------------- prose */

  .prose {
    margin: 20px 0 0;
    font-size: 17px;
    line-height: 1.7;
  }

  /* The object of study. Set apart, because a sentence being analysed is never
     something the reader should skim as prose. */
  .subject {
    margin: 30px 0 6px;
    padding-left: 22px;
    border-left: 2px solid var(--border-strong);
    font-size: clamp(21px, 2.6vw, 26px);
    font-weight: 500;
    line-height: 1.45;
  }

  /* --------------------------------------------------------- two readings */

  .readings {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: baseline;
    margin-top: 26px;
    padding: 20px 22px;
    gap: 10px 20px;
    border-radius: var(--radius-md);
    background: var(--sunken);
  }

  .bracketed {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 13.5px;
    line-height: 1.5;
    white-space: nowrap;
  }

  .means {
    margin: 0;
    color: var(--ink-muted);
    font-family: var(--font-sans);
    font-size: 12.5px;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    /* One scroller for the pair, not one per row: the two bracketings are only
       legible against each other, so they have to move together. */
    .readings {
      grid-template-columns: max-content;
      gap: 2px 0;
      overflow-x: auto;
    }
    .bracketed {
      white-space: pre;
    }
    .means {
      margin-bottom: 12px;
    }
  }

  /* --------------------------------------------------------------- figure */

  .figure {
    --graph-h: clamp(230px, 32vh, 330px);

    max-width: var(--figure);
    margin: clamp(30px, 5vh, 46px) 0 0;
    padding: 8px 0 0;
    border-radius: var(--radius-lg);
    background: var(--artboard);
    border: 1px solid var(--border);
  }

  figcaption {
    margin: 0;
    padding: 12px 20px 16px;
    border-top: 1px solid var(--border);
    color: var(--ink-muted);
    font-family: var(--font-sans);
    font-size: 12px;
    line-height: 1.5;
  }

  /* ---------------------------------------------------------------- rules */

  .rule {
    margin-top: 26px;
  }

  .claim {
    margin: 0;
    font-size: 17px;
    font-weight: 650;
    line-height: 1.6;
  }

  .rule .prose {
    margin-top: 4px;
    color: var(--ink-muted);
  }

  /* ---------------------------------------------------------- first action */

  .start {
    margin-top: clamp(40px, 6vh, 60px);
    padding-top: 28px;
    border-top: 1px solid var(--border);
  }

  /* The one accented thing on the page: the action the learner came for. */
  button {
    display: inline-flex;
    align-items: baseline;
    gap: 7px;
    padding: 11px 18px;
    border: 0;
    border-radius: var(--radius-md);
    background: var(--accent);
    color: var(--accent-ink);
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background: color-mix(in oklab, var(--accent) 88%, var(--ink));
  }

  .quoted {
    font-family: var(--font-serif);
    font-size: 15px;
    font-style: italic;
    font-weight: 500;
  }

  .start .prose {
    margin-top: 14px;
    color: var(--ink-muted);
  }
</style>
