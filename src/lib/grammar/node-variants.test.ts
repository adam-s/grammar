import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CLAUSE_FUNCTIONS,
  PHRASE_FORMS,
  PHRASE_INTERNAL_FUNCTIONS,
  VERB_TYPES,
  WORD_FORMS,
} from './types.ts';
import { CLAUSE_KINDS, NODE_VARIANTS } from './node-variants.ts';
import {
  NODE_QUALIFIER_GAP,
  nodeLabelOffsets,
  nodeLabelParts,
  nodeLabelWidth,
} from './node-label.ts';

test('the visual inventory has unique stable ids', () => {
  const ids = NODE_VARIANTS.map((variant) => variant.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('the inventory covers every base form', () => {
  const covered = NODE_VARIANTS.filter((variant) => variant.id.startsWith('form-')).map(
    (variant) => variant.form,
  );
  assert.deepEqual(covered, [...PHRASE_FORMS, ...WORD_FORMS]);
});

test('the inventory covers every function mark and obligatory adverbial', () => {
  const covered = new Set(
    NODE_VARIANTS.filter((variant) => variant.function).map(
      (variant) => nodeLabelParts(variant).functionMark,
    ),
  );
  const expected = new Set(
    [...CLAUSE_FUNCTIONS, ...PHRASE_INTERNAL_FUNCTIONS].map(
      (fn) => nodeLabelParts({ form: 'NP', function: fn }).functionMark,
    ),
  );
  expected.add('A!');
  // An auxiliary shows no function mark on an `Aux`, so the catalogue cannot
  // show one either — see the test below, which is where that lives now.
  expected.delete(nodeLabelParts({ form: 'NP', function: 'auxiliary' }).functionMark);
  covered.delete(null);
  assert.deepEqual(covered, expected);
});

test('a helping verb does not repeat itself', () => {
  // Every `Aux` is a helping verb, so marking the function says nothing the
  // form has not said — and over a short word the two marks plus the subtype
  // do not fit. The mark comes back the moment the function is something else.
  assert.equal(nodeLabelParts({ form: 'Aux', function: 'auxiliary' }).functionMark, null);
  assert.equal(nodeLabelParts({ form: 'Aux', function: 'coordinate' }).functionMark, 'Co');
  assert.equal(
    nodeLabelParts({ form: 'Aux', function: 'auxiliary' }).functionName,
    'helping verb',
    'the full name stays, for assistive tech and the palette',
  );
});

/* The mark test above compares label strings, so a variant whose host form went
   missing still passes it while rendering a node with no form at all. Adding a
   function without giving it a host is caught by the type system; this catches
   it in the suite too, which is where docs/node-variants.md says it is caught. */
test('every variant carries a real form to hang its qualifier on', () => {
  for (const variant of NODE_VARIANTS) {
    assert.ok(variant.form, `variant "${variant.id}" has no form`);
    assert.ok(
      ([...PHRASE_FORMS, ...WORD_FORMS] as string[]).includes(variant.form),
      `variant "${variant.id}" has form "${variant.form}", which is not in the inventory`,
    );
  }
});

test('every verb and clause subtype is exercised with marks on both sides', () => {
  for (const verbType of VERB_TYPES) {
    const variant = NODE_VARIANTS.find((entry) => entry.verbType === verbType);
    assert.ok(variant);
    const parts = nodeLabelParts(variant);
    assert.ok(parts.functionMark);
    assert.ok(parts.subtypeMark);
  }
  for (const clauseKind of CLAUSE_KINDS) {
    const variant = NODE_VARIANTS.find((entry) => entry.clauseKind === clauseKind);
    assert.ok(variant);
    const parts = nodeLabelParts(variant);
    assert.ok(parts.functionMark);
    assert.ok(parts.subtypeMark);
  }
});

test('qualifiers cannot leak onto an unrelated form', () => {
  const parts = nodeLabelParts({
    form: 'NP',
    verbType: 'Vtr',
    clauseKind: 'relative',
  });
  assert.equal(parts.subtypeMark, null);
  assert.equal(parts.subtypeName, null);
});

test('qualifiers move outward with the measured width of the primary form', () => {
  const noun = nodeLabelOffsets('N');
  const subordinator = nodeLabelOffsets('Subord');
  assert.ok(subordinator.functionX < noun.functionX);
  assert.ok(subordinator.subtypeX > noun.subtypeX);
  assert.equal(noun.subtypeX - noun.functionX, 13 * 0.62 + NODE_QUALIFIER_GAP * 2);
});

test('the measured node width grows to contain every visible qualifier', () => {
  const bare = nodeLabelWidth({ form: 'V' });
  const combined = nodeLabelWidth({ form: 'V', function: 'head', verbType: 'Vbe' });
  const long = nodeLabelWidth({ form: 'Subord', function: 'postmodifier' });
  assert.ok(combined > bare);
  assert.ok(long > combined);
  assert.ok(NODE_VARIANTS.every((variant) => nodeLabelWidth(variant) > 0));
});
