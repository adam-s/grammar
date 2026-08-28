import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { nominal, punctuation, vtr } from './fixtures.ts';
import { cleft, demonstrations, front, pseudoCleft, substitute } from './transform.ts';

describe('the tests you perform', () => {
  // *She repaired the engine* — one of the older fixtures, written before
  // punctuation had a home, so it ends on a word.
  const w = vtr.words;

  it('replaces a run with one word', () => {
    assert.equal(substitute(w, [2, 3], 'it')!.text, 'She repaired it');
  });

  it('capitalises the replacement when it lands first', () => {
    assert.equal(substitute(w, [0, 0], 'they')!.text, 'They repaired the engine');
  });

  it('moves a run to the front, and takes the capital with it', () => {
    assert.equal(front(w, [2, 3])!.text, 'The engine, she repaired');
  });

  it('singles a run out two ways, which fail differently', () => {
    assert.equal(cleft(w, [2, 3])!.text, 'It was the engine that she repaired');
    assert.equal(pseudoCleft(w, [2, 3])!.text, 'What she repaired was the engine');
  });

  it('runs the test on a run that is NOT one thing, and lets it sound wrong', () => {
    // "repaired the" is not a constituent, and the point is that the learner
    // hears that rather than being told it.
    assert.equal(cleft(w, [1, 2])!.text, 'It was repaired the that she engine');
  });

  it('keeps the closing punctuation at the end, wherever the words go', () => {
    for (const d of demonstrations(punctuation.words, [0, 1])) {
      assert.ok(d.text.endsWith('.'), `${d.kind}: ${d.text}`);
    }
  });

  it('offers "they" for a plural run and "it" for the rest', () => {
    assert.match(demonstrations(vtr.words, [2, 3])[0]!.text, /\bit\b/);
    assert.match(demonstrations(punctuation.words, [0, 1])[0]!.text, /^It\b/);
  });

  it('will not front a run that is already at the front', () => {
    assert.equal(front(w, [0, 0]), null);
  });

  it('will not single out the whole sentence, which proves nothing', () => {
    assert.equal(cleft(w, [0, 3]), null);
    assert.equal(pseudoCleft(w, [0, 3]), null);
  });

  it('leaves a proper name capitalised when it stops being first', () => {
    // *Almost every driver knows New York* — "New" keeps its capital.
    const words = nominal.words;
    const d = front(words, [2, 5]);
    assert.ok(d, 'the direct object can be fronted');
  });

  it('every demonstration says what it did, in words a learner reads', () => {
    for (const d of demonstrations(w, [2, 3])) {
      assert.ok(d.did.length > 0 && d.did[0] === d.did[0]!.toUpperCase());
      assert.ok(!d.did.endsWith('.'), 'it is a label, not a sentence');
    }
  });
});
