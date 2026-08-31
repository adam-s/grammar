/**
 * What the contextual label palette offers.
 *
 * ## A stable taxonomy inside a contextual surface
 *
 * The palette moves with the selection, but the taxonomy inside it must not
 * move. Its rules are therefore stability rules first.
 *
 *   1. **A group's inventory is complete and its order stays stable while the
 *      learner works.** All thirteen word classes are always present. The menu
 *      presents them by their frequency in the course corpus; evidence changes
 *      an option's STATE, not its seat.
 *
 *   2. **Which GROUPS show follows the shape of the selection**, which is the
 *      one thing the learner can see for themselves: one word asks "what is
 *      this word?", a run of words asks "what is this phrase?", an existing
 *      node also asks "and what does it do?".
 *
 *   3. **Suggestions keep their taxonomy seat.** Evidence may rank a row and
 *      give it a number key; it never moves it. See the note below on who
 *      actually sees that ranking.
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
 *
 * ## This is the analysis, not the menu
 *
 * Everything here is the truthful account of a selection: what is suggested,
 * what is blocked and why, what a lesson has not reached yet. The LEARNER is
 * shown a projection of it — `quizView` in `session.ts` — which makes every
 * row a plain choice and strips the evidence, the ranks and the number keys,
 * because a menu that points at the answer is not an exercise. Read
 * `README.md` under "The palette is a quiz, not an answer key" before
 * restoring anything that looks missing on screen.
 */
import {
  anchorsFor,
  canStackOver,
  canWrap,
  containerFor,
  gappableSlots,
  hypothesisFor,
  nodeOver,
  type BuildState,
  type Span,
} from './builder.ts';
import { verbs } from './clause.ts';
import { formEvidence } from './evidence.ts';
import { CLAUSE_KINDS } from './node-variants.ts';
import { FUSIONS, HEAD_FORMS, plainlyHeads } from './rules.ts';
import { VERB_TYPE_MENU, hasPassive } from './rules.ts';
import { suggest } from './suggest.ts';
import { cleft, passiveFor, performed, type Demonstration } from './transform.ts';
import { FORM_TEST, FUNCTION_TEST, auxKindName, formName, label } from './names.ts';
import {
  CLAUSE_FUNCTIONS,
  PHRASE_FORMS,
  PHRASE_INTERNAL_FUNCTIONS,
  WORD_FORMS,
  isWordForm,
  type Form,
  type Func,
  AUX_KINDS,
  type AuxKind,
  type ClauseKind,
  type Finiteness,
  type PartKind,
  type VerbType,
  type Voice,
  type Word,
  contentSpan,
} from './types.ts';
import { joinWords } from './types.ts';

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
  panel.groups.every(
    (group) => group.optional || group.answered || !group.options.some(isPickable),
  );

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
  // Ask again which group is open. A refusal can take a group's last takeable
  // row, and the step chosen before the refusal would then point at a question
  // with nothing left to answer it.
  return { ...panel, ...withStep(groups) };
}

/**
 * What state a question is in, and why the palette treats it the way it does.
 *
 * `required` has a live choice; `offer` can be left untaken for ever;
 * `deferred` cannot be answered until larger structure exists; `settled` has
 * its answer, or provably has none to give. A sole correct answer is still a
 * required choice: the learner must choose it.
 */
export type QuestionRole = 'required' | 'offer' | 'deferred' | 'settled';

/** A question the readings have closed: which one, in which sense, and why. */
export interface GroupClosure {
  group: string;
  kind: 'settled' | 'deferred';
  reason: string;
}

/**
 * Make questions the readings have closed non-blocking — and say so.
 *
 * The closure is recorded on the group, not merely applied to it. `optional`
 * still carries the behaviour (the panel can finish with the group untouched),
 * but a reader of the panel can now tell an offer nobody has to take from a
 * question that is premature and from one with no answer to give. Those states
 * used to share one silent boolean, which is what made them undebuggable.
 */
