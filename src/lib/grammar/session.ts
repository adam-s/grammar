/**
 * One learner decision, start to finish, as a pure function.
 *
 * The route used to own this: grade, word a verdict, count the miss, apply or
 * refuse, move the selection, close if the question is answered. Ten branches
 * of it, in a Svelte component, unreachable from `node --test`.
 *
 * That gap had a shape. The grader's tests covered a single miss; the browser
 * sweep only ever makes correct picks; so the space between them — wrong
 * answers, the second miss, a refusal that has to persist, an alternate reading
 * — was tested by nothing, and a real bug lived there. This module is that
 * space, made testable.
 *
 * It decides nothing about grammar. Every question is answered by a grader in
 * `grader.ts` and every change by a setter in `builder.ts`; what lives here is
 * the transaction that joins them, which is the part that was untested.
 */
import {
  addGap,
  setAnchor,
  setAuxKind,
  setClauseKind,
  setFiniteness,
  setFunction,
  setFunctionForParent,
  setFusion,
  setPartKind,
  setVerbType,
  setVoice,
  hypothesisFor,
  unwrap,
  wrap,
  wrapInside,
  nodeOver,
  type BuildState,
  type Span,
} from './builder.ts';
import {
  ANCHOR_TEST,
  AUX_KIND_TEST,
  CLAUSE_KIND_TEST,
  FINITENESS_TEST,
  FUSION_TEST,
  GAP_TEST,
  PART_KIND_TEST,
  PLAIN,
  VERB_TYPE_TEST,
  VOICE_TEST,
  gradeAnchor,
  gradeAuxKind,
  gradeClauseKind,
  gradeFiniteness,
  gradeForm,
  gradeFunction,
  gradeFusion,
  gradeGap,
  gradePartKind,
  gradeVerbType,
  gradeVoice,
  type Outcome,
} from './grader.ts';
import {
  FORM_TEST,
  FUNCTION_TEST,
  auxKindName,
  clauseKindName,
  label,
  partKindName,
} from './names.ts';
import {
  blockRejectedOptions,
  closeSettledGroups,
  isPanelComplete,
  isPickable,
  optionsFor,
  refreshPanel,
  type ChapterScope,
  type LabelOption,
  type Selection,
} from './options.ts';
import { hypothesizes, LONG } from './rules.ts';
import {
  CLAUSE_FUNCTIONS,
  PHRASE_INTERNAL_FUNCTIONS,
  contentSpan,
  isPhraseForm,
  type Form,
  type Func,
  type SentenceEntry,
  type Word,
} from './types.ts';

/** What the learner is told after a decision. */
export interface Verdict {
  kind: 'correct' | 'alternate' | 'wrong';
  text: string;
  test?: string;
}

/**
 * Where the palette goes after a decision, said outright.
 *
 * The panel used to reconstruct this from the verdict, the step, and whether
 * the subject had changed — three properties that each move for their own
 * reasons. The transaction knows the answer at the moment it grades, so it
 * says it: a wrong answer stays beside the question it answered, a right one
 * advances to a real next question, and a finished target closes.
 */
export type NavigationResult =
  | { kind: 'stay'; question: string }
  | { kind: 'advance'; question: string | null }
  | { kind: 'close' };

/**
 * Everything a learner's turn at one sentence consists of.
 *
 * `misses` counts wrong answers per question so the second one can say more
 * than the first. `rejected` remembers which rows have been refused for which
 * words, so a disproved answer cannot go on looking available. `navigation` is
 * the last decision's movement instruction; null when no decision has landed
 * since the selection moved.
 */
export interface Session {
  build: BuildState;
  selection: Selection;
  verdict: Verdict | null;
  misses: Record<string, number>;
  rejected: Record<string, Record<string, string>>;
  navigation: NavigationResult | null;
}

export const emptySession = (): Session => ({
  build: { constituents: {}, seq: 0 },
  selection: { kind: 'none' },
  verdict: null,
  misses: {},
  rejected: {},
  navigation: null,
});

