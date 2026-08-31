import assert from 'node:assert/strict';
import test from 'node:test';

import { DEFAULT_TIMING, perform, type Gestures } from './performance.ts';

/** Gestures that record their order and let a test resolve them by hand. */
function recorder(overrides: Partial<Gestures> = {}) {
  const log: string[] = [];
  const pending: (() => void)[] = [];
  const manual = (name: string) => (index?: number) => {
    log.push(index === undefined ? name : `${name}:${index}`);
    return new Promise<void>((resolve) => pending.push(resolve));
  };
  const gestures: Gestures = {
    selectTarget: manual('gesture'),
    applySelection: (index) => log.push(`select:${index}`),
    aimOption: manual('aim'),
    applyChoice: manual('choice'),
    closePalette: (index) => log.push(`close:${index}`),
    hold: async (ms) => {
      log.push(`hold:${ms}`);
    },
    ...overrides,
  };
  const release = async () => {
    pending.shift()?.();
    await Promise.resolve();
    await Promise.resolve();
  };
  return { log, gestures, release };
}

test('a decision plays as one causal gesture, in the accepted order', async () => {
  const { log, gestures, release } = recorder();
  const run = perform(1, gestures, DEFAULT_TIMING, () => true);
  for (let i = 0; i < 3; i++) await release(); // gesture, aim, choice
  await run;
  assert.deepEqual(log, [
    'gesture:0',
    'select:0',
    `hold:${DEFAULT_TIMING.open}`,
    'aim:0',
    `hold:${DEFAULT_TIMING.decide}`,
    'choice:0',
    `hold:${DEFAULT_TIMING.commit}`,
    'close:0',
    `hold:${DEFAULT_TIMING.between}`,
  ]);
});

test('the palette outlives the press: no close while the choice is in flight', async () => {
  const { log, gestures, release } = recorder();
  const run = perform(1, gestures, DEFAULT_TIMING, () => true);
  await release(); // the selection gesture
  await release(); // aim
  // The option press is IN FLIGHT: the palette must not have closed.
  assert.ok(log.includes('choice:0'), 'the press-and-land gesture has begun');
  assert.ok(!log.some((entry) => entry.startsWith('close')), 'no close before it completes');
  await release(); // the press completes and the label lands
  await run;
  const choiceAt = log.indexOf('choice:0');
  const closeAt = log.indexOf('close:0');
  assert.ok(closeAt > choiceAt, 'the palette closes only after the label landed');
});

test('selection appears only when the gesture completes, never mid-gesture', async () => {
  const { log, gestures, release } = recorder();
  const run = perform(1, gestures, DEFAULT_TIMING, () => true);
  // The gesture is IN FLIGHT: nothing may be selected yet.
  assert.ok(!log.some((entry) => entry.startsWith('select')), 'mid-gesture selects nothing');
  await release(); // the gesture completes
  assert.ok(log.includes('select:0'), 'completion is what selects');
  await release();
  await release();
  await run;
});

test('a dead stage stops the performance without a stray later gesture', async () => {
  const { log, gestures, release } = recorder();
  let alive = true;
  const run = perform(3, gestures, DEFAULT_TIMING, () => alive);
  alive = false;
  await release(); // the in-flight gesture resolves…
  assert.equal(await run, null, 'a stopped pass is not a fault');
  assert.ok(!log.includes('select:0'), '…but its effect is never applied');
  assert.equal(log.filter((entry) => entry.startsWith('gesture')).length, 1, 'no next step begins');
});

test('steps play in order, each with its own full gesture', async () => {
  const { log, gestures, release } = recorder();
  const run = perform(2, gestures, DEFAULT_TIMING, () => true);
  for (let i = 0; i < 6; i++) await release();
  await run;
  assert.deepEqual(
    log.filter((entry) => /^(select|choice|close):/.test(entry)),
    ['select:0', 'choice:0', 'close:0', 'select:1', 'choice:1', 'close:1'],
  );
});

test('a failed selection verify abandons the pass and reports the problem', async () => {
  const { log, gestures } = recorder({
    selectTarget: async (index) => {
      log.push(`gesture:${index}`);
    },
    verifySelection: async () => 'The menu never offered the row.',
  });
  const fault = await perform(3, gestures, DEFAULT_TIMING, () => true);
  assert.equal(fault, 'The menu never offered the row.');
  assert.ok(!log.some((entry) => entry.startsWith('aim')), 'no aim after the failed check');
  assert.equal(log.filter((entry) => entry.startsWith('gesture')).length, 1, 'no next step');
});

test('a failed choice verify abandons the pass after the landing attempt', async () => {
  const { log, gestures } = recorder({
    selectTarget: async () => {},
    aimOption: async () => {},
    applyChoice: (index) => {
      log.push(`choice:${index}`);
    },
    verifyChoice: async () => 'Picking it changed nothing on the diagram.',
  });
  const fault = await perform(3, gestures, DEFAULT_TIMING, () => true);
  assert.equal(fault, 'Picking it changed nothing on the diagram.');
  assert.ok(log.includes('choice:0'), 'the attempt was made');
  assert.ok(!log.includes('close:0'), 'the pass stopped where it failed');
});

test('clean verifies let the pass continue to the next decision', async () => {
  const { log, gestures } = recorder({
    selectTarget: async () => {},
    aimOption: async () => {},
    applyChoice: () => {},
    verifySelection: async () => null,
    verifyChoice: async () => null,
  });
  const fault = await perform(2, gestures, DEFAULT_TIMING, () => true);
  assert.equal(fault, null);
  assert.deepEqual(
    log.filter((entry) => /^(select|close):/.test(entry)),
    ['select:0', 'close:0', 'select:1', 'close:1'],
  );
});

/**
 * The stopping contract, rule 1, at EVERY boundary: whenever `alive` flips
 * during the k-th observable call, nothing later runs — not the next
 * gesture, not an apply effect, not a verify, not a close. A single missed
 * check here is the shipped-bug class where a Stop landed and the menu
 * still opened.
 */
test('stopping at any boundary delivers no later gesture or effect', async () => {
  const CALLS_PER_STEP = 7; // gesture, select, verifySel, aim, choice, verifyChoice, close
  for (let stopAt = 0; stopAt < CALLS_PER_STEP * 2; stopAt++) {
    let calls = 0;
    let alive = true;
    const log: string[] = [];
    const mark = (name: string) => {
      log.push(name);
      if (++calls === stopAt + 1) alive = false;
    };
    const gestures: Gestures = {
      selectTarget: async (i) => mark(`gesture:${i}`),
      applySelection: (i) => mark(`select:${i}`),
      verifySelection: async (i) => {
        mark(`verifySel:${i}`);
        return null;
      },
      aimOption: async (i) => mark(`aim:${i}`),
      applyChoice: async (i) => mark(`choice:${i}`),
      verifyChoice: async (i) => {
        mark(`verifyChoice:${i}`);
        return null;
      },
      closePalette: (i) => mark(`close:${i}`),
      hold: async () => {},
    };
    const fault = await perform(3, gestures, DEFAULT_TIMING, () => alive);
    assert.equal(fault, null, 'a stop is not a fault');
    assert.equal(
      log.length,
      stopAt + 1,
      `stopped during call ${stopAt + 1}; nothing later ran (${log.join(', ')})`,
    );
  }
});