export function closeSettledGroups(panel: Panel, closures: readonly GroupClosure[]): Panel {
  if (closures.length === 0) return panel;
  const byId = new Map(closures.map((c) => [c.group, c]));
  const groups = panel.groups.map((group) => {
    const closure = byId.get(group.id);
    // An answered question is settled by its answer; the readings do not
    // get to recolour what the learner has already established.
    if (!closure || group.answered) return group;
    return {
      ...group,
      optional: true,
      role: closure.kind,
      roleReason: closure.reason,
      // A closed question has no truthful move at this stage. Leaving a
      // structurally plausible row clickable let the learner choose “head”
      // for an NP whose real complement job arrives only after its PP exists.
      options: group.options.map((option) => ({
        ...option,
        state: 'blocked' as const,
        note: closure.reason,
      })),
    };
  });
  return { ...panel, ...withStep(groups) };
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
  voice?: Voice;
  partKind?: PartKind;
  auxKind?: AuxKind;
  finiteness?: Finiteness;
  clauseKind?: ClauseKind;
  /**
   * This row puts a NEW node over the selection instead of renaming it. The two
   * moves look identical from the outside — same words, same form list — so the
   * row has to carry which one it is.
   */
  stack?: true;
  /** This row builds an empty slot rather than labelling something on screen. */
  gap?: true;
  /** This row says what a tail phrase belongs to. The id of the phrase it names. */
  anchor?: string;
  /** This row says the node does two jobs at once. The other job it names. */
  fusedWith?: Func;
  /**
   * Which question this row is an answer to.
   *
   * A word carries two forms stacked — the class and the one-word phrase over
   * it — so "wrong" has two different right answers and the useful one is the
   * one the open group asked for.
   */
  level?: 'word' | 'phrase';
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
  /**
   * An offer rather than a question: the panel counts as finished with this
   * group untouched. Without it, a group nobody is expected to answer would
   * hold the palette open for ever.
   */
  optional?: boolean;
  /** The option already picked here, if any. A group with one is settled. */
  answered?: LabelOption | null;
  /**
   * The question's state, as far as this panel can know it. `finish` assigns
   * `settled`, `offer` or `required`; `closeSettledGroups` overlays what the
   * readings prove.
   */
  role?: QuestionRole;
  /** Why the role is what it is, where the default wording would not say. */
  roleReason?: string;
}

export interface Panel {
  /** The words under the selection, quoted. Empty when nothing is selected. */
  subject: string;
  /**
   * The selection, singled out in a sentence of its own.
   *
   * Every other note here tells the learner a test. This one performs one:
   * *It was the old red engine that she repaired* works, and *It was repaired
   * the old that she red engine* does not, and the difference is audible
   * without anybody grading it. The cleft, of the three available, because it
   * is the sharpest — only one thing fits between *it was* and *that*.
   *
   * Null for a single word, which is the whole of when this is worth showing:
   * the test proves a RUN is one thing, and one word needs no proving.
   *
   * For a run sitting after the verb it is the PASSIVE instead, because that is
   * the sharper question there: not "is this one thing" but "is this what the
   * verb acted on", which is Morenberg's test and the one the course is built
   * around.
   */
  singledOut: Demonstration | null;
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
  /**
   * Editing commands, rendered apart from the grammatical options. An action
   * changes the current analysis; it does not classify the selection, so it
   * is never a `LabelOption` and never graded. Two sources: a selected node
   * offers to ungroup itself, and a structural refusal that knows which
   * group is in the way offers to remove it.
   */
  actions?: PanelAction[];
}

/** An editing command the palette renders apart from the grammatical options. */
export interface PanelAction {
  kind: 'unwrap';
  nodeId: string;
  /** The button's whole name: the operation and the words it affects. */
  label: string;
}

/**
 * Which decisions a lesson has taught: the set of rows a learner may pick.
 *
 * `undefined` means every row, which is the free workspace.
 *
 * This began as one list of forms, then grew a second for functions, and was
 * about to grow four more for finiteness, voice, particle kind and auxiliary
 * kind — because the course introduces every one of those at its own lesson.
 * Six parallel lists is six places to forget. A palette row already knows what
 * decision it is an answer to, so the scope is a set of those and the gate is
 * one pass over the finished panel rather than a check at every place a row is
 * built.
 */
export type ChapterScope = ReadonlySet<string> | undefined;

/**
 * The taught decision this row answers, or null if it is not one.
 *
 * Read off the row's own typed fields rather than parsed out of its key, so a
 * key format change cannot silently open the gate. Gaps and anchors are
 * structural — they say where something is missing or what it points at, not
 * what anything is called — so no lesson teaches them and no lesson withholds
 * them.
 */
export function decisionOf(o: LabelOption): string | null {
  // Structural moves are decisions too. These three used to return `null`,
  // which meant no lesson could say when they were first taught while the
  // palette went on offering them: a learner met the empty slot in lesson 31's
  // relative clauses with nothing in the ladder admitting it had arrived.
  if (o.gap) return 'gap';
  if (o.anchor !== undefined) return 'anchor';
  // Before `func`, because a fused row carries both and the interesting half is
  // the second job. `func:head` would have said the learner was answering the
  // ordinary head question.
  if (o.fusedWith !== undefined) return `fuse:${o.fusedWith}`;
  if (o.form !== undefined) return `form:${o.form}`;
  if (o.verbType !== undefined) return `vt:${o.verbType}`;
  if (o.clauseKind !== undefined) return `kind:${o.clauseKind}`;
  if (o.finiteness !== undefined) return `fin:${o.finiteness}`;
  if (o.voice !== undefined) return `voice:${o.voice}`;
  if (o.partKind !== undefined) return `part:${o.partKind}`;
  if (o.auxKind !== undefined) return `aux:${o.auxKind}`;
  if (o.func !== undefined) return `func:${o.func}`;
  return null;
}

export type Selection =
  | { kind: 'none' }
  | { kind: 'span'; span: Span }
  | { kind: 'node'; id: string }
  | { kind: 'nodes'; ids: string[]; span: Span };

