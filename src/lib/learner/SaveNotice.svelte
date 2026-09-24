<script lang="ts">
  /**
   * What the learner is told when saving goes wrong.
   *
   * Every storage error used to be swallowed, so a full or blocked store meant
   * drafts and checkmarks stopped being kept without a word. Two outcomes are
   * worth saying (see `saveKey` in store.ts):
   *
   * - `freed`: the store was full, older step histories were cleared to make
   *   room, and the save went through. Worth a quiet line, once.
   * - `failed`: nothing could be saved. The learner should know before they
   *   close the tab, and should have a way to keep their work.
   */
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
  import X from '@lucide/svelte/icons/x';

  let {
    state,
    onexport,
    ondismiss,
  }: {
    state: 'freed' | 'failed';
    onexport: () => void;
    ondismiss: () => void;
  } = $props();
</script>

<div class="notice" class:failed={state === 'failed'} role="status" data-stage-chrome>
  {#if state === 'failed'}
    <TriangleAlert size={15} strokeWidth={2.2} aria-hidden="true" />
    <p>
      <strong>Your progress isn’t being saved in this browser.</strong>
      Its storage is full or turned off. Export your progress to keep it.
    </p>
    <button class="export" type="button" onclick={onexport}>Export progress</button>
  {:else}
    <p>
      Storage was full, so older step histories were cleared. Your drafts and checkmarks are safe.
    </p>
  {/if}
  <button class="dismiss" type="button" aria-label="Hide this message" onclick={ondismiss}>
    <X size={13} strokeWidth={2} aria-hidden="true" />
  </button>
</div>

<style>
  .notice {
    display: flex;
    position: absolute;
    bottom: 56px;
    left: 50%;
    z-index: 47;
    box-sizing: border-box;
    width: max-content;
    max-width: min(560px, calc(100% - 16px));
    gap: 10px;
    align-items: center;
    padding: 8px 8px 8px 12px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--raised);
    color: var(--ink);
    box-shadow: 0 6px 22px oklch(0 0 0 / 24%);
    font-size: 12px;
    line-height: 1.4;
    transform: translateX(-50%);
  }
  .notice.failed {
    border-color: color-mix(in oklab, var(--failure) 55%, var(--border));
  }
  /* The warning icon only; the dismiss button's X stays neutral. */
  .notice.failed > :global(svg) {
    flex: none;
    color: var(--failure);
  }
  p {
    margin: 0;
  }
  .export {
    flex: none;
    min-height: 30px;
    padding: 0 12px;
    border: 0;
    border-radius: 999px;
    background: var(--accent);
    color: var(--accent-ink);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .dismiss {
    display: grid;
    flex: none;
    place-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--ink-muted);
    cursor: pointer;
  }
  .dismiss:hover {
    background: color-mix(in oklab, var(--ink) 8%, transparent);
    color: var(--ink);
  }
  /* Above the phone's two bottom bars, with finger-sized controls. */
  @media (max-width: 700px) {
    .notice {
      bottom: 136px;
    }
    .export,
    .dismiss {
      min-height: 44px;
    }
    .dismiss {
      width: 44px;
    }
  }
</style>