/** The words a decision is about, whatever kind of selection made it. */
export function targetSpan(build: BuildState, selection: Selection, words?: Word[]): Span | null {
  if (selection.kind === 'span') {
    return words ? contentSpan(words, selection.span) : selection.span;
  }
  if (selection.kind === 'node') {
    return build.constituents[selection.id]?.span ?? null;
  }
  if (selection.kind === 'nodes') {
    return words ? contentSpan(words, selection.span) : selection.span;
  }
  return null;
}

const spanKey = (span: Span | null): string => (span ? `${span[0]}-${span[1]}` : '');

/**
 * What a question is about — a node when there is one, otherwise the words.
 *
 * A span is not an identity. A word, the one-word phrase over it, and a second
 * layer above that all cover the same positions, so keying a question by its
 * span merges questions that are not the same question. That was not
 * theoretical: a wrong word class on *She* and the first wrong phrase form on
 * the same word both landed on `form:0-0`, so the phrase question opened
 * already holding one miss and gave the answer away on its first wrong try.
 *
 * Exported because the route looks rejections up by the same identity, and two
 * definitions of "the same question" is how they drift apart.
 */
export const targetKey = (build: BuildState, selection: Selection, words?: Word[]): string =>
  selection.kind === 'node' ? `#${selection.id}` : spanKey(targetSpan(build, selection, words));

/** Does any accepted reading contain a node with the given visible identity? */
function readingHas(
  sentence: SentenceEntry,
  span: Span,
  test: (form: string, fn: string | null) => boolean,
): boolean {
  return sentence.readings.some((reading) =>
    [reading.constituents, ...(reading.equivalentStructures ?? [])].some((constituents) =>
      Object.values(constituents).some(
        (c) => c.span[0] === span[0] && c.span[1] === span[1] && test(c.form, c.function),
      ),
    ),
  );
}

interface ReadingJob {
  func: Func;
  parentForm: Form;
  parentSpan: Span;
  siblings: Func[];
  siblingForms: Form[];
}

/** Jobs this exact node has in the accepted readings, with the group that supplies each job. */
function readingJobs(sentence: SentenceEntry, span: Span, form: Form): ReadingJob[] {
  const jobs: ReadingJob[] = [];
  for (const reading of sentence.readings) {
    for (const constituents of [reading.constituents, ...(reading.equivalentStructures ?? [])]) {
      for (const [id, c] of Object.entries(constituents)) {
        if (
          c.span[0] !== span[0] ||
          c.span[1] !== span[1] ||
          c.form !== form ||
          c.function === null ||
          c.parent === null
        ) {
          continue;
        }
        const parent = constituents[c.parent];
        if (!parent) continue;
        const siblings = parent.children
          .filter((child) => child !== id && constituents[child]?.function != null)
          .map((child) => constituents[child]!);
        if (
          !jobs.some(
            (job) =>
              job.func === c.function &&
              job.parentForm === parent.form &&
              job.parentSpan[0] === parent.span[0] &&
              job.parentSpan[1] === parent.span[1] &&
              job.siblings.length === siblings.length &&
              job.siblings.every((fn, index) => fn === siblings[index]!.function) &&
              job.siblingForms.every((form, index) => form === siblings[index]!.form),
          )
        ) {
          jobs.push({
            func: c.function,
            parentForm: parent.form,
            parentSpan: parent.span,
            siblings: siblings.map((sibling) => sibling.function!),
            siblingForms: siblings.map((sibling) => sibling.form),
          });
        }
      }
    }
  }
  return jobs;
}

/**
 * A question the accepted readings have taken off the learner's plate, and the
 * two different senses in which they can do it. `settled` means the question
 * has no answer for this selection in any reading — there is nothing to ask.
 * `deferred` means the answer exists but only inside structure not built yet,
 * so asking now would demand something no correct move can give.
 */
export interface ReadingSettlement {
  group: string;
  kind: 'settled' | 'deferred';
  reason: string;
}

