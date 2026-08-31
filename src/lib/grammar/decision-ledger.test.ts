/**
 * The decision ledger (docs/temp-decision-model-refactor.md, Phase 0).
 *
 * One sentence — *The shoes on my feet pinched.* — crosses nearly every
 * boundary the decision refactor is about: closed-class evidence against a
 * suffix guess, structure built in either direction, a question deferred until
 * its parent exists, and a job that has only one correct answer. Each test
 * names a promise the learner can see; together they are the contract the
 * refactor must preserve while the modules underneath it move.
 *
 * The walkthrough is sequential on purpose: every state in the ledger is a
 * point in one real build, and asserting them in sequence is what proves the
 * path exists end to end — the same property the reachability suite checks
 * for authored readings, asserted here for the neutral choices along the way.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LESSON_02 } from '../course/sentences/lesson-02.ts';
import { ambiguous } from './fixtures.ts';
import {
  blockRejectedOptions,
  isPickable,
  optionsFor,
  type Panel,
  type Selection,
} from './options.ts';
import { activeGroupAfterAnswer } from './panel-presentation.ts';
import { answer, emptySession, sessionChoices, sessionPanel, type Session } from './session.ts';
import { suggest } from './suggest.ts';
import { contentSpan, type Span, type Word } from './types.ts';

const shoes = LESSON_02.find((s) => s.id === 'c02-d')!;
const W = shoes.words; // The(0) shoes(1) on(2) my(3) feet(4) pinched(5) .(6)

/** The active rows in the open group, in their stable taxonomy order. */
function choices(panel: Panel): string[] {
  const step = panel.groups.find((g) => g.id === panel.step);
  return (step?.options ?? []).filter(isPickable).map((o) => o.key);
}

