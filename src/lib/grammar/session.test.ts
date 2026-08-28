import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ambiguous, vtr } from './fixtures.ts';
import { optionsFor } from './options.ts';
import { answer, emptySession, type Session } from './session.ts';

const W = vtr.words; // She repaired the engine

const rowFor = (s: Session, key: string, words = W) =>
  optionsFor(s.build, words, s.selection)
    .groups.flatMap((g) => g.options)
    .find((o) => o.key === key);

const on = (s: Session, span: [number, number]): Session => ({
  ...s,
  selection: { kind: 'span', span },
  verdict: null,
});

/** Pick a row by key on the current selection. */
function pick(s: Session, key: string, sentence = vtr): Session {
  const row = rowFor(s, key, sentence.words);
  assert.ok(row, `the palette does not offer ${key}`);
  return answer(s, sentence, sentence.words, row);
}

describe('one decision, start to finish', () => {
  it('a right answer enters the structure', () => {
    const s = pick(on(emptySession(), [0, 0]), 'form:Pron');
    assert.equal(Object.keys(s.build.constituents).length, 1);
    assert.equal(Object.values(s.build.constituents)[0]!.form, 'Pron');
  });

  it('a wrong answer never does', () => {
    const s = pick(on(emptySession(), [0, 0]), 'form:N');
    assert.deepEqual(s.build.constituents, {});
    assert.equal(s.verdict?.kind, 'wrong');
  });

  it('and is remembered against those exact words', () => {
    const s = pick(on(emptySession(), [0, 0]), 'form:N');
    assert.ok(s.rejected['0-0']?.['form:N'], 'the refusal is kept');
    assert.equal(s.rejected['1-1'], undefined, 'and only for those words');
  });
});

describe('the hint ladder', () => {
  it('says only that it is wrong the first time, and why the second', () => {
    const first = pick(on(emptySession(), [0, 0]), 'form:N');
    assert.match(first.verdict!.text, /^Not /);

    const second = pick(on(first, [0, 0]), 'form:Adj');
    // Same question, same words — so this is the second miss even though it is
    // a different wrong answer.
    assert.equal(second.misses['form:0-0'], 2);
    assert.doesNotMatch(second.verdict!.text, /^Not /);
    assert.match(second.verdict!.text, /is not an adjective/);
  });

  it('counts per question, not per sentence', () => {
    let s = pick(on(emptySession(), [0, 0]), 'form:N');
    s = pick(on(s, [1, 1]), 'form:N');
    assert.equal(s.misses['form:0-0'], 1);
    assert.equal(s.misses['form:1-1'], 1);
    assert.match(s.verdict!.text, /^Not /, 'a different question starts gently again');
  });

  it('every kind of question uses it, not just the ones that always did', () => {
    // Six of the ten decisions used to skip the ladder and answer with the
    // grader's reason immediately.
    const s = pick(on(emptySession(), [1, 1]), 'form:V');
    const wrong = pick(s, 'vt:Vint');
    assert.equal(wrong.misses['vt:1-1'], 1);
    assert.match(wrong.verdict!.test!, /Say the subject and the verb/, 'the test, not the reason');

    const twice = pick({ ...wrong, verdict: null }, 'vt:Vbe');
    assert.equal(twice.misses['vt:1-1'], 2, 'same question, same words');
    // The first miss says only that it is wrong; the second gives the grader's
    // own reason. For verb type both carry the same test, because there is only
    // one test for verb type — the rung that changes is the wording.
    assert.match(wrong.verdict!.text, /^Not intransitive\.$/);
    assert.equal(twice.verdict!.text, 'Not Vbe here.');
  });
});

describe('what happens after a right answer', () => {
  it('the selection follows the node that was just made', () => {
    const s = pick(on(emptySession(), [0, 0]), 'form:Pron');
    assert.equal(s.selection.kind, 'node');
  });

  it('a settled question closes the palette and clears the verdict', () => {
    let s = pick(on(emptySession(), [0, 0]), 'form:Pron');
    s = pick(s, 'form:NP');
    s = pick(s, 'func:subject');
    assert.equal(s.selection.kind, 'none', 'nothing left to ask');
    assert.equal(s.verdict, null);
  });

  it('an unsettled one stays open', () => {
    const s = pick(on(emptySession(), [1, 1]), 'form:V');
    assert.notEqual(s.selection.kind, 'none', 'the verb still has to be classified');
  });
});

describe('a reading the answer allows', () => {
  it('is accepted all the way through, with nothing refused', () => {
    // *I saw the man with the telescope* — two readings, and this much of the
    // structure is common to both.
    let s: Session = emptySession();
    for (const [span, key] of [
      [[0, 0], 'form:Pron'],
      [[1, 1], 'form:V'],
      [[2, 2], 'form:Det'],
      [[3, 3], 'form:N'],
    ] as const) {
      s = pick(on(s, span as [number, number]), key, ambiguous);
    }
    assert.deepEqual(s.rejected, {}, 'nothing was refused on the way');
    assert.equal(s.verdict?.kind, 'correct');
  });
});

describe('a refusal outlives the verdict', () => {
  it('stays after a right answer to the same question', () => {
    let s = pick(on(emptySession(), [0, 0]), 'form:N');
    s = pick(on(s, [0, 0]), 'form:Pron');
    assert.equal(s.verdict?.kind, 'correct');
    assert.ok(s.rejected['0-0']?.['form:N'], 'the refusal is still on record');
    // `blockRejectedOptions` is what turns that record into a blocked row; the
    // session keeps the record, the palette applies it.
    assert.match(s.rejected['0-0']!['form:N']!, /Not a noun/);
  });
});
