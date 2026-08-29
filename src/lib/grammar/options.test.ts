import assert from 'node:assert/strict';
import { describe, it, test } from 'node:test';
import {
  emptyBuild,
  nodeOver,
  roots,
  setFunction,
  setOnlyVerbType,
  wrap,
  type BuildState,
} from './builder.ts';
import { ambiguous, vtr } from './fixtures.ts';
import {
  byHotkey,
  blockRejectedOptions,
  filterPanel,
  isPickable,
  openingGroup,
  isPanelComplete,
  optionsFor,
  pickable,
  type LabelOption,
  type OptionState,
  type Panel,
} from './options.ts';
import { WORD_FORMS } from './types.ts';
import { COURSE_LESSONS } from '../course/course.ts';
import { scopeThrough } from '../course/scope.ts';

const W = vtr.words; // She(0) repaired(1) the(2) engine(3)

const group = (p: Panel, id: string) => p.groups.find((g) => g.id === id);
const opt = (p: Panel, key: string): LabelOption | undefined =>
  p.groups.flatMap((g) => g.options).find((o) => o.key === key);
const states = (p: Panel, id: string): OptionState[] => group(p, id)!.options.map((o) => o.state);

/** She/repaired/the/engine fully named, with "the engine" wrapped in an NP. */
function built(): BuildState {
  let s = emptyBuild();
  s = wrap(s, W, [0, 0], 'Pron');
  s = wrap(s, W, [1, 1], 'V');
  s = wrap(s, W, [2, 2], 'Det');
  s = wrap(s, W, [3, 3], 'N');
  s = wrap(s, W, [2, 3], 'NP');
  s = wrap(s, W, [1, 3], 'VP');
  return setOnlyVerbType(s, 'Vtr');
}

describe('the panel is furniture — its inventory does not move', () => {
  it('lists every word class, in taxonomy order, whatever is selected', () => {
    const panels = [
      optionsFor(emptyBuild(), W, { kind: 'none' }),
      optionsFor(emptyBuild(), W, { kind: 'span', span: [1, 1] }),
      optionsFor(built(), W, { kind: 'node', id: nodeOver(built(), [1, 1])! }),
    ];
    for (const p of panels) {
      const labels = group(p, 'word-class')!.options.map((o) => o.form);
      assert.deepEqual(labels, [...WORD_FORMS]);
    }
  });

  it('marks suggestions in place rather than floating them to the top', () => {
    // "the" is a closed-class determiner, so Det is suggested — but Noun still
    // comes first, because Noun comes first in the taxonomy.
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [2, 2] });
    const forms = group(p, 'word-class')!.options.map((o) => o.form);
    assert.deepEqual(forms, [...WORD_FORMS]);
    assert.equal(opt(p, 'form:Det')!.state, 'suggested');
    assert.equal(opt(p, 'form:N')!.state, 'available');
  });

  it('asks a different QUESTION for a run of words, not a disabled one', () => {
    // A run of words is never a part of speech, so the word classes are absent
    // — the group is gone, not thirteen greyed-out rows.
    const p = optionsFor(built(), W, { kind: 'span', span: [2, 3] });
    assert.equal(group(p, 'word-class'), undefined);
    assert.ok(group(p, 'phrase-form'));
  });

  it('treats adjacent selected nodes as one phrase candidate', () => {
    let state = emptyBuild();
    state = wrap(state, W, [1, 1], 'V');
    state = wrap(state, W, [2, 2], 'Det');
    state = wrap(state, W, [3, 3], 'N');
    state = wrap(state, W, [2, 3], 'NP');
    const ids = Object.keys(state.constituents).filter(
      (id) => state.constituents[id]!.parent === null,
    );
    const p = optionsFor(state, W, { kind: 'nodes', ids, span: [1, 3] });
    assert.equal(p.subject, '“repaired the engine”');
    assert.equal(group(p, 'word-class'), undefined);
    assert.ok(group(p, 'phrase-form'));
  });
});

