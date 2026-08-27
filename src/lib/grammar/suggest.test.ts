import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ambiguous, vbe, vtr } from './fixtures.ts';
import { suggest } from './suggest.ts';
import type { Span } from './types.ts';

const top = (words = vtr.words, span: Span = [0, 0]) => suggest(words, span).map((s) => s.form);

describe('one-word suggestions come from visible evidence', () => {
  it('“She” leads with pronoun — a closed class', () => {
    assert.equal(top(vtr.words, [0, 0])[0], 'Pron');
  });

  it('“repaired” leads with verb — it ends in -ed', () => {
    assert.equal(top(vtr.words, [1, 1])[0], 'V');
  });

  it('“the” leads with determiner', () => {
    assert.equal(top(vtr.words, [2, 2])[0], 'Det');
  });

  it('“are” offers BOTH auxiliary and main verb, and does not choose', () => {
    const forms = top(vbe.words, [2, 2]);
    assert.ok(forms.includes('Aux'));
    assert.ok(forms.includes('V'), '“The keys ARE on the table” has be as the main verb');
  });

  it('“with” leads with preposition', () => {
    assert.equal(top(ambiguous.words, [4, 4])[0], 'P');
  });

  it('an unmarked word falls back to noun and verb, not to the whole taxonomy', () => {
    const forms = top(vtr.words, [3, 3]); // "engine"
    assert.ok(forms.length <= 3);
    assert.ok(forms.includes('N'));
  });
});

describe('multi-word suggestions', () => {
  it('a run starting with a preposition leads with PP', () => {
    assert.equal(suggest(ambiguous.words, [4, 6])[0]!.form, 'PP');
  });

  it('a run starting with a determiner leads with NP', () => {
    assert.equal(suggest(vtr.words, [2, 3])[0]!.form, 'NP');
  });

  it('never offers a word class for a run of words', () => {
    for (const s of suggest(vtr.words, [1, 3])) {
      assert.ok(['NP', 'VP', 'PP', 'AdjP', 'AdvP', 'S', 'Cl'].includes(s.form), s.form);
    }
  });
});

describe('the rules of the ranking', () => {
  it('surfaces at most `limit` choices — a shortlist, not a taxonomy', () => {
    for (let i = 0; i < vtr.words.length; i++) {
      assert.ok(suggest(vtr.words, [i, i]).length <= 3);
    }
  });

  it('never repeats a form', () => {
    const forms = suggest(vbe.words, [2, 2]).map((s) => s.form);
    assert.equal(new Set(forms).size, forms.length);
  });

  it('every suggestion carries readable evidence, never a score', () => {
    for (let i = 0; i < ambiguous.words.length; i++) {
      for (const s of suggest(ambiguous.words, [i, i])) {
        assert.ok(s.evidence.length > 12, `${s.form}: evidence too thin`);
        assert.doesNotMatch(s.evidence, /\d+%|confidence|probab/i, 'no scores');
      }
    }
  });

  it('does NOT consult the gold answer — identical words rank identically', () => {
    // "the" is a determiner in both fixtures and in both readings of the
    // ambiguous one. If ranking leaked the answer key, the two sentences could
    // disagree about the same word in the same position.
    assert.deepEqual(
      suggest(vtr.words, [2, 2]).map((s) => s.form),
      suggest(ambiguous.words, [2, 2]).map((s) => s.form),
    );
  });

  it('is deterministic', () => {
    assert.deepEqual(suggest(vtr.words, [1, 1]), suggest(vtr.words, [1, 1]));
  });
});
