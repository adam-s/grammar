/**
 * Licensing rules — the single place that decides whether a function may sit
 * under a parent given the verb type and the siblings already there.
 *
 * `licenses()` validates committed/frozen grammar. `hypothesizes()` keeps that
 * structural knowledge but intentionally relaxes verb-frame and prerequisite
 * constraints for the answer menu: a learner must be able to try a plausible
 * role before answering the separate verb-type question.
 */
import type { ClauseFunction, Form, Func, VerbType, Voice } from './types.ts';

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
  /** Active or passive. Omitted means active. */
  voice?: Voice;
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

/**
 * What the passive does to a frame: it promotes one object into the subject
 * slot, so that object is gone from the predicate and is no longer required.
 *
 * Which object moves depends on the verb. A transitive verb loses its only
 * one. A two-object verb may promote either — *He was given the keys* keeps a
 * direct object, *The keys were given him* keeps none — so the direct object
 * stays permitted and nothing is required. An object-complement verb loses the
 * object and keeps the complement: *He was considered reliable*.
 *
 * `Vbe`, `Vlink` and `Vint` have no object to promote, so they have no passive.
 */
export const PASSIVE_SLOTS_BY_VERB_TYPE: Record<VerbType, readonly ClauseFunction[]> = {
  Vbe: [],
  Vlink: [],
  Vint: [],
  Vtr: [],
  Vg: ['directObject'],
  Vc: ['objectComplement'],
};

export const PASSIVE_REQUIRED_BY_VERB_TYPE: Record<VerbType, readonly ClauseFunction[]> = {
  Vbe: [],
  Vlink: [],
  Vint: [],
  Vtr: [],
  Vg: [],
  Vc: ['objectComplement'],
};

/** The three verb types with an object to promote. */
export const PASSIVE_VERB_TYPES: readonly VerbType[] = ['Vtr', 'Vg', 'Vc'];

export const hasPassive = (vt: VerbType): boolean => PASSIVE_VERB_TYPES.includes(vt);

/** The slots a verb permits, given what it is and which voice it is in. */
export function slotsFor(vt: VerbType, voice: Voice = 'active'): readonly ClauseFunction[] {
  return voice === 'passive' ? PASSIVE_SLOTS_BY_VERB_TYPE[vt] : SLOTS_BY_VERB_TYPE[vt];
}

/** The slots a verb requires, given what it is and which voice it is in. */
export function requiredFor(vt: VerbType, voice: Voice = 'active'): readonly ClauseFunction[] {
  return voice === 'passive' ? PASSIVE_REQUIRED_BY_VERB_TYPE[vt] : REQUIRED_BY_VERB_TYPE[vt];
}

const UNCLASSIFIED = 'Classify the verb first — its type decides which slots exist.';

/** Why a slot is gone once the sentence is in the passive. */
const PROMOTED =
  'In the passive, what the verb acted on is already the subject — it cannot also sit here.';