/**
 * Which of the palette's questions the stored readings close, and why.
 *
 * A bare word such as *visitors* cannot be a one-word phrase in *Our visitors*;
 * every accepted reading groups it with *Our*. Likewise, *the stove* has no
 * clause role in *on the stove*: its job appears only after the prepositional
 * phrase is built. Neither fact is a choice for the learner, so neither should
 * become a "No" button. The stored analyses let the program move past both.
 *
 * This only closes questions with no possible correct answer right now. If any
 * accepted reading leaves a real choice, the question stays with the learner.
 */
export function readingSettlements(
  build: BuildState,
  selection: Selection,
  sentence: SentenceEntry,
  panel = optionsFor(build, sentence.words, selection),
): ReadingSettlement[] {
  if (selection.kind !== 'node') return [];
  const node = build.constituents[selection.id];
  if (!node) return [];

  const settled: ReadingSettlement[] = [];
  if (
    node.word !== undefined &&
    !readingHas(sentence, node.span, (form) => isPhraseForm(form as Form))
  ) {
    settled.push({
      group: 'phrase-form',
      kind: 'settled',
      reason: 'no accepted reading lets these words stand alone as a phrase',
    });
  }
  const jobs = readingJobs(sentence, node.span, node.form);
  const functionGroup = panel.groups.find((group) => group.id === 'function');
  const correctJobIsAvailable = jobs.some((job) =>
    functionGroup?.options.some((option) => option.func === job.func && isPickable(option)),
  );
  if (!correctJobIsAvailable) {
    // The same closed question, two different truths. An NP waiting for its PP
    // has a job — it arrives with the parent, so the question is deferred. A
    // root S has no job in any reading, so there is no question at all. This
    // applies inside an outer phrase too: top-down construction may create the
    // eventual child before its immediate parent has been drawn.
    const future = jobs[0];
    const parentWords = future
      ? sentence.words
          .slice(future.parentSpan[0], future.parentSpan[1] + 1)
          .map((word) => word.text)
          .join(' ')
      : '';
    settled.push(
      future
        ? {
            group: 'function',
            kind: 'deferred',
            reason: `First build “${parentWords}” as ${PLAIN[future.parentForm] ?? future.parentForm}. Then this group can take its job inside it.`,
          }
        : {
            group: 'function',
            kind: 'settled',
            reason: 'no accepted reading gives these words a job at this level',
          },
    );
  }
  return settled;
}

/**
 * Let a learner name a relationship before drawing its immediate parent.
 *
 * The accepted readings tell us what kind of parent is coming, but not which
 * answer to reveal. Every function that could structurally fit that future
 * parent is reopened and left for the grader to judge. A wrong hypothesis then
 * follows the ordinary learning loop: explain it in the header, leave the tree
 * alone, and disable only the row the learner has ruled out.
 *
 * The group remains an offer, so bottom-up builders may answer it now while
 * outside-in builders may leave it until the parent is visible.
 */