describe('states carry the message', () => {
  it('rests everything when nothing is selected, and offers no keys', () => {
    const p = optionsFor(emptyBuild(), W, { kind: 'none' });
    assert.ok(states(p, 'word-class').every((s) => s === 'idle'));
    assert.equal(p.suggested, 0);
    assert.equal(pickable(p).length, 0);
    assert.match(p.prompt, /select/i);
  });

  it('offers a phrase over a run nobody has named yet', () => {
    // "She repaired" is groupable with nothing labelled inside it. Naming the
    // parts is a later question, not a precondition.
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [0, 1] });
    assert.equal(p.blocked, undefined);
    assert.ok(isPickable(opt(p, 'form:NP')!));
  });

  it('blocks a crossing bracket with the words it would cut', () => {
    const p = optionsFor(built(), W, { kind: 'span', span: [1, 2] });
    assert.match(p.blocked ?? '', /cut/i);
    assert.match(p.blocked ?? '', /the engine/);
  });

  it('offers a one-word phrase on a word that has no class yet', () => {
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [3, 3] });
    // Both rows work, and they mean different things: one names the word, the
    // other puts a phrase over it. A one-word predicate needs the second.
    assert.ok(isPickable(opt(p, 'form:N')!));
    assert.ok(isPickable(opt(p, 'form:NP')!));
  });

  it('marks the label already applied as chosen', () => {
    const s = built();
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [2, 3])! });
    assert.equal(opt(p, 'form:NP')!.state, 'chosen');
  });

  it('does not highlight a conflicting suggestion after the form is chosen', () => {
    const reading = ambiguous.readings.find((entry) => entry.id === ambiguous.canonicalId)!;
    const state: BuildState = {
      constituents: reading.constituents,
      seq: Object.keys(reading.constituents).length,
    };
    const vp = Object.keys(state.constituents).find(
      (id) => state.constituents[id]!.form === 'VP' && state.constituents[id]!.parent !== null,
    )!;
    const p = optionsFor(state, ambiguous.words, { kind: 'node', id: vp });

    assert.equal(opt(p, 'form:VP')!.state, 'chosen');
    assert.notEqual(opt(p, 'form:NP')!.state, 'suggested');
    assert.equal(
      group(p, 'phrase-form')!.options.some((option) => option.state === 'suggested'),
      false,
    );
  });

  it('keeps an untaught label visible but out of reach', () => {
    const p = optionsFor(
      emptyBuild(),
      W,
      { kind: 'span', span: [1, 1] },
      new Set(['form:N', 'form:V']),
    );
    const adj = opt(p, 'form:Adj')!;
    assert.equal(adj.state, 'untaught');
    assert.ok(!isPickable(adj));
    // Still there: the shape of the taxonomy stays visible.
    assert.equal(group(p, 'word-class')!.options.length, WORD_FORMS.length);
  });

  it('visibly blocks a choice already rejected for this selection', () => {
    const original = optionsFor(emptyBuild(), W, { kind: 'span', span: [0, 0] });
    const panel = blockRejectedOptions(original, {
      'form:N': 'Not a noun here.',
    });

    assert.equal(opt(panel, 'form:N')!.state, 'blocked');
    assert.equal(opt(panel, 'form:N')!.note, 'Not a noun here.');
    assert.equal(isPickable(opt(panel, 'form:N')!), false);
    assert.equal(isPickable(opt(panel, 'form:Pron')!), true);
    assert.equal(opt(original, 'form:N')!.state, 'available', 'the source panel is unchanged');
  });
});

describe('completion closes only terminal decisions', () => {
  it('completes a noun phrase once its phrase type and subject role are answered', () => {
    let s = wrap(emptyBuild(), W, [0, 0], 'Pron');
    s = wrap(s, W, [0, 0], 'NP');
    const np = nodeOver(s, [0, 0])!;

    assert.equal(isPanelComplete(optionsFor(s, W, { kind: 'node', id: np })), false);
    s = setFunction(s, np, 'subject');
    assert.equal(isPanelComplete(optionsFor(s, W, { kind: 'node', id: np })), true);
  });

  it('keeps the palette open while another applicable category is unanswered', () => {
    let s = wrap(emptyBuild(), W, [1, 1], 'V');
    const verb = nodeOver(s, [1, 1])!;

    assert.equal(isPanelComplete(optionsFor(s, W, { kind: 'node', id: verb })), false);
    s = setOnlyVerbType(s, 'Vtr');
    assert.equal(isPanelComplete(optionsFor(s, W, { kind: 'node', id: verb })), false);
  });
});

