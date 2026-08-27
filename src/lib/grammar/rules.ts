/**
 * Licensing rules — the single place that decides whether a function may sit
 * under a parent given the verb type and the siblings already there.
 *
 * Used twice, and that is the point:
 *   - `audits.ts` runs it over frozen content (is this parse legal?)
 *   - the span menu runs it over the learner's partial structure (may they
 *     pick this?), disabling items with the SAME reason string.
 *
 * So the constraint the learner meets in the UI and the constraint the content
 * must satisfy cannot drift apart. Teaching through affordance
 * (docs/interaction.md) is only honest if they are one rule set.
 */
import type { ClauseFunction, Form, Func, VerbType } from './types.ts';

export type Verdict =
  { state: 'allowed' } | { state: 'disabled'; reason: string } | { state: 'hidden' };

export const ALLOWED: Verdict = { state: 'allowed' };
const HIDDEN: Verdict = { state: 'hidden' };
const no = (reason: string): Verdict => ({ state: 'disabled', reason });

export interface LicenseContext {
  /** Form of the node the new child would hang under. */
  parentForm: Form;
  /** The clause's verb type, or null while the learner has not classified it. */
  verbType: VerbType | null;
  /** Functions already filled among the prospective siblings. */
  siblings: readonly Func[];
  /**
   * Form of the child being licensed, when known. Only `head` needs it, and it
   * needs it badly: a verb phrase's head is a verb, so without this the menu
   * happily offers to make the direct object the head of the predicate.
   */
  childForm?: Form;
}

const CLAUSAL: readonly Form[] = ['S', 'Cl'];

/** Which slots each verb type permits, beyond subject/predicate/adverbial. */
export const SLOTS_BY_VERB_TYPE: Record<VerbType, readonly ClauseFunction[]> = {
  Vbe: ['subjectComplement'],
  Vlink: ['subjectComplement'],
  Vint: [],
  Vtr: ['directObject'],
  Vg: ['directObject', 'indirectObject'],
  Vc: ['directObject', 'objectComplement'],
};

/** Slots each verb type REQUIRES. `Vbe` is satisfied by an obligatory adverbial too. */
export const REQUIRED_BY_VERB_TYPE: Record<VerbType, readonly ClauseFunction[]> = {
  Vbe: [],
  Vlink: ['subjectComplement'],
  Vint: [],
  Vtr: ['directObject'],
  Vg: ['directObject', 'indirectObject'],
  Vc: ['directObject', 'objectComplement'],
};

const UNCLASSIFIED = 'Classify the verb first — its type decides which slots exist.';

