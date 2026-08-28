/**
 * The contract (S01). Everything in the project reads or writes these shapes:
 * the Python pipeline emits them, the audits check them, the layout consumes
 * them, the grader compares against them.
 *
 * This file IS the authority. It used to point at two documents for that, and
 * neither was ever written — a pointer to nothing reads as though the decision
 * was made somewhere careful.
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
  /**
   * Forms of this word that cannot be worked out from it.
   *
   * The passive needs a participle — *broke* becomes *broken* — and nothing in
   * the spelling says so. A rule can derive a regular verb and cannot tell a
   * regular verb from an irregular one it has never met, so *smite* comes out
   * as *smited* with exactly as much confidence as *repaired*.
   *
   * So whoever writes the sentence writes the form. They know it; a rule does
   * not. Absent means "derive it and say that you did", which is safe for the
   * overwhelming majority and honest about the rest.
   *
   * See `morphology.ts` for the shape and for the fallback order.
   */
  forms?: Record<string, string>;
}

/* ----------------------------------------------------------------- labels */

/** Phrase-level form — what a constituent IS. Drives the node hue. */
export type PhraseForm = 'S' | 'NP' | 'Nom' | 'DP' | 'VP' | 'PP' | 'AdjP' | 'AdvP' | 'Cl';

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

export const PHRASE_FORMS: readonly PhraseForm[] = [
  'S',
  'NP',
  'Nom',
  'DP',
  'VP',
  'PP',
  'AdjP',
  'AdvP',
  'Cl',
];
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
export type ClauseKind =
  'relative' | 'nominal' | 'interrogative' | 'exclamative' | 'adverbial' | 'comparative';

/**
 * What verb form a clause has — a separate axis from what kind of clause it is.
 *
 * *what he wants* and *what to want* are both nominal clauses; one has a tensed
 * verb and the other does not. Kind says what job the clause does, finiteness
 * says what shape its verb is in, and neither predicts the other.
 *
 * Absent means finite, which is the ordinary case.
 */
export type Finiteness = 'finite' | 'infinitival' | 'participial' | 'gerund-participial';
export const FINITENESS: readonly Finiteness[] = [
  'finite',
  'infinitival',
  'participial',
  'gerund-participial',
];

/**
 * Which kind of `Part` a word is.
 *
 * *She wants **to** leave* and *She looked **up** the word* both hold a word
 * the course calls a particle, and they are doing unrelated jobs: the first
 * marks a verb with no tense, the second belongs to the verb beside it. The
 * broad class stays; the subtype separates them.
 */
export type PartKind = 'infinitival' | 'verbal';
export const PART_KINDS: readonly PartKind[] = ['infinitival', 'verbal'];

/**
 * What an auxiliary is doing.
 *
 * *has*, *is*, *was*, *will* and *did* are one word class and five jobs, and
 * the job is what a reader has to recover. *was repaired* is passive and *was
 * repairing* is not, and the auxiliary is the one thing they share — the job
 * is legible only from the verb after it. That is the whole reason this is
 * stored rather than read off the word: the corpus holds *was* as a passive
 * auxiliary in `fix-passive` and as a progressive one in lesson 24, and
 * nothing about the spelling tells them apart.
 *
 * Modals are the odd one out — they carry no slots of their own, which is why
 * they sit outside Morenberg's six rather than inside them.
 */
export type AuxKind = 'modal' | 'perfect' | 'progressive' | 'passive' | 'do';
export const AUX_KINDS: readonly AuxKind[] = ['modal', 'perfect', 'progressive', 'passive', 'do'];

/**
 * Function — what a constituent DOES. Orthogonal to form: a PP may be an
 * adverbial, a postmodifier, or a complement. Keeping these two axes separate
 * is the whole point: it is what lets *the engine* be a noun phrase whatever
 * job it happens to be doing.
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
  /**
   * A helping verb, inside the verb phrase it helps: *was __repaired__*,
   * *__has been__ repairing*. It is not the head — Morenberg treats the whole
   * run as one verb doing one job — and it repeats, because English stacks
   * them.
   */
  | 'auxiliary'
  | 'determiner'
  | 'premodifier'
  | 'postmodifier'
  | 'complement'
  | 'coordinate'
  /** The word that joins the coordinates: *and*, *but*, *or*. Not one of them. */
  | 'coordinator'
  /**
   * Fronted material at the head of a clause, answering to a gap further in:
   * *__What__ did she repair __?*
   */
  | 'prenucleus'
  /**
   * Material at the tail of a clause that belongs earlier in it: *A man came in
   * __who I knew__*, where the relative clause modifies *a man* and is said
   * after the verb.
   *
   * English moves heavy material rightwards rather than leaving it in the
   * middle. Writing it where it is said, with a link back to what it belongs
   * to, is how the diagram says both things at once — and is why the tree does
   * not need a node whose pieces are apart.
   */
  | 'postnucleus'
  /**
   * The placeholder *it* standing in the subject slot while the content sits
   * at the end: *__It__ is a good thing that we left.*
   *
   * Named for the placeholder rather than for what moved. CGEL's "displaced
   * subject" is the other half — the clause at the end — so calling this one
   * displaced would mean the opposite of what the yardstick means by it.
   */
  | 'placeholderSubject'
  /** The clause the placeholder is standing in for, moved to the end. */
  | 'extraposed'
  /**
   * What an existential sentence is actually about, sitting after the verb
   * while *there* holds the subject slot: *There is __a problem__.*
   */
  | 'displaced'
  /** A particle that belongs to its verb: the *up* in *looked up the word*. */
  /**
   * A part of a name that has no head worth arguing about: *__New__ York*.
   * Every piece is `flat`, and none of them is the one the phrase is named
   * after.
   */
  | 'flat'
  | 'particle'
  /**
   * Sentence-edge material that is not integrated into the clause: an
   * interjection, a parenthetical, an aside. It is in the sentence without
   * filling any of its slots.
   */
  | 'supplement'
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
  'auxiliary',
  'determiner',
  'premodifier',
  'postmodifier',
  'complement',
  'coordinate',
  'coordinator',
  'prenucleus',
  'postnucleus',
  'placeholderSubject',
  'extraposed',
  'displaced',
  'flat',
  'particle',
  'supplement',
  'appositive',
  'marker',
];