function offerFutureJobs(
  panel: ReturnType<typeof optionsFor>,
  build: BuildState,
  selection: Selection,
  sentence: SentenceEntry,
) {
  if (selection.kind !== 'node') return panel;
  const node = build.constituents[selection.id];
  if (!node) return panel;

  const immediate = node.parent ? build.constituents[node.parent] : null;
  const jobs = readingJobs(sentence, node.span, node.form);
  const functionGroup = panel.groups.find((group) => group.id === 'function');
  const correctJobIsAvailable = jobs.some((job) =>
    functionGroup?.options.some((option) => option.func === job.func && isPickable(option)),
  );
  if (correctJobIsAvailable) return panel;

  const future = jobs.filter(
    (job) =>
      !immediate ||
      immediate.form !== job.parentForm ||
      immediate.span[0] !== job.parentSpan[0] ||
      immediate.span[1] !== job.parentSpan[1],
  );
  if (future.length === 0) return panel;

  const groups = panel.groups.map((group) => {
    if (group.id !== 'function') return group;
    const options = group.options.map((option) => {
      if (!option.func) return option;
      if (option.state === 'untaught') return option;
      const contexts = future.map((job) => ({
        job,
        verdict: hypothesizes(option.func!, {
          parentForm: job.parentForm,
          childForm: node.form,
          verbType: null,
          siblings: job.siblings,
          siblingForms: job.siblingForms,
        }),
      }));
      const possible = contexts.find(({ verdict }) => verdict.state === 'allowed');
      if (!possible) {
        const blocked = contexts.find(({ verdict }) => verdict.state === 'disabled');
        return {
          ...option,
          state: 'blocked' as const,
          note:
            blocked?.verdict.state === 'disabled'
              ? blocked.verdict.reason
              : 'That job does not fit the larger group these words belong to.',
        };
      }
      const parentWords = sentence.words
        .slice(possible.job.parentSpan[0], possible.job.parentSpan[1] + 1)
        .map((word) => word.text)
        .join(' ');
      return {
        ...option,
        state: option.state === 'chosen' ? ('chosen' as const) : ('available' as const),
        note: `${FUNCTION_TEST[option.func]} You can try this now; it will sit inside “${parentWords}” when you build that as ${PLAIN[possible.job.parentForm] ?? possible.job.parentForm}.`,
      };
    });
    for (const job of future) {
      if (options.some((option) => option.func === job.func)) continue;
      const parentWords = sentence.words
        .slice(job.parentSpan[0], job.parentSpan[1] + 1)
        .map((word) => word.text)
        .join(' ');
      options.push({
        key: `func:${job.func}`,
        label: label(job.func),
        note: `${FUNCTION_TEST[job.func]} You can name this now; it will sit inside “${parentWords}” when you build that as ${PLAIN[job.parentForm] ?? job.parentForm}.`,
        state: 'available',
        func: job.func,
        ...(job.func === 'adverbial' ? { obligatory: false } : {}),
      });
    }
    const order = new Map(
      [...CLAUSE_FUNCTIONS, ...PHRASE_INTERNAL_FUNCTIONS].map((fn, index) => [fn, index]),
    );
    options.sort(
      (left, right) => (order.get(left.func!) ?? Infinity) - (order.get(right.func!) ?? Infinity),
    );
    return {
      ...group,
      optional: true,
      role: group.answered ? group.role : ('offer' as const),
      roleReason: group.answered
        ? group.roleReason
        : 'You can name this relationship before drawing the larger group.',
      options,
    };
  });
  return refreshPanel({ ...panel, groups });
}

/**
 * Put the complete function vocabulary in the learner's menu.
 *
 * The structural palette deliberately omits jobs that cannot fit the current
 * parent. That is useful to builders and audits, but it gives the answer away
 * in a quiz. At the learner boundary we restore those rows in the same stable
 * order as the taxonomy. The grader, not this inventory, decides a click.
 */
function completeFunctionInventory(panel: ReturnType<typeof optionsFor>) {
  const order = [...CLAUSE_FUNCTIONS, ...PHRASE_INTERNAL_FUNCTIONS];
  const groups = panel.groups.map((group) => {
    if (group.id !== 'function') return group;
    const byKey = new Map(group.options.map((option) => [option.key, option]));
    const options: LabelOption[] = [];
    for (const func of order) {
      options.push(
        byKey.get(`func:${func}`) ?? {
          key: `func:${func}`,
          label: label(func),
          state: 'available',
          func,
          ...(func === 'adverbial' ? { obligatory: false } : {}),
        },
      );
      if (func === 'adverbial') {
        options.push(
          byKey.get('func:obligatoryAdverbial') ?? {
            key: 'func:obligatoryAdverbial',
            label: 'obligatory adverbial',
            state: 'available',
            func: 'adverbial',
            obligatory: true,
          },
        );
      }
    }
    // Keep contextual choices such as fused functions after the shared list.
    const standardKeys = new Set(options.map((option) => option.key));
    options.push(...group.options.filter((option) => !standardKeys.has(option.key)));
    return { ...group, options };
  });
  return refreshPanel({ ...panel, groups });
}

