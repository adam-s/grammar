import assert from 'node:assert/strict';
import test from 'node:test';
import { nodeLabelParts, type NodeLabelValue } from './node-label.ts';

/**
 * The completeness sweep: EVERY field a decision can write must change what
 * the node shows, or a correct answer reads as a click that did nothing —
 * the stored-but-not-shown twin of the chosen-but-not-stored defect, and it
 * has happened twice (voice, then finiteness). This walks the same field
 * list `buildSignature` reads, so a field added to one shows up missing in
 * the other as a failing test, not a silent gap.
 *
 * Two families are EXEMPT, each because a different part of the drawing
 * already carries the claim: `gap` and `index` are drawn as the empty slot
 * and the pairing arc, not as corner text; and the deliberate mark
 * suppressions (a form named for its job, a Part beside its kind, an elided
 * head) hide a mark whose information sits elsewhere on the same node.
 */
const shown = (value: NodeLabelValue): string => {
  const p = nodeLabelParts(value);
  return JSON.stringify(p);
};

const differs = (base: NodeLabelValue, answered: NodeLabelValue, what: string) =>
  assert.notEqual(shown(answered), shown(base), `${what}: answering left no visible evidence`);

test('every decision a learner can make leaves a mark on the node', () => {
  differs({ form: 'NP' }, { form: 'NP', function: 'subject' }, 'function');
  differs(
    { form: 'PP', function: 'adverbial' },
    { form: 'PP', function: 'adverbial', obligatory: true },
    'obligatoriness',
  );
  differs(
    { form: 'Det', function: 'determiner' },
    { form: 'Det', function: 'determiner', fusedWith: 'head' },
    'fusion',
  );
  differs({ form: 'V' }, { form: 'V', verbType: 'Vtr' }, 'verb type');
  differs({ form: 'Part' }, { form: 'Part', partKind: 'infinitival' }, 'particle kind');
  differs({ form: 'Aux' }, { form: 'Aux', auxKind: 'passive' }, 'auxiliary kind');
  differs({ form: 'Cl' }, { form: 'Cl', clauseKind: 'relative' }, 'clause kind');
});

test('an answered default marks; an assumed one stays silent', () => {
  // Voice: active is what a finished tree assumes, so ONLY an answer draws.
  differs({ form: 'V', verbType: 'Vtr' }, { form: 'V', verbType: 'Vtr', voice: 'active' }, 'voice');
  differs({ form: 'V' }, { form: 'V', voice: 'active' }, 'voice before the type is known');
  differs({ form: 'V' }, { form: 'V', voice: 'passive' }, 'passive before the type is known');
  // Finiteness: same shape, on both forms the palette asks it of.
  differs({ form: 'Cl' }, { form: 'Cl', finiteness: 'finite' }, 'finiteness on Cl');
  differs({ form: 'S' }, { form: 'S', finiteness: 'finite' }, 'finiteness on S');
  differs(
    { form: 'Cl', clauseKind: 'relative' },
    { form: 'Cl', clauseKind: 'relative', finiteness: 'finite' },
    'finiteness beside a clause kind',
  );
});

test('the marks read as the literature writes them', () => {
  const mark = (v: NodeLabelValue) => nodeLabelParts(v).subtypeMark;
  assert.equal(mark({ form: 'V', verbType: 'Vtr', voice: 'active' }), 'T act');
  assert.equal(mark({ form: 'V', verbType: 'Vtr', voice: 'passive' }), 'T pass');
  assert.equal(mark({ form: 'Cl', finiteness: 'finite' }), 'fin');
  assert.equal(mark({ form: 'Cl', clauseKind: 'relative', finiteness: 'finite' }), 'Rel fin');
  assert.equal(mark({ form: 'Cl', clauseKind: 'relative' }), 'Rel');
  assert.equal(mark({ form: 'Cl', finiteness: 'participial' }), 'part');
});

test('the deliberate suppressions still hold — the claim sits elsewhere on the node', () => {
  // A particle beside its kind: the kind mark carries the whole claim.
  const part = nodeLabelParts({ form: 'Part', function: 'head', partKind: 'infinitival' });
  assert.equal(part.functionMark, null);
  assert.notEqual(part.subtypeMark, null);
  // An elided head: being the head is what elision means there.
  const gapHead = nodeLabelParts({ form: 'NP', function: 'head', gap: true });
  assert.equal(gapHead.functionMark, null);
});
