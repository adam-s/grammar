/**
 * The decision snapshot (Phase 1 of docs/temp-decision-model-refactor.md).
 *
 * The promise here is narrow and load-bearing: every open palette can be
 * explained from one serializable object. The reasoning is not moved — the
 * ledger tests hold the learner-visible promises — so what this file checks
 * is that the snapshot tells the truth about the states the ledger walks:
 * deferred is not offer, settled is not deferred, and no answer is revealed
 * merely because the grammar can narrow it to one correct move.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LESSON_02 } from '../course/sentences/lesson-02.ts';
import { wrap } from './builder.ts';
import { decisionSnapshot, describeDecision, type DecisionSnapshot } from './decision.ts';
import { answer, emptySession, sessionChoices, sessionPanel, type Session } from './session.ts';
import { isPickable, type Selection } from './options.ts';

const shoes = LESSON_02.find((s) => s.id === 'c02-d')!;
const W = shoes.words; // The(0) shoes(1) on(2) my(3) feet(4) pinched(5) .(6)

/** A step's selection, computed against the session as it stands. */
type Pick = [Selection | ((s: Session) => Selection), string];

/** Drive the session through correct picks, returning the state that results. */
function play(steps: Pick[]): Session {
  let s: Session = emptySession();
  for (const [where, key] of steps) {
    s = { ...s, selection: typeof where === 'function' ? where(s) : where, verdict: null };
    const row = sessionPanel(s.build, W, s.selection, shoes)
      .groups.flatMap((g) => g.options)
      .find((o) => o.key === key);
    assert.ok(row, `${key} is not offered`);
    s = answer(s, shoes, W, row);
    assert.notEqual(s.verdict?.kind, 'wrong', `${key} was refused`);
  }
  return s;
}

const span = (a: number, b: number): Selection => ({ kind: 'span', span: [a, b] });
const nodeOver = (s: Session, a: number, b: number): Selection => {
  const id = Object.keys(s.build.constituents).find((k) => {
    const c = s.build.constituents[k]!;
    return c.span[0] === a && c.span[1] === b && c.word === undefined;
  })!;
  return { kind: 'node', id };
};

const question = (d: DecisionSnapshot, id: string) => d.questions.find((q) => q.id === id)!;

/** Up to the NP over “my feet”, with nothing above it yet. */
const NP_BARE: Pick[] = [
  [span(3, 3), 'form:Det'],
  [span(4, 4), 'form:N'],
  [span(3, 4), 'form:NP'],
];

/** The same NP once its PP exists. */
const NP_IN_PP: Pick[] = [...NP_BARE, [span(2, 2), 'form:P'], [span(2, 4), 'form:PP']];

