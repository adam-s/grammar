import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { auditReading } from './audits.ts';
import {
  emptyBuild,
  hypothesisFor,
  licenseFor,
  nodeOver,
  setClauseKind,
  setFiniteness,
  setFunction,
  setPartKind,
  setVerbType,
  setVoice,
  wrap,
  type BuildState,
} from './builder.ts';
import { FIXTURES } from './fixtures.ts';
import { isPickable, optionsFor } from './options.ts';
import type { Func, Reading, SentenceEntry } from './types.ts';
import { CLAUSE_FUNCTIONS, PHRASE_INTERNAL_FUNCTIONS } from './types.ts';

const FUNCTIONS = [...CLAUSE_FUNCTIONS, ...PHRASE_INTERNAL_FUNCTIONS];

function optionFor(state: BuildState, words: SentenceEntry['words'], id: string, key: string) {
  return optionsFor(state, words, { kind: 'node', id })
    .groups.flatMap((group) => group.options)
    .find((option) => option.key === key);
}

/** The palette renders hypothesis compatibility; check that invariant at every state. */
function assertMenuMatchesBuilder(state: BuildState, sentence: SentenceEntry, path: string) {
  for (const id of Object.keys(state.constituents)) {
    for (const fn of FUNCTIONS) {
      const verdict = hypothesisFor(state, id, fn);
      const option = optionFor(state, sentence.words, id, `func:${fn}`);
      const obligatory =
        fn === 'adverbial'
          ? optionFor(state, sentence.words, id, 'func:obligatoryAdverbial')
          : undefined;
      const where = `${path}: ${state.constituents[id]!.form}.${fn}`;
      if (verdict.state === 'hidden') {
        assert.equal(option, undefined, `${where} should be hidden`);
        assert.equal(obligatory, undefined, `${where} obligatory variant should be hidden`);
      } else if (verdict.state === 'disabled') {
        assert.equal(option?.state, 'blocked', `${where} should be blocked`);
        if (obligatory) {
          assert.equal(
            obligatory.state,
            'blocked',
            `${where} obligatory variant should be blocked`,
          );
        }
        assert.equal(
          setFunction(state, id, fn),
          state,
          `${where} must not bypass its blocked menu state`,
        );
      } else {
        assert.ok(option && isPickable(option), `${where} should be pickable`);
        const applied = setFunction(state, id, fn);
        assert.equal(applied.constituents[id]!.function, fn, `${where} should apply`);
        if (fn === 'adverbial') {
          assert.ok(
            obligatory && isPickable(obligatory),
            `${where} obligatory variant should be pickable`,
          );
          const required = setFunction(state, id, fn, true);
          assert.equal(
            required.constituents[id]!.function,
            fn,
            `${where} required form should apply`,
          );
          assert.equal(
            required.constituents[id]!.obligatory,
            true,
            `${where} should retain the obligatory distinction`,
          );
        }
      }
    }

    // Every verb-type row is an actionable classification, including changing
    // an answer that was already chosen.
    const panel = optionsFor(state, sentence.words, { kind: 'node', id });
    for (const option of panel.groups.flatMap((group) => group.options)) {
      if (!option.verbType || !isPickable(option)) continue;
      assert.equal(
        setVerbType(state, id, option.verbType).constituents[id]!.verbType,
        option.verbType,
        `${path}: ${option.key} should apply`,
      );
    }
  }
}

/**
 * Rebuild one authored reading in the same bottom-up order available to a learner.
 * Children are visited recursively; once a parent exists, its canonical child
 * functions are applied in whatever dependency order the shared rules permit.
 */
