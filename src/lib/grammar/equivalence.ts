/**
 * Trees that are different drawings of the same analysis.
 *
 * A sentence has readings, and a reading can have more than one well-formed
 * tree. `[NP the [Nom shoes [PP on my feet]]]` and `[NP [NP the shoes] [PP on
 * my feet]]` are the same claim about the sentence, and English licenses both
 * — so a learner who builds either must not be told their sentence means
 * something else.
 *
 * This lives beside the rules rather than beside the corpus because it IS a
 * grammar claim: `rules.ts` licenses a postmodifier under an `NP` only when an
 * `NP` head sits beside it, which is exactly the shape derived here. The two
 * halves have to agree, and they cannot agree from different layers.
 *
 * Note what is not done yet: only sentences built through the course's
 * `constructed` frame are given their equivalents. The hand-authored fixtures
 * carry the authored analysis alone.
 */
import type { ConstituentMap, Reading } from './types.ts';

/**
 * The course writes a postmodified noun phrase with a nominal layer:
 * `[NP the [Nom shoes [PP on my feet]]]`. English grammar also licenses the
 * same meaning with a recursive NP: `[NP [NP the shoes] [PP on my feet]]`.
 *
 * Derive that second tree where the inner nominal is just a head followed by
 * one or more postmodifiers. It belongs to the same reading, so the learner can
 * build either analysis without receiving false “different meaning” feedback.
 */
function convertibleNominals(source: ConstituentMap): string[] {
  const convertible: string[] = [];
  for (const [nomId, nom] of Object.entries(source)) {
    if (nom.form !== 'Nom' || nom.function !== 'head' || !nom.parent) continue;
    const outer = source[nom.parent];
    if (!outer || outer.form !== 'NP') continue;
    const determiners = outer.children.filter(
      (id) => id !== nomId && source[id]?.function === 'determiner',
    );
    const core = nom.children.filter((id) => source[id]?.function !== 'postmodifier');
    const postmodifiers = nom.children.filter((id) => source[id]?.function === 'postmodifier');
    if (determiners.length > 0 && core.length === 1 && postmodifiers.length > 0) {
      convertible.push(nomId);
    }
  }
  return convertible;
}

/** Convert exactly the named nominal layers in one copy of the source tree. */
function convertNominals(source: ConstituentMap, selected: ReadonlySet<string>): ConstituentMap {
  const cs: ConstituentMap = Object.fromEntries(
    Object.entries(source).map(([id, c]) => [id, { ...c, children: [...c.children] }]),
  );

  for (const nomId of selected) {
    const originalNom = source[nomId]!;
    const outerId = originalNom.parent;
    if (!outerId) continue;
    const originalOuter = source[outerId];
    if (!originalOuter) continue;

    const determiners = originalOuter.children.filter(
      (id) => id !== nomId && source[id]?.function === 'determiner',
    );
    const core = originalNom.children.filter((id) => source[id]?.function !== 'postmodifier');
    const postmodifiers = originalNom.children.filter(
      (id) => source[id]?.function === 'postmodifier',
    );
    const outer = cs[outerId]!;
    const nom = cs[nomId]!;
    const innerChildren = [...determiners, core[0]!];
    nom.form = 'NP';
    nom.function = 'head';
    nom.children = innerChildren;
    nom.span = [cs[innerChildren[0]!]!.span[0], cs[innerChildren.at(-1)!]!.span[1]];
    for (const id of innerChildren) cs[id]!.parent = nomId;
    for (const id of postmodifiers) cs[id]!.parent = outerId;

    const replaced = new Set([nomId, ...determiners]);
    outer.children = originalOuter.children.flatMap((id) =>
      id === nomId ? [nomId, ...postmodifiers] : replaced.has(id) ? [] : [id],
    );
  }

  return cs;
}

/** The compact recursive alternative with every eligible nominal converted. */
export function recursiveNpStructure(source: ConstituentMap): ConstituentMap | null {
  const convertible = convertibleNominals(source);
  return convertible.length > 0 ? convertNominals(source, new Set(convertible)) : null;
}

/**
 * Every non-canonical mixture of nominal and recursive noun-phrase layers.
 *
 * A sentence can contain several eligible noun phrases. Converting all of
 * them at once is only one valid tree: the learner may use the recursive shape
 * for either phrase and the nominal shape for the other. Generate the complete
 * set so grading accepts those mixed builds too.
 */
export function recursiveNpStructures(source: ConstituentMap): ConstituentMap[] {
  const convertible = convertibleNominals(source);
  const selections: string[][] = [[]];
  for (const id of convertible) {
    selections.push(...selections.map((selected) => [...selected, id]));
  }
  return selections.slice(1).map((selected) => convertNominals(source, new Set(selected)));
}

/** A reading, plus every equivalent tree the grammar derives for it. */
export function withEquivalentStructures(reading: Reading): Reading {
  const recursive = recursiveNpStructures(reading.constituents);
  return recursive.length > 0 ? { ...reading, equivalentStructures: recursive } : reading;
}