/** The learner-facing palette after sentence context and prior attempts are applied. */
export function sessionPanel(
  build: BuildState,
  words: Word[],
  selection: Selection,
  sentence: SentenceEntry,
  scope?: ChapterScope,
) {
  const panel = offerFutureJobs(
    optionsFor(build, words, selection, scope),
    build,
    selection,
    sentence,
  );
  // Settlements are judged against the unrestricted structural palette. A
  // lesson may hide a correct label because it is untaught; that does not mean
  // the surrounding structure is missing.
  const full = scope
    ? offerFutureJobs(optionsFor(build, words, selection), build, selection, sentence)
    : panel;
  const closed = closeSettledGroups(panel, readingSettlements(build, selection, sentence, full));
  // Later lessons and impossible hypotheses remain explorable, but they do not
  // become requirements for finishing the question in front of the learner.
  // Capture that completion fact before all rows are made clickable.
  const scopedCompletion = {
    ...closed,
    groups: closed.groups.map((group) =>
      group.optional || (!group.answered && !group.options.some((option) => isPickable(option)))
        ? { ...group, optional: true }
        : group,
    ),
  };
  const settled = completeFunctionInventory(scopedCompletion);

  // The palette is a quiz, not an answer key. Grammar rules and stored
  // readings may explain why an answer is wrong after it is tried, but they do
  // not get to grey it out beforehand. Every displayed row therefore begins
  // takeable. Only a chosen answer and a learner's remembered rejection may
  // carry a different state.
  const groups = settled.groups.map((group) => ({
    ...group,
    options: group.options.map((option) => {
      if (option.state === 'chosen' || option.state === 'idle') return option;
      const cleaned: LabelOption = { ...option, state: 'available' };
      delete cleaned.hotkey;
      delete cleaned.rank;
      delete cleaned.note;
      return cleaned;
    }),
  }));
  return refreshPanel({ ...settled, groups });
}

/**
 * One question, asked and answered.
 *
 * `praise` and `refused` are the two halves of the same sentence — "Yes — that
 * is a noun" and "Not a noun." — so a decision names its subject once.
 */
interface Ask {
  /** Same question, same words: what the miss count is kept against. */
  key: string;
  outcome: Outcome;
  praise: string;
  refused: string;
  firstMiss: string;
  apply: (b: BuildState) => BuildState;
  /** Form picks create a node, and the selection follows it. */
  reselect?: Span;
  reselectForm?: Form;
}

/**
 * The panel the learner may act on, including refusals that are still true.
 *
 * A refusal is a result, not a permanent property of a word span. Building
 * more of the tree can make an earlier answer possible, and a corrected
 * sentence analysis can do the same while a development session remains
 * open. Re-grade remembered rows against the current structure and readings
 * before disabling them. This keeps useful "you already tried that" feedback
 * without letting stale feedback veto a now-correct move.
 */
export function sessionChoices(
  session: Session,
  sentence: SentenceEntry,
  words: Word[],
  scope?: ChapterScope,
) {
  const visible = sessionPanel(session.build, words, session.selection, sentence, scope);
  const remembered = session.rejected[targetKey(session.build, session.selection, words)];
  if (!remembered) return visible;

  const live: Record<string, string> = {};
  for (const [key, reason] of Object.entries(remembered)) {
    const row = visible.groups
      .flatMap((group) => group.options)
      .find((option) => option.key === key);
    if (!row || !isPickable(row)) continue;
    const decision = ask(session, sentence, words, row);
    if (decision?.outcome.kind === 'wrong') live[key] = reason;
  }
  return blockRejectedOptions(visible, live);
}

const sentenceCase = (t: string) => `${t.charAt(0).toUpperCase()}${t.slice(1).trimEnd()}.`;

/**
 * Which question this row asks, and everything needed to answer it.
 *
 * Order matters in one place: a gap row carries a form — it is what the missing
 * piece would have been — so it has to be recognised before the form row, or
 * adding an empty slot is graded as naming the words beside it.
 */
