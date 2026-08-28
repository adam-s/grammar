import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { emptyBuild, setFunction, setOnlyVerbType, wrap } from './builder.ts';
import { BY_ID, ambiguous, vbe, vtr } from './fixtures.ts';
import { gradeBuild, gradeForm, gradeFunction, hintFor, type Outcome } from './grader.ts';
import { replaySentence } from '../course/sentence-renderer.ts';
import type { Constituent, Form, Func, Span } from './types.ts';

type Row = {
  what: string;
  span: Span;
  form: Form;
  fn?: Func;
  want: Outcome['kind'];
  match?: RegExp;
};

/** "She repaired the engine." — one reading, so no alternates. */
const TABLE: Row[] = [
  { what: 'the pronoun subject', span: [0, 0], form: 'Pron', want: 'correct' },
  { what: 'the verb', span: [1, 1], form: 'V', want: 'correct' },
  { what: 'the object NP', span: [2, 3], form: 'NP', want: 'correct' },
  { what: 'the whole sentence', span: [0, 3], form: 'S', want: 'correct' },
  {
    what: 'calling the verb a noun',
    span: [1, 1],
    form: 'N',
    want: 'wrong',
    match: /is not a noun — it is a verb/,
  },
  {
    what: 'a span that is not a constituent',
    span: [1, 2],
    form: 'NP',
    want: 'wrong',
    match: /is not a group on its own/,
  },
  {
    what: 'the object NP as the subject',
    span: [2, 3],
    form: 'NP',
    fn: 'subject',
    want: 'wrong',
    match: /is not the subject here — it is the direct object/,
  },
  {
    what: 'the object NP as the direct object',
    span: [2, 3],
    form: 'NP',
    fn: 'directObject',
    want: 'correct',
  },
];

describe('grading against a single-reading sentence', () => {
  for (const row of TABLE) {
    it(row.what, () => {
      const out = row.fn
        ? gradeFunction(vtr, row.span, row.form, row.fn)
        : gradeForm(vtr, row.span, row.form);
      assert.equal(out.kind, row.want, JSON.stringify(out));
      if (row.match && out.kind === 'wrong') assert.match(out.reason, row.match);
    });
  }

  it('a wrong word class comes with the test that would have caught it', () => {
    const out = gradeForm(vtr, [1, 1], 'N');
    assert.equal(out.kind, 'wrong');
    if (out.kind === 'wrong') assert.match(out.test!, /change for tense/);
  });

  it('every message is English a learner can read', () => {
    for (const [span, form] of [
      [[1, 1], 'N'],
      [[0, 0], 'Adj'],
      [[2, 3], 'PP'],
    ] as const) {
      const out = gradeForm(vtr, span as Span, form as Form);
      if (out.kind !== 'wrong') continue;
      assert.doesNotMatch(out.reason, /\ba [AEIOU]/, `"${out.reason}" has a/an trouble`);
      assert.doesNotMatch(
        out.reason,
        /is not a (NP|VP|PP|AdjP|N|V|P)\b/,
        `"${out.reason}" leaks a tag`,
      );
      assert.match(out.reason, /\.$/);
    }
  });
});

describe('the obligatory-adverbial choice', () => {
  it('distinguishes a required adverbial from an optional one', () => {
    assert.equal(gradeFunction(vbe, [3, 5], 'PP', 'adverbial', true).kind, 'correct');
    const ordinary = gradeFunction(vbe, [3, 5], 'PP', 'adverbial', false);
    assert.equal(ordinary.kind, 'wrong');
    if (ordinary.kind === 'wrong') assert.match(ordinary.reason, /obligatory adverbial/);
  });
});

describe('ambiguity is not an error', () => {
  const inNP: Span = [2, 6]; // "the man with the telescope" — only in reading 2

  it('the canonical attachment is correct', () => {
    const out = gradeFunction(ambiguous, [4, 6], 'PP', 'adverbial');
    assert.equal(out.kind, 'correct');
  });

  it('the other attachment is an ALTERNATE, not a failure', () => {
    const out = gradeFunction(ambiguous, [4, 6], 'PP', 'postmodifier');
    assert.equal(out.kind, 'alternate');
    if (out.kind === 'alternate') {
      assert.match(out.gloss, /man who had the telescope/);
      assert.match(out.canonicalGloss, /used the telescope to see him/);
      assert.notEqual(out.gloss, out.canonicalGloss);
    }
  });

  it('a span that exists only in the alternate reading is accepted as one', () => {
    const out = gradeForm(ambiguous, inNP, 'NP');
    assert.equal(out.kind, 'alternate');
  });

  it('a span in neither reading is still wrong', () => {
    assert.equal(gradeForm(ambiguous, [1, 2], 'NP').kind, 'wrong');
  });
});

