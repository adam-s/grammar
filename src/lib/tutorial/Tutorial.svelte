<script lang="ts">
  /**
   * The guided run, on the canvas the learner uses.
   *
   * It drives the real builder through the same handlers a pointer calls, so
   * what it shows is the interaction rather than a picture of one. The parts
   * worth arguing about are elsewhere: `script.ts` works out the decisions and
   * the words, `run.ts` owns the walk and the failure rule. This file is the
   * clock, the camera, and the banner.
   *
   * Two rules it exists to keep:
   *
   * Time never means done. Every move waits on something the app reports — the
   * palette offering the row, the diagram growing — and only then holds for
   * pacing. A step that cannot be taken stops the run and says so on screen.
   *
   * Nothing is aimed at until it is in view. The palette opens beside the
   * selection, and as a tree grows the selection can leave the screen; the
   * desktop camera does not follow it on its own. So each decision brings its
   * words into the free part of the stage before the menu opens.
   */
  import GraduationCap from '@lucide/svelte/icons/graduation-cap';
  import Pause from '@lucide/svelte/icons/pause';
  import Play from '@lucide/svelte/icons/play';
  import Square from '@lucide/svelte/icons/square';
  import StepForward from '@lucide/svelte/icons/step-forward';
  import { onDestroy, tick } from 'svelte';
  import type { Selection } from '../grammar/options.ts';
  import { createCameraMotion } from '../workspace/camera-motion.ts';
  import type { GuidedPointer } from '../workspace/guided-pointer.svelte.ts';
  import { PausableClock, pausableFrames } from '../workspace/pointer-clock.ts';
  import { planSelectionVisibility } from '../workspace/selection-visibility.ts';
  import { fit, type Point, type Rect } from '../workspace/viewport.ts';
  import { fitPadding } from '../workspace/stage-resize.ts';
  import { getWorkspace } from '../workspace/workspace.svelte.ts';
  import { fitTutorialFrame, pinTutorialRect, tutorialLayout } from './layout.ts';
  import {
    HOLD,
    IDLE,
    POSTCONDITION_MS,
    RUNTIME_CAP_MS,
    advance,
    begin,
    fail,
    pickFault,
    progress,
    selectFault,
    stop as stopRun,
    type RunState,
  } from './run.ts';
  import type { TutorialBeat } from './script.ts';

  type Props = {
    beats: TutorialBeat[];
    /** The finished diagram, used to frame the run at its start and end. */
    frame: Rect;
    /** The finished word row and its changing live counterpart. */
    frameAnchor: Rect | null;
    anchorRect: () => Rect | null;
    /** The words a decision is about, in diagram coordinates. */
    focusRect: (selection: Selection) => Rect | null;
    /**
     * Where exactly the thing to be clicked is RENDERED, in client
     * coordinates — measured from the DOM, not derived from layout
     * arithmetic. The app's own motion always wins: whatever the camera and
     * the growing tree have done, a measurement taken after they settle is
     * where the pointer must land.
     */
    pointTarget?: (selection: Selection) => Point | null;
    select: (selection: Selection) => void;
    /** What the live palette says about a row, read after selecting. */
    offered: (key: string) => { found: boolean; pickable: boolean; state?: string } | null;
    pick: (key: string) => { ok: boolean; reason?: string };
    /** What is on the diagram, so a pick that changed nothing is caught. */
    signature: () => string;
    onstart?: () => void;
    onend?: () => void;
    /** The run reached the end. Separate from `onend` so a stopped or failed
        run leaves the camera where the learner can see what happened. */
    onfinish?: () => void;
    /** Lets the real palette enter and leave its stable tutorial position. */
    onactive?: (active: boolean) => void;
    /** Shows which real palette row the guided pointer is about to choose. */
    onpoint?: (key: string | null) => void;
    /**
     * The stage's one guided pointer. The run sweeps it to the words it is
     * about to select, hands it to the palette for the menu trip, and presses
     * it at the exact moment of the pick — so the visible click and the real
     * one are the same event.
     */
    pointer?: GuidedPointer | null;
    /**
     * Take the pointer to the palette row for a key and resolve when it has
     * ARRIVED — the palette's own completed gesture, not a timer. The run
     * awaits this before its decide hold, and presses only after it.
     */
    aimMenu?: (key: string) => Promise<void>;
    /**
     * Something more important is under the launcher — an open palette. A
     * coach's controls must never cover the learner's work, so the launcher
     * yields the space until the palette closes.
     */
    obscured?: boolean;
  };

  let {
    beats,
    frame,
    frameAnchor,
    anchorRect,
    focusRect,
    pointTarget,
    select,
    offered,
    pick,
    signature,
    onstart,
    onend,
    onfinish,
    onactive,
    onpoint,
    pointer = null,
    aimMenu,
    obscured = false,
  }: Props = $props();

  const ws = getWorkspace();

  /*
   * ONE clock for everything the run owns: narration holds, camera motion,
   * pointer glides and presses. Pause freezes that clock, so a paused
   * tutorial is actually paused — the pointer stops mid-glide with its
   * remaining flight intact, the camera stops mid-move, and no state
   * advances. Resume continues each of them from exactly where they froze.
   */
  // The pointer instance is stable for the life of a run — the page keys
  // this component per sentence — so capturing its clock once is the intent.
  // svelte-ignore state_referenced_locally
  const clock = pointer?.clock ?? new PausableClock();
  const frames = pausableFrames(clock);
  const camera = createCameraMotion(
    () => ws.viewport,
    (viewport) => {
      ws.viewport = viewport;
    },
    frames.frame,
    frames.cancelFrame,
  );

  let run = $state<RunState>(IDLE);
  let banner = $state<HTMLElement | null>(null);
  let paused = $state(false);
  let token = 0;
  let stepBudget = 0;
  let pausedAt: number | null = null;
  let pausedMs = 0;

  const beat = $derived<TutorialBeat | null>(beats[run.index] ?? null);
  const running = $derived(run.status === 'running');
  const bar = $derived(progress(run, beats));

  const reduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ the clock */

  /** A wait on the run's own clock: frozen while paused, cancelled by token. */
  const sleep = async (ms: number, mine: number) => {
    if (mine !== token) return;
    await clock.wait(ms);
  };

  /**
   * Hold an explanation on screen while it is playing. Paused time does not
   * spend the hold, and one Step press releases exactly one held moment:
   * `stepOnce` lets the clock run so the gestures before the next checkpoint
   * complete, and this checkpoint re-freezes it.
   */
  async function pace(ms: number, mine: number) {
    if (paused && stepBudget > 0) {
      stepBudget--;
      clock.pause();
      return;
    }
    const until_ = clock.now() + ms;
    while (clock.now() < until_ && mine === token) {
      if (paused && stepBudget > 0) {
        stepBudget--;
        clock.pause();
        return;
      }
      await new Promise<void>((resolve) => setTimeout(resolve, 40));
    }
  }

  function setPaused(next: boolean) {
    if (next === paused) return;
    if (next) {
      pausedAt = Date.now();
      clock.pause();
    } else {
      if (pausedAt !== null) {
        pausedMs += Date.now() - pausedAt;
        pausedAt = null;
      }
      clock.resume();
      frames.releaseHeld();
    }
    paused = next;
  }

  function togglePlayback() {
    stepBudget = 0;
    setPaused(!paused);
  }

  /**
   * One semantic moment: with the run paused, let the clock go so the
   * pending gestures play out, and the next `pace` checkpoint re-freezes.
   */
  function stepOnce() {
    setPaused(true);
    stepBudget++;
    clock.resume();
    frames.releaseHeld();
  }

  function activeRuntime(startedAt: number) {
    const currentPause = pausedAt === null ? 0 : Date.now() - pausedAt;
    return Date.now() - startedAt - pausedMs - currentPause;
  }

  /**
   * Wait for the app to report something, rather than for time to pass. The
   * deadline runs on the demonstration's clock, so a pause cannot expire it.
   * Resolves with the reading as soon as it satisfies, or with the last
   * reading once the deadline is out.
   */
  async function until<T>(read: () => T, ok: (value: T) => boolean, mine: number): Promise<T> {
    const deadline = clock.now() + POSTCONDITION_MS;
    let value = read();
    while (!ok(value) && clock.now() < deadline && mine === token) {
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
      await tick();
      value = read();
    }
    return value;
  }

  /* ----------------------------------------------------------- the camera */

  /**
   * The graph owns the upper band for the whole run. The palette owns the band
   * under it, so neither surface has to chase the other around the canvas.
   */
  function graphBand(): Rect | null {
    if (!banner) return null;
    const stage = banner.closest<HTMLElement>('main');
    if (!stage) return null;
    const stageBox = stage.getBoundingClientRect();
    return tutorialLayout({ w: stageBox.width, h: stageBox.height }).graph;
  }

  /** Frame the finished graph once, before a menu appears. */
  async function frameRun() {
    const safe = graphBand();
    if (!safe) return;
    let viewport = fitTutorialFrame(frame, safe);
    const currentAnchor = anchorRect();
    if (currentAnchor && frameAnchor) {
      viewport = pinTutorialRect(viewport, currentAnchor, frameAnchor);
    }
    camera.moveTo(viewport, { duration: 320, immediate: reduced() });
    await sleep(reduced() ? 0 : 340, token);
  }

  /** Once the teaching surfaces leave, give the completed graph the canvas. */
  async function frameFinishedRun(mine: number) {
    await tick();
    if (mine !== token || !ws.stageReady) return;
    camera.moveTo(fit(frame, ws.stage, fitPadding(ws.stage)), {
      duration: 320,
      immediate: reduced(),
    });
    await sleep(reduced() ? 0 : 340, mine);
  }

  /** Reveal within the same upper band without changing the established zoom. */
  async function reveal(selection: Selection) {
    const target = focusRect(selection);
    const safe = graphBand();
    if (!target || !safe) return;
    const plan = planSelectionVisibility({ ...ws.viewport }, target, safe, 'reveal');
    if (!plan.changed) return;
    camera.moveTo(plan.viewport, { duration: 240, immediate: reduced() });
    await sleep(reduced() ? 0 : 260, token);
  }

  /* -------------------------------------------------------------- the run */

  async function play() {
    const mine = ++token;
    paused = false;
    pausedAt = null;
    pausedMs = 0;
    stepBudget = 0;
    onstart?.();
    onpoint?.(null);
    run = begin(beats);
    onactive?.(true);
    await tick();
    await frameRun();
    const startedAt = Date.now();

    while (run.status === 'running' && mine === token) {
      if (activeRuntime(startedAt) > RUNTIME_CAP_MS) {
        run = fail(run, 'The tutorial ran longer than it should. Stopping.');
        break;
      }
      const current = beats[run.index]!;

      if (run.act === 'ask') {
        // Move the graph first. Opening a contextual menu and then moving its
        // anchor made both surfaces chase each other across the canvas.
        await reveal(current.select);
        if (mine !== token) return;
        // The hand goes to the words, PRESSES, and only then does the
        // selection appear — the same causal order a learner's own click
        // follows. The target is a tracked getter, so a camera still
        // settling under the flight is followed, not missed.
        if (pointTarget?.(current.select) && pointer) {
          await pointer.moveToClient(() => pointTarget(current.select));
          if (mine !== token) return;
          await pointer.press();
          if (mine !== token) return;
        }
        select(current.select);
        await tick();
        const seen = await until(
          () => offered(current.key),
          (o) => !!o?.found && o.pickable,
          mine,
        );
        const fault = selectFault(current, seen);
        if (fault) {
          run = fail(run, fault);
          break;
        }
        // The palette reports ARRIVAL at the row; the highlight lights as
        // the pointer lands, and the decide hold begins only then.
        await aimMenu?.(current.key);
        if (mine !== token) return;
        onpoint?.(current.key);
        await pace(HOLD.ask, mine);
      } else {
        // The press IS the pick: the pointer lands (waiting out any glide
        // still in the air), dips, and the option is taken on the release.
        await pointer?.press();
        if (mine !== token) return;
        const beforeAnchor = anchorRect();
        const before = signature();
        const result = pick(current.key);
        onpoint?.(null);
        await tick();
        const afterAnchor = anchorRect();
        if (beforeAnchor && afterAnchor) {
          // Adding the first childless phrase creates one extra diagram row.
          // Cancel that world-space change before the browser paints it, so
          // the words stay put while the new label appears above them.
          ws.viewport = pinTutorialRect(ws.viewport, afterAnchor, beforeAnchor);
        }
        const after = await until(
          () => signature(),
          (now) => now !== before,
          mine,
        );
        const fault = pickFault(current, result, after !== before);
        if (fault) {
          run = fail(run, fault);
          break;
        }
        await pace(HOLD.answer, mine);
      }

      if (mine !== token) return;
      run = advance(run, beats);
    }

    if (mine !== token) return;
    pointer?.rest();
    if (run.status === 'done') {
      onactive?.(false);
      onpoint?.(null);
      await frameFinishedRun(mine);
      if (mine !== token) return;
      onfinish?.();
    }
    onend?.();
  }

  function halt() {
    token++;
    camera.cancel();
    pointer?.rest();
    setPaused(false);
    stepBudget = 0;
    run = stopRun(run);
    onactive?.(false);
    onpoint?.(null);
    onend?.();
  }

  onDestroy(() => {
    token++;
    camera.cancel();
    pointer?.cancel();
    // The clock is the page's, shared across runs — never cancel it, but do
    // not leave it paused either: a stranded pause would freeze the next
    // sentence's run and keep this run's final waits polling forever.
    clock.resume();
    frames.releaseHeld();
    onactive?.(false);
    onpoint?.(null);
  });
