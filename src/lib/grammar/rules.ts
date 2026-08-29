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
  /**
   * The forms of those same siblings, in the same order.
   *
   * Only `marker` needs it, and it needs it because a clause can hold two
   * introducing words doing different jobs — *__for__ anyone __to__ lift* —
   * and "already has one" is the wrong answer to the second.
   */
  siblingForms?: readonly Form[];
  /** Active or passive. Omitted means active. */
  voice?: Voice;
  /** The second job this child is doing, if it is doing two. */
  fusedWith?: Func;
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
      // `Cl` belongs here. Every other clause-taking slot already accepts one —
      // subject, direct object, adverbial, postmodifier, and `complement` under
      // an AdjP, which is how *too heavy to lift* is built. These two were the
      // only holdouts, no comment ever said why, and *The trouble was that the
      // gate failed* had no representation as a result.
      if (!childIs('NP', 'AdjP', 'Cl')) return HIDDEN;
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
      // No `Cl` here, unlike the slot above. An object complement renames or
      // describes the direct object — *the driver is careless* — and the clause
      // that wanted this slot, *We asked the driver to wait*, does neither: *to
      // wait* says what the driver is to do. Object control needs its own
      // representation, and until it has one the label would be a lie the
      // grader enforces. See "What the model still cannot say" in README.md.
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
        // Unless it is doing two jobs at once. *Most were gone* has no noun for
        // *most* to determine, so *most* determines and heads together — which
        // is the only reason a determiner may head a noun phrase.
        if (ctx.fusedWith && fuses(p, ctx.childForm, ctx.fusedWith)) return ALLOWED;
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
      if (!childIs('Aux')) return HIDDEN;
      // Ordinarily inside the verb phrase it helps. Directly under a clause it
      // means the other thing English does with an auxiliary: moving it in
      // front of the subject to make a question — *__Did__ she repair it?*
      //
      // No discontinuity is needed for that, and none is claimed. The
      // auxiliary is written where it is said, hanging off the clause; what
      // makes it an inversion is that it comes before the subject, which
      // `auditGaps` checks. A node whose pieces are not next to each other is
      // a different problem and is still open — README.md lists it.
      if (p !== 'VP' && !CLAUSAL.includes(p)) return HIDDEN;
      return ALLOWED;

    // A determiner may itself be a phrase. *almost every student* has
    // *almost* modifying *every*, not modifying *student* — there is no
    // reading where it is the student who is almost.
    case 'determiner':
      if (p !== 'NP') return HIDDEN;
      return childIs('Det', 'DP', 'Num') ? ALLOWED : HIDDEN;

    // Modifiers of a noun live in the nominal, not in the noun phrase.
    //
    // This is what the `Nom` layer is for. In *the old red car* the determiner
    // and the adjectives used to be siblings, which said *the* applied to the
    // same thing *old* did. It does not: *the* points at the whole of *old red
    // car*. Putting the modifiers one level down is how a diagram says so, and
    // one-substitution agrees — *the old red car and the blue one*, where *one*
    // stands for the nominal and not for the phrase.
    case 'premodifier':
      // Inside a nominal, what narrows a noun; inside anything else, what
      // grades it. Unrestricted, this said *the* could premodify *engine*,
      // which is what a determiner does and is a different claim.
      if (p === 'Nom') return childIs('Adj', 'AdjP', 'N', 'Nom', 'Num', 'AdvP') ? ALLOWED : HIDDEN;
      if (p === 'DP' || p === 'AdjP' || p === 'AdvP') {
        return childIs('Adv', 'AdvP', 'Num', 'PP') ? ALLOWED : HIDDEN;
      }
      return HIDDEN;

    // A name with no internal head. Every piece is flat or none is, which
    // `auditHead` relies on to know it should not be asking.
    case 'flat':
      if (p !== 'Nom' && p !== 'NP') return HIDDEN;
      return childIs('N', 'Num', 'Adj', 'Pron') ? ALLOWED : HIDDEN;

    case 'postmodifier':
      if (p === 'NP') {
        // A recursive noun phrase analysis: `[NP [NP the shoes] [PP on my
        // feet]]`. The inner NP is the head; the following phrase narrows that
        // head just as it does under the course's canonical Nom analysis.
        const recursiveHead = siblings.some(
          (fn, i) => fn === 'head' && ctx.siblingForms?.[i] === 'NP',
        );
        if (!recursiveHead) return HIDDEN;
      } else if (p !== 'Nom') return HIDDEN;
      return childIs('PP', 'Cl', 'AdjP', 'AdvP', 'NP') ? ALLOWED : HIDDEN;

    case 'complement':
      // What a preposition or an adjective takes to finish it. A preposition
      // takes a noun phrase or a clause, never a bare determiner — which the
      // unrestricted rule was happy to allow.
      if (p === 'PP') return childIs('NP', 'Nom', 'Cl', 'PP', 'AdvP') ? ALLOWED : HIDDEN;
      if (p === 'AdjP') return childIs('NP', 'Cl', 'PP') ? ALLOWED : HIDDEN;
      return HIDDEN;

    case 'appositive':
      // A phrase renaming the one beside it, so it is the same kind of thing.
      if (p !== 'NP' && p !== 'Nom') return HIDDEN;
      return childIs('NP', 'Nom', 'Cl') ? ALLOWED : HIDDEN;

    // The word that introduces a clause and is not part of what it says.
    // Only a clause has one, and only a subordinator can be one — a marker is
    // not the clause's head, and giving it any other role misdescribes it.
    case 'marker': {
      if (!CLAUSAL.includes(p)) return HIDDEN;
      // `Part` as well as `Subord`, because infinitival *to* introduces a
      // clause the same way *because* does: *she wanted __to__ leave*. It is
      // not the clause's head and it fills none of its slots.
      if (!childIs('Subord', 'Part')) return HIDDEN;
      // One of each kind, not one in total. *for anyone to lift* has a
      // subordinator saying what kind of clause it is and an infinitival *to*
      // saying what shape its verb is in; they are different claims and both
      // are said out loud.
      const kind = ctx.childForm === 'Part' ? 'Part' : 'Subord';
      const taken = siblings.some(
        (f, i) => f === 'marker' && (ctx.siblingForms?.[i] ?? 'Subord') === kind,
      );
      if (taken) {
        return no(
          kind === 'Part'
            ? 'This clause already has an infinitival “to”.'
            : 'This clause already has an introducing word.',
        );
      }
      return ALLOWED;
    }

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

    // The tail position. Like a prenucleus it fills a role somewhere else in
    // the clause, and unlike a supplement it is not outside the grammar — so
    // `auditGaps` requires it to say what it belongs to.
    case 'postnucleus':
      if (!CLAUSAL.includes(p)) return HIDDEN;
      if (!childIs('NP', 'PP', 'AdvP', 'AdjP', 'Cl')) return HIDDEN;
      return has('postnucleus') ? no('This clause already has a tail phrase.') : ALLOWED;

    // Extraposition, as a pair. English dislikes a long subject in front of a
    // short verb, so it puts *it* in the subject slot and the real content at
    // the end. Neither half means anything without the other, and `auditGaps`
    // holds them to that.
    case 'placeholderSubject':
      if (!CLAUSAL.includes(p)) return HIDDEN;
      if (!childIs('NP')) return HIDDEN;
      return has('placeholderSubject') ? no('This clause already has a placeholder.') : ALLOWED;

    case 'extraposed':
      if (!CLAUSAL.includes(p)) return HIDDEN;
      if (!childIs('Cl', 'NP')) return HIDDEN;
      return has('extraposed') ? no('This clause already has an extraposed part.') : ALLOWED;

    // *There is a problem* is not about *there*. The subject slot is held by a
    // word that names nothing, and what the sentence is about waits behind the
    // verb — so it sits in the predicate and says what it is.
    case 'displaced':
      if (p !== 'VP') return HIDDEN;
      if (!childIs('NP')) return HIDDEN;
      return has('displaced') ? no('This verb already has a displaced subject.') : ALLOWED;

    // Sentence-edge material: in the sentence without filling a slot in it.
    // Licensed on a clause or a noun phrase, which is where asides attach.
    case 'supplement':
      if (!CLAUSAL.includes(p) && p !== 'NP') return HIDDEN;
      if (!childIs('AdvP', 'AdjP', 'PP', 'NP', 'Cl', 'Interj')) return HIDDEN;
      return ALLOWED;

    // Only where something is doing the joining. Licensed everywhere and for
    // everything, `coordinate` made every other function on every node look
    // like one of two possibilities, which is why *the* had to be told it was
    // a determiner rather than being one visibly.
    //
    // A join made with a comma alone is not recognised, and cannot be until
    // punctuation is part of the structure (README.md).
    case 'coordinate':
      return (ctx.siblingForms ?? []).includes('Conj') || siblings.includes('coordinate')
        ? ALLOWED
        : no('Nothing here is joining anything — a coordinate needs an “and”, “but” or “or”.');

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
    // These two lists have to agree with `licenses` above on what FORMS a slot
    // takes — they differ only on verb type and prerequisite siblings. The
    // subject complement was short of `Cl` in both functions, which is how a
    // clausal complement came to be well formed and unreachable at the same
    // time. The object complement takes no clause in either, on purpose.
    case 'subjectComplement':
      if (p !== 'VP' || !childIs('NP', 'AdjP', 'Cl')) return HIDDEN;
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

