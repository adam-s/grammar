import {
  auxKindMark,
  auxKindName,
  clauseKindMark,
  clauseKindName,
  formName,
  functionMark,
  functionName,
  partKindMark,
  partKindName,
  verbTypeMark,
  verbTypeName,
} from './names.ts';
import type {
  AuxKind,
  ClauseKind,
  Finiteness,
  Form,
  Func,
  PartKind,
  VerbType,
  Voice,
} from './types.ts';

/** Everything visible around the primary form label of one diagram node. */
export interface NodeLabelValue {
  form: Form;
  function?: Func | null;
  obligatory?: boolean;
  verbType?: VerbType | null;
  /** Only meaningful beside `verbType`. Absent means active. */
  voice?: Voice | null;
  clauseKind?: ClauseKind | null;
  /** Only meaningful on a clause. Absent means finite. */
  finiteness?: Finiteness | null;
  /** Only meaningful on a `Part`. */
  partKind?: PartKind | null;
  /** Only meaningful on an `Aux`. */
  auxKind?: AuxKind | null;
  /** This node covers no words. */
  gap?: boolean;
  /** Ties this node to the gap or filler it is one half of. */
  index?: number | null;
}

export interface NodeLabelParts {
  form: Form;
  formName: string;
  functionMark: string | null;
  functionName: string | null;
  subtypeMark: string | null;
  subtypeName: string | null;
  accessibleName: string;
}

/**
 * The labels use the same monospace face, so their horizontal geometry can be
 * resolved before the browser paints. Position qualifiers from the *edges* of
 * the primary form plus a real gap; fixed offsets fail for Pron, Subord, AdjP,
 * and the other labels wider than one or two characters.
 */
export const NODE_FORM_FONT_SIZE = 13;
export const NODE_FORM_ADVANCE = NODE_FORM_FONT_SIZE * 0.62;
export const NODE_QUALIFIER_FONT_SIZE = 7.5;
export const NODE_QUALIFIER_ADVANCE = NODE_QUALIFIER_FONT_SIZE * 0.62;
export const NODE_QUALIFIER_GAP = 3;
export const NODE_LABEL_PADDING = 10;

export function nodeLabelOffsets(form: Form): { functionX: number; subtypeX: number } {
  const halfFormWidth = (String(form).length * NODE_FORM_ADVANCE) / 2;
  return {
    functionX: -halfFormWidth - NODE_QUALIFIER_GAP,
    subtypeX: halfFormWidth + NODE_QUALIFIER_GAP,
  };
}

/**
 * One source of truth for diagram typography and accessible node names.
 * Qualifiers are deliberately limited to the form they refine: verb type is
 * meaningful only on V, and clause kind only on Cl.
 */
export function nodeLabelParts(value: NodeLabelValue): NodeLabelParts {
  // A helping verb's function adds nothing its form has not already said, and
  // over a short word the two marks plus the subtype do not fit — *has been*
  // put "Perf" hard against "Help". Dropping the redundant half is better than
  // abbreviating an informative one.
  const redundant =
    (value.form === 'Aux' && value.function === 'auxiliary') ||
    // An elided piece is always the head of what it sits in — that is what
    // being elided means here — so the mark says nothing and costs room the
    // node does not have.
    (value.gap === true && value.function === 'head');
  // A particle's kind and its function say the same thing — `auditFiniteness`
  // enforces exactly that — and over a short word the pair collided with the
  // next label. Only one of two identical claims is worth the pixels.
  const entailed =
    value.form === 'Part' &&
    ((value.function === 'particle' && value.partKind === 'verbal') ||
      (value.function === 'marker' && value.partKind === 'infinitival'));
  const fnMark =
    value.function && !redundant ? functionMark(value.function, value.obligatory === true) : null;
  const fnName = value.function ? functionName(value.function, value.obligatory === true) : null;
  const voice = value.voice ?? 'active';
  const finiteness = value.finiteness ?? 'finite';
  const subtypeMark =
    value.form === 'V' && value.verbType
      ? verbTypeMark(value.verbType, voice)
      : value.form === 'Cl' && (value.clauseKind || finiteness !== 'finite')
        ? clauseKindMark(value.clauseKind ?? null, finiteness)
        : value.form === 'Part' && value.partKind && !entailed
          ? partKindMark(value.partKind)
          : value.form === 'Aux' && value.auxKind
            ? auxKindMark(value.auxKind)
            : null;
  const subtypeName =
    value.form === 'V' && value.verbType
      ? verbTypeName(value.verbType, voice)
      : value.form === 'Cl' && (value.clauseKind || finiteness !== 'finite')
        ? clauseKindName(value.clauseKind ?? null, finiteness)
        : value.form === 'Part' && value.partKind
          ? partKindName(value.partKind)
          : value.form === 'Aux' && value.auxKind
            ? auxKindName(value.auxKind)
            : null;
  const primaryName = formName(value.form);
  // The link between a filler and its gap is the whole claim being made, and a
  // reader who cannot see it sees two unrelated phrases. The number is the
  // notation, and it means only that these two are one thing.
  const tie = value.index === undefined || value.index === null ? '' : String(value.index);
  if (value.gap) {
    // The mark has to say the slot is empty, or a reader sees a phrase that has
    // simply lost its words.
    return {
      form: value.form,
      formName: primaryName,
      functionMark: fnMark,
      functionName: fnName,
      // An elided piece says what it repeats; a moved one says it is empty.
      subtypeMark:
        value.function === 'head' ? (tie ? `= ${tie}` : '=') : tie ? `gap ${tie}` : 'gap',
      subtypeName:
        value.function === 'head'
          ? tie
            ? `left unsaid, repeating ${tie}`
            : 'left unsaid'
          : tie
            ? `gap, filled by phrase ${tie}`
            : 'gap',
      accessibleName: [primaryName, 'gap', fnName].filter(Boolean).join(', '),
    };
  }
  const withTie = tie ? [subtypeMark, tie].filter(Boolean).join(' ') : subtypeMark;
  return {
    form: value.form,
    formName: primaryName,
    functionMark: fnMark,
    functionName: fnName,
    subtypeMark: withTie,
    subtypeName: tie ? [subtypeName, `fills gap ${tie}`].filter(Boolean).join(', ') : subtypeName,
    accessibleName: [primaryName, subtypeName, fnName].filter(Boolean).join(', '),
  };
}

/** Width required by the complete visual label, including its selection pad. */
export function nodeLabelWidth(value: NodeLabelValue): number {
  const parts = nodeLabelParts(value);
  const formWidth = String(value.form).length * NODE_FORM_ADVANCE;
  const functionWidth = (parts.functionMark?.length ?? 0) * NODE_QUALIFIER_ADVANCE;
  const subtypeWidth = (parts.subtypeMark?.length ?? 0) * NODE_QUALIFIER_ADVANCE;
  return (
    functionWidth +
    (parts.functionMark ? NODE_QUALIFIER_GAP : 0) +
    formWidth +
    (parts.subtypeMark ? NODE_QUALIFIER_GAP : 0) +
    subtypeWidth +
    NODE_LABEL_PADDING
  );
}
