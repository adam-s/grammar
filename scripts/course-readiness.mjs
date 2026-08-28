#!/usr/bin/env node
/**
 * Report — and optionally enforce — human sign-off on the course readings.
 *
 * `npm run all` prints this and never fails on it, because unreviewed content
 * is a fine state to build and look at. `npm run course:release` passes
 * `--require-reviewed` and fails, because unreviewed content is not a fine
 * state to grade somebody with.
 *
 * The point is that shipping the course as assessment becomes a deliberate act.
 * Before this, `reviewedBy: 'unreviewed'` was an honest string that nothing
 * consulted, so the only thing standing between four hundred unread parses and
 * a learner being marked against them was that nobody had got round to it.
 */
import { COURSE_LESSONS } from '../src/lib/course/course.ts';
import { reviewStatus } from '../src/lib/course/readiness.ts';

const strict = process.argv.includes('--require-reviewed');
const { total, reviewed, outstanding, reviewers } = reviewStatus(COURSE_LESSONS);

console.log(`course readings: ${reviewed} of ${total} reviewed by a person`);
for (const [who, n] of [...reviewers].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${n} by ${who}`);
}

if (outstanding.length === 0) {
  console.log('every reading is signed for.');
  process.exit(0);
}

const shown = outstanding.slice(0, 8).join(' ');
const more = outstanding.length > 8 ? ` … and ${outstanding.length - 8} more` : '';
console.log(`unreviewed: ${outstanding.length}`);
console.log(`  ${shown}${more}`);

if (!strict) {
  console.log(
    '\nThis is a report, not a failure. The audits prove these parses are well\n' +
      'formed and reachable; they cannot prove one is true. Do not present this\n' +
      'course as assessment until a qualified person has read every reading and\n' +
      'gloss and recorded their name and the date against it.',
  );
  process.exit(0);
}

console.error(
  `\nRefusing to release: ${outstanding.length} readings have no named reviewer.\n` +
    'Set `reviewedBy` and `reviewedAt` on each, or do not call this a course.',
);
process.exit(1);