describe('the nested lesson-2 subject, state by state', () => {
  let s: Session = emptySession();

  const panel = () => sessionPanel(s.build, W, s.selection, shoes);
  const sel = (selection: Selection) => {
    s = { ...s, selection, verdict: null };
  };
  const span = (a: number, b: number) => sel({ kind: 'span', span: [a, b] });
  /** Select the phrase node over exactly these words. */
  const node = (a: number, b: number) => {
    const id = Object.keys(s.build.constituents).find((k) => {
      const c = s.build.constituents[k]!;
      return c.span[0] === a && c.span[1] === b && c.word === undefined;
    });
    assert.ok(id, `no phrase node over [${a},${b}]`);
    sel({ kind: 'node', id });
  };
  const pick = (key: string) => {
    const row = panel()
      .groups.flatMap((g) => g.options)
      .find((o) => o.key === key);
    assert.ok(row, `the palette does not offer ${key}`);
    s = answer(s, shoes, W, row);
    assert.notEqual(s.verdict?.kind, 'wrong', `${key} was refused: ${s.verdict?.text}`);
  };

  it('on “my”, every word class starts as a neutral choice', () => {
    span(3, 3);
    const offered = choices(panel());
    assert.ok(offered.includes('form:Det'));
    assert.ok(offered.includes('form:Adj'));
  });

  it('does not reveal an answer with suggestion keys or ranking', () => {
    const group = panel().groups.find((g) => g.id === 'word-class')!;
    const keys = group.options.map((o) => o.key);
    assert.ok(keys.indexOf('form:Adj') < keys.indexOf('form:Det'));
    assert.ok(group.options.every((option) => option.state === 'available'));
    assert.ok(group.options.every((option) => option.hotkey === undefined));
    assert.ok(group.options.every((option) => option.rank === undefined));
  });

  it('a correct determiner closes the palette — no phrase or job question is left', () => {
    pick('form:Det');
    assert.equal(s.selection.kind, 'none');
    assert.deepEqual(s.navigation, { kind: 'close' }, 'the transaction says so outright');
  });

  it('“feet” named noun closes too: no reading lets it stand alone as a phrase', () => {
    span(4, 4);
    pick('form:N');
    assert.equal(s.selection.kind, 'none');
  });

  it('on “my feet”, every phrase type remains available', () => {
    span(3, 4);
    const offered = choices(panel());
    assert.ok(offered.includes('form:NP'));
    assert.ok(offered.includes('form:VP'));
  });

  it('naming the NP closes, but its future complement job remains available', () => {
    pick('form:NP');
    assert.equal(s.selection.kind, 'none', 'the future job is an offer, not a demand');
    node(3, 4);
    const fn = panel().groups.find((g) => g.id === 'function')!;
    assert.equal(fn.optional, true, 'the job question is an offer, not a demand');
    assert.notEqual(panel().step, 'function');
    const complement = fn.options.find((o) => o.key === 'func:complement');
    assert.ok(complement && isPickable(complement));
    pick('func:complement');
    assert.equal(s.selection.kind, 'none');
  });

  it('“on” still requires the learner to choose preposition', () => {
    span(2, 2);
    assert.ok(choices(panel()).includes('form:P'));
    pick('form:P');
  });

  it('on “on my feet”, PP is available but not revealed', () => {
    span(2, 4);
    assert.ok(choices(panel()).includes('form:PP'));
    assert.equal(
      panel()
        .groups.flatMap((g) => g.options)
        .find((o) => o.key === 'form:PP')!.state,
      'available',
    );
    pick('form:PP');
  });

  it('building the PP preserves the complement chosen before it existed', () => {
    node(3, 4);
    const fn = panel().groups.find((g) => g.id === 'function')!;
    assert.equal(fn.answered?.key, 'func:complement');
    const np = Object.values(s.build.constituents).find(
      (c) => c.form === 'NP' && c.span[0] === 3 && c.span[1] === 4,
    )!;
    assert.equal(np.function, 'complement');
  });

  it('“The” and “shoes” are named without leftover questions', () => {
    span(0, 0);
    pick('form:Det');
    span(1, 1);
    pick('form:N');
    assert.equal(s.selection.kind, 'none');
  });

  it('on “shoes on my feet”, Nom is a choice rather than a revealed answer', () => {
    span(1, 4);
    const offered = choices(panel());
    assert.ok(offered.includes('form:Nom'));
    assert.ok(offered.includes('form:VP'));
    pick('form:Nom');
  });

  it('inside the Nom, the PP’s job is live: postmodifier', () => {
    node(2, 4);
    assert.equal(panel().step, 'function');
    pick('func:postmodifier');
  });

  it('Det plus Nom allows NP, and the finished subject phrase asks for its job', () => {
    span(0, 4);
    assert.ok(choices(panel()).includes('form:NP'));
    pick('form:NP');
    assert.equal(s.selection.kind, 'node', 'subject is a real question, so the palette stays');
    assert.deepEqual(s.navigation, { kind: 'advance', question: 'function' });
    assert.equal(panel().step, 'function');
    const fn = panel().groups.find((g) => g.id === 'function')!;
    const subject = fn.options.find((o) => o.key === 'func:subject');
    assert.ok(subject && isPickable(subject));
    pick('func:subject');
    assert.equal(s.selection.kind, 'none');
  });

  it('“pinched” allows V, then asks the verb type as its own question', () => {
    span(5, 5);
    assert.ok(choices(panel()).includes('form:V'));
    pick('form:V');
    assert.equal(panel().step, 'verb-type');
    pick('vt:Vint');
    assert.equal(panel().step, 'voice');
    pick('voice:active');
  });

  it('every one-word phrase remains a hypothesis over a verb', () => {
    assert.equal(panel().step, 'phrase-form');
    const group = panel().groups.find((g) => g.id === 'phrase-form')!;
    const state = (key: string) => group.options.find((o) => o.key === key)?.state;
    assert.equal(state('form:VP'), 'available');
    for (const other of ['form:NP', 'form:Nom', 'form:DP', 'form:PP', 'form:AdjP', 'form:AdvP']) {
      assert.equal(state(other), 'available', `${other} remains available until it is tried`);
    }
  });

  it('naming the VP leaves predicate for the learner to choose', () => {
    pick('form:VP');
    assert.equal(s.selection.kind, 'node');
    const functions = panel().groups.find((group) => group.id === 'function')!;
    assert.ok(functions.options.every((option) => option.state === 'available'));
    pick('func:predicate');
    assert.equal(s.selection.kind, 'none');
    const vp = Object.values(s.build.constituents).find((c) => c.form === 'VP')!;
    assert.equal(vp.function, 'predicate');
  });

  it('with subject and predicate on the diagram, S remains an explicit choice', () => {
    span(0, 5);
    assert.ok(choices(panel()).includes('form:S'));
    pick('form:S');
    assert.equal(s.selection.kind, 'none', 'the build is done and the palette is closed');
  });

  it('the finished graph keeps every label the learner established', () => {
    const got = Object.values(s.build.constituents).map(
      (c) => `${c.form}/${c.function ?? '·'}@${c.span[0]}-${c.span[1]}`,
    );
    for (const expected of [
      'NP/complement@3-4',
      'PP/postmodifier@2-4',
      'Nom/·@1-4',
      'NP/subject@0-4',
      'VP/predicate@5-5',
      'S/·@0-5',
    ]) {
      assert.ok(got.includes(expected), `${expected} missing from ${got.join(' ')}`);
    }
    const v = Object.values(s.build.constituents).find((c) => c.form === 'V')!;
    assert.equal(v.verbType, 'Vint');
  });
});

