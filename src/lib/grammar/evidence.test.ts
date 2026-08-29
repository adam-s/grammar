/**
 * The evidence strength ladder, tested as a law rather than as menu order:
 * established structure > closed class > phrase shape > suffix and fallback.
 * Each case is one of the recent suggestion bugs, distilled to the tier that
 * decides it — no panel, no hotkeys, no taxonomy positions.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LESSON_02 } from '../course/sentences/lesson-02.ts';
import { emptyBuild, nodeOver, setFunction, wrap, type BuildState } from './builder.ts';
import { formEvidence } from './evidence.ts';
import type { Form, Span } from './types.ts';

const shoes = LESSON_02.find((s) => s.id === 'c02-d')!;
const W = shoes.words; // The(0) shoes(1) on(2) my(3) feet(4) pinched(5) .(6)

const forms = (state: BuildState, span: Span): Form[] =>
  formEvidence(state, W, span).map((s) => s.form);

const labelled = (state: BuildState, span: Span, form: Form): BuildState =>
  wrap(state, W, span, form);

describe('established structure outranks lexical shape', () => {
  it('a visible N and Det make “shoes on my feet” a Nom, and silence the -s verb guess', () => {
    let b = labelled(emptyBuild(), [1, 1], 'N');
    b = labelled(b, [0, 0], 'Det');
    const offered = forms(b, [1, 4]);
    assert.equal(offered[0], 'Nom');
    assert.ok(!offered.includes('VP'), 'the spelling of “shoes” no longer speaks');
  });

  it('the same words with nothing established fall back to spelling — VP included', () => {
    assert.ok(forms(emptyBuild(), [1, 4]).includes('VP'));
  });

  it('a subject already followed by its predicate makes the whole span an S first', () => {
    let b = labelled(emptyBuild(), [0, 4], 'NP');
    b = setFunction(b, nodeOver(b, [0, 4])!, 'subject');
    b = labelled(b, [5, 5], 'VP');
    b = setFunction(b, nodeOver(b, [5, 5])!, 'predicate');
    const offered = formEvidence(b, W, [0, 5]);
    assert.equal(offered[0]!.form, 'S');
    assert.ok(
      offered[0]!.rank < Math.min(...offered.slice(1).map((s) => s.rank)),
      'structure evidence carries a rank ahead of every lexical tier',
    );
  });

  it('a visible subject plus a bare verb makes the whole span an S first', () => {
    let b = labelled(emptyBuild(), [0, 4], 'NP');
    b = setFunction(b, nodeOver(b, [0, 4])!, 'subject');
    b = labelled(b, [5, 5], 'V');
    assert.equal(forms(b, [0, 5])[0], 'S');
  });
});

describe('closed classes outrank suffix guesses', () => {
  it('“my” is the determiner first and the -y adjective only after', () => {
    const offered = formEvidence(emptyBuild(), W, [3, 3]);
    const det = offered.find((s) => s.form === 'Det')!;
    const adj = offered.find((s) => s.form === 'Adj')!;
    assert.ok(det.rank < adj.rank);
  });
});
