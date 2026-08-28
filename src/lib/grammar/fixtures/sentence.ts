/**
 * The shared frame every fixture is built in.
 *
 * Metrics are computed rather than asserted. `clauses` was hardcoded to 1 for
 * a long time, and stopped being true the moment a fixture held two — a number
 * nobody derives is a number nobody checks.
 */
import { textOf, type BuiltReading } from '../build.ts';
import type { SentenceEntry } from '../types.ts';

export function sentence(
  id: string,
  locator: string,
  built: BuiltReading[],
  canonicalId: string,
  features: string[],
): SentenceEntry {
  const words = built[0]!.words;
  const depth = Math.max(...built.map((b) => depthOf(b)));
  return {
    id,
    text: textOf(words),
    source: { work: 'fixture', gutenbergId: 0, locator },
    words,
    readings: built.map((b) => b.reading),
    canonicalId,
    features,
    metrics: { tokens: words.length, clauses: clausesOf(built[0]!), depth },
    provenance: {
      parser: 'hand',
      reviewedBy: 'contract',
      reviewedAt: '2026-08-27',
      audits: 'pass',
    },
  };
}

/** Clause nodes in the canonical reading. */
function clausesOf(b: BuiltReading): number {
  return Object.values(b.reading.constituents).filter((c) => c.form === 'S' || c.form === 'Cl')
    .length;
}

function depthOf(b: BuiltReading): number {
  const cs = b.reading.constituents;
  let max = 0;
  const walk = (id: string, d: number) => {
    max = Math.max(max, d);
    for (const k of cs[id]?.children ?? []) walk(k, d + 1);
  };
  const root = Object.keys(cs).find((k) => cs[k]!.parent === null);
  if (root) walk(root, 0);
  return max;
}