describe('the same sentence can be refined from the outside in', () => {
  it('keeps an NP and one-word VP while adding their children beneath them', () => {
    let s = emptySession();
    const choose = (span: Span, key: string) => {
      s = { ...s, selection: { kind: 'span', span }, verdict: null };
      const row = sessionPanel(s.build, W, s.selection, shoes)
        .groups.flatMap((group) => group.options)
        .find((option) => option.key === key);
      assert.ok(row && isPickable(row), `${key} must be available on [${span}]`);
      s = answer(s, shoes, W, row);
      assert.notEqual(s.verdict?.kind, 'wrong', `${key} was refused: ${s.verdict?.text}`);
    };

    choose([0, 4], 'form:NP');
    const subject = Object.keys(s.build.constituents).find(
      (id) => s.build.constituents[id]!.form === 'NP' && s.build.constituents[id]!.span[0] === 0,
    )!;
    s = { ...s, selection: { kind: 'span', span: [3, 3] }, verdict: null };
    assert.match(
      sessionPanel(s.build, W, s.selection, shoes).prompt,
      /Building inside the noun phrase/,
    );
    choose([3, 3], 'form:Det');
    const determiner = Object.keys(s.build.constituents).find(
      (id) => s.build.constituents[id]!.form === 'Det' && s.build.constituents[id]!.word === 3,
    )!;
    assert.equal(s.build.constituents[determiner]!.parent, subject);

    choose([0, 0], 'form:Det');
    choose([1, 1], 'form:N');
    choose([0, 1], 'form:NP');
    const innerSubject = Object.values(s.build.constituents).find(
      (c) => c.form === 'NP' && c.span[0] === 0 && c.span[1] === 1,
    );
    assert.ok(innerSubject, '“The shoes” remains a valid NP inside the larger subject NP');
    assert.equal(s.verdict?.kind, 'correct');

    choose([5, 5], 'form:VP');
    const predicate = Object.keys(s.build.constituents).find(
      (id) => s.build.constituents[id]!.form === 'VP',
    )!;
    choose([5, 5], 'form:V');
    const verb = Object.keys(s.build.constituents).find(
      (id) => s.build.constituents[id]!.form === 'V' && s.build.constituents[id]!.word === 5,
    )!;

    assert.equal(s.build.constituents[verb]!.parent, predicate);
    assert.equal(s.build.constituents[predicate]!.parent, null);
  });

  it('offers “The shoes” as NP after the outer NP, even with an obsolete refusal', () => {
    let s: Session = { ...emptySession(), selection: { kind: 'span', span: [0, 4] } };
    const outer = sessionPanel(s.build, W, s.selection, shoes)
      .groups.flatMap((group) => group.options)
      .find((option) => option.key === 'form:NP')!;
    s = answer(s, shoes, W, outer);

    s = {
      ...s,
      selection: { kind: 'span', span: [0, 1] },
      // This is the state an open page kept after the corpus gained the
      // recursive NP analysis.
      rejected: { '0-1': { 'form:NP': 'An obsolete refusal.' } },
    };
    const inner = sessionChoices(s, shoes, W)
      .groups.flatMap((group) => group.options)
      .find((option) => option.key === 'form:NP')!;
    assert.ok(isPickable(inner), 'the old refusal must not disable a now-correct noun phrase');

    s = answer(s, shoes, W, inner);
    assert.equal(s.verdict?.kind, 'correct');
    assert.ok(
      Object.values(s.build.constituents).some(
        (c) => c.form === 'NP' && c.span[0] === 0 && c.span[1] === 1,
      ),
    );
  });
});

