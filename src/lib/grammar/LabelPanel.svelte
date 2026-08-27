<script lang="ts">
  /**
   * The chooser, as a permanent column instead of a popup.
   *
   * The popup it replaces had to be opened, covered the sentence it was asking
   * about, and rebuilt its contents on every selection. Living in the panel
   * changes three things that a popup cannot do at all:
   *
   *  - **The sentence stays visible while you choose**, so hovering a label can
   *    draw what it would produce, on the words it would produce it over.
   *  - **The inventory can stay still.** Nothing is hidden to make room, so the
   *    learner builds a map of where labels live. See `options.ts` for the
   *    stability rules that make this true.
   *  - **A second question is just a second group.** Verb type and function are
   *    visible beside the form rather than behind a drill-down.
   *
   * The component renders state; it decides nothing. Which options exist, what
   * they are called, whether they may be picked and why not all come from
   * `options.ts`, which shares its predicates with the content audits.
   */
  import {
    bestIndex,
    byHotkey,
    filterPanel,
    isPickable,
    pickable,
    type LabelOption,
    type Panel,
  } from './options.ts';

  export interface Verdict {
    kind: 'correct' | 'alternate' | 'wrong';
    text: string;
    test?: string;
  }

  type Props = {
    panel: Panel;
    verdict?: Verdict | null;
    onpick: (option: LabelOption) => void;
    onhover?: (option: LabelOption | null) => void;
  };
  let { panel, verdict = null, onpick, onhover }: Props = $props();

  let query = $state('');
  let cursor = $state(0);
  let input = $state<HTMLInputElement | null>(null);

  const shown = $derived(filterPanel(panel, query));
  const reachable = $derived(pickable(shown));

  /**
   * Where the cursor rests.
   *
   * While filtering it follows the best match — typing "trans" must land on
   * transitive, never on the intransitive above it. With no filter it rests on
   * the first SUGGESTION rather than the first row, which is the whole point of
   * having suggestions: the old chooser opened on `Noun` whatever you had
   * selected, because the cursor followed taxonomy order.
   */
  $effect(() => {
    void [query, panel.subject];
    const all = shown.groups.flatMap((g) => g.options);
    const target = query.trim()
      ? all[bestIndex(all)]
      : (all.find((o) => o.state === 'suggested') ?? all.find(isPickable));
    const i = target ? reachable.indexOf(target) : 0;
    cursor = i >= 0 ? i : 0;
  });

  function choose(o: LabelOption) {
    if (!isPickable(o)) return;
    onpick(o);
    query = '';
  }

  function key(e: KeyboardEvent) {
    if (/^[1-9]$/.test(e.key) && query === '') {
      const hit = byHotkey(panel, e.key);
      if (hit) {
        e.preventDefault();
        choose(hit);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cursor = Math.min(reachable.length - 1, cursor + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      cursor = Math.max(0, cursor - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const o = reachable[cursor];
      if (o) choose(o);
    } else if (e.key === 'Escape' && query !== '') {
      e.preventDefault();
      query = '';
    }
  }

  const idx = (o: LabelOption) => reachable.indexOf(o);

  /**
   * Number keys work from anywhere that is not a text field. Selecting a word
   * on the canvas and pressing `2` should label it — requiring a click into the
   * panel first would make the shortlist slower than the mouse it replaces.
   */
  function globalKey(e: KeyboardEvent) {
    const t = e.target;
    if (
      t instanceof HTMLElement &&
      (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))
    ) {
      return;
    }
    if (!/^[1-9]$/.test(e.key) || e.metaKey || e.ctrlKey || e.altKey) return;
    const hit = byHotkey(panel, e.key);
    if (hit) {
      e.preventDefault();
      choose(hit);
    }
  }
</script>

<svelte:window onkeydown={globalKey} />

<div class="chooser">
  <header>
    {#if panel.subject}
      <p class="subject">{panel.subject}</p>
    {/if}
    <p class="prompt" class:warn={!!panel.blocked}>{panel.prompt}</p>
  </header>

  <input
    bind:this={input}
    bind:value={query}
    class="filter"
    type="text"
    role="combobox"
    aria-expanded="true"
    aria-controls="label-options"
    aria-label="Filter labels"
    placeholder="Filter — try “verb” or “two objects”"
    onkeydown={key}
  />

  {#if panel.suggested > 0 && query === ''}
    <!-- Suggestions keep their seat in the list; this says where to look and
         which key reaches them, rather than moving them to the top. -->
    <p class="lead">
      <span class="dot" aria-hidden="true"></span>
      {panel.suggested} likely here — highlighted below, press
      {panel.suggested === 1 ? '1' : `1–${panel.suggested}`}
    </p>
  {/if}

  <div id="label-options" role="listbox" aria-label="Labels">
    {#each shown.groups as g (g.id)}
      <p class="question">{g.question}</p>
      {#each g.options as o (o.key)}
        <button
          class="row {o.state}"
          class:cursor={idx(o) === cursor && idx(o) >= 0}
          type="button"
          role="option"
          aria-selected={idx(o) === cursor && idx(o) >= 0}
          aria-disabled={!isPickable(o)}
          onclick={() => choose(o)}
          onpointerenter={() => {
            if (idx(o) >= 0) cursor = idx(o);
            onhover?.(o);
          }}
          onpointerleave={() => onhover?.(null)}
          onfocus={() => onhover?.(o)}
          onblur={() => onhover?.(null)}
        >
          <span class="line">
            {#if o.hotkey}
              <kbd>{o.hotkey}</kbd>
            {/if}
            <span class="name">{o.label}</span>
            {#if o.state === 'chosen'}
              <span class="tick" aria-label="current">✓</span>
            {/if}
          </span>
          {#if o.note}
            <span class="note">{o.note}</span>
          {/if}
        </button>
      {/each}
    {/each}

    {#if shown.groups.length === 0}
      <p class="empty">nothing matches “{query}”</p>
    {/if}
  </div>

  {#if verdict}
    <footer class={verdict.kind}>
      <p>{verdict.text}</p>
      {#if verdict.test}<p class="test">{verdict.test}</p>{/if}
    </footer>
  {/if}
</div>

<style>
  .chooser {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  header {
    padding: 10px 10px 6px;
  }
  .subject {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }
  .prompt {
    margin: 2px 0 0;
    font-size: 11px;
    color: var(--ink-faint);
    line-height: 1.45;
  }
  .prompt.warn {
    color: var(--caution);
  }

  .filter {
    margin: 2px 10px 8px;
    padding: 5px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--sunken);
    color: var(--ink);
    font: inherit;
    font-size: 11px;
  }
  .filter::placeholder {
    color: var(--ink-faint);
  }

  .lead {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 10px 6px;
    font-size: 10px;
    color: var(--accent);
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
  }

  .question {
    margin: 10px 0 4px;
    padding: 0 10px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }

  .row {
    display: block;
    width: 100%;
    padding: 5px 10px;
    border: 0;
    border-left: 2px solid transparent;
    background: transparent;
    color: var(--ink);
    font: inherit;
    text-align: left;
    cursor: default;
  }
  .line {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
  }
  .name {
    flex: 1;
    min-width: 0;
  }
  .note {
    display: block;
    margin-top: 1px;
    font-size: 10px;
    line-height: 1.4;
    color: var(--ink-faint);
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
    font-weight: 600;
  }
  .tick {
    color: var(--accent);
    font-size: 11px;
  }

  /* ---- the states ----------------------------------------------------- */

  /* Suggested: an accent rail and its evidence, in place. The row does not
     move, so the list you learned yesterday is the list you see today. */
  .row.suggested {
    border-left-color: var(--accent);
    background: color-mix(in oklab, var(--accent) 8%, transparent);
  }
  .row.suggested .name {
    font-weight: 600;
  }
  .row.suggested .note {
    color: color-mix(in oklab, var(--accent) 62%, var(--ink-faint));
  }

  .row.chosen {
    background: color-mix(in oklab, var(--accent) 20%, transparent);
    border-left-color: var(--accent);
  }

  /* Blocked keeps its full contrast on the REASON, because the reason is the
     lesson. Only the name recedes. */
  .row.blocked .name {
    color: var(--ink-faint);
  }
  .row.blocked .note {
    color: var(--caution);
  }

  .row.untaught {
    opacity: 0.4;
  }
  .row.untaught .note {
    font-style: italic;
  }

  .row.idle .name {
    color: var(--ink-muted);
  }
  .row.idle .note {
    opacity: 0.75;
  }

  .row.available:hover,
  .row.suggested:hover,
  .row.chosen:hover {
    background: color-mix(in oklab, var(--ink) 8%, transparent);
  }
  .row.cursor {
    outline: 1px solid var(--accent);
    outline-offset: -1px;
  }

  .empty {
    padding: 10px;
    font-size: 11px;
    color: var(--ink-faint);
  }

  footer {
    position: sticky;
    bottom: 0;
    z-index: 1;
    margin-top: 8px;
    padding: 8px 10px;
    border-top: 1px solid var(--border);
    background: var(--panel);
    font-size: 11px;
    line-height: 1.45;
  }
  footer p {
    margin: 0;
  }
  footer .test {
    margin-top: 3px;
    color: var(--ink-faint);
  }
  footer.correct {
    color: var(--success);
  }
  footer.alternate {
    color: var(--caution);
  }
  footer.wrong {
    color: var(--failure);
  }
</style>
