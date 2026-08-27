import assert from 'node:assert/strict';
import test from 'node:test';
import { CLAUSE_FUNCTIONS, PHRASE_INTERNAL_FUNCTIONS, VERB_TYPES } from './types.ts';
import {
  clauseKindMark,
  clauseKindName,
  functionMark,
  functionName,
  verbTypeMark,
  verbTypeName,
} from './names.ts';
import { CLAUSE_KINDS } from './node-variants.ts';

test('every verb type has a compact, distinct diagram mark', () => {
  const marks = VERB_TYPES.map((type) => verbTypeMark(type));
  assert.equal(new Set(marks).size, VERB_TYPES.length);
  assert.ok(marks.every((mark) => mark.length <= 2));
});

test('the passive is written on the verb, not left for the reader to infer', () => {
  // A passive transitive verb with no direct object looks like a mistake
  // unless the node says why the object is missing.
  assert.equal(verbTypeMark('Vtr', 'passive'), 'T pass');
  assert.equal(verbTypeName('Vtr', 'passive'), 'passive transitive verb');
  assert.equal(verbTypeMark('Vtr', 'active'), verbTypeMark('Vtr'), 'active adds nothing');
});

test('the transitive mark stays terse while its accessible name stays complete', () => {
  assert.equal(verbTypeMark('Vtr'), 'T');
  assert.equal(verbTypeName('Vtr'), 'transitive verb');
});

test('every clause kind has a compact, distinct diagram mark', () => {
  const marks = CLAUSE_KINDS.map(clauseKindMark);
  assert.equal(new Set(marks).size, CLAUSE_KINDS.length);
  assert.ok(marks.every((mark) => mark.length <= 4));
  assert.equal(clauseKindName('relative'), 'relative clause');
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
