import assert from 'node:assert/strict';
import test from 'node:test';
import type { Selection } from '../grammar/options.ts';
import type { TutorialBeat } from './script.ts';
import {
  HOLD,
  IDLE,
  advance,
  begin,
  fail,
  gestureFault,
  pickFault,
  progress,
  selectFault,
  stop,
} from './run.ts';

const beat = (index: number): TutorialBeat => ({
  index,
  kind: 'form',
  select: { kind: 'span', span: [0, 0] },
  key: 'form:NP',
  subject: '“Birds”',
  question: 'What is “Birds”?',
  answer: 'Noun phrase',
  statement: '“Birds” is a noun phrase.',
});
const BEATS = [beat(0), beat(1), beat(2)];

test('a run walks ask then answer for every decision, then finishes', () => {
  let state = begin(BEATS);
  const seen: string[] = [];
  for (let guard = 0; guard < 20 && state.status === 'running'; guard++) {
    seen.push(`${state.index}:${state.act}`);
    state = advance(state, BEATS);
  }
  assert.deepEqual(seen, ['0:ask', '0:answer', '1:ask', '1:answer', '2:ask', '2:answer']);
  assert.equal(state.status, 'done');
});

test('a sentence with nothing to build fails rather than opening an empty run', () => {
  const state = begin([]);
  assert.equal(state.status, 'failed');
  assert.match(state.problem!, /nothing to build/);
});

test('advance does nothing once the run is not running', () => {
  for (const status of ['idle', 'done', 'stopped', 'failed'] as const) {
    const state = { ...IDLE, status };
    assert.deepEqual(advance(state, BEATS), state);
  }
});

test('stopping is only possible mid-run, and never overwrites a failure', () => {
  assert.equal(stop(begin(BEATS)).status, 'stopped');
  const failed = fail(begin(BEATS), 'the menu closed');
  assert.deepEqual(stop(failed), failed);
});

/* ------------------------------------------------- the postcondition rules */

test('a row the palette never offers stops the run and names the row', () => {
  assert.match(selectFault(BEATS[0]!, { found: false })!, /never offered “Noun phrase”/);
  assert.match(selectFault(BEATS[0]!, null)!, /never offered/);
});

test('a row that exists but is blocked reports the block, not a missing row', () => {
  const fault = selectFault(BEATS[0]!, { found: true, pickable: false, state: 'blocked' });
  assert.match(fault!, /is blocked for “Birds”/);
});

test('an offered, pickable row is no fault at all', () => {
  assert.equal(selectFault(BEATS[0]!, { found: true, pickable: true, state: 'available' }), null);
});

test('a refused pick reports the reason the palette gave', () => {
  assert.match(pickFault(BEATS[0]!, { ok: false, reason: 'no option' }, false)!, /no option/);
});

/**
 * The one a plain "did it throw?" check would miss: the handler can accept a
 * pick and leave the diagram exactly as it was. Time passing is not evidence
 * the step happened.
 */
test('a pick that lands but changes nothing is still a failure', () => {
  assert.match(pickFault(BEATS[0]!, { ok: true }, false)!, /changed nothing/);
  assert.equal(pickFault(BEATS[0]!, { ok: true }, true), null);
});

test('progress runs from the first moment to a full bar at the end', () => {
  const first = progress(begin(BEATS), BEATS);
  assert.ok(first > 0 && first < 1);
  assert.equal(progress({ ...IDLE, status: 'done' }, BEATS), 1);
  assert.equal(progress(IDLE, []), 0);
});

test('the answer is held longer than the question, because it says more', () => {
  assert.ok(HOLD.answer > HOLD.ask);
});

/*
 * The gesture boundary: a performed drag or marquee is only believed when the
 * page's handlers committed the selection the script named. These are the
 * cases the marquee bug shipped through — the sweep looked right while the
 * commit was empty.
 */
test('a gesture that committed the expected span is no fault', () => {
  assert.equal(gestureFault({ kind: 'span', span: [1, 4] }, { kind: 'span', span: [1, 4] }), null);
});

test('a gesture that committed nothing is named as nothing', () => {
  assert.match(gestureFault({ kind: 'span', span: [1, 4] }, { kind: 'none' })!, /nothing/);
  assert.match(gestureFault({ kind: 'nodes', ids: ['c1', 'c2'], span: [0, 4] }, null)!, /nothing/);
});

test('a marquee is judged by its ids, in any order', () => {
  const want: Selection = { kind: 'nodes', ids: ['c1', 'c2'], span: [0, 4] };
  assert.equal(gestureFault(want, { kind: 'nodes', ids: ['c2', 'c1'], span: [0, 4] }), null);
  const wrong = gestureFault(want, { kind: 'nodes', ids: ['c1'], span: [0, 0] });
  assert.match(wrong!, /c1/);
  assert.match(wrong!, /not the labels c1, c2/);
});

test('a marquee that collapsed to a span or a lone node is a fault', () => {
  const want: Selection = { kind: 'nodes', ids: ['c1', 'c2'], span: [0, 4] };
  assert.match(gestureFault(want, { kind: 'span', span: [0, 4] })!, /words 1–5/);
  assert.match(gestureFault(want, { kind: 'node', id: 'c1' })!, /c1/);
});

test('a node click is judged by its id', () => {
  assert.equal(gestureFault({ kind: 'node', id: 'c3' }, { kind: 'node', id: 'c3' }), null);
  assert.match(gestureFault({ kind: 'node', id: 'c3' }, { kind: 'node', id: 'c1' })!, /c1/);
});