describe('every option explains itself', () => {
  it('gives an unmarked option its formal test', () => {
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [1, 1] });
    assert.match(opt(p, 'form:N')!.note ?? '', /the/);
    assert.match(opt(p, 'form:Adj')!.note ?? '', /very/);
  });

  it('replaces the test with the evidence when a form is suggested', () => {
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [1, 1] });
    const v = opt(p, 'form:V')!;
    assert.equal(v.state, 'suggested');
    assert.match(v.note ?? '', /repaired/);
  });

  it('replaces both with the reason when an option is blocked', () => {
    const s = built();
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [2, 3])! });
    const head = opt(p, 'func:head')!;
    assert.equal(head.state, 'blocked');
    assert.match(head.note ?? '', /head of a verb phrase/i);
  });
});

describe('functions are contingent, so they are filtered', () => {
  it('offers compatible hypotheses but still blocks structural impossibilities', () => {
    const s = built();
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [2, 3])! });
    // A subject cannot ever sit inside a verb phrase: gone, not greyed.
    assert.equal(opt(p, 'func:subject'), undefined);
    // These are grammatically compatible NP hypotheses. The grader, not a
    // grey row, tells the learner which one fits this sentence.
    assert.equal(opt(p, 'func:directObject')!.state, 'available');
    assert.equal(opt(p, 'func:indirectObject')!.state, 'available');
    assert.equal(opt(p, 'func:objectComplement')!.state, 'available');
    // The head of a verb phrase is a verb, and this is a noun phrase.
    assert.equal(opt(p, 'func:head')!.state, 'blocked');
  });

  it('says why a loose node cannot have a function at all', () => {
    let s = emptyBuild();
    s = wrap(s, W, [0, 0], 'Pron');
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [0, 0])! });
    const fns = group(p, 'function')!.options;
    assert.ok(fns.length > 0);
    assert.ok(fns.every((o) => o.state === 'blocked'));
    assert.match(fns[0]!.note ?? '', /group it first/i);
  });

  it('offers predicate as soon as a complete VP is on the clause frontier', () => {
    const s = built();
    const vp = roots(s).find((id) => s.constituents[id]!.form === 'VP')!;
    const p = optionsFor(s, W, { kind: 'node', id: vp });

    assert.equal(opt(p, 'func:predicate')!.state, 'available');
    assert.equal(opt(p, 'func:subject'), undefined);
  });

  it('offers direct object on a top-level NP before the VP is drawn', () => {
    let s = emptyBuild();
    s = wrap(s, W, [1, 1], 'V');
    s = wrap(s, W, [2, 2], 'Det');
    s = wrap(s, W, [3, 3], 'N');
    s = wrap(s, W, [2, 3], 'NP');
    const object = roots(s).find((id) => s.constituents[id]!.form === 'NP')!;
    const p = optionsFor(s, W, { kind: 'node', id: object });

    assert.equal(opt(p, 'func:subject')!.state, 'available');
    assert.equal(opt(p, 'func:directObject')!.state, 'available');
    assert.equal(opt(p, 'func:indirectObject')!.state, 'available');
    assert.equal(opt(p, 'func:subjectComplement')!.state, 'available');
    assert.equal(opt(p, 'func:objectComplement')!.state, 'available');
  });
});

describe('the verb type is a third question, asked alongside', () => {
  it('appears for a verb and marks the type already chosen', () => {
    const s = built();
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [1, 1])! });
    const g = group(p, 'verb-type');
    assert.ok(g, 'a verb should be asked what kind it is');
    assert.equal(g!.options.length, 6);
    assert.equal(opt(p, 'vt:Vtr')!.state, 'chosen');
    // …and it is a sibling of the form group, not hidden behind it.
    assert.ok(p.groups.some((x) => x.id === 'word-class'));
    assert.ok(p.groups.some((x) => x.id === 'function'));
  });

  it('stays away from things that are not verbs', () => {
    const s = built();
    assert.equal(
      group(optionsFor(s, W, { kind: 'node', id: nodeOver(s, [2, 3])! }), 'verb-type'),
      undefined,
    );
  });
});

