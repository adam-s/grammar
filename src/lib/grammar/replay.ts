/**
 * Rebuild an authored reading the way a learner would, through the real palette.
 *
 * This is the only proof that a parse is not merely well-formed but *reachable*
 * — that every label it carries can actually be chosen, in some order, from the
 * menus the app shows. Representable and reachable are different properties,
 * and only this tests the second.
 *
 * It lived inside `option-reachability.test.ts` until the course needed it too:
 * a lesson's sentence has to be reachable under that lesson's scope, which is
 * the same walk with a narrower menu. One walker, two callers — a second copy
 * would have drifted the first time the palette grew a group.
 *
 * Failures throw rather than assert, so nothing here depends on a test runner.
 */
import {
  addGap,
  canStackOver,
  emptyBuild,
  licenseFor,
  nodeOver,
  setAnchor,
  setAuxKind,
  setClauseKind,
  setFiniteness,
  setFunction,
  setFusion,
  setPartKind,
  setVerbType,
  setVoice,
  wrap,
  type BuildState,
} from './builder.ts';
import { isPickable, optionsFor, type ChapterScope } from './options.ts';
import type { Constituent, Func, Reading, SentenceEntry } from './types.ts';
import { CLAUSE_FUNCTIONS } from './types.ts';

export type ReplayOptions = {
  /** What the learner has been taught. Empty means the whole palette. */
  scope?: ChapterScope;
  /** Called once per finished node, for callers that check menu invariants. */
  onNode?: (state: BuildState, path: string) => void;
};

function must(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(message);
}

/**
 * The palette row that produces this constituent's function.
 *
 * Three rows can set a function: the plain one, the obligatory adverbial, and
 * fusion — which sets two jobs at once because half of it is not a state worth
 * being in.
 */
export function functionKey(c: Constituent): string {
  if (c.fusedWith) return `func:head+${c.fusedWith}`;
  if (c.function === 'adverbial' && c.obligatory) return 'func:obligatoryAdverbial';
  return `func:${c.function}`;
}

export function optionFor(
  state: BuildState,
  words: SentenceEntry['words'],
  id: string,
  key: string,
  scope: ChapterScope = {},
) {
  return optionsFor(state, words, { kind: 'node', id }, scope)
    .groups.flatMap((group) => group.options)
    .find((option) => option.key === key);
}
/**
 * Rebuild one authored reading in the same bottom-up order available to a learner.
 * Children are visited recursively; once a parent exists, its canonical child
 * functions are applied in whatever dependency order the shared rules permit.
 */
