#!/usr/bin/env node
/**
 * Which lessons have an author's dossier, and which do not.
 *
 * A report, never a failure. Forty dossiers is a lot of reading and the course
 * builds and runs without any of them. `src/lib/course/docs.test.ts` is what
 * enforces the ones that exist; this only says how far the work has got.
 */
import { existsSync } from 'node:fs';
import { COURSE_LESSONS } from '../src/lib/course/course.ts';

const has = (l) => existsSync(`docs/course/${l.id}/README.md`);
const done = COURSE_LESSONS.filter(has);
const missing = COURSE_LESSONS.filter((l) => !has(l));

console.log(`lesson dossiers: ${done.length} of ${COURSE_LESSONS.length}`);
for (const l of done) console.log(`  ${l.id}`);
if (missing.length) {
  console.log(`missing: ${missing.length}`);
  console.log(
    `  ${missing
      .slice(0, 6)
      .map((l) => l.id)
      .join(' ')}${missing.length > 6 ? ' …' : ''}`,
  );
}
