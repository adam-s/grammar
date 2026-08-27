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
  ClauseKind,
  ClauseType,
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

    if (node.children.length === 0) {
      const wf = node.form as WordForm;
      const i = words.length;
      words.push({
        i,
        text: node.text ?? '?',
        upos: UPOS_OF[wf] ?? 'X',
        xpos: node.xpos ?? XPOS_OF[wf] ?? 'XX',
        lemma: node.lemma ?? (node.text ?? '?').toLowerCase(),
      });
      self.word = i;
      self.span = [i, i];
      if (node.obligatory) self.obligatory = true;
      if (node.clauseKind) self.clauseKind = node.clauseKind;
      if (node.verbType) self.verbType = node.verbType;
      if (node.voice === 'passive') self.voice = 'passive';
      if (node.clauseType) self.clauseType = node.clauseType;
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
    self.span = [lo, hi];
    if (node.obligatory) self.obligatory = true;
    if (node.clauseKind) self.clauseKind = node.clauseKind;
    if (node.verbType) self.verbType = node.verbType;
    if (node.voice === 'passive') self.voice = 'passive';
    if (node.clauseType) self.clauseType = node.clauseType;
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
  return words
    .map((x) => x.text)
    .join(' ')
    .replace(/\s+([.,;:!?])/g, '$1');
}
