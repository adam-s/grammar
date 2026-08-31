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
  import Undo2 from '@lucide/svelte/icons/undo-2';
  import GraduationCap from '@lucide/svelte/icons/graduation-cap';
  import { tick, untrack } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
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
  import LabelPanel, { type PanelHandle } from '$lib/grammar/LabelPanel.svelte';
  import {
    measureNodesRect,
    measureSelectionPoint,
    measureWordPoint,
  } from '$lib/grammar/measure.ts';
  import { GuidedPointer } from '$lib/workspace/guided-pointer.svelte.ts';
  import PointerLayer from '$lib/workspace/PointerLayer.svelte';
  import { DRAG_QUERY, useMediaQuery } from '$lib/workspace/responsive.svelte.ts';
  import type { SelectionGestureHooks } from '$lib/workspace/selection-gesture.ts';
  import { emptyBuild, nodeOver, type BuildState } from '$lib/grammar/builder.ts';
  import { FIXTURES } from '$lib/grammar/fixtures.ts';
  import {
    answer,
    applyAction,
    emptySession,
    sessionChoices,
    type Session,
  } from '$lib/grammar/session.ts';
  import { layout } from '$lib/grammar/layout.ts';
  import { nodesInMarquee } from '$lib/grammar/marquee-selection.ts';

  import {
    isPickable,
    type LabelOption,
    type PanelAction,
    type Selection,
  } from '$lib/grammar/options.ts';
  import { canonicalReading, contentSpan } from '$lib/grammar/types.ts';
  import { READABLE_ZOOM_FLOOR } from '$lib/grammar/node-label.ts';
  import type { Form, Span } from '$lib/grammar/types.ts';
  import { rectToWorld, type Rect } from '$lib/workspace/viewport.ts';
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
    launchPosture,
    lessonDoc,
    scopeThrough,
    targetReading,
  } from '$lib/course';
  import { Tutorial, buildSignature, tutorialScript, type TutorialHost } from '$lib/tutorial';
  import {
    decodeCompletion,
    decodeSnapshot,
    earnsCompletion,
    encodeCompletion,
    encodeSnapshot,
  } from '$lib/learner/record.ts';
  import {
    clearRecord,
    completionKey,
    exportRecord,
    readKey,
    removeKey,
    snapshotKey,
    traceKey,
    writeKey,
  } from '$lib/learner/store.ts';
  import {
    appendEntry,
    decodeTrace,
    emptyTrace,
    encodeTrace,
    fingerprint,
    undoDepthOf,
    undoTarget,
    type Trace,
    type TraceMoment,
  } from '$lib/learner/trace.ts';
  import { version } from '$app/environment';

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

  /**
   * The learner's own session: build, selection, verdict, misses, refusals,
   * navigation — one object, because `answer` and `applyAction` take and
   * return exactly this shape, and because the guided run needs to set it
   * aside WHOLE. (Its `misses` climb a ladder on purpose: a first wrong
   * answer restates the claim so the learner can watch their own test fail;
   * the truth arrives on the second miss, when it has been earned.)
   */
  let session = $state<Session>(emptySession());
  /**
   * The demonstration's scratch session, or null when no run is on stage.
   * The run performs into THIS; the learner's session is never touched by a
   * run — not reset at its start, not left holding its tree at its end.
   * Stop or finish discards the scratch, and the learner's work is simply
   * shown again, exactly as they left it.
   */
  let demo = $state<Session | null>(null);
  /** What the canvas and palette work on: the run's scratch while a run is
      on stage, the learner's session otherwise. */
  const shown = $derived(demo ?? session);
  let draft = $state<Span | null>(null);
  let preview = $state<Form | null>(null);
  let marqueeIds = $state<string[]>([]);
  /** High-water mark: the picture grows as the tree deepens, and never shrinks
      back, so undoing one step does not re-flow everything the learner built.
      One per session, so a tall demonstration never inflates the learner's. */
  let depthMark = $state(0);
  let demoDepth = $state(0);
  const markDepth = $derived(demo ? demoDepth : depthMark);
  /**
   * Sentences finished, ever — the durable half of the learner record. Ids go
   * in only through `earnsCompletion`'s grade of the learner's own build, and
   * starting a sentence over does not take one out: finishing once is history,
   * like a miss. On the server the store reads empty and this stays empty.
   */
  const completed = new SvelteSet(decodeCompletion(readKey(completionKey())));
  /** A lesson is done when every one of its sentences is. */
  const completedLessons = $derived(
    COURSE_LESSONS.filter(
      (l) => l.sentences.length > 0 && l.sentences.every((s) => completed.has(s.id)),
    ).map((l) => l.id),
  );
  /**
   * The answer is a view, not a mutation. A learner can inspect the finished
   * diagram and return to exactly the work they had before opening it.
   */
  let solved = $state(false);
  const solvedBuild = $derived(replaySentence(sentence).final);
  const visibleBuild = $derived(solved ? solvedBuild : shown.build);
  const visibleDepth = $derived(
    solved ? layout(solvedBuild.constituents, words).maxDepth : markDepth,
  );
  const visibleSelection = $derived<Selection>(solved ? { kind: 'none' } : shown.selection);

  const frame = $derived(diagramSize(visibleBuild.constituents, words, visibleDepth));
  const popupAnchor = $derived(
    selectionRect(shown.build.constituents, words, shown.selection, markDepth),
  );
  const popupFocus = $derived(
    selectionFocusRect(shown.build.constituents, words, shown.selection, markDepth),
  );
  const popupAvoid = $derived(drawnRect(shown.build.constituents, words, markDepth));
  const fitSelection = $derived.by(() => {
    const sel = shown.selection;
    const span =
      sel.kind === 'span'
        ? sel.span
        : sel.kind === 'node'
          ? shown.build.constituents[sel.id]?.span
          : sel.kind === 'nodes'
            ? sel.span
            : null;
    return !!span && span[1] > span[0];
  });

  /** Route a session change to whichever session is on stage. */
  function updateShown(fn: (s: Session) => Session) {
    // A run must never fall through to the learner's session. This guard is
    // the last line of defence if another action ever discards the scratch
    // before the tutorial has stopped.
    if (tutorialActive && !demo) return;
    if (demo) demo = fn(demo);
    else session = fn(session);
  }

  function reset() {
    solved = false;
    session = emptySession();
    demo = null;
    demoDepth = 0;
    draft = null;
    preview = null;
    marqueeIds = [];
    depthMark = 0;
  }

  /** Swap what the canvas shows without replacing the learner's build. */
  async function showSolution(next: boolean) {
    if (solved === next) return;
    solved = next;
    traceAppend({ kind: 'solution', shown: next });
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
    let cancelled = false;

    reset();

    // Unfinished work comes back before the first paint the learner can act
    // on. `decodeSnapshot` refuses whole on any doubt — another schema
    // version, edited words, a build that fails its own checks — and null
    // simply means the fresh start `reset()` already made. The whole restore
    // is untracked: it WRITES the session state this effect must not depend
    // on, and re-earning completion reads state of its own.
    const restored = decodeSnapshot(readKey(snapshotKey(sentence.id)), nextWords);
    const restoredDepth = restored ? layout(restored.build.constituents, nextWords).maxDepth : 0;
    // The restore and the trace's opening checkpoint run UNTRACKED: this
    // block writes session state and appends to the trace, and the only
    // dependencies this effect may have are the sentence itself — anything
    // read in here (completion checks, the palette's own grading) is state
    // of its own that must not re-run the reset.
    untrack(() => {
      // The trace changes sentence with the page, and its opening entry is
      // a CHECKPOINT embedding whatever the restore produced — the one
      // state a replay could never reach by walking from empty. It must
      // exist before anything can append (re-earned completion appends).
      trace =
        decodeTrace(readKey(traceKey(sentence.id)), nextWords) ??
        emptyTrace(sentence.id, nextWords, version);
      const opened = restored ?? emptySession();
      traceAppend({
        kind: 'open',
        build: opened.build,
        misses: opened.misses,
        rejected: opened.rejected,
        fp: fingerprint(opened.build),
      });
      if (restored) {
        session = restored;
        depthMark = restoredDepth;
        // Completion is re-earned from the restored build, not read back
        // from a flag — the stored set only ever grows through a real grade.
        recordCompletion(restored.build);
      }
    });
    const nextFrame = diagramSize(
      restored?.build.constituents ?? emptyBuild().constituents,
      nextWords,
      restoredDepth,
    );

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
   * What the empty canvas says first. The introduction is the one lesson
   * where watching is the way in and earns the full invitation; everywhere
   * else the launcher is a quiet toolbar control and "Start here" points at
   * the words — see `launchPosture` for the table.
   */
  const posture = $derived(
    launchPosture({
      introduction: owner?.number === 1,
      canvasEmpty: Object.keys(session.build.constituents).length === 0,
    }),
  );
  /**
   * The builder is an exploration surface, not the course gate. Show every
   * valid label here so a learner can keep analysing a sentence after the
   * lesson's required work ends. `answer` still receives `scope` below, so
   * later labels never become requirements for completing an early lesson.
   */
  const choices = $derived(sessionChoices(shown, sentence, words));

  /**
   * The guided run for this sentence, or nothing where there is not one.
   *
   * Every course sentence has one: `src/lib/tutorial/script.test.ts` walks
   * all 40 lessons' runs through the real transaction and proves every
   * decision is a row the palette offers, takes, and records. A sentence
   * without a course owner has no lesson scope to run under, so it has no
   * run.
   */
  const tutorialBeats = $derived(
    owner ? tutorialScript(sentence, scope, target ?? undefined).beats : [],
  );
  const tutorialBuild = $derived(replaySentence(sentence, target ?? undefined).final);
  const tutorialDepth = $derived(layout(tutorialBuild.constituents, words).maxDepth);
  const tutorialFrame = $derived(diagramSize(tutorialBuild.constituents, words, tutorialDepth));
  const tutorialFrameAnchor = $derived(
    wordRowRect(tutorialBuild.constituents, words, tutorialDepth),
  );
  let tutorialActive = $state(false);
  let tutorialPointer = $state<string | null>(null);
  /** The palette's guided home, computed and reported by the run itself. */
  let tutorialMenu = $state<Rect | null>(null);
  /** The stage's one demonstration hand, shared by the run and the palette. */
  const guidedPointer = new GuidedPointer();
  /** A pointer capability, not a viewport width — see DRAG_QUERY. */
  const dragCapable = useMediaQuery(DRAG_QUERY);

  /**
   * The tutorial's selection gestures, wired to the SAME handlers the real
   * pointer drives: `ondraft` grows the word highlight and commits the span;
   * `onmarquee` lights the swept labels and commits the group. What the
   * learner watches is the app's own interaction, performed for them.
   * Measurements scope to the canvas's own world element (`ws.world`) and
   * go through the shared `measure.ts` helpers, so the page knows nothing
   * about the diagram's markup.
   */
  const stageClientBox = () => guidedPointer.layer?.getBoundingClientRect() ?? null;
  /**
   * A real pointerdown anywhere outside the palette dismisses it — the
   * palette listens to the window. A driven gesture makes no real
   * pointerdown, so its press must dismiss the palette itself, or the last
   * answer's popup floats over the sweep it should have yielded to.
   */
  function dismissForGesture() {
    if (shown.selection.kind !== 'none' || shown.verdict) closePalette();
  }
  const tutorialGestures: SelectionGestureHooks = {
    wordPoint: (i) => (ws.world ? measureWordPoint(ws.world, i) : null),
    nodesRect: (ids) => (ws.world ? measureNodesRect(ws.world, ids) : null),
    draft: (span, done) => {
      if (!done) dismissForGesture();
      ondraft(span, done);
    },
    marqueeClient: (rect, done) => {
      if (!done) dismissForGesture();
      const stage = stageClientBox();
      const local =
        rect && stage
          ? { x: rect.x - stage.left, y: rect.y - stage.top, w: rect.w, h: rect.h }
          : null;
      // The demonstration's visible box, drawn by the canvas through the
      // same element as a real drag.
      ws.drivenMarquee = local && !done ? local : null;
      // The committing rect converts through the SAME arithmetic as a real
      // marquee: stage coordinates through `rectToWorld`.
      onmarquee(local ? rectToWorld(ws.viewport, local) : null, done);
    },
  };

  /**
   * A halted run must leave no half-drawn gesture behind — and no half-asked
   * question either. The selection and its menu were the demonstration's
   * hand at work, not the learner's; when the demonstration leaves the
   * stage, they leave with it. The built diagram stays: that progress is
   * real.
   */
  function cancelTutorialGesture() {
    ws.drivenMarquee = null;
    draft = null;
    marqueeIds = [];
    closePalette();
  }
  let panelRef = $state<PanelHandle | null>(null);
  /**
   * Outside the introduction the launcher is a toolbar control, so it lives
   * in the page's own control row — grouped with Back and the view toggle —
   * and drives the run through the component's bound `play()`. The
   * introduction keeps the component's centre-stage invitation.
   */
  let tutorialRef = $state<{ play: () => Promise<void> } | null>(null);
  let runStatus = $state<'idle' | 'running' | 'done' | 'stopped' | 'failed'>('idle');
  const dockedLaunch = $derived(posture.tone === 'quiet' && tutorialBeats.length > 0);

  /**
   * The run performs in its own scratch session; the learner's work is set
   * aside untouched, and comes back the moment the demonstration leaves the
   * stage — stopped or finished, no difference. `demoDepth` reserves the
   * finished tree's rows up front, or the words would move down one row at a
   * time while the run is teaching what appeared above them; being the
   * scratch's own mark, it dies with the scratch instead of inflating the
   * learner's layout.
   */
  let demoOutcome: 'finished' | 'stopped' = 'stopped';
  function startDemo() {
    demo = emptySession();
    demoDepth = tutorialDepth;
    demoOutcome = 'stopped';
    traceAppend({ kind: 'runStart' });
  }
  function endDemo() {
    if (!demo) return;
    demo = null;
    demoDepth = 0;
    traceAppend({ kind: 'runEnd', outcome: demoOutcome });
    // The learner's own work is back on stage; frame it where they left it.
    void tick().then(() => ws.zoomToFit(frame));
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
    updateShown((s) =>
      s.verdict === null && s.navigation === null ? s : { ...s, verdict: null, navigation: null },
    );
  }

  /** Move the on-stage selection, clearing the feedback that belonged to
      the previous one — both halves of one gesture, whoever's hand it is. */
  function selectShown(next: Selection) {
    updateShown((s) => ({ ...s, selection: next, verdict: null, navigation: null }));
  }

  /** Replay names an existing node when its next decision belongs to that
      node. Live word-row gestures remain spans so they can build underneath. */
  function selectAs(next: Selection) {
    if (next.kind !== 'span') {
      selectShown(next);
      return;
    }
    const node = nodeOver(shown.build, next.span);
    selectShown(node ? { kind: 'node', id: node } : next);
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
   * Everything the guided run needs from this page, in one object. Each
   * member reads live state at call time, so the object itself is built
   * once. `canDrag` is a getter because the media query answers after
   * mount.
   */
  const tutorialHost: TutorialHost = {
    anchorRect: () => wordRowRect(shown.build.constituents, words, markDepth),
    focusRect: (sel) => selectionFocusRect(shown.build.constituents, words, sel, markDepth),
    pointTarget: (sel) => (ws.world ? measureSelectionPoint(ws.world, sel) : null),
    select: selectAs,
    selected: () => shown.selection,
    offered: offeredRow,
    pick: pickByKey,
    signature: () => buildSignature(shown.build.constituents),
    gestures: tutorialGestures,
    get canDrag() {
      return dragCapable.matches;
    },
    aimMenu: (key) => panelRef?.aimPointer(key) ?? Promise.resolve(),
    cancelGesture: cancelTutorialGesture,
  };

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
        return shown.selection;
      },
      get build() {
        return { constituents: shown.build.constituents, seq: shown.build.seq };
      },
      get panel() {
        return choices;
      },
      get verdict() {
        return shown.verdict;
      },
      /** Sentence ids finished so far, for the learner-record sweep. */
      get completed() {
        return [...completed];
      },
      get misses() {
        return shown.misses;
      },
      get rejected() {
        return shown.rejected;
      },
      openSentence: (id: string) => openSentence(id),
      selectSpan: (span: Span) => selectShown({ kind: 'span', span }),
      selectNode: (id: string) => selectShown({ kind: 'node', id }),
      /** Click an option by key, through the same handler the palette uses. */
      pick: pickByKey,
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
      // The driver's reset is a real state change; the trace records it like
      // any other fresh start, or a sweep's trace would silently stop
      // replaying at the point the driver wiped the canvas.
      reset: () => {
        traceAppend({ kind: 'startOver' });
        reset();
      },
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
    selectShown({ kind: 'span', span: grammatical });
    traceSelect(shown.selection);
  }

  function onmarquee(rect: Rect | null, done: boolean) {
    if (solved) return;
    if (!rect) {
      marqueeIds = [];
      if (done) selectShown({ kind: 'none' });
      return;
    }

    const hit = nodesInMarquee(shown.build.constituents, words, rect, markDepth);
    marqueeIds = hit.ids;
    if (!done) return;

    marqueeIds = [];
    preview = null;
    selectShown(
      hit.ids.length === 0 && hit.span
        ? { kind: 'span', span: hit.span }
        : hit.ids.length === 1 &&
            hit.span &&
            shown.build.constituents[hit.ids[0]!]?.span[0] === hit.span[0] &&
            shown.build.constituents[hit.ids[0]!]?.span[1] === hit.span[1]
          ? { kind: 'node', id: hit.ids[0]! }
          : hit.span
            ? { kind: 'nodes', ids: hit.ids, span: hit.span }
            : { kind: 'none' },
    );
    traceSelect(shown.selection);
  }

  function grew() {
    if (demo) demoDepth = Math.max(demoDepth, layout(demo.build.constituents, words).maxDepth);
    else depthMark = Math.max(depthMark, layout(session.build.constituents, words).maxDepth);
  }

  function closePalette() {
    selectShown({ kind: 'none' });
    preview = null;
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
   * The open sentence's event trace. A PLAIN variable on purpose: nothing
   * renders it, and keeping it out of the reactive graph means appending can
   * never re-run an effect. The sentence-change effect swaps it; every
   * append writes through to storage, so the stored trace is never more than
   * one moment behind. Unlike the snapshot, the trace records the guided run
   * and the solution view too — a debugger needs to SEE them even though
   * they earn nothing.
   */
  let trace: Trace | null = null;
  /** Bumped on every append so `canUndo` — the one reader the plain `trace`
      variable has — knows to look again. */
  let traceSeq = $state(0);
  function traceAppend(entry: TraceMoment) {
    if (!trace) return;
    trace = appendEntry(trace, entry);
    traceSeq += 1;
    writeKey(traceKey(trace.sentenceId), encodeTrace(trace));
  }
  /** A committed learner selection, worth a line in the story. */
  function traceSelect(sel: Selection) {
    if (sel.kind !== 'none') traceAppend({ kind: 'select', selection: sel });
  }

  /**
   * Whether the Back control has anything to take back. `undoDepthOf` walks
   * the recorded fingerprints only — microseconds where a full replay costs
   * milliseconds — because this is asked after every recorded moment. It
   * trusts the recording; the press itself still goes through `undoTarget`,
   * which verifies everything and quietly refuses if the recording lies.
   */
  const canUndo = $derived.by(() => {
    void traceSeq;
    return trace !== null && !demo && undoDepthOf(trace) > 0;
  });

  /** What the screen reader is told when the diagram changes under it. */
  let liveNote = $state('');

  /**
   * Take back the last step. The trace's undo rules decide what that means
   * (runs skipped whole, wrong answers stepped over, startOver the floor);
   * the entry records the fingerprint of the build it lands on; then the
   * normal save path runs, so the snapshot follows and completion is
   * re-graded — and kept, because finishing is history.
   */
  async function undo() {
    if (!trace || demo || tutorialActive || solved) return;
    const target = undoTarget(trace, sentence, scope);
    if (!target) return;
    traceAppend({ kind: 'undo', fp: fingerprint(target.build) });
    session = target;
    draft = null;
    preview = null;
    marqueeIds = [];
    recordDecision();
    // The diagram just changed with no verdict to say so; the live region
    // is how a screen reader hears it. Cleared first so a repeated undo
    // re-announces instead of reading as the same unchanged text.
    liveNote = '';
    await tick();
    liveNote = 'Took back the last step.';
  }

  /** The platform's take-it-back keystroke, on the diagram only. */
  function onkeydown(e: KeyboardEvent) {
    if (!(e.metaKey || e.ctrlKey) || e.shiftKey || e.altKey || e.key !== 'z') return;
    if (middleView !== 'diagram' || tutorialActive || solved) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    e.preventDefault();
    undo();
  }

  /**
   * Add this sentence to the completion set — if its build earns it. The
   * grade runs against the learner's own build, so the solution view (which
   * never touches `build`) can never earn anything, and a half-built tree is
   * missing facts and never passes.
   */
  function recordCompletion(graded: BuildState) {
    if (completed.has(sentence.id)) return;
    if (!earnsCompletion(graded, sentence, target)) return;
    completed.add(sentence.id);
    writeKey(completionKey(), encodeCompletion(completed));
    traceAppend({ kind: 'complete' });
  }

  /**
   * Persist the learner record after a decision lands. Every path that
   * changes the session ends here, so the stored snapshot is never more than
   * one decision behind the screen — a reload comes back to this exact work,
   * misses and refusals included.
   */
  function recordDecision() {
    // Structurally learner-only: this reads `session`, and the guided run's
    // work lives in `demo`, which persistence cannot see. A demonstration is
    // not the learner's work — it neither overwrites their draft nor earns
    // their checkmark, and there is no state it could leave behind for a
    // later pick to record from. The active-run guard refuses persistence if
    // that structural boundary is ever broken during teardown.
    if (tutorialActive) return;
    writeKey(snapshotKey(sentence.id), encodeSnapshot(session, words));
    recordCompletion(session.build);
  }

  /**
   * One decision, handled by `session.ts`.
   *
   * Grading, the miss ladder, refusals and where the selection lands are the
   * same transaction whatever kind of question was asked, and they are testable
   * only outside a component — so they live there and this is the glue.
   * The transaction runs on whichever session is on stage; only the
   * learner's own lands in the record.
   */
  function pick(o: LabelOption) {
    if (tutorialActive && !demo) return;
    const before = shown;
    const next = answer(before, sentence, words, o, scope);
    if (demo) demo = next;
    else session = next;
    if (next.build !== before.build) grew();
    if (next.selection.kind === 'none') preview = null;
    traceAppend({
      kind: 'pick',
      selection: before.selection,
      key: o.key,
      outcome: next.verdict?.kind ?? 'correct',
      fp: fingerprint(next.build),
    });
    if (!demo) recordDecision();
  }

  /**
   * One editing command, handled by the same transaction module as answers —
   * but never graded: ungrouping changes the analysis, it is not a claim
   * about the words. The palette stays open; `sessionChoices` re-grades any
   * remembered refusals against the new structure on its own.
   */
  function act(action: PanelAction) {
    const next = applyAction(shown, action);
    if (demo) demo = next;
    else session = next;
    traceAppend({ kind: 'edit', nodeId: action.nodeId, fp: fingerprint(next.build) });
    // An edit can newly finish a sentence — ungrouping one wrong extra layer
    // may leave exactly the target — so it saves and grades like an answer.
    if (!demo) recordDecision();
  }

  /**
   * "Start over": the draft dies, the history does not. The snapshot is
   * dropped so a reload starts clean too, but a completion once earned stays
   * — finishing is a fact about the past, like a miss.
   */
  function startOver() {
    removeKey(snapshotKey(sentence.id));
    traceAppend({ kind: 'startOver' });
    reset();
  }

  /** Erase the whole record, snapshots and completions alike. The learner
      confirmed; a fresh `completed` makes the checkmarks agree at once. */
  function resetAllProgress() {
    // Clearing the scratch while its driver is still running would let later
    // scripted gestures fall through to the learner's fresh session.
    if (tutorialActive) return;
    if (!confirm('Erase all saved progress? Finished sentences and drafts will be forgotten.')) {
      return;
    }
    clearRecord();
    completed.clear();
    reset();
    // The stored traces died with the record; the in-memory one restarts so
    // nothing appended after this moment resurrects pre-reset history. No
    // entry is written HERE: "erase everything" must leave storage holding
    // nothing of the record's, and the empty trace IS the fresh start — the
    // next real moment writes it.
    trace = emptyTrace(sentence.id, words, version);
  }

  /** Hand the learner their record as a file. It carries builds, misses and
      refusals — which is exactly what makes it a reproducible bug report. */
  function downloadRecord() {
    const blob = new Blob([exportRecord()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grammar-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:window {onkeydown} />

<svelte:head>
  <title>{lesson.title} · Grammar</title>
</svelte:head>

<Workspace
  {items}
  {ws}
  bind:active
  content={middleView === 'diagram' ? frame : undefined}
  onmarquee={middleView === 'diagram' && !solved && !tutorialActive ? onmarquee : undefined}
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
        completed={completedLessons}
        onselect={(id) => selectLesson(id, closeDrawer)}
      />
    {:else if section === 'settings'}
      <div class="settings-panel">
        <ThemeToggle />
        <div class="progress-actions">
          <button type="button" onclick={downloadRecord}>Export progress</button>
          <button type="button" disabled={tutorialActive} onclick={resetAllProgress}
            >Reset all progress</button
          >
        </div>
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
        completed={[...completed]}
        onselect={(id) => openSentence(id, closeDrawer)}
        onreset={tutorialActive ? undefined : startOver}
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
    <!-- Present from the start so assistive tech is already listening when
         the first announcement lands. -->
    <div class="sr-only" role="status" aria-live="polite">{liveNote}</div>
    {#if middleView === 'diagram' && !tutorialActive}
      <div class="canvas-controls" data-stage-occluder>
        <!-- Actions stay put on the solution view, merely disabled — a
             control that vanishes when the view flips reads as a glitch;
             one that dims reads as "not here, not now". -->
        <button
          class="undo-step"
          type="button"
          disabled={!canUndo || solved}
          aria-label="Take back the last step"
          aria-keyshortcuts="Control+Z Meta+Z"
          title="Take back the last step (Ctrl/⌘ Z)"
          onclick={undo}
        >
          <Undo2 size={14} strokeWidth={2} aria-hidden="true" />
        </button>
        {#if dockedLaunch}
          <button
            class="launch docked"
            type="button"
            disabled={solved}
            onclick={() => void tutorialRef?.play()}
          >
            <GraduationCap size={15} strokeWidth={1.9} aria-hidden="true" />
            {runStatus === 'idle' ? posture.label : 'Watch it again'}
          </button>
        {/if}
        <div class="solution-toggle" role="group" aria-label="Diagram state">
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
      </div>
    {/if}
    {#if middleView === 'diagram' && !solved && tutorialBeats.length > 0}
      <!-- Keyed on the sentence: a finished or stopped run belongs to the
           sentence it ran on, and must not greet the next one. -->
      {#key sentenceId}
        <Tutorial
          bind:this={tutorialRef}
          beats={tutorialBeats}
          frame={tutorialFrame}
          frameAnchor={tutorialFrameAnchor}
          host={tutorialHost}
          launcher={{ label: posture.label, arrow: posture.arrow, tone: posture.tone }}
          docked={dockedLaunch}
          onstatus={(s) => (runStatus = s)}
          pointer={guidedPointer}
          obscured={popupAnchor !== null}
          onstart={startDemo}
          onend={endDemo}
          onfinish={() => (demoOutcome = 'finished')}
          onactive={(active) => (tutorialActive = active)}
          onpoint={(key) => (tutorialPointer = key)}
          onplacement={(menu) => (tutorialMenu = menu)}
        />
      {/key}
    {/if}
    {#if !solved}
      <LabelPanel
        bind:this={panelRef}
        panel={choices}
        verdict={shown.verdict}
        navigation={shown.navigation}
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
        onaction={act}
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
      <!-- The picture must reserve the same depth the geometry assumes.
           `depthMark` is the page's one depth — popup anchors, camera rects,
           and the marquee hit-test all measure at it — and a render that
           defaulted to the natural depth painted the labels rows above every
           calculation whenever the mark exceeded what was built, as it does
           for a whole tutorial run. -->
      <!-- While the guided run is on stage — paused included — the canvas is
           its instrument, not the learner's: a selection slipped in during a
           pause replaces the one the run just made, and its next pick asks a
           palette that is answering a different question. The run's own
           gestures call the handlers directly, so these gates close only the
           learner's path. -->
      <Diagram
        {words}
        constituents={visibleBuild.constituents}
        minDepth={visibleDepth}
        {marqueeIds}
        selection={visibleSelection}
        {draft}
        {preview}
        interactive={!solved && !tutorialActive}
        onpick={(s) => {
          if (solved || tutorialActive) return;
          selectShown(s);
          traceSelect(s);
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
  .progress-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 14px;
    padding: 0 4px;
  }
  .progress-actions button {
    display: block;
    width: 100%;
    padding: 5px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-muted);
    font: inherit;
    font-size: 11px;
    text-align: left;
  }
  .progress-actions button:hover {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
    color: var(--ink);
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

  /* Visually silent, audible to assistive tech. */
  .sr-only {
    position: absolute;
    overflow: hidden;
    width: 1px;
    height: 1px;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  /* The canvas's top-right controls: Back, then the view toggle. The row is
     positioned; its members just sit in it, cut from the same cloth. */
  .canvas-controls {
    display: flex;
    position: absolute;
    top: 8px;
    right: 44px;
    z-index: 46;
    gap: 8px;
    align-items: stretch;
  }
  .undo-step {
    display: grid;
    place-items: center;
    width: 40px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: color-mix(in oklab, var(--panel) 94%, transparent);
    color: var(--ink-muted);
    box-shadow: 0 2px 10px oklch(0 0 0 / 18%);
    backdrop-filter: blur(10px);
    cursor: pointer;
  }
  /* Hover echoes the toggle's accent so the row reads as one family; only
     the toggle keeps a FILLED accent, because only it holds a state. */
  .undo-step:hover:not(:disabled) {
    color: var(--accent);
  }
  .undo-step:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .canvas-controls .launch {
    display: inline-flex;
    gap: 7px;
    align-items: center;
    min-height: 34px;
    padding: 3px 13px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: color-mix(in oklab, var(--panel) 94%, transparent);
    color: var(--ink-muted);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    box-shadow: 0 2px 10px oklch(0 0 0 / 18%);
    backdrop-filter: blur(10px);
    white-space: nowrap;
    cursor: pointer;
  }
  .canvas-controls .launch:hover:not(:disabled) {
    color: var(--accent);
  }
  .canvas-controls .launch:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .solution-toggle {
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
    .canvas-controls {
      top: max(60px, calc(env(safe-area-inset-top) + 60px));
      right: 8px;
    }
  }
</style>
