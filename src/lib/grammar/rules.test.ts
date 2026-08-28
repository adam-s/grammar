import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hypothesizes, licenses } from './rules.ts';
import type { Form, Func, VerbType } from './types.ts';

type Row = {
  fn: Func;
  parentForm: Form;
  verbType: VerbType | null;
  siblings: Func[];
  want: 'allowed' | 'disabled' | 'hidden';
  match?: RegExp;
};

/**
 * The table the S04 menu is built from. Each row is simultaneously a UI
 * assertion (what the learner may pick) and a content assertion (what the
 * audits accept) — they are one rule set on purpose.
 */
const TABLE: Row[] = [
  // slots that depend on the verb type
  { fn: 'directObject', parentForm: 'VP', verbType: 'Vtr', siblings: [], want: 'allowed' },
  {
    fn: 'directObject',
    parentForm: 'VP',
    verbType: 'Vint',
    siblings: [],
    want: 'disabled',
    match: /intransitive verb takes no direct object/,
  },
  {
    fn: 'directObject',
    parentForm: 'VP',
    verbType: null,
    siblings: [],
    want: 'disabled',
    match: /Classify the verb first/,
  },
  { fn: 'directObject', parentForm: 'NP', verbType: 'Vtr', siblings: [], want: 'hidden' },
  {
    fn: 'directObject',
    parentForm: 'VP',
    verbType: 'Vtr',
    siblings: ['directObject'],
    want: 'disabled',
    match: /already has a direct object/,
  },

  {
    fn: 'indirectObject',
    parentForm: 'VP',
    verbType: 'Vg',
    siblings: ['directObject'],
    want: 'allowed',
  },
  {
    fn: 'indirectObject',
    parentForm: 'VP',
    verbType: 'Vg',
    siblings: [],
    want: 'disabled',
    match: /only appears alongside a direct object/,
  },
  {
    fn: 'indirectObject',
    parentForm: 'VP',
    verbType: 'Vtr',
    siblings: ['directObject'],
    want: 'disabled',
    match: /transitive verb takes no indirect object/,
  },

  { fn: 'subjectComplement', parentForm: 'VP', verbType: 'Vlink', siblings: [], want: 'allowed' },
  { fn: 'subjectComplement', parentForm: 'VP', verbType: 'Vbe', siblings: [], want: 'allowed' },
  {
    fn: 'subjectComplement',
    parentForm: 'VP',
    verbType: 'Vtr',
    siblings: [],
    want: 'disabled',
    match: /Only "be" and linking verbs/,
  },

  // hidden, not disabled — an object complement is not a slot other verbs have
  { fn: 'objectComplement', parentForm: 'VP', verbType: 'Vtr', siblings: [], want: 'hidden' },
  {
    fn: 'objectComplement',
    parentForm: 'VP',
    verbType: 'Vc',
    siblings: ['directObject'],
    want: 'allowed',
  },
  {
    fn: 'objectComplement',
    parentForm: 'VP',
    verbType: 'Vc',
    siblings: [],
    want: 'disabled',
    match: /describes the direct object/,
  },

  // clause-level
  { fn: 'subject', parentForm: 'S', verbType: 'Vint', siblings: [], want: 'allowed' },
  { fn: 'subject', parentForm: 'VP', verbType: 'Vint', siblings: [], want: 'hidden' },
  {
    fn: 'subject',
    parentForm: 'S',
    verbType: 'Vint',
    siblings: ['subject'],
    want: 'disabled',
    match: /already has a subject/,
  },
  { fn: 'adverbial', parentForm: 'VP', verbType: 'Vint', siblings: [], want: 'allowed' },
  { fn: 'adverbial', parentForm: 'S', verbType: 'Vint', siblings: [], want: 'allowed' },
  { fn: 'adverbial', parentForm: 'NP', verbType: 'Vint', siblings: [], want: 'hidden' },

  // phrase-internal
  { fn: 'head', parentForm: 'NP', verbType: null, siblings: [], want: 'allowed' },
  {
    fn: 'head',
    parentForm: 'NP',
    verbType: null,
    siblings: ['head'],
    want: 'disabled',
    match: /exactly one head/,
  },
  { fn: 'head', parentForm: 'S', verbType: null, siblings: [], want: 'hidden' },
  { fn: 'determiner', parentForm: 'NP', verbType: null, siblings: [], want: 'allowed' },
  { fn: 'determiner', parentForm: 'VP', verbType: null, siblings: [], want: 'hidden' },
  { fn: 'complement', parentForm: 'PP', verbType: null, siblings: [], want: 'allowed' },
  { fn: 'complement', parentForm: 'NP', verbType: null, siblings: [], want: 'hidden' },
  { fn: 'postmodifier', parentForm: 'NP', verbType: null, siblings: [], want: 'allowed' },
  { fn: 'premodifier', parentForm: 'AdjP', verbType: null, siblings: [], want: 'allowed' },
];