function ask(session: Session, sentence: SentenceEntry, words: Word[], o: LabelOption): Ask | null {
  const { build, selection } = session;
  const span = targetSpan(build, selection, words);
  if (!span) return null;
  const node = selection.kind === 'node' ? build.constituents[selection.id] : undefined;
  const at = node?.span[0];

  if (o.gap && o.func && node && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `gap:${targetKey(build, selection, words)}:${o.func}`,
      outcome: gradeGap(sentence, node.span, node.form, o.func),
      praise: `nothing fills the ${label(o.func)} here`,
      refused: `a missing ${label(o.func)}`,
      firstMiss: GAP_TEST,
      apply: (b) => addGap(b, id, o.func!, o.form),
    };
  }

  if (o.form) {
    const named = PLAIN[o.form] ?? o.form;
    const bareName = named.replace(/^(?:a|an) /, '');
    const stack = o.stack === true;
    const id = selection.kind === 'node' ? selection.id : null;
    const loose = id ? build.constituents[id] : undefined;
    const duplicateStack = stack && loose?.form === o.form;
    const duplicateStackTest = `These words already have a ${bareName} layer. A larger group must add a different kind of structure.`;
    const outcome: Outcome = duplicateStack
      ? {
          kind: 'wrong',
          reason: `A ${bareName} cannot sit inside another ${bareName} over the same words.`,
          test: duplicateStackTest,
        }
      : gradeForm(sentence, span, o.form, o.level);
    return {
      // `level` and not just the words: the word class and the one-word phrase
      // over it are different questions asked of the same letters.
      key: `form:${o.level ?? 'any'}:${targetKey(build, selection, words)}`,
      // The level the row belongs to, so "not a noun" is answered with
      // "pronoun" rather than with "noun phrase".
      outcome,
      praise: `that is ${named}`,
      refused: named,
      firstMiss: duplicateStack
        ? duplicateStackTest
        : sentenceCase(`${named} ${FORM_TEST[o.form] ?? ''}`),
      apply: (b) => {
        // `wrap` always puts a node OVER what is there, so renaming means
        // taking the old one away first. The row says which this is.
        const bare = !stack && id && loose && loose.parent === null && loose.word === undefined;
        const ready = bare ? unwrap(b, id) : b;
        return selection.kind === 'span'
          ? wrapInside(ready, words, span, o.form!)
          : wrap(ready, words, span, o.form!);
      },
      reselect: span,
      reselectForm: o.form,
    };
  }

  if (o.anchor && node && selection.kind === 'node') {
    const id = selection.id;
    const target = build.constituents[o.anchor];
    if (!target) return null;
    return {
      key: `anchor:${targetKey(build, selection, words)}`,
      outcome: gradeAnchor(sentence, node.span, node.form, target.span, target.form),
      praise: `it belongs to ${o.label}`,
      refused: `part of ${o.label}`,
      firstMiss: ANCHOR_TEST,
      apply: (b) => setAnchor(b, id, o.anchor!),
    };
  }

  if (o.fusedWith && node && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `fuse:${targetKey(build, selection, words)}`,
      outcome: gradeFusion(sentence, node.span, node.form, o.fusedWith),
      praise: `it is the ${label(o.fusedWith)} and the head at once`,
      refused: 'both at once',
      firstMiss: FUSION_TEST,
      apply: (b) => setFusion(b, id, o.fusedWith!),
    };
  }

  if (o.func && node && selection.kind === 'node') {
    const id = selection.id;
    const future = readingJobs(sentence, node.span, node.form).find((job) => job.func === o.func);
    const needsFutureParent = hypothesisFor(build, id, o.func).state !== 'allowed';
    return {
      key: `func:${targetKey(build, selection, words)}`,
      outcome: gradeFunction(sentence, node.span, node.form, o.func, o.obligatory),
      praise: `it is the ${o.label}`,
      refused: `the ${o.label}`,
      firstMiss: sentenceCase(`the ${label(o.func)} answers: ${FUNCTION_TEST[o.func]}`),
      apply: (b) =>
        future && needsFutureParent
          ? setFunctionForParent(b, id, o.func!, future.parentForm, o.obligatory ?? false)
          : setFunction(b, id, o.func!, o.obligatory ?? false),
    };
  }

  if (o.voice && at !== undefined && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `voice:${targetKey(build, selection, words)}`,
      outcome: gradeVoice(sentence, at, o.voice),
      praise: o.voice === 'passive' ? 'this one is passive' : 'this one is active',
      refused: o.voice,
      firstMiss: VOICE_TEST,
      apply: (b) => setVoice(b, id, o.voice!),
    };
  }

  if (o.auxKind && at !== undefined && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `aux:${targetKey(build, selection, words)}`,
      outcome: gradeAuxKind(sentence, at, o.auxKind),
      praise: `this is ${auxKindName(o.auxKind)}`,
      refused: auxKindName(o.auxKind),
      firstMiss: AUX_KIND_TEST,
      apply: (b) => setAuxKind(b, id, o.auxKind!),
    };
  }

  if (o.partKind && at !== undefined && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `part:${targetKey(build, selection, words)}`,
      outcome: gradePartKind(sentence, at, o.partKind),
      praise: `this is ${partKindName(o.partKind)}`,
      refused: partKindName(o.partKind),
      firstMiss: PART_KIND_TEST,
      apply: (b) => setPartKind(b, id, o.partKind!),
    };
  }

  if (o.clauseKind && node && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `kind:${targetKey(build, selection, words)}`,
      outcome: gradeClauseKind(sentence, node.span, o.clauseKind),
      praise: `this is ${clauseKindName(o.clauseKind)}`,
      refused: clauseKindName(o.clauseKind),
      firstMiss: CLAUSE_KIND_TEST,
      apply: (b) => setClauseKind(b, id, o.clauseKind!),
    };
  }

  if (o.finiteness && node && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `fin:${targetKey(build, selection, words)}`,
      outcome: gradeFiniteness(sentence, node.span, o.finiteness),
      praise: `this clause is ${o.finiteness}`,
      refused: o.finiteness,
      firstMiss: FINITENESS_TEST,
      apply: (b) => setFiniteness(b, id, o.finiteness!),
    };
  }

  if (o.verbType && at !== undefined && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `vt:${targetKey(build, selection, words)}`,
      // A sentence can hold more than one verb, so this is graded against the
      // verb that was selected rather than against the sentence.
      outcome: gradeVerbType(sentence, at, o.verbType),
      praise: `this verb is ${LONG[o.verbType]}`,
      refused: LONG[o.verbType],
      firstMiss: VERB_TYPE_TEST,
      apply: (b) => setVerbType(b, id, o.verbType!),
    };
  }

  return null;
}

