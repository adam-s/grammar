import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clearRecord,
  completionKey,
  exportRecord,
  ownsKey,
  saveKey,
  snapshotKey,
  traceKey,
  writeKey,
} from './store.ts';

/**
 * A minimal Storage for node. The shell reads it at call time, so tests may
 * install and reset it between cases.
 */
function installStorage(seed: Record<string, string>): Map<string, string> {
  const map = new Map(Object.entries(seed));
  (globalThis as { localStorage?: unknown }).localStorage = {
    get length() {
      return map.size;
    },
    key: (i: number) => [...map.keys()][i] ?? null,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
  };
  return map;
}

const SEED = {
  [snapshotKey('c01-a')]: '{"v":1}',
  [traceKey('c01-a')]: '{"v":2}',
  [completionKey()]: '{"v":1,"ids":[]}',
  // NOT the record's: a product setting under the same app prefix, and a
  // neighbour outside the prefix entirely.
  'grammar:theme': 'dark',
  'unrelated:key': 'kept',
};

test('the record owns exactly its snapshots, traces, and completion set', () => {
  assert.ok(ownsKey(snapshotKey('x')));
  assert.ok(ownsKey(traceKey('x')));
  assert.ok(ownsKey(completionKey()));
  assert.ok(!ownsKey('grammar:theme'), 'the theme is a product setting, not progress');
  assert.ok(!ownsKey('grammar:'), 'the bare prefix is nobody’s key');
  assert.ok(!ownsKey('unrelated:key'));
});

test('reset erases the record and leaves the theme standing', () => {
  const map = installStorage(SEED);
  clearRecord();
  assert.deepEqual(
    [...map.keys()].sort(),
    ['grammar:theme', 'unrelated:key'],
    'clearRecord took keys it does not own',
  );
});

test('the export carries the record and nothing else', () => {
  installStorage(SEED);
  const exported = JSON.parse(exportRecord()) as { record: Record<string, unknown> };
  const keys = Object.keys(exported.record).sort();
  assert.deepEqual(keys, [completionKey(), snapshotKey('c01-a'), traceKey('c01-a')].sort());
  assert.ok(!('grammar:theme' in exported.record), 'the theme preference left the browser');
});

/**
 * A Storage with a byte quota, like a browser's: a write that would take the
 * total over it throws, and nothing is written.
 */
function installFullStorage(seed: Record<string, string>, quota: number): Map<string, string> {
  const map = installStorage(seed);
  const size = () => [...map].reduce((n, [k, v]) => n + k.length + v.length, 0);
  const store = (globalThis as { localStorage: Storage }).localStorage;
  store.setItem = (k: string, v: string) => {
    const before = map.get(k);
    map.set(k, v);
    if (size() > quota) {
      if (before === undefined) map.delete(k);
      else map.set(k, before);
      throw new Error('QuotaExceededError');
    }
  };
  return map;
}

test('a write says whether it happened', () => {
  installStorage({});
  assert.equal(writeKey('grammar:x', '1'), true);
  installFullStorage({}, 5);
  assert.equal(writeKey('grammar:x', 'far too long for the quota'), false);
});

test('a full store makes room from other sentences\u2019 step histories, and says so', () => {
  const big = 'x'.repeat(400);
  const map = installFullStorage(
    {
      [traceKey('c01-a')]: big,
      [traceKey('c01-b')]: big,
      [snapshotKey('c01-a')]: '{"v":1}',
      [completionKey()]: '{"v":1,"ids":["c01-a"]}',
      'grammar:theme': 'dark',
    },
    1000,
  );
  const result = saveKey(snapshotKey('c01-c'), 'y'.repeat(300), traceKey('c01-c'));
  assert.equal(result, 'freed');
  assert.equal(map.get(snapshotKey('c01-c')), 'y'.repeat(300));
  assert.ok(!map.has(traceKey('c01-a')) && !map.has(traceKey('c01-b')), 'histories stayed');
  assert.ok(map.has(snapshotKey('c01-a')), 'a draft was evicted to make room');
  assert.ok(map.has(completionKey()), 'the checkmarks were evicted to make room');
  assert.equal(map.get('grammar:theme'), 'dark');
});

test('the history being written, or kept, is never the one cleared', () => {
  const map = installFullStorage(
    { [traceKey('c01-a')]: 'x'.repeat(400), [traceKey('c01-b')]: 'x'.repeat(400) },
    1000,
  );
  // 600 plus the other history's 400 overflows 1000; alone it fits.
  assert.equal(saveKey(traceKey('c01-a'), 'z'.repeat(600), traceKey('c01-a')), 'freed');
  assert.equal(map.get(traceKey('c01-a')), 'z'.repeat(600));
  assert.ok(!map.has(traceKey('c01-b')));
});

test('when even that is not enough, the write reports failure and drafts survive', () => {
  const map = installFullStorage(
    { [snapshotKey('c01-a')]: 'd'.repeat(600), [traceKey('c01-b')]: 'x'.repeat(100) },
    800,
  );
  assert.equal(saveKey(snapshotKey('c01-c'), 'y'.repeat(400), traceKey('c01-c')), 'failed');
  assert.ok(map.has(snapshotKey('c01-a')), 'a draft was sacrificed for a failed write');
  assert.ok(!map.has(snapshotKey('c01-c')));
});

test('a store that is not there fails plainly', () => {
  (globalThis as { localStorage?: unknown }).localStorage = undefined;
  assert.equal(saveKey(snapshotKey('c01-a'), '{}', traceKey('c01-a')), 'failed');
});
