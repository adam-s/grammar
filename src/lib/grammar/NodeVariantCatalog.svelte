<script lang="ts">
  import { nodeLabelParts } from './node-label.ts';
  import { NODE_VARIANT_GROUPS } from './node-variants.ts';
  import NodeLabel from './NodeLabel.svelte';
  import { hueSlot } from './types.ts';

  const hue = (form: Parameters<typeof hueSlot>[0]) => `var(--s${hueSlot(form)})`;
</script>

<div class="catalog">
  <header>
    <p class="eyebrow">Diagram typography QA</p>
    <h1>Node variants</h1>
    <p>Every string and every two-sided qualifier state rendered by the production component.</p>
  </header>

  {#each NODE_VARIANT_GROUPS as group (group.id)}
    <section aria-labelledby={group.id}>
      <div class="section-heading">
        <h2 id={group.id}>{group.title}</h2>
        <p>{group.description}</p>
      </div>
      <div class="grid">
        {#each group.variants as variant (variant.id)}
          {@const parts = nodeLabelParts(variant)}
          <article data-node-variant={variant.id}>
            <svg
              viewBox="0 0 144 66"
              role="img"
              aria-label={parts.accessibleName}
              style="--hue:{hue(variant.form)}"
            >
              <line class="baseline" x1="26" y1="48" x2="118" y2="48" />
              <NodeLabel
                x={72}
                y={20}
                form={variant.form}
                function={variant.function}
                obligatory={variant.obligatory}
                verbType={variant.verbType}
                clauseKind={variant.clauseKind}
              />
            </svg>
            <div>
              <strong>{parts.accessibleName}</strong>
              <code>{variant.id}</code>
            </div>
          </article>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .catalog {
    box-sizing: border-box;
    min-height: 100%;
    padding: clamp(24px, 4vw, 64px);
    color: var(--ink);
    background: var(--canvas);
  }

  header,
  section {
    width: min(1100px, 100%);
    margin-inline: auto;
  }

  header {
    margin-bottom: 48px;
  }

  .eyebrow,
  code {
    font-family: var(--font-mono);
  }

  .eyebrow {
    color: var(--ink-muted);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  h1 {
    margin-block: 8px 12px;
    font-size: clamp(32px, 5vw, 56px);
    letter-spacing: -0.04em;
  }

  header > p:last-child,
  .section-heading p {
    color: var(--ink-muted);
  }

  section + section {
    margin-top: 48px;
  }

  .section-heading {
    margin-bottom: 16px;
  }

  .section-heading h2 {
    margin-bottom: 5px;
    font-size: 20px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 10px;
  }

  article {
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--panel);
  }

  svg {
    display: block;
    width: 100%;
    aspect-ratio: 2.18;
  }

  .baseline {
    stroke: var(--hue);
    stroke-width: 1.5;
    stroke-linecap: round;
  }

  article > div {
    display: grid;
    gap: 4px;
    padding: 10px 12px 12px;
    border-top: 1px solid var(--border);
  }

  strong {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  code {
    color: var(--ink-muted);
    font-size: 10px;
  }
</style>
