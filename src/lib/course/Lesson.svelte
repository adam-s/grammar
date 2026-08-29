<script lang="ts">
  /**
   * A lesson as an editorial page: a narrow reading column, figures allowed to
   * widen, and the diagram drawn by the same component the workspace uses.
   *
   * This file owns typography and nothing else. A lesson's words live in
   * `lesson-content.ts`, and its diagram is drawn by `Diagram.svelte`.
   */
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { diagramSize } from '../grammar/Diagram.svelte';
  import { FIXTURES } from '../grammar/fixtures.ts';
  import { canonicalReading } from '../grammar/types.ts';
  import InlineText from './InlineText.svelte';
  import LessonHero from './LessonHero.svelte';
  import StaticFigure from './StaticFigure.svelte';
  import { sharedFrameWidth } from './figure-scale.ts';
  import { COURSE_LESSONS } from './course.ts';
  import { replaySentence } from './sentence-renderer.ts';
  import { scopeThrough, targetReading } from './scope.ts';
  import type { LessonDoc } from './lesson-content.ts';
  import type { CourseLesson } from './types.ts';

  type Props = {
    lesson: CourseLesson;
    doc: LessonDoc;
    onstart: (sentenceId: string) => void;
  };
  let { lesson, doc, onstart }: Props = $props();

  const sentenceById = (id: string) => FIXTURES.find((sentence) => sentence.id === id)!;

  /**
   * A page may not show a label its reader has not met, so a diagram is pruned
   * to what the course has taught by the lesson it appears in. The pruning is
   * the same `targetReading` the practice scope uses, so the picture and the
   * question a learner is asked cannot drift apart.
   */
  const readingFor = (id: string, through: number | undefined) =>
    through === undefined
      ? undefined
      : targetReading(canonicalReading(sentenceById(id)), scopeThrough(COURSE_LESSONS, through));
  const number = $derived(String(lesson.number).padStart(2, '0'));

  /** How wide this sentence's finished diagram is, for sharing a scale. */
  const figureWidth = (id: string, through: number | undefined): number => {
    const sentence = sentenceById(id);
    const build = replaySentence(sentence, readingFor(id, through)).final;
    return diagramSize(build.constituents, sentence.words).w;
  };
</script>

