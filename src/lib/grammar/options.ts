/**
 * What the contextual label palette offers.
 *
 * ## A stable taxonomy inside a contextual surface
 *
 * The palette moves with the selection, but the taxonomy inside it must not
 * move. Its rules are therefore stability rules first.
 *
 *   1. **A group's inventory is complete and its order never changes.**
 *      All thirteen word classes, always, in the same order. What varies is
 *      each option's STATE, not its presence.
 *
 *   2. **Which GROUPS show follows the shape of the selection**, which is the
 *      one thing the learner can see for themselves: one word asks "what is
 *      this word?", a run of words asks "what is this phrase?", an existing
 *      node also asks "and what does it do?".
 *
 *   3. **Suggestions keep their taxonomy seat.** Presentation may repeat them
 *      in the shared header for a fast action, but the underlying order never
 *      changes. Suggestions gain evidence and a number key.
 *
 *   4. **A blocked option keeps its reason.** The palette shows one reason at a
 *      time in its stable information header rather than expanding every row.
 *
 *   5. **Functions are contingent, so they are filtered.** A subject is not a
 *      thing that can ever sit inside a prepositional phrase, and offering it
 *      greyed out would teach a slot that never exists. `rules.ts` already
 *      draws this line for us: `hidden` means "never here" and is omitted,
 *      `disabled` means "not yet / not any more" and is shown with its reason.
 *
 * Availability comes from `rules.ts` and `builder.ts` — the same predicates
 * `audits.ts` runs over frozen content — so what a learner may pick and what
 * the content must satisfy cannot drift apart.
 */
import { canWrap, hypothesisFor, nodeOver, roots, type BuildState, type Span } from './builder.ts';
import { VERB_TYPE_MENU } from './rules.ts';
import { suggest } from './suggest.ts';
import { FORM_TEST, FUNCTION_TEST, formName, label } from './names.ts';
import {
  CLAUSE_FUNCTIONS,
  PHRASE_FORMS,
  PHRASE_INTERNAL_FUNCTIONS,
  WORD_FORMS,
  type Form,
  type Func,
  type VerbType,
  type Word,
} from './types.ts';

/**
 * `idle`      nothing is selected — readable, so the label set is learnable by
 *             exposure, but nothing can be picked yet
 * `suggested` the evidence in the sentence points here; carries a number key
 * `available` legal for this selection
 * `chosen`    already applied to this selection
 * `blocked`   illegal right now, and `note` says why
 * `untaught`  outside the chapter's scope; shown so the shape of the whole
 *             taxonomy stays visible, but not pickable
 */
export type OptionState = 'idle' | 'suggested' | 'available' | 'chosen' | 'blocked' | 'untaught';

/** The states a click may act on. */
export const PICKABLE: readonly OptionState[] = ['suggested', 'available', 'chosen'];

export const isPickable = (o: LabelOption): boolean => PICKABLE.includes(o.state);

/**
 * Whether the selected item has answered every question the palette can still
 * ask. This is deliberately derived from the finished panel rather than from
 * a particular label: subject, direct object, form, and verb type all follow
 * the same close-or-continue rule.
 */
export const isPanelComplete = (panel: Panel): boolean =>
  panel.groups.every((group) => group.answered || !group.options.some(isPickable));

/**
 * Turn choices already disproved for this selection into ordinary blocked
 * options. The grammar inventory stays stable, but a row cannot continue to
 * look actionable after the grader has refused it.
 */
export function blockRejectedOptions(
  panel: Panel,
  rejected: Readonly<Record<string, string>>,
): Panel {
  const groups = panel.groups.map((group) => ({
    ...group,
    options: group.options.map((option) => {
      const reason = rejected[option.key];
      return reason
        ? { ...option, state: 'blocked' as const, note: reason, hotkey: undefined }
        : option;
    }),
  }));
  return {
    ...panel,
    groups,
    suggested: groups.flatMap((group) => group.options).filter((option) => option.hotkey).length,
  };
}