describe('the hint ladder', () => {
  const wrong = gradeForm(vtr, [1, 1], 'N');

  it('gives nothing when the answer was right', () => {
    assert.equal(hintFor(1, { kind: 'correct', readingId: 'r1' }), null);
  });

  it('first miss is the formal test, as text', () => {
    const h = hintFor(1, wrong)!;
    assert.equal(h.level, 1);
    assert.match(h.text, /tense/);
  });

  it('second miss narrows the menu to three', () => {
    const h = hintFor(2, wrong)!;
    assert.equal(h.level, 2);
    if (h.level === 2) assert.equal(h.narrowTo, 3);
  });

  it('third miss demonstrates the test rather than describing it', () => {
    const h = hintFor(3, wrong)!;
    assert.equal(h.level, 3);
    if (h.level === 3) assert.equal(h.demonstrate, true);
  });
});

describe('grading a whole build', () => {
  function complete() {
    let s = wrap(emptyBuild(), vtr.words, [0, 0], 'Pron');
    s = wrap(s, vtr.words, [1, 1], 'V');
    s = setOnlyVerbType(s, 'Vtr');
    s = wrap(s, vtr.words, [2, 2], 'Det');
    s = wrap(s, vtr.words, [3, 3], 'N');
    s = wrap(s, vtr.words, [0, 0], 'NP');
    s = wrap(s, vtr.words, [2, 3], 'NP');
    s = wrap(s, vtr.words, [1, 3], 'VP');
    s = wrap(s, vtr.words, [0, 3], 'S');
    const at = (form: string, start: number) =>
      Object.keys(s.constituents).find(
        (id) => s.constituents[id]!.form === form && s.constituents[id]!.span[0] === start,
      )!;
    s = setFunction(s, at('NP', 0), 'subject');
    s = setFunction(s, at('VP', 1), 'predicate');
    s = setFunction(s, at('NP', 2), 'directObject');
    s = setFunction(s, at('Pron', 0), 'head');
    s = setFunction(s, at('V', 1), 'head');
    s = setFunction(s, at('Det', 2), 'determiner');
    s = setFunction(s, at('N', 3), 'head');
    return s;
  }

  it('a faithful rebuild matches the canonical reading', () => {
    const { readingId, wrong } = gradeBuild(complete(), vtr);
    assert.equal(wrong.length, 0, wrong.join(' | '));
    assert.equal(readingId, 'r1');
  });

  it('names what is missing when the build is incomplete', () => {
    const s = wrap(emptyBuild(), vtr.words, [0, 0], 'Pron');
    const { readingId, wrong } = gradeBuild(s, vtr);
    assert.equal(readingId, null);
    assert.ok(wrong.some((w) => /missing/.test(w)));
  });

  it('names the wrong verb type', () => {
    const s = setOnlyVerbType(complete(), 'Vint');
    const { wrong } = gradeBuild(s, vtr);
    assert.ok(
      wrong.some((w) => /missing: .*Vtr verb/.test(w)),
      wrong.join(' | '),
    );
  });

  it('flags a group the answer does not have', () => {
    // An NP over “She repaired”, which is a group a learner can really build
    // and the answer really lacks.
    let s = wrap(emptyBuild(), vtr.words, [0, 0], 'Pron');
    s = wrap(s, vtr.words, [1, 1], 'V');
    s = wrap(s, vtr.words, [0, 1], 'NP');
    const { wrong } = gradeBuild(s, vtr);
    assert.ok(
      wrong.some((w) => /not in the answer: .*NP@0-1/.test(w)),
      wrong.join(' | '),
    );
  });
});