/** Find the node a form pick just created or renamed. */
function nodeAfterForm(
  before: BuildState,
  after: BuildState,
  span: Span,
  form: Form | undefined,
): string | null {
  if (after.seq > before.seq) {
    const created = `c${after.seq}`;
    if (after.constituents[created]) return created;
  }
  if (form) {
    const matches = Object.keys(after.constituents)
      .filter((id) => {
        const c = after.constituents[id]!;
        return c.form === form && c.span[0] === span[0] && c.span[1] === span[1];
      })
      .sort((a, b) => {
        const aw = after.constituents[a]!.word === undefined ? 1 : 0;
        const bw = after.constituents[b]!.word === undefined ? 1 : 0;
        return aw - bw;
      });
    if (matches[0]) return matches[0];
  }
  return nodeOver(after, span);
}

/**
 * The hint ladder: gentle once, then the reason.
 *
 * A first miss says only that the answer was wrong and shows the test, because
 * being told the answer is not the lesson. A second miss on the same question
 * gives the grader's reason, because by then guessing is what is happening.
 *
 * Every question goes through this. Six of the ten used to skip it and show the
 * grader's reason immediately, so how much help a learner got depended on which
 * kind of question they had got wrong.
 */
function verdictFor(ask: Ask, misses: number): Verdict {
  if (ask.outcome.kind === 'correct') return { kind: 'correct', text: `Yes — ${ask.praise}.` };
  if (ask.outcome.kind === 'alternate') {
    return {
      kind: 'alternate',
      text: `Also correct, but it means something else: ${ask.outcome.gloss}`,
      test: `Here it means: ${ask.outcome.canonicalGloss}`,
    };
  }
  return misses === 1
    ? { kind: 'wrong', text: `Not ${ask.refused}.`, test: ask.firstMiss }
    : { kind: 'wrong', text: ask.outcome.reason, test: ask.outcome.test };
}