describe('the shortlist is what the keyboard reaches', () => {
  it('numbers suggestions only, from one, in evidence order', () => {
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [2, 2] });
    const keyed = p.groups.flatMap((g) => g.options).filter((o) => o.hotkey);
    assert.ok(keyed.length > 0);
    assert.ok(keyed.every((o) => o.state === 'suggested'));
    assert.equal(p.suggested, keyed.length);
    assert.equal(byHotkey(p, '1')!.state, 'suggested');
    assert.equal(byHotkey(p, '9'), null);
  });

  it('keeps a possessive determiner ahead of a suffix guess', () => {
    const lesson = COURSE_LESSONS.find((l) => l.id === '02-sentence-frame')!;
    const sentence = lesson.sentences.find((s) => s.id === 'c02-d')!;
    const p = optionsFor(emptyBuild(), sentence.words, { kind: 'span', span: [3, 3] });

    assert.equal(byHotkey(p, '1')?.form, 'Det');
    assert.equal(byHotkey(p, '2')?.form, 'Adj');
  });

  it('trusts a noun node over the verb-like ending of “shoes”', () => {
    const lesson = COURSE_LESSONS.find((l) => l.id === '02-sentence-frame')!;
    const sentence = lesson.sentences.find((s) => s.id === 'c02-d')!;
    let state = emptyBuild();
    state = wrap(state, sentence.words, [0, 0], 'Det');
    state = wrap(state, sentence.words, [1, 1], 'N');
    state = wrap(state, sentence.words, [2, 4], 'PP');
    const p = optionsFor(state, sentence.words, { kind: 'span', span: [1, 4] });

    assert.equal(byHotkey(p, '1')?.form, 'Nom');
    assert.notEqual(byHotkey(p, '2')?.form, 'VP');
  });

  it('trusts a built subject and predicate over the sentence’s first word', () => {
    let state = emptyBuild();
    state = wrap(state, W, [0, 0], 'Pron');
    state = wrap(state, W, [0, 0], 'NP');
    state = setFunction(state, nodeOver(state, [0, 0])!, 'subject');
    state = wrap(state, W, [1, 1], 'V');
    state = wrap(state, W, [2, 2], 'Det');
    state = wrap(state, W, [3, 3], 'N');
    state = wrap(state, W, [2, 3], 'NP');
    state = wrap(state, W, [1, 3], 'VP');
    state = setFunction(state, nodeOver(state, [1, 3])!, 'predicate');
    const p = optionsFor(state, W, { kind: 'span', span: [0, 3] });

    assert.equal(byHotkey(p, '1')?.form, 'S');
  });
});

describe('the filter is the one thing allowed to reorder', () => {
  it('puts a prefix match above a substring one', () => {
    // "transitive" is a substring of "intransitive"; plain filtering put the
    // cursor on the opposite verb type from the one being typed.
    const s = built();
    const p = filterPanel(
      optionsFor(s, W, { kind: 'node', id: nodeOver(s, [1, 1])! }),
      'transitive',
    );
    const vt = group(p, 'verb-type')!.options;
    assert.equal(vt[0]!.verbType, 'Vtr');
    assert.ok(vt.some((o) => o.verbType === 'Vint'));
  });

  it('matches the note as well as the name, and drops empty groups', () => {
    const p = filterPanel(optionsFor(emptyBuild(), W, { kind: 'span', span: [1, 1] }), 'plural');
    assert.ok(p.groups.every((g) => g.options.length > 0));
    assert.ok(opt(p, 'form:N'));
  });
});

describe('a node inside a group is locked, visibly', () => {
  it('lets a word be renamed but not re-wrapped', () => {
    const s = built();
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [2, 2])! });
    // "the" sits inside the NP. Calling it a pronoun instead moves nothing…
    assert.ok(isPickable(opt(p, 'form:Pron')!));
    // …but making it a one-word noun phrase would change what the NP contains.
    const np = opt(p, 'form:NP')!;
    assert.equal(np.state, 'blocked');
    assert.match(np.note ?? '', /ungroup/i);
  });

  it('lets a loose word become a one-word phrase', () => {
    let s = emptyBuild();
    s = wrap(s, W, [0, 0], 'Pron');
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [0, 0])! });
    assert.ok(isPickable(opt(p, 'form:NP')!));
    assert.equal(opt(p, 'form:Pron')!.state, 'chosen');
  });

  it('locks a phrase that is already inside another', () => {
    const s = built(); // the NP sits inside the VP
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [2, 3])! });
    assert.equal(opt(p, 'form:NP')!.state, 'chosen');
    assert.equal(opt(p, 'form:PP')!.state, 'blocked');
  });
});

