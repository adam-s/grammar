/**
 * The shared frame for a course sentence.
 *
 * Constructed, not quoted. Lessons 1–15 each need ten clean examples of one
 * pattern, and literature does not supply that on demand — ten transitive
 * clauses with no auxiliary, no coordination and no modifier is a shape you
 * write, not a shape you find. The `source` says so rather than a footnote.
 *
 * Every sentence carries its FULL parse, including labels its lesson has not
 * taught. What the lesson asks for is derived by `targetReading`, so a lesson
 * never keeps a second, staler copy of its own answer.
 */
import type { BuiltReading } from '../../grammar/build.ts';
import { sentence } from '../../grammar/entry.ts';
import type { SentenceEntry } from '../../grammar/types.ts';

export function constructed(
  id: string,
  lesson: number,
  built: BuiltReading[],
  canonicalId = 'r1',
): SentenceEntry {
  const where = `lesson ${lesson}`;
  return sentence(
    id,
    where,
    built,
    canonicalId,
    { work: 'constructed', locator: where },
    // No human has read these parses. The field says so, so that "reviewed"
    // never becomes something a later reader assumes.
    { reviewedBy: 'unreviewed', reviewedAt: '2026-08-28' },
  );
}