/**
 * The fusions English has, as parent → child → the job the head is fused with.
 *
 * Short and closed on purpose. Fusion is not a general licence to head a phrase
 * with anything; it is a small set of places where English leaves out the word
 * that would normally be the head and lets its neighbour cover for it.
 *
 *   *__Most__ were gone*        a determiner with no noun to determine
 *   *The __poor__ complained*   a modifier with no noun to modify
 *
 * `auditFusion` holds the other half of the bargain: a node that could have
 * headed the phrase on its own is not fused, it is just the head.
 */
export const FUSIONS: Record<string, Partial<Record<string, Func>>> = {
  NP: { Det: 'determiner', Num: 'determiner', DP: 'determiner' },
  Nom: { Adj: 'premodifier', AdjP: 'premodifier' },
};

export function fuses(parent: Form, child: Form, fusedWith: Func): boolean {
  return FUSIONS[parent]?.[child] === fusedWith;
}

/** Phrase forms that must have exactly one head. `S`/`Cl` are not phrases. */
export const HEAD_BEARING: readonly Form[] = ['NP', 'Nom', 'DP', 'VP', 'PP', 'AdjP', 'AdvP'];

/**
 * What may head each phrase. A phrase takes its name from its head, so this is
 * not a stylistic rule — an NP headed by a preposition is not a noun phrase.
 * The matching phrase form is included so a coordinated head still works.
 */
