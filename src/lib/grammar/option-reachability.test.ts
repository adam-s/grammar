import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { auditReading } from './audits.ts';
import { hypothesisFor, setFunction, setVerbType, type BuildState } from './builder.ts';
import { FIXTURES } from './fixtures.ts';
import { isPickable, optionsFor } from './options.ts';
import { optionFor, replay } from './replay.ts';
import type { SentenceEntry } from './types.ts';
import { CLAUSE_FUNCTIONS, PHRASE_INTERNAL_FUNCTIONS } from './types.ts';

const FUNCTIONS = [...CLAUSE_FUNCTIONS, ...PHRASE_INTERNAL_FUNCTIONS];

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

describe('every authored grammar path is reachable through the option menu', () => {
  for (const sentence of FIXTURES) {
    for (const reading of sentence.readings) {
      it(`${sentence.id}/${reading.id} can be rebuilt recursively`, () => {
        const state = replay(sentence, reading, {
          onNode: (built, path) => assertMenuMatchesBuilder(built, sentence, path),
        });
        const report = auditReading(
          { ...reading, constituents: state.constituents },
          sentence.words,
        );
        assert.equal(report.ok, true, report.all.join(' | '));
      });
    }
  }
});
