<script lang="ts">
  /**
   * A contextual two-pane label palette.
   *
   * The left pane contains the grammatical decisions; the equally sized right
   * pane contains the labels for the active decision. Context, suggestions,
   * feedback, and the one description currently worth reading share a stable
   * header across both panes. The palette itself stays in screen space while
   * its anchor follows the selected SVG element through pan and zoom.
   */
  import Check from '@lucide/svelte/icons/check';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import X from '@lucide/svelte/icons/x';
  import { onDestroy, untrack } from 'svelte';

  import { createCameraMotion } from '../workspace/camera-motion.ts';
  import { getWorkspace } from '../workspace/workspace.svelte.ts';
  import { placeFloating, screenRect } from '../workspace/floating.ts';
  import { PHONE_QUERY, useMediaQuery, useVisualViewport } from '../workspace/responsive.svelte.ts';
  import { planSelectionVisibility, usableViewport } from '../workspace/selection-visibility.ts';
  import type { Rect } from '../workspace/viewport.ts';
  import {
    byHotkey,
    bestIndex,
    isPickable,
    openingGroup,
    type LabelOption,
    type OptionGroup,
    type Panel,
  } from './options.ts';
  import { activeGroupAfterAnswer, menuOptionState } from './panel-presentation.ts';

  export interface Verdict {
    kind: 'correct' | 'alternate' | 'wrong';
    text: string;
    test?: string;
  }

  type Props = {
    panel: Panel;
    anchor?: Rect | null;
    /** Complete selection bounds used to keep the work visible on phones. */
    focus?: Rect | null;
    /** Multi-word selections may zoom out; a single item only pans. */
    fit?: boolean;
    /** A protected world-space region, normally the complete sentence row. */
    avoid?: Rect | null;
    /** A stable screen-space home supplied by a guided layout. */
    placement?: Pick<Rect, 'x' | 'y' | 'h'> | null;
    /** The surrounding guide owns the camera while it is running. */
    manageCamera?: boolean;
    verdict?: Verdict | null;
    /**
     * Show an option as if the pointer were on it, by option key.
     *
     * For a demonstration that drives this panel rather than a person driving
     * it. The lesson hero shows the real palette doing real work, so it needs
     * to say where the pointer is; everything else about the panel stays
     * identical, which is the point.
     */
    pointerOn?: string | null;
    /**
     * A driven panel is watched, not used. It must not claim the keyboard or
     * close on a click elsewhere, or a demonstration on a reading page would
     * swallow keystrokes meant for the page.
     */
    interactive?: boolean;
    onpick: (option: LabelOption) => void;
    onhover?: (option: LabelOption | null) => void;
    onclose?: () => void;
  };

  let {
    panel,
    anchor = null,
    focus = null,
    fit = false,
    avoid = null,
    placement = null,
    manageCamera = true,
    verdict = null,
    pointerOn = null,
    interactive = true,
    onpick,
    onhover,
    onclose,
  }: Props = $props();

  const ws = getWorkspace();
  const phone = useMediaQuery(PHONE_QUERY);
  const visualViewport = useVisualViewport();
  let root = $state<HTMLDivElement | null>(null);
  /** Where focus was when the palette opened, so it can be given back. */
  let cameFrom: HTMLElement | null = null;

  /**
   * A dialog has to take focus and give it back.
   *
   * Without this a keyboard user opened the palette and stayed on the diagram:
   * the dialog announced itself and none of its controls were reachable in
   * order, and closing it left focus wherever the DOM happened to put it.
   *
   * The driven copy in the lesson hero never does this. It is being
   * demonstrated, not used, and stealing focus from someone reading the page
   * would be the same bug in the other direction.
   */
  $effect(() => {
    if (!interactive || !root || !anchor) return;
    const active = document.activeElement;
    cameFrom = active instanceof HTMLElement ? active : null;
    if (!root.contains(active)) root.focus({ preventScroll: true });
    return () => {
      // Only if focus is still inside the thing that is going away; a learner
      // who has already clicked elsewhere should be left where they are.
      if (cameFrom?.isConnected && root?.contains(document.activeElement)) {
        cameFrom.focus({ preventScroll: true });
      }
    };
  });
  let activeId = $state<string | null>(null);
  let activeSubject = '';
  let cursor = $state(0);
  let pointed = $state<LabelOption | null>(null);
  let mobileDetail = $state(false);
  const camera = createCameraMotion(
    () => ws.viewport,
    (viewport) => (ws.viewport = viewport),
  );
  onDestroy(camera.cancel);

  const active = $derived(openingGroup(panel, activeId));
  const reachable = $derived(active?.options.filter(isPickable) ?? []);
  const suggestions = $derived(
    (
      panel.groups
        .find((g) => g.id === panel.step)
        ?.options.filter((o) => o.state === 'suggested') ?? []
    ).sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)),
  );
  /** A driven pointer wins over the real one, and neither exists at rest. */
  const shown = $derived(
    pointerOn
      ? (panel.groups.flatMap((g) => g.options).find((o) => o.key === pointerOn) ?? null)
      : pointed,
  );
  const detail = $derived(shown ?? reachable[cursor] ?? suggestions[0] ?? null);

  $effect(() => {
    const subjectChanged = activeSubject !== panel.subject;
    activeId = activeGroupAfterAnswer(
      untrack(() => activeId),
      subjectChanged,
      panel.step,
      verdict?.kind ?? null,
    );
    activeSubject = panel.subject;
    pointed = null;
    // A guided phone run has no pointer to open the second pane. Put the real
    // option rows on screen directly so the highlighted answer is visible.
    mobileDetail = !interactive && phone.matches;
  });

  $effect(() => {
    void [activeId, panel.subject];
    cursor = bestIndex(reachable);
  });

  $effect(() => {
    if (interactive || !phone.matches || !pointerOn || !root) return;
    const frame = requestAnimationFrame(() => {
      const option = Array.from(
        root?.querySelectorAll<HTMLButtonElement>('[data-option]') ?? [],
      ).find((row) => row.dataset.option === pointerOn);
      option?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    return () => cancelAnimationFrame(frame);
  });

  const GROUP_NAME: Record<string, string> = {
    'word-class': 'Word class',
    'phrase-form': 'Phrase type',
    'verb-type': 'Verb type',
    function: 'Syntactic function',
  };

  type Section = { name: string; options: LabelOption[] };

  /**
   * The menu, in sections.
   *
   * Every group ends with whatever the named lists did not claim. A row the
   * panel offers and the menu does not draw is a row nobody can pick, and three
   * were being dropped in silence: `Nom` and `DP`, which the corpus uses.
   */
  function section(g: OptionGroup): Section[] {
    // A plain array, not a Set: this runs inside a pure function over a list of
    // at most twenty rows, and Svelte's reactivity rule reads any Set here as
    // state it has to track.
    const taken: string[] = [];
    const take = (name: string, keys: readonly string[]) => {
      const options = g.options.filter((o) => keys.includes(o.form ?? o.func ?? ''));
      for (const o of options) taken.push(o.key);
      return { name, options };
    };
    const rest = (named: Section[]): Section[] =>
      [...named, { name: '', options: g.options.filter((o) => !taken.includes(o.key)) }].filter(
        (s) => s.options.length > 0,
      );

    if (g.id === 'word-class') {
      return rest([
        take('Content words', ['N', 'V', 'Adj', 'Adv']),
        take('Function words', ['Det', 'Pron', 'Aux', 'P', 'Conj', 'Subord', 'Part']),
        take('Other', ['Num', 'Interj']),
      ]);
    }
    if (g.id === 'phrase-form') {
      return rest([
        take('Phrases', ['NP', 'Nom', 'DP', 'VP', 'PP', 'AdjP', 'AdvP']),
        take('Clausal forms', ['S', 'Cl']),
      ]);
    }
    if (g.id === 'function') {
      return rest([
        take('Clause roles', [
          'subject',
          'predicate',
          'directObject',
          'indirectObject',
          'subjectComplement',
          'objectComplement',
          'adverbial',
        ]),
        take('Inside a phrase', [
          'head',
          'determiner',
          'premodifier',
          'postmodifier',
          'complement',
          'coordinate',
          'appositive',
        ]),
      ]);
    }
    return [{ name: '', options: g.options }];
  }

  const sections = $derived(active ? section(active) : []);

  function choose(o: LabelOption) {
    if (!isPickable(o)) return;
    onpick(o);
    pointed = null;
    onhover?.(null);
  }

  function openGroup(id: string) {
    activeId = id;
    pointed = null;
    if (phone.matches) mobileDetail = true;
  }

  function point(o: LabelOption | null) {
    pointed = o;
    if (o && isPickable(o)) {
      const i = reachable.indexOf(o);
      if (i >= 0) cursor = i;
    }
    onhover?.(o);
  }

  function optionKey(e: KeyboardEvent, option: LabelOption) {
    const at = Math.max(0, reachable.indexOf(option));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cursor = Math.min(reachable.length - 1, at + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      cursor = Math.max(0, at - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(option);
      return;
    } else {
      return;
    }
    const next = reachable[cursor];
    if (next) root?.querySelector<HTMLButtonElement>(`[data-option="${next.key}"]`)?.focus();
  }

  function globalKey(e: KeyboardEvent) {
    const t = e.target;
    if (
      t instanceof HTMLElement &&
      (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))
    ) {
      return;
    }
    if (!interactive) return;
    if (e.key === 'Escape' && anchor) {
      e.preventDefault();
      onclose?.();
      return;
    }
    if (!/^[1-9]$/.test(e.key) || e.metaKey || e.ctrlKey || e.altKey || !anchor) return;
    const hit = byHotkey(panel, e.key);
    if (hit) {
      e.preventDefault();
      choose(hit);
    }
  }

  function outside(e: PointerEvent) {
    if (!interactive) return;
    if (root && !root.contains(e.target as Node)) onclose?.();
  }

  const POPUP = { w: 448, h: 318 };

  /** Choose the side with the least overflow, preferring below and above. */
  const position = $derived.by(() => {
    if (placement) return placement;
    if (!anchor || ws.stage.w === 0) return { x: 0, y: 0 };
    const a = screenRect(ws.viewport, anchor);
    return placeFloating(a, avoid ? screenRect(ws.viewport, avoid) : a, POPUP, ws.stage);
  });

  /**
   * Reframe only after committed selection/layout or sheet geometry changes.
   * Camera writes are untracked so the animation cannot retrigger itself.
   */
  $effect(() => {
    void [
      panel.subject,
      activeId,
      mobileDetail,
      verdict?.text,
      focus?.x,
      focus?.y,
      focus?.w,
      focus?.h,
      ws.stage.w,
      ws.stage.h,
      visualViewport.rect.x,
      visualViewport.rect.y,
      visualViewport.rect.w,
      visualViewport.rect.h,
    ];
    camera.cancel();
    if (!manageCamera || !phone.matches || !root || !focus) return;

    const frame = requestAnimationFrame(() => {
      if (!root || !focus) return;
      const stage = root.closest<HTMLElement>('main');
      if (!stage) return;
      const stageBox = stage.getBoundingClientRect();
      const sheet = root.getBoundingClientRect();
      const visualBottom = visualViewport.rect.h
        ? visualViewport.rect.y + visualViewport.rect.h - stageBox.top
        : stageBox.height;
      const visualLeft = visualViewport.rect.w ? visualViewport.rect.x - stageBox.left : 0;
      const visualRight = visualViewport.rect.w
        ? visualViewport.rect.x + visualViewport.rect.w - stageBox.left
        : stageBox.width;
      let top = 12;
      for (const control of stage.querySelectorAll<HTMLElement>('.reopen, [data-stage-occluder]')) {
        const box = control.getBoundingClientRect();
        if (box.width > 0 && box.height > 0) top = Math.max(top, box.bottom - stageBox.top + 12);
      }
      const safe = usableViewport(
        { w: stageBox.width, h: Math.min(stageBox.height, visualBottom) },
        {
          top,
          right: Math.min(stageBox.width - 16, visualRight - 16),
          bottom: sheet.top - stageBox.top - 20,
          left: Math.max(16, visualLeft + 16),
        },
      );
      // A short phone may leave only one word-height above a long option list.
      // That is still useful space; rejecting it recreates the overlap this
      // planner exists to prevent.
      if (safe.w < 44 || safe.h < 40) return;
      const current = untrack(() => ({ ...ws.viewport }));
      const plan = planSelectionVisibility(current, focus, safe, fit ? 'fit' : 'reveal');
      if (!plan.changed) return;
      camera.moveTo(plan.viewport, {
        duration: 200,
        immediate: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    });
    return () => cancelAnimationFrame(frame);
  });

  const information = $derived.by(() => {
    if (verdict) return [verdict.text, verdict.test].filter(Boolean).join(' ');
    if (panel.blocked) return panel.blocked;
    if (detail?.note) return detail.note;
    // The question is already on the line above, unless suggestions took that
    // line instead. Repeating it printed it twice, one grey copy under another.
    return suggestions.length > 0 ? (active?.question ?? panel.prompt) : panel.prompt;
  });

  /**
   * The line under the question, and what it says when nothing is urgent.
   *
   * A verdict wins, and so does a reason a pick is refused — both are about
   * the decision in front of the learner. Otherwise, for a RUN of words, the
   * space is better spent performing a test than describing one: a run that is
   * one thing survives being singled out, and the learner hears that without
   * being graded. A single word never gets one, because there is nothing about
   * a single word that a constituency test could prove.
   *
   * One line either way. The panel is short on purpose, and showing the test
   * and the same test performed would be saying it twice.
   */
  const performed = $derived(interactive && !verdict && !panel.blocked ? panel.singledOut : null);
</script>

<svelte:window onkeydown={globalKey} onpointerdown={outside} />

{#if anchor && active}
  <div
    bind:this={root}
    class="popup"
    class:guided={!!placement}
    style="left:{position.x}px;top:{position.y}px;--guided-menu-h:{placement?.h ?? 318}px"
    role="dialog"
    tabindex="-1"
    inert={!interactive}
    aria-label="Label {panel.subject}"
  >
    <header class="context" class:wrong={verdict?.kind === 'wrong'}>
      <div class="subject-line">
        <strong>{panel.subject}</strong>
        {#if interactive}
          <button class="close" type="button" aria-label="Close label menu" onclick={onclose}>
            <X size={13} strokeWidth={2} />
          </button>
        {/if}
      </div>

      <div class="suggestion-line">
        {#if suggestions.length > 0}
          <span class="eyebrow">Likely</span>
          {#each suggestions as o (o.key)}
            <button class="suggestion" type="button" onclick={() => choose(o)}>
              {#if o.hotkey}<kbd>{o.hotkey}</kbd>{/if}
              {o.label}
            </button>
          {/each}
        {:else}
          <span class="question">{active.question}</span>
        {/if}
      </div>

      <!-- The teaching loop, spoken. The verdict changes the look of the line
           below and nothing announced it, so a screen-reader user was graded in
           silence. Its own region rather than the information line, because
           that line also carries every note the pointer passes over and
           announcing those would be noise. -->
      <p class="sr" role="status" aria-live="polite">
        {verdict ? [verdict.text, verdict.test].filter(Boolean).join(' ') : ''}
      </p>

      {#if performed}
        <p class="information tryit">
          <span class="eyebrow">Say it</span>{performed.text}
        </p>
      {:else}
        <p class="information" class:status={!!verdict}>{information}</p>
      {/if}
    </header>

    <div class="menu-panes" class:mobile-detail={mobileDetail}>
      <nav class="pane primary" aria-label="Label categories">
        {#each panel.groups as g (g.id)}
          <button
            type="button"
            class="category"
            class:active={g.id === active.id}
            aria-current={g.id === active.id ? 'true' : undefined}
            onclick={() => openGroup(g.id)}
          >
            <span>
              <span class="category-name">{GROUP_NAME[g.id] ?? g.question}</span>
              {#if g.answered}<span class="answer">{g.answered.label}</span>{/if}
            </span>
            <ChevronRight size={13} strokeWidth={2} aria-hidden="true" />
          </button>
        {/each}
      </nav>

      <div class="pane secondary" aria-label={active.question}>
        <div class="pane-title">
          <button
            class="mobile-back"
            type="button"
            aria-label="Back to label categories"
            onclick={() => {
              mobileDetail = false;
              pointed = null;
            }}
          >
            <ChevronLeft size={17} strokeWidth={2} />
          </button>
          <span>{GROUP_NAME[active.id] ?? active.question}</span>
        </div>
        <!-- Buttons, not a listbox. A listbox owns only options, and these are
             grouped under headings that a learner needs to hear — so the
             simpler semantics are also the true ones. `aria-pressed` says
             which answer has been given, which is what `chosen` means. -->
        <div class="options">
          {#each sections as s (s.name)}
            {#if s.name}<h3>{s.name}</h3>{/if}
            {#each s.options as o (o.key)}
              {@const rowState = menuOptionState(o.state)}
              <button
                class="option {rowState}"
                class:pointed={shown?.key === o.key}
                data-option={o.key}
                type="button"
                aria-pressed={o.state === 'chosen'}
                aria-disabled={!isPickable(o)}
                onclick={() => choose(o)}
                onpointerenter={() => {
                  if (!phone.matches) point(o);
                }}
                onpointerleave={() => {
                  if (!phone.matches) point(null);
                }}
                onfocus={() => point(o)}
                onblur={() => point(null)}
                onkeydown={(e) => optionKey(e, o)}
              >
                <span class="option-label">
                  <span>{o.label}</span>
                </span>
                {#if o.state === 'chosen'}<Check size={13} strokeWidth={2.25} />{/if}
                {#if o.note}<span class="sr">{o.note}</span>{/if}
              </button>
            {/each}
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .popup {
    position: absolute;
    z-index: 30;
    width: 448px;
    overflow: hidden;
    border: 1px solid var(--border-strong);
    border-radius: 8px;
    background: var(--panel);
    color: var(--ink);
    box-shadow:
      0 16px 42px oklch(0 0 0 / 34%),
      0 2px 8px oklch(0 0 0 / 22%);
    user-select: none;
  }

  .popup.guided {
    animation: guided-palette-in 160ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
  }

  @keyframes guided-palette-in {
    from {
      opacity: 0;
      transform: translateY(7px) scale(0.99);
    }
  }

  .context {
    box-sizing: border-box;
    height: 86px;
    padding: 9px 10px 8px;
    border-bottom: 1px solid var(--border);
  }
  .subject-line,
  .suggestion-line {
    display: flex;
    align-items: center;
  }
  .subject-line {
    min-height: 18px;
  }
  .subject-line strong {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 600;
  }
  .close {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    margin-left: auto;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--ink-faint);
  }
  .close:hover {
    background: color-mix(in oklab, var(--ink) 8%, transparent);
    color: var(--ink);
  }
  .suggestion-line {
    min-height: 23px;
    gap: 6px;
  }
  .eyebrow {
    color: var(--ink-faint);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .suggestion {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 2px 7px 2px 4px;
    border: 1px solid color-mix(in oklab, var(--accent) 55%, var(--border));
    border-radius: 999px;
    background: color-mix(in oklab, var(--accent) 14%, transparent);
    color: var(--ink);
    font: inherit;
    font-size: 10.5px;
    font-weight: 600;
  }
  .question {
    color: var(--ink-muted);
    font-size: 10.5px;
  }
  .tryit {
    font-style: italic;
  }

  .tryit .eyebrow {
    margin-right: 6px;
    font-style: normal;
  }

  .information {
    flex: 1;
    min-width: 0;
    height: 15px;
    margin: 1px 0 0;
    overflow: hidden;
    color: var(--ink-faint);
    font-size: 10px;
    line-height: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .information.status {
    color: var(--success);
  }
  .context.wrong .information {
    color: var(--failure);
  }
  .mobile-back {
    display: none;
  }

  .menu-panes {
    display: grid;
    grid-template-columns: 224px 224px;
  }
  .pane {
    box-sizing: border-box;
    height: 230px;
    min-width: 0;
    overflow-y: auto;
  }
  .primary {
    padding: 6px;
    border-right: 1px solid var(--border);
  }
  .secondary {
    padding-bottom: 6px;
  }
  .category {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 42px;
    gap: 8px;
    padding: 6px 7px 6px 9px;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: var(--ink-muted);
    font: inherit;
    text-align: left;
  }
  .category > span:first-child {
    flex: 1;
    min-width: 0;
  }
  .category-name,
  .answer {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .category-name {
    font-size: 11px;
    font-weight: 500;
  }
  .answer {
    margin-top: 2px;
    color: var(--ink-faint);
    font-size: 9.5px;
  }
  .category:hover {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
    color: var(--ink);
  }
  .category.active {
    background: color-mix(in oklab, var(--accent) 18%, transparent);
    color: var(--ink);
  }
  .category.active .answer {
    color: color-mix(in oklab, var(--accent) 60%, var(--ink-faint));
  }

  .pane-title {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 9px 10px 7px;
    background: var(--panel);
    color: var(--ink);
    font-size: 11px;
    font-weight: 600;
  }
  h3 {
    margin: 6px 10px 3px;
    color: var(--ink-faint);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.055em;
    text-transform: uppercase;
  }
  .option {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 28px;
    padding: 4px 10px;
    border: 0;
    border-left: 2px solid transparent;
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 11px;
    text-align: left;
  }
  .option-label {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
    gap: 6px;
  }
  .option:hover,
  .option:focus-visible,
  .option.pointed {
    background: color-mix(in oklab, var(--ink) 8%, transparent);
    outline: 0;
  }
  .option.chosen {
    background: color-mix(in oklab, var(--accent) 15%, transparent);
    color: var(--ink);
  }
  .option.chosen :global(svg) {
    color: var(--accent);
  }
  .option.blocked,
  .option.untaught {
    color: var(--ink-faint);
  }
  .option.untaught {
    opacity: 0.48;
  }
  kbd {
    display: grid;
    place-items: center;
    min-width: 15px;
    height: 15px;
    padding: 0 3px;
    border-radius: 3px;
    background: var(--accent);
    color: var(--accent-ink);
    font: inherit;
    font-size: 9px;
    font-weight: 700;
  }
  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (max-width: 700px) {
    :global(main:has(.popup) [role='toolbar']) {
      visibility: hidden;
      pointer-events: none;
    }
    .popup {
      position: fixed;
      right: max(8px, env(safe-area-inset-right));
      bottom: calc(var(--mobile-nav-h) + env(safe-area-inset-bottom) + 8px);
      left: max(8px, env(safe-area-inset-left)) !important;
      top: auto !important;
      z-index: 45;
      width: auto;
      max-height: calc(
        100svh - var(--mobile-nav-h) - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 24px
      );
      border-radius: 14px;
    }
    .popup.guided {
      max-height: min(
        var(--guided-menu-h),
        calc(
          100svh - var(--mobile-nav-h) - env(safe-area-inset-top) - env(safe-area-inset-bottom) -
            24px
        )
      );
    }
    .popup.guided .pane {
      max-height: max(72px, calc(var(--guided-menu-h) - 104px));
    }
    .popup.guided .mobile-back,
    .popup.guided h3 {
      display: none;
    }
    .popup.guided .pane-title {
      padding-left: 12px;
    }
    .context {
      height: auto;
      min-height: 104px;
      padding: 8px 10px 9px;
    }
    .subject-line {
      min-height: 44px;
    }
    .subject-line strong {
      font-size: 14px;
    }
    .close {
      width: 44px;
      height: 44px;
      margin-right: -8px;
    }
    .suggestion-line {
      min-height: 40px;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      touch-action: pan-x;
    }
    .suggestion {
      min-height: 44px;
      padding: 4px 12px 4px 6px;
      font-size: 12px;
      white-space: nowrap;
    }
    .information {
      height: auto;
      min-height: 20px;
      margin: 3px 0 0;
      font-size: 11px;
      line-height: 1.4;
      white-space: normal;
    }
    .menu-panes {
      display: block;
    }
    .pane {
      height: auto;
      max-height: min(42svh, 360px);
      overscroll-behavior: contain;
      touch-action: pan-y;
    }
    .primary {
      padding: 6px;
      border-right: 0;
    }
    .secondary {
      display: none;
    }
    .menu-panes.mobile-detail .primary {
      display: none;
    }
    .menu-panes.mobile-detail .secondary {
      display: block;
    }
    .category {
      min-height: 52px;
      padding: 7px 12px;
    }
    .category-name {
      font-size: 13px;
    }
    .answer {
      font-size: 11px;
    }
    .pane-title {
      display: flex;
      align-items: center;
      min-height: 48px;
      padding: 4px 10px 4px 4px;
      font-size: 13px;
    }
    .mobile-back {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      margin-right: 2px;
      padding: 0;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--ink-muted);
    }
    h3 {
      margin: 8px 12px 4px;
      font-size: 10px;
    }
    .option {
      min-height: 48px;
      padding: 7px 12px;
      font-size: 13px;
    }
    kbd {
      min-width: 22px;
      height: 22px;
      font-size: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .popup.guided {
      animation: none;
    }
  }
</style>