export function replay(
  sentence: SentenceEntry,
  reading: Reading,
  { scope = {}, onNode }: ReplayOptions = {},
): BuildState {
  let state = emptyBuild();
  const learnerId = new Map<string, string>();

  const visit = (sourceId: string): string => {
    const source = reading.constituents[sourceId]!;
    // A gap has no words, so it cannot be built before the node that holds it
    // — there is nothing to select. It is added from the parent, below.
    for (const child of source.children) {
      if (!reading.constituents[child]!.gap) visit(child);
    }

    // Clause roles may be assigned on the frontier before VP/S is drawn. Set
    // every authored role that is currently legal, respecting dependencies
    // such as direct object before indirect/object complement.
    const prospective = source.children.filter((child) => {
      const fn = reading.constituents[child]!.function;
      const id = learnerId.get(child);
      if (!id) return false; // a gap, which does not exist until its parent does
      return (
        fn !== null &&
        CLAUSE_FUNCTIONS.includes(fn as (typeof CLAUSE_FUNCTIONS)[number]) &&
        state.constituents[id]!.function !== fn
      );
    });
    while (prospective.length > 0) {
      const index = prospective.findIndex((child) => {
        const fn = reading.constituents[child]!.function!;
        return (
          licenseFor(state, learnerId.get(child)!, fn, reading.constituents[child]!.fusedWith)
            .state === 'allowed'
        );
      });
      // Nothing legal yet is not a failure. Once a sentence holds more than one
      // verb, a loose node cannot say which clause it will join, so "object of
      // WHICH verb" has no answer until the clause is drawn. Those roles are
      // picked up by the pass below, after the parent exists — the deferral is
      // the point, and `settle` still proves every role is reachable.
      if (index === -1) break;
      const child = prospective.splice(index, 1)[0]!;
      const canonical = reading.constituents[child]!;
      const id = learnerId.get(child)!;
      const key = functionKey(canonical);
      const option = optionFor(state, sentence.words, id, key, scope);
      must(
        option && isPickable(option),
        `${sentence.id}/${reading.id}: cannot choose prospective ${canonical.function}`,
      );
      state = canonical.fusedWith
        ? setFusion(state, id, canonical.fusedWith)
        : setFunction(state, id, canonical.function, canonical.obligatory === true);
    }

    const existing = nodeOver(state, source.span);
    const selection = existing
      ? ({ kind: 'node', id: existing } as const)
      : ({ kind: 'span', span: source.span } as const);
    // Renaming and stacking are different rows now, so ask for the one this
    // step actually is: a loose phrase already on these words is stacked over.
    const stacking = existing ? canStackOver(state.constituents[existing]) : false;
    const key = `${stacking ? 'stack' : 'form'}:${source.form}`;
    const form = optionsFor(state, sentence.words, selection, scope)
      .groups.flatMap((group) => group.options)
      .find((option) => option.key === key);
    must(form && isPickable(form), `${sentence.id}/${reading.id}: cannot choose ${key}`);

    state = wrap(state, sentence.words, source.span, source.form);
    const created = Object.keys(state.constituents).find((id) => {
      const node = state.constituents[id]!;
      return (
        node.parent === null &&
        node.form === source.form &&
        node.span[0] === source.span[0] &&
        node.span[1] === source.span[1]
      );
    });
    must(created, `${sentence.id}/${reading.id}: ${source.form} was not created`);
    learnerId.set(sourceId, created);

    if (source.form === 'V') {
      const want = source.verbType!;
      const verbType = optionFor(state, sentence.words, created, `vt:${want}`, scope);
      must(verbType && isPickable(verbType), `${sentence.id}/${reading.id}: cannot choose ${want}`);
      state = setVerbType(state, created, want);

      // Voice is a second answer on the same node. Only ask for it when the
      // authored reading says passive — `active` is the standing answer, so
      // clicking it would be a step a learner never has to take.
      if (source.voice === 'passive') {
        const voice = optionFor(state, sentence.words, created, 'voice:passive');
        must(voice && isPickable(voice), `${sentence.id}/${reading.id}: cannot choose the passive`);
        state = setVoice(state, created, 'passive');
      }
    }

    // Which kind of `Part` this is, and what verb form a clause has. Both are
    // answers on the node itself rather than roles under a parent, so they are
    // taken here, straight after the form that made the question askable.
    if (source.form === 'Part') {
      const want = source.partKind!;
      const option = optionFor(state, sentence.words, created, `part:${want}`, scope);
      must(
        option && isPickable(option),
        `${sentence.id}/${reading.id}: cannot choose ${want} for a particle`,
      );
      state = setPartKind(state, created, want);
    }
    if (source.form === 'Aux') {
      const want = source.auxKind!;
      const option = optionFor(state, sentence.words, created, `aux:${want}`, scope);
      must(
        option && isPickable(option),
        `${sentence.id}/${reading.id}: cannot choose ${want} for a helping verb`,
      );
      state = setAuxKind(state, created, want);
    }
    if (source.form === 'Cl' && source.clauseKind) {
      const want = source.clauseKind;
      const option = optionFor(state, sentence.words, created, `kind:${want}`, scope);
      must(
        option && isPickable(option),
        `${sentence.id}/${reading.id}: cannot choose a ${want} clause`,
      );
      state = setClauseKind(state, created, want);
    }
    if ((source.form === 'S' || source.form === 'Cl') && source.finiteness) {
      const option = optionFor(state, sentence.words, created, `fin:${source.finiteness}`, scope);
      must(
        option && isPickable(option),
        `${sentence.id}/${reading.id}: cannot choose ${source.finiteness}`,
      );
      state = setFiniteness(state, created, source.finiteness);
    }

    // Some functions depend on siblings (indirect object follows direct object,
    // for example), so settle children in passes instead of assuming word order.
    const pending = source.children.filter((child) => {
      if (reading.constituents[child]!.gap) return false; // built with its function already on it
      const fn = reading.constituents[child]!.function;
      const id = learnerId.get(child)!;
      return fn !== null && state.constituents[id]!.function !== fn;
    });
    while (pending.length > 0) {
      const index = pending.findIndex((child) => {
        const fn = reading.constituents[child]!.function!;
        return (
          licenseFor(state, learnerId.get(child)!, fn, reading.constituents[child]!.fusedWith)
            .state === 'allowed'
        );
      });
      must(
        index !== -1,
        `${sentence.id}/${reading.id}: no legal order for ${pending
          .map((child) => reading.constituents[child]!.function)
          .join(', ')}`,
      );
      const child = pending.splice(index, 1)[0]!;
      const fn = reading.constituents[child]!.function as Func;
      const id = learnerId.get(child)!;
      const key = functionKey(reading.constituents[child]!);
      const option = optionFor(state, sentence.words, id, key, scope);
      must(option && isPickable(option), `${sentence.id}/${reading.id}: cannot choose ${key}`);
      state = reading.constituents[child]!.fusedWith
        ? setFusion(state, id, reading.constituents[child]!.fusedWith!)
        : setFunction(state, id, fn, reading.constituents[child]!.obligatory === true);
      must(
        state.constituents[id]!.function === fn,
        `${sentence.id}/${reading.id}: ${fn} did not apply`,
      );
    }

    // The empty slots, after the functions: where a gap sits among its
    // siblings follows from what those siblings are doing.
    for (const child of source.children) {
      const c = reading.constituents[child]!;
      if (!c.gap) continue;
      const key = `gap:${c.function}:${c.form}`;
      const option = optionFor(state, sentence.words, created, key, scope);
      must(option && isPickable(option), `${sentence.id}/${reading.id}: cannot pick ${key}`);
      state = addGap(state, created, c.function!, c.form);
      const made = state.constituents[created]!.children.find(
        (k) => state.constituents[k]!.gap && state.constituents[k]!.function === c.function,
      );
      must(made, `${sentence.id}/${reading.id}: the ${c.function} gap was not created`);
      learnerId.set(child, made);
    }

    onNode?.(state, `${sentence.id}/${reading.id}/${source.form}`);
    return created;
  };

  const root = Object.keys(reading.constituents).find(
    (id) => reading.constituents[id]!.parent === null,
  )!;
  visit(root);

  // What each moved or unsaid piece points at, after the whole tree exists: the
  // things it could point at have to be there before one of them can be named.
  for (const [canonicalId, c] of Object.entries(reading.constituents)) {
    const links =
      c.function === 'postnucleus' ||
      (c.gap === true && (c.function === 'head' || c.function === 'predicate'));
    if (!links || c.index === undefined) continue;
    const anchorCanonical = Object.keys(reading.constituents).find(
      (id) => id !== canonicalId && reading.constituents[id]!.index === c.index,
    )!;
    const anchorSpan = reading.constituents[anchorCanonical]!.span;
    const tailId = learnerId.get(canonicalId)!;
    const anchorForm = reading.constituents[anchorCanonical]!.form;
    const key = `anchor:${anchorForm}:${anchorSpan[0]}-${anchorSpan[1]}`;
    const option = optionFor(state, sentence.words, tailId, key, scope);
    must(
      option && isPickable(option),
      `${sentence.id}/${reading.id}: cannot point ${canonicalId} at ${key}`,
    );
    state = setAnchor(state, tailId, learnerId.get(anchorCanonical)!);
  }
  return state;
}
