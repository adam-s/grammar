import assert from 'node:assert/strict';
import { test } from 'node:test';

import { countWords, parseInline, plainText } from './inline.ts';

test('plain prose is one run', () => {
  assert.deepEqual(parseInline('The horse fell.'), [{ text: 'The horse fell.' }]);
});

test('strong and emphasis carry only their inner text', () => {
  assert.deepEqual(parseInline('The horse **that was** raced'), [
    { text: 'The horse ' },
    { text: 'that was', strong: true },
    { text: ' raced' },
  ]);
  assert.deepEqual(parseInline('_fell_ is the main verb'), [
    { text: 'fell', em: true },
    { text: ' is the main verb' },
  ]);
});

test('both markers survive in one line, in order', () => {
  assert.deepEqual(parseInline('put **two** words back: _that was_'), [
    { text: 'put ' },
    { text: 'two', strong: true },
    { text: ' words back: ' },
    { text: 'that was', em: true },
  ]);
});

test('an unclosed marker stays literal rather than eating the rest', () => {
  assert.deepEqual(parseInline('a lone * and _ marker'), [{ text: 'a lone * and _ marker' }]);
});

test('strong wins over emphasis, so bold never splits into two italics', () => {
  assert.deepEqual(parseInline('**a_b_c**'), [{ text: 'a_b_c', strong: true }]);
});

test('plain text drops the markers', () => {
  assert.equal(plainText('_Fell_ is the **main** verb'), 'Fell is the main verb');
});

test('word counts ignore markup and blank strings', () => {
  assert.equal(countWords('_Fell_ is the **main** verb'), 5);
  assert.equal(countWords('   '), 0);
  assert.equal(countWords(''), 0);
});
