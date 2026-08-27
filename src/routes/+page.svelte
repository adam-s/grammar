<script lang="ts">
  /**
   * The workspace, with a placeholder scene on it.
   *
   * The scene is deliberately the smallest thing that proves the surface is
   * real: a frame in world space, words that hit-test, a selection that reaches
   * the inspector. It encodes no decision about how labelling will work — see
   * docs/labeling-patterns.md, which is the question this shell exists to let
   * us answer.
   */
  import FileText from '@lucide/svelte/icons/file-text';
  import Type from '@lucide/svelte/icons/type';
  import Tag from '@lucide/svelte/icons/tag';
  import Layers from '@lucide/svelte/icons/layers';
  import Settings from '@lucide/svelte/icons/settings';
  import Search from '@lucide/svelte/icons/search';

  import Field from '$lib/workspace/Field.svelte';
  import Section from '$lib/workspace/Section.svelte';
  import Workspace from '$lib/workspace/Workspace.svelte';
  import type { RailItem } from '$lib/workspace/Rail.svelte';
  import { formatZoom } from '$lib/workspace/viewport.ts';
  import { Workspace as WorkspaceState } from '$lib/workspace/workspace.svelte.ts';

  const ws = new WorkspaceState();

  const items: RailItem[] = [
    { id: 'file', label: 'File', icon: FileText },
    { id: 'sentences', label: 'Sentences', icon: Type },
    { id: 'labels', label: 'Labels', icon: Tag },
    { id: 'layers', label: 'Layers', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  let active = $state('sentences');

  /* ------------------------------------------------------------- the scene */

  const LIBRARY = [
    { id: 'moby', source: 'Melville, Moby-Dick', text: 'Call me Ishmael.' },
    {
      id: 'walden',
      source: 'Thoreau, Walden',
      text: 'I went to the woods because I wished to live deliberately.',
    },
    {
      id: 'tale',
      source: 'Dickens, A Tale of Two Cities',
      text: 'It was the best of times, it was the worst of times.',
    },
    {
      id: 'pride',
      source: 'Austen, Pride and Prejudice',
      text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    },
  ];

  let sentenceId = $state('walden');
  let query = $state('');

  const sentence = $derived(LIBRARY.find((s) => s.id === sentenceId)!);
  const shown = $derived(
    LIBRARY.filter((s) => (s.text + s.source).toLowerCase().includes(query.trim().toLowerCase())),
  );

  /** Punctuation is its own token: it is a thing a diagram has to account for. */
  const tokens = $derived(
    sentence.text.match(/[\w'’-]+|[^\s\w]/g)?.map((text, i) => ({ id: `w${i}`, text })) ?? [],
  );

  /** World units. The frame is the only thing with an absolute position. */
  const FRAME = { x: 0, y: 0, w: 760, h: 300 };

  let els = $state<Record<string, HTMLElement>>({});

  /** Inside `.world`, layout offsets already are world coordinates. */
  const selectedRect = $derived.by(() => {
    const id = ws.selection[0];
    const el = id ? els[id] : undefined;
    if (!el) return null;
    return {
      x: FRAME.x + el.offsetLeft,
      y: FRAME.y + el.offsetTop,
      w: el.offsetWidth,
      h: el.offsetHeight,
    };
  });

  const selectedToken = $derived(tokens.find((t) => t.id === ws.selection[0]));

  function pick(id: string, e: MouseEvent) {
    if (ws.panning) return;
    ws.select(id, e.shiftKey);
  }

  $effect(() => {
    void sentenceId;
    ws.clearSelection();
  });
</script>

<Workspace {items} {ws} bind:active content={FRAME} tabs={['Design', 'Rules']}>
  {#snippet panel(section)}
    {#if section === 'sentences'}
      <div class="search">
        <Search size={13} strokeWidth={1.75} aria-hidden="true" />
        <input bind:value={query} placeholder="Search sentences" aria-label="Search sentences" />
      </div>

      <ul class="lines">
        {#each shown as line (line.id)}
          <li>
            <button
              class="line"
              class:on={line.id === sentenceId}
              type="button"
              aria-current={line.id === sentenceId ? 'true' : undefined}
              onclick={() => (sentenceId = line.id)}
            >
              <span class="text">{line.text}</span>
              <span class="src">{line.source}</span>
            </button>
          </li>
        {/each}
        {#if shown.length === 0}
          <li class="empty">nothing matches “{query}”</li>
        {/if}
      </ul>
    {:else}
      <p class="empty">
        Nothing here yet. This panel is a seam, not a feature — see
        <code>src/routes/+page.svelte</code>.
      </p>
    {/if}
  {/snippet}

  {#snippet inspector()}
    {#if selectedToken && selectedRect}
      <Section title="Token">
        <Field label="Text" value={selectedToken.text} glyph="T" span />
      </Section>
      <Section title="Position">
        <Field label="X position" value={Math.round(selectedRect.x)} glyph="X" />
        <Field label="Y position" value={Math.round(selectedRect.y)} glyph="Y" />
      </Section>
      <Section title="Dimensions">
        <Field label="Width" value={Math.round(selectedRect.w)} glyph="W" />
        <Field label="Height" value={Math.round(selectedRect.h)} glyph="H" />
      </Section>
      <Section title="Label" open={false}>
        <p class="note">Undecided. This is the whole open question.</p>
      </Section>
    {:else}
      <Section title="Frame">
        <Field label="Width" value={FRAME.w} glyph="W" />
        <Field label="Height" value={FRAME.h} glyph="H" />
        <Field label="Tokens" value={tokens.length} glyph="#" />
        <Field label="Zoom" value={formatZoom(ws.viewport.z)} glyph="Z" />
      </Section>
      <p class="note">Click a word on the canvas.</p>
    {/if}
  {/snippet}

  <!-- The scene, in world coordinates. -->
  <div
    class="frame"
    style="left:{FRAME.x}px; top:{FRAME.y}px; width:{FRAME.w}px; height:{FRAME.h}px"
  >
    <span class="framelabel">{sentence.source}</span>
    <p class="sentence">
      {#each tokens as t (t.id)}
        <button
          bind:this={els[t.id]}
          class="word"
          class:on={ws.isSelected(t.id)}
          type="button"
          aria-pressed={ws.isSelected(t.id)}
          onclick={(e) => pick(t.id, e)}>{t.text}</button
        >
      {/each}
    </p>
  </div>
</Workspace>

<style>
  /* ---- panel ------------------------------------------------------------ */
  .search {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 4px 4px 8px;
    padding: 0 8px;
    height: 28px;
    border-radius: var(--radius-sm);
    background: var(--sunken);
    color: var(--ink-faint);
  }
  .search input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 11px;
    outline: none;
  }
  .lines {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .line {
    display: block;
    width: 100%;
    padding: 7px 8px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: default;
  }
  .line:hover {
    background: color-mix(in oklab, var(--ink) 7%, transparent);
  }
  .line.on {
    background: color-mix(in oklab, var(--accent) 18%, transparent);
  }
  .text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 11px;
    color: var(--ink);
  }
  .src {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: var(--ink-faint);
  }
  .empty,
  .note {
    margin: 8px;
    color: var(--ink-faint);
    font-size: 11px;
    line-height: 1.5;
  }
  /* Inside a Section the note is a grid cell and supplies its own inset; on its
     own in the inspector body it still needs one. */
  :global(.rows) > .note {
    grid-column: 1 / -1;
    margin: 2px 0 0;
  }
  code {
    font-family: var(--font-mono);
    font-size: 10px;
  }

  /* ---- the scene, in world units --------------------------------------- */
  .frame {
    position: absolute;
    background: var(--artboard);
    border-radius: calc(2px / var(--z));
    /* A ring rather than a border: a border would be inside the box and change
       the frame's layout size, which is also its world size. */
    box-shadow:
      0 0 0 calc(1px / var(--z)) var(--border),
      0 calc(2px / var(--z)) calc(16px / var(--z)) oklch(0 0 0 / 22%);
  }
  /* Divided by --z so chrome keeps its screen size at any zoom — the label and
     the selection ring are annotations about the document, not part of it. */
  .framelabel {
    position: absolute;
    left: 0;
    bottom: 100%;
    margin-bottom: calc(6px / var(--z));
    color: var(--ink-faint);
    font-size: calc(11px / var(--z));
    white-space: nowrap;
  }
  .sentence {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    gap: 4px 2px;
    margin: 0;
    height: 100%;
    padding: 48px;
    box-sizing: border-box;
  }
  .word {
    padding: 4px 5px;
    border: 0;
    border-radius: calc(3px / var(--z));
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 30px;
    line-height: 1.25;
    cursor: default;
  }
  .word:hover {
    background: color-mix(in oklab, var(--accent) 14%, transparent);
  }
  .word.on {
    background: color-mix(in oklab, var(--accent) 26%, transparent);
    outline: calc(1.5px / var(--z)) solid var(--accent);
  }
</style>
