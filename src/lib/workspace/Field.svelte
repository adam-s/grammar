<script lang="ts">
  /** One compact property cell: a glyph, a value, and an accessible name. */
  type Props = { label: string; value: string | number; glyph?: string; span?: boolean };
  let { label, value, glyph, span = false }: Props = $props();
  const id = $props.id();
</script>

<div class="field" class:span>
  <label for={id}>{glyph ?? label}</label>
  <output {id} aria-label={label}>{value}</output>
</div>

<style>
  .field {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 6px;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    background: var(--sunken);
  }
  .field.span {
    grid-column: 1 / -1;
  }
  .field:hover {
    border-color: var(--border-strong);
  }
  label {
    flex: none;
    min-width: 11px;
    color: var(--ink-faint);
    font-size: 10px;
  }
  output {
    flex: 1;
    min-width: 0;
    color: var(--ink);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
