import {
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
import type { ClauseKind, Finiteness, Form, Func, PartKind, VerbType, Voice } from './types.ts';

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
  const fnMark = value.function ? functionMark(value.function, value.obligatory === true) : null;
  const fnName = value.function ? functionName(value.function, value.obligatory === true) : null;
  const voice = value.voice ?? 'active';
  const finiteness = value.finiteness ?? 'finite';
  const subtypeMark =
    value.form === 'V' && value.verbType
      ? verbTypeMark(value.verbType, voice)
      : value.form === 'Cl' && (value.clauseKind || finiteness !== 'finite')
        ? clauseKindMark(value.clauseKind ?? null, finiteness)
        : value.form === 'Part' && value.partKind
          ? partKindMark(value.partKind)
          : null;
  const subtypeName =
    value.form === 'V' && value.verbType
      ? verbTypeName(value.verbType, voice)
      : value.form === 'Cl' && (value.clauseKind || finiteness !== 'finite')
        ? clauseKindName(value.clauseKind ?? null, finiteness)
        : value.form === 'Part' && value.partKind
          ? partKindName(value.partKind)
          : null;
  const primaryName = formName(value.form);
  return {
    form: value.form,
    formName: primaryName,
    functionMark: fnMark,
    functionName: fnName,
    subtypeMark,
    subtypeName,
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
