<script lang="ts">
  /**
   * Theme control for the top bar.
   *
   * A menu rather than a click-to-cycle button: cycling through three states
   * gives no way to see which one you are in without watching the page change,
   * and `system` in particular looks identical to whichever theme it currently
   * resolves to. The trigger wears the resolved icon; the menu says why.
   */
  import Sun from '@lucide/svelte/icons/sun';
  import Moon from '@lucide/svelte/icons/moon';
  import Monitor from '@lucide/svelte/icons/monitor';
  import { theme } from './theme.svelte.ts';
  import { THEME_PREFS, type ThemePref } from './theme.ts';

  const ICON = { light: Sun, dark: Moon, system: Monitor };
  const LABEL: Record<ThemePref, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'Match system',
  };

  let open = $state(false);
  let el = $state<HTMLDivElement | null>(null);

  $effect(() => theme.watchSystem());

  const Trigger = $derived(ICON[theme.resolved]);

  function choose(p: ThemePref) {
    theme.set(p);
    open = false;
  }
</script>

<!-- Close on any press outside, tested by containment rather than by stopping
     propagation inside — a wrapper that swallows events also swallows them for
     everything else listening on the window. -->
<svelte:window
  onpointerdown={(e) => {
    if (open && el && !el.contains(e.target as Node)) open = false;
  }}
  onkeydown={(e) => {
    if (open && e.key === 'Escape') open = false;
  }}
/>

<div class="theme" bind:this={el}>
  <button
    class="icon"
    type="button"
    aria-haspopup="menu"
    aria-expanded={open}
    aria-label="Theme — {LABEL[theme.pref].toLowerCase()}"
    title="Theme"
    onclick={() => (open = !open)}
  >
    <Trigger size={14} strokeWidth={1.75} />
  </button>

  {#if open}
    <ul class="menu" role="menu">
      {#each THEME_PREFS as p (p)}
        {@const Icon = ICON[p]}
        <li>
          <button
            class="item"
            class:on={theme.pref === p}
            type="button"
            role="menuitemradio"
            aria-checked={theme.pref === p}
            onclick={() => choose(p)}
          >
            <Icon size={12} strokeWidth={1.75} aria-hidden="true" />
            <span>{LABEL[p]}</span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .theme {
    position: relative;
    display: flex;
  }
  .icon {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-muted);
    cursor: default;
  }
  .icon:hover {
    background: color-mix(in oklab, var(--ink) 8%, transparent);
    color: var(--ink);
  }
  .menu {
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    z-index: 30;
    margin: 0;
    padding: 4px;
    min-width: 132px;
    list-style: none;
    background: var(--raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: 0 8px 24px oklch(0 0 0 / 35%);
  }
  .item {
    display: flex;
    align-items: center;
    gap: 7px;
    width: 100%;
    padding: 5px 8px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 11px;
    text-align: left;
    cursor: default;
  }
  .item:hover {
    background: color-mix(in oklab, var(--ink) 9%, transparent);
  }
  .item.on {
    color: var(--accent);
  }
</style>
