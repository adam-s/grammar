<script lang="ts">
  /**
   * Label a sentence: select words on the canvas, then name them from the
   * contextual palette beside the selection.
   *
   * This route owns selection and wiring. Every decision — what may be picked,
   * what a pick does to the structure, whether it was right — belongs to
   * `src/lib/grammar/`, which is browser-free and tested under `node --test`.
   */
  import Type from '@lucide/svelte/icons/type';
  import Tag from '@lucide/svelte/icons/tag';
  import Layers from '@lucide/svelte/icons/layers';
  import Settings from '@lucide/svelte/icons/settings';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import Workspace from '$lib/workspace/Workspace.svelte';
  import type { RailItem } from '$lib/workspace/Rail.svelte';
  import { Workspace as WorkspaceState } from '$lib/workspace/workspace.svelte.ts';

  import Diagram, {
    diagramSize,
    selectionFocusRect,
    selectionRect,
    wordRowRect,
  } from '$lib/grammar/Diagram.svelte';
  import LabelPanel, { type Verdict } from '$lib/grammar/LabelPanel.svelte';
  import { emptyBuild, nodeOver } from '$lib/grammar/builder.ts';
  import { FIXTURES } from '$lib/grammar/fixtures.ts';
  import { answer } from '$lib/grammar/session.ts';
  import {} from '$lib/grammar/grader.ts';
  import { layout } from '$lib/grammar/layout.ts';
  import { nodesInMarquee } from '$lib/grammar/marquee-selection.ts';
  import {} from '$lib/grammar/names.ts';

  import {
    blockRejectedOptions,
    optionsFor,
    type LabelOption,
    type Selection,
  } from '$lib/grammar/options.ts';
  import { canonicalReading } from '$lib/grammar/types.ts';
  import type { Form, Span } from '$lib/grammar/types.ts';
  import type { Rect } from '$lib/workspace/viewport.ts';
  import { replaySentence } from '$lib/course/sentence-renderer.ts';
  import {
    COURSE_LESSONS,
    COURSE_STAGES,
    CourseContents,
    Lesson,
    LessonSentenceList,
    SentenceGraphs,
    lessonById,
    lessonDoc,
    scopeThrough,
    targetReading,
    type FullScope,
  } from '$lib/course';

  const ws = new WorkspaceState();

  const items: RailItem[] = [
    { id: 'sentences', label: 'Sentences', icon: Type },
    { id: 'labels', label: 'Labels', icon: Tag },
    { id: 'layers', label: 'Layers', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  let active = $state('sentences');

  /* ------------------------------------------------------------- the work */

  const routeLessonId = $derived(page.params.lessonId ?? '01-introduction');
  const lessonId = $derived(lessonById(routeLessonId).id);
  let middleView = $state<'lesson' | 'diagram'>('lesson');
  const lesson = $derived(lessonById(lessonId));
  const lessonSentences = $derived(lesson.sentences);
  /** A lesson with authored prose reads as a document; one without still shows
      its finished diagrams, so an unwritten lesson is visibly unwritten. */
  const doc = $derived(lessonDoc(lessonId));
  /**
   * Every sentence the workspace can open: the lessons' own, plus the contract
   * fixtures, which stay reachable so the sweeps and the free workspace keep
   * working. Course sentences win a name clash, since a lesson's copy is the
   * one its scope was checked against.
   */
  const POOL = [...COURSE_LESSONS.flatMap((l) => l.sentences), ...FIXTURES];
  let sentenceId = $state<string | null>(null);
  /**
   * Falls back to the lesson's first sentence rather than trusting the id.
   * The id used to be a hardcoded fixture and the lookup ended in a bang, so
   * the page crashed outright the day lesson 1 stopped owning that fixture.
   */
  const sentence = $derived(
    POOL.find((s) => s.id === sentenceId) ?? lessonSentences[0] ?? FIXTURES[0]!,
  );
  const words = $derived(sentence.words);

  let build = $state(emptyBuild());
  let selection = $state<Selection>({ kind: 'none' });
  let draft = $state<Span | null>(null);
  let preview = $state<Form | null>(null);
  let marqueeIds = $state<string[]>([]);
  let verdict = $state<Verdict | null>(null);
  /** Wrong choices are disabled only for the exact word span that disproved them. */
  let rejected = $state<Record<string, Record<string, string>>>({});
  /**
   * Misses per span, so a first wrong answer does not hand over the right one.
   *
   * `gradeForm` names the truth in its reason — "«are» is not a number, it is a
   * verb" — and even its formal test is the test for the RIGHT answer, which
   * ends "then it is a verb". Both teach well when someone is stuck and undo the
   * exercise when they are guessing.
   *
   * So a first miss restates what was just claimed and lets the learner see it
   * does not fit: "Not a number. A number counts or orders: three, first."
   * Applying your own test and watching it fail is the skill. The truth arrives
   * on the second miss, when it has been earned.
   */
  let misses = $state<Record<string, number>>({});
  /** High-water mark: the picture grows as the tree deepens, and never shrinks
      back, so undoing one step does not re-flow everything the learner built. */
  let depthMark = $state(0);

  const frame = $derived(diagramSize(build.constituents, words, depthMark));
  const popupAnchor = $derived(selectionRect(build.constituents, words, selection, depthMark));
  const popupFocus = $derived(selectionFocusRect(build.constituents, words, selection, depthMark));
  const popupAvoid = $derived(wordRowRect(build.constituents, words, depthMark));
  const fitSelection = $derived.by(() => {
    const span =
      selection.kind === 'span'
        ? selection.span
        : selection.kind === 'node'
          ? build.constituents[selection.id]?.span
          : selection.kind === 'nodes'
            ? selection.span
            : null;
    return !!span && span[1] > span[0];
  });

  function reset() {
    build = emptyBuild();
    selection = { kind: 'none' };
    draft = null;
    preview = null;
    marqueeIds = [];
    verdict = null;
    depthMark = 0;
    misses = {};
    rejected = {};
  }

  $effect(() => {
    const nextSentenceId = sentenceId;
    const nextWords = sentence.words;
    const nextFrame = diagramSize(emptyBuild().constituents, nextWords, 0);
    let cancelled = false;

    reset();

    // A new sentence is a new document, so discard the previous camera
    // position and frame the newly rendered words from their own bounds.
    void tick().then(() => {
      if (cancelled || sentenceId !== nextSentenceId) return;
      ws.zoomToFit(nextFrame);
    });

    return () => {
      cancelled = true;
    };
  });

  /** The span a pick applies to, whichever way the selection was made. */
  const targetSpan = $derived.by<Span | null>(() => {
    if (selection.kind === 'span') return selection.span;
    if (selection.kind === 'node') return build.constituents[selection.id]?.span ?? null;
    if (selection.kind === 'nodes') return selection.span;
    return null;
  });
  const targetKey = $derived(targetSpan ? `${targetSpan[0]}-${targetSpan[1]}` : '');
  /**
   * The lesson this SENTENCE belongs to, which is not always the lesson whose
   * page you are on. Opening a lesson-9 sentence from the lesson-1 page used to
   * hand over the whole palette, because the scope came from the route.
   */
  const owner = $derived(
    COURSE_LESSONS.find((l) => l.sentences.some((s) => s.id === sentence.id)) ?? null,
  );
  /**
   * What that lesson has taught. The palette shows the whole inventory either
   * way — a learner who never sees a row does not learn the choice exists — but
   * a label from a later lesson is marked `untaught` rather than offered.
   *
   * A sentence outside the course carries no scope, so the free workspace and
   * the contract fixtures keep the full palette.
   */
  const scope = $derived(owner ? scopeThrough(COURSE_LESSONS, owner.number) : {});
  /** The part of the answer this lesson actually asks for. */
  const target = $derived(
    owner ? targetReading(canonicalReading(sentence), scope as FullScope) : null,
  );
  const choices = $derived(
    blockRejectedOptions(optionsFor(build, words, selection, scope), rejected[targetKey] ?? {}),
  );

  /**
   * Handle for `scripts/snapshot.mjs` to drive this page.
   *
   * It exposes the SAME functions the interface calls — `pick` is the one a
   * click runs, `choices` is what the palette is showing — so a sweep exercises
   * the real path rather than a parallel one written for testing.
   *
   * `plan()` is different in kind from the rest: it reads the stored answer and
   * hands back every decision in order. Nothing a person could do with a
   * pointer, and it is the thing the course promises not to do. It ships in no
   * build.
   */
  $effect(() => {
    // Development only. `plan()` below returns the answer, in order, as option
    // keys — a solution API, whatever the comment above calls it. A browser
    // global has no boundary a comment can give it, so the boundary is the
    // build: `import.meta.env.DEV` is true under `npm run dev`, which is what
    // the sweep drives, and false in everything shipped.
    if (!import.meta.env.DEV) return;
    const w = window as unknown as Record<string, unknown>;
    w['__grammar'] = {
      get sentenceId() {
        return sentenceId;
      },
      get lessonId() {
        return lessonId;
      },
      get view() {
        return middleView;
      },
      sentenceIds: POOL.map((s) => s.id),
      get words() {
        return words.map((x) => x.text);
      },
      get selection() {
        return selection;
      },
      get build() {
        return { constituents: build.constituents, seq: build.seq };
      },
      get panel() {
        return choices;
      },
      get verdict() {
        return verdict;
      },
      openSentence: (id: string) => openSentence(id),
      selectSpan: (span: Span) => {
        verdict = null;
        const node = nodeOver(build, span);
        selection = node ? { kind: 'node', id: node } : { kind: 'span', span };
      },
      selectNode: (id: string) => {
        verdict = null;
        selection = { kind: 'node', id };
      },
      /** Click an option by key, through the same handler the palette uses. */
      pick: (key: string) => {
        const hit = choices.groups.flatMap((g) => g.options).find((o) => o.key === key);
        if (!hit) return { ok: false, reason: `no option ${key}` };
        pick(hit);
        return { ok: true };
      },
      /**
       * The ordered decisions that build this sentence, as selections and
       * option keys. It comes from the answer, which is exactly why it is only
       * a driver hook: nothing in the interface may read it.
       */
      plan: () =>
        // The lesson's target, not the whole answer: under a lesson's scope the
        // rest of the parse is not merely unasked-for, it is unbuildable, and a
        // driver told to build it reports failures that are the point.
        replaySentence(sentence, target ?? undefined).steps.map((step) => ({
          kind: step.kind,
          span: step.span,
          nodeId: step.nodeId,
          key:
            step.choice.anchor !== undefined
              ? `anchor:${step.choice.anchorForm}:${step.choice.anchor[0]}-${step.choice.anchor[1]}`
              : step.choice.fusedWith !== undefined
                ? `func:head+${step.choice.fusedWith}`
                : step.choice.gap && step.choice.func !== undefined
                  ? `gap:${step.choice.func}:${step.choice.form}`
                  : step.choice.form !== undefined
                    ? `${step.choice.stack ? 'stack' : 'form'}:${step.choice.form}`
                    : step.choice.func !== undefined
                      ? // The required S V A adverbial is a distinct row, because it is
                        // a distinct claim about the verb.
                        step.choice.func === 'adverbial' && step.choice.obligatory
                        ? 'func:obligatoryAdverbial'
                        : `func:${step.choice.func}`
                      : step.choice.voice !== undefined
                        ? `voice:${step.choice.voice}`
                        : step.choice.partKind !== undefined
                          ? `part:${step.choice.partKind}`
                          : step.choice.auxKind !== undefined
                            ? `aux:${step.choice.auxKind}`
                            : step.choice.finiteness !== undefined
                              ? `fin:${step.choice.finiteness}`
                              : step.choice.clauseKind !== undefined
                                ? `kind:${step.choice.clauseKind}`
                                : `vt:${step.choice.verbType}`,
        })),
      reset,
    };
    return () => {
      delete w['__grammar'];
    };
  });

  /* --------------------------------------------------------------- events */

  function ondraft(span: Span | null, done: boolean) {
    marqueeIds = [];
    draft = span;
    if (!done) return;
    draft = null;
    verdict = null;
    if (!span) return;
    // Words that already carry a node select the NODE, so the same gesture
    // moves the learner from "what is it?" to "what does it do?" without a mode
    // change — the panel simply gains a group.
    const id = nodeOver(build, span);
    selection = id ? { kind: 'node', id } : { kind: 'span', span };
  }

  function onmarquee(rect: Rect | null, done: boolean) {
    if (!rect) {
      marqueeIds = [];
      if (done) selection = { kind: 'none' };
      return;
    }

    const hit = nodesInMarquee(build.constituents, words, rect, depthMark);
    marqueeIds = hit.ids;
    if (!done) return;

    marqueeIds = [];
    verdict = null;
    preview = null;
    selection =
      hit.ids.length === 0 && hit.span
        ? { kind: 'span', span: hit.span }
        : hit.ids.length === 1 &&
            hit.span &&
            build.constituents[hit.ids[0]!]?.span[0] === hit.span[0] &&
            build.constituents[hit.ids[0]!]?.span[1] === hit.span[1]
          ? { kind: 'node', id: hit.ids[0]! }
          : hit.span
            ? { kind: 'nodes', ids: hit.ids, span: hit.span }
            : { kind: 'none' };
  }

  function grew() {
    depthMark = Math.max(depthMark, layout(build.constituents, words).maxDepth);
  }

  function closePalette() {
    selection = { kind: 'none' };
    preview = null;
    verdict = null;
  }

  let previousRouteLessonId = $state('');
  $effect(() => {
    if (routeLessonId === previousRouteLessonId) return;
    previousRouteLessonId = routeLessonId;
    middleView = 'lesson';
    closePalette();
  });

  function selectLesson(id: string, closeDrawer?: () => void) {
    middleView = 'lesson';
    closePalette();
    closeDrawer?.();
    if (id !== lessonId) {
      void goto(resolve('/lessons/[lessonId]', { lessonId: id }), {
        noScroll: true,
        keepFocus: true,
      });
    }
  }

  function openSentence(id: string, closeDrawer?: () => void) {
    sentenceId = id;
    middleView = 'diagram';
    closeDrawer?.();
  }

  /**
   * One decision, handled by `session.ts`.
   *
   * Grading, the miss ladder, refusals and where the selection lands are the
   * same transaction whatever kind of question was asked, and they are testable
   * only outside a component — so they live there and this is the glue.
   */
  function pick(o: LabelOption) {
    const before = build;
    const next = answer({ build, selection, verdict, misses, rejected }, sentence, words, o);
    build = next.build;
    selection = next.selection;
    verdict = next.verdict;
    misses = next.misses;
    rejected = next.rejected;
    if (next.build !== before) grew();
    if (next.selection.kind === 'none') preview = null;
  }
</script>

<svelte:head>
  <title>{lesson.title} · Grammar</title>
</svelte:head>

<Workspace
  {items}
  {ws}
  bind:active
  content={middleView === 'diagram' ? frame : undefined}
  onmarquee={middleView === 'diagram' ? onmarquee : undefined}
  tabs={['Course']}
  inspectorKind="navigation"
  inspectorTitle="Lessons"
  surface={middleView === 'diagram' ? 'canvas' : 'document'}
>
  {#snippet panel(section, closeDrawer)}
    {#if section === 'sentences'}
      <button
        class="lesson-return"
        type="button"
        onclick={() => selectLesson(lessonId, closeDrawer)}
      >
        <BookOpen size={14} strokeWidth={1.8} />
        {lesson.title}
      </button>
      <p class="list-label">Practice sentences</p>
      <LessonSentenceList
        sentences={lessonSentences}
        selectedId={middleView === 'diagram' ? sentenceId : null}
        onselect={(id) => openSentence(id, closeDrawer)}
        onreset={reset}
      />
    {:else}
      <p class="empty">
        Nothing here yet — see <code>src/routes/+page.svelte</code>.
      </p>
    {/if}
  {/snippet}

  {#snippet inspector(closeDrawer)}
    <CourseContents
      stages={COURSE_STAGES}
      {lessonId}
      onselect={(id) => selectLesson(id, closeDrawer)}
    />
  {/snippet}

  {#snippet overlay()}
    <LabelPanel
      panel={choices}
      {verdict}
      anchor={popupAnchor}
      focus={popupFocus}
      fit={fitSelection}
      avoid={popupAvoid}
      onpick={pick}
      onhover={(o) => (preview = o?.form ?? null)}
      onclose={closePalette}
    />
  {/snippet}

  {#if middleView === 'lesson'}
    {#if doc}
      <Lesson {lesson} {doc} onstart={(id) => openSentence(id)} />
    {:else}
      <SentenceGraphs sentences={lessonSentences} />
    {/if}
  {:else}
    <div class="board" style="left:0; top:0; width:{frame.w}px; height:{frame.h}px">
      <Diagram
        {words}
        constituents={build.constituents}
        {marqueeIds}
        {selection}
        {draft}
        {preview}
        onpick={(s) => {
          verdict = null;
          selection = s;
        }}
        {ondraft}
      />
    </div>
  {/if}
</Workspace>

<style>
  .lesson-return {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 38px;
    gap: 8px;
    padding: 0 8px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--accent);
    font: inherit;
    font-size: 11.5px;
    font-weight: 600;
    text-align: left;
  }
  .lesson-return:hover {
    background: color-mix(in oklab, var(--accent) 10%, transparent);
  }
  .list-label {
    margin: 16px 8px 6px;
    color: var(--ink-faint);
    font-size: 9.5px;
    font-weight: 650;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .empty {
    margin: 8px;
    font-size: 11px;
    color: var(--ink-faint);
    line-height: 1.5;
  }
  code {
    font-family: var(--font-mono);
    font-size: 10px;
  }

  .board {
    position: absolute;
    background: transparent;
    pointer-events: none;
  }
</style>