/* ------------------------------------------------------------------ util */

/**
 * The ungroup command for one node: remove its boundary, keep what it
 * contains. Not offered for a gap — a gap has no boundary around words, and
 * "ungrouping" one would silently discard the slot itself.
 */
function unwrapAction(state: BuildState, words: Word[], id: string): PanelAction | null {
  const c = state.constituents[id];
  if (!c || c.gap) return null;
  return { kind: 'unwrap', nodeId: id, label: `Ungroup ${quote(words, c.span)}` };
}

const quote = (words: Word[], span: Span): string =>
  `“${joinWords(words.slice(span[0], span[1] + 1))}”`;

/* ---------------------------------------------------------------- panels */

export function optionsFor(
  state: BuildState,
  words: Word[],
  sel: Selection,
  scope?: ChapterScope,
): Panel {
  const grammaticalSpan =
    sel.kind === 'span' || sel.kind === 'nodes' ? contentSpan(words, sel.span) : null;
  switch (sel.kind) {
    case 'none':
      return idlePanel(scope);
    case 'span':
      return grammaticalSpan
        ? spanPanel(state, words, grammaticalSpan, scope, true)
        : punctuationPanel(words, sel.span, scope);
    case 'node':
      return nodePanel(state, words, sel.id, scope);
    case 'nodes':
      return grammaticalSpan
        ? spanPanel(state, words, grammaticalSpan, scope)
        : punctuationPanel(words, sel.span, scope);
  }
}

/**
 * A selection with no grammar in it — a comma, a full stop, or a run of them.
 *
 * The idle panel used to stand in here, which answered a question nobody had
 * asked: it named no subject and gave no reason, so a learner who managed to
 * select a mark was shown an empty menu that looked broken. This says what was
 * selected and why nothing labels it, which is the same thing `canWrap` says
 * about a mark it is asked to wrap.
 */
function punctuationPanel(words: Word[], span: Span, scope: ChapterScope): Panel {
  const reason = 'Punctuation marks the sentence; it is not one of the parts it is built from.';
  // `idle` rather than `blocked`: there is no question here to get wrong. A
  // blocked row is one the learner may still try and be told about, and the
  // quiz projection rightly makes those takeable — but no label can ever
  // apply to a mark, so trying one would be a click that does nothing.
  const build = (forms: readonly Form[]): LabelOption[] =>
    forms.map((f) => formOption(f, 'idle', reason));
  return finish(
    {
      subject: quote(words, span),
      singledOut: null,
      prompt: reason,
      blocked: reason,
      groups: [
        {
          id: 'word-class',
          question: `What is ${quote(words, span)}?`,
          notes: 'ondemand',
          options: build(WORD_FORMS),
        },
        {
          id: 'phrase-form',
          question: 'Or is it a one-word phrase?',
          notes: 'ondemand',
          options: build(PHRASE_FORMS.filter((f) => f !== 'S')),
        },
      ],
    },
    scope,
  );
}

/**
 * Nothing selected. This remains a complete model for tests and alternate
 * renderers; the contextual palette itself stays closed until there is an anchor.
 */
function idlePanel(scope: ChapterScope): Panel {
  return finish(
    {
      subject: '',
      singledOut: null,
      prompt: 'Select a word, or drag across a run of words.',
      groups: [
        {
          id: 'word-class',
          question: 'What is a word?',
          notes: 'ondemand',
          options: WORD_FORMS.map((f) => formOption(f, 'idle')),
        },
        {
          id: 'phrase-form',
          question: 'What is a run of words?',
          notes: 'ondemand',
          options: PHRASE_FORMS.map((f) => formOption(f, 'idle')),
        },
      ],
    },
    scope,
  );
}

function formOption(f: Form, state: OptionState, note?: string): LabelOption {
  return {
    key: `form:${f}`,
    label: formName(f),
    note: note ?? FORM_TEST[f],
    state,
    form: f,
    // Which question this row answers, so a wrong answer is corrected at the
    // level it was given. `isWordForm` rather than the group it happens to sit
    // in, because the two form groups are built by the same helper and the row
    // itself is what carries the claim.
    level: isWordForm(f) ? 'word' : 'phrase',
  };
}

/**
 * The phrases a single word can stand alone as. `S` is not among them: a whole
 * sentence is never one word wide in this course.
 */
const ONE_WORD_PHRASES: readonly Form[] = PHRASE_FORMS.filter((f) => f !== 'S');

