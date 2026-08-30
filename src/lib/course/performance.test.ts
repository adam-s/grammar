import assert from 'node:assert/strict';
import test from 'node:test';

import { DEFAULT_TIMING, perform, type Gestures } from './performance.ts';

/** Gestures that record their order and let a test resolve them by hand. */
function recorder() {
  const log: string[] = [];
  const pending: (() => void)[] = [];
  const manual = (name: string) => (index?: number) => {
    log.push(index === undefined ? name : `${name}:${index}`);
    return new Promise<void>((resolve) => pending.push(resolve));
  };
  const gestures: Gestures = {
    moveToSelection: manual('move'),
    press: manual('press') as () => Promise<void>,
    applySelection: (index) => log.push(`select:${index}`),
    aimOption: manual('aim'),
    applyChoice: (index) => log.push(`choice:${index}`),
    closePalette: (index) => log.push(`close:${index}`),
    hold: async (ms) => {
      log.push(`hold:${ms}`);
    },
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
  for (let i = 0; i < 4; i++) await release(); // move, press, aim, press
  await run;
  assert.deepEqual(log, [
    'move:0',
    'press',
    'select:0',
    `hold:${DEFAULT_TIMING.open}`,
    'aim:0',
    `hold:${DEFAULT_TIMING.decide}`,
    'press',
    'choice:0',
    `hold:${DEFAULT_TIMING.commit}`,
    'close:0',
    `hold:${DEFAULT_TIMING.between}`,
  ]);
});

test('the label lands only after the release completes, palette still up', async () => {
  const { log, gestures, release } = recorder();
  const run = perform(1, gestures, DEFAULT_TIMING, () => true);
  await release(); // move
  await release(); // selection press
  await release(); // aim
  // The option press is IN FLIGHT: the choice must not have been applied and
  // the palette must not have closed.
  assert.ok(!log.some((entry) => entry.startsWith('choice')), 'no label before the release');
  assert.ok(!log.some((entry) => entry.startsWith('close')), 'no close before the release');
  await release(); // the release completes
  await run;
  const choiceAt = log.indexOf('choice:0');
  const closeAt = log.indexOf('close:0');
  assert.ok(choiceAt > log.lastIndexOf('press'), 'label follows the completed press');
  assert.ok(closeAt > choiceAt, 'the palette closes only after the label landed');
});

test('selection appears only after the arrival press, never on approach', async () => {
  const { log, gestures, release } = recorder();
  const run = perform(1, gestures, DEFAULT_TIMING, () => true);
  await release(); // move done — but no press yet…
  assert.ok(!log.some((entry) => entry.startsWith('select')), 'arrival alone selects nothing');
  await release(); // press
  assert.ok(log.includes('select:0'), 'the press is what selects');
  await release();
  await release();
  await run;
});

test('a dead stage stops the performance without a stray later gesture', async () => {
  const { log, gestures, release } = recorder();
  let alive = true;
  const run = perform(3, gestures, DEFAULT_TIMING, () => alive);
  await release(); // move
  alive = false;
  await release(); // the in-flight press resolves…
  await run;
  assert.ok(!log.includes('select:0'), '…but its effect is never applied');
  assert.equal(log.filter((entry) => entry.startsWith('move')).length, 1, 'no next step begins');
});

test('steps play in order, each with its own full gesture', async () => {
  const { log, gestures, release } = recorder();
  const run = perform(2, gestures, DEFAULT_TIMING, () => true);
  for (let i = 0; i < 8; i++) await release();
  await run;
  assert.deepEqual(
    log.filter((entry) => /^(select|choice|close):/.test(entry)),
    ['select:0', 'choice:0', 'close:0', 'select:1', 'choice:1', 'close:1'],
  );
});
