/**
 * The workspace tells a learner how much of the question they have answered
 * ("3 of 5 labels"). A count that stalls, jumps backwards, or reads "5 of 5"
 * on an unfinished sentence would be worse than no count, so this replays
 * every lesson sentence the way the guided run builds it and holds the count
 * to three promises:
 *
 * - an empty board has answered nothing, and every question asks something;
 * - every step the replay takes moves the count forward, the moment it is
 *   taken, whichever end of the tree the learner starts from;
 * - the finished build has placed every label, and it is exactly the build
 *   that earns completion.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { emptyBuild } from '../grammar/builder.ts';
import { matchesReading, progressToward } from '../grammar/grader.ts';
import { canonicalReading } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';
import { scopeThrough, targetReading } from './scope.ts';
import { replaySentence } from './sentence-renderer.ts';

describe('the label count a learner sees', () => {
  for (const lesson of COURSE_LESSONS) {
    const scope = scopeThrough(COURSE_LESSONS, lesson.number);
    it(`${lesson.id}: starts at nothing, only rises, and ends complete`, () => {
      for (const sentence of lesson.sentences) {
        const target = targetReading(canonicalReading(sentence), scope);
        const start = progressToward(emptyBuild(), target);
        assert.equal(start.done, 0, `${sentence.id} counts labels on an empty board`);
        assert.ok(start.total > 0, `${sentence.id} asks for nothing`);

        const replay = replaySentence(sentence, target);
        let last = 0;
        for (const [i, step] of replay.steps.entries()) {
          const now = progressToward(step.state, target);
          assert.equal(now.total, start.total, `${sentence.id} step ${i} changed the total`);
          // Every step places a label, so every step must show: a count that
          // waits for the node above before crediting the one below would
          // stall for most of a bottom-up build and then jump.
          assert.ok(
            now.done > last,
            `${sentence.id} step ${i} did not count: ${now.done} ≤ ${last}`,
          );
          if (!matchesReading(step.state, target)) {
            assert.ok(now.done < now.total, `${sentence.id} step ${i} reads complete but is not`);
          }
          last = now.done;
        }

        const end = progressToward(replay.final, target);
        assert.equal(
          end.done,
          end.total,
          `${sentence.id} finished short: ${end.done}/${end.total}`,
        );
        assert.ok(
          matchesReading(replay.final, target),
          `${sentence.id} final build is not the target`,
        );
      }
    });
  }
});
