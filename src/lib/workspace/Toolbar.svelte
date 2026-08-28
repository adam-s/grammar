<script lang="ts">
  /**
   * The floating toolbar.
   *
   * Every control here does something. A pill full of plausible-looking buttons
   * that are inert is how a workspace starts feeling like a mock-up, so tools
   * get added to this bar on the day they work, not before.
   */
  import MousePointer2 from '@lucide/svelte/icons/mouse-pointer-2';
  import Hand from '@lucide/svelte/icons/hand';
  import ZoomIn from '@lucide/svelte/icons/zoom-in';
  import ZoomOut from '@lucide/svelte/icons/zoom-out';
  import Scan from '@lucide/svelte/icons/scan';
  import { getWorkspace, type ToolId } from './workspace.svelte.ts';
  import { formatZoom, type Rect } from './viewport.ts';

  type Props = { content?: Rect };
  let { content }: Props = $props();

  const ws = getWorkspace();

  const tools: { id: ToolId; label: string; key: string; icon: typeof Hand }[] = [
    { id: 'select', label: 'Move', key: 'V', icon: MousePointer2 },
    { id: 'hand', label: 'Hand', key: 'H', icon: Hand },
  ];
</script>

<div class="bar" class:ready={ws.stageReady} role="toolbar" aria-label="Canvas tools">
  {#each tools as t (t.id)}
    {@const on = ws.tool === t.id}
    <button
      class="btn"
      class:on
      type="button"
      title="{t.label} — {t.key}"
      aria-label={t.label}
      aria-pressed={on}
      onclick={() => (ws.tool = t.id)}
    >
      <t.icon size={16} strokeWidth={1.75} />
    </button>
  {/each}

  <span class="sep" aria-hidden="true"></span>

  <button
    class="btn"
    type="button"
    title="Zoom out — ⌘−"
    aria-label="Zoom out"
    onclick={() => ws.zoomStep(-1)}
  >
    <ZoomOut size={16} strokeWidth={1.75} />
  </button>

  <button class="pct" type="button" title="Zoom to 100% — ⌘0" onclick={() => ws.resetZoom(content)}>
    {formatZoom(ws.viewport.z)}
  </button>

  <button
    class="btn"
    type="button"
    title="Zoom in — ⌘+"
    aria-label="Zoom in"
    onclick={() => ws.zoomStep(1)}
  >
    <ZoomIn size={16} strokeWidth={1.75} />
  </button>

  <button
    class="btn"
    type="button"
    title="Zoom to fit — ⇧1"
    aria-label="Zoom to fit"
    disabled={!content}
    onclick={() => content && ws.zoomToWhole(content)}
  >
    <Scan size={16} strokeWidth={1.75} />
  </button>
</div>

<style>
  .bar {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 5px;
    background: var(--raised);
    border: 1px solid var(--border);
    border-radius: 13px;
    box-shadow: 0 6px 22px oklch(0 0 0 / 32%);
    visibility: hidden;
  }
  .bar.ready {
    visibility: visible;
  }
  .btn,
  .pct {
    display: grid;
    place-items: center;
    height: 30px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: var(--ink-muted);
    font: inherit;
    cursor: default;
  }
  .btn {
    width: 32px;
  }
  .pct {
    min-width: 46px;
    padding: 0 8px;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }
  .btn:hover:not(:disabled),
  .pct:hover {
    background: color-mix(in oklab, var(--ink) 9%, transparent);
    color: var(--ink);
  }
  .btn.on {
    background: var(--accent);
    color: var(--accent-ink);
  }
  .btn:disabled {
    opacity: 0.35;
  }
  .sep {
    width: 1px;
    height: 18px;
    margin: 0 4px;
    background: var(--border);
  }

  @media (max-width: 700px) {
    .bar {
      bottom: 12px;
      padding: 4px;
    }
    .btn,
    .pct {
      height: 44px;
    }
    .btn {
      width: 44px;
    }
  }
</style>
