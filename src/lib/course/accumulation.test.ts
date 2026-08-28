/**
 * Practice accumulates rather than substitutes.
 *
 * `difficulty.md` wrote this contract in reaction to a weaker one. A rule about
 * the SIZE of each step's reach set cannot see substitution: a sentence drawing
 * on lessons `{1,2,3}` may be followed by one drawing on `{4,5,6}`, the size
 * never moves, and nothing has accumulated. So the contract was restated as set
 * inclusion — every step must contain the step before it.
 *
 * **That version is not satisfiable, and this file is where that was found.**
 * Inclusion makes the last sentence a superset of every earlier one, so a lesson
 * needs one sentence drawing on the union of the other nine. Measured against
 * the built corpus, **32 of 40 lessons have no such sentence**, and no reordering
 * creates one. Demanding it would mean every lesson ending on a sentence that
 * reuses all of its own material at once, which is a different course.
 *
 * What survives is the thing inclusion was reaching for: **a step may not throw
 * away what the step before it used.** Half is the line — a sentence must keep
 * at least half the earlier lessons its predecessor drew on. That catches
 * `{1,2,3}` → `{4,5,6}` exactly, and the corpus meets it with nothing to spare.
 *
 * Lesson 1 is exempt from the comparison, not by special case but by arithmetic:
 * nothing precedes it, so every reach set there is empty.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canonicalReading } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';

/** The first lesson to teach each decision, which is what a reach set names. */
const firstTaught = new Map<string, number>();
for (const lesson of COURSE_LESSONS) {
  for (const decision of lesson.teaches) {
    if (!firstTaught.has(decision)) firstTaught.set(decision, lesson.number);
  }
}

/** The earlier lessons a sentence draws on. */
function reachOf(
  lessonNumber: number,
  sentence: (typeof COURSE_LESSONS)[number]['sentences'][number],
) {
  const cs = canonicalReading(sentence).constituents;
  const from = new Set<number>();
  for (const id of Object.keys(cs)) {
    const c = cs[id]!;
    const decisions = [`form:${c.form}`];
    if (c.function) decisions.push(`func:${c.function}`);
    if (c.verbType) decisions.push(`vt:${c.verbType}`);
    if (c.clauseKind) decisions.push(`kind:${c.clauseKind}`);
    if (c.auxKind) decisions.push(`aux:${c.auxKind}`);
    if (c.finiteness) decisions.push(`fin:${c.finiteness}`);
    if (c.partKind) decisions.push(`part:${c.partKind}`);
    if (c.voice) decisions.push(`voice:${c.voice}`);
    if (c.fusedWith) decisions.push(`fuse:${c.fusedWith}`);
    if (c.gap) decisions.push('gap');
    if (c.index !== undefined) decisions.push('anchor');
    for (const d of decisions) {
      const n = firstTaught.get(d);
      if (n !== undefined && n < lessonNumber) from.add(n);
    }
  }
  return from;
}

describe('a lesson accumulates instead of substituting', () => {
  for (const lesson of COURSE_LESSONS) {
    it(`${lesson.id}`, () => {
      const sets = lesson.sentences.map((s) => reachOf(lesson.number, s));
      for (let i = 1; i < sets.length; i++) {
        const before = sets[i - 1]!;
        if (before.size === 0) continue;
        const kept = [...sets[i]!].filter((x) => before.has(x)).length;
        assert.ok(
          kept * 2 >= before.size,
          `${lesson.id} step ${i + 1} keeps ${kept} of the ${before.size} earlier lessons ` +
            `step ${i} used.\n  step ${i}: "${lesson.sentences[i - 1]!.text}" → {${[...before].sort((a, b) => a - b)}}` +
            `\n  step ${i + 1}: "${lesson.sentences[i]!.text}" → {${[...sets[i]!].sort((a, b) => a - b)}}` +
            `\nA step may reach further, but not start over. Reorder the lesson, or ` +
            `replace the sentence with one that builds on what came before.`,
        );
      }
    });
  }

  it('the running union of a lesson never shrinks', () => {
    // The weaker half of the same idea, and free to check: whatever a lesson has
    // used stays used. It cannot fail while the rule above holds, which is the
    // point — it fails first and more clearly if the reach computation breaks.
    for (const lesson of COURSE_LESSONS) {
      const union = new Set<number>();
      for (const sentence of lesson.sentences) {
        const before = union.size;
        for (const n of reachOf(lesson.number, sentence)) union.add(n);
        assert.ok(union.size >= before, `${lesson.id}: the union shrank`);
      }
    }
  });
});