describe('a wrong answer holds still', () => {
  it('the build, the selection, and the open question all stay where they were', () => {
    let s: Session = { ...emptySession(), selection: { kind: 'span', span: [3, 3] } };
    const row = optionsFor(s.build, W, s.selection)
      .groups.flatMap((g) => g.options)
      .find((o) => o.key === 'form:Adj')!;
    s = answer(s, shoes, W, row);

    assert.equal(s.verdict?.kind, 'wrong');
    assert.deepEqual(s.build.constituents, {}, 'nothing entered the diagram');
    assert.deepEqual(s.selection, { kind: 'span', span: [3, 3] });
    assert.equal(sessionPanel(s.build, W, s.selection, shoes).step, 'word-class');
    assert.deepEqual(
      s.navigation,
      { kind: 'stay', question: 'word-class' },
      'the transaction tells the panel to keep the refused question open',
    );
    assert.equal(
      activeGroupAfterAnswer(false, 'anything', s.navigation),
      'word-class',
      'and the panel rule obeys it',
    );

    // The refusal is remembered against those exact words, and applying it
    // blocks the row without disturbing anything else in the group.
    const blocked = blockRejectedOptions(
      sessionPanel(s.build, W, s.selection, shoes),
      s.rejected['3-3']!,
    );
    const adj = blocked.groups.flatMap((g) => g.options).find((o) => o.key === 'form:Adj')!;
    assert.equal(adj.state, 'blocked');
    assert.match(adj.note!, /is not an adjective/);
  });
});

describe('edge punctuation', () => {
  it('contentSpan trims the marks a drag naturally sweeps up', () => {
    assert.deepEqual(contentSpan(W, [0, 6]), [0, 5]);
    assert.equal(contentSpan(W, [6, 6]), null);
  });

  it('raw and trimmed edge punctuation reach the same decision', () => {
    const trimmed = optionsFor(emptySession().build, W, { kind: 'span', span: [0, 5] });
    const raw = optionsFor(emptySession().build, W, { kind: 'span', span: [0, 6] });
    assert.deepEqual(raw, trimmed);
  });
});

describe('the stored readings never reveal a span answer', () => {
  it('a span selection turns the grammar shortlist into a neutral inventory', () => {
    // *I saw the man with the telescope* — two accepted readings. Before any
    // pick, the palette must not know which one the corpus prefers.
    const at = (text: string) => ambiguous.words.findIndex((w) => w.text === text);
    const span: Span = [at('with'), at('telescope')];
    const fromSession = sessionPanel(
      emptySession().build,
      ambiguous.words,
      {
        kind: 'span',
        span,
      },
      ambiguous,
    );
    const phrase = fromSession.groups.find((group) => group.id === 'phrase-form')!;
    assert.ok(phrase.options.every((option) => option.state === 'available'));
    assert.ok(phrase.options.every((option) => option.hotkey === undefined));
    assert.equal(fromSession.suggested, 0);
  });
});

describe('spelling guesses that must not overfit the ledger sentence', () => {
  const word = (text: string, i = 1): Word[] => {
    const words: Word[] = [];
    words[i] = { i, text, upos: 'X', xpos: 'XX', lemma: text.toLowerCase() };
    return words;
  };
  const forms = (w: Word[], i: number) => suggest(w, [i, i]).map((s) => s.form);

  it('every possessive determiner leads with Det, not just “my”', () => {
    for (const text of ['their', 'our', 'her']) {
      assert.equal(forms(word(text), 1)[0], 'Det', text);
    }
  });

  it('an adjective genuinely ending in -y is still offered as one', () => {
    assert.ok(forms(word('happy'), 1).includes('Adj'));
  });

  it('a genuine third-person -s verb still has V on the table', () => {
    assert.ok(forms(word('runs'), 1).includes('V'));
  });

  it('a bare plural in -s still has N on the table', () => {
    assert.ok(forms(word('tools'), 1).includes('N'));
  });
});
