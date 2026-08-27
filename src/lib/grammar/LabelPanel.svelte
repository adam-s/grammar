<script lang="ts">
  /**
   * The chooser, as a permanent column instead of a popup.
   *
   * Two things about a permanent column that a popup never had to solve:
   *
   * **It has to stay short.** A complete inventory is what makes the panel
   * learnable, and it is also what makes it long — twenty rows of word classes
   * once stood between a learner and the function group, which was the thing
   * they had just been told to do. So a settled group collapses to its answer
   * and the live question is the one on screen. Nothing is removed and the
   * order never changes; reopening a group is one click.
   *
   * **It has to spend accent sparingly.** Three simultaneous blue treatments —
   * a filled row, a ring, a rail — read as three unrelated emphases rather than
   * as one system. Here accent means exactly one thing, "look here", and the
   * pointer gets plain grey:
   *
   *   suggested  accent rail + number key + accent note   — look here
   *   chosen     accent tint + tick                       — this is set
   *   cursor     grey fill                                — you are pointing
   *   focus      inset ring                               — the keyboard is here
   *
   * The component renders state; it decides nothing. Which options exist, what
   * they are called, whether they may be picked, why not, and which group is
   * live all come from `options.ts`.
   */
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import {
    bestIndex,
    byHotkey,
    filterPanel,
    isPickable,
    type LabelOption,
    type OptionGroup,
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
  /** null = follow the panel's own step. A click pins a group open instead. */
  let pinned = $state<string | null>(null);

  const filtered = $derived(filterPanel(panel, query));
  /** Filtering is a search across everything, so it opens everything. */
  const searching = $derived(query.trim().length > 0);
  const openId = $derived(pinned ?? panel.step);
  const isOpen = (g: OptionGroup) => searching || g.id === openId;

  /** Only what is visible can be reached — by key, by arrow, or by number. */
  const reachable = $derived(
    filtered.groups.filter(isOpen).flatMap((g) => g.options.filter(isPickable)),
  );
  const keysLive = $derived(!searching && openId === panel.step && panel.suggested > 0);

  $effect(() => {
    void panel.subject;
    pinned = null;
    query = '';
  });

  /**
   * Where the cursor rests. While filtering it follows the best match — typing
   * "trans" must land on transitive, never on the intransitive above it. With
   * no filter it rests on the first SUGGESTION rather than the first row: the
   * old chooser opened on `Noun` whatever you had selected, because the cursor
   * followed taxonomy order.
   */
  $effect(() => {
    void [query, panel.subject, openId];
    const visible = filtered.groups.filter(isOpen).flatMap((g) => g.options);
    const target = searching
      ? visible[bestIndex(visible)]
      : (visible.find((o) => o.state === 'suggested') ?? visible.find(isPickable));
    const i = target ? reachable.indexOf(target) : 0;
    cursor = i >= 0 ? i : 0;
  });

  function choose(o: LabelOption) {
    if (!isPickable(o)) return;
    onpick(o);
    query = '';
    pinned = null;
  }

  function toggle(g: OptionGroup) {
    pinned = isOpen(g) ? '' : g.id;
  }

  function key(e: KeyboardEvent) {
    if (/^[1-9]$/.test(e.key) && !searching) {
      const hit = keysLive ? byHotkey(panel, e.key) : null;
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
    } else if (e.key === 'Escape' && searching) {
      e.preventDefault();
      query = '';
    }
  }

  /**
   * Number keys work from anywhere that is not a text field. Selecting a word
   * on the canvas and pressing `2` should label it — a click into the panel
   * first would make the shortlist slower than the mouse it replaces.
   */
  function globalKey(e: KeyboardEvent) {
    const t = e.target;
    if (
      t instanceof HTMLElement &&
      (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))
    ) {
      return;
    }
    if (!/^[1-9]$/.test(e.key) || e.metaKey || e.ctrlKey || e.altKey || !keysLive) return;
    const hit = byHotkey(panel, e.key);
    if (hit) {
      e.preventDefault();
      choose(hit);
    }
  }

  const idx = (o: LabelOption) => reachable.indexOf(o);
  /** A note earns its line when it is teaching, warning, or being pointed at. */
  /**
   * A note earns its line when it carries evidence or a reason, when its group
   * says the note IS the choice, or when you are pointing at the row.
   */
  const showNote = (o: LabelOption, g: OptionGroup) =>
    !!o.note && (o.state !== 'available' || g.notes === 'always' || idx(o) === cursor);
</script>

<svelte:window onkeydown={globalKey} />

