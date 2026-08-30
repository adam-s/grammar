import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { COURSE_LESSONS } from '../course/course.ts';
import { ambiguous, subjectPhrase, vtr } from './fixtures.ts';
import { optionsFor } from './options.ts';
import { answer, emptySession, sessionChoices, sessionPanel, type Session } from './session.ts';

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

describe('the transaction accepts only a currently offered row', () => {
  it('does not trust a caller that marks an absent move available', () => {
    const s = on(emptySession(), [0, 0]);
    const after = answer(s, vtr, W, {
      key: 'func:directObject',
      label: 'direct object',
      state: 'available',
      func: 'directObject',
    });
    assert.deepEqual(after, s);
  });

  it('does not accept a row the calling surface marks untaught', () => {
    const s = on(emptySession(), [0, 0]);
    const panel = optionsFor(s.build, W, s.selection, new Set(['form:Pron']));
    const verb = panel.groups
      .flatMap((group) => group.options)
      .find((row) => row.key === 'form:V')!;
    assert.equal(verb.state, 'untaught');
    const after = answer(s, vtr, W, verb);
    assert.deepEqual(after, s);
  });

  it('does not accept an old copy of a row already refused', () => {
    const s = on(emptySession(), [0, 0]);
    const noun = rowFor(s, 'form:N')!;
    const refused = answer(s, vtr, W, noun);
    const again = answer(refused, vtr, W, noun);
    assert.deepEqual(again, refused);
  });

  it('refuses an identical phrase stacked over itself, then disables that attempt', () => {
    let s = pick(on(emptySession(), [2, 2]), 'form:Det');
    s = pick(on(s, [3, 3]), 'form:N');
    s = pick(on(s, [2, 3]), 'form:NP');
    const np = Object.keys(s.build.constituents).find(
      (id) => s.build.constituents[id]!.form === 'NP',
    )!;
    s = { ...s, selection: { kind: 'node', id: np } };

    const offered = sessionChoices(s, vtr, W)
      .groups.flatMap((group) => group.options)
      .find((option) => option.key === 'stack:NP')!;
    assert.equal(offered.state, 'available', 'the learner may try it once');

    const before = s.build;
    const refused = answer(s, vtr, W, offered);
    assert.equal(refused.build, before, 'the wrong layer never enters the tree');
    assert.equal(refused.verdict?.kind, 'wrong');
    assert.match(refused.verdict?.test ?? '', /already have a noun phrase layer/);

    const remembered = sessionChoices(refused, vtr, W)
      .groups.flatMap((group) => group.options)
      .find((option) => option.key === 'stack:NP')!;
    assert.equal(remembered.state, 'blocked', 'only that attempted row is now disabled');
  });
});

describe('the hint ladder', () => {
  it('says only that it is wrong the first time, and why the second', () => {
    const first = pick(on(emptySession(), [0, 0]), 'form:N');
    assert.match(first.verdict!.text, /^“.+” is not a noun\.$/);

    const second = pick(on(first, [0, 0]), 'form:Adj');
    // Same question, same words — so this is the second miss even though it is
    // a different wrong answer.
    assert.equal(second.misses['form:word:0-0'], 2);
    // The second rung says MORE than the first-miss restatement: the grader's
    // reason, not just the refused claim.
    assert.doesNotMatch(second.verdict!.text, /^“.+” is not an adjective\.$/);
    assert.match(second.verdict!.text, /is not an adjective/);
  });

  it('counts per question, not per sentence', () => {
    let s = pick(on(emptySession(), [0, 0]), 'form:N');
    s = pick(on(s, [1, 1]), 'form:N');
    assert.equal(s.misses['form:word:0-0'], 1);
    assert.equal(s.misses['form:word:1-1'], 1);
    assert.match(s.verdict!.text, /^“.+” is not /, 'a different question starts gently again');
  });

  it('every kind of question uses it, not just the ones that always did', () => {
    // Six of the ten decisions used to skip the ladder and answer with the
    // grader's reason immediately.
    const s = pick(on(emptySession(), [1, 1]), 'form:V');
    const wrong = pick(s, 'vt:Vint');
    assert.equal(wrong.misses['vt:#c1'], 1);
    assert.match(wrong.verdict!.test!, /Say the subject and the verb/, 'the test, not the reason');

    const twice = pick({ ...wrong, verdict: null }, 'vt:Vbe');
    assert.equal(twice.misses['vt:#c1'], 2, 'same question, same node');
    // The first miss says only that it is wrong; the second gives the grader's
    // own reason. For verb type both carry the same test, because there is only
    // one test for verb type — the rung that changes is the wording.
    assert.match(wrong.verdict!.text, /^“repaired” is not intransitive here\.$/);
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
    assert.equal(s.verdict, null, 'the last word has no unresolved follow-up, so the panel closes');
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
    assert.match(s.rejected['0-0']!['form:N']!, /is not a noun/);
  });
});

