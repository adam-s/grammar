import assert from 'node:assert/strict';
import test from 'node:test';

import { composeVerdict, familyOf, sentenceCase, spokenVerdict } from './feedback.ts';

test('a first miss names the words and the claim, and withholds the answer', () => {
  const v = composeVerdict({
    outcome: 'wrong',
    subject: '“Birds”',
    misses: 1,
    family: 'form',
    refused: 'a verb',
    firstMiss: 'A verb changes with time: sing, sang.',
    reason: '“Birds” is a noun — it names things.',
    test: 'A noun names: bird, idea.',
  });
  assert.equal(v.text, '“Birds” is not a verb.');
  assert.equal(v.test, 'A verb changes with time: sing, sang.');
  assert.ok(!spokenVerdict(v).includes('noun'), 'the truth is not given away on a first miss');
});

test('a second miss gives the reason, which may name the truth', () => {
  const v = composeVerdict({
    outcome: 'wrong',
    subject: '“Birds”',
    misses: 2,
    family: 'form',
    refused: 'an adjective',
    firstMiss: 'An adjective describes.',
    reason: '“Birds” is a noun — it names things.',
    test: 'A noun names: bird, idea.',
  });
  assert.equal(v.text, '“Birds” is a noun — it names things.');
  assert.equal(v.test, 'A noun names: bird, idea.');
});

test('a contextual claim is refused for THIS sentence, a form claim outright', () => {
  const func = composeVerdict({
    outcome: 'wrong',
    subject: '“Birds”',
    misses: 1,
    family: 'contextual',
    refused: 'the direct object',
    firstMiss: 'The direct object answers: what was acted on?',
  });
  assert.equal(func.text, '“Birds” is not the direct object here.');
  const form = composeVerdict({
    outcome: 'wrong',
    subject: '“Birds”',
    misses: 1,
    family: 'form',
    refused: 'an adverb',
    firstMiss: 'An adverb tells how.',
  });
  assert.equal(form.text, '“Birds” is not an adverb.');
});

test('familyOf reads the claim from the option itself', () => {
  assert.equal(familyOf({ form: 'N' }), 'form');
  assert.equal(familyOf({ func: 'subject' }), 'contextual');
  assert.equal(familyOf({ verbType: 'Vtr' }), 'contextual');
  assert.equal(familyOf({ voice: 'passive' }), 'contextual');
  assert.equal(familyOf({ auxKind: 'modal' }), 'contextual');
  assert.equal(familyOf({}), 'form');
});

test('a structural refusal skips the ladder and keeps its own words', () => {
  const v = composeVerdict({
    outcome: 'wrong',
    subject: '“the old”',
    misses: 1,
    family: 'form',
    structural: true,
    reason: 'That run cuts an established group in half.',
    test: 'Select the whole group, or words outside it.',
  });
  assert.equal(v.text, 'That run cuts an established group in half.');
  assert.equal(v.test, 'Select the whole group, or words outside it.');
});

test('correct and alternate wordings are unchanged by the rewrite', () => {
  assert.deepEqual(
    composeVerdict({
      outcome: 'correct',
      subject: '“Birds”',
      misses: 0,
      family: 'form',
      praise: 'that is a noun',
    }),
    { kind: 'correct', text: 'Yes — that is a noun.' },
  );
  const alt = composeVerdict({
    outcome: 'alternate',
    subject: '“the man with the telescope”',
    misses: 0,
    family: 'form',
    gloss: 'the man who had the telescope',
    canonicalGloss: 'you used the telescope',
  });
  assert.equal(alt.kind, 'alternate');
  assert.ok(alt.text.includes('the man who had the telescope'));
  assert.ok(alt.test?.includes('you used the telescope'));
});

test('the spoken line says the verdict once, test included', () => {
  assert.equal(spokenVerdict({ kind: 'wrong', text: 'A.', test: 'B.' }), 'A. B.');
  assert.equal(spokenVerdict({ kind: 'correct', text: 'Yes.' }), 'Yes.');
});

test('sentenceCase closes a bare fragment and never stacks punctuation', () => {
  assert.equal(sentenceCase('the verb answers: what?'), 'The verb answers: what?');
  assert.equal(sentenceCase('a noun names things'), 'A noun names things.');
  assert.equal(sentenceCase('already closed.'), 'Already closed.');
  assert.equal(sentenceCase('watch it fail!'), 'Watch it fail!');
  assert.equal(sentenceCase('trailing space '), 'Trailing space.');
});