describe('licensing rules', () => {
  for (const row of TABLE) {
    const name =
      `${row.fn} under ${row.parentForm} (verb ${row.verbType ?? 'unclassified'}` +
      `${row.siblings.length ? ', siblings: ' + row.siblings.join('+') : ''}) → ${row.want}`;
    it(name, () => {
      const v = licenses(row.fn, {
        parentForm: row.parentForm,
        verbType: row.verbType,
        siblings: row.siblings,
      });
      assert.equal(v.state, row.want);
      if (row.match) {
        assert.equal(v.state, 'disabled');
        if (v.state === 'disabled') assert.match(v.reason, row.match);
      }
    });
  }

  it('every disabled verdict carries a reason a learner can read', () => {
    for (const row of TABLE) {
      const v = licenses(row.fn, row);
      if (v.state === 'disabled') {
        assert.ok(v.reason.length > 15, `${row.fn}: reason too terse`);
        assert.match(v.reason, /\.$/, `${row.fn}: reason should be a sentence`);
      }
    }
  });
});

describe('head-form agreement', () => {
  const rows: { parentForm: Form; childForm: Form; want: 'allowed' | 'disabled' }[] = [
    { parentForm: 'NP', childForm: 'N', want: 'allowed' },
    { parentForm: 'NP', childForm: 'Pron', want: 'allowed' },
    { parentForm: 'NP', childForm: 'Adj', want: 'disabled' },
    { parentForm: 'VP', childForm: 'V', want: 'allowed' },
    { parentForm: 'VP', childForm: 'NP', want: 'disabled' },
    { parentForm: 'PP', childForm: 'P', want: 'allowed' },
    { parentForm: 'PP', childForm: 'NP', want: 'disabled' },
    { parentForm: 'AdjP', childForm: 'Adj', want: 'allowed' },
    { parentForm: 'AdvP', childForm: 'Adj', want: 'disabled' },
  ];
  for (const r of rows) {
    it(`${r.childForm} as head of ${r.parentForm} → ${r.want}`, () => {
      const v = licenses('head', {
        parentForm: r.parentForm,
        verbType: null,
        siblings: [],
        childForm: r.childForm,
      });
      assert.equal(v.state, r.want);
    });
  }

  it('stays permissive when the child form is unknown', () => {
    assert.equal(
      licenses('head', { parentForm: 'VP', verbType: null, siblings: [] }).state,
      'allowed',
    );
  });
});

describe('answer hypotheses are not gated by verb-frame knowledge', () => {
  for (const fn of [
    'directObject',
    'indirectObject',
    'subjectComplement',
    'objectComplement',
  ] as const) {
    it(`allows an NP to try ${fn} before the verb frame is complete`, () => {
      assert.equal(
        hypothesizes(fn, {
          parentForm: 'VP',
          verbType: null,
          siblings: [],
          childForm: 'NP',
        }).state,
        'allowed',
      );
    });
  }

  it('still hides a role incompatible with the selected form', () => {
    assert.equal(
      hypothesizes('directObject', {
        parentForm: 'VP',
        verbType: null,
        siblings: [],
        childForm: 'V',
      }).state,
      'hidden',
    );
  });

  it('still blocks a slot already filled by a sibling', () => {
    assert.equal(
      hypothesizes('directObject', {
        parentForm: 'VP',
        verbType: 'Vtr',
        siblings: ['directObject'],
        childForm: 'NP',
      }).state,
      'disabled',
    );
  });
});

