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
  import FormFunctionKey from './FormFunctionKey.svelte';
  import InlineText from './InlineText.svelte';
  import LessonHero from './LessonHero.svelte';
  import StaticFigure from './StaticFigure.svelte';
  import { comparisonFrameWidth } from './figure-scale.ts';
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

  /**
   * A page may draw a fixture or one of the course's own graded sentences —
   * both are audited, replayed and swept by the same machinery, and citing
   * the corpus directly keeps a lesson's figure from being a second copy of a
   * parse that already exists.
   */
  const sentenceById = (id: string) =>
    FIXTURES.find((sentence) => sentence.id === id) ??
    COURSE_LESSONS.flatMap((lesson) => lesson.sentences).find((sentence) => sentence.id === id)!;

  /**
   * A page may not show a label its reader has not met, so a diagram is pruned
   * to what the course has taught by the lesson it appears in. The pruning is
   * the same `targetReading` the practice scope uses, so the picture and the
   * question a learner is asked cannot drift apart. A block that previews an
   * untaught label says so in its `plus`, and the union is built here.
   */
  const readingFor = (
    id: string,
    through: number | undefined,
    plus?: readonly string[],
    readingId?: string,
  ) => {
    if (through === undefined) return undefined;
    const entry = sentenceById(id);
    const base =
      readingId === undefined
        ? canonicalReading(entry)
        : entry.readings.find((reading) => reading.id === readingId)!;
    return targetReading(
      base,
      new Set([...scopeThrough(COURSE_LESSONS, through), ...(plus ?? [])]),
    );
  };
  const number = $derived(String(lesson.number).padStart(2, '0'));

  /** How wide this sentence's finished diagram is, for sharing a scale. */
  const figureWidth = (
    id: string,
    through: number | undefined,
    plus?: readonly string[],
    readingId?: string,
  ): number => {
    const sentence = sentenceById(id);
    const build = replaySentence(sentence, readingFor(id, through, plus, readingId)).final;
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
        <table>
          <caption>Two possible groupings and what each one means</caption>
          <thead>
            <tr>
              <th scope="col">Grouping</th>
              <th scope="col">What it means</th>
            </tr>
          </thead>
          <tbody>
            {#each block.rows as row (row.bracketed)}
              <tr>
                <td class="bracketed">{row.bracketed}</td>
                <td class="means"><InlineText text={row.means} /></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else if block.kind === 'label-key'}
      <FormFunctionKey
        form={block.form}
        function={block.function}
        formText={block.formText}
        functionText={block.functionText}
        rows={block.rows}
        example={block.example}
      />
    {:else if block.kind === 'diagram'}
      <figure class="figure">
        <StaticFigure
          sentence={sentenceById(block.sentenceId)}
          reading={readingFor(block.sentenceId, block.through, block.plus, block.readingId)}
          focus={block.focus}
        />
        {#if block.caption}
          <figcaption><InlineText text={block.caption} /></figcaption>
        {/if}
      </figure>
    {:else if block.kind === 'contrast'}
      <figure class="contrast">
        <figcaption class="question"><InlineText text={block.question} /></figcaption>
        <!-- Similar-sized trees share a scale. A much shorter tree stops
             absorbing empty frame before its labels become too small. -->
        <div class="pair">
          {#each [block.left, block.right] as side (side.sentenceId + (side.readingId ?? ''))}
            {@const widths = [block.left, block.right].map((s) =>
              figureWidth(s.sentenceId, block.through, block.plus, s.readingId),
            )}
            {@const own = figureWidth(side.sentenceId, block.through, block.plus, side.readingId)}
            <div class="side">
              <StaticFigure
                sentence={sentenceById(side.sentenceId)}
                reading={readingFor(side.sentenceId, block.through, block.plus, side.readingId)}
                frameWidth={comparisonFrameWidth(own, widths)}
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
    --measure: 37rem;
    /* Give diagrams enough room to be read as the page's main evidence on a
       desktop. The viewport cap below still keeps them full-width on phones. */
    --figure: 66rem;
    --page-pad: clamp(20px, 6vw, 72px);
    --space-1: 8px;
    --space-2: 16px;
    --space-3: 24px;
    --space-4: 40px;
    --space-5: 64px;

    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: clamp(56px, 9vh, 108px) var(--page-pad) clamp(96px, 18vh, 200px);
    color: var(--ink);
    font-family: var(--font-sans);
    text-wrap: pretty;
  }

  .lesson > :global(*) {
    width: 100%;
    max-width: var(--measure);
  }

  /* A viewport takeover is exactly the child the reading measure must not
     reach: capped to the measure it left a strip of article uncovered. */
  .lesson > :global(.demo) {
    max-width: none;
  }

  /* The demonstration is the widest thing on the page, and it comes first. */
  .lesson > :global(.hero) {
    width: min(var(--figure), calc(100% + 2 * var(--page-pad)));
    max-width: var(--figure);
    /* The opening already supplies its lower margin, and the prose after the
       hero supplies its own upper margin. Keep one small gap on each side
       instead of stacking three margins around the animation. */
    margin: var(--space-1) 0 0;
  }

  /* A label key needs room for its two explanations, but no sentence row. */
  .lesson > :global(.form-function-key) {
    width: min(48rem, calc(100% + 2 * var(--page-pad)));
    max-width: 48rem;
  }

  /* ------------------------------------------------------------- openings */

  .opening {
    margin-bottom: var(--space-1);
  }

  .eyebrow {
    margin: 0 0 var(--space-2);
    color: var(--ink-faint);
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: clamp(28px, 3vw, 36px);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.03em;
  }

  .lede {
    margin: var(--space-2) 0 0;
    color: var(--ink-muted);
    font-size: clamp(17px, 1.9vw, 19px);
    line-height: 1.65;
  }

  .turn {
    margin: var(--space-4) 0 0;
    padding-top: var(--space-3);
    border-top: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
  }

  h2 {
    margin: 0;
    font-size: clamp(21px, 2.2vw, 26px);
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.025em;
  }

  /* ---------------------------------------------------------------- prose */

  .prose {
    margin: var(--space-2) 0 0;
    font-size: 17px;
    line-height: 1.6;
  }

  .bridge {
    margin: clamp(26px, 4vh, 38px) 0;
    color: var(--ink-muted);
    font-family: var(--font-sans);
    font-size: 15px;
    line-height: 1.55;
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
    font-family: var(--font-serif);
    font-size: clamp(21px, 2.6vw, 26px);
    font-weight: 500;
    line-height: 1.45;
  }

  /* --------------------------------------------------------- two readings */

  .readings {
    width: min(48rem, calc(100% + 2 * var(--page-pad)));
    max-width: 48rem;
    margin-top: 26px;
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: var(--sunken);
  }

  .readings table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    text-align: left;
  }

  .readings caption {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .readings th,
  .readings td {
    padding: 13px 16px;
    border-right: 1px solid var(--border);
    vertical-align: top;
  }

  .readings th:first-child,
  .readings td:first-child {
    width: 43%;
  }

  .readings th:last-child,
  .readings td:last-child {
    border-right: 0;
  }

  .readings th {
    color: var(--ink-faint);
    font-family: var(--font-sans);
    font-size: 11.5px;
    font-weight: 650;
    letter-spacing: 0.035em;
  }

  .readings tbody tr {
    border-top: 1px solid var(--border);
  }

  .bracketed {
    font-family: var(--font-mono);
    font-size: 13.5px;
    font-weight: 550;
    line-height: 1.55;
  }

  .means {
    color: var(--ink-muted);
    font-family: var(--font-sans);
    font-size: 13.5px;
    line-height: 1.55;
  }

  @media (max-width: 640px) {
    .readings th,
    .readings td {
      padding: 11px 12px;
    }

    .readings th {
      font-size: 10.5px;
    }

    .bracketed,
    .means {
      font-size: 12.5px;
    }
  }

  /* --------------------------------------------------------------- figure */

  .figure {
    --graph-h: clamp(280px, 40vh, 380px);

    width: min(var(--figure), calc(100% + 2 * var(--page-pad)));
    max-width: var(--figure);
    margin: var(--space-3) 0 0;
    padding: 0;
    border-radius: var(--radius-lg);
    background: transparent;
    border: 0;
  }

  figcaption {
    width: min(var(--measure), calc(100% - 2 * var(--space-3)));
    margin: 0 auto;
    padding: 4px 0 var(--space-2);
    color: color-mix(in oklab, var(--ink-muted) 72%, var(--ink));
    font-family: var(--font-sans);
    font-size: 13.5px;
    font-weight: 450;
    line-height: 1.5;
  }

  /* ------------------------------------------------------------- contrast */

  /* The pair is the argument, so it sits in one frame with one question over
     it. Two separate figures would let a reader take them one at a time, which
     is the reading that misses the point. */
  .contrast {
    --graph-h: clamp(280px, 38vh, 360px);

    width: min(var(--figure), calc(100% + 2 * var(--page-pad)));
    max-width: var(--figure);
    margin: var(--space-3) 0 0;
    border: 0;
    border-radius: var(--radius-lg);
    background: transparent;
  }

  .question {
    width: min(var(--measure), calc(100% - 2 * var(--space-3)));
    margin: 0 auto;
    padding: var(--space-1) 0;
    color: var(--ink);
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
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
    position: relative;
    padding-top: var(--space-1);
  }

  .side + .side::before {
    position: absolute;
    top: 0;
    left: 50%;
    width: min(var(--measure), calc(100% - 2 * var(--space-3)));
    border-top: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
    content: '';
    transform: translateX(-50%);
  }

  .side-caption {
    width: min(var(--measure), calc(100% - 2 * var(--space-3)));
    margin: 0 auto;
    padding: 4px 0 var(--space-2);
    color: color-mix(in oklab, var(--ink-muted) 72%, var(--ink));
    font-family: var(--font-sans);
    font-size: 13.5px;
    font-weight: 450;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .figure,
    .contrast {
      margin-top: var(--space-3);
    }

    /* The graph uses the full phone width. Keep its words aligned with the
       reading column so captions do not touch the screen edge. */
    .question,
    .side-caption,
    .figure figcaption {
      width: calc(100% - 2 * var(--page-pad));
      margin-inline: auto;
    }

    .question {
      padding-top: 16px;
      font-size: 16px;
    }

    .side + .side {
      padding-top: var(--space-1);
    }

    .side-caption {
      padding-bottom: var(--space-2);
    }

    .bridge {
      margin-block: 26px;
    }
  }

  /* ------------------------------------------------------------ procedure */

  .procedure {
    margin: var(--space-3) 0 0;
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background: var(--sunken);
    font-family: var(--font-sans);
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
    font-family: var(--font-sans);
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
