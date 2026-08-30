<script lang="ts">
  /**
   * Label a sentence: select words on the canvas, then name them from the
   * contextual palette beside the selection.
   *
   * This route owns selection and wiring. Every decision — what may be picked,
   * what a pick does to the structure, whether it was right — belongs to
   * `src/lib/grammar/`, which is browser-free and tested under `node --test`.
   */
  import Settings from '@lucide/svelte/icons/settings';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import Workspace from '$lib/workspace/Workspace.svelte';
  import ThemeToggle from '$lib/workspace/ThemeToggle.svelte';
  import type { RailItem } from '$lib/workspace/Rail.svelte';
  import { Workspace as WorkspaceState } from '$lib/workspace/workspace.svelte.ts';

  import Diagram, {
    diagramSize,
    selectionFocusRect,
    selectionRect,
    drawnRect,
    wordRowRect,
  } from '$lib/grammar/Diagram.svelte';
  import LabelPanel, { type Verdict } from '$lib/grammar/LabelPanel.svelte';
  import { GuidedPointer } from '$lib/workspace/guided-pointer.svelte.ts';
  import PointerLayer from '$lib/workspace/PointerLayer.svelte';
  import { emptyBuild, nodeOver } from '$lib/grammar/builder.ts';
  import { FIXTURES } from '$lib/grammar/fixtures.ts';
  import { answer, sessionChoices, type NavigationResult } from '$lib/grammar/session.ts';
  import { layout } from '$lib/grammar/layout.ts';
  import { nodesInMarquee } from '$lib/grammar/marquee-selection.ts';

  import { isPickable, type LabelOption, type Selection } from '$lib/grammar/options.ts';
  import { canonicalReading, contentSpan } from '$lib/grammar/types.ts';
  import { READABLE_ZOOM_FLOOR } from '$lib/grammar/node-label.ts';
  import type { Form, Span } from '$lib/grammar/types.ts';
  import type { Rect } from '$lib/workspace/viewport.ts';
  import { replayOptionKey, replaySentence } from '$lib/course/sentence-renderer.ts';
  import {
    COURSE_LESSONS,
    COURSE_STAGES,
    CourseContents,
    Lesson,
    LessonNav,
    LessonSentenceList,
    SentenceGraphs,
    lessonById,
    lessonNeighbours,
    lessonDoc,
    scopeThrough,
    targetReading,
  } from '$lib/course';
  import { Tutorial, buildSignature, tutorialScript } from '$lib/tutorial';
  import { tutorialLayout } from '$lib/tutorial/layout.ts';

  const ws = new WorkspaceState();
  // The workspace does not know what it is drawing. This is the one place that
  // does, so it is the place that says how small a diagram may be fitted to.
  ws.fitFloor = READABLE_ZOOM_FLOOR;

  /**
   * The course is the first thing in the rail, because it is the thing a reader
   * arrives for. The sentences it owns sit on the other side of the page, next
   * to the diagram they open.
   */
  const items: RailItem[] = [
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  let active = $state('lessons');

  /* ------------------------------------------------------------- the work */

  const routeLessonId = $derived(page.params.lessonId ?? '01-introduction');
  const lessonId = $derived(lessonById(routeLessonId).id);
  let middleView = $state<'lesson' | 'diagram'>('lesson');
  const lesson = $derived(lessonById(lessonId));
  const lessonSentences = $derived(lesson.sentences);
  const neighbours = $derived(lessonNeighbours(lessonId));
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
  /** The last decision's movement instruction; cleared when the selection moves. */
  let navigation = $state<NavigationResult | null>(null);
  /** Wrong choices are remembered for the exact target that disproved them. */
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
  /**
   * The answer is a view, not a mutation. A learner can inspect the finished
   * diagram and return to exactly the work they had before opening it.
   */
  let solved = $state(false);
  const solvedBuild = $derived(replaySentence(sentence).final);
  const visibleBuild = $derived(solved ? solvedBuild : build);
  const visibleDepth = $derived(
    solved ? layout(solvedBuild.constituents, words).maxDepth : depthMark,
  );
  const visibleSelection = $derived<Selection>(solved ? { kind: 'none' } : selection);

  const frame = $derived(diagramSize(visibleBuild.constituents, words, visibleDepth));
  const popupAnchor = $derived(selectionRect(build.constituents, words, selection, depthMark));
  const popupFocus = $derived(selectionFocusRect(build.constituents, words, selection, depthMark));
  const popupAvoid = $derived(drawnRect(build.constituents, words, depthMark));
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
    solved = false;
    build = emptyBuild();
    selection = { kind: 'none' };
    draft = null;
    preview = null;
    marqueeIds = [];
    clearFeedback();
    depthMark = 0;
    misses = {};
    rejected = {};
  }

  /** Swap what the canvas shows without replacing the learner's build. */
  async function showSolution(next: boolean) {
    if (solved === next) return;
    solved = next;
    closePalette();
    draft = null;
    marqueeIds = [];
    await tick();
    // The finished diagram must be visible as a whole, even when fitting it
    // requires going below the editing view's readability floor.
    ws.zoomToWhole(frame);
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

  /**
   * The lesson this SENTENCE belongs to, which is not always the lesson whose
   * page you are on. Opening a lesson-9 sentence from the lesson-1 page used to
   * hand over the whole palette, because the scope came from the route.
   */
  const owner = $derived(
    COURSE_LESSONS.find((l) => l.sentences.some((s) => s.id === sentence.id)) ?? null,
  );
  /** What this lesson requires. It limits the guided target and decides when a
      course question is complete; it does not lock the open builder. */
  const scope = $derived(owner ? scopeThrough(COURSE_LESSONS, owner.number) : undefined);
  /** The part of the answer this lesson actually asks for. */
  const target = $derived(scope ? targetReading(canonicalReading(sentence), scope) : null);
  /**
   * The builder is an exploration surface, not the course gate. Show every
   * valid label here so a learner can keep analysing a sentence after the
   * lesson's required work ends. `answer` still receives `scope` below, so
   * later labels never become requirements for completing an early lesson.
   */
  const choices = $derived(
    sessionChoices({ build, selection, verdict, misses, rejected, navigation }, sentence, words),
  );

  /**
   * The guided run for this sentence, or nothing where there is not one.
   *
   * Held to the introduction because that is the lesson whose runs have been
   * checked end to end — `src/lib/tutorial/script.test.ts` proves every
   * decision it names is a row the palette offers and will take. Widening this
   * is a one-line change once the same is proved of the rest.
   */
  const tutorialBeats = $derived(
    owner?.number === 1 ? tutorialScript(sentence, scope, target ?? undefined).beats : [],
  );
  const tutorialBuild = $derived(replaySentence(sentence, target ?? undefined).final);
  const tutorialNaturalDepth = $derived(layout(tutorialBuild.constituents, words).maxDepth);
  const tutorialDepth = $derived(tutorialNaturalDepth);
  const tutorialFrame = $derived(diagramSize(tutorialBuild.constituents, words, tutorialDepth));
  const tutorialFrameAnchor = $derived(
    wordRowRect(tutorialBuild.constituents, words, tutorialDepth),
  );
  let tutorialActive = $state(false);
  let tutorialPointer = $state<string | null>(null);
  /** The stage's one demonstration hand, shared by the run and the palette. */
  const guidedPointer = new GuidedPointer();
  let panelRef = $state<{ aimPointer: (key: string) => Promise<void> } | null>(null);

  /**
   * Where the thing the tutorial is about to click is actually rendered —
   * measured from the live DOM, so every camera move and layout change the
   * app performs is already accounted for by the time the pointer aims.
   */
  function tutorialPointTarget(sel: Selection): { x: number; y: number } | null {
    const boxes: DOMRect[] = [];
    if (sel.kind === 'span') {
      for (const el of document.querySelectorAll<HTMLElement>('.world [data-word]')) {
        const i = Number(el.dataset.word);
        if (i >= sel.span[0] && i <= sel.span[1]) boxes.push(el.getBoundingClientRect());
      }
    } else if (sel.kind === 'node') {
      const el = document.querySelector(`.world [data-node="${sel.id}"]`);
      if (el) boxes.push(el.getBoundingClientRect());
    }
    if (boxes.length === 0) return null;
    const left = Math.min(...boxes.map((b) => b.left));
    const right = Math.max(...boxes.map((b) => b.right));
    const top = Math.min(...boxes.map((b) => b.top));
    const bottom = Math.max(...boxes.map((b) => b.bottom));
    return { x: (left + right) / 2, y: (top + bottom) / 2 };
  }
  const tutorialMenu = $derived(tutorialLayout(ws.stage).menu);

  /** Reserve the finished tree before the first label lands. Without this the
      words move down one row at a time while the tutorial is trying to teach
      what appeared above them. */
  function resetForTutorial() {
    reset();
    depthMark = tutorialDepth;
  }

  /**
   * Feedback belongs to the decision that produced it.
   *
   * The verdict and the movement instruction are two halves of one result, so
   * a gesture that changes what is selected clears both or neither. Keeping
   * them in step by hand at every entry point is how a stale "stay here"
   * survives into the next selection and pins the palette to a question the
   * learner has moved on from.
   */
  function clearFeedback() {
    verdict = null;
    navigation = null;
  }

  /** Replay names an existing node when its next decision belongs to that
      node. Live word-row gestures remain spans so they can build underneath. */
  function selectAs(next: Selection) {
    clearFeedback();
    if (next.kind !== 'span') {
      selection = next;
      return;
    }
    const node = nodeOver(build, next.span);
    selection = node ? { kind: 'node', id: node } : next;
  }

  /** What the live palette says about one row, for the tutorial's postcondition. */
  function offeredRow(key: string) {
    const option = choices.groups.flatMap((g) => g.options).find((o) => o.key === key);
    return option
      ? { found: true, pickable: isPickable(option), state: option.state }
      : { found: false, pickable: false };
  }

  function pickByKey(key: string) {
    const hit = choices.groups.flatMap((g) => g.options).find((o) => o.key === key);
    if (!hit) return { ok: false, reason: `no option ${key}` };
    pick(hit);
    return { ok: true };
  }

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
      /** Which lesson owns the open sentence, and how much it has taught. */
      get ownerId() {
        return owner?.id ?? null;
      },
      get scopeSize() {
        return scope ? scope.size : null;
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
        clearFeedback();
        selection = { kind: 'span', span };
      },
      selectNode: (id: string) => {
        clearFeedback();
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
          // A stacked layer is made from the existing node. Every other form
          // begins at the word row; every non-form decision edits its node.
          kind: step.choice.stack ? 'stack' : step.kind,
          span: step.span,
          nodeId: step.choice.stack ? step.selectNodeId : step.nodeId,
          key: replayOptionKey(step.choice),
        })),
      reset,
    };
    return () => {
      delete w['__grammar'];
    };
  });

  /* --------------------------------------------------------------- events */

  function ondraft(span: Span | null, done: boolean) {
    if (solved) return;
    marqueeIds = [];
    const grammatical = span ? contentSpan(words, span) : null;
    draft = grammatical;
    if (!done) return;
    draft = null;
    clearFeedback();
    if (!grammatical) return;
    // The word row always means "build from these words." A node label means
    // "edit this exact node." Keeping those gestures distinct is what lets a
    // learner draw the outside first, then add structure beneath it.
    selection = { kind: 'span', span: grammatical };
  }

  function onmarquee(rect: Rect | null, done: boolean) {
    if (solved) return;
    if (!rect) {
      marqueeIds = [];
      if (done) selection = { kind: 'none' };
      return;
    }

    const hit = nodesInMarquee(build.constituents, words, rect, depthMark);
    marqueeIds = hit.ids;
    if (!done) return;

    marqueeIds = [];
    clearFeedback();
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
    clearFeedback();
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
    const next = answer(
      { build, selection, verdict, misses, rejected, navigation },
      sentence,
      words,
      o,
      scope,
    );
    build = next.build;
    selection = next.selection;
    verdict = next.verdict;
    misses = next.misses;
    rejected = next.rejected;
    navigation = next.navigation;
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
  onmarquee={middleView === 'diagram' && !solved ? onmarquee : undefined}
  tabs={['Sentences']}
  inspectorKind="navigation"
  inspectorTitle="Sentences"
  surface={middleView === 'diagram' ? 'canvas' : 'document'}
  documentKey={lessonId}
>
  {#snippet panel(section, closeDrawer)}
    {#if section === 'lessons'}
      <CourseContents
        stages={COURSE_STAGES}
        {lessonId}
        onselect={(id) => selectLesson(id, closeDrawer)}
      />
    {:else if section === 'settings'}
      <div class="settings-panel">
        <ThemeToggle />
      </div>
    {:else}
      <p class="empty">
        Nothing here yet — see <code>src/routes/+page.svelte</code>.
      </p>
    {/if}
  {/snippet}

  {#snippet inspector(closeDrawer)}
    <div class="inspector-stack">
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
      <div class="stack-end">
        <LessonNav
          prev={neighbours.prev}
          next={neighbours.next}
          onselect={(id) => selectLesson(id, closeDrawer)}
        />
      </div>
    </div>
  {/snippet}

  {#snippet overlay()}
    {#if middleView === 'diagram' && !tutorialActive}
      <div class="solution-toggle" role="group" aria-label="Diagram state" data-stage-occluder>
        <button
          type="button"
          class:active={!solved}
          aria-pressed={!solved}
          onclick={() => showSolution(false)}>Unsolved</button
        >
        <button
          type="button"
          class:active={solved}
          aria-pressed={solved}
          onclick={() => showSolution(true)}>Solved</button
        >
      </div>
    {/if}
    {#if middleView === 'diagram' && !solved && tutorialBeats.length > 0}
      <!-- Keyed on the sentence: a finished or stopped run belongs to the
           sentence it ran on, and must not greet the next one. -->
      {#key sentenceId}
        <Tutorial
          beats={tutorialBeats}
          frame={tutorialFrame}
          frameAnchor={tutorialFrameAnchor}
          anchorRect={() => wordRowRect(build.constituents, words, depthMark)}
          focusRect={(sel) => selectionFocusRect(build.constituents, words, sel, depthMark)}
          pointTarget={tutorialPointTarget}
          select={selectAs}
          offered={offeredRow}
          pick={pickByKey}
          signature={() => buildSignature(build.constituents)}
          onstart={resetForTutorial}
          onactive={(active) => (tutorialActive = active)}
          onpoint={(key) => (tutorialPointer = key)}
          pointer={guidedPointer}
          aimMenu={(key) => panelRef?.aimPointer(key) ?? Promise.resolve()}
          obscured={popupAnchor !== null}
        />
      {/key}
    {/if}
    {#if !solved}
      <LabelPanel
        bind:this={panelRef}
        panel={choices}
        {verdict}
        {navigation}
        anchor={popupAnchor}
        focus={popupFocus}
        fit={fitSelection}
        avoid={popupAvoid}
        placement={tutorialActive ? tutorialMenu : null}
        manageCamera={!tutorialActive}
        interactive={!tutorialActive}
        pointerOn={tutorialActive ? tutorialPointer : null}
        pointer={tutorialActive ? guidedPointer : null}
        onpick={pick}
        onhover={(o) => (preview = o?.form ?? null)}
        onclose={closePalette}
      />
    {/if}
    <PointerLayer pointer={guidedPointer} />
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
        constituents={visibleBuild.constituents}
        {marqueeIds}
        selection={visibleSelection}
        {draft}
        {preview}
        interactive={!solved}
        onpick={(s) => {
          if (solved) return;
          clearFeedback();
          selection = s;
        }}
        {ondraft}
      />
    </div>
  {/if}
</Workspace>

<style>
  /* The panel body scrolls, so the stack claims its full height and the nav
     takes what is left. Ten sentences never fill it, so the steps sit at the
     bottom; if a lesson ever ran long they would follow the list instead. */
  .inspector-stack {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-height: 100%;
    padding: 10px 16px 0;
  }
  .settings-panel {
    padding: 8px 4px;
  }
  .stack-end {
    margin-top: auto;
  }
  .lesson-return {
    display: grid;
    grid-template-columns: 2rem minmax(0, 1fr) 1.25rem;
    align-items: center;
    width: 100%;
    min-height: var(--panel-row-height);
    padding: 0 8px;
    border: 0;
    border-radius: var(--radius-sm);
    background: color-mix(in oklab, var(--accent) 10%, transparent);
    color: var(--ink);
    font: inherit;
    font-size: 11.5px;
    font-weight: 600;
    text-align: left;
  }
  .lesson-return:hover {
    background: color-mix(in oklab, var(--accent) 17%, transparent);
  }
  .lesson-return :global(svg) {
    justify-self: start;
    color: var(--accent);
  }
  .list-label {
    margin: 16px 8px 7px;
    color: var(--ink-faint);
    font-size: var(--panel-section-font-size);
    font-weight: var(--panel-section-font-weight);
    letter-spacing: var(--panel-section-letter-spacing);
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

  .solution-toggle {
    position: absolute;
    top: 8px;
    right: 44px;
    z-index: 46;
    display: flex;
    gap: 2px;
    padding: 3px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: color-mix(in oklab, var(--panel) 94%, transparent);
    box-shadow: 0 2px 10px oklch(0 0 0 / 18%);
    backdrop-filter: blur(10px);
  }
  .solution-toggle button {
    min-height: 28px;
    padding: 0 11px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--ink-muted);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }
  .solution-toggle button:hover {
    color: var(--ink);
  }
  .solution-toggle button.active {
    background: color-mix(in oklab, var(--accent) 16%, var(--panel));
    color: var(--accent);
  }

  @media (max-width: 700px) {
    .solution-toggle {
      top: max(60px, calc(env(safe-area-inset-top) + 60px));
      right: 8px;
    }
  }
</style>
