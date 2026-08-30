/**
 * What the learner is told, composed in one place.
 *
 * Grading decides WHETHER an answer holds; this module decides the WORDS. The
 * two were tangled in the session transaction, and the words suffered for it:
 * a first miss said "Not a verb." into the void, naming neither the words the
 * learner had selected nor the claim they had just made, so the correction
 * read as a generic contradiction. Every sentence here now names its subject.
 *
 * The hint ladder is preserved exactly:
 *
 * - A FIRST miss restates the learner's claim and shows the test for it —
 *   never the answer. "“Birds” is not a verb. A verb changes with time…"
 *   Watching your own claim fail is the lesson; being handed the answer is
 *   not.
 * - A SECOND miss gives the grader's reason, which does name the truth,
 *   because by then guessing is what is happening.
 * - A structural refusal skips the ladder: the label may be right and still
 *   unbuildable over these words, so the reason gives nothing away.
 *
 * Form and function part ways in one word: a form claim is about what the
 * words ARE ("is not a verb"), while a function or verb-use claim is about
 * this sentence ("is not the subject HERE"), because the same words do
 * different jobs in different company.
 */

/** What the learner is told after a decision. */
export interface Verdict {
  kind: 'correct' | 'alternate' | 'wrong';
  text: string;
  test?: string;
}

/**
 * Which kind of claim the option makes, from the option's own fields.
 * `form` claims what the words are; everything else claims what they are
 * doing, or how this use behaves, in THIS sentence.
 */
export function familyOf(option: {
  form?: unknown;
  func?: unknown;
  verbType?: unknown;
  voice?: unknown;
  auxKind?: unknown;
  clauseKind?: unknown;
  finiteness?: unknown;
  partKind?: unknown;
}): 'form' | 'contextual' {
  if (
    option.func ||
    option.verbType ||
    option.voice ||
    option.auxKind ||
    option.clauseKind ||
    option.finiteness ||
    option.partKind
  ) {
    return 'contextual';
  }
  return 'form';
}

export type FeedbackInput = {
  outcome: 'correct' | 'alternate' | 'wrong';
  /** The selected words as the panel titles them, quotes included: “Birds”. */
  subject: string;
  /** How many misses THIS question now has, counting this one. */
  misses: number;
  family: 'form' | 'contextual';
  /** The refused claim with its article: “a verb”, “the subject”. */
  refused?: string;
  praise?: string;
  /** The grader's reason and formal test — the second-miss truth. */
  reason?: string;
  test?: string;
  /** The formal test for the CLAIMED label — the first-miss cue. */
  firstMiss?: string;
  /** A refusal about the selection's shape, exempt from the ladder. */
  structural?: boolean;
  /** For an alternate reading: what it means, and what this sentence means. */
  gloss?: string;
  canonicalGloss?: string;
};

/** One decision's feedback, worded for the learner. */
export function composeVerdict(input: FeedbackInput): Verdict {
  if (input.outcome === 'correct') {
    return { kind: 'correct', text: `Yes — ${input.praise}.` };
  }
  if (input.outcome === 'alternate') {
    return {
      kind: 'alternate',
      text: `Also correct, but it means something else: ${input.gloss}`,
      test: `Here it means: ${input.canonicalGloss}`,
    };
  }
  if (input.structural) {
    return { kind: 'wrong', text: input.reason ?? '', test: input.test };
  }
  if (input.misses <= 1) {
    const here = input.family === 'contextual' ? ' here' : '';
    return {
      kind: 'wrong',
      text: `${input.subject} is not ${input.refused}${here}.`,
      test: input.firstMiss,
    };
  }
  return { kind: 'wrong', text: input.reason ?? '', test: input.test };
}

/**
 * The one spoken line for the live region: everything the verdict says, once.
 * Kept beside the composer so the announced words and the shown words cannot
 * drift apart.
 */
export function spokenVerdict(verdict: Verdict): string {
  return [verdict.text, verdict.test].filter(Boolean).join(' ');
}

/**
 * Capitalise a composed fragment and close it as a sentence — WITHOUT
 * stacking punctuation. The old version appended a full stop unconditionally,
 * so a test that ends in its own question mark rendered as "…the verb —
 * WHAT?." in front of the learner.
 */
export function sentenceCase(text: string): string {
  const trimmed = text.trimEnd();
  const terminal = /[.?!]$/.test(trimmed) ? '' : '.';
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}${terminal}`;
}