describe('every decision the palette asks for is graded', () => {
  /**
   * One row per learner-settable field, each mutating a correct build in a
   * single place and requiring a specific complaint.
   *
   * This table is the reason `facts()` enumerates rather than checking fields
   * by hand. Before it, eight of these rows passed: the build was graded on
   * span, form, function, verb type and voice, and everything else the palette
   * asks a learner was accepted whatever they answered.
   *
   * A field added to `Constituent` and not to `facts()` shows up here as a row
   * that stops failing, which is a failing test rather than a false pass.
   */
  const ROWS: {
    what: string;
    fixture: string;
    change: (c: Constituent) => boolean;
    says: RegExp;
  }[] = [
    {
      what: 'clause kind',
      fixture: 'fix-object-clause',
      change: (c) => (c.clauseKind === 'nominal' ? ((c.clauseKind = 'relative'), true) : false),
      says: /nominal clause/,
    },
    {
      what: 'finiteness',
      fixture: 'fix-infinitive',
      change: (c) => (c.finiteness === 'infinitival' ? ((c.finiteness = 'finite'), true) : false),
      says: /infinitival/,
    },
    {
      what: 'auxiliary job',
      fixture: 'fix-auxiliary-chain',
      change: (c) => (c.auxKind === 'perfect' ? ((c.auxKind = 'do'), true) : false),
      says: /perfect auxiliary/,
    },
    {
      what: 'particle kind',
      fixture: 'fix-particle',
      change: (c) => (c.partKind === 'verbal' ? ((c.partKind = 'infinitival'), true) : false),
      says: /verbal kind of particle/,
    },
    {
      what: 'fusion',
      fixture: 'fix-fused',
      change: (c) => (c.fusedWith ? ((c.fusedWith = undefined), true) : false),
      says: /is also the determiner/,
    },
    {
      what: 'obligatory adverbial',
      fixture: 'fix-vbe',
      change: (c) => (c.obligatory ? ((c.obligatory = undefined), true) : false),
      says: /required by the verb/,
    },
    {
      what: 'voice',
      fixture: 'fix-passive',
      change: (c) => (c.voice === 'passive' ? ((c.voice = undefined), true) : false),
      says: /is passive/,
    },
    {
      what: 'verb type',
      fixture: 'fix-vtr',
      change: (c) => (c.verbType === 'Vtr' ? ((c.verbType = 'Vint'), true) : false),
      says: /Vtr verb/,
    },
    {
      what: 'a gap',
      fixture: 'fix-subject-relative',
      change: (c) => (c.gap ? ((c.gap = undefined), (c.span = [3, 3]), true) : false),
      says: /is empty/,
    },
    {
      what: 'a filler-gap link',
      fixture: 'fix-fronted-phrase',
      change: (c) => (c.index !== undefined ? ((c.index = undefined), true) : false),
      says: /is tied to/,
    },
    {
      what: 'a function',
      fixture: 'fix-vtr',
      change: (c) =>
        c.function === 'directObject' ? ((c.function = 'subjectComplement'), true) : false,
      says: /direct object/,
    },
  ];

  for (const row of ROWS) {
    it(`catches a wrong ${row.what}`, () => {
      const sentence = BY_ID[row.fixture]!;
      const build = replaySentence(sentence).final;
      const changed = Object.values(build.constituents).some((c) => row.change(c));
      assert.equal(changed, true, `${row.fixture} has nothing to change`);
      const { readingId, wrong } = gradeBuild(build, sentence);
      assert.equal(readingId, null, `graded as correct: ${row.what}`);
      assert.ok(
        wrong.some((w) => row.says.test(w)),
        `expected ${row.says} in: ${wrong.join(' | ')}`,
      );
    });
  }

  it('and still passes a build that is right', () => {
    for (const id of ['fix-vtr', 'fix-passive', 'fix-fused', 'fix-across-the-board']) {
      const sentence = BY_ID[id]!;
      const { readingId, wrong } = gradeBuild(replaySentence(sentence).final, sentence);
      assert.equal(wrong.length, 0, `${id}: ${wrong.join(' | ')}`);
      assert.equal(readingId, sentence.canonicalId);
    }
  });
});

describe('feedback answers the question that was asked', () => {
  it('corrects a word class with a word class, not with the phrase over it', () => {
    // *She* is a pronoun AND a one-word noun phrase. Both are true; only one
    // answers the group that was open.
    const word = gradeForm(vtr, [0, 0], 'N', 'word');
    assert.equal(word.kind, 'wrong');
    assert.match(word.kind === 'wrong' ? word.reason : '', /it is a pronoun/);

    const phrase = gradeForm(vtr, [0, 0], 'VP', 'phrase');
    assert.match(phrase.kind === 'wrong' ? phrase.reason : '', /it is a noun phrase/);
  });

  it('withholds the answer rather than picking one of two', () => {
    // With no level, both forms are candidates. Naming one of them "the"
    // answer teaches that the other is wrong.
    const either = gradeForm(vtr, [0, 0], 'N');
    assert.equal(either.kind, 'wrong');
    assert.doesNotMatch(either.kind === 'wrong' ? either.reason : '', / it is /);
  });

  it('still says so when the span is not a group at all', () => {
    const none = gradeForm(vtr, [1, 2], 'NP', 'phrase');
    assert.match(none.kind === 'wrong' ? none.reason : '', /not a group on its own/);
  });

  it('a right answer is right at either level', () => {
    assert.equal(gradeForm(vtr, [0, 0], 'Pron', 'word').kind, 'correct');
    assert.equal(gradeForm(vtr, [0, 0], 'NP', 'phrase').kind, 'correct');
  });
});