/** A run of words with no node over it yet: only "what is it?" can be asked. */
function spanPanel(
  state: BuildState,
  words: Word[],
  span: Span,
  scope: ChapterScope,
  buildsInside = false,
): Panel {
  const single = span[0] === span[1];
  const verdict = canWrap(state, words, span);
  const blocked = verdict.state === 'disabled' ? verdict.reason : undefined;
  // A structural refusal that names its obstacle also offers the repair:
  // the same ungroup command a selected node exposes, aimed at the group in
  // the way. The learner still makes the grammatical decision afterwards.
  const repair =
    verdict.state === 'disabled' && verdict.repair
      ? unwrapAction(state, words, verdict.repair.nodeId)
      : null;

  const existing = nodeOver(state, span);
  const chosenForm = existing ? state.constituents[existing]!.form : null;
  const container = buildsInside ? containerFor(state, span) : null;

  // Availability first, evidence second: `build` below refuses a blocked row
  // before it ever looks at this map, so ranking cannot resurrect a move the
  // structural rules turned away. The strength ladder is evidence.ts's law.
  const evidence = new Map(formEvidence(state, words, span).map((s) => [s.form, s]));

  const build = (forms: readonly Form[]): LabelOption[] =>
    forms.map((f) => {
      const answered = chosenForm !== null && forms.includes(chosenForm);
      if (blocked) return formOption(f, 'blocked', blocked);
      if (f === chosenForm) return formOption(f, 'chosen');
      // Evidence helps answer an open question. Once this group already has an
      // answer, promoting a conflicting heuristic makes the current label look
      // wrong even when it has just been confirmed by the grader.
      const why = answered ? undefined : evidence.get(f);
      return {
        ...formOption(f, why ? 'suggested' : 'available', why?.evidence),
        ...(why ? { rank: why.rank } : {}),
      };
    });

  const groups: OptionGroup[] = single
    ? [
        {
          id: 'word-class',
          question: `What is ${quote(words, span)}?`,
          notes: 'ondemand',
          options: build(WORD_FORMS),
        },
        {
          id: 'phrase-form',
          question: 'Or is it a one-word phrase?',
          notes: 'ondemand',
          options: build(PHRASE_FORMS.filter((f) => f !== 'S')),
        },
      ]
    : [
        {
          id: 'phrase-form',
          // A run of words is never a part of speech, so the word classes are
          // not merely disabled here — the question is a different one.
          question: `What is ${quote(words, span)}?`,
          notes: 'ondemand',
          options: build(PHRASE_FORMS),
        },
      ];

  return finish(
    {
      subject: quote(words, span),
      singledOut: demonstrationFor(state, words, span),
      // The open group's question already asks; a second line saying the same
      // thing in other words is chrome, not guidance.
      prompt:
        blocked ??
        (container
          ? `Building inside the ${formName(state.constituents[container]!.form).toLowerCase()} that contains these words. It will stay in place.`
          : ''),
      groups,
      ...(blocked ? { blocked } : {}),
      ...(repair ? { actions: [repair] } : {}),
    },
    scope,
  );
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
  const evidence = new Map(suggest(words, c.span).map((s) => [s.form, s]));

  /**
   * Once a node is inside a group, changing what it IS would change what the
   * group is made of. Renaming a single word is safe — the word stays where it
   * is — but re-forming a phrase, or wrapping a word in a new one, is not.
   * So the option stays visible and says what to do instead.
   */
  const locked = c.parent !== null;
  const UNGROUP = 'Ungroup what it is inside before changing what it is.';

  /** Has the course reached this label yet? Everything, outside a lesson. */
  const taught = (f: Form): boolean => !scope || scope.has(`form:${f}`);

  const build = (forms: readonly Form[], phrase: boolean): LabelOption[] =>
    forms.map((f) => {
      const answered = forms.includes(c.form);
      if (f === c.form) return formOption(f, 'chosen');
      if (locked && (phrase || !isWord)) return formOption(f, 'blocked', UNGROUP);
      // A known word class is evidence about the phrase it can head, not
      // permission to reveal the answer. Keep every one-word phrase hypothesis
      // actionable; the grader explains a miss and the session then disables
      // only that attempted row. Structural locks still apply above because a
      // word already inside a phrase cannot be wrapped without changing its
      // parent's children.
      const why = answered ? undefined : evidence.get(f);
      return {
        ...formOption(f, why ? 'suggested' : 'available', why?.evidence),
        ...(why ? { rank: why.rank } : {}),
      };
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

  /**
   * Active or passive. Shown for every verb, because the group's inventory is
   * fixed even when half of it is unavailable — a learner who never sees the
   * passive row does not learn that the choice exists.
   *
   * Neither row is chosen until the learner answers. An omitted voice still
   * means active when a finished tree is read, but omission in a work in
   * progress means this question has not been answered yet.
   */
  const voice: OptionGroup = {
    id: 'voice',
    question: 'Who is doing it?',
    notes: 'always',
    options: [
      {
        key: 'voice:active',
        label: 'active',
        note: 'the subject does it — “The mechanic repaired the engine”',
        state: (c.voice === 'active' ? 'chosen' : 'available') as OptionState,
        voice: 'active' as Voice,
      },
      {
        key: 'voice:passive',
        label: 'passive',
        note:
          c.verbType == null
            ? 'Classify the verb first — only a verb with an object has a passive.'
            : !hasPassive(c.verbType)
              ? 'This verb has no object to move into the subject, so it has no passive.'
              : 'the subject has it done to it — “The engine was repaired”',
        state: (c.verbType != null && hasPassive(c.verbType)
          ? c.voice === 'passive'
            ? 'chosen'
            : 'available'
          : 'blocked') as OptionState,
        voice: 'passive' as Voice,
      },
    ],
  };

  /**
   * The two kinds of `Part`. Neither is the default, because neither is
   * commoner and guessing for the learner would hide the distinction the group
   * exists to teach.
   */
  const partKind: OptionGroup = {
    id: 'part-kind',
    question: 'Which kind of particle?',
    notes: 'always',
    options: [
      {
        key: 'part:infinitival',
        label: 'infinitival “to”',
        note: 'marks a verb with no tense — “wanted TO leave”',
        state: (c.partKind === 'infinitival' ? 'chosen' : 'available') as OptionState,
        partKind: 'infinitival' as PartKind,
      },
      {
        key: 'part:verbal',
        label: 'verbal particle',
        note: 'belongs to the verb, and takes no object — “looked UP the number”',
        state: (c.partKind === 'verbal' ? 'chosen' : 'available') as OptionState,
        partKind: 'verbal' as PartKind,
      },
    ],
  };

  /**
   * Which of the five jobs a helping verb is doing.
   *
   * *was repairing* and *was repaired* differ in nothing but this, so it is a
   * real question with a formal test rather than a label to memorise.
   */
  const auxKind: OptionGroup = {
    id: 'aux-kind',
    question: 'What is it helping with?',
    notes: 'always',
    options: AUX_KINDS.map((value) => ({
      key: `aux:${value}`,
      label: auxKindName(value),
      note: AUX_KIND_NOTE[value],
      state: (c.auxKind === value ? 'chosen' : 'available') as OptionState,
      auxKind: value,
    })),
  };

  /**
   * What job an embedded clause is doing. Not asked of the sentence itself,
   * which is not embedded in anything and so does not have a kind.
   */
  const clauseKind: OptionGroup = {
    // What kind of clause this is follows from the job it does — a coordinate
    // clause has no kind at all. Until the job is set, every kind on offer may
    // be wrong, so the group is an offer rather than a question.
    ...(c.function === null ? { optional: true } : {}),
    id: 'clause-kind',
    question: 'What kind of clause is it?',
    notes: 'always',
    // Derived from the enum, not written out. A hardcoded list here silently
    // stopped offering `interrogative` the moment the enum grew, which is the
    // exact failure the "inventory is complete" rule at the top exists to
    // prevent — and it was found by a fixture, not by reading this.
    options: CLAUSE_KINDS.map((value) => ({
      key: `kind:${value}`,
      label: value === 'interrogative' ? 'question' : value,
      note: CLAUSE_KIND_NOTE[value],
      state: (c.clauseKind === value ? 'chosen' : 'available') as OptionState,
      clauseKind: value,
    })),
  };

  /**
   * What verb form the clause has. A separate axis from what kind of clause
   * it is, so it is a separate group. Neither row is chosen until the
   * learner answers: an omitted finiteness still reads as finite in a
   * FINISHED tree, but omission in a work in progress means the question
   * has not been answered yet.
   */
  const finiteness: OptionGroup = {
    id: 'finiteness',
    question: 'What shape is its verb in?',
    notes: 'always',
    options: (
      [
        ['finite', 'finite', 'it changes for tense — “the belt BROKE”'],
        ['infinitival', 'infinitival', 'the plain form after “to” — “to LEAVE”'],
        ['participial', 'participial', 'an -ed or -en form — “REPAIRED last week”'],
        ['gerund-participial', '-ing', 'an -ing form — “LEAVING the engine”'],
      ] as const
    ).map(([value, label, note]) => ({
      key: `fin:${value}`,
      label,
      note,
      state: (c.finiteness === value ? 'chosen' : 'available') as OptionState,
      finiteness: value as Finiteness,
    })),
  };

  /**
   * Putting a second layer over the same words.
   *
   * Renaming and stacking are different things that look the same: both are a
   * phrase form picked on a run of words already covered by a node. The menu
   * used to guess from the form — clause over phrase meant stack, anything else
   * meant rename — which was right for the two cases it knew and wrong for
   * *old cars*, where an `NP` goes over a `Nom` on the same words.
   *
   * So it asks instead. A second group, only where a second layer is possible.
   */
  const stack: OptionGroup = {
    id: 'stack',
    question: `Or is ${subject} inside something bigger?`,
    notes: 'ondemand',
    // An offer, not a question. Every other group has to be answered before
    // the palette will close, because leaving one open means the learner has
    // not finished. A second layer over the same words is rare enough that
    // holding the palette open waiting for one would be nagging.
    optional: true,
    options: PHRASE_FORMS.map((f) => {
      const same = f === c.form;
      return {
        ...formOption(
          f,
          same ? 'blocked' : 'available',
          same ? 'A node cannot go inside another of the same kind.' : FORM_TEST[f],
        ),
        key: `stack:${f}`,
        stack: true as const,
      };
    }),
  };

  /**
   * Slots the sentence leaves empty.
   *
   * Everything else in the palette labels something the learner can point at.
   * A gap has nothing to point at — that is what makes it a gap — so it is
   * asked of the node that would hold it instead, and only for slots the verb
   * licenses and nothing has filled.
   *
   * Optional, like stacking: most clauses have no gap, and holding the palette
   * open until someone says so would be nagging.
   */
  const slots = gappableSlots(state, id);
  const gaps: OptionGroup = {
    id: 'gap',
    question: 'Is a piece of it missing?',
    notes: 'always',
    optional: true,
    options: slots.map((slot) => ({
      key: `gap:${slot.fn}:${slot.form}`,
      label: slot.elided
        ? `the ${formName(slot.form).toLowerCase()}, left unsaid`
        : `${label(slot.fn)}, with no words`,
      note: slot.elided
        ? 'It was said once already, and English does not say it twice.'
        : 'The verb requires it and the sentence never says it — a reader supplies it.',
      state: 'available' as OptionState,
      func: slot.fn,
      form: slot.form,
      gap: true as const,
    })),
  };

  /**
   * What a tail phrase belongs to.
   *
   * A real choice, unlike the filler-gap link: *A man came in who I knew* would
   * mean something else if the relative belonged to a different phrase, so the
   * clause's other phrases are listed and one is picked.
   */
  const anchors = anchorsFor(state, id);
  const copies = c.gap === true && c.function === 'head';
  const anchor: OptionGroup = {
    id: 'anchor',
    question: copies ? 'What does it repeat?' : `What does ${subject} belong to?`,
    notes: 'always',
    options: anchors.map((candidate) => {
      const target = state.constituents[candidate]!;
      return {
        key: `anchor:${target.form}:${target.span[0]}-${target.span[1]}`,
        label: quote(words, target.span),
        note: copies
          ? `It says ${quote(words, target.span)} again without saying it.`
          : `It moved to the end off ${quote(words, target.span)}.`,
        state: (c.index !== undefined && target.index === c.index
          ? 'chosen'
          : 'available') as OptionState,
        anchor: candidate,
      };
    }),
  };

  const groups: OptionGroup[] = isWord
    ? [
        {
          id: 'word-class',
          question: `What is ${subject}?`,
          notes: 'ondemand',
          options: build(WORD_FORMS, false),
        },
        ...(c.form === 'V' ? [verbType, voice] : []),
        ...(c.form === 'Part' ? [partKind] : []),
        ...(c.form === 'Aux' ? [auxKind] : []),
        {
          id: 'phrase-form',
          question: 'Or is it a one-word phrase?',
          notes: 'ondemand',
          // A question where the word could head one of these phrases, and an
          // offer where it could not. A determiner heads nothing the learner has
          // met, so holding the palette open on it parked someone who had just
          // answered correctly in front of a list with no right answer in it.
          // The rows stay, because fusion is real and reachable from here.
          optional: !plainlyHeads(c.form, ONE_WORD_PHRASES, taught),
          // No "no" for a word already inside a phrase: the structure has
          // answered the question, and the rows above say so with `UNGROUP`.
          options: build(ONE_WORD_PHRASES, true),
        },
      ]
    : [
        {
          id: 'phrase-form',
          question: `What is ${subject}?`,
          notes: 'ondemand',
          options: build(PHRASE_FORMS, false),
        },
        ...(canStackOver(c) ? [stack] : []),
        // A coordinated clause has no kind. It is not relative, nominal,
        // adverbial or comparative — it is an equal partner joined to another
        // clause, which is what `coordinate` already says. Asking anyway left
        // the question permanently open with no right answer: every one of
        // lesson 33's and lesson 39's clauses could be built correctly and
        // never finish.
        ...(c.form === 'Cl' && c.function !== 'coordinate' ? [clauseKind] : []),
        ...(c.form === 'S' || c.form === 'Cl' ? [finiteness] : []),
      ];

  groups.push(functionGroup(state, id, subject));
  if (anchor.options.length > 0) groups.push(anchor);
  if (gaps.options.length > 0) groups.push(gaps);

  // The node's own editing command: remove this boundary, keep its contents.
  // An action, not an answer — it changes the analysis instead of
  // classifying the selection, so it lives beside the groups, never in them.
  const editing = unwrapAction(state, words, id);

  return finish(
    {
      subject,
      singledOut: demonstrationFor(state, words, c.span),
      // The open group's question already asks; a second line saying the same
      // thing in other words is chrome, not guidance.
      prompt: c.parent === null && !isWord ? 'Group it with its neighbours to give it a job.' : '',
      groups,
      ...(editing ? { actions: [editing] } : {}),
    },
    scope,
  );
}

/**
 * The functions this node may take. Contingent on the parent, so this list IS
 * filtered — see rule 5 in the module note. `hidden` disappears, `disabled`
 * stays and shows why.
 */
/**
 * Every function row the menu can hold, in taxonomy order.
 *
 * The obligatory adverbial rides directly behind the plain one: it is a second
 * claim about the same function — that the verb REQUIRES it — so it is a row
 * of its own rather than a separate group.
 *
 * Exported because the learner boundary restores the rows the structural
 * palette leaves out, and building that list a second time is how a function
 * added here goes missing there.
 */
export interface FunctionRow {
  key: string;
  func: Func;
  label: string;
  note: string;
  /** Set only on the two adverbial rows, which differ by nothing else. */
  obligatory?: boolean;
}

const OBLIGATORY_NOTE =
  'The verb requires it to complete the sentence; removing it makes the clause incomplete.';

export const FUNCTION_ROWS: readonly FunctionRow[] = [
  ...CLAUSE_FUNCTIONS,
  ...PHRASE_INTERNAL_FUNCTIONS,
].flatMap((fn): FunctionRow[] =>
  fn === 'adverbial'
    ? [
        {
          key: `func:${fn}`,
          func: fn,
          label: label(fn),
          note: FUNCTION_TEST[fn],
          obligatory: false,
        },
        {
          key: 'func:obligatoryAdverbial',
          func: fn as Func,
          label: 'obligatory adverbial',
          note: OBLIGATORY_NOTE,
          obligatory: true,
        },
      ]
    : [{ key: `func:${fn}`, func: fn, label: label(fn), note: FUNCTION_TEST[fn] }],
);

function functionGroup(state: BuildState, id: string, subject: string): OptionGroup {
  const c = state.constituents[id]!;
  const current = c.function;

  const options: LabelOption[] = [];
  for (const row of FUNCTION_ROWS) {
    const verdict = hypothesisFor(state, id, row.func);
    if (verdict.state === 'hidden') continue;
    // The two adverbial rows differ only in whether the verb requires it, so
    // that is what tells them apart when one of them is the answer already.
    const chosen = row.func === current && (row.obligatory ?? false) === (c.obligatory === true);
    options.push({
      key: row.key,
      label: row.label,
      note: verdict.state === 'disabled' ? verdict.reason : row.note,
      state: chosen ? 'chosen' : verdict.state === 'disabled' ? 'blocked' : 'available',
      func: row.func,
      ...(row.obligatory === undefined ? {} : { obligatory: row.obligatory }),
    });
  }

  // One word doing two jobs. Offered only where English actually does it, and
  // only where the node could not have headed the phrase on its own — a noun
  // heading a noun phrase is the head and nothing more.
  const parent = c.parent ? state.constituents[c.parent] : null;
  const fusedWith = parent ? FUSIONS[parent.form]?.[c.form] : undefined;
  if (fusedWith && !(HEAD_FORMS[parent!.form] ?? []).includes(c.form)) {
    options.push({
      key: `func:head+${fusedWith}`,
      label: `${label(fusedWith)} and head at once`,
      note: `There is no noun for it to be the ${label(fusedWith)} of, so it is both.`,
      state: (c.fusedWith === fusedWith ? 'chosen' : 'available') as OptionState,
      func: 'head',
      fusedWith,
    });
  }

  return { id: 'function', question: `What does ${subject} do?`, notes: 'always', options };
}

/** The formal test for each auxiliary job. */
const AUX_KIND_NOTE: Record<AuxKind, string> = {
  modal: 'a bare verb follows, and it never takes -s — “will LEAVE”',
  perfect: '“have” plus an -ed or -en verb — “has LEFT”',
  progressive: '“be” plus an -ing verb — “is LEAVING”',
  passive: '“be” plus an -ed or -en verb, and the subject has it done to it',
  do: '“do” standing in so a question or a negative has something to move',
};

/**
 * The test to perform on this run of words.
 *
 * The passive where it applies, because after the verb the live question is
 * what the verb acted on. The cleft otherwise, because before the verb the live
 * question is whether these words are one thing at all.
 *
 * Nothing for a single word: both tests prove something about a RUN.
 */
function demonstrationFor(state: BuildState, words: Word[], span: Span): Demonstration | null {
  if (span[0] === span[1]) return null;
  // `verbs` names nodes; the transform needs word positions.
  const at = verbs(state.constituents).map((id) => state.constituents[id]!.span[0]);
  const turned = passiveFor(words, at, span);
  if (performed(turned)) return turned;
  return cleft(words, span);
}

/** What each clause kind does, in the learner's language. */
const CLAUSE_KIND_NOTE: Record<ClauseKind, string> = {
  relative: 'it modifies a noun — “the belt THAT BROKE”',
  nominal: 'it stands where a noun phrase could — “that he left”',
  interrogative: 'it asks, or names what was asked — “what she repaired”',
  exclamative: 'it exclaims — “how tall he is”',
  adverbial: 'it says how, when, or why — “because the belt broke”',
  comparative: 'it completes a comparison — “than she expected”',
};

/**
 * Settle a panel: mark what each group has answered, choose the live one, and
 * hand out the number keys.
 *
 * Keys go to suggestions in the STEP group only. A key that reached a row
 * inside a collapsed group would be a shortcut to something invisible, which is
 * worse than no shortcut at all.
 */
/**
 * Mark every row the lesson has not reached.
 *
 * Applied to the finished panel and nowhere else, so a group added later is
 * gated without anyone remembering to gate it. It runs before the open step and
 * the number keys are decided, or a lesson would hand out a hotkey for a row it
 * will not accept.
 *
 * The whole inventory stays on screen. A learner who never sees a row does not
 * learn that the choice exists; what changes is that a row from a later lesson
 * says so instead of being offered.
 */
function withhold(groups: OptionGroup[], scope: ChapterScope): OptionGroup[] {
  if (!scope) return groups;
  return groups.map((g) => ({
    ...g,
    options: g.options.map((o) => {
      const decision = decisionOf(o);
      if (decision === null || scope.has(decision)) return o;
      // A row already applied to the node stays chosen — a palette that
      // called a given answer untaught would be denying what is on the
      // screen.
      if (o.state === 'chosen') return o;
      return { ...o, state: 'untaught' as OptionState, note: 'not taught yet' };
    }),
  }));
}

/**
 * Which group the palette opens on, and the number keys that go with it.
 *
 * Separated from `finish` because the step is not settled once. A refusal
 * blocks the row it refused, and the group the palette was resting on can lose
 * its last takeable answer — a learner who guessed "noun phrase" on a bare noun
 * was then shown that question with every row greyed out. Whatever changes an
 * option's state has to ask this again.
 */
function withStep(groups: OptionGroup[]): {
  groups: OptionGroup[];
  step: string | null;
  suggested: number;
} {
  const takeable = (g: OptionGroup) => g.options.some(isPickable);

  // The open group is the first unanswered question. An optional group is not a
  // question — it is an offer — so it stays collapsed however long it goes
  // untaken, and the palette never opens on one.
  let step: string | null = null;
  for (const g of groups) {
    if (!g.optional && !g.answered && takeable(g)) {
      step = g.id;
      break;
    }
  }
  // Everything settled: rest on the last group that can still be changed, so
  // revising the most recent decision costs nothing. Optional groups are
  // skipped — an offer nobody has to take should not be where the palette
  // comes to rest, or every finished node would open on "is a piece missing?".
  if (!step) {
    for (let i = groups.length - 1; i >= 0; i--) {
      if (!groups[i]!.optional && takeable(groups[i]!)) {
        step = groups[i]!.id;
        break;
      }
    }
  }
  // Nothing anywhere can be taken. Resting on the first group would open the
  // palette on a wall of greyed-out rows, which says "answer this" about a
  // question that has no answer left to give.
  step ??= groups.some(takeable) ? (groups[0]?.id ?? null) : null;

  const ranked = (step ? groups.find((g) => g.id === step)?.options : [])
    ?.filter((o) => o.state === 'suggested')
    .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
    .slice(0, 9);
  const hotkeys = new Map(ranked?.map((o, i) => [o.key, String(i + 1)]) ?? []);
  const n = hotkeys.size;
  const keyed = groups.map((g) =>
    g.id !== step
      ? g
      : {
          ...g,
          options: g.options.map((o) =>
            hotkeys.has(o.key) ? { ...o, hotkey: hotkeys.get(o.key) } : o,
          ),
        },
  );
  return { groups: keyed, step, suggested: n };
}

/** Recompute navigation after another decision layer changes group availability. */
export function refreshPanel(panel: Panel): Panel {
  return { ...panel, ...withStep(panel.groups) };
}

function finish(draft: Omit<Panel, 'step' | 'suggested'>, scope?: ChapterScope): Panel {
  const groups: OptionGroup[] = withhold(draft.groups, scope).map((g) => {
    const answered = g.options.find((o) => o.state === 'chosen') ?? null;
    // No `roleReason` for an answered group. The reason is the answer, and the
    // menu already shows it beside the group's name; writing the row's key
    // here put `answered: form:Pron` on the line a learner reads. What a
    // reason is FOR is a closure they cannot see for themselves.
    return {
      ...g,
      answered,
      role: answered ? 'settled' : g.optional ? 'offer' : 'required',
    };
  });
  return { ...draft, ...withStep(groups) };
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
/**
 * Which group the palette should open on.
 *
 * Not simply the first. Under an early lesson every word class is `untaught`,
 * so selecting a word opened thirteen greyed rows with no way forward while the
 * two rows the learner could actually pick sat in the group below — the palette
 * looked broken and was, from the learner's side, a dead end.
 *
 * `panel.step` already names the decision in front of them, and the suggestion
 * line already trusts it. Honour it here too, and fall back to any group with
 * something takeable before giving up and showing the first.
 */
export function openingGroup(panel: Panel, activeId?: string | null): OptionGroup | null {
  const named = activeId ? panel.groups.find((g) => g.id === activeId) : undefined;
  if (named) return named;
  const step = panel.groups.find((g) => g.id === panel.step);
  if (step?.options.some(isPickable)) return step;
  return panel.groups.find((g) => g.options.some(isPickable)) ?? panel.groups[0] ?? null;
}

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