<article class="lesson">
  <header class="opening">
    <p class="eyebrow">{number} · {lesson.stage}</p>
    <h1>{lesson.title}</h1>
    {#if doc.lede}
      <p class="lede"><InlineText text={doc.lede} /></p>
    {/if}
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
    {:else if block.kind === 'bridge'}
      <p class="bridge"><InlineText text={block.text} /></p>
    {:else if block.kind === 'sentence'}
      <p class="subject"><InlineText text={block.text} /></p>
    {:else if block.kind === 'readings'}
      <div class="readings">
        {#each block.rows as row (row.bracketed)}
          <p class="bracketed">{row.bracketed}</p>
          <p class="means"><InlineText text={row.means} /></p>
        {/each}
      </div>
    {:else if block.kind === 'diagram'}
      <figure class="figure">
        <StaticFigure
          sentence={sentenceById(block.sentenceId)}
          reading={readingFor(block.sentenceId, block.through)}
        />
        {#if block.caption}
          <figcaption><InlineText text={block.caption} /></figcaption>
        {/if}
      </figure>
    {:else if block.kind === 'contrast'}
      <figure class="contrast">
        <figcaption class="question"><InlineText text={block.question} /></figcaption>
        <!-- Both sides are drawn into the wider of the two boxes, so the
             shapes the reader is asked to compare share a scale. -->
        <div class="pair">
          {#each [block.left, block.right] as side (side.sentenceId)}
            {@const shared = sharedFrameWidth(
              [block.left, block.right].map((s) => figureWidth(s.sentenceId, block.through)),
            )}
            <div class="side">
              <StaticFigure
                sentence={sentenceById(side.sentenceId)}
                reading={readingFor(side.sentenceId, block.through)}
                frameWidth={shared}
              />
              <p class="side-caption"><InlineText text={side.caption} /></p>
            </div>
          {/each}
        </div>
      </figure>
    {:else if block.kind === 'procedure'}
      <div class="procedure">
        <p class="claim"><InlineText text={block.title} /></p>
        <ol>
          {#each block.steps as step (step)}
            <li><InlineText text={step} /></li>
          {/each}
        </ol>
        {#if block.limit}
          <p class="limit"><InlineText text={block.limit} /></p>
        {/if}
      </div>
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

  <div class="begin">
    <button class="cta" type="button" onclick={() => onstart(lesson.sentences[0]!.id)}>
      Start analyzing
      <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
    </button>
    <p class="under">Ten sentences from this lesson, one decision at a time.</p>
  </div>
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

  .bridge {
    margin: clamp(30px, 5vh, 48px) 0;
    color: var(--ink-muted);
    font-size: 17px;
    font-style: italic;
    line-height: 1.5;
    text-align: center;
  }

  .bridge + .figure {
    margin-top: 0;
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
    padding: 10px 0 0;
    border-radius: var(--radius-lg);
    background: transparent;
    border: 0;
  }

  figcaption {
    margin: 0 8px;
    padding: 4px 0 18px;
    color: var(--ink-muted);
    font-family: var(--font-serif);
    font-size: 14px;
    font-style: italic;
    line-height: 1.55;
  }

  /* ------------------------------------------------------------- contrast */

  /* The pair is the argument, so it sits in one frame with one question over
     it. Two separate figures would let a reader take them one at a time, which
     is the reading that misses the point. */
  .contrast {
    --graph-h: clamp(200px, 26vh, 270px);

    max-width: var(--figure);
    margin: clamp(30px, 5vh, 46px) 0 0;
    border: 0;
    border-radius: var(--radius-lg);
    background: transparent;
  }

  .question {
    margin: 0 22px;
    padding: 20px 0 8px;
    color: var(--ink);
    font-family: var(--font-serif);
    font-size: 17px;
    font-style: normal;
    font-weight: 600;
    line-height: 1.45;
  }

  /* Stacked, not side by side. Two 55rem columns put the fit at 59%, under the
     app's readable floor of 69%, and a diagram nobody can read is not evidence.
     Stacking also puts the two word rows directly above each other, which is
     what the reader is actually comparing. */
  .pair {
    display: grid;
    grid-template-columns: 1fr;
  }

  .side + .side {
    border-top: 1px solid var(--border);
    padding-top: 8px;
  }

  .side-caption {
    margin: 0 22px;
    padding: 2px 0 18px;
    color: var(--ink-muted);
    font-family: var(--font-serif);
    font-size: 14px;
    font-style: italic;
    line-height: 1.55;
  }

  @media (max-width: 640px) {
    .figure,
    .contrast {
      margin-top: 26px;
    }

    /* Once the frame disappears, its old inset has no edge to relate to.
       Align questions and captions with the reading column on a phone; the
       SVG keeps its own breathing room around the drawing. */
    .question,
    .side-caption,
    .figure figcaption {
      margin-inline: 0;
    }

    .question {
      padding-top: 16px;
      font-size: 16px;
    }

    .side + .side {
      padding-top: 6px;
    }

    .side-caption {
      padding-bottom: 16px;
    }

    .bridge {
      margin-block: 26px;
    }
  }

  /* ------------------------------------------------------------ procedure */

  .procedure {
    margin: 28px 0 0;
    padding: 20px 24px 22px;
    border-radius: var(--radius-md);
    background: var(--sunken);
  }

  .procedure ol {
    margin: 12px 0 0;
    padding-left: 20px;
    font-size: 16px;
    line-height: 1.65;
  }

  .procedure li {
    margin-top: 6px;
  }

  .procedure li::marker {
    color: var(--ink-faint);
    font-family: var(--font-sans);
    font-size: 13px;
  }

  .limit {
    margin: 16px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    color: var(--ink-muted);
    font-size: 14.5px;
    line-height: 1.6;
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

  /* ---------------------------------------------------------- the handoff */

  /* The page ends on the action, not on more reading. Centred and larger than
     any other control here, because it is the only thing to do next. */
  .begin {
    margin-top: clamp(48px, 8vh, 76px);
    padding-top: clamp(32px, 5vh, 44px);
    border-top: 1px solid var(--border);
    text-align: center;
  }
  .begin .cta {
    align-items: center;
    gap: 9px;
    padding: 15px 30px;
    font-size: 15px;
  }
  .begin .cta:hover {
    background: color-mix(in oklab, var(--accent) 88%, black);
  }
  .begin .under {
    margin: 14px 0 0;
    color: var(--ink-faint);
    font-family: var(--font-sans);
    font-size: 12px;
  }
</style>
