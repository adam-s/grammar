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
  setFusion,
  setPartKind,
  setVerbType,
  setVoice,
  unwrap,
  wrap,
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
  isPanelComplete,
  isPickable,
  optionsFor,
  type LabelOption,
  type Selection,
} from './options.ts';
import { LONG } from './rules.ts';
import type { SentenceEntry, Word } from './types.ts';

/** What the learner is told after a decision. */
export interface Verdict {
  kind: 'correct' | 'alternate' | 'wrong';
  text: string;
  test?: string;
}

/**
 * Everything a learner's turn at one sentence consists of.
 *
 * `misses` counts wrong answers per question so the second one can say more
 * than the first. `rejected` remembers which rows have been refused for which
 * words, so a disproved answer cannot go on looking available.
 */
export interface Session {
  build: BuildState;
  selection: Selection;
  verdict: Verdict | null;
  misses: Record<string, number>;
  rejected: Record<string, Record<string, string>>;
}

export const emptySession = (): Session => ({
  build: { constituents: {}, seq: 0 },
  selection: { kind: 'none' },
  verdict: null,
  misses: {},
  rejected: {},
});

/** The words a decision is about, whatever kind of selection made it. */
export function targetSpan(build: BuildState, selection: Selection): Span | null {
  if (selection.kind === 'span') return selection.span;
  if (selection.kind === 'node') return build.constituents[selection.id]?.span ?? null;
  if (selection.kind === 'nodes') return selection.span;
  return null;
}

const spanKey = (span: Span | null): string => (span ? `${span[0]}-${span[1]}` : '');

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
  const span = targetSpan(build, selection);
  if (!span) return null;
  const node = selection.kind === 'node' ? build.constituents[selection.id] : undefined;
  const at = node?.span[0];

  if (o.gap && o.func && node && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `gap:${spanKey(node.span)}:${o.func}`,
      outcome: gradeGap(sentence, node.span, node.form, o.func),
      praise: `nothing fills the ${label(o.func)} here`,
      refused: `a missing ${label(o.func)}`,
      firstMiss: GAP_TEST,
      apply: (b) => addGap(b, id, o.func!, o.form),
    };
  }

  if (o.form) {
    const named = PLAIN[o.form] ?? o.form;
    const stack = o.stack === true;
    const id = selection.kind === 'node' ? selection.id : null;
    const loose = id ? build.constituents[id] : undefined;
    return {
      key: `form:${spanKey(span)}`,
      // The level the row belongs to, so "not a noun" is answered with
      // "pronoun" rather than with "noun phrase".
      outcome: gradeForm(sentence, span, o.form, o.level),
      praise: `that is ${named}`,
      refused: named,
      firstMiss: sentenceCase(`${named} ${FORM_TEST[o.form] ?? ''}`),
      apply: (b) => {
        // `wrap` always puts a node OVER what is there, so renaming means
        // taking the old one away first. The row says which this is.
        const bare = !stack && id && loose && loose.parent === null && loose.word === undefined;
        return wrap(bare ? unwrap(b, id) : b, words, span, o.form!);
      },
      reselect: span,
    };
  }

  if (o.anchor && node && selection.kind === 'node') {
    const id = selection.id;
    const target = build.constituents[o.anchor];
    if (!target) return null;
    return {
      key: `anchor:${spanKey(node.span)}`,
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
      key: `fuse:${spanKey(node.span)}`,
      outcome: gradeFusion(sentence, node.span, node.form, o.fusedWith),
      praise: `it is the ${label(o.fusedWith)} and the head at once`,
      refused: 'both at once',
      firstMiss: FUSION_TEST,
      apply: (b) => setFusion(b, id, o.fusedWith!),
    };
  }

  if (o.func && node && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `func:${spanKey(node.span)}`,
      outcome: gradeFunction(sentence, node.span, node.form, o.func, o.obligatory),
      praise: `it is the ${o.label}`,
      refused: `the ${o.label}`,
      firstMiss: sentenceCase(`the ${label(o.func)} answers: ${FUNCTION_TEST[o.func]}`),
      apply: (b) => setFunction(b, id, o.func!, o.obligatory ?? false),
    };
  }

  if (o.voice && at !== undefined && selection.kind === 'node') {
    const id = selection.id;
    return {
      key: `voice:${spanKey(node!.span)}`,
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
      key: `aux:${spanKey(node!.span)}`,
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
      key: `part:${spanKey(node!.span)}`,
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
      key: `kind:${spanKey(node.span)}`,
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
      key: `fin:${spanKey(node.span)}`,
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
      key: `vt:${spanKey(node!.span)}`,
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
): Session {
  // A row the palette is refusing is refused here too.
  //
  // `isPickable` was checked in `LabelPanel.svelte` and nowhere else, which put
  // the scope ladder and every blocked rule in the pixels: the button was
  // disabled, so nobody could press it, and any second caller — another view, a
  // driver, a replay — would have had to remember the rule on its own. The
  // module that owns the decision should be the one that makes it.
  if (!isPickable(o)) return session;

  const decision = ask(session, sentence, words, o);
  if (!decision) return session;

  const wrong = decision.outcome.kind === 'wrong';
  const misses = wrong
    ? { ...session.misses, [decision.key]: (session.misses[decision.key] ?? 0) + 1 }
    : session.misses;
  const verdict = verdictFor(decision, misses[decision.key] ?? 0);

  if (wrong) {
    const where = spanKey(targetSpan(session.build, session.selection));
    const said = [verdict.text, verdict.test].filter(Boolean).join(' ');
    return {
      ...session,
      verdict,
      misses,
      rejected: { ...session.rejected, [where]: { ...session.rejected[where], [o.key]: said } },
    };
  }

  const build = decision.apply(session.build);
  let selection = session.selection;
  if (decision.reselect) {
    const id = nodeOver(build, decision.reselect);
    if (id) selection = { kind: 'node', id };
  }
  // Close a settled question, but keep the palette open for a real follow-up.
  const done = isPanelComplete(optionsFor(build, words, selection));
  return {
    ...session,
    build,
    misses,
    verdict: done ? null : verdict,
    selection: done ? { kind: 'none' } : selection,
  };
}
