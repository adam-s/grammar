<script lang="ts">
  /** The visible light/dark choice in Settings. */
  import Sun from '@lucide/svelte/icons/sun';
  import Moon from '@lucide/svelte/icons/moon';
  import { theme } from './theme.svelte.ts';

  $effect(() => theme.watchSystem());
</script>

<div class="setting">
  <div class="copy">
    <h2>Appearance</h2>
    <p>Choose how the workspace looks on this device.</p>
  </div>
  <div class="toggle" role="group" aria-label="Color theme">
    <button
      class:on={theme.resolved === 'light'}
      type="button"
      aria-pressed={theme.resolved === 'light'}
      onclick={() => theme.set('light')}
    >
      <Sun size={14} strokeWidth={1.75} aria-hidden="true" />
      Light
    </button>
    <button
      class:on={theme.resolved === 'dark'}
      type="button"
      aria-pressed={theme.resolved === 'dark'}
      onclick={() => theme.set('dark')}
    >
      <Moon size={14} strokeWidth={1.75} aria-hidden="true" />
      Dark
    </button>
  </div>
</div>

<style>
  .setting {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--raised);
  }
  .copy h2 {
    margin: 0;
    color: var(--ink);
    font-size: 12px;
    font-weight: 650;
  }
  .copy p {
    margin: 3px 0 0;
    color: var(--ink-muted);
    font-size: 10.5px;
  }
  .toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px;
    padding: 3px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--sunken);
  }
  .toggle button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 30px;
    padding: 5px 7px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--ink-muted);
    font: inherit;
    font-size: 11px;
    cursor: default;
  }
  .toggle button:hover {
    color: var(--ink);
  }
  .toggle button.on {
    background: var(--panel);
    color: var(--ink);
    box-shadow: 0 1px 2px oklch(0 0 0 / 14%);
  }
</style>