/** The spine of the course. Six, in Morenberg's order. */
export type VerbType = 'Vbe' | 'Vlink' | 'Vint' | 'Vtr' | 'Vg' | 'Vc';
export const VERB_TYPES: readonly VerbType[] = ['Vbe', 'Vlink', 'Vint', 'Vtr', 'Vg', 'Vc'];

/**
 * Active or passive.
 *
 * *The mechanic repaired the engine* and *The engine was repaired* describe the
 * same event and put different things in the subject, so voice is a fact about
 * the sentence, not about its meaning. Recorded on the verb rather than on the
 * clause for the same reason `verbType` is: a learner names the verb long
 * before the clause above it exists, and a sentence can hold one passive clause
 * inside an active one.
 *
 * Absent means active. Only a verb that takes an object has a passive.
 */
export type Voice = 'active' | 'passive';
export const VOICES: readonly Voice[] = ['active', 'passive'];

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
  /** For a clause node (`S` or `Cl`): what verb form it has. Absent means finite. */
  finiteness?: Finiteness;
  /** For `form: 'Part'` — infinitival *to*, or a particle belonging to a verb. */
  partKind?: PartKind;
  /** For `form: 'Aux'` — which of the five jobs this auxiliary is doing. */
  auxKind?: AuxKind;
  /**
   * A second job this node is doing at the same time as `function`.
   *
   * *__Most__ were gone* has no noun for *most* to determine, so *most* is the
   * determiner AND the head of the phrase. *The __poor__ complained* is the
   * same shape one level down: *poor* modifies and heads at once.
   *
   * Additive on purpose. `function` still holds the job the tree is built on —
   * always `head`, since that is the one the phrase needs — so nothing that
   * walks the tree has to learn a second shape. CGEL calls this fusion of
   * functions and writes it Det-Head; this stores the other half.
   */
  fusedWith?: Func;
  /**
   * This node covers no words: a slot the sentence leaves empty.
   *
   * *The engine that stalled* has a subject inside the relative clause and no
   * word for it. *What did she repair?* has an object after *repair* and no
   * word for it. The slot is real — the verb requires it, and the sentence is
   * understood as though it were filled — so the diagram has to be able to draw
   * something that is there and empty.
   *
   * A gap's `span` runs BACKWARDS: `[at, at - 1]`, where `at` is the word it
   * sits before. That is the one encoding that says "no words" in a field whose
   * whole job is to name words, and `auditStructure` checks it.
   */
  gap?: true;
  /**
   * Ties a gap to the phrase that says what is missing.
   *
   * In *What did she repair?* the gap after *repair* and the word *What* are
   * the same thing said once: `index` is how the diagram says they are one.
   * A number, shared by exactly two nodes, meaning nothing on its own.
   */
  index?: number;
  /**
   * For `form: 'V'` — which of Morenberg's six this verb is.
   *
   * Stored on the verb rather than on the sentence because a sentence can hold
   * more than one clause, and each clause's verb licenses its own slots. See
   * `clause.ts` for how a constituent finds the verb that governs it.
   */
  verbType?: VerbType;
  /**
   * For `form: 'V'` — active or passive. Absent means active.
   *
   * The passive moves an object into the subject slot, so it changes which
   * slots the verb's own frame still requires. `rules.ts` holds that table.
   */
  voice?: Voice;
  /** For a clause node (`S` or `Cl`): the slot pattern its verb produced. */
  clauseType?: ClauseType;
  /**
   * The S V O A decision. An
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
 * is a reading, not an error.
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
  /** The work it was taken from, or `constructed` when nobody took it. */
  work: string;
  /** Where in that work — or, for a constructed sentence, what it was made for. */
  locator: string;
  /** Only for a Project Gutenberg text. A constructed sentence has no id, and
      storing 0 to fill the field made every sentence look sourced. */
  gutenbergId?: number;
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
  metrics: SentenceMetrics;
  provenance: SentenceProvenance;
}

/* --------------------------------------------------------------- helpers */

/**
 * Punctuation is in the sentence and not in the tree.
 *
 * A comma is not a word class and not a constituent — it marks the sentence
 * rather than being part of what the sentence is built from. So it stays
 * visible and selectable, takes no label, and every rule that says "every word"
 * means every word but these.
 */
export function isPunctuation(word: Word): boolean {
  return word.upos === 'PUNCT';
}

/** Does this node cover no words? A gap, and nothing else, is empty. */
export function isEmpty(c: Constituent): boolean {
  return c.span[1] < c.span[0];
}

/** The word a gap sits before. One past the end of the sentence is legal. */
export function gapPosition(c: Constituent): number {
  return c.span[0];
}

/** The span of a gap sitting before word `at`. */
export function gapSpan(at: number): Span {
  return [at, at - 1];
}

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
    case 'Nom':
    case 'DP':
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
