/**
 * A tiny builder for hand-authoring readings.
 *
 * Constituent maps are flat and keyed because that is what the layout, the
 * grader and git all want — but nobody can *write* one by hand without
 * mistakes. So authors write a nested literal and this assigns ids, computes
 * spans, wires parents, and derives the word list from the leaves in order.
 *
 * Used by the fixtures, the lab routes, and the pipeline's TypeScript-side
 * tests. Never used at runtime on shipped content, which is already flat.
 */
import type {
  AuxKind,
  ClauseKind,
  ClauseType,
  Finiteness,
  PartKind,
  Constituent,
  ConstituentMap,
  Form,
  Func,
  Reading,
  ReadingStatus,
  Upos,
  VerbType,
  Voice,
  Word,
  WordForm,
} from './types.ts';
import { joinWords } from './types.ts';

export interface SpecNode {
  /** null only for a punctuation token, which has no form because it has no node. */
  form: Form | null;
  function: Func | null;
  children: SpecNode[];
  /** Leaf only. */
  text?: string;
  xpos?: string;
  lemma?: string;
  clauseKind?: ClauseKind;
  /** On a clause node. Omitted means finite. */
  finiteness?: Finiteness;
  /** On a `Part` leaf. */
  partKind?: PartKind;
  /** On an `Aux` leaf. */
  auxKind?: AuxKind;
  /** A second job this node does at the same time as its function. */
  fusedWith?: Func;
  /** Word forms that cannot be worked out from the spelling: *broke* → *broken*. */
  forms?: Record<string, string>;
  /** This node covers no words. Its position comes from where it is written. */
  gap?: true;
  /** Ties a gap to its filler. Shared by exactly two nodes. */
  index?: number;
  obligatory?: boolean;
  /** On a `V` leaf. */
  verbType?: VerbType;
  /** On a `V` leaf. Omitted means active. */
  voice?: Voice;
  /** On a clause node. */
  clauseType?: ClauseType;
  /**
   * A punctuation token: a word in the sentence with no node above it.
   * It contributes to the word list and to nothing else.
   */
  punct?: true;
}

/** A phrase node. */
export function n(
  form: Form,
  fn: Func | null,
  children: SpecNode[],
  extra: Partial<SpecNode> = {},
): SpecNode {
  return { form, function: fn, children, ...extra };
}

/** A word leaf. */
export function w(form: WordForm, fn: Func, text: string, extra: Partial<SpecNode> = {}): SpecNode {
  return { form, function: fn, children: [], text, ...extra };
}

/**
 * A punctuation token. It joins the sentence and not the diagram.
 *
 * Written as a child of the node it sits inside, because that is where it sits
 * in the sentence; `build` emits the word and then leaves it out of the tree,
 * so no node ever claims it.
 */
export function pt(text: string): SpecNode {
  return { form: null, function: null, children: [], text, punct: true };
}

/**
 * A gap: a slot with no words in it.
 *
 * Written where it belongs in the sentence, which is how `build` knows the
 * position — the words before it have already been counted, so the gap sits
 * before whatever comes next.
 */
export function gap(form: Form, fn: Func, extra: Partial<SpecNode> = {}): SpecNode {
  return { form, function: fn, children: [], gap: true, ...extra };
}

const UPOS_OF: Record<WordForm, Upos> = {
  N: 'NOUN',
  V: 'VERB',
  Adj: 'ADJ',
  Adv: 'ADV',
  P: 'ADP',
  Det: 'DET',
  Pron: 'PRON',
  Aux: 'AUX',
  Conj: 'CCONJ',
  Subord: 'SCONJ',
  Part: 'PART',
  Num: 'NUM',
  Interj: 'INTJ',
};
const XPOS_OF: Record<WordForm, string> = {
  N: 'NN',
  V: 'VBD',
  Adj: 'JJ',
  Adv: 'RB',
  P: 'IN',
  Det: 'DT',
  Pron: 'PRP',
  Aux: 'VBZ',
  Conj: 'CC',
  Subord: 'IN',
  Part: 'RP',
  Num: 'CD',
  Interj: 'UH',
};

