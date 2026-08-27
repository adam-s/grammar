import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  emptyBuild,
  nodeOver,
  setFunction,
  setVerbType,
  wrap,
  type BuildState,
} from './builder.ts';
import { vtr } from './fixtures.ts';
import {
  byHotkey,
  filterPanel,
  isPickable,
  optionsFor,
  pickable,
  type LabelOption,
  type OptionState,
  type Panel,
} from './options.ts';
import { WORD_FORMS } from './types.ts';

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
  return setVerbType(s, 'Vtr');
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
});

describe('states carry the message', () => {
  it('rests everything when nothing is selected, and offers no keys', () => {
    const p = optionsFor(emptyBuild(), W, { kind: 'none' });
    assert.ok(states(p, 'word-class').every((s) => s === 'idle'));
    assert.equal(p.suggested, 0);
    assert.equal(pickable(p).length, 0);
    assert.match(p.prompt, /select/i);
  });

  it('blocks every form with the same reason when the SPAN cannot be a group', () => {
    // Nothing is named yet, so "She repaired" is not groupable at all.
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [0, 1] });
    assert.ok(p.blocked);
    const g = group(p, 'phrase-form')!;
    assert.ok(g.options.every((o) => o.state === 'blocked'));
    assert.ok(g.options.every((o) => o.note === p.blocked));
    assert.equal(pickable(p).length, 0);
  });

  it('blocks a crossing bracket with the words it would cut', () => {
    const p = optionsFor(built(), W, { kind: 'span', span: [1, 2] });
    assert.match(p.blocked ?? '', /cut/i);
    assert.match(p.blocked ?? '', /the engine/);
  });

  it('blocks one-word phrases until the word itself has a class', () => {
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [3, 3] });
    // The word class is open…
    assert.ok(isPickable(opt(p, 'form:N')!));
    // …but "engine is a noun phrase" is a claim about a noun you have not made.
    const np = opt(p, 'form:NP')!;
    assert.equal(np.state, 'blocked');
    assert.match(np.note ?? '', /engine/);
  });

  it('marks the label already applied as chosen', () => {
    const s = built();
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [2, 3])! });
    assert.equal(opt(p, 'form:NP')!.state, 'chosen');
  });

  it('keeps an untaught label visible but out of reach', () => {
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [1, 1] }, { forms: ['N', 'V'] });
    const adj = opt(p, 'form:Adj')!;
    assert.equal(adj.state, 'untaught');
    assert.ok(!isPickable(adj));
    // Still there: the shape of the taxonomy stays visible.
    assert.equal(group(p, 'word-class')!.options.length, WORD_FORMS.length);
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
    const io = opt(p, 'func:indirectObject')!;
    assert.equal(io.state, 'blocked');
    assert.match(io.note ?? '', /transitive/);
  });
});

describe('functions are contingent, so they are filtered', () => {
  it('omits what can never apply and blocks what merely does not yet', () => {
    const s = built();
    const p = optionsFor(s, W, { kind: 'node', id: nodeOver(s, [2, 3])! });
    // A subject cannot ever sit inside a verb phrase: gone, not greyed.
    assert.equal(opt(p, 'func:subject'), undefined);
    assert.equal(opt(p, 'func:objectComplement'), undefined);
    // A direct object is exactly what a transitive verb licenses here.
    assert.equal(opt(p, 'func:directObject')!.state, 'available');
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
  it('numbers suggestions only, from one, in visual order', () => {
    const p = optionsFor(emptyBuild(), W, { kind: 'span', span: [2, 2] });
    const keyed = p.groups.flatMap((g) => g.options).filter((o) => o.hotkey);
    assert.ok(keyed.length > 0);
    assert.deepEqual(
      keyed.map((o) => o.hotkey),
      keyed.map((_, i) => String(i + 1)),
    );
    assert.ok(keyed.every((o) => o.state === 'suggested'));
    assert.equal(p.suggested, keyed.length);
    assert.equal(byHotkey(p, '1')!.state, 'suggested');
    assert.equal(byHotkey(p, '9'), null);
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
    // forms: classifying the verb is the spine of the course.
    assert.deepEqual(
      p.groups.map((g) => g.id),
      ['word-class', 'verb-type', 'phrase-form', 'function'],
    );
  });

  it('moves on again once the verb type is settled', () => {
    let s = emptyBuild();
    s = wrap(s, W, [1, 1], 'V');
    s = setVerbType(s, 'Vtr');
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
