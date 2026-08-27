/**
 * Licensing rules — the single place that decides whether a function may sit
 * under a parent given the verb type and the siblings already there.
 *
 * `licenses()` validates committed/frozen grammar. `hypothesizes()` keeps that
 * structural knowledge but intentionally relaxes verb-frame and prerequisite
 * constraints for the answer menu: a learner must be able to try a plausible
 * role before answering the separate verb-type question.
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
  const childIs = (...forms: Form[]) => !ctx.childForm || forms.includes(ctx.childForm);

  switch (fn) {
    case 'subject':
      if (!CLAUSAL.includes(p)) return HIDDEN;
      if (!childIs('NP', 'Cl')) return HIDDEN;
      return has('subject') ? no('This clause already has a subject.') : ALLOWED;

    case 'predicate':
      if (!CLAUSAL.includes(p)) return HIDDEN;
      if (!childIs('VP')) return HIDDEN;
      return has('predicate') ? no('This clause already has a predicate.') : ALLOWED;

    case 'directObject':
      if (p !== 'VP') return HIDDEN;
      if (!childIs('NP', 'Cl')) return HIDDEN;
      if (vt === null) return no(UNCLASSIFIED);
      if (!SLOTS_BY_VERB_TYPE[vt].includes('directObject')) {
        return no(`A ${LONG[vt]} verb takes no direct object.`);
      }
      return has('directObject') ? no('This verb already has a direct object.') : ALLOWED;

    case 'indirectObject':
      if (p !== 'VP') return HIDDEN;
      if (!childIs('NP')) return HIDDEN;
      if (vt === null) return no(UNCLASSIFIED);
      if (vt !== 'Vg') return no(`A ${LONG[vt]} verb takes no indirect object.`);
      if (!has('directObject')) {
        return no('An indirect object only appears alongside a direct object.');
      }
      return has('indirectObject') ? no('This verb already has an indirect object.') : ALLOWED;

    case 'subjectComplement':
      if (p !== 'VP') return HIDDEN;
      if (!childIs('NP', 'AdjP')) return HIDDEN;
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
      if (!childIs('NP', 'AdjP')) return HIDDEN;
      if (vt !== null && vt !== 'Vc') return HIDDEN;
      if (vt === null) return no(UNCLASSIFIED);
      if (!has('directObject')) {
        return no('An object complement describes the direct object — find that first.');
      }
      return has('objectComplement') ? no('This verb already has an object complement.') : ALLOWED;

    case 'adverbial':
      if (!childIs('AdvP', 'PP', 'NP', 'Cl')) return HIDDEN;
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

    // The word that introduces a clause and is not part of what it says.
    // Only a clause has one, and only a subordinator can be one — a marker is
    // not the clause's head, and giving it any other role misdescribes it.
    case 'marker':
      if (!CLAUSAL.includes(p)) return HIDDEN;
      if (!childIs('Subord')) return HIDDEN;
      return has('marker') ? no('This clause already has an introducing word.') : ALLOWED;

    case 'coordinate':
      return ALLOWED;
  }
}

/**
 * May a learner TRY this function for the selected form?
 *
 * Unlike `licenses`, this deliberately ignores verb type and prerequisite
 * siblings. Those are facts the exercise is asking the learner to discover,
 * not reasons to make an answer look unavailable. It retains only structural
 * compatibility and already-filled single slots. The grader decides whether
 * a compatible hypothesis is correct before the builder stores it.
 */
export function hypothesizes(fn: Func, ctx: LicenseContext): Verdict {
  const { parentForm: p, siblings } = ctx;
  const has = (f: Func) => siblings.includes(f);
  const childIs = (...forms: Form[]) => !ctx.childForm || forms.includes(ctx.childForm);
  const once = (f: Func, message: string): Verdict => (has(f) ? no(message) : ALLOWED);

  switch (fn) {
    case 'subject':
      if (!CLAUSAL.includes(p) || !childIs('NP', 'Cl')) return HIDDEN;
      return once('subject', 'This clause already has a subject.');
    case 'predicate':
      if (!CLAUSAL.includes(p) || !childIs('VP')) return HIDDEN;
      return once('predicate', 'This clause already has a predicate.');
    case 'directObject':
      if (p !== 'VP' || !childIs('NP', 'Cl')) return HIDDEN;
      return once('directObject', 'This verb already has a direct object.');
    case 'indirectObject':
      if (p !== 'VP' || !childIs('NP')) return HIDDEN;
      return once('indirectObject', 'This verb already has an indirect object.');
    case 'subjectComplement':
      if (p !== 'VP' || !childIs('NP', 'AdjP')) return HIDDEN;
      return once('subjectComplement', 'This verb already has a subject complement.');
    case 'objectComplement':
      if (p !== 'VP' || !childIs('NP', 'AdjP')) return HIDDEN;
      return once('objectComplement', 'This verb already has an object complement.');
    case 'adverbial':
      if (!childIs('AdvP', 'PP', 'NP', 'Cl')) return HIDDEN;
      return p === 'VP' || CLAUSAL.includes(p) ? ALLOWED : HIDDEN;
    default:
      // Phrase-internal functions are structural rather than verb-frame
      // hypotheses, so their ordinary license is already the right affordance.
      return licenses(fn, ctx);
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
