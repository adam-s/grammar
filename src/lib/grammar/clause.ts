/**
 * Which clause a constituent belongs to, and which verb governs it.
 *
 * A sentence can hold more than one clause, and each clause has its own verb
 * with its own type. *The horse raced past the barn fell* has `raced` inside a
 * relative clause and `fell` in the main clause, and the slots each one
 * licenses have nothing to do with each other.
 *
 * So verb type is stored on the `V` leaf rather than on the sentence, and every
 * rule that used to read one global verb type now asks this module which verb
 * is in charge where. Walking up to the nearest enclosing clause is the whole
 * of that question.
 */
import type { ConstituentMap, VerbType, Voice } from './types.ts';

/** `S` and `Cl` are the clause forms: each owns one subject/predicate pair. */
const CLAUSE_FORMS = ['S', 'Cl'] as const;

export function isClauseNode(cs: ConstituentMap, id: string): boolean {
  const form = cs[id]?.form;
  return form === 'S' || form === 'Cl';
}

/** Every clause in the tree, outermost first. */
export function clauseNodes(cs: ConstituentMap): string[] {
  return Object.keys(cs)
    .filter((id) => (CLAUSE_FORMS as readonly string[]).includes(cs[id]!.form))
    .sort((a, b) => depth(cs, a) - depth(cs, b));
}

function depth(cs: ConstituentMap, id: string): number {
  let d = 0;
  let cur = cs[id]?.parent ?? null;
  while (cur && d < 200) {
    d++;
    cur = cs[cur]?.parent ?? null;
  }
  return d;
}

/**
 * The clause `id` sits in. A clause node belongs to the clause ABOVE it, so a
 * relative clause acting as a postmodifier is governed by its own verb rather
 * than by the verb of the sentence containing it.
 */
export function clauseOf(cs: ConstituentMap, id: string): string | null {
  let cur = cs[id]?.parent ?? null;
  let guard = 0;
  while (cur && guard++ < 200) {
    if (isClauseNode(cs, cur)) return cur;
    cur = cs[cur]?.parent ?? null;
  }
  return null;
}

/**
 * Is this clause node a join rather than a predication?
 *
 * *The engine stalled and the car stopped* is one sentence made of two, and the
 * outer `S` has coordinates where an ordinary clause has a subject and a
 * predicate. It has no verb of its own, so asking what kind of verb it has is
 * the wrong question — the two clauses inside it answer separately.
 */
export function isCoordination(cs: ConstituentMap, id: string): boolean {
  return (cs[id]?.children ?? []).some((k) => cs[k]?.function === 'coordinate');
}

/** The predicate VP of a clause, if the learner has named one. */
export function predicateOf(cs: ConstituentMap, clauseId: string): string | null {
  return cs[clauseId]?.children.find((k) => cs[k]?.function === 'predicate') ?? null;
}

/**
 * The `V` that carries a clause's verb type: the head of its predicate.
 *
 * Only the head counts. A verb sitting somewhere else in the predicate is not
 * the one whose frame licenses the clause's slots.
 */
export function verbOfClause(cs: ConstituentMap, clauseId: string): string | null {
  const vp = predicateOf(cs, clauseId);
  if (!vp) return null;
  const head = cs[vp]?.children.find((k) => cs[k]?.function === 'head' && cs[k]?.form === 'V');
  if (head) return head;
  // A one-word predicate may be the bare V itself, before it is wrapped in a VP.
  return cs[vp]?.form === 'V' ? vp : null;
}

/** The head `V` of a verb phrase. */
export function headVerbOf(cs: ConstituentMap, vpId: string): string | null {
  return cs[vpId]?.children.find((k) => cs[k]?.function === 'head' && cs[k]?.form === 'V') ?? null;
}

/**
 * The `V` whose frame is in force for `id`, or null while nothing above it
 * answers.
 *
 * Walks up and stops at the first thing that answers: a clause answers through
 * its predicate, and a `VP` answers directly through its head. The `VP` case is
 * not a shortcut — a learner builds the predicate before the sentence around
 * it, so for most of a build there is no clause node above the node being
 * labelled, and refusing to answer there would make "object of which verb?"
 * unanswerable at exactly the moment it is being asked.
 */
export function governingVerb(cs: ConstituentMap, id: string): string | null {
  let cur = cs[id]?.parent ?? null;
  let guard = 0;
  while (cur && guard++ < 200) {
    if (isClauseNode(cs, cur)) return verbOfClause(cs, cur);
    if (cs[cur]?.form === 'VP') {
      const verb = headVerbOf(cs, cur);
      if (verb) return verb;
    }
    cur = cs[cur]?.parent ?? null;
  }
  return null;
}

export function governingVerbType(cs: ConstituentMap, id: string): VerbType | null {
  const verb = governingVerb(cs, id);
  return verb ? (cs[verb]?.verbType ?? null) : null;
}

/**
 * Active or passive where `id` sits. Absent means active, so this never
 * returns null — a verb nobody has marked is doing the ordinary thing.
 */
export function governingVoice(cs: ConstituentMap, id: string): Voice {
  const verb = governingVerb(cs, id);
  return verb ? (cs[verb]?.voice ?? 'active') : 'active';
}

/** Every `V` leaf, in surface order. One per clause once a tree is finished. */
export function verbs(cs: ConstituentMap): string[] {
  return Object.keys(cs)
    .filter((id) => cs[id]!.form === 'V' && cs[id]!.word !== undefined)
    .sort((a, b) => cs[a]!.span[0] - cs[b]!.span[0]);
}