describe('clause-role form agreement', () => {
  const rows: {
    fn: Func;
    parentForm: Form;
    childForm: Form;
    want: 'allowed' | 'hidden';
  }[] = [
    { fn: 'subject', parentForm: 'S', childForm: 'NP', want: 'allowed' },
    { fn: 'subject', parentForm: 'S', childForm: 'VP', want: 'hidden' },
    { fn: 'predicate', parentForm: 'S', childForm: 'VP', want: 'allowed' },
    { fn: 'predicate', parentForm: 'S', childForm: 'NP', want: 'hidden' },
    { fn: 'directObject', parentForm: 'VP', childForm: 'NP', want: 'allowed' },
    { fn: 'directObject', parentForm: 'VP', childForm: 'V', want: 'hidden' },
    { fn: 'adverbial', parentForm: 'VP', childForm: 'PP', want: 'allowed' },
    { fn: 'adverbial', parentForm: 'VP', childForm: 'V', want: 'hidden' },
  ];

  for (const row of rows) {
    it(`${row.childForm} as ${row.fn} under ${row.parentForm} → ${row.want}`, () => {
      assert.equal(
        licenses(row.fn, {
          parentForm: row.parentForm,
          verbType: 'Vtr',
          siblings: [],
          childForm: row.childForm,
        }).state,
        row.want,
      );
    });
  }
});

describe('a helping verb belongs to the verb, not beside it', () => {
  const under = (parentForm: Form, childForm: Form, siblings: Func[] = []) =>
    licenses('auxiliary', { parentForm, verbType: 'Vtr', siblings, childForm }).state;

  it('an Aux inside a verb phrase is a helping verb', () => {
    assert.equal(under('VP', 'Aux'), 'allowed');
  });

  it('it repeats, because English stacks them', () => {
    assert.equal(under('VP', 'Aux', ['auxiliary', 'auxiliary']), 'allowed');
  });

  it('only an Aux may be one', () => {
    assert.equal(under('VP', 'V'), 'hidden');
    assert.equal(under('VP', 'NP'), 'hidden');
  });

  it('nothing outside a verb phrase has one', () => {
    for (const parent of ['S', 'Cl', 'NP', 'PP', 'AdjP', 'AdvP'] as Form[]) {
      assert.equal(under(parent, 'Aux'), 'hidden', `${parent} should have no helping verb`);
    }
  });

  it('an auxiliary cannot head the phrase it helps', () => {
    // *was repaired* is one verb, and the phrase is about *repaired*. Letting
    // `was` head it would leave the main verb unclassifiable — the clause's
    // verb type is read off the head.
    const v = licenses('head', {
      parentForm: 'VP',
      verbType: null,
      siblings: [],
      childForm: 'Aux',
    });
    assert.equal(v.state, 'disabled');
    assert.match(v.state === 'disabled' ? v.reason : '', /head of a verb phrase is a verb/);
  });
});

