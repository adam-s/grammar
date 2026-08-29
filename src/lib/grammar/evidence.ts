/**
 * What the visible sentence and the visible diagram say a selection is.
 *
 * This is the ranking layer, and it obeys one law: **legality comes before
 * ranking**. It only ever decorates candidates the structural rules have
 * already admitted — a spelling heuristic can put a move first, but it can
 * never put a move on the table, and `options.ts` applies availability before
 * it consults anything here.
 *
 * Evidence has a declared strength order, strongest first:
 *
 *   1. established diagram structure — a node the learner has already built
 *      and had accepted (rank -1);
 *   2. closed-class membership and exact visible words (rank 0);
 *   3. phrase-shape evidence — what the span starts with (rank 0–1);
 *   4. suffix and fallback guesses (rank 2–3).
 *
 * The order is the lesson of every recent suggestion bug: *shoes* looks like a
 * verb until its N node exists, *my* looks like an adjective until the closed
 * determiner class is consulted, and *The …* looks like an NP until the
 * diagram shows a subject already followed by its predicate. Tier 1 lives
 * here; tiers 2–4 are `suggest.ts`, which sees only the words.
 *
 * **The gold answer is never an input.** Ranking by the stored reading would
 * hand over the answer; feedback after a pick may use it, ordering before one
 * may not.
 */
import { rootAt, roots, type BuildState } from './builder.ts';
import { suggest, type Suggestion } from './suggest.ts';
import type { Form, Span, Word } from './types.ts';

/** The rank establishing structure suggests at — ahead of every lexical tier. */
const ESTABLISHED = -1;

/**
 * Ranked form evidence for a span, best first, at most three.
 *
 * Spelling is useful before a word is named and weaker afterwards. In
 * “shoes on my feet”, the final -s makes `shoes` look verb-like in isolation,
 * but a visible N node settles that question. If a determiner is waiting just
 * before the run, the noun and what follows are the nominal it points at.
 */
export function formEvidence(state: BuildState, words: Word[], span: Span): Suggestion[] {
  const guessed = suggest(words, span);
  if (span[0] === span[1]) return guessed;
  const selected = roots(state)
    .map((id) => state.constituents[id]!)
    .filter((c) => c.span[0] >= span[0] && c.span[1] <= span[1]);
  if (
    selected[0]?.span[0] === span[0] &&
    selected.at(-1)?.span[1] === span[1] &&
    selected.some((c) => c.function === 'subject') &&
    selected.some((c) => c.function === 'predicate')
  ) {
    return [
      {
        form: 'S' as const,
        rank: ESTABLISHED,
        evidence: 'the diagram already shows a subject followed by its predicate',
      },
      ...guessed.filter((s) => s.form !== 'S'),
    ].slice(0, 3);
  }
  if (
    selected[0]?.span[0] === span[0] &&
    selected.at(-1)?.span[1] === span[1] &&
    selected.some((c) => c.function === 'subject') &&
    selected.some((c) => c.form === 'V' || c.form === 'Aux' || c.form === 'VP')
  ) {
    return [
      {
        form: 'S' as const,
        rank: ESTABLISHED,
        evidence: 'the diagram already shows a subject and the rest begins with a verb',
      },
      ...guessed.filter((s) => s.form !== 'S'),
    ].slice(0, 3);
  }
  const firstId = rootAt(state, span[0]);
  const first = firstId ? state.constituents[firstId] : null;
  if (!first || first.span[0] !== span[0]) return guessed;

  const beforeId = span[0] > 0 ? rootAt(state, span[0] - 1) : null;
  const before = beforeId ? state.constituents[beforeId] : null;
  if (first.form === 'N') {
    const form: Form = before?.form === 'Det' && before.span[1] === span[0] - 1 ? 'Nom' : 'NP';
    return [
      {
        form,
        rank: ESTABLISHED,
        evidence:
          form === 'Nom'
            ? 'what the determiner points at — replace the whole run with “ones”'
            : 'starts with a noun — try replacing the whole run with “it” or “they”',
      },
      ...guessed.filter((s) => s.form !== 'VP' && s.form !== form),
    ].slice(0, 3);
  }
  const known: Partial<Record<Form, Form>> = {
    Det: 'NP',
    Pron: 'NP',
    P: 'PP',
    V: 'VP',
    Aux: 'VP',
  };
  const form = known[first.form];
  if (!form) return guessed;
  return [
    {
      form,
      rank: ESTABLISHED,
      evidence: `starts with the ${first.form} already labelled on the diagram`,
    },
    ...guessed.filter((s) => s.form !== form),
  ].slice(0, 3);
}
