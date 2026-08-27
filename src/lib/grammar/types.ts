/**
 * The contract (S01). Everything in the project reads or writes these shapes:
 * the Python pipeline emits them, the audits check them, the layout consumes
 * them, the grader compares against them.
 *
 * Authority: docs/content-model.md and docs/taxonomy.md. Change those first.
 *
 * Browser-free by construction — no DOM import may ever appear in this file
 * or its neighbours in core/, because `node --test` is the first gate.
 */

/* ------------------------------------------------------------------ words */

/** Coarse word class (UPOS-ish), what the learner sees. */
export type Upos =
  | 'NOUN'
  | 'PROPN'
  | 'VERB'
  | 'AUX'
  | 'ADJ'
  | 'ADV'
  | 'ADP'
  | 'DET'
  | 'PRON'
  | 'CCONJ'
  | 'SCONJ'
  | 'NUM'
  | 'PART'
  | 'INTJ'
  | 'PUNCT'
  | 'X';

/**
 * One surface word. `i` IS the word order — it is the array index and the
 * address (`w0`, `w1`, ...). Words never move; nothing may reorder this list.
 */
export interface Word {
  i: number;
  text: string;
  upos: Upos;
  /** Penn fine tag (VBD, NNS, JJR). Teaches the formal inflection tests. */
  xpos: string;
  lemma: string;
}

/* ----------------------------------------------------------------- labels */

/** Phrase-level form — what a constituent IS. Drives the node hue. */
export type PhraseForm = 'S' | 'NP' | 'VP' | 'PP' | 'AdjP' | 'AdvP' | 'Cl';

/** Word-level form — the part of speech as the course names it. */
export type WordForm =
  | 'N'
  | 'V'
  | 'Adj'
  | 'Adv'
  | 'P'
  | 'Det'
  | 'Pron'
  | 'Aux'
  | 'Conj'
  | 'Subord'
  | 'Part'
  | 'Num'
  | 'Interj';

export type Form = PhraseForm | WordForm;

export const PHRASE_FORMS: readonly PhraseForm[] = ['S', 'NP', 'VP', 'PP', 'AdjP', 'AdvP', 'Cl'];
export const WORD_FORMS: readonly WordForm[] = [
  'N',
  'V',
  'Adj',
  'Adv',
  'P',
  'Det',
  'Pron',
  'Aux',
  'Conj',
  'Subord',
  'Part',
  'Num',
  'Interj',
];

/** Subtype for `Cl`, so a relative clause is distinguishable from a nominal one. */
export type ClauseKind = 'relative' | 'nominal' | 'adverbial' | 'comparative';

/**
 * Function — what a constituent DOES. Orthogonal to form: a PP may be an
 * adverbial, a postmodifier, or a complement. Keeping these two axes separate
 * is the whole point (docs/taxonomy.md §3).
 */
export type ClauseFunction =
  | 'subject'
  | 'predicate'
  | 'directObject'
  | 'indirectObject'
  | 'subjectComplement'
  | 'objectComplement'
  | 'adverbial';

export type PhraseInternalFunction =
  | 'head'
  | 'determiner'
  | 'premodifier'
  | 'postmodifier'
  | 'complement'
  | 'coordinate'
  | 'appositive'
  /** The word that introduces a clause: *__that__ he left*, *__because__ it broke*. */
  | 'marker';

export type Func = ClauseFunction | PhraseInternalFunction;

export const CLAUSE_FUNCTIONS: readonly ClauseFunction[] = [
  'subject',
  'predicate',
  'directObject',
  'indirectObject',
  'subjectComplement',
  'objectComplement',
  'adverbial',
];
export const PHRASE_INTERNAL_FUNCTIONS: readonly PhraseInternalFunction[] = [
  'head',
  'determiner',
  'premodifier',
  'postmodifier',
  'complement',
  'coordinate',
  'appositive',
  'marker',
];

/** The spine of the course. Six, in Morenberg's order. */
export type VerbType = 'Vbe' | 'Vlink' | 'Vint' | 'Vtr' | 'Vg' | 'Vc';
export const VERB_TYPES: readonly VerbType[] = ['Vbe', 'Vlink', 'Vint', 'Vtr', 'Vg', 'Vc'];

/** Quirk et al. clause type, stored alongside — the mainstream anchor. */
export type ClauseType = 'SV' | 'SVO' | 'SVC' | 'SVA' | 'SVOO' | 'SVOC' | 'SVOA';

/* ---------------------------------------------------------- constituents */

/**
 * A node in the diagram. Stored FLAT and keyed, not nested: problems address
 * constituents by id, the grader compares by id, flat maps diff cleanly in
 * git, and it is already the shape the tidy-tree layout consumes.
 *
 * `children` holds CONSTITUENT ids only. Every word is wrapped in a word-level
 * leaf node carrying `word`, so that a determiner or a premodifier can state
 * its function — a bare `w7` in a child list could not. The consequence is the
 * property the layout wants anyway: **the leaves of the tree are the words, in
 * surface order.**
 */