export function licenses(fn: Func, ctx: LicenseContext): Verdict {
  const { parentForm: p, verbType: vt, siblings } = ctx;
  const voice = ctx.voice ?? 'active';
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
      if (!slotsFor(vt, voice).includes('directObject')) {
        return no(voice === 'passive' ? PROMOTED : `A ${LONG[vt]} verb takes no direct object.`);
      }
      return has('directObject') ? no('This verb already has a direct object.') : ALLOWED;

    case 'indirectObject':
      if (p !== 'VP') return HIDDEN;
      if (!childIs('NP')) return HIDDEN;
      if (vt === null) return no(UNCLASSIFIED);
      if (vt !== 'Vg') return no(`A ${LONG[vt]} verb takes no indirect object.`);
      if (voice === 'passive') return no(PROMOTED);
      if (!has('directObject')) {
        return no('An indirect object only appears alongside a direct object.');
      }
      return has('indirectObject') ? no('This verb already has an indirect object.') : ALLOWED;

    case 'subjectComplement':
      if (p !== 'VP') return HIDDEN;
      if (!childIs('NP', 'AdjP')) return HIDDEN;
      if (vt === null) return no(UNCLASSIFIED);
      if (!slotsFor(vt, voice).includes('subjectComplement')) {
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
      // In the passive the direct object has become the subject, so the
      // complement describes something that is no longer inside the predicate.
      if (!has('directObject') && voice !== 'passive') {
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

    // A helping verb sits inside the verb phrase it helps. It is NOT the head:
    // *was repaired* is one verb doing one job, and the job belongs to
    // *repaired*. Nor is it a premodifier — a premodifier narrows its head,
    // and *has* does not narrow *repaired*, it tenses it.
    //
    // Unlike every other function here it may repeat, because English stacks
    // them: *had been being repaired* is four words and one verb.
    case 'auxiliary':
      if (p !== 'VP') return HIDDEN;
      if (!childIs('Aux')) return HIDDEN;
      return ALLOWED;

    case 'determiner':
      return p === 'NP' ? ALLOWED : HIDDEN;

    // Modifiers of a noun live in the nominal, not in the noun phrase.
    //
    // This is what the `Nom` layer is for. In *the old red car* the determiner
    // and the adjectives used to be siblings, which said *the* applied to the
    // same thing *old* did. It does not: *the* points at the whole of *old red
    // car*. Putting the modifiers one level down is how a diagram says so, and
    // one-substitution agrees — *the old red car and the blue one*, where *one*
    // stands for the nominal and not for the phrase.
    case 'premodifier':
      return p === 'Nom' || p === 'AdjP' || p === 'AdvP' ? ALLOWED : HIDDEN;

    case 'postmodifier':
      return p === 'Nom' ? ALLOWED : HIDDEN;

    case 'complement':
      return p === 'PP' || p === 'AdjP' ? ALLOWED : HIDDEN;

    case 'appositive':
      return p === 'NP' ? ALLOWED : HIDDEN;

    // The word that introduces a clause and is not part of what it says.
    // Only a clause has one, and only a subordinator can be one — a marker is
    // not the clause's head, and giving it any other role misdescribes it.
    case 'marker':
      if (!CLAUSAL.includes(p)) return HIDDEN;
      // `Part` as well as `Subord`, because infinitival *to* introduces a
      // clause the same way *because* does: *she wanted __to__ leave*. It is
      // not the clause's head and it fills none of its slots.
      if (!childIs('Subord', 'Part')) return HIDDEN;
      return has('marker') ? no('This clause already has an introducing word.') : ALLOWED;

    // A particle belongs to its verb — *looked up* is one verb, and *up* is
    // not a preposition here because it takes no object of its own. Inside the
    // verb phrase, and nowhere else.
    case 'particle':
      if (p !== 'VP') return HIDDEN;
      if (!childIs('Part')) return HIDDEN;
      return has('particle') ? no('This verb already has a particle.') : ALLOWED;

    // The fronted position at the head of a clause. Unlike a supplement it is
    // not outside the grammar — it fills a slot, just not where the slot is.
    // Which is why it is only honest alongside a gap, and `auditGaps` requires
    // the two to be tied together.
    case 'prenucleus':
      if (!CLAUSAL.includes(p)) return HIDDEN;
      if (!childIs('NP', 'PP', 'AdvP', 'AdjP', 'Cl')) return HIDDEN;
      return has('prenucleus') ? no('This clause already has a fronted phrase.') : ALLOWED;

    // Sentence-edge material: in the sentence without filling a slot in it.
    // Licensed on a clause or a noun phrase, which is where asides attach.
    case 'supplement':
      if (!CLAUSAL.includes(p) && p !== 'NP') return HIDDEN;
      if (!childIs('AdvP', 'AdjP', 'PP', 'NP', 'Cl', 'Interj')) return HIDDEN;
      return ALLOWED;

    case 'coordinate':
      return ALLOWED;

    // The joining word is not one of the things joined. *and* in *the engine
    // stalled and the car stopped* is doing the joining, so labelling it a
    // coordinate says the sentence has three parts where it has two.
    //
    // It may repeat — *A and B and C* has two — and it sits wherever
    // coordinates sit, which is anywhere.
    case 'coordinator':
      return childIs('Conj') ? ALLOWED : HIDDEN;
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
export const HEAD_BEARING: readonly Form[] = ['NP', 'Nom', 'VP', 'PP', 'AdjP', 'AdvP'];

/**
 * What may head each phrase. A phrase takes its name from its head, so this is
 * not a stylistic rule — an NP headed by a preposition is not a noun phrase.
 * The matching phrase form is included so a coordinated head still works.
 */
export const HEAD_FORMS: Record<string, readonly Form[]> = {
  NP: ['N', 'Pron', 'Num', 'Nom', 'NP'],
  Nom: ['N', 'Nom'],
  // Not `Aux`. A verb phrase is named after its main verb, and an auxiliary is
  // never that — in *was repaired* the phrase is about *repaired*. Auxiliaries
  // hang off the phrase under the `auxiliary` function instead.
  VP: ['V', 'VP'],
  PP: ['P', 'PP'],
  AdjP: ['Adj', 'AdjP'],
  AdvP: ['Adv', 'AdvP'],
};

const HEAD_ARTICLE: Record<string, string> = {
  NP: 'a noun phrase',
  Nom: 'a nominal',
  VP: 'a verb phrase',
  PP: 'a prepositional phrase',
  AdjP: 'an adjective phrase',
  AdvP: 'an adverb phrase',
};

const HEAD_NAMES: Record<string, string> = {
  NP: 'a noun, a pronoun, or a nominal',
  Nom: 'a noun',
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