describe('a refusal does not outlive the truth that produced it', () => {
  it('reopens a remembered row when the current reading accepts it', () => {
    let s = on(emptySession(), [0, 0]);
    s = {
      ...s,
      // Simulate a refusal kept by an open development session while the
      // accepted analysis changes underneath it.
      rejected: { '0-0': { 'form:Pron': 'An obsolete refusal.' } },
    };

    const pronoun = sessionChoices(s, vtr, W)
      .groups.flatMap((group) => group.options)
      .find((option) => option.key === 'form:Pron')!;
    assert.equal(pronoun.state, 'available');

    s = answer(s, vtr, W, pronoun);
    assert.equal(s.verdict?.kind, 'correct');
    assert.equal(Object.values(s.build.constituents)[0]?.form, 'Pron');
  });

  it('keeps a remembered row blocked while it is still wrong', () => {
    const s: Session = {
      ...on(emptySession(), [0, 0]),
      rejected: { '0-0': { 'form:N': 'Not a noun.' } },
    };
    const noun = sessionChoices(s, vtr, W)
      .groups.flatMap((group) => group.options)
      .find((option) => option.key === 'form:N')!;
    assert.equal(noun.state, 'blocked');
  });
});

describe('one question, one counter', () => {
  /**
   * A span is not an identity. The word, the one-word phrase over it, and a
   * second layer above that all cover the same letters, so keying a question
   * by its span merges questions that are not the same question.
   *
   * Reproduced before it was fixed: a wrong word class on *She* and the FIRST
   * wrong phrase form on the same word both landed on `form:0-0`, so the phrase
   * question opened already holding one miss and gave the answer away on its
   * first wrong try — defeating the ladder it was supposed to climb.
   */
  it('a wrong word class does not spend the phrase question’s first miss', () => {
    const afterWord = pick(on(emptySession(), [0, 0]), 'form:N');
    const right = pick(on(afterWord, [0, 0]), 'form:Pron');
    const node = Object.keys(right.build.constituents)[0]!;

    const onPhrase = { ...right, selection: { kind: 'node' as const, id: node } };
    // A nominal rather than a verb phrase: both are wrong over *She*, but only
    // this one is still offered. The palette no longer lists a phrase the word
    // could not head, and a pronoun heads no verb phrase.
    const wrongPhrase = pick(onPhrase, 'form:Nom');

    assert.equal(wrongPhrase.misses['form:word:0-0'], 1, 'the word question keeps its own miss');
    assert.equal(
      wrongPhrase.misses['form:phrase:#' + node],
      1,
      'the phrase question starts at one',
    );
    assert.match(wrongPhrase.verdict!.text, /^“.+” is not /, 'so the first miss is still gentle');
    assert.doesNotMatch(
      wrongPhrase.verdict!.text,
      /noun phrase/,
      'and the answer is not given away on a first try',
    );
  });
});