export interface LabelOption {
  key: string;
  label: string;
  /**
   * The formal test, the evidence, or the reason it is blocked — whichever
   * applies. The palette renders the active note in its shared information line.
   */
  note?: string;
  state: OptionState;
  /** Number key, assigned to suggestions only. */
  hotkey?: string;
  form?: Form;
  func?: Func;
  /** The required SVA variety of an adverbial, represented on the same function. */
  obligatory?: boolean;
  verbType?: VerbType;
  /** Match quality under the current filter, 0 = best. Set by `filterPanel`. */
  rank?: number;
}

export interface OptionGroup {
  id: string;
  /** The question this group answers, in the learner's language. */
  question: string;
  options: LabelOption[];
  /**
   * Whether a plain option's note is intrinsic teaching content or supporting
   * reference content. The contextual palette shows one active note at a time;
   * expanded/reference renderers may use this priority directly.
   *
   * `always` where the note IS the choice — the six verb types are told apart
   * by their example, and the functions by the question that finds them.
   * `ondemand` where it is a reminder about a label the learner already knows
   * the name of; thirteen formal tests at once is a wall nobody reads, and one
   * on the row you are pointing at is a lesson.
   *
   * Notes that carry evidence or a block reason take priority whatever this says.
   */
  notes: 'always' | 'ondemand';
  /** The option already picked here, if any. A group with one is settled. */
  answered?: LabelOption | null;
}

export interface Panel {
  /** The words under the selection, quoted. Empty when nothing is selected. */
  subject: string;
  /** Guidance that the open group's own question does not already give. */
  prompt: string;
  groups: OptionGroup[];
  /**
   * The group that is the live question: the first one still unanswered that
   * has something pickable in it.
   *
   * A complete inventory is what makes the panel learnable, and it is also what
   * makes it long — twenty rows of word classes stood between a learner and the
   * function group, which was the thing they had just been told to do. Settled
   * groups therefore collapse to their answer. Nothing is removed, the order
   * never changes, and reopening one is a click; but the question you are
   * actually being asked is on screen.
   */
  step: string | null;
  /** How many options carry a number key. Always within the step group. */
  suggested: number;
  /** Set when the SELECTION itself cannot be labelled, whatever the label. */
  blocked?: string;
}

/** Which labels a chapter has taught. Absent means "everything". */
export interface ChapterScope {
  forms?: readonly Form[];
  functions?: readonly Func[];
}

export type Selection =
  | { kind: 'none' }
  | { kind: 'span'; span: Span }
  | { kind: 'node'; id: string }
  | { kind: 'nodes'; ids: string[]; span: Span };

/* ------------------------------------------------------------------ util */

const quote = (words: Word[], span: Span): string =>
  `“${words
    .slice(span[0], span[1] + 1)
    .map((w) => w.text)
    .join(' ')}”`;

const inScope = <T>(x: T, allowed?: readonly T[]): boolean => !allowed || allowed.includes(x);

/* ---------------------------------------------------------------- panels */

export function optionsFor(
  state: BuildState,
  words: Word[],
  sel: Selection,
  scope: ChapterScope = {},
): Panel {
  switch (sel.kind) {
    case 'none':
      return idlePanel(scope);
    case 'span':
      return spanPanel(state, words, sel.span, scope);
    case 'node':
      return nodePanel(state, words, sel.id, scope);
    case 'nodes':
      return spanPanel(state, words, sel.span, scope);
  }
}

/**
 * Nothing selected. This remains a complete model for tests and alternate
 * renderers; the contextual palette itself stays closed until there is an anchor.
 */