describe('the live question is the one on screen', () => {
  it('rests on the form group while the words are unnamed', () => {
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [1, 1] });
    assert.equal(p.step, 'word-class');
    assert.equal(group(p, 'word-class')!.answered, null);
  });

  it('moves to the verb type the moment a verb is named', () => {
    let s = emptyBuild();
    s = wrap(s, W, [1, 1], 'V');
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [1, 1])! });
    assert.equal(p.step, 'verb-type');
    assert.equal(group(p, 'word-class')!.answered?.form, 'V');
    // …and it is asked directly after the word class, not below the phrase
    // forms: classifying the verb is the spine of the course. Voice follows
    // the type because it refines it — a verb has to have an object before
    // the question of moving that object into the subject means anything.
    assert.deepEqual(
      p.groups.map((g) => g.id),
      ['word-class', 'verb-type', 'voice', 'phrase-form', 'function'],
    );
  });

  it('voice never interrupts: active is the answer until someone changes it', () => {
    let s = emptyBuild();
    s = wrap(s, W, [1, 1], 'V');
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [1, 1])! });
    assert.equal(group(p, 'voice')!.answered?.voice, 'active');
    assert.notEqual(p.step, 'voice', 'an unasked question should not take the step');
  });

  it('the passive is offered but blocked until the verb has an object to move', () => {
    let s = emptyBuild();
    s = wrap(s, W, [1, 1], 'V');
    const before = group(optionsFor(s, W, { kind: 'node', id: nodeOver(s, [1, 1])! }), 'voice')!;
    const passive = before.options.find((o) => o.voice === 'passive')!;
    assert.equal(passive.state, 'blocked', 'the row stays visible so the choice is learnable');
    assert.match(passive.note ?? '', /Classify the verb first/);

    s = setOnlyVerbType(s, 'Vint');
    const intransitive = group(
      optionsFor(s, W, { kind: 'node', id: nodeOver(s, [1, 1])! }),
      'voice',
    )!;
    assert.equal(intransitive.options.find((o) => o.voice === 'passive')!.state, 'blocked');

    s = setOnlyVerbType(s, 'Vtr');
    const transitive = group(
      optionsFor(s, W, { kind: 'node', id: nodeOver(s, [1, 1])! }),
      'voice',
    )!;
    assert.equal(transitive.options.find((o) => o.voice === 'passive')!.state, 'available');
  });

  it('moves on again once the verb type is settled', () => {
    let s = emptyBuild();
    s = wrap(s, W, [1, 1], 'V');
    s = setOnlyVerbType(s, 'Vtr');
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [1, 1])! });
    assert.equal(group(p, 'verb-type')!.answered?.verbType, 'Vtr');
    assert.equal(p.step, 'phrase-form');
  });

  it('skips a group that has nothing pickable in it', () => {
    // "the" is inside the NP, so it cannot be re-wrapped — but it can be given
    // a function, and that is where the panel should be.
    const s = built();
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [2, 2])! });
    assert.equal(p.step, 'function');
  });

  it('rests on the last changeable group when everything is answered', () => {
    let s = built();
    s = setFunction(s, nodeOver(s, [2, 3])!, 'directObject');
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [2, 3])! });
    assert.equal(group(p, 'function')!.answered?.func, 'directObject');
    assert.equal(p.step, 'function');
  });

  it('keeps number keys inside the step group', () => {
    let s = emptyBuild();
    s = wrap(s, W, [1, 1], 'V');
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [1, 1])! });
    const keyed = p.groups.filter((g) => g.options.some((o) => o.hotkey));
    assert.ok(keyed.every((g) => g.id === p.step));
  });
});

describe('a note shows by default only where it is the choice', () => {
  it('treats the formal tests as reference and the examples as content', () => {
    let s = emptyBuild();
    s = wrap(s, W, [1, 1], 'V');
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [1, 1])! });
    // Thirteen formal tests at once is a wall nobody reads.
    assert.equal(group(p, 'word-class')!.notes, 'ondemand');
    // Six verb types are told apart BY their examples.
    assert.equal(group(p, 'verb-type')!.notes, 'always');
    assert.equal(group(p, 'function')!.notes, 'always');
  });
});

describe('an offer is not a question', () => {
  it('an optional group never becomes the open one, however long it is untaken', () => {
    // Stacking and ellipsis are both offers. If either could take the step, a
    // finished node would open on "is a piece of it missing?" for ever.
    let s = emptyBuild();
    s = wrap(s, W, [0, 0], 'Pron');
    s = wrap(s, W, [0, 0], 'NP');
    const np = nodeOver(s, [0, 0])!;
    s = setFunction(s, np, 'subject');
    const p = optionsFor(s, W, { kind: 'node', id: np });
    const optional = p.groups.filter((g) => g.optional).map((g) => g.id);
    assert.ok(optional.length > 0, 'this selection should have at least one offer');
    assert.ok(!optional.includes(p.step!), `the palette opened on ${p.step}`);
    assert.equal(isPanelComplete(p), true, 'an untaken offer does not hold the palette open');
  });
});

