/**
 * Contextual label suggestions.
 *
 * The chooser used to open on `Noun` whatever the learner had selected,
 * because the cursor followed taxonomy order. That is a reference sheet, not a
 * decision surface.
 *
 * ## What this may and may not look at
 *
 * Every signal below is visible in the SENTENCE — the word's spelling, its
 * membership of a closed class, the shape of the span, what the learner has
 * already built. **The gold answer is never an input.** Ranking by the fixture's
 * own reading would quietly hand over the answer and turn an exercise into a
 * clicking game; feedback after a pick may use it, ordering before one may not.
 *
 * Nothing here is probabilistic and nothing shows a score. Each suggestion
 * carries the grammatical evidence that put it there, in the same voice as the
 * formal tests — because the evidence is the thing worth learning.
 */
import type { Form, Span, Word, WordForm } from './types.ts';

export interface Suggestion {
  form: Form;
  /** Lower sorts first. Not shown to the learner. */
  rank: number;
  /** Why this is being offered, in a learner's language. */
  evidence: string;
}

/* --------------------------------------------------------- closed classes */

const CLOSED: { form: WordForm; words: string[]; evidence: string }[] = [
  {
    form: 'Det',
    words: [
      'the',
      'a',
      'an',
      'this',
      'that',
      'these',
      'those',
      'my',
      'your',
      'his',
      'her',
      'its',
      'our',
      'their',
      'some',
      'any',
      'every',
      'each',
      'no',
      'both',
      'either',
    ],
    evidence: 'the, a, this, my — starts a noun phrase',
  },
  {
    form: 'Pron',
    words: [
      'i',
      'you',
      'he',
      'she',
      'it',
      'we',
      'they',
      'me',
      'him',
      'us',
      'them',
      'who',
      'whom',
      'whose',
      'myself',
      'himself',
      'herself',
      'itself',
      'themselves',
    ],
    evidence: 'stands in for a whole noun phrase — try replacing it with a name',
  },
  {
    form: 'P',
    words: [
      'in',
      'on',
      'at',
      'with',
      'of',
      'for',
      'to',
      'from',
      'by',
      'about',
      'into',
      'onto',
      'over',
      'under',
      'through',
      'between',
      'against',
      'without',
      'during',
      'before',
      'after',
      'above',
      'below',
      'across',
      'toward',
      'towards',
      'upon',
    ],
    evidence: 'takes an object after it — “in the market”',
  },
  {
    form: 'Aux',
    words: [
      'is',
      'am',
      'are',
      'was',
      'were',
      'be',
      'been',
      'being',
      'have',
      'has',
      'had',
      'will',
      'would',
      'shall',
      'should',
      'can',
      'could',
      'may',
      'might',
      'must',
      'do',
      'does',
      'did',
    ],
    evidence: 'helps another verb — is going, has left, will run',
  },
  { form: 'Conj', words: ['and', 'but', 'or', 'nor', 'yet', 'so'], evidence: 'joins two equals' },
  {
    form: 'Subord',
    words: [
      'because',
      'although',
      'though',
      'while',
      'since',
      'unless',
      'whereas',
      'if',
      'whether',
    ],
    evidence: 'starts a clause that leans on the main one',
  },
  {
    form: 'Num',
    words: [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'first',
      'second',
      'third',
    ],
    evidence: 'counts or orders',
  },
];

/* ------------------------------------------------------------- morphology */

const SUFFIX: { form: WordForm; test: RegExp; evidence: (w: string) => string }[] = [
  { form: 'Adv', test: /ly$/, evidence: () => 'ends in -ly — try putting “very” in front' },
  {
    form: 'V',
    test: /(ed|ing)$/,
    evidence: (w) => `${w} — does it change for tense? walk / walked / walking`,
  },
  {
    form: 'Adj',
    test: /(ous|ful|ive|able|ible|al|ic|ish|less|y)$/,
    evidence: () => 'looks like a describing word — try putting “very” in front',
  },
  {
    form: 'N',
    test: /(tion|sion|ness|ment|ity|ance|ence|ship|hood|ist|er|or)$/,
    evidence: () => 'looks like a naming word — try putting “the” in front',
  },
];

