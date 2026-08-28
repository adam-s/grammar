/**
 * Hand-authored fixtures (S01). The contract's worked examples.
 *
 * Every audit test, the layout test, the reachability suite and the lesson hero
 * run off these, and they exist before any corpus does — so the engine can be
 * finished and proved while the pipeline is still being built.
 *
 * One file per family, because the list grew from twelve to thirty-four in a
 * night and a single file stopped being findable. `../fixtures.ts` re-exports
 * everything here, so nothing outside this directory had to change.
 *
 * **Adding one:** put it in the family it belongs to, add it to `FIXTURES`
 * below, and run `npm test`. The audit suite runs over every reading and the
 * reachability suite rebuilds every one through the palette, so a fixture that
 * is well-formed on paper but unbuildable fails loudly. Then
 * `npm run snapshot -- --action=build-sweep --sentence=<id>` proves it in the
 * browser.
 */
import type { SentenceEntry } from '../types.ts';

export * from './verb-types.ts';
export * from './ambiguity.ts';
export * from './clauses.ts';
export * from './coordination.ts';
export * from './auxiliaries.ts';
export * from './non-finite.ts';
export * from './noun-phrases.ts';
export * from './movement.ts';
export * from './edges.ts';
export * from './ellipsis.ts';

import { vint, vtr, vbe, vlink, vg, vc, irregular, objectComplementNoun } from './verb-types.ts';
import { ambiguous } from './ambiguity.ts';
import {
  gardenPath,
  objectClause,
  deepNesting,
  adverbialClause,
  subjectRelative,
  subjectClause,
} from './clauses.ts';
import { coordination, coordinatedSubject } from './coordination.ts';
import {
  auxiliaryChain,
  passive,
  passiveTwoObject,
  passiveObjectComplement,
} from './auxiliaries.ts';
import { infinitive, particle, particleShift, hollowClause, twoMarkers } from './non-finite.ts';
import {
  nominal,
  stacked,
  determinativeAndName,
  fused,
  fusedRelative,
  appositive,
  numeral,
  prepInPrep,
  nounPremodifier,
} from './noun-phrases.ts';
import {
  acrossTheBoard,
  frontedPhrase,
  question,
  extraposition,
  tailClause,
  cleft,
  comparative,
} from './movement.ts';
import { punctuation, supplement, existential } from './edges.ts';
import { vpEllipsis, gapping, sluicing, stripping } from './ellipsis.ts';

/** Every good fixture. All must pass every audit. */
export const FIXTURES: readonly SentenceEntry[] = [
  vint,
  vtr,
  vbe,
  vlink,
  vg,
  vc,
  irregular,
  objectComplementNoun,
  nounPremodifier,
  ambiguous,
  gardenPath,
  objectClause,
  deepNesting,
  adverbialClause,
  subjectRelative,
  subjectClause,
  coordination,
  coordinatedSubject,
  auxiliaryChain,
  passive,
  passiveTwoObject,
  passiveObjectComplement,
  infinitive,
  particle,
  particleShift,
  hollowClause,
  twoMarkers,
  nominal,
  stacked,
  determinativeAndName,
  fused,
  fusedRelative,
  appositive,
  numeral,
  prepInPrep,
  frontedPhrase,
  question,
  acrossTheBoard,
  extraposition,
  tailClause,
  cleft,
  comparative,
  punctuation,
  supplement,
  existential,
  vpEllipsis,
  gapping,
  sluicing,
  stripping,
];

export const BY_ID: Record<string, SentenceEntry> = Object.fromEntries(
  FIXTURES.map((s) => [s.id, s]),
);
