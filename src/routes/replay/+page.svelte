<script lang="ts">
  /**
   * The replay bench: load a trace, watch it happen again.
   *
   * This is the debug route the learner-record plan reserved the step
   * controls for — not the learner's homework, a developer's bench.
   * Paste a trace (or a whole progress export), pick a sentence, and walk
   * the recorded session step by step through the SAME pure transaction the
   * app runs. A divergence banner names the first moment where the
   * recording and today's code disagree; everything before it replays.
   *
   * Development only, like the `__grammar` driver: the bench ships in no
   * build, because a trace is a learner's history and the tool that opens
   * one belongs on a workbench, not in a product.
   */
  import Diagram from '$lib/grammar/Diagram.svelte';
  import { diagramSize } from '$lib/grammar/Diagram.svelte';
  import { layout } from '$lib/grammar/layout.ts';
  import { FIXTURES } from '$lib/grammar/fixtures.ts';
  import { COURSE_LESSONS, scopeThrough } from '$lib/course';
  import { decodeTrace, replayTrace, type Trace } from '$lib/learner/trace.ts';

  const DEV = import.meta.env.DEV;
  const POOL = [...COURSE_LESSONS.flatMap((l) => l.sentences), ...FIXTURES];

  let raw = $state('');
  let error = $state<string | null>(null);
  /** Traces found in the pasted JSON, by sentence id. */
  let found = $state<Trace[]>([]);
  let pickedId = $state<string | null>(null);
  let at = $state(0);
  let playing = $state(false);

  /** A bare trace, or a progress export holding several. */
  function tracesIn(parsed: unknown): unknown[] {
    if (typeof parsed !== 'object' || parsed === null) return [];
    const record = (parsed as { record?: Record<string, unknown> }).record;
    if (record) {
      return Object.entries(record)
        .filter(([key]) => key.startsWith('grammar:trace:'))
        .map(([, value]) => value);
    }
    return 'entries' in parsed ? [parsed] : [];
  }

  function load() {
    error = null;
    found = [];
    pickedId = null;
    at = 0;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      error = 'That is not JSON.';
      return;
    }
    const candidates = tracesIn(parsed);
    if (candidates.length === 0) {
      error = 'No trace in there — expected a trace or a progress export.';
      return;
    }
    const good: Trace[] = [];
    for (const c of candidates) {
      const id = (c as { sentenceId?: unknown }).sentenceId;
      const sentence = POOL.find((s) => s.id === id);
      // decodeTrace re-checks everything against the sentence's real words;
      // a trace this build cannot vouch for is left out, and said so.
      const decoded = sentence ? decodeTrace(JSON.stringify(c), sentence.words) : null;
      if (decoded) good.push(decoded);
    }
    if (good.length === 0) {
      error = `Found ${candidates.length} trace(s), but none this build can replay — unknown sentence, other schema version, or edited words.`;
      return;
    }
    found = good;
    pickedId = good[0]!.sentenceId;
  }

  function fromBrowser() {
    const entries: Record<string, unknown> = {};
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith('grammar:trace:')) continue;
      try {
        entries[key] = JSON.parse(localStorage.getItem(key)!);
      } catch {
        // An unreadable trace stays out; decode would refuse it anyway.
      }
    }
    raw = JSON.stringify({ record: entries }, null, 2);
    load();
  }

  const trace = $derived(found.find((t) => t.sentenceId === pickedId) ?? null);
  const sentence = $derived(POOL.find((s) => s.id === pickedId) ?? null);
  const owner = $derived(
    COURSE_LESSONS.find((l) => l.sentences.some((s) => s.id === pickedId)) ?? null,
  );
  const scope = $derived(owner ? scopeThrough(COURSE_LESSONS, owner.number) : undefined);
  const replay = $derived(
    trace && sentence ? replayTrace(trace, sentence, scope) : { steps: [], divergence: null },
  );
  const step = $derived(replay.steps[Math.min(at, replay.steps.length - 1)] ?? null);
  const frame = $derived(
    sentence && step
      ? diagramSize(
          step.session.build.constituents,
          sentence.words,
          layout(step.session.build.constituents, sentence.words).maxDepth,
        )
      : null,
  );

  $effect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      if (at >= replay.steps.length - 1) playing = false;
      else at += 1;
    }, 600);
    return () => clearInterval(timer);
  });

  function describe(entry: (typeof replay.steps)[number]['entry']): string {
    switch (entry.kind) {
      case 'open':
        return `opened — ${Object.keys(entry.build.constituents).length} node(s) restored`;
      case 'select':
        return `selected ${
          entry.selection.kind === 'span'
            ? `words ${entry.selection.span[0]}–${entry.selection.span[1]}`
            : entry.selection.kind === 'node'
              ? `node ${entry.selection.id}`
              : entry.selection.kind === 'nodes'
                ? `${entry.selection.ids.length} nodes`
                : 'nothing'
        }`;
      case 'pick':
        return `picked ${entry.key} — ${entry.outcome}`;
      case 'edit':
        return `ungrouped ${entry.nodeId}`;
      case 'solution':
        return entry.shown ? 'opened the solution' : 'closed the solution';
      case 'startOver':
        return 'started over';
      case 'complete':
        return 'finished the sentence';
    }
  }