function idlePanel(scope: ChapterScope): Panel {
  return finish({
    subject: '',
    prompt: 'Select a word, or drag across a run of words.',
    groups: [
      {
        id: 'word-class',
        question: 'What is a word?',
        notes: 'ondemand',
        options: WORD_FORMS.map((f) =>
          formOption(f, inScope(f, scope.forms) ? 'idle' : 'untaught'),
        ),
      },
      {
        id: 'phrase-form',
        question: 'What is a run of words?',
        notes: 'ondemand',
        options: PHRASE_FORMS.map((f) =>
          formOption(f, inScope(f, scope.forms) ? 'idle' : 'untaught'),
        ),
      },
    ],
  });
}

function formOption(f: Form, state: OptionState, note?: string): LabelOption {
  return {
    key: `form:${f}`,
    label: formName(f),
    note: note ?? FORM_TEST[f],
    state,
    form: f,
  };
}

/** A run of words with no node over it yet: only "what is it?" can be asked. */
function spanPanel(state: BuildState, words: Word[], span: Span, scope: ChapterScope): Panel {
  const single = span[0] === span[1];
  const verdict = canWrap(state, words, span);
  const blocked = verdict.state === 'disabled' ? verdict.reason : undefined;

  // A one-word phrase is built OVER a labelled word, so the word class comes
  // first. This is the rule the old chooser expressed by silently doing
  // nothing when you picked `Noun phrase` on an unnamed word.
  const leaf = roots(state).find((id) => state.constituents[id]!.word === span[0]);
  const needsWordClass = single && !leaf ? `Name what ${quote(words, span)} is first.` : undefined;

  const existing = nodeOver(state, span);
  const chosenForm = existing ? state.constituents[existing]!.form : null;

  const evidence = new Map(suggest(words, span).map((s) => [s.form, s.evidence]));

  const build = (forms: readonly Form[], phrase: boolean): LabelOption[] =>
    forms.map((f) => {
      const answered = chosenForm !== null && forms.includes(chosenForm);
      if (!inScope(f, scope.forms)) return formOption(f, 'untaught', 'not taught yet');
      if (blocked) return formOption(f, 'blocked', blocked);
      if (phrase && needsWordClass) return formOption(f, 'blocked', needsWordClass);
      if (f === chosenForm) return formOption(f, 'chosen');
      // Evidence helps answer an open question. Once this group already has an
      // answer, promoting a conflicting heuristic makes the current label look
      // wrong even when it has just been confirmed by the grader.
      const why = answered ? undefined : evidence.get(f);
      return formOption(f, why ? 'suggested' : 'available', why);
    });

  const groups: OptionGroup[] = single
    ? [
        {
          id: 'word-class',
          question: `What is ${quote(words, span)}?`,
          notes: 'ondemand',
          options: build(WORD_FORMS, false),
        },
        {
          id: 'phrase-form',
          question: 'Or is it a one-word phrase?',
          notes: 'ondemand',
          options: build(
            PHRASE_FORMS.filter((f) => f !== 'S'),
            true,
          ),
        },
      ]
    : [
        {
          id: 'phrase-form',
          // A run of words is never a part of speech, so the word classes are
          // not merely disabled here — the question is a different one.
          question: `What is ${quote(words, span)}?`,
          notes: 'ondemand',
          options: build(PHRASE_FORMS, false),
        },
      ];

  return finish({
    subject: quote(words, span),
    // The open group's question already asks; a second line saying the same
    // thing in other words is chrome, not guidance.
    prompt: blocked ?? '',
    groups,
    ...(blocked ? { blocked } : {}),
  });
}

/**
 * An existing node. Its form can be revised, its function can be set, and if it
 * is a verb its type is a THIRD question — asked here as a third group rather
 * than as a hidden subtype, because it is a genuinely separate decision.
 */