function replay(sentence: SentenceEntry, reading: Reading): BuildState {
  let state = emptyBuild();
  const learnerId = new Map<string, string>();

  const visit = (sourceId: string): string => {
    const source = reading.constituents[sourceId]!;
    for (const child of source.children) visit(child);

    // Clause roles may be assigned on the frontier before VP/S is drawn. Set
    // every authored role that is currently legal, respecting dependencies
    // such as direct object before indirect/object complement.
    const prospective = source.children.filter((child) => {
      const fn = reading.constituents[child]!.function;
      const id = learnerId.get(child)!;
      return (
        fn !== null &&
        CLAUSE_FUNCTIONS.includes(fn as (typeof CLAUSE_FUNCTIONS)[number]) &&
        state.constituents[id]!.function !== fn
      );
    });
    while (prospective.length > 0) {
      const index = prospective.findIndex((child) => {
        const fn = reading.constituents[child]!.function!;
        return licenseFor(state, learnerId.get(child)!, fn).state === 'allowed';
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
      const key =
        canonical.function === 'adverbial' && canonical.obligatory
          ? 'func:obligatoryAdverbial'
          : `func:${canonical.function}`;
      const option = optionFor(state, sentence.words, id, key);
      assert.ok(
        option && isPickable(option),
        `${sentence.id}/${reading.id}: cannot choose prospective ${canonical.function}`,
      );
      state = setFunction(state, id, canonical.function, canonical.obligatory === true);
    }

    const existing = nodeOver(state, source.span);
    const selection = existing
      ? ({ kind: 'node', id: existing } as const)
      : ({ kind: 'span', span: source.span } as const);
    const form = optionsFor(state, sentence.words, selection)
      .groups.flatMap((group) => group.options)
      .find((option) => option.key === `form:${source.form}`);
    assert.ok(
      form && isPickable(form),
      `${sentence.id}/${reading.id}: cannot choose ${source.form}`,
    );

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
    assert.ok(created, `${sentence.id}/${reading.id}: ${source.form} was not created`);
    learnerId.set(sourceId, created);

    if (source.form === 'V') {
      const want = source.verbType!;
      const verbType = optionFor(state, sentence.words, created, `vt:${want}`);
      assert.ok(
        verbType && isPickable(verbType),
        `${sentence.id}/${reading.id}: cannot choose ${want}`,
      );
      state = setVerbType(state, created, want);

      // Voice is a second answer on the same node. Only ask for it when the
      // authored reading says passive — `active` is the standing answer, so
      // clicking it would be a step a learner never has to take.
      if (source.voice === 'passive') {
        const voice = optionFor(state, sentence.words, created, 'voice:passive');
        assert.ok(
          voice && isPickable(voice),
          `${sentence.id}/${reading.id}: cannot choose the passive`,
        );
        state = setVoice(state, created, 'passive');
      }
    }

    // Which kind of `Part` this is, and what verb form a clause has. Both are
    // answers on the node itself rather than roles under a parent, so they are
    // taken here, straight after the form that made the question askable.
    if (source.form === 'Part') {
      const want = source.partKind!;
      const option = optionFor(state, sentence.words, created, `part:${want}`);
      assert.ok(
        option && isPickable(option),
        `${sentence.id}/${reading.id}: cannot choose ${want} for a particle`,
      );
      state = setPartKind(state, created, want);
    }
    if (source.form === 'Cl' && source.clauseKind) {
      const want = source.clauseKind;
      const option = optionFor(state, sentence.words, created, `kind:${want}`);
      assert.ok(
        option && isPickable(option),
        `${sentence.id}/${reading.id}: cannot choose a ${want} clause`,
      );
      state = setClauseKind(state, created, want);
    }
    if ((source.form === 'S' || source.form === 'Cl') && source.finiteness) {
      const option = optionFor(state, sentence.words, created, `fin:${source.finiteness}`);
      assert.ok(
        option && isPickable(option),
        `${sentence.id}/${reading.id}: cannot choose ${source.finiteness}`,
      );
      state = setFiniteness(state, created, source.finiteness);
    }

    // Some functions depend on siblings (indirect object follows direct object,
    // for example), so settle children in passes instead of assuming word order.
    const pending = source.children.filter((child) => {
      const fn = reading.constituents[child]!.function;
      const id = learnerId.get(child)!;
      return fn !== null && state.constituents[id]!.function !== fn;
    });
    while (pending.length > 0) {
      const index = pending.findIndex((child) => {
        const fn = reading.constituents[child]!.function!;
        return licenseFor(state, learnerId.get(child)!, fn).state === 'allowed';
      });
      assert.notEqual(
        index,
        -1,
        `${sentence.id}/${reading.id}: no legal order for ${pending
          .map((child) => reading.constituents[child]!.function)
          .join(', ')}`,
      );
      const child = pending.splice(index, 1)[0]!;
      const fn = reading.constituents[child]!.function as Func;
      const id = learnerId.get(child)!;
      const key =
        fn === 'adverbial' && reading.constituents[child]!.obligatory
          ? 'func:obligatoryAdverbial'
          : `func:${fn}`;
      const option = optionFor(state, sentence.words, id, key);
      assert.ok(option && isPickable(option), `${sentence.id}/${reading.id}: cannot choose ${fn}`);
      state = setFunction(state, id, fn, reading.constituents[child]!.obligatory === true);
      assert.equal(state.constituents[id]!.function, fn);
    }

    assertMenuMatchesBuilder(state, sentence, `${sentence.id}/${reading.id}/${source.form}`);
    return created;
  };

  const root = Object.keys(reading.constituents).find(
    (id) => reading.constituents[id]!.parent === null,
  )!;
  visit(root);
  return state;
}

describe('every authored grammar path is reachable through the option menu', () => {
  for (const sentence of FIXTURES) {
    for (const reading of sentence.readings) {
      it(`${sentence.id}/${reading.id} can be rebuilt recursively`, () => {
        const state = replay(sentence, reading);
        const report = auditReading(
          { ...reading, constituents: state.constituents },
          sentence.words,
        );
        assert.equal(report.ok, true, report.all.join(' | '));
      });
    }
  }
});
