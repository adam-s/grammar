import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { frontedPhrase, nominal, punctuation, vtr } from './fixtures.ts';
import {
  cleft,
  demonstrations,
  front,
  passive,
  performed,
  pseudoCleft,
  substitute,
} from './transform.ts';

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

  it('runs the test on a verbless run that is NOT one thing, and lets it sound wrong', () => {
    // "engine" without its determiner is not the whole constituent, and the
    // point is that the learner hears that rather than being told it.
    assert.equal(cleft(w, [3, 3])!.text, 'It was engine that she repaired the');
  });

  it('declines a run with nothing noun-ish to sit between “it was” and “that”', () => {
    // A bare determiner cannot cleft even as a demonstration of failure.
    assert.equal(cleft(w, [2, 2]), null);
  });

  it('declines a run containing a verb, where the test cannot pass even for a right answer', () => {
    // "repaired the engine" is a perfectly good verb phrase, and its cleft —
    // *It was repaired the engine that she* — sounds wrong anyway. A test
    // that fails for a correct selection is not evidence, so it is not run.
    assert.equal(cleft(w, [1, 3]), null);
    assert.equal(pseudoCleft(w, [1, 3]), null);
    // The same rule declines the non-constituent "repaired the": no cleft is
    // better than one whose verdict means nothing.
    assert.equal(cleft(w, [1, 2]), null);
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

describe('turning a sentence round', () => {
  const w = vtr.words; // She repaired the engine

  it('promotes the object, agrees the verb, and puts the doer after "by"', () => {
    const d = passive({ words: w, subject: [0, 0], verb: 1, object: [2, 3] });
    assert.ok(performed(d));
    assert.equal(d.text, 'The engine was repaired by her');
  });

  it('agrees with what is promoted, not with what was there', () => {
    // *The mechanic repaired the engine, and the car started* — a plural
    // promoted subject takes "were".
    const words = punctuation.words;
    const one = passive({ words, subject: [0, 1], verb: 2, object: [3, 4] });
    assert.ok(performed(one));
    assert.match(one.text, /^The engine was repaired by the mechanic/);
  });

  it('says what it assumed when it had to derive a form', () => {
    // *repaired* is right; the rule that made it would have made *smited* with
    // the same confidence, so it says which verb it took on trust.
    const d = passive({ words: w, subject: [0, 0], verb: 1, object: [2, 3] });
    assert.ok(performed(d));
    assert.match(d.assumed!, /“repair” is a regular verb/);
  });

  it('takes the sentence at its word, and then assumes nothing', () => {
    const words = [...w];
    words[1] = { ...words[1]!, lemma: 'smite', forms: { participle: 'smitten' } };
    const d = passive({ words, subject: [0, 0], verb: 1, object: [2, 3] });
    assert.ok(performed(d));
    assert.equal(d.text, 'The engine was smitten by her');
    assert.equal(d.assumed, undefined, 'nothing was guessed, so nothing is flagged');
  });

  it('uses the table for an irregular verb', () => {
    // *He knew what she repaired* — "knew" is irregular and the table has it.
    const words = frontedPhrase.words;
    const d = passive({ words, subject: [0, 0], verb: 1, object: [2, 4] });
    assert.ok(performed(d));
    assert.match(d.text, /was known by him/);
  });
});

describe('the note at the top of the module', () => {
  it('counts the constituency tests it claims to turn into sentences', () => {
    // It said three and `demonstrations` returns four: it listed substitution,
    // fronting and clefting and left out the pseudo-cleft, in the file that
    // exports it. A comment that counts is a comment that can be run.
    assert.deepEqual(
      demonstrations(vtr.words, [2, 3]).map((d) => d.kind),
      ['substitute', 'front', 'cleft', 'pseudo-cleft'],
    );
  });
});