function nodePanel(state: BuildState, words: Word[], id: string, scope: ChapterScope): Panel {
  const c = state.constituents[id];
  if (!c) return idlePanel(scope);

  const subject = quote(words, c.span);
  const isWord = c.word !== undefined;
  const evidence = new Map(suggest(words, c.span).map((s) => [s.form, s.evidence]));

  /**
   * Once a node is inside a group, changing what it IS would change what the
   * group is made of. Renaming a single word is safe — the word stays where it
   * is — but re-forming a phrase, or wrapping a word in a new one, is not.
   * So the option stays visible and says what to do instead.
   */
  const locked = c.parent !== null;
  const UNGROUP = 'Ungroup what it is inside before changing what it is.';

  const build = (forms: readonly Form[], phrase: boolean): LabelOption[] =>
    forms.map((f) => {
      const answered = forms.includes(c.form);
      if (!inScope(f, scope.forms)) return formOption(f, 'untaught', 'not taught yet');
      if (f === c.form) return formOption(f, 'chosen');
      if (locked && (phrase || !isWord)) return formOption(f, 'blocked', UNGROUP);
      const why = answered ? undefined : evidence.get(f);
      return formOption(f, why ? 'suggested' : 'available', why);
    });

  const verbType: OptionGroup = {
    id: 'verb-type',
    // A genuinely separate decision: first "is it a verb?", then "what kind?".
    // As a sibling group both stay readable — and because it sits directly
    // after the word class, it is the step a freshly-named verb lands on, which
    // is the order the course teaches.
    question: 'What kind of verb is it?',
    notes: 'always',
    options: VERB_TYPE_MENU.map((v) => ({
      key: `vt:${v.type}`,
      label: v.label,
      note: v.example,
      state: (c.verbType === v.type ? 'chosen' : 'available') as OptionState,
      verbType: v.type,
    })),
  };

  const groups: OptionGroup[] = isWord
    ? [
        {
          id: 'word-class',
          question: `What is ${subject}?`,
          notes: 'ondemand',
          options: build(WORD_FORMS, false),
        },
        ...(c.form === 'V' ? [verbType] : []),
        {
          id: 'phrase-form',
          question: 'Or is it a one-word phrase?',
          notes: 'ondemand',
          options: build(
            PHRASE_FORMS.filter((f) => f !== 'S'),
            true,
          ),
        },
      ]
    : [
        {
          id: 'phrase-form',
          question: `What is ${subject}?`,
          notes: 'ondemand',
          options: build(PHRASE_FORMS, false),
        },
      ];

  groups.push(functionGroup(state, id, subject, scope));

  return finish({
    subject,
    // The open group's question already asks; a second line saying the same
    // thing in other words is chrome, not guidance.
    prompt: c.parent === null && !isWord ? 'Group it with its neighbours to give it a job.' : '',
    groups,
  });
}

/**
 * The functions this node may take. Contingent on the parent, so this list IS
 * filtered — see rule 5 in the module note. `hidden` disappears, `disabled`
 * stays and shows why.
 */
function functionGroup(
  state: BuildState,
  id: string,
  subject: string,
  scope: ChapterScope,
): OptionGroup {
  const c = state.constituents[id]!;
  const current = c.function;

  const options: LabelOption[] = [];
  for (const fn of [...CLAUSE_FUNCTIONS, ...PHRASE_INTERNAL_FUNCTIONS]) {
    if (!inScope(fn, scope.functions)) continue;
    const verdict = hypothesisFor(state, id, fn);
    if (verdict.state === 'hidden') continue;
    options.push({
      key: `func:${fn}`,
      label: label(fn),
      note: verdict.state === 'disabled' ? verdict.reason : FUNCTION_TEST[fn],
      state:
        fn === current && (fn !== 'adverbial' || c.obligatory !== true)
          ? 'chosen'
          : verdict.state === 'disabled'
            ? 'blocked'
            : 'available',
      func: fn,
      ...(fn === 'adverbial' ? { obligatory: false } : {}),
    });

    if (fn === 'adverbial') {
      options.push({
        key: 'func:obligatoryAdverbial',
        label: 'obligatory adverbial',
        note:
          verdict.state === 'disabled'
            ? verdict.reason
            : 'The verb requires it to complete the sentence; removing it makes the clause incomplete.',
        state:
          current === 'adverbial' && c.obligatory === true
            ? 'chosen'
            : verdict.state === 'disabled'
              ? 'blocked'
              : 'available',
        func: 'adverbial',
        obligatory: true,
      });
    }
  }

  return { id: 'function', question: `What does ${subject} do?`, notes: 'always', options };
}

