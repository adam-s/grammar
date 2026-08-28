/**
 * What the learner is allowed to say, at each point in the course.
 *
 * The course order is a promise: a lesson never asks for a label a later lesson
 * introduces. That promise was prose until now, and prose does not fail a test.
 * Here it is data — each lesson declares what it is the first to teach, and the
 * scope at lesson N is the union of lessons 1..N.
 *
 * Derived, never authored. A hand-written "labels available at lesson 10" list
 * is a second copy of the same truth, and the two copies disagree the first
 * time a lesson moves.
 */
import type { ChapterScope } from '../grammar/options.ts';
import type { Constituent, ConstituentMap, Reading, Word } from '../grammar/types.ts';
import { isPunctuation } from '../grammar/types.ts';
import type { CourseLesson, Teaches } from './types.ts';

/**
 * Every axis, always present.
 *
 * `ChapterScope` reads an absent list as "everything taught" — the right
 * default for the free workspace, and exactly wrong for a lesson. So a derived
 * scope fills in all four, and an empty array honestly means empty.
 */
export type FullScope = Required<ChapterScope>;

const EMPTY: FullScope = { forms: [], functions: [], verbTypes: [], clauseKinds: [] };

function add(into: FullScope, teaches: Teaches): FullScope {
  return {
    forms: [...new Set([...into.forms, ...(teaches.forms ?? [])])],
    functions: [...new Set([...into.functions, ...(teaches.functions ?? [])])],
    verbTypes: [...new Set([...into.verbTypes, ...(teaches.verbTypes ?? [])])],
    clauseKinds: [...new Set([...into.clauseKinds, ...(teaches.clauseKinds ?? [])])],
  };
}

/** Everything taught by lesson `number` and every lesson before it. */
export function scopeThrough(lessons: readonly CourseLesson[], number: number): FullScope {
  return lessons
    .filter((lesson) => lesson.number <= number)
    .reduce((scope, lesson) => add(scope, lesson.teaches), EMPTY);
}

/** The scope a lesson's own sentences are practised under. */
export function scopeFor(lessons: readonly CourseLesson[], lesson: CourseLesson): FullScope {
  return scopeThrough(lessons, lesson.number);
}

/**
 * Where a label is first taught, for reporting a violation in words the course
 * uses. Returns null for a label no lesson teaches.
 */
export function firstTaughtIn(
  lessons: readonly CourseLesson[],
  axis: keyof FullScope,
  label: string,
): CourseLesson | null {
  return (
    lessons.find((lesson) =>
      (lesson.teaches[axis] as readonly string[] | undefined)?.includes(label),
    ) ?? null
  );
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
    if (!scope.forms.includes(c.form)) return;
    if (c.function !== null && !scope.functions.includes(c.function)) return;
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
    if (kept.verbType && !scope.verbTypes.includes(kept.verbType)) delete kept.verbType;
    if (kept.clauseKind && !scope.clauseKinds.includes(kept.clauseKind)) delete kept.clauseKind;
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