</script>

<svelte:head>
  <title>Replay · Grammar</title>
</svelte:head>

{#if !DEV}
  <main class="bench">
    <p>The replay bench is a development tool. Run the app with <code>npm run dev</code>.</p>
  </main>
{:else}
  <main class="bench">
    <h1>Replay bench</h1>
    <section class="loader">
      <textarea
        bind:value={raw}
        rows="6"
        placeholder="Paste a trace, or a whole progress export…"
      ></textarea>
      <div class="row">
        <button type="button" onclick={load}>Load</button>
        <button type="button" onclick={fromBrowser}>Use this browser’s traces</button>
        {#if found.length > 1}
          <select bind:value={pickedId}>
            {#each found as t (t.sentenceId)}
              <option value={t.sentenceId}>{t.sentenceId}</option>
            {/each}
          </select>
        {/if}
      </div>
      {#if error}<p class="error" role="alert">{error}</p>{/if}
    </section>

    {#if trace && sentence}
      <section class="meta">
        <p class="sentence">“{sentence.text}”</p>
        <p class="stamp">
          {trace.entries.length} moment(s) · app {trace.app}
          {#if owner}· lesson {owner.number}{/if}
        </p>
      </section>

      {#if replay.divergence}
        <p class="divergence" role="alert">
          Diverged at step {replay.divergence.seq}: {replay.divergence.reason}
        </p>
      {/if}

      {#if replay.steps.length > 0 && step && frame}
        <section class="controls">
          <button type="button" disabled={at <= 0} onclick={() => (at = Math.max(0, at - 1))}>
            ‹ Back
          </button>
          <button type="button" onclick={() => (playing = !playing)}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            disabled={at >= replay.steps.length - 1}
            onclick={() => (at = Math.min(replay.steps.length - 1, at + 1))}
          >
            Forward ›
          </button>
          <input
            type="range"
            min="0"
            max={replay.steps.length - 1}
            bind:value={at}
            aria-label="Step"
          />
          <span class="where">{at + 1} / {replay.steps.length}</span>
        </section>

        <section class="stage">
          <div class="board" style="width:{frame.w}px; height:{frame.h}px">
            <Diagram
              words={sentence.words}
              constituents={step.session.build.constituents}
              selection={step.session.selection}
              interactive={false}
            />
          </div>
        </section>

        <ol class="log">
          {#each replay.steps as s, i (s.entry.seq)}
            <li>
              <button type="button" class:current={i === at} onclick={() => (at = i)}>
                <span class="seq">{s.entry.seq}</span>
                {describe(s.entry)}
              </button>
            </li>
          {/each}
          {#if replay.divergence}
            <li class="stopped">↑ replay stops here — {replay.divergence.reason}</li>
          {/if}
        </ol>
      {/if}
    {/if}
  </main>
{/if}

<style>
  .bench {
    max-width: 980px;
    margin: 0 auto;
    padding: 24px 20px 80px;
    color: var(--ink);
    font-family: var(--font-sans);
  }
  h1 {
    font-size: 18px;
  }
  .loader textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--panel);
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 11px;
  }
  .row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
  }
  button,
  select {
    padding: 5px 11px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--panel);
    color: var(--ink-muted);
    font: inherit;
    font-size: 12px;
  }
  button:hover:not(:disabled) {
    color: var(--ink);
  }
  button:disabled {
    opacity: 0.45;
  }
  .error,
  .divergence {
    padding: 8px 12px;
    border: 1px solid color-mix(in oklab, crimson 45%, var(--border));
    border-radius: var(--radius-sm);
    color: color-mix(in oklab, crimson 70%, var(--ink));
    font-size: 12.5px;
  }
  .meta .sentence {
    margin: 18px 0 2px;
    font-size: 14px;
    font-weight: 550;
  }
  .meta .stamp {
    margin: 0 0 12px;
    color: var(--ink-faint);
    font-size: 11.5px;
  }
  .controls {
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 12px 0;
  }
  .controls input[type='range'] {
    flex: 1;
  }
  .where {
    color: var(--ink-faint);
    font-family: var(--font-mono);
    font-size: 11px;
  }
  .stage {
    overflow: auto;
    max-height: 46vh;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface, transparent);
  }
  .board {
    position: relative;
  }
  .log {
    margin: 14px 0 0;
    padding: 0;
    list-style: none;
  }
  .log li button {
    display: flex;
    gap: 10px;
    width: 100%;
    border: 0;
    background: transparent;
    text-align: left;
  }
  .log li button.current {
    background: color-mix(in oklab, var(--accent) 14%, transparent);
    color: var(--ink);
  }
  .log .seq {
    min-width: 3ch;
    color: var(--ink-faint);
    font-family: var(--font-mono);
    font-size: 11px;
  }
  .log .stopped {
    padding: 6px 11px;
    color: color-mix(in oklab, crimson 70%, var(--ink));
    font-size: 12px;
  }
</style>
