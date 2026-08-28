/**
 * What the learner is allowed to say, at each point in the course.
 *
 * The course order is a promise: a lesson never asks for a label a later lesson
 * introduces. That promise was prose until now, and prose does not fail a test.
 * Here it is data — each lesson declares what it is the first to teach, and the
 * scope at lesson N is the union of lessons 1..N.
 *
 * A lesson teaches DECISIONS, written the way the palette writes them:
 * `form:NP`, `func:subject`, `vt:Vtr`, `kind:relative`, `fin:infinitival`,
 * `voice:passive`, `part:infinitival`, `aux:perfect`. One list rather than one
 * per kind, because the course introduces every kind on its own schedule and
 * six parallel lists would be six places to forget.
 *
 * Derived, never authored. A hand-written "labels available at lesson 10" list
 * is a second copy of the same truth, and the two copies disagree the first
 * time a lesson moves.
 */
import type { ChapterScope } from '../grammar/options.ts';
import type { Constituent, ConstituentMap, Reading, Word } from '../grammar/types.ts';
import { isPunctuation } from '../grammar/types.ts';
import type { CourseLesson } from './types.ts';

/** A scope that is definitely a set — what a lesson always has. */
export type FullScope = ReadonlySet<string>;

/** Everything taught by lesson `number` and every lesson before it. */
export function scopeThrough(lessons: readonly CourseLesson[], number: number): FullScope {
  const out = new Set<string>();
  for (const lesson of lessons) {
    if (lesson.number > number) continue;
    for (const decision of lesson.teaches) out.add(decision);
  }
  return out;
}

/** The scope a lesson's own sentences are practised under. */
export function scopeFor(lessons: readonly CourseLesson[], lesson: CourseLesson): FullScope {
  return scopeThrough(lessons, lesson.number);
}

/** Where a decision is first taught, or null if no lesson teaches it. */
export function firstTaughtIn(
  lessons: readonly CourseLesson[],
  decision: string,
): CourseLesson | null {
  return lessons.find((lesson) => lesson.teaches.includes(decision)) ?? null;
}

/**
 * The part of a parse a lesson actually asks for.
 *
 * A lesson's sentence is a whole sentence — *The engine stalled* carries a
 * determiner and a verb type long before those lessons arrive. So the target
 * is not a restricted sentence but a restricted QUESTION about a full one: keep
 * the nodes whose labels are in scope, and stop at the first one that is not.
 * The words under a stopped node stay visible and stay unlabelled, which is
 * exactly what the diagram already draws for a phrase nobody has opened yet.
 *
 * Derived, so a lesson never stores a second, staler copy of its own answer.
 */
export function targetReading(reading: Reading, scope: FullScope): Reading {
  const source = reading.constituents;
  const root = Object.keys(source).find((id) => source[id]!.parent === null);
  const keep = new Set<string>();

  const walk = (id: string) => {
    const c = source[id]!;
    if (!scope.has(`form:${c.form}`)) return;
    if (c.function !== null && !scope.has(`func:${c.function}`)) return;
    keep.add(id);
    for (const child of c.children) walk(child);
  };
  if (root) walk(root);

  const constituents: ConstituentMap = {};
  for (const id of keep) {
    const c = source[id]!;
    const kept: Constituent = { ...c, children: c.children.filter((child) => keep.has(child)) };
    // Decisions the learner has not been taught to make are not part of the
    // question, even on a node that is. Lesson 3 names the verb; lesson 8 is
    // the first that may say what kind of verb it is.
    if (kept.verbType && !scope.has(`vt:${kept.verbType}`)) delete kept.verbType;
    if (kept.clauseKind && !scope.has(`kind:${kept.clauseKind}`)) delete kept.clauseKind;
    if (kept.finiteness && !scope.has(`fin:${kept.finiteness}`)) delete kept.finiteness;
    if (kept.voice && !scope.has(`voice:${kept.voice}`)) delete kept.voice;
    if (kept.partKind && !scope.has(`part:${kept.partKind}`)) delete kept.partKind;
    if (kept.auxKind && !scope.has(`aux:${kept.auxKind}`)) delete kept.auxKind;
    constituents[id] = kept;
  }
  return { ...reading, constituents };
}

/** Does this target still cover the whole sentence? An unbuildable lesson is one that does not. */
export function coversSentence(target: Reading, words: readonly Word[]): boolean {
  const ids = Object.keys(target.constituents);
  const root = ids.find((id) => target.constituents[id]!.parent === null);
  if (!root) return false;
  const real = words.filter((w) => !isPunctuation(w)).map((w) => w.i);
  const span = target.constituents[root]!.span;
  return real.length > 0 && span[0] === real[0] && span[1] === real.at(-1);
}

/** The palette's own type, for callers that hold a scope. */
export type { ChapterScope };
