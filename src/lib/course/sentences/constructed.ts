/**
 * The shared frame for a course sentence.
 *
 * Constructed, not quoted. Lessons 1–15 each need ten clean examples of one
 * pattern, and literature does not supply that on demand — ten transitive
 * clauses with no auxiliary, no coordination and no modifier is a shape you
 * write, not a shape you find. The `source` says so rather than a footnote.
 *
 * Every sentence carries its FULL parse, including labels its lesson has not
 * taught. What the lesson asks for is derived by `targetReading`, so a lesson
 * never keeps a second, staler copy of its own answer.
 */
import type { BuiltReading } from '../../grammar/build.ts';
import { sentence } from '../../grammar/entry.ts';
import {
  UNREVIEWED,
  type ConstituentMap,
  type Reading,
  type SentenceEntry,
} from '../../grammar/types.ts';

/**
 * The course writes a postmodified noun phrase with a nominal layer:
 * `[NP the [Nom shoes [PP on my feet]]]`. English grammar also licenses the
 * same meaning with a recursive NP: `[NP [NP the shoes] [PP on my feet]]`.
 *
 * Derive that second tree where the inner nominal is just a head followed by
 * one or more postmodifiers. It belongs to the same reading, so the learner can
 * build either analysis without receiving false “different meaning” feedback.
 */
function recursiveNpStructure(source: ConstituentMap): ConstituentMap | null {
  const cs: ConstituentMap = Object.fromEntries(
    Object.entries(source).map(([id, c]) => [id, { ...c, children: [...c.children] }]),
  );
  let changed = false;

  for (const [nomId, originalNom] of Object.entries(source)) {
    if (originalNom.form !== 'Nom' || originalNom.function !== 'head' || !originalNom.parent) {
      continue;
    }
    const originalOuter = source[originalNom.parent];
    if (!originalOuter || originalOuter.form !== 'NP') continue;

    const determiners = originalOuter.children.filter(
      (id) => id !== nomId && source[id]?.function === 'determiner',
    );
    const core = originalNom.children.filter((id) => source[id]?.function !== 'postmodifier');
    const postmodifiers = originalNom.children.filter(
      (id) => source[id]?.function === 'postmodifier',
    );
    // The compact recursive alternative is exact only for a simple lexical
    // head. More elaborate nominals keep their authored analysis.
    if (determiners.length === 0 || core.length !== 1 || postmodifiers.length === 0) continue;

    const outer = cs[originalNom.parent]!;
    const nom = cs[nomId]!;
    const innerChildren = [...determiners, core[0]!];
    nom.form = 'NP';
    nom.function = 'head';
    nom.children = innerChildren;
    nom.span = [cs[innerChildren[0]!]!.span[0], cs[innerChildren.at(-1)!]!.span[1]];
    for (const id of innerChildren) cs[id]!.parent = nomId;
    for (const id of postmodifiers) cs[id]!.parent = originalNom.parent;

    const replaced = new Set([nomId, ...determiners]);
    outer.children = originalOuter.children.flatMap((id) =>
      id === nomId ? [nomId, ...postmodifiers] : replaced.has(id) ? [] : [id],
    );
    changed = true;
  }

  return changed ? cs : null;
}

function withEquivalentStructures(reading: Reading): Reading {
  const recursive = recursiveNpStructure(reading.constituents);
  return recursive ? { ...reading, equivalentStructures: [recursive] } : reading;
}

export function constructed(
  id: string,
  lesson: number,
  built: BuiltReading[],
  canonicalId = 'r1',
): SentenceEntry {
  const where = `lesson ${lesson}`;
  return sentence(
    id,
    where,
    built.map(({ reading, words }) => ({ reading: withEquivalentStructures(reading), words })),
    canonicalId,
    { work: 'constructed', locator: where },
    // No human has read these parses. The field says so, so that "reviewed"
    // never becomes something a later reader assumes — and the date is empty,
    // because a date beside `unreviewed` records when a review that did not
    // happen did not happen.
    { reviewedBy: UNREVIEWED, reviewedAt: '' },
  );
}
