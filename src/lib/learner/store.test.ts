import assert from 'node:assert/strict';
import test from 'node:test';
import { clearRecord, completionKey, exportRecord, ownsKey, snapshotKey, traceKey } from './store.ts';

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