describe('facts with no choice are inferred', () => {
  it('moves on when a word must join its neighbours', () => {
    const after = pick(on(emptySession(), [2, 2]), 'form:Det');
    assert.equal(after.selection.kind, 'none', '"the" needs no separate No answer');
  });

  it('still asks when a word really can stand as a phrase', () => {
    const after = pick(on(emptySession(), [0, 0]), 'form:Pron');
    assert.equal(after.selection.kind, 'node');
    const panel = sessionPanel(after.build, W, after.selection, vtr);
    assert.equal(panel.groups.find((g) => g.id === 'phrase-form')!.optional, false);
  });

  it('moves on when a phrase gets its job only from a larger phrase', () => {
    const P = subjectPhrase;
    let s = pick(on(emptySession(), [3, 3]), 'form:Det', P);
    s = pick(on(s, [4, 4]), 'form:N', P);
    s = pick(on(s, [3, 4]), 'form:NP', P);
    assert.equal(s.selection.kind, 'none', '"the tunnel" waits for "in the tunnel"');
  });

  it('still asks for a clause role when the phrase already has one', () => {
    let s = pick(on(emptySession(), [0, 0]), 'form:Pron');
    s = pick(on(s, [0, 0]), 'form:NP');
    assert.equal(s.selection.kind, 'node', 'the subject question remains real');
    const panel = sessionPanel(s.build, W, s.selection, vtr);
    assert.equal(panel.groups.find((g) => g.id === 'function')!.optional, undefined);
  });
});

/**
 * A drag on the word row builds from those words. What the learner gets for it
 * has to be the thing they were told they built — the two ways this went wrong
 * both praised a move that left the diagram unmatchable.
 */
describe('what a word-row drag actually builds', () => {
  const C35 = COURSE_LESSONS.flatMap((l) => l.sentences).find((s) => s.id === 'c35-a')!;

  /** Pick a row by key on a span selection, and say whether it was applied. */
  function span(s: Session, at: [number, number], key: string, sentence = C35): Session {
    const next: Session = { ...s, selection: { kind: 'span', span: at }, verdict: null };
    const row = sessionChoices(next, sentence, sentence.words)
      .groups.flatMap((g) => g.options)
      .find((o) => o.key === key);
    assert.ok(row, `the palette does not offer ${key} over [${at}]`);
    return answer(next, sentence, sentence.words, row);
  }

  const phraseAt = (s: Session, form: string, at: [number, number]) =>
    Object.entries(s.build.constituents).find(
      ([, c]) => c.form === form && c.span[0] === at[0] && c.span[1] === at[1],
    );

  it('puts a clause OVER the verb phrase it is made of, not under it', () => {
    let s: Session = emptySession();
    for (const [at, key] of [
      [[2, 2], 'form:V'],
      [[3, 3], 'form:P'],
      [[4, 4], 'form:Det'],
      [[5, 5], 'form:N'],
      [[4, 5], 'form:NP'],
      [[3, 5], 'form:PP'],
      [[2, 5], 'form:VP'],
    ] as const) {
      s = span(s, at as [number, number], key);
    }
    s = span(s, [2, 5], 'form:Cl');

    const cl = phraseAt(s, 'Cl', [2, 5]);
    const vp = phraseAt(s, 'VP', [2, 5]);
    assert.ok(cl && vp, 'both layers exist');
    assert.equal(vp[1].parent, cl[0], 'the clause is the verb phrase’s parent');
    assert.equal(cl[1].parent, null, 'and nothing has been pushed above the clause');
  });

  it('and reaches the same shape when the clause is drawn first', () => {
    // The other build order. Drawing the outside first is the whole reason a
    // word-row drag refines downwards, so the rule has to send the verb
    // phrase INSIDE the clause here while sending the clause above it there.
    let s: Session = emptySession();
    s = span(s, [2, 2], 'form:V');
    s = span(s, [2, 5], 'form:Cl');
    s = span(s, [2, 5], 'form:VP');

    const cl = phraseAt(s, 'Cl', [2, 5]);
    const vp = phraseAt(s, 'VP', [2, 5]);
    assert.ok(cl && vp, 'both layers exist');
    assert.equal(vp[1].parent, cl[0], 'the verb phrase is still the one underneath');
  });

  it('refuses a run that would cut an established group in half', () => {
    // *The shoes on my feet pinched.* — with the nominal built, "The shoes"
    // is not a run this build can take, whatever it would have been called.
    const shoes = COURSE_LESSONS.flatMap((l) => l.sentences).find((x) => x.id === 'c02-d')!;
    let s: Session = emptySession();
    for (const [at, key] of [
      [[1, 1], 'form:N'],
      [[2, 2], 'form:P'],
      [[3, 3], 'form:Det'],
      [[4, 4], 'form:N'],
      [[3, 4], 'form:NP'],
      [[2, 4], 'form:PP'],
      [[1, 4], 'form:Nom'],
      [[0, 0], 'form:Det'],
    ] as const) {
      s = span(s, at as [number, number], key, shoes);
    }
    const before = s.build;
    const after = span(s, [0, 1], 'form:NP', shoes);

    assert.equal(after.build, before, 'nothing entered the diagram');
    assert.equal(after.verdict?.kind, 'wrong');
    assert.match(after.verdict!.text, /cut “shoes on my feet” in half/);
    assert.doesNotMatch(
      after.verdict!.text,
      /Not a noun phrase/,
      'the label may be right; only the run is wrong, and the wording must not pretend otherwise',
    );
  });
});