describe('the snapshot separates the states one boolean used to hide', () => {
  it('an NP may name its future PP job before the PP is drawn', () => {
    const s = play(NP_BARE);
    const d = decisionSnapshot(s.build, W, nodeOver(s, 3, 4), shoes);
    const fn = question(d, 'function');
    assert.equal(fn.role, 'offer');
    assert.equal(d.completion, 'complete');
    assert.equal(
      fn.candidates.find((candidate) => candidate.action.key === 'func:complement')?.availability,
      'available',
    );
    assert.equal(question(d, 'stack').role, 'offer', 'a second layer stays a plain offer');
  });

  it('the same future job is available inside an outer NP', () => {
    const s = play([
      [span(0, 4), 'form:NP'],
      [span(3, 3), 'form:Det'],
      [span(4, 4), 'form:N'],
      [span(3, 4), 'form:NP'],
    ]);
    const d = decisionSnapshot(s.build, W, nodeOver(s, 3, 4), shoes);
    const fn = question(d, 'function');
    assert.equal(fn.role, 'offer');
    assert.equal(
      fn.candidates.find((candidate) => candidate.action.key === 'func:complement')?.availability,
      'available',
    );
  });

  it('the same NP inside its PP: every job starts available', () => {
    const s = play(NP_IN_PP);
    const d = decisionSnapshot(s.build, W, nodeOver(s, 3, 4), shoes);
    const fn = question(d, 'function');
    assert.equal(fn.role, 'required');
    assert.equal(d.activeQuestion, 'function');
    assert.equal(d.completion, 'open');
    const complement = fn.candidates.find((c) => c.action.key === 'func:complement')!;
    assert.equal(complement.availability, 'available');
    // The snapshot is the developer's window, so it still says which jobs the
    // structure rules out and why. What the LEARNER meets is the projection,
    // and there every job is a real choice.
    const shown = sessionPanel(s.build, W, nodeOver(s, 3, 4), shoes).groups.find(
      (g) => g.id === 'function',
    )!;
    assert.ok(shown.options.every((option) => isPickable(option)));
  });

  it('a future parent permits a plausible wrong job, then disables only that attempt', () => {
    let s = play(NP_IN_PP);
    const pp = nodeOver(s, 2, 4);
    s = { ...s, selection: pp, verdict: null };

    const before = sessionChoices(s, shoes, W);
    const functions = before.groups.find((group) => group.id === 'function')!;
    const postmodifier = functions.options.find((option) => option.key === 'func:postmodifier')!;
    const supplement = functions.options.find((option) => option.key === 'func:supplement')!;
    assert.ok(isPickable(postmodifier), 'the accepted job stays available');
    assert.ok(isPickable(supplement), 'a structurally plausible alternative is not revealed away');

    const unchanged = s.build;
    s = answer(s, shoes, W, supplement);
    assert.equal(s.verdict?.kind, 'wrong');
    assert.ok(s.verdict?.test, 'the header gives the learner a test after the miss');
    assert.strictEqual(s.build, unchanged, 'a wrong hypothesis does not change the tree');

    const after = sessionChoices(s, shoes, W).groups.find((group) => group.id === 'function')!;
    assert.equal(
      after.options.find((option) => option.key === 'func:supplement')!.state,
      'blocked',
    );
    assert.ok(
      after.options
        .filter((option) => option.key !== 'func:supplement')
        .every((option) => option.state === 'available'),
      'every untried function remains available',
    );
  });

  it('a known verb may try a wrong one-word phrase without revealing VP', () => {
    let s = play([
      [span(5, 5), 'form:V'],
      [(current) => current.selection, 'vt:Vint'],
    ]);
    const verb = s.selection;
    assert.equal(verb.kind, 'node');

    const before = sessionChoices(s, shoes, W);
    const forms = before.groups.find((group) => group.id === 'phrase-form')!;
    const pp = forms.options.find((option) => option.key === 'form:PP')!;
    const vp = forms.options.find((option) => option.key === 'form:VP')!;
    assert.ok(isPickable(pp), 'a wrong but untried phrase remains a real choice');
    assert.ok(isPickable(vp), 'the accepted phrase remains available without being revealed');

    const unchanged = s.build;
    s = answer(s, shoes, W, pp);
    assert.equal(s.verdict?.kind, 'wrong');
    assert.ok(s.verdict?.test, 'the header explains how to test the phrase');
    assert.strictEqual(s.build, unchanged, 'the wrong phrase does not enter the tree');

    const after = sessionChoices(s, shoes, W).groups.find((group) => group.id === 'phrase-form')!;
    assert.equal(after.options.find((option) => option.key === 'form:PP')!.state, 'blocked');
    assert.ok(
      after.options
        .filter((option) => option.key !== 'form:PP')
        .every((option) => option.state === 'available'),
      'every untried phrase type remains available',
    );
  });

  it('a word no reading lets stand alone: the phrase question is settled', () => {
    const s = play(NP_BARE.slice(0, 2));
    const feet = Object.keys(s.build.constituents).find(
      (k) => s.build.constituents[k]!.word === 4,
    )!;
    const d = decisionSnapshot(s.build, W, { kind: 'node', id: feet }, shoes);
    assert.equal(question(d, 'phrase-form').role, 'settled');
    // Its future head job is available without making it a required step.
    assert.equal(question(d, 'function').role, 'offer');
    assert.equal(d.completion, 'complete');
  });

  it('a sole correct job under the full grammar remains a required choice', () => {
    const s = play([
      [span(0, 0), 'form:Det'],
      [span(1, 1), 'form:N'],
      [span(3, 3), 'form:Det'],
      [span(4, 4), 'form:N'],
      [span(3, 4), 'form:NP'],
      [span(2, 2), 'form:P'],
      [span(2, 4), 'form:PP'],
      [(s) => nodeOver(s, 3, 4), 'func:complement'],
      [span(1, 4), 'form:Nom'],
      [(s) => nodeOver(s, 2, 4), 'func:postmodifier'],
      [span(0, 4), 'form:NP'],
      [(s) => nodeOver(s, 0, 4), 'func:subject'],
      [span(5, 5), 'form:V'],
      [(s) => s.selection, 'vt:Vint'],
    ]);
    const build = wrap(s.build, W, [5, 5], 'VP');
    const vp = Object.keys(build.constituents).find((k) => build.constituents[k]!.form === 'VP')!;
    const d = decisionSnapshot(build, W, { kind: 'node', id: vp }, shoes);
    const fn = question(d, 'function');
    assert.equal(fn.role, 'required');
    const shown = sessionPanel(build, W, { kind: 'node', id: vp }, shoes).groups.find(
      (g) => g.id === 'function',
    )!;
    assert.ok(
      shown.options.every((option) => isPickable(option)),
      'one legal job does not narrow the menu the learner is shown',
    );
  });

  it('lesson scope does not disable untried choices', () => {
    const d = decisionSnapshot(emptySession().build, W, span(1, 1), shoes, {
      scope: new Set(['form:N']),
    });
    const wc = question(d, 'word-class');
    assert.equal(wc.role, 'required', 'the full grammar still offers a real choice');
    // The snapshot records the lesson boundary; the palette does not enforce
    // it, because the builder is an exploration surface and `scope` decides
    // what the lesson REQUIRES rather than what the grammar permits.
    const untaught = wc.candidates.find((c) => c.action.key === 'form:V')!;
    assert.equal(untaught.availability, 'blocked');
    const shown = sessionPanel(emptySession().build, W, span(1, 1), shoes, new Set(['form:N']));
    const row = shown.groups.flatMap((g) => g.options).find((option) => option.key === 'form:V')!;
    assert.ok(isPickable(row), 'and a learner may still try it');
  });
});

