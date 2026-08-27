import {
  CLAUSE_FUNCTIONS,
  PHRASE_FORMS,
  PHRASE_INTERNAL_FUNCTIONS,
  VERB_TYPES,
  WORD_FORMS,
  type ClauseKind,
  type Form,
  type Func,
  type VerbType,
} from './types.ts';

export const CLAUSE_KINDS = [
  'relative',
  'nominal',
  'adverbial',
  'comparative',
] as const satisfies readonly ClauseKind[];

export interface NodeVariant {
  id: string;
  description: string;
  form: Form;
  function?: Func;
  obligatory?: boolean;
  verbType?: VerbType;
  clauseKind?: ClauseKind;
}

export interface NodeVariantGroup {
  id: string;
  title: string;
  description: string;
  variants: readonly NodeVariant[];
}

const FUNCTION_FORM: Record<Func, Form> = {
  subject: 'NP',
  predicate: 'VP',
  directObject: 'NP',
  indirectObject: 'NP',
  subjectComplement: 'AdjP',
  objectComplement: 'AdjP',
  adverbial: 'AdvP',
  head: 'Pron',
  determiner: 'Det',
  premodifier: 'Adj',
  postmodifier: 'PP',
  complement: 'NP',
  coordinate: 'Subord',
  appositive: 'NP',
  marker: 'Subord',
};

const bareForms: NodeVariant[] = [...PHRASE_FORMS, ...WORD_FORMS].map((form) => ({
  id: `form-${form}`,
  description: `${form} with no qualifier`,
  form,
}));

const functions: NodeVariant[] = [...CLAUSE_FUNCTIONS, ...PHRASE_INTERNAL_FUNCTIONS].map((fn) => ({
  id: `function-${fn}`,
  description: `${fn} function`,
  form: FUNCTION_FORM[fn],
  function: fn,
}));
functions.splice(7, 0, {
  id: 'function-obligatory-adverbial',
  description: 'obligatory adverbial function',
  form: 'PP',
  function: 'adverbial',
  obligatory: true,
});

const verbTypes: NodeVariant[] = VERB_TYPES.map((verbType) => ({
  id: `verb-${verbType}`,
  description: `${verbType} with head and subtype qualifiers`,
  form: 'V',
  function: 'head',
  verbType,
}));

const clauseKinds: NodeVariant[] = CLAUSE_KINDS.map((clauseKind) => ({
  id: `clause-${clauseKind}`,
  description: `${clauseKind} clause with a direct-object function`,
  form: 'Cl',
  function: 'directObject',
  clauseKind,
}));

/**
 * A finite visual inventory, organized by the independent axes that alter a
 * node label. We intentionally do not multiply every form by every function:
 * the renderer's geometry depends only on the visible strings, and each such
 * string plus every two-sided combination appears here once.
 */
export const NODE_VARIANT_GROUPS: readonly NodeVariantGroup[] = [
  {
    id: 'forms',
    title: 'Base forms',
    description: 'Every phrase and word form without qualifiers.',
    variants: bareForms,
  },
  {
    id: 'functions',
    title: 'Syntactic functions',
    description: 'Every left-side function mark, including obligatory adverbial.',
    variants: functions,
  },
  {
    id: 'verbs',
    title: 'Verb subtypes',
    description: 'Every right-side verb subtype paired with the head mark.',
    variants: verbTypes,
  },
  {
    id: 'clauses',
    title: 'Clause subtypes',
    description: 'Every right-side clause subtype paired with a clause-role mark.',
    variants: clauseKinds,
  },
];

export const NODE_VARIANTS: readonly NodeVariant[] = NODE_VARIANT_GROUPS.flatMap(
  (group) => group.variants,
);