/**
 * Settle a panel: mark what each group has answered, choose the live one, and
 * hand out the number keys.
 *
 * Keys go to suggestions in the STEP group only. A key that reached a row
 * inside a collapsed group would be a shortcut to something invisible, which is
 * worse than no shortcut at all.
 */
function finish(draft: Omit<Panel, 'step' | 'suggested'>): Panel {
  const groups: OptionGroup[] = draft.groups.map((g) => ({
    ...g,
    answered: g.options.find((o) => o.state === 'chosen') ?? null,
  }));

  let step: string | null = null;
  for (const g of groups) {
    if (!g.answered && g.options.some(isPickable)) {
      step = g.id;
      break;
    }
  }
  // Everything settled: rest on the last group that can still be changed, so
  // revising the most recent decision costs nothing.
  if (!step) {
    for (let i = groups.length - 1; i >= 0; i--) {
      if (groups[i]!.options.some(isPickable)) {
        step = groups[i]!.id;
        break;
      }
    }
  }
  step ??= groups[0]?.id ?? null;

  let n = 0;
  const keyed = groups.map((g) =>
    g.id !== step
      ? g
      : {
          ...g,
          options: g.options.map((o) =>
            o.state === 'suggested' && n < 9 ? { ...o, hotkey: String(++n) } : o,
          ),
        },
  );

  return { ...draft, groups: keyed, step, suggested: n };
}

/* ---------------------------------------------------------------- filter */

/**
 * Ranked, not merely filtered, and the reason is concrete: "transitive" is a
 * substring of "intransitive", so plain substring matching put the cursor on
 * the OPPOSITE verb type from the one the learner typed.
 */
const score = (o: LabelOption, q: string): number => {
  const l = o.label.toLowerCase();
  if (l.startsWith(q)) return 0;
  if (l.split(/\s+/).some((w) => w.startsWith(q))) return 1;
  if (l.includes(q)) return 2;
  if ((o.note ?? '').toLowerCase().includes(q)) return 3;
  if (o.key.toLowerCase().includes(q)) return 4;
  return Infinity;
};

/** Filtering is the one thing allowed to reorder: the learner asked for it. */
export function filterPanel(panel: Panel, query: string): Panel {
  const q = query.trim().toLowerCase();
  if (!q) return panel;
  const groups = panel.groups
    .map((g) => ({
      ...g,
      options: g.options
        .map((o, i) => ({ o, i, s: score(o, q) }))
        .filter((x) => x.s !== Infinity)
        .sort((a, b) => a.s - b.s || a.i - b.i)
        .map((x) => ({ ...x.o, rank: x.s })),
    }))
    .filter((g) => g.options.length > 0);
  return { ...panel, groups };
}

/** Every option a click or key may act on, in visual order. */
export function pickable(panel: Panel): LabelOption[] {
  return panel.groups.flatMap((g) => g.options.filter(isPickable));
}

/** Index into `pickable()` of the best match — where the cursor belongs. */
export function bestIndex(options: LabelOption[]): number {
  let best = -1;
  let bestRank = Infinity;
  for (let i = 0; i < options.length; i++) {
    const r = options[i]!.rank ?? Infinity;
    if (best === -1 && r === Infinity) best = i;
    if (r < bestRank) {
      bestRank = r;
      best = i;
    }
  }
  return Math.max(0, best);
}

/** The option a number key selects. */
export function byHotkey(panel: Panel, key: string): LabelOption | null {
  for (const g of panel.groups) {
    for (const o of g.options) if (o.hotkey === key) return o;
  }
  return null;
}