export const HEAD_FORMS: Record<string, readonly Form[]> = {
  NP: ['N', 'Pron', 'Num', 'Nom', 'NP'],
  // `Pron` because of the fused relative: in *what he wants*, *what* is what
  // the clause modifies, and it is a pronoun. Nothing about a nominal requires
  // a noun — it requires the thing a determiner would point at.
  Nom: ['N', 'Pron', 'Nom'],
  DP: ['Det', 'DP'],
  // Not `Aux`. A verb phrase is named after its main verb, and an auxiliary is
  // never that — in *was repaired* the phrase is about *repaired*. Auxiliaries
  // hang off the phrase under the `auxiliary` function instead.
  VP: ['V', 'VP'],
  PP: ['P', 'PP'],
  AdjP: ['Adj', 'AdjP'],
  AdvP: ['Adv', 'AdvP'],
};

/**
 * May a word of this class stand alone as a phrase of this form?
 *
 * `HEAD_FORMS` already says what heads what, and `auditHead` enforces it on a
 * finished tree. The palette has to ask the same question earlier, or it offers
 * a one-word phrase the audit would reject the moment it is built. Forms with
 * no entry — the clauses — are not ruled on here.
 */
export function headed(word: Form, phrase: Form): Verdict {
  const allowed = HEAD_FORMS[phrase];
  if (!allowed || allowed.includes(word)) return ALLOWED;
  // Fusion is the exception: *Most were gone* has no noun for *most* to
  // determine, so the determiner determines and heads at once. Rare, and a
  // second decision the learner makes deliberately — see `plainlyHeads`, which
  // is why this path stays open without holding the palette open.
  if (FUSIONS[phrase]?.[word]) return ALLOWED;
  return no(`The head of ${HEAD_ARTICLE[phrase]} is ${HEAD_NAMES[phrase]}.`);
}

/**
 * Could this word class stand alone as one of these phrases on its own merit?
 *
 * "On its own merit" excludes fusion, which is a second decision the learner
 * makes deliberately rather than the ordinary reason to wrap a word. `reachable`
 * excludes what a lesson has not taught yet: a determiner heads a determinative
 * phrase, but a learner three lessons in has never met one, so asking them has
 * no right answer they can give.
 *
 * False means the question is not a question for this word — offer the list,
 * but do not hold the palette open waiting for a pick from it.
 */
export function plainlyHeads(
  word: Form,
  forms: readonly Form[],
  reachable: (f: Form) => boolean = () => true,
): boolean {
  return forms.some((f) => (HEAD_FORMS[f] ?? []).includes(word) && reachable(f));
}

const HEAD_ARTICLE: Record<string, string> = {
  NP: 'a noun phrase',
  Nom: 'a nominal',
  DP: 'a determinative phrase',
  VP: 'a verb phrase',
  PP: 'a prepositional phrase',
  AdjP: 'an adjective phrase',
  AdvP: 'an adverb phrase',
};

const HEAD_NAMES: Record<string, string> = {
  NP: 'a noun, a pronoun, or a nominal',
  Nom: 'a noun',
  DP: 'the determiner',
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
