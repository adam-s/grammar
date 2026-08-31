<script lang="ts">
  /** The production node label, enlarged and explained without a sentence tree. */
  import NodeLabel from '../grammar/NodeLabel.svelte';
  import { formName, functionMark, functionName } from '../grammar/names.ts';
  import { nodeLabelParts } from '../grammar/node-label.ts';
  import { hueSlot, type Form, type Func } from '../grammar/types.ts';
  import InlineText from './InlineText.svelte';

  type Props = {
    form: Form;
    function: Func;
    formText: string;
    functionText: string;
    rows: { form: Form; function: Func }[];
    example: string;
  };

  let { form, function: fn, formText, functionText, rows, example }: Props = $props();

  const parts = $derived(nodeLabelParts({ form, function: fn }));
  const hue = $derived(`var(--s${hueSlot(form)})`);
</script>

<section class="form-function-key" aria-label="How to read a diagram label">
  <div class="anatomy">
    <div class="answer form-answer">
      <p class="question">What kind of unit is it?</p>
      <p class="term"><code>{form}</code> · {formName(form)}</p>
      <p class="explanation"><InlineText text={formText} /></p>
    </div>

    <svg
      class="node"
      viewBox="0 0 240 126"
      role="img"
      aria-label={parts.accessibleName}
      style="--hue:{hue}"
    >
      <g transform="translate(120 34) scale(2.8)">
        <line x1="-31" y1="28" x2="31" y2="28" />
        <NodeLabel x={0} y={0} {form} function={fn} />
      </g>
    </svg>

    <div class="answer function-answer">
      <p class="question">What job does it do here?</p>
      <p class="term"><code>{functionMark(fn)}</code> · {functionName(fn)}</p>
      <p class="explanation"><InlineText text={functionText} /></p>
    </div>
  </div>

  <table>
    <caption>Labels in the first sentence diagram</caption>
    <thead>
      <tr>
        <th scope="col">Form · what it is</th>
        <th scope="col">Function · what it does</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row (`${row.form}-${row.function}`)}
        <tr>
          <td><code>{row.form}</code><span>{formName(row.form)}</span></td>
          <td><code>{functionMark(row.function)}</code><span>{functionName(row.function)}</span></td
          >
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="example"><InlineText text={example} /></p>
</section>

<style>
  .form-function-key {
    box-sizing: border-box;
    margin-top: 24px;
    overflow: hidden;
    border-radius: var(--radius-lg);
    background:
      radial-gradient(
        circle at 50% 23%,
        color-mix(in oklab, var(--hue) 9%, transparent),
        transparent 34%
      ),
      var(--sunken);
  }

  .anatomy {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px minmax(0, 1fr);
    align-items: center;
    min-height: 210px;
    padding: 22px 24px 16px;
    gap: 10px;
  }

  .answer {
    min-width: 0;
  }

  .question,
  .term,
  .explanation,
  .example {
    margin: 0;
  }

  .question {
    color: var(--ink-faint);
    font-size: 11.5px;
    font-weight: 650;
    letter-spacing: 0.055em;
    line-height: 1.35;
    text-transform: uppercase;
  }

  .term {
    margin-top: 7px;
    color: var(--ink);
    font-size: 16px;
    font-weight: 650;
    line-height: 1.35;
  }

  code {
    color: var(--hue);
    font-family: var(--font-mono);
    font-weight: 650;
  }

  .explanation {
    margin-top: 5px;
    color: var(--ink-muted);
    font-size: 13.5px;
    line-height: 1.5;
  }

  .node {
    display: block;
    width: 100%;
    min-width: 0;
  }

  .node line {
    stroke: var(--hue);
    stroke-width: 0.65px;
    opacity: 0.78;
  }

  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    text-align: left;
  }

  caption {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  th,
  td {
    width: 50%;
    padding: 11px 16px;
    border-right: 1px solid var(--border);
  }

  th:last-child,
  td:last-child {
    border-right: 0;
  }

  th {
    color: var(--ink-faint);
    font-size: 11.5px;
    font-weight: 650;
    letter-spacing: 0.035em;
  }

  tbody tr {
    border-top: 1px solid var(--border);
  }

  td {
    color: var(--ink);
    font-size: 13.5px;
    line-height: 1.4;
  }

  td code {
    display: inline-block;
    min-width: 42px;
  }

  td span {
    color: var(--ink-muted);
  }

  .example {
    padding: 14px 16px 16px;
    color: var(--ink-muted);
    font-size: 13.5px;
    line-height: 1.55;
  }

  @media (max-width: 640px) {
    .anatomy {
      grid-template-columns: 1fr 1fr;
      min-height: 0;
      padding: 18px 16px;
      gap: 12px 16px;
    }

    .node {
      grid-column: 1 / -1;
      grid-row: 1;
      width: min(230px, 100%);
      margin-inline: auto;
    }

    .form-answer,
    .function-answer {
      grid-row: 2;
    }

    th,
    td {
      padding-inline: 12px;
    }

    th {
      font-size: 10.5px;
    }

    td code,
    td span {
      display: block;
    }

    td code {
      margin-bottom: 2px;
    }
  }

  @media (max-width: 360px) {
    .anatomy {
      grid-template-columns: 1fr;
    }

    .form-answer,
    .function-answer {
      grid-row: auto;
    }
  }
</style>
