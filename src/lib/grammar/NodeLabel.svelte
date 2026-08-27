<script lang="ts">
  /**
   * Shared node typography. The two qualifiers occupy a dedicated line above
   * the primary form, so neither variable-width text can collide with it.
   */
  import { nodeLabelOffsets, nodeLabelParts, type NodeLabelValue } from './node-label.ts';

  type Props = NodeLabelValue & {
    x: number;
    y: number;
  };

  let {
    x,
    y,
    form,
    function: fn = null,
    obligatory = false,
    verbType = null,
    clauseKind = null,
  }: Props = $props();

  const parts = $derived(nodeLabelParts({ form, function: fn, obligatory, verbType, clauseKind }));
  const offsets = $derived(nodeLabelOffsets(form));
</script>

<g class="node-label" aria-hidden="true">
  {#if parts.functionMark}
    <text class="qualifier function" x={x + offsets.functionX} y={y + 4}>{parts.functionMark}</text>
  {/if}
  {#if parts.subtypeMark}
    <text class="qualifier subtype" x={x + offsets.subtypeX} y={y + 4}>{parts.subtypeMark}</text>
  {/if}
  <text class="form" {x} y={y + 17}>{parts.form}</text>
</g>

<style>
  .node-label {
    pointer-events: none;
  }

  text {
    fill: var(--hue);
    font-family: var(--font-mono);
    font-weight: 700;
  }

  .form {
    font-size: 13px;
    text-anchor: middle;
  }

  .qualifier {
    font-size: 7.5px;
    letter-spacing: -0.01em;
  }

  .function {
    text-anchor: end;
  }

  .subtype {
    text-anchor: start;
  }
</style>