export interface BuiltReading {
  reading: Reading;
  words: Word[];
}

/**
 * Copy every optional property a spec node may carry onto the constituent.
 *
 * One place, because there are three branches that need it — word, phrase, gap
 * — and keeping three lists in step by hand went wrong twice: once silently
 * dropping `index` from leaves, once putting `fusedWith` on gaps and nowhere
 * else.
 */
function carry(self: Constituent, node: SpecNode): void {
  if (node.obligatory) self.obligatory = true;
  if (node.clauseKind) self.clauseKind = node.clauseKind;
  if (node.finiteness && node.finiteness !== 'finite') self.finiteness = node.finiteness;
  if (node.partKind) self.partKind = node.partKind;
  if (node.auxKind) self.auxKind = node.auxKind;
  if (node.verbType) self.verbType = node.verbType;
  if (node.voice === 'passive') self.voice = 'passive';
  if (node.clauseType) self.clauseType = node.clauseType;
  if (node.index !== undefined) self.index = node.index;
  if (node.fusedWith) self.fusedWith = node.fusedWith;
}

export function build(
  spec: SpecNode,
  meta: {
    id: string;
    status: ReadingStatus;
    gloss: string;
    blockedBy?: string;
  },
): BuiltReading {
  const cs: ConstituentMap = {};
  const words: Word[] = [];
  let seq = 0;

  const visit = (
    node: SpecNode,
    parent: string | null,
  ): { id: string; lo: number; hi: number } | null => {
    if (node.punct) {
      words.push({
        i: words.length,
        text: node.text ?? '?',
        upos: 'PUNCT',
        xpos: node.text === ',' ? ',' : '.',
        lemma: node.text ?? '?',
      });
      return null;
    }
    const id = `c${++seq}`;
    // Reserve the slot before recursing so children can name their parent.
    const self: Constituent = {
      form: node.form!,
      function: node.function,
      parent,
      children: [],
      span: [0, 0],
    };
    cs[id] = self;

    if (node.gap) {
      // No words, so the span runs backwards from where the gap sits.
      self.span = [words.length, words.length - 1];
      carry(self, node);
      self.gap = true;
      return { id, lo: Infinity, hi: -Infinity };
    }

    if (node.children.length === 0) {
      const wf = node.form as WordForm;
      const i = words.length;
      words.push({
        i,
        text: node.text ?? '?',
        upos: UPOS_OF[wf] ?? 'X',
        xpos: node.xpos ?? XPOS_OF[wf] ?? 'XX',
        lemma: node.lemma ?? (node.text ?? '?').toLowerCase(),
        ...(node.forms ? { forms: node.forms } : {}),
      });
      self.word = i;
      self.span = [i, i];
      carry(self, node);
      return { id, lo: i, hi: i };
    }

    let lo = Infinity;
    let hi = -Infinity;
    for (const kid of node.children) {
      const r = visit(kid, id);
      if (!r) continue; // punctuation: emitted as a word, never as a child
      self.children.push(r.id);
      lo = Math.min(lo, r.lo);
      hi = Math.max(hi, r.hi);
    }
    // A node whose only children are gaps is itself empty, and says so the same
    // way a gap does.
    self.span = lo <= hi ? [lo, hi] : [words.length, words.length - 1];
    carry(self, node);
    return { id, lo, hi };
  };

  visit(spec, null);

  return {
    reading: {
      id: meta.id,
      status: meta.status,
      gloss: meta.gloss,
      constituents: cs,
      ...(meta.blockedBy ? { blockedBy: meta.blockedBy } : {}),
    },
    words,
  };
}

/** Render the word list back to a sentence, so fixture text cannot drift. */
export function textOf(words: Word[]): string {
  return joinWords(words);
}
