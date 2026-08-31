<script lang="ts">
  /**
   * The wordless demonstration under a lesson title — presented to fit the
   * reader's screen.
   *
   * On a desktop the article has room to carry the performance inline, so it
   * autoplays there exactly as before. On a phone it must not: the palette's
   * phone presentation is a fixed bottom sheet, and a passive demonstration
   * that parks a half-viewport sheet over an article the reader is trying to
   * scroll is the animation demanding attention the prose has already earned.
   *
   * So at the phone breakpoint the article gets a QUIET poster — the finished
   * diagram, in normal document flow, with nothing fixed and nothing moving —
   * and one explicit control. Only when the reader asks does the performance
   * open, as a full-screen surface with its own Play/Pause and Close, scroll
   * locked behind it, and everything cancelled and unmounted the moment it
   * closes. Opening again starts from the first decision: the stage inside
   * is a fresh mount each time.
   */
  import Play from '@lucide/svelte/icons/play';
  import Pause from '@lucide/svelte/icons/pause';
  import X from '@lucide/svelte/icons/x';

  import type { Reading, SentenceEntry } from '../grammar/types.ts';
  import { PHONE_QUERY, useMediaQuery } from '../workspace/responsive.svelte.ts';
  import { getWorkspace } from '../workspace/workspace.svelte.ts';
  import HeroStage from './HeroStage.svelte';
  import StaticFigure from './StaticFigure.svelte';

  /** The pruned tree, when the lesson shows only part of the parse. */
  type Props = { sentence: SentenceEntry; reading?: Reading };
  let { sentence, reading }: Props = $props();

  const phone = useMediaQuery(PHONE_QUERY);
  /**
   * The surface the article scrolls in is the workspace's document pane, and
   * the workspace owns it — so the takeover asks for the lock through shared
   * state instead of walking ancestors and stomping their overflow styles.
   */
  const ws = getWorkspace();

  let open = $state(false);
  let paused = $state(false);
  let launch = $state<HTMLButtonElement | null>(null);
  let playToggle = $state<HTMLButtonElement | null>(null);
  let closeButton = $state<HTMLButtonElement | null>(null);

  function openDemo() {
    if (ws) ws.scrollLocked = true;
    paused = false;
    open = true;
  }

  function closeDemo() {
    open = false;
    if (ws) ws.scrollLocked = false;
    // The reader left off at the launch control; put them back there.
    launch?.focus();
  }

  function onkeydown(event: KeyboardEvent) {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDemo();
      return;
    }
    // A modal holds the keyboard: Tab cycles its two controls and nothing
    // reaches the article behind the takeover.
    if (event.key === 'Tab') {
      event.preventDefault();
      const at = document.activeElement;
      const next = event.shiftKey
        ? at === playToggle
          ? closeButton
          : playToggle
        : at === closeButton
          ? playToggle
          : closeButton;
      next?.focus();
    }
  }

  /** The modal takes the keyboard when it opens, starting at Pause/Play. */
  $effect(() => {
    if (open) playToggle?.focus();
  });

  /**
   * Rotating a phone to landscape leaves the phone breakpoint, which swaps
   * this figure to its inline presentation — so the takeover must close
   * properly on the way out, or its scroll locks outlive the surface that
   * owned them.
   */
  $effect(() => {
    if (!phone.matches && open) closeDemo();
  });

  /**
   * Leaving the page with the takeover open must still release the scroll
   * lock — and must not try to focus a launch button that no longer exists.
   */
  $effect(() => {
    return () => {
      if (ws) ws.scrollLocked = false;
    };
  });
</script>

<svelte:window {onkeydown} />

{#if !phone.matches}
  <figure
    class="hero"
    aria-label="A diagram of “{sentence.text}” being built, one decision at a time"
  >
    <HeroStage {sentence} {reading} mode="inline" />
  </figure>
{:else}
  <figure class="hero poster" aria-label="The finished diagram of “{sentence.text}”">
    <StaticFigure {sentence} {reading} />
    <button class="watch" type="button" bind:this={launch} onclick={openDemo}>
      <Play size={13} strokeWidth={2.2} aria-hidden="true" />
      Watch how this is built
    </button>
  </figure>

  {#if open}
    <div
      class="demo"
      role="dialog"
      aria-modal="true"
      aria-label="A demonstration of “{sentence.text}” being built, one decision at a time"
    >
      <!-- A fresh mount per open: closing cancels and discards everything,
           so watching again always starts from the first decision. -->
      <HeroStage {sentence} {reading} mode="overlay" {paused} />
      <div class="demo-controls">
        <button
          type="button"
          bind:this={playToggle}
          aria-label={paused ? 'Play demonstration' : 'Pause demonstration'}
          aria-pressed={paused}
          onclick={() => (paused = !paused)}
        >
          {#if paused}
            <Play size={14} strokeWidth={2.2} aria-hidden="true" />
          {:else}
            <Pause size={14} strokeWidth={2.2} aria-hidden="true" />
          {/if}
          <span>{paused ? 'Play' : 'Pause'}</span>
        </button>
        <button
          type="button"
          bind:this={closeButton}
          aria-label="Close demonstration"
          onclick={closeDemo}
        >
          <X size={14} strokeWidth={2.2} aria-hidden="true" />
          <span>Close</span>
        </button>
      </div>
    </div>
  {/if}
{/if}

<style>
  .hero {
    width: 100%;
    margin: 0;
  }

  .poster {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  /* The preview is a poster, not the show: cap the diagram so the lesson's
     first paragraph stays in reach on tall-diagram sentences. The fluid SVG
     scales whole through its viewBox — nothing is cropped. */
  .poster :global(svg.diagram) {
    max-height: 420px;
    max-height: min(46svh, 420px);
  }

  .watch {
    display: inline-flex;
    gap: 7px;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--panel);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 550;
    box-shadow: 0 2px 10px oklch(0 0 0 / 14%);
    cursor: pointer;
  }
  .watch:hover,
  .watch:focus-visible {
    border-color: var(--border-strong);
  }

  .demo {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 90;
    display: flex;
    flex-direction: column;
    width: 100vw;
    width: 100dvw;
    height: 100vh;
    height: 100dvh;
    /* The lesson column caps its children to the reading measure; a viewport
       takeover is exactly the child that rule must not reach. */
    max-width: none;
    /* Opaque on purpose: a transparent takeover draws the demonstration over
       the article it was supposed to replace. */
    background: var(--canvas);
  }
  .demo :global(> .stage) {
    flex: 1;
    min-height: 0;
  }

  .demo-controls {
    position: absolute;
    top: max(8px, env(safe-area-inset-top));
    right: 8px;
    z-index: 95;
    display: flex;
    gap: 8px;
  }
  .demo-controls button {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    min-height: 36px;
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--panel);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: 12px;
    box-shadow: 0 2px 10px oklch(0 0 0 / 18%);
    cursor: pointer;
  }
</style>
