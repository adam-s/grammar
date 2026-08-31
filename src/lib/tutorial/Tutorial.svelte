<script lang="ts">
  /**
   * The guided run, on the canvas the learner uses.
   *
   * It drives the real builder through the same handlers a pointer calls, so
   * what it shows is the interaction rather than a picture of one. The parts
   * worth arguing about are elsewhere: `script.ts` works out the decisions
   * and the words, `run.ts` owns the run state and the failure wording, and
   * the walk itself is `perform()` in `workspace/performance.ts` — the same
   * sequencer the lesson hero replays on. This file is the clock, the
   * camera, the banner, and the fault checks the sequencer calls back into.
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
  import { perform, type Gestures, type Timing } from '../workspace/performance.ts';
  import { PausableClock, pausableFrames } from '../workspace/pointer-clock.ts';
  import { prefersReducedMotion } from '../workspace/responsive.svelte.ts';
  import { gestureKind, guardHooks, performSelection } from '../workspace/selection-gesture.ts';
  import { planSelectionVisibility } from '../workspace/selection-visibility.ts';
  import { fit, type Rect } from '../workspace/viewport.ts';
  import { fitPadding } from '../workspace/stage-resize.ts';
  import { getWorkspace } from '../workspace/workspace.svelte.ts';
  import type { TutorialHost } from './host.ts';
  import { fitTutorialFrame, pinTutorialRect, tutorialLayout } from './layout.ts';
  import {
    HOLD,
    IDLE,
    POSTCONDITION_MS,
    RUNTIME_CAP_MS,
    begin,
    fail,
    gestureFault,
    pickFault,
    progress,
    selectFault,
    stop as stopRun,
    type RunState,
    type RunStatus,
  } from './run.ts';
  import type { TutorialBeat } from './script.ts';

  type Props = {
    beats: TutorialBeat[];
    /** The finished diagram, used to frame the run at its start and end. */
    frame: Rect;
    /** The finished word row and its changing live counterpart. */
    frameAnchor: Rect | null;
    /** Everything the run needs from the page it drives. See `host.ts`. */
    host: TutorialHost;
    /**
     * The stage's one guided pointer. The run sweeps it to the words it is
     * about to select, hands it to the palette for the menu trip, and presses
     * it at the exact moment of the pick — so the visible click and the real
     * one are the same event.
     */
    pointer?: GuidedPointer | null;
    /**
     * Something more important is under the launcher — an open palette. A
     * coach's controls must never cover the learner's work, so the launcher
     * yields the space until the palette closes.
     */
    obscured?: boolean;
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
     * The palette's finished screen-space home, computed HERE — the run
     * measures its own banner and does the layout — and handed to the page
     * ready to use, null when the banner leaves. The banner sizes itself to
     * its words, so a long question pushes the palette down with the graph
     * band; the page stores the result instead of re-deriving it from a raw
     * measurement.
     */
    onplacement?: (menu: Rect | null) => void;
    /**
     * How the idle launcher presents itself: its label, whether the "Start
     * here" arrow hangs on it, and how much room it takes. DECIDED elsewhere
     * — the page derives it from the learner's evidence — and rendered here
     * dumbly, so this component never learns what a lesson or a learner
     * record is. The default is the full invitation.
     */
    launcher?: { label: string; arrow: boolean; tone: 'invite' | 'quiet' };
    /**
     * The page renders the launch control itself — in its own toolbar row —
     * and drives the run through the bound `play()`. This component then
     * renders no launcher at all and reports its status through `onstatus`
     * so the docked control can read "Watch it again" off the same state.
     */
    docked?: boolean;
    onstatus?: (status: RunStatus) => void;
  };

  let {
    beats,
    frame,
    frameAnchor,
    host,
    pointer = null,
    obscured = false,
    onstart,
    onend,
    onfinish,
    onactive,
    onpoint,
    onplacement,
    launcher = { label: 'Watch how it is built', arrow: true, tone: 'invite' },
    docked = false,
    onstatus,
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
  /** True from `onstart` until the one matching `onend`. Destruction is a
      stop too: a parent may hide the diagram without pressing our button. */
  let ownsStage = false;

  function releaseStage() {
    if (!ownsStage) return;
    ownsStage = false;
    onend?.();
  }

  const beat = $derived<TutorialBeat | null>(beats[run.index] ?? null);
  const running = $derived(run.status === 'running');
  const bar = $derived(progress(run, beats));

  /*
   * Each gesture is captioned the FIRST time it appears and then trusted:
   * "Click a word" on every later decision would be the tutorial talking
   * over itself. The hint rides the step line, so it costs no layout.
   */
  const GESTURE_HINT: Record<string, string> = {
    click: 'Click a word',
    drag: 'Drag across the words',
    node: 'Click a label',
    marquee: 'Drag a box around the labels',
    'drag-untouchable': 'Selected together — on a computer, drag across the words',
    'marquee-untouchable': 'Selected together — on a computer, drag a box around the labels',
  };
  let taught: string[] = [];
  let gestureHint = $state<string | null>(null);
  function teach(kind: string) {
    if (taught.includes(kind)) {
      gestureHint = null;
      return;
    }
    taught.push(kind);
    gestureHint = GESTURE_HINT[kind] ?? null;
  }

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
   * complete, and this checkpoint re-freezes it. The polling primitive is
   * the clock's own `waitUntil`, so pause semantics are decided in one
   * place; only the step-budget rule is this run's.
   */
  async function pace(ms: number, mine: number) {
    const until_ = clock.now() + ms;
    await clock.waitUntil(
      () => {
        if (mine !== token) return true;
        if (paused && stepBudget > 0) {
          stepBudget--;
          clock.pause();
          return true;
        }
        return clock.now() >= until_;
      },
      Infinity,
      40,
    );
  }

  function setPaused(next: boolean) {
    if (next === paused) return;
    // Held animation frames are replayed by the clock's own wake handling.
    if (next) clock.pause();
    else clock.resume();
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
  }

  /**
   * Wait for the app to report something, rather than for time to pass. The
   * deadline runs on the demonstration's clock, so a pause cannot expire it.
   * Resolves with the reading as soon as it satisfies, or with the last
   * reading once the deadline is out.
   */
  async function until<T>(read: () => T, ok: (value: T) => boolean, mine: number): Promise<T> {
    let value = read();
    await clock.waitUntil(async () => {
      if (mine !== token || ok(value)) return true;
      await tick();
      value = read();
      return ok(value);
    }, POSTCONDITION_MS);
    return value;
  }

  /* ----------------------------------------------------------- the camera */

  /**
   * The graph owns the upper band for the whole run. The palette owns the band
   * under it, so neither surface has to chase the other around the canvas.
   */
  /** The banner's real bottom edge in stage space: measured, never assumed. */
  function measuredBannerBottom(): number | null {
    if (!banner) return null;
    const stage = banner.closest<HTMLElement>('main');
    if (!stage) return null;
    return banner.getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 8;
  }

  /** Both bands from the one measurement, or null before the banner exists. */
  function layoutNow(): { graph: Rect; menu: Rect } | null {
    if (!banner) return null;
    const stage = banner.closest<HTMLElement>('main');
    if (!stage) return null;
    const stageBox = stage.getBoundingClientRect();
    const bannerBottom = measuredBannerBottom() ?? undefined;
    return tutorialLayout({ w: stageBox.width, h: stageBox.height }, bannerBottom);
  }

  const graphBand = (): Rect | null => layoutNow()?.graph ?? null;

  /** Sub-pixel measurement noise must not re-lay-out the palette. */
  let reportedMenu: Rect | null = null;
  function reportPlacement(menu: Rect | null) {
    const near = (a: number, b: number) => Math.abs(a - b) < 1;
    if (
      menu === null
        ? reportedMenu === null
        : reportedMenu !== null &&
          near(menu.x, reportedMenu.x) &&
          near(menu.y, reportedMenu.y) &&
          near(menu.w, reportedMenu.w) &&
          near(menu.h, reportedMenu.h)
    ) {
      return;
    }
    reportedMenu = menu;
    onplacement?.(menu);
  }

  // One truth for everything under the banner: the same measurement drives
  // this run's graph band and the palette placement handed to the page — a
  // long question pushes BOTH down together.
  //
  // Every report happens INSIDE the observer's own (async) callback — the
  // observer always delivers once on observe, so nothing is missed. The
  // effect's setup must not call the handler itself: the handler reads the
  // state it writes, and a setup-time call makes this effect depend on it —
  // then cleanup's null and setup's value re-trigger each other forever, and
  // the wedged flush takes the whole run down with it.
  $effect(() => {
    if (!banner || !onplacement) return;
    const observer = new ResizeObserver(() => reportPlacement(layoutNow()?.menu ?? null));
    observer.observe(banner);
    return () => {
      observer.disconnect();
      reportPlacement(null);
    };
  });

  /** Frame the finished graph once, before a menu appears. */
  async function frameRun() {
    const safe = graphBand();
    if (!safe) return;
    let viewport = fitTutorialFrame(frame, safe);
    const currentAnchor = host.anchorRect();
    if (currentAnchor && frameAnchor) {
      viewport = pinTutorialRect(viewport, currentAnchor, frameAnchor);
    }
    camera.moveTo(viewport, { duration: 320, immediate: prefersReducedMotion() });
    await sleep(prefersReducedMotion() ? 0 : 340, token);
  }

  /** Once the teaching surfaces leave, give the completed graph the canvas. */
  async function frameFinishedRun(mine: number) {
    await tick();
    if (mine !== token || !ws.stageReady) return;
    camera.moveTo(fit(frame, ws.stage, fitPadding(ws.stage)), {
      duration: 320,
      immediate: prefersReducedMotion(),
    });
    await sleep(prefersReducedMotion() ? 0 : 340, mine);
  }

  /** Reveal within the same upper band without changing the established zoom. */
  async function reveal(selection: Selection) {
    const target = host.focusRect(selection);
    const safe = graphBand();
    if (!target || !safe) return;
    const plan = planSelectionVisibility({ ...ws.viewport }, target, safe, 'reveal');
    if (!plan.changed) return;
    camera.moveTo(plan.viewport, { duration: 240, immediate: prefersReducedMotion() });
    await sleep(prefersReducedMotion() ? 0 : 260, token);
  }

  /* -------------------------------------------------------------- the run */

  /**
   * The tutorial's pacing between completed gestures, expressed as the
   * shared sequencer's Timing. The two nonzero holds are the run's only
   * step checkpoints, exactly as before: `open` and `between` are zero
   * because `reveal` and the next gesture carry that pacing themselves.
   *
   * `?fast-run` collapses the reading holds so the browser sweep can prove
   * forty lessons of runs in minutes instead of hours. Development only —
   * like the `__grammar` driver, the build is the boundary — and pacing
   * only: completion still comes from the app reporting, never from time.
   */
  const fastRun =
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('fast-run');
  const TUTORIAL_TIMING: Timing = {
    open: 0,
    decide: fastRun ? 40 : HOLD.ask,
    commit: fastRun ? 40 : HOLD.answer,
    between: 0,
    rest: 0,
  };

  /** The run's status, for the page's docked control. */
  $effect(() => {
    onstatus?.(run.status);
  });

  export async function play() {
    const mine = ++token;
    // Stop aborts the pointer's flight, but a gesture driver mid-await still
    // unwinds afterwards. These hooks drop every write the moment this run
    // is no longer the live one, so nothing can select, draft, or open a
    // menu after the learner pressed Stop.
    const liveGestures = host.gestures ? guardHooks(host.gestures, () => mine === token) : null;
    paused = false;
    stepBudget = 0;
    ownsStage = true;
    onstart?.();
    onpoint?.(null);
    taught = [];
    gestureHint = null;
    run = begin(beats);
    onactive?.(true);
    await tick();
    await frameRun();
    const startedAt = clock.now();

    let capped = false;
    const alive = () => {
      if (mine !== token || run.status !== 'running') return false;
      if (clock.now() - startedAt > RUNTIME_CAP_MS) {
        capped = true;
        return false;
      }
      return true;
    };

    // Facts each verify reads after its step's gesture. Step-scoped: the
    // sequencer finishes one decision before it begins the next.
    let committedByGesture = false;
    let signatureBefore = '';
    let pickResult: { ok: boolean; reason?: string } = { ok: false };

    /**
     * The run's side of the shared choreography. `perform` owns the order —
     * gesture, verify, aim, press-and-land, verify, pacing — and these
     * gestures own only what is the tutorial's: the real page handlers, the
     * fault checks, the camera pins, and the banner's run state.
     */
    const gestures: Gestures = {
      selectTarget: async (index) => {
        const current = beats[index]!;
        run = { index, act: 'ask', status: 'running', problem: null };
        committedByGesture = false;
        // Move the graph first. Opening a contextual menu and then moving its
        // anchor made both surfaces chase each other across the canvas.
        await reveal(current.select);
        if (!alive()) return;
        // The hand PERFORMS the selection — the same gesture a learner's own
        // hand makes, dispatched by the same `performSelection` the lesson
        // hero uses. The gesture drives the page's real draft/marquee
        // handlers, so the committed selection is the handlers' own work;
        // only gestures the device truly supports are performed.
        const sel = current.select;
        if (pointer && liveGestures) {
          teach(gestureKind(sel, host.canDrag) ?? 'click');
          committedByGesture = await performSelection(pointer, liveGestures, sel, {
            canDrag: host.canDrag,
            pointTarget: () => host.pointTarget(sel),
          });
        } else if (pointer && host.pointTarget(sel)) {
          await pointer.moveToClient(() => host.pointTarget(sel));
          if (!alive()) return;
          await pointer.press();
        }
        if (!alive()) return;
        if (!committedByGesture) host.select(sel);
        await tick();
      },
      applySelection: () => {},
      verifySelection: async (index) => {
        const current = beats[index]!;
        if (committedByGesture) {
          // The gesture drove the page's own draft/marquee handlers — so the
          // handlers, not the drivers, decided what got selected. Prove the
          // commit matches the script before going on.
          const got = await until(
            () => host.selected(),
            (g) => !gestureFault(current.select, g),
            mine,
          );
          const fault = gestureFault(current.select, got);
          if (fault) return fault;
        }
        const seen = await until(
          () => host.offered(current.key),
          (o) => !!o?.found && o.pickable,
          mine,
        );
        return selectFault(current, seen);
      },
      aimOption: async (index) => {
        // The palette reports ARRIVAL at the row; the highlight lights as
        // the pointer lands, and the decide hold begins only then.
        await host.aimMenu(beats[index]!.key);
        if (!alive()) return;
        onpoint?.(beats[index]!.key);
      },
      applyChoice: async (index) => {
        const current = beats[index]!;
        gestureHint = null;
        run = { ...run, act: 'answer' };
        // The press IS the pick: the pointer lands (waiting out any glide
        // still in the air), dips, and the option is taken on the release.
        await pointer?.press();
        if (!alive()) return;
        const beforeAnchor = host.anchorRect();
        signatureBefore = host.signature();
        pickResult = host.pick(current.key);
        onpoint?.(null);
        await tick();
        const afterAnchor = host.anchorRect();
        if (beforeAnchor && afterAnchor) {
          // Adding the first childless phrase creates one extra diagram row.
          // Cancel that world-space change before the browser paints it, so
          // the words stay put while the new label appears above them.
          ws.viewport = pinTutorialRect(ws.viewport, afterAnchor, beforeAnchor);
        }
      },
      verifyChoice: async (index) => {
        const current = beats[index]!;
        const after = await until(
          () => host.signature(),
          (now) => now !== signatureBefore,
          mine,
        );
        return pickFault(current, pickResult, after !== signatureBefore);
      },
      closePalette: () => {},
      hold: (ms) => (ms > 0 ? pace(ms, mine) : Promise.resolve()),
    };

    const fault = await perform(beats.length, gestures, TUTORIAL_TIMING, alive);

    if (mine !== token) return;
    if (fault) run = fail(run, fault);
    else if (capped) run = fail(run, 'The tutorial ran longer than it should. Stopping.');
    else if (run.status === 'running') run = { ...run, status: 'done' };

    pointer?.rest();
    host.cancelGesture();
    gestureHint = null;
    if (run.status === 'done') {
      onactive?.(false);
      onpoint?.(null);
      await frameFinishedRun(mine);
      if (mine !== token) return;
      onfinish?.();
    }
    releaseStage();
  }

  function halt() {
    token++;
    camera.cancel();
    pointer?.rest();
    host.cancelGesture();
    gestureHint = null;
    setPaused(false);
    stepBudget = 0;
    // Close on a failure DISMISSES it: the learner has read the problem and
    // asked to move on, so the launcher must come back. `stopRun` keeps its
    // no-overwrite rule for races; this is an explicit dismissal, not a race.
    run = run.status === 'failed' ? { ...IDLE, status: 'stopped' } : stopRun(run);
    onactive?.(false);
    onpoint?.(null);
    releaseStage();
  }

  onDestroy(() => {
    token++;
    camera.cancel();
    pointer?.cancel();
    host.cancelGesture();
    // The clock is the page's, shared across runs — never cancel it, but do
    // not leave it paused either: a stranded pause would freeze the next
    // sentence's run and keep this run's final waits polling forever.
    // Resuming also releases any frame a pause was holding.
    clock.resume();
    // This component's frame source must not stay hooked to the shared clock.
    frames.dispose();
    onactive?.(false);
    onpoint?.(null);
    releaseStage();
  });
</script>

<!-- Only the arrowed invitation yields to an open palette: it hangs centre
     stage where the popup can land. The quiet pill is a toolbar control like
     the view toggle beside it, and a toolbar that blinks away on every click
     reads as a glitch, so it holds its place. -->
{#if !docked && (run.status === 'idle' || run.status === 'stopped' || run.status === 'done') && !(obscured && launcher.arrow)}
  <div class="launch-home" class:first={run.status === 'idle' && launcher.arrow}>
    {#if run.status === 'idle' && launcher.arrow}
      <div class="start-here" aria-hidden="true">
        <span>Start here</span>
        <svg viewBox="0 0 76 32" role="presentation">
          <path d="M2 27 C 27 31, 49 28, 59 7" />
          <path d="M51 13 L 60 5 L 64 16" />
        </svg>
      </div>
    {/if}
    <button class="launch" class:quiet={launcher.tone === 'quiet'} type="button" onclick={play}>
      <GraduationCap size={15} strokeWidth={1.9} aria-hidden="true" />
      {run.status === 'idle' ? launcher.label : 'Watch it again'}
    </button>
  </div>
{/if}

{#if running || run.status === 'failed'}
  <!-- `data-stage-occluder` declares this banner to the palette's phone
       camera planner (LabelPanel), which plans its safe area beneath
       whatever carries the attribute. -->
  <div class="banner" bind:this={banner} data-stage-occluder role="status" aria-live="polite">
    <div class="bar" aria-hidden="true"><span style="width:{bar * 100}%"></span></div>
    <div class="inner">
      <div class="words">
        {#if run.status === 'failed'}
          <p class="eyebrow">The tutorial stopped</p>
          <p class="big">{run.problem}</p>
        {:else if beat}
          <p class="eyebrow">
            Step {run.index + 1} of {beats.length}{#if run.act === 'ask' && gestureHint}
              <span class="gesture">· {gestureHint}</span>{/if}
          </p>
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
  /* The launcher sits between the two sidebar controls, which own the corners.
     Above the canvas, BELOW the palette (desktop popup z30, phone sheet z45):
     when the menu rises under the pill, the menu wins — a toolbar control
     never covers the question being asked. The run's own chrome is untouched:
     the banner (z45) and the guided pointer (z48) exist only while the run is
     on stage, when this launcher is not mounted at all. */
  .launch-home {
    position: absolute;
    top: 8px;
    left: 50%;
    z-index: 20;
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
  /* A toolbar control, not an invitation: flush with the top row and cut
     from the same cloth as the view toggle beside it. */
  .launch.quiet {
    min-height: 34px;
    padding: 3px 13px;
    background: color-mix(in oklab, var(--panel) 94%, transparent);
    font-size: 11px;
    font-weight: 600;
    backdrop-filter: blur(10px);
  }

  /* Sized by its words: the explanation is the point of the run, so the box
     grows to hold every word rather than clipping the third line. It is also
     its own container — the stage's center pane can be narrow on a wide
     screen (sidebars, browser zoom), so compactness follows the banner's own
     width, never the viewport's. */
  .banner {
    position: absolute;
    top: 8px;
    right: 44px;
    left: 44px;
    z-index: 45;
    overflow: hidden;
    min-height: 108px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--panel);
    box-shadow: 0 6px 24px oklch(0 0 0 / 22%);
    container-type: inline-size;
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
  .eyebrow .gesture {
    color: var(--accent);
    text-transform: none;
    letter-spacing: 0.02em;
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

  @container (max-width: 560px) {
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

  @media (max-width: 700px) {
    .launch-home.first {
      top: 96px;
    }
    .banner {
      right: 8px;
      left: 8px;
    }
  }
</style>
