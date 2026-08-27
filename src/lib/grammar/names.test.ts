import assert from 'node:assert/strict';
import test from 'node:test';
import { CLAUSE_FUNCTIONS, PHRASE_INTERNAL_FUNCTIONS, VERB_TYPES } from './types.ts';
import { functionMark, functionName, verbTypeMark, verbTypeName } from './names.ts';

test('every verb type has a compact, distinct diagram mark', () => {
  const marks = VERB_TYPES.map(verbTypeMark);
  assert.equal(new Set(marks).size, VERB_TYPES.length);
  assert.ok(marks.every((mark) => mark.length <= 2));
});

test('the transitive mark stays terse while its accessible name stays complete', () => {
  assert.equal(verbTypeMark('Vtr'), 'T');
  assert.equal(verbTypeName('Vtr'), 'transitive verb');
});

test('every syntactic function has a compact diagram mark', () => {
  const functions = [...CLAUSE_FUNCTIONS, ...PHRASE_INTERNAL_FUNCTIONS];
  const marks = functions.map((fn) => functionMark(fn));
  assert.equal(new Set(marks).size, functions.length);
  assert.ok(marks.every((mark) => mark.length <= 4));
});

test('common function marks stay conventional and accessible', () => {
  assert.equal(functionMark('subject'), 'Subj');
  assert.equal(functionMark('predicate'), 'Pred');
  assert.equal(functionMark('directObject'), 'DO');
  assert.equal(functionName('directObject'), 'direct object');
  assert.equal(functionMark('adverbial', true), 'A!');
  assert.equal(functionName('adverbial', true), 'obligatory adverbial');
});
