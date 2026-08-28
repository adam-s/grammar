/**
 * The lesson dossiers cannot drift from the lessons.
 *
 * A dossier is `docs/course/<lesson id>/README.md`: author-facing research
 * behind one lesson. Prose does not fail, so two things are checked here.
 *
 * A directory that names no lesson is an orphan. The first two dossier
 * directories written by hand were `00-introduction` and `01-sentence-frame`,
 * off by one against the ids the code already uses, which is exactly the drift
 * this catches.
 *
 * A dossier that does not name every decision its lesson is first to teach is
 * out of date. Change `teaches` and the dossier fails until somebody reads it.
 *
 * Coverage is NOT enforced. Most lessons have no dossier yet and that is a fine
 * state to build in. `scripts/course-docs.mjs` reports the gap.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { test } from 'node:test';
import { COURSE_LESSONS } from './course.ts';

const DOCS = 'docs/course';

/** Every subdirectory of `docs/course`, which is where a dossier lives. */
const dossierDirs = (): string[] =>
  readdirSync(DOCS).filter((name) => statSync(`${DOCS}/${name}`).isDirectory());

const dossier = (id: string): string => readFileSync(`${DOCS}/${id}/README.md`, 'utf8');

test('every dossier directory names a real lesson', () => {
  const ids = new Set(COURSE_LESSONS.map((l) => l.id));
  for (const dir of dossierDirs()) {
    assert.ok(ids.has(dir), `docs/course/${dir}/ matches no lesson id`);
  }
});

test('every dossier says which decisions its lesson teaches', () => {
  for (const dir of dossierDirs()) {
    const lesson = COURSE_LESSONS.find((l) => l.id === dir);
    assert.ok(lesson, `no lesson for ${dir}`);
    const text = dossier(dir);
    for (const decision of lesson.teaches) {
      // In backticks, not as a substring. `form:S` sits inside `form:SENTENCE`
      // and `func:subject` inside `func:subjectComplement`, so a plain
      // `includes` passes on a dossier that never names the decision at all.
      const named = new RegExp('`' + decision.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '`');
      assert.match(
        text,
        named,
        `docs/course/${dir}/README.md never mentions \`${decision}\`, which lesson ${lesson.number} is first to teach`,
      );
    }
  }
});

test('a dossier says where it got things and what it refused', () => {
  // The repo's standing rule is that a skipped step is reported, not hidden.
  // A dossier with no sourcing is a set of claims with no way to check them.
  for (const dir of dossierDirs()) {
    const text = dossier(dir);
    assert.match(text, /^## Sources$/m, `docs/course/${dir}/README.md has no Sources section`);
    assert.match(text, /^## Rejected$/m, `docs/course/${dir}/README.md has no Rejected section`);
  }
});