describe('the passive moves one object into the subject', () => {
  const slot = (fn: Func, verbType: VerbType, voice: 'active' | 'passive', siblings: Func[] = []) =>
    licenses(fn, { parentForm: 'VP', verbType, voice, siblings, childForm: 'NP' }).state;

  it('a transitive verb loses its only object', () => {
    assert.equal(slot('directObject', 'Vtr', 'active'), 'allowed');
    assert.equal(slot('directObject', 'Vtr', 'passive'), 'disabled');
  });

  it('a two-object verb keeps one, because either may be the one promoted', () => {
    assert.equal(slot('directObject', 'Vg', 'passive'), 'allowed');
    assert.equal(slot('indirectObject', 'Vg', 'passive', ['directObject']), 'disabled');
  });

  it('an object-complement verb keeps its complement and loses the object', () => {
    assert.equal(
      licenses('objectComplement', {
        parentForm: 'VP',
        verbType: 'Vc',
        voice: 'passive',
        siblings: [],
        childForm: 'AdjP',
      }).state,
      'allowed',
      'the complement no longer waits for a direct object that has left the predicate',
    );
    assert.equal(slot('directObject', 'Vc', 'passive'), 'disabled');
  });

  it('the reason names the promotion rather than the verb type', () => {
    const v = licenses('directObject', {
      parentForm: 'VP',
      verbType: 'Vtr',
      voice: 'passive',
      siblings: [],
      childForm: 'NP',
    });
    assert.match(v.state === 'disabled' ? v.reason : '', /already the subject/);
  });

  it('omitting voice means active, so nothing already written changes meaning', () => {
    assert.equal(
      licenses('directObject', {
        parentForm: 'VP',
        verbType: 'Vtr',
        siblings: [],
        childForm: 'NP',
      }).state,
      'allowed',
    );
  });

  it('a learner may still TRY the direct object and be told no by the grader', () => {
    // Menu affordance, not licensing: whether this passive has an object is
    // the question being asked, so the row stays actionable until graded.
    assert.equal(
      hypothesizes('directObject', {
        parentForm: 'VP',
        verbType: 'Vtr',
        voice: 'passive',
        siblings: [],
        childForm: 'NP',
      }).state,
      'allowed',
    );
  });
});

describe('the joining word is not one of the things joined', () => {
  const at = (parentForm: Form, childForm: Form, siblings: Func[] = []) =>
    licenses('coordinator', { parentForm, verbType: null, siblings, childForm }).state;

  it('only a conjunction may join', () => {
    assert.equal(at('S', 'Conj'), 'allowed');
    assert.equal(at('NP', 'Conj'), 'allowed');
    assert.equal(at('S', 'Cl'), 'hidden');
    assert.equal(at('NP', 'N'), 'hidden');
  });

  it('it repeats: *A and B and C* has two', () => {
    assert.equal(at('NP', 'Conj', ['coordinator', 'coordinate', 'coordinate']), 'allowed');
  });
});

describe('the two kinds of particle, and material at the edge', () => {
  const lic = (fn: Func, parentForm: Form, childForm: Form, siblings: Func[] = []) =>
    licenses(fn, { parentForm, verbType: 'Vtr', siblings, childForm }).state;

  it('infinitival "to" introduces a clause the way a subordinator does', () => {
    assert.equal(lic('marker', 'Cl', 'Part'), 'allowed');
    assert.equal(lic('marker', 'Cl', 'Subord'), 'allowed');
    assert.equal(lic('marker', 'VP', 'Part'), 'hidden', 'a verb phrase has no marker');
  });

  it('a verbal particle belongs to its verb and appears once', () => {
    assert.equal(lic('particle', 'VP', 'Part'), 'allowed');
    assert.equal(lic('particle', 'VP', 'Part', ['particle']), 'disabled');
    assert.equal(lic('particle', 'NP', 'Part'), 'hidden');
    assert.equal(
      lic('particle', 'VP', 'P'),
      'hidden',
      'a preposition takes an object; this does not',
    );
  });

  it('a supplement attaches at the edge of a clause or a noun phrase', () => {
    assert.equal(lic('supplement', 'S', 'AdvP'), 'allowed');
    assert.equal(lic('supplement', 'Cl', 'Interj'), 'allowed');
    assert.equal(lic('supplement', 'NP', 'Cl'), 'allowed');
    assert.equal(lic('supplement', 'VP', 'AdvP'), 'hidden');
    assert.equal(lic('supplement', 'PP', 'AdvP'), 'hidden');
  });

  it('a supplement may repeat: a sentence can carry more than one aside', () => {
    assert.equal(lic('supplement', 'S', 'AdvP', ['supplement']), 'allowed');
  });
});
