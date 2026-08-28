/**
 * No module in `src/lib` may depend on a module that depends on it.
 *
 * A cycle usually does nothing: whichever module is imported first pulls the
 * other in, and both finish. It bites when a `const` is read while the other
 * half of the loop is still evaluating, and then the failure depends on which
 * module the application happened to load first — the tests can pass, the build
 * can pass, and a direct import of the same file throws.
 *
 * That happened here. `constructed.ts` reached for the `unreviewed` placeholder
 * in `readiness.ts`, and `readiness.ts` imports the finished course, which is
 * built out of `constructed.ts`. The placeholder now lives beside the field it
 * describes, in a module that imports nothing.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const LIB = fileURLToPath(new URL('../', import.meta.url));

/** Every source module under `src/lib`, tests excluded — they import freely. */
function modules(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return modules(path);
    return name.endsWith('.ts') && !name.endsWith('.test.ts') ? [normalize(path)] : [];
  });
}

/** What a module imports, as absolute paths, ignoring anything outside `src/lib`. */
function importsOf(path: string): string[] {
  const text = readFileSync(path, 'utf8');
  const out: string[] = [];
  for (const match of text.matchAll(/import\s+(?:type\s+)?[^'"]*from\s+['"](\.[^'"]+)['"]/g)) {
    out.push(normalize(join(dirname(path), match[1]!)));
  }
  return out;
}

describe('the module graph has no cycles', () => {
  const graph = new Map<string, string[]>();
  for (const path of modules(LIB)) graph.set(path, importsOf(path));

  it('nothing imports a module that imports it back', () => {
    const state = new Map<string, 'open' | 'done'>();
    const cycles: string[] = [];

    const walk = (node: string, stack: string[]) => {
      state.set(node, 'open');
      for (const next of graph.get(node) ?? []) {
        if (!graph.has(next)) continue;
        if (state.get(next) === 'open') {
          const from = stack.indexOf(next);
          cycles.push(
            [...stack.slice(from === -1 ? stack.length - 1 : from), next]
              .map((p) => relative(LIB, p))
              .join(' → '),
          );
        } else if (!state.has(next)) {
          walk(next, [...stack, next]);
        }
      }
      state.set(node, 'done');
    };

    for (const node of graph.keys()) if (!state.has(node)) walk(node, [node]);
    assert.deepEqual(cycles, [], `import cycles:\n  ${cycles.join('\n  ')}`);
  });

  it('found the modules it claims to have checked', () => {
    // Without this the check passes by not running, which is how a check that
    // walks the filesystem usually fails.
    assert.ok(graph.size > 80, `only ${graph.size} modules were read`);
  });
});
