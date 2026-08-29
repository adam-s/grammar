import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { withEquivalentStructures } from './equivalence.ts';
import type { ConstituentMap, Reading } from './types.ts';

const leaf = (form: 'Det' | 'N', fn: 'determiner' | 'head', parent: string, word: number) => ({
  form,
  function: fn,
  parent,
  children: [],
  span: [word, word] as [number, number],
  word,
});

/** Two separate postmodified noun phrases, so either one may use the recursive analysis. */
function readingWithTwoConvertibleNps(): Reading {
  const constituents: ConstituentMap = {
    root: {
      form: 'S',
      function: null,
      parent: null,
      children: ['np1', 'np2'],
      span: [0, 7],
    },
    np1: {
      form: 'NP',
      function: 'subject',
      parent: 'root',
      children: ['d1', 'nom1'],
      span: [0, 3],
    },
    d1: leaf('Det', 'determiner', 'np1', 0),
    nom1: {
      form: 'Nom',
      function: 'head',
      parent: 'np1',
      children: ['n1', 'pp1'],
      span: [1, 3],
    },
    n1: leaf('N', 'head', 'nom1', 1),
    pp1: {
      form: 'PP',
      function: 'postmodifier',
      parent: 'nom1',
      children: [],
      span: [2, 3],
    },
    np2: {
      form: 'NP',
      function: 'directObject',
      parent: 'root',
      children: ['d2', 'nom2'],
      span: [4, 7],
    },
    d2: leaf('Det', 'determiner', 'np2', 4),
    nom2: {
      form: 'Nom',
      function: 'head',
      parent: 'np2',
      children: ['n2', 'pp2'],
      span: [5, 7],
    },
    n2: leaf('N', 'head', 'nom2', 5),
    pp2: {
      form: 'PP',
      function: 'postmodifier',
      parent: 'nom2',
      children: [],
      span: [6, 7],
    },
  };
  return { id: 'two-nps', status: 'canonical', gloss: 'test', constituents };
}

describe('equivalent noun-phrase structures', () => {
  it('includes every mixture when more than one noun phrase can be recursive', () => {
    const reading = withEquivalentStructures(readingWithTwoConvertibleNps());
    const combinations = (reading.equivalentStructures ?? []).map((cs) =>
      [cs.nom1!.form, cs.nom2!.form].join('/'),
    );

    assert.deepEqual(combinations.sort(), ['NP/NP', 'NP/Nom', 'Nom/NP']);
  });
});
