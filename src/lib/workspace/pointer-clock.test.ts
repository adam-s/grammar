import assert from 'node:assert/strict';
import test from 'node:test';

import { PausableClock, awaitNewest } from './pointer-clock.ts';

/** A hand-cranked timebase: sleeps advance it, pause is under test control. */
function crank() {
  let t = 0;
  const clock = new PausableClock(
    () => t,
    async (ms) => {
      t += ms;
    },
  );
  return { clock, at: () => t, advance: (ms: number) => (t += ms) };
}

test('demonstration time excludes every paused stretch', () => {
  const { clock, advance } = crank();
  advance(100);
  assert.equal(clock.now(), 100);
  clock.pause();
  advance(500);
  assert.equal(clock.now(), 100, 'time is frozen while paused');
  clock.resume();
  advance(40);
  assert.equal(clock.now(), 140, 'resume continues from where it froze');
});

test('a wait consumes exactly its duration of demonstration time', async () => {
  const { clock } = crank();
  await clock.wait(100);
  assert.equal(clock.now(), 100);
});

test('pausing mid-wait stretches real time but not demonstration time', async () => {
  let t = 0;
  let sleeps = 0;
  const clock = new PausableClock(
    () => t,
    async (ms) => {
      sleeps += 1;
      // Simulate the user pausing for 1s of real time partway through.
      if (sleeps === 2) {
        clock.pause();
        t += 1000;
        clock.resume();
      }
      t += ms;
    },
  );
  await clock.wait(100);
  assert.equal(clock.now(), 100, 'the pause added nothing to demonstration time');
  assert.ok(t >= 1100, 'real time includes the pause');
});

test('awaitNewest follows a superseding flight instead of a stale one', async () => {
  let resolveA!: () => void;
  let resolveB!: () => void;
  const a = new Promise<void>((r) => (resolveA = r));
  const b = new Promise<void>((r) => (resolveB = r));
  let latest: Promise<void> | null = a;

  let done = false;
  const waiting = awaitNewest(() => latest).then(() => (done = true));

  // While the press waits on flight A, the palette launches flight B.
  latest = b;
  resolveA();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(done, false, 'finishing the stale flight is not arrival');

  resolveB();
  await waiting;
  assert.equal(done, true, 'the newest flight landing is arrival');
});

test('awaitNewest with no flight in the air returns at once', async () => {
  await awaitNewest(() => null);
});

test('cancelling a PAUSED clock settles its pending wait', async () => {
  // Real timers on purpose: the bug was a destroyed component whose paused
  // clock kept a wait polling forever, because demonstration time was frozen.
  const clock = new PausableClock();
  clock.pause();
  let settled = false;
  const waiting = clock.wait(10_000).then(() => (settled = true));
  await new Promise((tick) => setTimeout(tick, 80));
  assert.equal(settled, false, 'paused: the wait is honestly still pending');
  clock.cancel();
  await waiting;
  assert.equal(settled, true, 'cancel settles it without resuming time');
});

test('a cancelled clock never blocks again', async () => {
  const clock = new PausableClock();
  clock.cancel();
  clock.pause();
  await clock.wait(60_000);
});

test('waitUntil resolves true the moment the condition holds', async () => {
  const { clock, at } = crank();
  let flag = false;
  const held = clock.waitUntil(() => {
    if (at() >= 150) flag = true;
    return flag;
  });
  assert.equal(await held, true);
});

test('waitUntil times out on DEMONSTRATION time, so a pause cannot expire it', async () => {
  let t = 0;
  let polls = 0;
  const clock = new PausableClock(
    () => t,
    async (ms) => {
      polls += 1;
      // The user pauses for 10s of real time partway through the poll.
      if (polls === 2) {
        clock.pause();
        t += 10_000;
        clock.resume();
      }
      t += ms;
    },
  );
  const held = await clock.waitUntil(() => false, 200, 50);
  assert.equal(held, false, 'the deadline is honest');
  assert.ok(t >= 10_000, 'real time included the pause without expiring the deadline early');
});

test('waitUntil keeps polling while paused, so a step control is still noticed', async () => {
  let t = 0;
  const clock = new PausableClock(
    () => t,
    async (ms) => {
      t += ms;
    },
  );
  clock.pause();
  let stepped = false;
  const held = clock.waitUntil(() => stepped);
  // Demonstration time is frozen, but the poll runs on real time.
  stepped = true;
  assert.equal(await held, true);
});

test('a resume or cancel wakes registered frame sources exactly once each', () => {
  const clock = new PausableClock();
  const wakes: string[] = [];
  const off = clock.onWake(() => wakes.push('a'));
  clock.onWake(() => wakes.push('b'));
  clock.pause();
  clock.resume();
  assert.deepEqual(wakes, ['a', 'b']);
  off();
  clock.cancel();
  assert.deepEqual(wakes, ['a', 'b', 'b'], 'unsubscribed sources are not woken');
});
