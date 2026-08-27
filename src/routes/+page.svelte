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
  import {
    emptyBuild,
    nodeOver,
    setFunction,
    setVerbType,
    stacksOver,
    unwrap,
    wrap,
  } from '$lib/grammar/builder.ts';
  import { FIXTURES } from '$lib/grammar/fixtures.ts';
  import {
    PLAIN,
    VERB_TYPE_TEST,
    gradeForm,
    gradeFunction,
    gradeVerbType,
    type Outcome,
  } from '$lib/grammar/grader.ts';
  import { layout } from '$lib/grammar/layout.ts';
  import { nodesInMarquee } from '$lib/grammar/marquee-selection.ts';
  import { FORM_TEST, FUNCTION_TEST, label } from '$lib/grammar/names.ts';

  import { LONG } from '$lib/grammar/rules.ts';
  import {
    blockRejectedOptions,
    isPanelComplete,
    optionsFor,
    type LabelOption,
    type Selection,
  } from '$lib/grammar/options.ts';
  import type { Form, Span } from '$lib/grammar/types.ts';
  import type { Rect } from '$lib/workspace/viewport.ts';
  import { replaySentence } from '$lib/course/sentence-renderer.ts';
  import {
    COURSE_STAGES,
    CourseContents,
    Lesson,
    LessonSentenceList,
    SentenceGraphs,
    lessonById,
    lessonDoc,
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
  const lessonSentences = $derived(
    lesson.sentenceIds.map((id) => FIXTURES.find((sentence) => sentence.id === id)!),
  );
  /** A lesson with authored prose reads as a document; one without still shows
      its finished diagrams, so an unwritten lesson is visibly unwritten. */
  const doc = $derived(lessonDoc(lessonId));
  let sentenceId = $state('fix-vtr');
  const sentence = $derived(FIXTURES.find((s) => s.id === sentenceId)!);
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
  const choices = $derived(
    blockRejectedOptions(optionsFor(build, words, selection), rejected[targetKey] ?? {}),
  );

  /**
   * Handle for `scripts/snapshot.mjs` to drive this page.
   *
   * It exposes the SAME functions the interface calls — `pick` is the one a
   * click runs, `choices` is what the palette is showing — so a sweep exercises
   * the real path rather than a parallel one written for testing. Anything a
   * driver could do here, a person can do with a pointer.
   */
  $effect(() => {
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
      sentenceIds: FIXTURES.map((s) => s.id),
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
        replaySentence(sentence).steps.map((step) => ({
          kind: step.kind,
          span: step.span,
          nodeId: step.nodeId,
          key:
            step.choice.form !== undefined
              ? `form:${step.choice.form}`
              : step.choice.func !== undefined
                ? // The required S V A adverbial is a distinct row, because it is
                  // a distinct claim about the verb.
                  step.choice.func === 'adverbial' && step.choice.obligatory
                  ? 'func:obligatoryAdverbial'
                  : `func:${step.choice.func}`
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

  /**
   * @param what   what was confirmed, for a correct answer
   * @param refused what was rejected, for a first miss — never what is right
   * @param firstMiss the rejected label's OWN test, so it can be applied and fail
   * @param key    identifies the thing being answered, so misses accumulate
   */
  function toVerdict(
    o: Outcome,
    what: string,
    refused: string,
    firstMiss: string,
    key: string,
  ): Verdict {
    if (o.kind === 'correct') return { kind: 'correct', text: `Yes — ${what}.` };
    if (o.kind === 'alternate') {
      return {
        kind: 'alternate',
        text: `Also correct, but it means something else: ${o.gloss}`,
        test: `Here it means: ${o.canonicalGloss}`,
      };
    }
    const n = (misses[key] ?? 0) + 1;
    misses = { ...misses, [key]: n };
    return n === 1
      ? { kind: 'wrong', text: `Not ${refused}.`, test: firstMiss }
      : { kind: 'wrong', text: o.reason, test: o.test };
  }

  const sentenceCase = (t: string) => `${t.charAt(0).toUpperCase()}${t.slice(1).trimEnd()}.`;

  function grew() {
    depthMark = Math.max(depthMark, layout(build.constituents, words).maxDepth);
  }

  function reject(option: LabelOption, text: string) {
    if (!targetKey) return;
    rejected = {
      ...rejected,
      [targetKey]: { ...rejected[targetKey], [option.key]: text },
    };
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

  /** Close a completed decision, but keep the palette for a real follow-up. */
  function closeIfComplete() {
    if (isPanelComplete(optionsFor(build, words, selection))) closePalette();
  }

  function pick(o: LabelOption) {
    const span = targetSpan;
    if (!span) return;

    if (o.form) {
      const outcome = gradeForm(sentence, span, o.form);
      const named = PLAIN[o.form] ?? o.form;
      verdict = toVerdict(
        outcome,
        `that is ${named}`,
        named,
        sentenceCase(`${named} ${FORM_TEST[o.form] ?? ''}`),
        `form:${span[0]}-${span[1]}`,
      );
      // A wrong answer never enters the structure. The diagram is a record of
      // what the learner has established, not of what they have tried.
      if (outcome.kind === 'wrong') {
        reject(o, [verdict.text, verdict.test].filter(Boolean).join(' '));
        return;
      }

      let next = build;
      const nodeId = selection.kind === 'node' ? selection.id : null;
      const cur = nodeId ? build.constituents[nodeId] : undefined;
      // Replacing a loose phrase means removing it first; `wrap` would
      // otherwise stack a second node on the same words. A clause over a phrase
      // is the exception, because that stack is the only way to write one.
      if (nodeId && cur && cur.parent === null && !stacksOver(cur, o.form)) {
        if (cur.word === undefined) next = unwrap(next, nodeId);
      }
      build = wrap(next, words, span, o.form);
      grew();
      const id = nodeOver(build, span);
      if (id) selection = { kind: 'node', id };
      closeIfComplete();
      return;
    }

    if (o.func && selection.kind === 'node') {
      const c = build.constituents[selection.id]!;
      const outcome = gradeFunction(sentence, c.span, c.form, o.func, o.obligatory);
      verdict = toVerdict(
        outcome,
        `it is the ${o.label}`,
        `the ${o.label}`,
        sentenceCase(`the ${label(o.func)} answers: ${FUNCTION_TEST[o.func]}`),
        `func:${c.span[0]}-${c.span[1]}`,
      );
      if (outcome.kind !== 'wrong') {
        build = setFunction(build, selection.id, o.func, o.obligatory ?? false);
        closeIfComplete();
      } else {
        reject(o, [verdict.text, verdict.test].filter(Boolean).join(' '));
      }
      return;
    }

    if (o.verbType && selection.kind === 'node') {
      // A sentence can hold more than one verb, so the answer is graded against
      // the verb that was selected rather than against the sentence.
      const at = build.constituents[selection.id]?.span[0];
      const outcome = at === undefined ? null : gradeVerbType(sentence, at, o.verbType);
      if (outcome && outcome.kind !== 'wrong') {
        build = setVerbType(build, selection.id, o.verbType);
        verdict = { kind: 'correct', text: `Yes — this verb is ${LONG[o.verbType]}.` };
        closeIfComplete();
      } else {
        verdict = {
          kind: 'wrong',
          text: outcome?.reason ?? `Not ${LONG[o.verbType]} here.`,
          test: outcome?.test ?? VERB_TYPE_TEST,
        };
        reject(o, [verdict.text, verdict.test].filter(Boolean).join(' '));
      }
    }
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