/** `be` in any form: the one verb whose type the course names after it. */
const BE = ['is', 'am', 'are', 'was', 'were', 'be', 'been', 'being'];

/** Suggestions for a ONE-WORD selection, best first. */
function forWord(word: Word): Suggestion[] {
  // Punctuation takes no label, so there is nothing to point at.
  if (word.upos === 'PUNCT') return [];
  const w = word.text.toLowerCase().replace(/[^a-z']/g, '');
  const out: Suggestion[] = [];

  for (const c of CLOSED) {
    if (c.words.includes(w)) out.push({ form: c.form, rank: 0, evidence: c.evidence });
  }
  // `is/are/was` are auxiliaries only when they help another verb; standing
  // alone they are the main verb. Offer both rather than choosing for them.
  if (BE.includes(w)) {
    out.push({ form: 'V', rank: 1, evidence: 'as the main verb — “The keys ARE on the table”' });
  }
  for (const s of SUFFIX) {
    if (s.test.test(w) && !out.some((o) => o.form === s.form)) {
      out.push({ form: s.form, rank: 2, evidence: s.evidence(word.text) });
    }
  }
  // A capitalised word that is not sentence-initial names something.
  if (word.i > 0 && /^[A-Z]/.test(word.text) && !out.some((o) => o.form === 'N')) {
    out.push({ form: 'N', rank: 2, evidence: 'capitalised mid-sentence — it names something' });
  }
  // Nothing matched: nouns and verbs are where an unmarked word usually lands.
  if (out.length === 0) {
    out.push({ form: 'N', rank: 3, evidence: 'try “the” in front of it' });
    out.push({ form: 'V', rank: 3, evidence: 'try changing its tense' });
  }
  return out;
}

/** Suggestions for a MULTI-WORD selection: a run of words is a phrase. */
function forSpan(words: Word[], span: Span): Suggestion[] {
  const first = words[span[0]]!;
  const lastWord = words[span[1]]!;
  const f = first.text.toLowerCase();
  const out: Suggestion[] = [];

  const isPrep = CLOSED.find((c) => c.form === 'P')!.words.includes(f);
  const startsDet = CLOSED.find((c) => c.form === 'Det')!.words.includes(f);

  if (isPrep) {
    out.push({
      form: 'PP',
      rank: 0,
      evidence: `starts with “${first.text}” and takes a noun phrase after it`,
    });
  }
  if (startsDet) {
    out.push({
      form: 'NP',
      rank: 0,
      evidence: `starts with “${first.text}” — try replacing the whole run with “it”`,
    });
  }
  if (BE.includes(f) || /(ed|ing|s)$/.test(f)) {
    out.push({
      form: 'VP',
      rank: 1,
      evidence: `starts at “${first.text}” and runs to the end of what it governs`,
    });
  }
  if (out.length === 0) {
    out.push({ form: 'NP', rank: 2, evidence: 'try replacing the whole run with “it” or “they”' });
    out.push({
      form: 'VP',
      rank: 2,
      evidence: `does it start at the verb and run through “${lastWord.text}”?`,
    });
  }
  return out;
}

/**
 * Ranked suggestions for a selection, best first, deduplicated.
 * @param limit how many to surface before "more labels" — 2 to 4 is the range
 *              a learner can weigh without scanning.
 */
export function suggest(words: Word[], span: Span, limit = 3): Suggestion[] {
  const raw = span[0] === span[1] ? forWord(words[span[0]]!) : forSpan(words, span);
  const seen = new Set<Form>();
  return raw
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .filter((s) => (seen.has(s.form) ? false : (seen.add(s.form), true)))
    .slice(0, limit);
}