<div class="chooser">
  <header>
    {#if panel.subject}
      <p class="subject">{panel.subject}</p>
    {/if}
    {#if panel.prompt}
      <p class="prompt" class:warn={!!panel.blocked}>{panel.prompt}</p>
    {/if}
  </header>

  <input
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

  <div id="label-options" role="listbox" aria-label="Labels">
    {#each filtered.groups as g (g.id)}
      {@const open = isOpen(g)}
      <h2 class="question" class:open>
        <button type="button" aria-expanded={open} onclick={() => toggle(g)}>
          {#if open}
            <ChevronDown size={11} strokeWidth={2.5} aria-hidden="true" />
          {:else}
            <ChevronRight size={11} strokeWidth={2.5} aria-hidden="true" />
          {/if}
          <span class="q">{g.question}</span>
          {#if !open && g.answered}
            <span class="answer">{g.answered.label}</span>
          {/if}
        </button>
      </h2>

      {#if open}
        {#if g.id === panel.step && keysLive}
          <!-- Suggestions keep their seat in the list; this says where to look
               and which key reaches them, rather than moving them to the top. -->
          <p class="lead">
            {panel.suggested} likely here — press
            {panel.suggested === 1 ? '1' : `1–${panel.suggested}`}
          </p>
        {/if}

        {#each g.options as o (o.key)}
          <button
            class="row {o.state}"
            class:cursor={idx(o) === cursor && idx(o) >= 0}
            type="button"
            role="option"
            aria-selected={idx(o) === cursor && idx(o) >= 0}
            aria-disabled={!isPickable(o)}
            aria-describedby={o.note ? `why-${o.key}` : undefined}
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
              {#if o.hotkey}<kbd>{o.hotkey}</kbd>{/if}
              <span class="name">{o.label}</span>
              {#if o.state === 'chosen'}<span class="tick" aria-label="current">✓</span>{/if}
            </span>
            <!-- Kept in the DOM when hidden: a screen reader has no hover, and
                 the reason a row is blocked is the lesson. -->
            {#if o.note}
              <span class="note" class:shown={showNote(o, g)} id="why-{o.key}">{o.note}</span>
            {/if}
          </button>
        {/each}
      {/if}
    {/each}

    {#if filtered.groups.length === 0}
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
    padding: 10px 10px 4px;
  }
  .subject {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
  }
  .prompt {
    margin: 2px 0 0;
    font-size: 11px;
    line-height: 1.45;
    color: var(--ink-faint);
  }
  .prompt.warn {
    color: var(--caution);
  }

  .filter {
    margin: 6px 10px 4px;
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
    margin: 4px 10px 4px 12px;
    font-size: 10px;
    color: var(--accent);
  }

  /* ---- groups --------------------------------------------------------- */

  .question {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
  }
  /* Sticky so the question you are answering is on screen even when the
     inventory below it is longer than the column. */
  .question.open {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--panel);
  }
  .question button {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 100%;
    padding: 9px 10px 5px;
    border: 0;
    background: transparent;
    color: var(--ink-muted);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    text-align: left;
    cursor: default;
  }
  .question button:hover {
    color: var(--ink);
  }
  .q {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .answer {
    flex: none;
    padding: 1px 6px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--accent) 22%, transparent);
    color: var(--ink);
    font-size: 10px;
    font-weight: 500;
  }

  /* ---- rows ----------------------------------------------------------- */

  .row {
    display: block;
    width: 100%;
    padding: 4px 10px;
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
    display: none;
    margin-top: 1px;
    font-size: 10px;
    line-height: 1.4;
    color: var(--ink-faint);
  }
  .note.shown {
    display: block;
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

  /* Look here. The only accent-coloured text in the list. */
  .row.suggested {
    border-left-color: var(--accent);
  }
  .row.suggested .name {
    font-weight: 600;
  }
  .row.suggested .note {
    color: color-mix(in oklab, var(--accent) 62%, var(--ink-faint));
  }

  /* This is set. */
  .row.chosen {
    background: color-mix(in oklab, var(--accent) 16%, transparent);
  }

  /* Blocked keeps full contrast on the REASON, because the reason is the
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

  /* You are pointing at this — grey, so it never competes with the accent. */
  .row.cursor {
    background: color-mix(in oklab, var(--ink) 9%, transparent);
  }
  .row.chosen.cursor {
    background: color-mix(in oklab, var(--accent) 26%, transparent);
  }
  /* Inset, so the ring belongs to the row instead of straddling the gap
     between two of them, which is what the default outset offset looked like. */
  .row:focus-visible {
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
    z-index: 2;
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