/**
 * Answer one question and return the session that follows.
 *
 * A wrong answer never enters the structure. The diagram is a record of what
 * the learner has established, not of what they have tried — so a refusal is
 * remembered against those exact words and the build is untouched.
 */
export function answer(
  session: Session,
  sentence: SentenceEntry,
  words: Word[],
  o: LabelOption,
  /**
   * What the lesson has taught. The transaction has to judge "is this question
   * finished?" against the palette the learner is actually looking at.
   *
   * Without it the two disagreed in fifty node states across lessons 3 to 7: a
   * verb whose form and job were settled looked finished on screen, because the
   * verb-type row belongs to lesson 8 and was withheld — while `answer` asked
   * the unrestricted palette, saw an open verb-type question, and held the
   * selection and the verdict open on a node the learner had finished.
   */
  scope?: ChapterScope,
): Session {
  // Resolve the row through the palette for THIS state. Callers send an
  // identity, not structural authority: an old, filtered, or fabricated option
  // object cannot bypass licensing or an earlier refusal.
  //
  // `isPickable` was checked in `LabelPanel.svelte` and nowhere else, which put
  // the scope ladder and every blocked rule in the pixels: the button was
  // disabled, so nobody could press it, and any second caller — another view, a
  // driver, a replay — would have had to remember the rule on its own. The
  // module that owns the decision should be the one that makes it.
  // The supplied row still owns whether THIS surface offered the action. That
  // keeps an `untaught` lesson row inert while allowing the open builder to use
  // a later label; `scope` controls completion after the pick, not grammar.
  if (!isPickable(o)) return session;

  const where = targetKey(session.build, session.selection, words);
  const panel = sessionChoices(session, sentence, words);
  const asked = panel.groups.find((group) => group.options.some((row) => row.key === o.key));
  if (!asked) return session;
  const offered = asked.options.find((row) => row.key === o.key);
  if (!offered || !isPickable(offered)) return session;

  const decision = ask(session, sentence, words, offered);
  if (!decision) return session;

  const wrong = decision.outcome.kind === 'wrong';
  const misses = wrong
    ? { ...session.misses, [decision.key]: (session.misses[decision.key] ?? 0) + 1 }
    : session.misses;
  const verdict = verdictFor(decision, misses[decision.key] ?? 0);

  if (wrong) {
    const said = [verdict.text, verdict.test].filter(Boolean).join(' ');
    return {
      ...session,
      verdict,
      misses,
      rejected: {
        ...session.rejected,
        [where]: { ...session.rejected[where], [offered.key]: said },
      },
      navigation: { kind: 'stay', question: asked.id },
    };
  }

  const build = decision.apply(session.build);
  let selection = session.selection;
  if (decision.reselect) {
    const id = nodeAfterForm(session.build, build, decision.reselect, decision.reselectForm);
    if (id) selection = { kind: 'node', id };
  }
  // A correct answer may finish the selected target, but it never answers the
  // next question on the learner's behalf. Even a single remaining row must be
  // chosen explicitly.
  const next = sessionPanel(build, words, selection, sentence, scope);
  const moved: Session = isPanelComplete(next)
    ? { ...session, build, misses, verdict: null, selection: { kind: 'none' } }
    : { ...session, build, misses, verdict, selection };
  return {
    ...moved,
    navigation:
      moved.selection.kind === 'none'
        ? { kind: 'close' }
        : {
            kind: 'advance',
            question: sessionPanel(moved.build, words, moved.selection, sentence, scope).step,
          },
  };
}