/* --------------------------------------------- which group the palette opens */

test('the palette opens where there is something to pick, not simply first', () => {
  // The reported bug: selecting a word under lesson 2 opened the word-class
  // group, where every row is untaught, while the two takeable rows sat below.
  const lesson2 = COURSE_LESSONS.find((l) => l.id === '02-sentence-frame')!;
  const sentence = lesson2.sentences[0]!;
  const scope = scopeThrough(COURSE_LESSONS, lesson2.number);
  const panel = optionsFor(emptyBuild(), sentence.words, { kind: 'span', span: [1, 1] }, scope);

  const first = panel.groups[0]!;
  assert.equal(first.id, 'word-class');
  assert.equal(first.options.filter(isPickable).length, 0, 'the first group is a dead end here');

  const opened = openingGroup(panel)!;
  assert.ok(
    opened.options.filter(isPickable).length > 0,
    `opened ${opened.id} with nothing to pick`,
  );
  assert.equal(opened.id, panel.step, 'and it is the group the panel calls the current step');
});

test('a group the learner has chosen wins over the panel step', () => {
  const lesson2 = COURSE_LESSONS.find((l) => l.id === '02-sentence-frame')!;
  const sentence = lesson2.sentences[0]!;
  const scope = scopeThrough(COURSE_LESSONS, lesson2.number);
  const panel = optionsFor(emptyBuild(), sentence.words, { kind: 'span', span: [1, 1] }, scope);
  assert.equal(openingGroup(panel, 'word-class')!.id, 'word-class');
});

test('every lesson opens a palette a learner can act on', () => {
  for (const lesson of COURSE_LESSONS) {
    const scope = scopeThrough(COURSE_LESSONS, lesson.number);
    for (const sentence of lesson.sentences.slice(0, 3)) {
      for (let w = 0; w < Math.min(sentence.words.length, 4); w++) {
        const panel = optionsFor(
          emptyBuild(),
          sentence.words,
          { kind: 'span', span: [w, w] },
          scope,
        );
        if (!panel.groups.some((g) => g.options.some(isPickable))) continue;
        const opened = openingGroup(panel);
        assert.ok(
          opened?.options.some(isPickable),
          `${lesson.id} “${sentence.words[w]!.text}” opens ${opened?.id} with nothing to pick`,
        );
      }
    }
  }
});

describe('the one-word phrase question is only asked where it has an answer', () => {
  const lesson2 = COURSE_LESSONS.find((l) => l.id === '02-sentence-frame')!;
  const scope = scopeThrough(COURSE_LESSONS, lesson2.number);
  const named = (form: 'Det' | 'Pron' | 'V', at: [number, number]) => {
    const s = wrap(emptyBuild(), W, at, form);
    return optionsFor(s, W, { kind: 'node', id: nodeOver(s, at)! }, scope);
  };

  it('does not park a determiner on a list it cannot answer', () => {
    // The reported bug: naming "the" a determiner — correctly — advanced the
    // palette to "Or is it a one-word phrase?", whose only reachable row was a
    // noun phrase, which is wrong here. A determiner heads a determinative
    // phrase and nothing else, and lesson 2 has never shown one.
    const p = named('Det', [2, 2]);
    assert.equal(group(p, 'phrase-form')!.optional, true, 'an offer, not a question');
    assert.equal(p.step, 'word-class', 'the palette rests on the answer just given');
  });

  it('still asks a verb, which does head a phrase of its own', () => {
    const p = named('V', [1, 1]);
    assert.equal(group(p, 'phrase-form')!.optional, false);
    assert.equal(p.step, 'phrase-form');
  });

  it('lets the learner try every one-word phrase before the grader explains a miss', () => {
    const p = named('Pron', [0, 0]);
    const vp = opt(p, 'form:VP')!;
    assert.ok(isPickable(vp));
    assert.ok(isPickable(opt(p, 'form:NP')!), 'a pronoun does head a noun phrase');
  });

  it('leaves the fused reading reachable — Most were gone', () => {
    // *Most* has no noun to determine, so it determines and heads at once. The
    // row has to stay takeable or `fix-fused` cannot be built at all; it just
    // does not get to hold the palette open.
    const p = named('Det', [2, 2]);
    assert.ok(isPickable(opt(p, 'form:NP')!), 'fusion is rare, not forbidden');
  });
});