</script>

{#if (run.status === 'idle' || run.status === 'stopped' || run.status === 'done') && !obscured}
  <div class="launch-home" class:first={run.status === 'idle'}>
    {#if run.status === 'idle'}
      <div class="start-here" aria-hidden="true">
        <span>Start here</span>
        <svg viewBox="0 0 76 32" role="presentation">
          <path d="M2 27 C 27 31, 49 28, 59 7" />
          <path d="M51 13 L 60 5 L 64 16" />
        </svg>
      </div>
    {/if}
    <button class="launch" type="button" onclick={play}>
      <GraduationCap size={15} strokeWidth={1.9} aria-hidden="true" />
      {run.status === 'idle' ? 'Watch how it is built' : 'Watch it again'}
    </button>
  </div>
{/if}

{#if running || run.status === 'failed'}
  <div class="banner" bind:this={banner} data-stage-occluder role="status" aria-live="polite">
    <div class="bar" aria-hidden="true"><span style="width:{bar * 100}%"></span></div>
    <div class="inner">
      <div class="words">
        {#if run.status === 'failed'}
          <p class="eyebrow">The tutorial stopped</p>
          <p class="big">{run.problem}</p>
        {:else if beat}
          <p class="eyebrow">Step {run.index + 1} of {beats.length}</p>
          {#if run.act === 'ask'}
            <p class="big">{beat.question}</p>
          {:else}
            <p class="big">{beat.statement}</p>
            {#if beat.note}<p class="note">{beat.note}</p>{/if}
          {/if}
        {/if}
      </div>
      <div class="actions">
        {#if run.status !== 'failed'}
          <div class="playback" role="group" aria-label="Tutorial playback">
            <button
              class="transport"
              type="button"
              aria-label={paused ? 'Play tutorial' : 'Pause tutorial'}
              title={paused ? 'Play' : 'Pause'}
              aria-pressed={paused}
              onclick={togglePlayback}
            >
              {#if paused}
                <Play size={13} strokeWidth={2.2} aria-hidden="true" />
              {:else}
                <Pause size={13} strokeWidth={2.2} aria-hidden="true" />
              {/if}
              <span>{paused ? 'Play' : 'Pause'}</span>
            </button>
            <button
              class="transport"
              type="button"
              aria-label="Advance one explanation step"
              title="Step"
              onclick={stepOnce}
            >
              <StepForward size={13} strokeWidth={2.2} aria-hidden="true" />
              <span>Step</span>
            </button>
          </div>
        {/if}
        <button class="halt" type="button" onclick={halt}>
          <Square size={12} strokeWidth={2.4} aria-hidden="true" />
          {run.status === 'failed' ? 'Close' : 'Stop'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* The launcher sits between the two sidebar controls, which own the corners. */
  .launch-home {
    position: absolute;
    top: 8px;
    left: 50%;
    z-index: 45;
    transform: translateX(-50%);
  }
  .launch-home.first {
    top: 54px;
  }
  .start-here {
    position: absolute;
    top: calc(100% + 8px);
    right: 50%;
    width: 150px;
    height: 32px;
    color: var(--accent);
    pointer-events: none;
  }
  .start-here span {
    position: absolute;
    top: 12px;
    left: 0;
    font-family: var(--font-sans);
    font-size: 12px;
    font-style: italic;
    font-weight: 600;
    letter-spacing: 0.08em;
    white-space: nowrap;
    transform: rotate(-2deg);
  }
  .start-here svg {
    position: absolute;
    top: 0;
    left: 72px;
    width: 76px;
    height: 32px;
    overflow: visible;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .launch {
    display: inline-flex;
    gap: 7px;
    align-items: center;
    padding: 7px 14px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--panel);
    color: var(--ink-muted);
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 550;
    box-shadow: 0 2px 10px oklch(0 0 0 / 18%);
    white-space: nowrap;
    cursor: pointer;
  }
  .launch:hover {
    color: var(--ink);
    border-color: var(--border-strong);
  }

  .banner {
    position: absolute;
    top: 8px;
    right: 44px;
    left: 44px;
    z-index: 45;
    overflow: hidden;
    height: 108px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--panel);
    box-shadow: 0 6px 24px oklch(0 0 0 / 22%);
  }
  .bar {
    height: 2px;
    background: color-mix(in oklab, var(--ink) 10%, transparent);
  }
  .bar span {
    display: block;
    height: 100%;
    background: var(--accent);
    transition: width 240ms ease-out;
  }
  .inner {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 12px 14px 14px;
    min-height: 105px;
    box-sizing: border-box;
  }
  .words {
    flex: 1;
    min-width: 0;
  }
  .eyebrow {
    margin: 0 0 4px;
    color: var(--ink-faint);
    font-family: var(--font-sans);
    font-size: 10px;
    font-weight: 650;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
  /* The explanation is the point of the run, so it is the biggest thing on the
     canvas while the run is going. */
  .big {
    margin: 0;
    color: var(--ink);
    font-family: var(--font-serif);
    font-size: clamp(17px, 2.1vw, 25px);
    line-height: 1.25;
    text-wrap: pretty;
  }
  .note {
    margin: 6px 0 0;
    color: var(--ink-muted);
    font-family: var(--font-sans);
    font-size: 12.5px;
  }
  .actions {
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
  }
  .playback {
    display: flex;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: color-mix(in oklab, var(--panel) 88%, var(--sunken));
  }
  .transport {
    display: inline-flex;
    gap: 5px;
    align-items: center;
    padding: 6px 9px;
    border: 0;
    background: transparent;
    color: var(--ink-muted);
    font-family: var(--font-sans);
    font-size: 11px;
    cursor: pointer;
  }
  .transport + .transport {
    border-left: 1px solid var(--border);
  }
  .transport:hover,
  .transport:focus-visible {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
    color: var(--ink);
  }
  .halt {
    display: inline-flex;
    flex: none;
    gap: 6px;
    align-items: center;
    padding: 6px 11px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-muted);
    font-family: var(--font-sans);
    font-size: 11px;
    cursor: pointer;
  }
  .halt:hover {
    color: var(--ink);
    border-color: var(--border-strong);
  }

  @media (max-width: 700px) {
    .launch-home.first {
      top: 96px;
    }
    .banner {
      right: 8px;
      left: 8px;
      height: 136px;
    }
    .inner {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: stretch;
      justify-content: space-between;
      min-height: 133px;
      padding: 12px 14px 13px;
    }
    .actions {
      align-self: flex-end;
    }
    .transport span {
      display: none;
    }
    .transport {
      width: 34px;
      height: 32px;
      justify-content: center;
      padding: 0;
    }
    .halt {
      min-height: 32px;
    }
  }
</style>