describe('the snapshot is one serializable, readable object', () => {
  it('survives a JSON round trip unchanged', () => {
    const s = play(NP_IN_PP);
    const d = decisionSnapshot(s.build, W, nodeOver(s, 3, 4), shoes);
    assert.deepEqual(JSON.parse(JSON.stringify(d)), d);
  });

  it('carries a session refusal as a blocked candidate with its reason', () => {
    let s: Session = { ...emptySession(), selection: span(3, 3) };
    const row = sessionPanel(s.build, W, s.selection, shoes)
      .groups.flatMap((g) => g.options)
      .find((o) => o.key === 'form:Adj')!;
    s = answer(s, shoes, W, row);
    const d = decisionSnapshot(s.build, W, s.selection, shoes, { rejected: s.rejected });
    const adj = question(d, 'word-class').candidates.find((c) => c.action.key === 'form:Adj')!;
    assert.equal(adj.availability, 'blocked');
    assert.match(adj.reason, /Not an adjective/);
  });

  it('describes itself without deducing anything new', () => {
    const s = play(NP_BARE);
    const d = decisionSnapshot(s.build, W, nodeOver(s, 3, 4), shoes);
    const text = describeDecision(d);
    assert.match(text, /complete/);
    assert.match(text, /function \[offer\]/);
  });
});
