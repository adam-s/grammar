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
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import { tick } from 'svelte';

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
    unwrap,
    wrap,
  } from '$lib/grammar/builder.ts';
  import { FIXTURES } from '$lib/grammar/fixtures.ts';
  import { PLAIN, gradeForm, gradeFunction, type Outcome } from '$lib/grammar/grader.ts';
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
  import { canonicalReading, type Form, type Span } from '$lib/grammar/types.ts';
  import type { Rect } from '$lib/workspace/viewport.ts';

  const ws = new WorkspaceState();

  const items: RailItem[] = [
    { id: 'sentences', label: 'Sentences', icon: Type },
    { id: 'labels', label: 'Labels', icon: Tag },
    { id: 'layers', label: 'Layers', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  let active = $state('sentences');

  /* ------------------------------------------------------------- the work */

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
      // otherwise stack a second node on the same words.
      if (nodeId && cur && cur.word === undefined && cur.parent === null) {
        next = unwrap(next, nodeId);
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

    if (o.verbType) {
      const right = canonicalReading(sentence).verbType;
      if (o.verbType === right) {
        build = setVerbType(build, o.verbType);
        verdict = { kind: 'correct', text: `Yes — this verb is ${LONG[o.verbType]}.` };
        closeIfComplete();
      } else {
        verdict = {
          kind: 'wrong',
          text: `Not ${LONG[o.verbType]} here.`,
          test: 'Ask what must follow the verb for the sentence to be complete.',
        };
        reject(o, [verdict.text, verdict.test].filter(Boolean).join(' '));
      }
    }
  }
</script>

<Workspace {items} {ws} bind:active content={frame} {onmarquee} tabs={['Courses']}>
  {#snippet panel(section)}
    {#if section === 'sentences'}
      <ul class="lines">
        {#each FIXTURES as s (s.id)}
          <li>
            <button
              class="line"
              class:on={s.id === sentenceId}
              type="button"
              aria-current={s.id === sentenceId ? 'true' : undefined}
              onclick={() => (sentenceId = s.id)}
            >
              <span class="text">{s.text}</span>
              <span class="tags">{s.features.join(' · ')}</span>
            </button>
          </li>
        {/each}
      </ul>
      <button class="reset" type="button" onclick={reset}>
        <RotateCcw size={12} strokeWidth={1.75} aria-hidden="true" />
        Start this sentence again
      </button>
    {:else}
      <p class="empty">
        Nothing here yet — see <code>src/routes/+page.svelte</code>.
      </p>
    {/if}
  {/snippet}

  {#snippet inspector()}
    <p class="empty">Empty</p>
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

  <div class="board" style="left:0; top:0; width:{frame.w}px; height:{frame.h}px">
    <Diagram
      {words}
      constituents={build.constituents}
      verbType={build.verbType}
      {marqueeIds}
      {selection}
      {draft}
      {preview}
      minDepth={depthMark}
      onpick={(s) => {
        verdict = null;
        selection = s;
      }}
      {ondraft}
    />
  </div>
</Workspace>

<style>
  .lines {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .line {
    display: block;
    width: 100%;
    padding: 7px 8px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: default;
  }
  .line:hover {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
  }
  .line.on {
    background: color-mix(in oklab, var(--accent) 18%, transparent);
  }
  .text {
    display: block;
    font-size: 12px;
    color: var(--ink);
  }
  .tags {
    display: block;
    margin-top: 2px;
    font-family: var(--font-mono);
    font-size: 9.5px;
    color: var(--ink-faint);
  }
  .reset {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 10px 8px;
    padding: 5px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-muted);
    font: inherit;
    font-size: 11px;
    cursor: default;
  }
  .reset:hover {
    color: var(--ink);
    border-color: var(--border-strong);
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