/**
 * Copy a learner reads has to be English, and has to be about grammar rather
 * than about the program. Both of these were broken by composition rather than
 * by anyone writing a bad sentence, which is why they are checked in bulk.
 */
describe('what the palette says out loud', () => {
  const KEYLIKE = /\b(form|func|vt|fin|aux|part|kind|voice|gap|anchor|stack):/;

  it('never shows an internal row key', () => {
    let s: Session = { ...emptySession(), selection: { kind: 'span', span: [0, 0] } };
    const pron = sessionChoices(s, vtr, W)
      .groups.flatMap((g) => g.options)
      .find((o) => o.key === 'form:Pron')!;
    s = answer(s, vtr, W, pron);

    const panel = sessionChoices(s, vtr, W);
    for (const group of panel.groups) {
      assert.doesNotMatch(group.question, KEYLIKE, `${group.id} question`);
      if (group.roleReason) assert.doesNotMatch(group.roleReason, KEYLIKE, `${group.id} reason`);
      for (const option of group.options) {
        assert.doesNotMatch(option.label, KEYLIKE, option.key);
        if (option.note) assert.doesNotMatch(option.note, KEYLIKE, `${option.key} note`);
      }
    }
    assert.doesNotMatch(panel.prompt, KEYLIKE);
  });

  it('gives every wrong form answer a first hint that is a whole sentence', () => {
    // "A prepositional phrase a preposition plus the noun phrase after it" is
    // what gluing the label's name to a bare reminder produced.
    const s: Session = { ...emptySession(), selection: { kind: 'span', span: [2, 3] } };
    const rows = sessionChoices(s, vtr, W)
      .groups.flatMap((g) => g.options)
      .filter((o) => o.form && o.key.startsWith('form:'));
    assert.ok(rows.length > 4, 'the phrase menu is on screen');
    for (const row of rows) {
      const said = answer(s, vtr, W, row).verdict;
      if (said?.kind !== 'wrong' || !said.test) continue;
      assert.match(said.test, /^[“"A-Z]/, `${row.key} starts a sentence`);
      assert.match(said.test, /[.?]$/, `${row.key} ends one: ${said.test}`);
    }
  });
});
