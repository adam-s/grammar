/**
 * The progression contract, as a test.
 *
 * A lesson promises never to ask for a label a later lesson introduces. Until
 * now that promise lived in prose, and prose does not fail. Here every lesson
 * sentence is pruned to what the lesson has taught and then rebuilt through the
 * real palette with that lesson's scope applied — so a forward concept is not a
 * thing you have to notice by reading, it is a red test.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isComplete } from '../grammar/builder.ts';
import { replay } from '../grammar/replay.ts';
import { canonicalReading } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';
import { coversSentence, scopeThrough, targetReading } from './scope.ts';

describe('every lesson sentence is buildable with only what that lesson has taught', () => {
  for (const lesson of COURSE_LESSONS) {
    const scope = scopeThrough(COURSE_LESSONS, lesson.number);

    for (const sentence of lesson.sentences) {
      const target = targetReading(canonicalReading(sentence), scope);

      it(`${lesson.id} — ${sentence.id} still covers the sentence`, () => {
        assert.ok(
          coversSentence(target, sentence.words),
          `nothing in scope at lesson ${lesson.number} spans the whole of “${sentence.text}”`,
        );
      });

      it(`${lesson.id} — ${sentence.id} has something to find`, () => {
        // A sentence whose target is one bare node asks the learner nothing.
        assert.ok(
          Object.keys(target.constituents).length >= 2,
          `“${sentence.text}” is a single node at lesson ${lesson.number}`,
        );
      });

      it(`${lesson.id} — ${sentence.id} is reachable through the taught palette`, () => {
        const state = replay(sentence, target, { scope });
        for (const id of Object.keys(target.constituents)) {
          const want = target.constituents[id]!;
          const built = Object.values(state.constituents).find(
            (c) =>
              c.form === want.form &&
              c.span[0] === want.span[0] &&
              c.span[1] === want.span[1] &&
              c.function === want.function,
          );
          assert.ok(built, `no ${want.form}/${want.function} over [${want.span}] was built`);
        }
        assert.ok(isComplete(state, sentence.words), 'the build never closed');
      });
    }
  }
});
