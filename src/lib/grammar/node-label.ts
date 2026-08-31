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
  /** A second job this node does at the same time. */
  fusedWith?: Func | null;
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

/**
 * The smallest a node's form label may be drawn on screen before the diagram
 * stops being something to read and becomes something to squint at.
 *
 * Nine CSS pixels is small; it is also the point below which the qualifiers
 * beside it — already 7.5 to the form's 13 — fall under six. A phone fit of a
 * lesson-40 tree put the form at five and the qualifier at three.
 *
 * Used as a floor on the fit the app performs FOR the learner, never on the
 * Fit control, which is a request for an overview and should grant it.
 */
export const MIN_READABLE_FORM_PX = 9;
export const READABLE_ZOOM_FLOOR = MIN_READABLE_FORM_PX / NODE_FORM_FONT_SIZE;

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
/**
 * Word classes named after the job they do.
 *
 * A determiner is what `Det` is short for. Writing `D` above `Det` is the same
 * claim twice, and on a short word the two marks plus a subtype do not fit at
 * all — *has been* put `Perf` hard against `Help` before this existed.
 *
 * The line is drawn at word classes, not at everything predictable. A `VP`
 * under a clause can only be the predicate, and `Pred` still shows: "verb
 * phrase" and "predicate" are two different ideas that happen to coincide, and
 * the coincidence is most of lesson 2. `Det` and "determiner" are one idea said
 * twice.
 *
 * Each entry is checked both ways in `names.test.ts`: the mark goes when the
 * function matches, and comes back the moment it does not — a `Det` heading a
 * determinative phrase still says `H`, because there it is doing the other job.
 */
export const NAMED_FOR_ITS_JOB: Partial<Record<Form, Func>> = {
  Det: 'determiner',
  Aux: 'auxiliary',
  Conj: 'coordinator',
  Subord: 'marker',
};

export function nodeLabelParts(value: NodeLabelValue): NodeLabelParts {
  const redundant =
    (value.function !== null &&
      value.function !== undefined &&
      NAMED_FOR_ITS_JOB[value.form] === value.function) ||
    // A particle carries its kind on the other side, and the two say the same
    // thing — `auditFiniteness` requires them to agree. The kind is the more
    // specific of the two, so it is the one that stays.
    (value.form === 'Part' && value.partKind != null) ||
    // An elided HEAD is always the head of what it sits in — that is what
    // being elided means there — so the mark says nothing and costs room the
    // node does not have. An elided predicate keeps its mark, because a clause
    // holds other things and which one is missing is the point.
    (value.gap === true && value.function === 'head');
  // A fused node names both jobs, in CGEL's order: the one the missing word
  // would have done, then the one it is covering. `D+H` is the whole claim.
  const fnMark = value.fusedWith
    ? `${functionMark(value.fusedWith)}+${functionMark(value.function ?? 'head')}`
    : value.function && !redundant
      ? functionMark(value.function, value.obligatory === true)
      : null;
  const fnName = value.fusedWith
    ? `${functionName(value.fusedWith)} and ${functionName(value.function ?? 'head')} at once`
    : value.function
      ? functionName(value.function, value.obligatory === true)
      : null;
  const voice = value.voice ?? 'active';
  const finiteness = value.finiteness ?? 'finite';
  // An ANSWERED default marks; an assumed one stays silent. The model stores
  // "finite" and "active" only when somebody claimed them, so the label can
  // tell an answer from a question nobody has reached — and it must: a
  // correct answer that draws nothing reads as a click that did nothing
  // (the stored-but-not-shown twin of the chosen-but-not-stored defect).
  const saidVoice = value.voice != null;
  const saidFiniteness = value.finiteness != null;
  const subtypeMark =
    value.form === 'V' && (value.verbType || saidVoice)
      ? verbTypeMark(value.verbType ?? null, voice, saidVoice)
      : (value.form === 'Cl' || value.form === 'S') &&
          (value.clauseKind || saidFiniteness || finiteness !== 'finite')
        ? clauseKindMark(value.clauseKind ?? null, finiteness, saidFiniteness)
        : value.form === 'Part' && value.partKind
          ? partKindMark(value.partKind)
          : value.form === 'Aux' && value.auxKind
            ? auxKindMark(value.auxKind)
            : null;
  const subtypeName =
    value.form === 'V' && (value.verbType || saidVoice)
      ? verbTypeName(value.verbType ?? null, voice, saidVoice)
      : (value.form === 'Cl' || value.form === 'S') &&
          (value.clauseKind || saidFiniteness || finiteness !== 'finite')
        ? clauseKindName(value.clauseKind ?? null, finiteness, saidFiniteness)
        : value.form === 'Part' && value.partKind
          ? partKindName(value.partKind)
          : value.form === 'Aux' && value.auxKind
            ? auxKindName(value.auxKind)
            : null;
  const primaryName = formName(value.form);
  /**
   * The number that pairs a moved phrase with the place it came from.
   *
   * It is NOT drawn any more. The diagram draws an arc under the words instead,
   * which shows the same relation without asking a reader to hunt the tree for
   * a matching digit — so printing the digit as well would be saying it twice.
   * It stays in the accessible name, where there is no arc to follow.
   */
  const tie = value.index === undefined || value.index === null ? '' : String(value.index);
  // An elided piece and a moved one are both empty and are not the same claim.
  const unsaid = value.function === 'head' || value.function === 'predicate';
  if (value.gap) {
    // The mark has to say the slot is empty, or a reader sees a phrase that has
    // simply lost its words.
    return {
      form: value.form,
      formName: primaryName,
      functionMark: fnMark,
      functionName: fnName,
      // An elided piece says what it repeats; a moved one says it is empty.
      subtypeMark: unsaid ? '=' : 'gap',
      subtypeName: unsaid
        ? tie
          ? `left unsaid, repeating ${tie}`
          : 'left unsaid'
        : tie
          ? `gap, filled by phrase ${tie}`
          : 'gap',
      accessibleName: [primaryName, unsaid ? 'left unsaid' : 'gap', fnName]
        .filter(Boolean)
        .join(', '),
    };
  }
  return {
    form: value.form,
    formName: primaryName,
    functionMark: fnMark,
    functionName: fnName,
    subtypeMark,
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