export interface Constituent {
  form: Form;
  /** null only for the root `S`. */
  function: Func | null;
  /** null only for the root. */
  parent: string | null;
  /** Child constituent ids, in surface order. Empty for a word leaf. */
  children: string[];
  /** Inclusive word-index range. Derivable from children; stored and re-checked. */
  span: [number, number];
  /** Present iff this is a word leaf: the index into `SentenceEntry.words`. */
  word?: number;
  /** For `form: 'Cl'`. */
  clauseKind?: ClauseKind;
  /**
   * For `form: 'V'` — which of Morenberg's six this verb is.
   *
   * Stored on the verb rather than on the sentence because a sentence can hold
   * more than one clause, and each clause's verb licenses its own slots. See
   * `clause.ts` for how a constituent finds the verb that governs it.
   */
  verbType?: VerbType;
  /** For a clause node (`S` or `Cl`): the slot pattern its verb produced. */
  clauseType?: ClauseType;
  /**
   * S V O A / obligatory-adverbial decision (docs/taxonomy.md §2). An
   * obligatory adverbial is one the verb REQUIRES — drop it and the sentence
   * breaks: *The keys are on the table*, *She put the book on the shelf*.
   * Encoded as a property of the adverbial rather than a seventh verb type,
   * because `Vbe` needs the distinction regardless.
   */
  obligatory?: boolean;
}

export type ConstituentMap = Record<string, Constituent>;

/* -------------------------------------------------------------- readings */

export type ReadingStatus = 'canonical' | 'alternate' | 'blocked';

/**
 * One analysis of a sentence. A sentence has readings, not a parse — ambiguity
 * is a reading, not an error (docs/content-model.md).
 */
export interface Reading {
  id: string;
  status: ReadingStatus;
  /** What THIS reading means, in words. Primary content, never generated at runtime. */
  gloss: string;
  /** For `status: 'blocked'` — why the surrounding passage rules it out. */
  blockedBy?: string;
  constituents: ConstituentMap;
}

export interface SentenceSource {
  work: string;
  gutenbergId: number;
  locator: string;
  translation?: string;
}

export interface SentenceMetrics {
  tokens: number;
  clauses: number;
  depth: number;
}

export interface SentenceProvenance {
  parser: string;
  reviewedBy: string;
  reviewedAt: string;
  audits: 'pass' | 'fail';
}

export interface SentenceEntry {
  id: string;
  text: string;
  source: SentenceSource;
  words: Word[];
  readings: Reading[];
  /** Reading id that matches what the source passage actually means. */
  canonicalId: string;
  /** Index for problem authoring: "sentences with Vg and a relative clause". */
  features: string[];
  metrics: SentenceMetrics;
  provenance: SentenceProvenance;
}

/* -------------------------------------------------------------- problems */

export type TaskKind =
  'classify-verb' | 'label-spans' | 'click-the-part' | 'reattach' | 'find-alternate';

export interface Problem {
  id: string;
  chapter: number;
  sentenceId: string;
  readingId: string;
  task: TaskKind;
  /** Constituent ids pre-placed for the learner. */
  given: string[];
  /** Constituent ids the learner must produce. */
  toFind: string[];
  hints?: string[];
}

/* -------------------------------------------------------------- glossary */

export interface GlossaryEntry {
  short: string;
  test?: string;
  example?: string;
  seeAlso?: string[];
}

export type Glossary = Record<string, GlossaryEntry>;

/* --------------------------------------------------------------- helpers */

/** A word leaf is a constituent that wraps exactly one word. */
export function isLeaf(c: Constituent): boolean {
  return c.word !== undefined;
}

export function isPhraseForm(f: Form): f is PhraseForm {
  return (PHRASE_FORMS as readonly string[]).includes(f);
}

export function isWordForm(f: Form): f is WordForm {
  return (WORD_FORMS as readonly string[]).includes(f);
}

export function canonicalReading(s: SentenceEntry): Reading {
  const r = s.readings.find((x) => x.id === s.canonicalId);
  if (!r) throw new Error(`${s.id}: canonicalId "${s.canonicalId}" is not a reading`);
  return r;
}

/** The form hue index a node paints with: NP=0 VP=1 PP=2 AdjP=3 AdvP=4 Cl=5. */
export function hueSlot(form: Form): number {
  switch (form) {
    case 'NP':
    case 'N':
    case 'Pron':
    case 'Det':
    case 'Num':
      return 0;
    case 'VP':
    case 'V':
    case 'Aux':
      return 1;
    case 'PP':
    case 'P':
      return 2;
    case 'AdjP':
    case 'Adj':
      return 3;
    case 'AdvP':
    case 'Adv':
      return 4;
    case 'Cl':
    case 'S':
    case 'Subord':
    case 'Conj':
      return 5;
    default:
      return 5;
  }
}

/** Inclusive word-index range. */
export type Span = [number, number];
