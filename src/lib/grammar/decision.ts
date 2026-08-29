/**
 * One inspectable answer to: given what the learner selected and what they
 * have already built, why is the app asking this question, offering these
 * moves, and putting this move first?
 *
 * The reasoning itself still lives where it always did — `options.ts` builds
 * the palette, `session.ts` closes questions the readings have settled — and
 * this module MOVES none of it. It reads those results into one serializable
 * object, so a developer (or a test) can see every decision state without
 * opening several internal objects. The refactor plan in
 * `docs/temp-decision-model-refactor.md` grows this into the boundary the
 * palette and the session both consume; until then it is a window, not a wall.
 *
 * Browser-free by construction, like everything else the decision touches.
 */
import type { BuildState } from './builder.ts';
import {
  blockRejectedOptions,
  isPanelComplete,
  type ChapterScope,
  type LabelOption,
  type Panel,
  type QuestionRole,
  type Selection,
} from './options.ts';
import { sessionPanel, targetKey, targetSpan } from './session.ts';
import type { Form, Func, SentenceEntry, Span } from './types.ts';

/** A node the learner has established, as a plain fact. */
export interface StructuralFact {
  id: string;
  form: Form;
  function: Func | null;
  span: Span;
  /** Present for a word leaf: which word it wraps. */
  word?: number;
}

export type { QuestionRole } from './options.ts';

export interface DecisionQuestion {
  id: string;
  /** The question as the learner reads it. */
  question: string;
  role: QuestionRole;
  reason: string;
  candidates: DecisionCandidate[];
}

export interface DecisionCandidate {
  /** The exact row a click would send — key, typed fields, hotkey and all. */
  action: LabelOption;
  availability: 'available' | 'blocked' | 'not-applicable';
  /** The evidence, the formal test, or the block reason — whichever applies. */
  reason: string;
  /** Evidence order among suggestions; null for an unsuggested row. */
  rank: number | null;
}

export interface DecisionSnapshot {
  target: {
    selection: Selection;
    /** The words the decision is about, node or span alike. */
    span: Span | null;
    /** Those words, quoted — empty when nothing is selected. */
    subject: string;
  };
  known: StructuralFact[];
  questions: DecisionQuestion[];
  /** The question the palette opens on. */
  activeQuestion: string | null;
  completion: 'open' | 'complete' | 'waiting-for-structure';
}

const facts = (build: BuildState): StructuralFact[] =>
  Object.entries(build.constituents)
    .map(([id, c]) => ({
      id,
      form: c.form,
      function: c.function,
      span: c.span,
      ...(c.word !== undefined ? { word: c.word } : {}),
    }))
    .sort((a, b) => a.span[0] - b.span[0] || b.span[1] - a.span[1]);

const candidate = (o: LabelOption): DecisionCandidate => ({
  action: o,
  availability:
    o.state === 'blocked' || o.state === 'untaught'
      ? 'blocked'
      : o.state === 'idle'
        ? 'not-applicable'
        : 'available',
  reason: o.note ?? '',
  rank: o.state === 'suggested' ? (o.rank ?? 0) : null,
});

export function decisionSnapshot(
  build: BuildState,
  words: SentenceEntry['words'],
  selection: Selection,
  sentence: SentenceEntry,
  opts: {
    scope?: ChapterScope;
    /** The session's refusals, so disproved rows read as blocked here too. */
    rejected?: Readonly<Record<string, Record<string, string>>>;
  } = {},
): DecisionSnapshot {
  const scoped = sessionPanel(build, words, selection, sentence, opts.scope);
  const refused = opts.rejected?.[targetKey(build, selection, words)];
  const panel: Panel = refused ? blockRejectedOptions(scoped, refused) : scoped;

  const questions: DecisionQuestion[] = panel.groups.map((g) => {
    const role: QuestionRole = g.role ?? (g.optional ? 'offer' : 'required');
    const reason =
      g.roleReason ??
      (role === 'offer'
        ? 'an offer — the build can close without it'
        : 'a real choice the learner must make');
    return { id: g.id, question: g.question, role, reason, candidates: g.options.map(candidate) };
  });

  const done = isPanelComplete(panel);
  return {
    target: {
      selection,
      span: targetSpan(build, selection, words),
      subject: panel.subject,
    },
    known: facts(build),
    questions,
    activeQuestion: panel.step,
    completion: done
      ? questions.some((q) => q.role === 'deferred')
        ? 'waiting-for-structure'
        : 'complete'
      : 'open',
  };
}

/**
 * A snapshot as one readable block, for failure messages and the console.
 * Every fact in it comes from the snapshot — this formats, it never deduces.
 */
export function describeDecision(d: DecisionSnapshot): string {
  const lines: string[] = [];
  lines.push(
    `target ${d.target.subject || '(nothing)'} ` +
      `span=${d.target.span ? d.target.span.join('-') : '·'} — ${d.completion}`,
  );
  if (d.known.length > 0) {
    lines.push(
      'known: ' +
        d.known
          .filter((f) => f.word === undefined)
          .map((f) => `${f.form}/${f.function ?? '·'}@${f.span.join('-')}`)
          .join(' '),
    );
  }
  for (const q of d.questions) {
    const live = q.id === d.activeQuestion ? '*' : ' ';
    lines.push(`${live}${q.id} [${q.role}] ${q.reason}`);
    for (const c of q.candidates) {
      if (c.availability === 'not-applicable') continue;
      const rank = c.rank !== null ? ` #${c.rank}` : '';
      const key = c.action.hotkey ? ` (${c.action.hotkey})` : '';
      lines.push(`   ${c.availability === 'blocked' ? '×' : '·'} ${c.action.key}${rank}${key}`);
    }
  }
  return lines.join('\n');
}