export function licenses(fn: Func, ctx: LicenseContext): Verdict {
  const { parentForm: p, verbType: vt, siblings } = ctx;
  const has = (f: Func) => siblings.includes(f);

  switch (fn) {
    case 'subject':
      if (!CLAUSAL.includes(p)) return HIDDEN;
      return has('subject') ? no('This clause already has a subject.') : ALLOWED;

    case 'predicate':
      if (!CLAUSAL.includes(p)) return HIDDEN;
      return has('predicate') ? no('This clause already has a predicate.') : ALLOWED;

    case 'directObject':
      if (p !== 'VP') return HIDDEN;
      if (vt === null) return no(UNCLASSIFIED);
      if (!SLOTS_BY_VERB_TYPE[vt].includes('directObject')) {
        return no(`A ${LONG[vt]} verb takes no direct object.`);
      }
      return has('directObject') ? no('This verb already has a direct object.') : ALLOWED;

    case 'indirectObject':
      if (p !== 'VP') return HIDDEN;
      if (vt === null) return no(UNCLASSIFIED);
      if (vt !== 'Vg') return no(`A ${LONG[vt]} verb takes no indirect object.`);
      if (!has('directObject')) {
        return no('An indirect object only appears alongside a direct object.');
      }
      return has('indirectObject') ? no('This verb already has an indirect object.') : ALLOWED;

    case 'subjectComplement':
      if (p !== 'VP') return HIDDEN;
      if (vt === null) return no(UNCLASSIFIED);
      if (!SLOTS_BY_VERB_TYPE[vt].includes('subjectComplement')) {
        return no(`Only "be" and linking verbs take a subject complement.`);
      }
      return has('subjectComplement') ? no('This verb already has a subject complement.') : ALLOWED;

    case 'objectComplement':
      // Hidden, not disabled: an object complement is not a thing that exists
      // for other verb types, so offering it greyed out would teach a slot
      // that is never available.
      if (p !== 'VP') return HIDDEN;
      if (vt !== null && vt !== 'Vc') return HIDDEN;
      if (vt === null) return no(UNCLASSIFIED);
      if (!has('directObject')) {
        return no('An object complement describes the direct object — find that first.');
      }
      return has('objectComplement') ? no('This verb already has an object complement.') : ALLOWED;

    case 'adverbial':
      return p === 'VP' || CLAUSAL.includes(p) ? ALLOWED : HIDDEN;

    case 'head': {
      if (!HEAD_BEARING.includes(p)) return HIDDEN;
      if (has('head')) return no('A phrase has exactly one head.');
      const allowed = HEAD_FORMS[p];
      if (ctx.childForm && allowed && !allowed.includes(ctx.childForm)) {
        return no(`The head of ${HEAD_ARTICLE[p]} is ${HEAD_NAMES[p]}.`);
      }
      return ALLOWED;
    }

    case 'determiner':
      return p === 'NP' ? ALLOWED : HIDDEN;

    case 'premodifier':
      return p === 'NP' || p === 'AdjP' || p === 'AdvP' ? ALLOWED : HIDDEN;

    case 'postmodifier':
      return p === 'NP' ? ALLOWED : HIDDEN;

    case 'complement':
      return p === 'PP' || p === 'AdjP' ? ALLOWED : HIDDEN;

    case 'appositive':
      return p === 'NP' ? ALLOWED : HIDDEN;

    case 'coordinate':
      return ALLOWED;
  }
}

/** Phrase forms that must have exactly one head. `S`/`Cl` are not phrases. */
export const HEAD_BEARING: readonly Form[] = ['NP', 'VP', 'PP', 'AdjP', 'AdvP'];

/**
 * What may head each phrase. A phrase takes its name from its head, so this is
 * not a stylistic rule — an NP headed by a preposition is not a noun phrase.
 * The matching phrase form is included so a coordinated head still works.
 */
export const HEAD_FORMS: Record<string, readonly Form[]> = {
  NP: ['N', 'Pron', 'Num', 'NP'],
  VP: ['V', 'Aux', 'VP'],
  PP: ['P', 'PP'],
  AdjP: ['Adj', 'AdjP'],
  AdvP: ['Adv', 'AdvP'],
};

const HEAD_ARTICLE: Record<string, string> = {
  NP: 'a noun phrase',
  VP: 'a verb phrase',
  PP: 'a prepositional phrase',
  AdjP: 'an adjective phrase',
  AdvP: 'an adverb phrase',
};

const HEAD_NAMES: Record<string, string> = {
  NP: 'a noun or a pronoun',
  VP: 'a verb',
  PP: 'the preposition',
  AdjP: 'an adjective',
  AdvP: 'an adverb',
};

/** Plain-language names, for reasons a learner reads. */
export const LONG: Record<VerbType, string> = {
  Vbe: '"be"',
  Vlink: 'linking',
  Vint: 'intransitive',
  Vtr: 'transitive',
  Vg: 'two-object',
  Vc: 'object-complement',
};

/** The six types as the menu shows them: label, plain name, example. */
export const VERB_TYPE_MENU: readonly {
  type: VerbType;
  label: string;
  example: string;
}[] = [
  { type: 'Vbe', label: 'be', example: 'The keys ARE on the table.' },
  { type: 'Vlink', label: 'linking', example: 'The soup TASTED salty.' },
  { type: 'Vint', label: 'intransitive', example: 'The engine STALLED.' },
  { type: 'Vtr', label: 'transitive', example: 'She REPAIRED the engine.' },
  { type: 'Vg', label: 'gives (two objects)', example: 'He GAVE her the keys.' },
  {
    type: 'Vc',
    label: 'considers (object + complement)',
    example: 'They CONSIDERED him reliable.',
  },
];
