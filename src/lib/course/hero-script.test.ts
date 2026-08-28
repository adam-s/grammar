import assert from 'node:assert/strict';
import { test } from 'node:test';

import { gardenPath, vint } from '../grammar/fixtures.ts';
import { layout } from '../grammar/layout.ts';
import {
  DEFAULT_TIMING,
  beatAt,
  duration,
  frameDepth,
  script,
  stateIndexFor,
} from './hero-script.ts';
import { replaySentence } from './sentence-renderer.ts';

const steps = replaySentence(vint).steps;
const beats = script(steps);
const total = duration(steps);

test('every decision gets all four beats, in order', () => {
  assert.equal(beats.length, steps.length * 4);
  for (let i = 0; i < steps.length; i++) {
    const four = beats.slice(i * 4, i * 4 + 4);
    assert.deepEqual(
      four.map((b) => b.phase),
      ['select', 'open', 'aim', 'commit'],
    );
    assert.ok(four.every((b) => b.step === i));
  }
});

test('time only moves forward', () => {
  for (let i = 1; i < beats.length; i++) {
    assert.ok(beats[i]!.at > beats[i - 1]!.at, `beat ${i} does not advance`);
  }
});

test('the pass is long enough to be readable', () => {
  const per =
    DEFAULT_TIMING.select + DEFAULT_TIMING.open + DEFAULT_TIMING.aim + DEFAULT_TIMING.commit;
  assert.equal(total, steps.length * per + DEFAULT_TIMING.rest);
  assert.ok(total > steps.length * 800, 'a decision should take most of a second');
});

test('the label lands only on commit, never while the menu is deciding', () => {
  assert.equal(stateIndexFor({ step: 3, phase: 'select', at: 0 }), 2);
  assert.equal(stateIndexFor({ step: 3, phase: 'open', at: 0 }), 2);
  assert.equal(stateIndexFor({ step: 3, phase: 'aim', at: 0 }), 2);
  assert.equal(stateIndexFor({ step: 3, phase: 'commit', at: 0 }), 3);
});

test('the first beat draws an empty diagram', () => {
  assert.equal(stateIndexFor(beats[0]!), -1);
});

test('it loops rather than ending', () => {
  const first = beatAt(beats, 0, total)!;
  const wrapped = beatAt(beats, total, total)!;
  assert.deepEqual(
    { step: wrapped.step, phase: wrapped.phase },
    { step: first.step, phase: first.phase },
  );
});

test('a negative elapsed still lands on a real beat', () => {
  const b = beatAt(beats, -50, total);
  assert.ok(b && b.index >= 0 && b.index < beats.length);
});

test('the rest at the end holds the finished diagram', () => {
  const last = beatAt(beats, total - 1, total)!;
  assert.equal(last.phase, 'commit');
  assert.equal(last.step, steps.length - 1);
});

test('every frame keeps the finished word baseline', () => {
  const replay = replaySentence(gardenPath);
  const depth = frameDepth(replay.final, gardenPath.words);
  const baselines = replay.steps.map(
    ({ state }) => layout(state.constituents, gardenPath.words, { minDepth: depth }).height,
  );

  assert.equal(new Set(baselines).size, 1);
  assert.equal(baselines[0], layout(replay.final.constituents, gardenPath.words).height);
});

test('an empty replay produces nothing rather than throwing', () => {
  assert.equal(beatAt([], 0, 0), null);
  assert.deepEqual(script([]), []);
});

test('the garden-path sentence scripts too, verb classifications included', () => {
  const long = replaySentence(gardenPath).steps;
  const b = script(long);
  assert.equal(b.length, long.length * 4);
  assert.equal(long.filter((s) => s.kind === 'verb-type').length, 2, 'two clauses, two verbs');
});

test('every step names the words it is about and the option it takes', () => {
  for (const s of replaySentence(gardenPath).steps) {
    assert.ok(s.span[0] <= s.span[1], 'span runs forward');
    assert.ok(s.nodeId, 'a step names the node it landed on');
    const choice =
      s.choice.form ??
      s.choice.func ??
      s.choice.verbType ??
      s.choice.voice ??
      s.choice.partKind ??
      s.choice.finiteness ??
      s.choice.clauseKind;
    assert.ok(choice, `${s.kind} step has no option to click`);
  }
});
