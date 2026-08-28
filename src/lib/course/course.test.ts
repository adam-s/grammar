import assert from 'node:assert/strict';
import test from 'node:test';
import { CLAUSE_KINDS } from '../grammar/node-variants.ts';
import {
  AUX_KINDS,
  CLAUSE_FUNCTIONS,
  FINITENESS,
  PART_KINDS,
  PHRASE_FORMS,
  PHRASE_INTERNAL_FUNCTIONS,
  VERB_TYPES,
  WORD_FORMS,
} from '../grammar/types.ts';
import { COURSE_LESSONS, COURSE_STAGES } from './course.ts';
import { scopeThrough } from './scope.ts';

test('course lessons have stable order, concise copy, and distinct sentences', () => {
  const lessonIds = new Set<string>();
  const sentenceIds = new Set<string>();

  assert.ok(COURSE_STAGES.length > 0);
  for (const [index, lesson] of COURSE_LESSONS.entries()) {
    assert.equal(lesson.number, index + 1);
    assert.ok(!lessonIds.has(lesson.id));
    lessonIds.add(lesson.id);
    assert.ok(lesson.title.split(/\s+/).length <= 5);
    for (const sentence of lesson.sentences) {
      assert.ok(!sentenceIds.has(sentence.id), `${sentence.id} is assigned to two lessons`);
      sentenceIds.add(sentence.id);
    }
  }
});

/**
 * `teaches` means FIRST taught. A label claimed by two lessons has no first
 * lesson, so the scope ladder built from it would be a guess.
 */
test('no decision is introduced twice', () => {
  const seen = new Map<string, string>();
  for (const lesson of COURSE_LESSONS) {
    for (const decision of lesson.teaches) {
      const earlier = seen.get(decision);
      assert.equal(earlier, undefined, `"${decision}": lesson ${earlier} and ${lesson.id}`);
      seen.set(decision, lesson.id);
    }
  }
});

/**
 * A decision the palette does not offer is a decision no learner can make, and
 * a lesson that claims to teach one would silently never come true.
 */
test('every decision a lesson teaches is a row the palette can produce', () => {
  const real = new Set<string>([
    ...[...PHRASE_FORMS, ...WORD_FORMS].map((f) => `form:${f}`),
    ...[...CLAUSE_FUNCTIONS, ...PHRASE_INTERNAL_FUNCTIONS].map((f) => `func:${f}`),
    ...VERB_TYPES.map((t) => `vt:${t}`),
    ...CLAUSE_KINDS.map((k) => `kind:${k}`),
    ...FINITENESS.map((f) => `fin:${f}`),
    ...PART_KINDS.map((k) => `part:${k}`),
    ...AUX_KINDS.map((k) => `aux:${k}`),
    'voice:active',
    'voice:passive',
    // The structural moves. They are rows a learner picks, so they are
    // decisions a lesson has to be able to claim.
    'gap',
    'anchor',
    ...PHRASE_INTERNAL_FUNCTIONS.map((f) => `fuse:${f}`),
  ]);
  for (const lesson of COURSE_LESSONS) {
    for (const decision of lesson.teaches) {
      assert.ok(real.has(decision), `${lesson.id} teaches "${decision}", which is not a row`);
    }
  }
});

test('scope only ever grows, and lesson one already teaches something', () => {
  let previous = 0;
  for (const lesson of COURSE_LESSONS) {
    const size = scopeThrough(COURSE_LESSONS, lesson.number).size;
    assert.ok(size >= previous, `${lesson.id} narrowed the scope`);
    previous = size;
  }
  assert.ok(scopeThrough(COURSE_LESSONS, 1).size > 0, 'lesson 1 must be buildable');
});

/**
 * Every row the palette can produce has an introduction policy.
 *
 * The contract says `teaches` uses the same decision strings as the palette, so
 * a new row cannot silently escape the ladder. It could, twice over: gaps and
 * anchors returned `null` from `decisionOf` and a fused row was flattened to
 * `func:head`, so three kinds of learner decision existed that no lesson was
 * able to claim — while lesson 31 was quietly using one.
 *
 * This closes it from the other end. Enumerate the decisions the palette can
 * emit, and require each to be either taught by a lesson or listed below with a
 * reason. A row that is neither is a decision a learner can make that the
 * course has never thought about.
 */
const NOT_IN_COURSE_ONE: Record<string, string> = {
  'func:flat': 'flat names are unassigned',
  'func:prenucleus': 'questions and fronting are Course 2, lesson 41',
  'func:placeholderSubject': 'dummy it and existential there are Course 2, lesson 45',
  'func:extraposed': 'extraposition is Course 2, lesson 46',
  'func:displaced': 'heavy-NP shift is assigned to neither course',
  'kind:interrogative': 'questions are Course 2, lesson 41',
  'kind:exclamative': 'Course 2 at the earliest; no lesson claims it',
  'fin:finite': 'the standing answer on every clause; never a question the course asks',
  'voice:active': 'the standing answer on every verb',
};

test('every decision the palette can emit is taught or explained', () => {
  const taught = new Set(COURSE_LESSONS.flatMap((l) => l.teaches));
  const emitted = [
    ...[...PHRASE_FORMS, ...WORD_FORMS].map((f) => `form:${f}`),
    ...[...CLAUSE_FUNCTIONS, ...PHRASE_INTERNAL_FUNCTIONS].map((f) => `func:${f}`),
    ...VERB_TYPES.map((t) => `vt:${t}`),
    ...CLAUSE_KINDS.map((k) => `kind:${k}`),
    ...FINITENESS.map((f) => `fin:${f}`),
    ...PART_KINDS.map((k) => `part:${k}`),
    ...AUX_KINDS.map((k) => `aux:${k}`),
    'voice:active',
    'voice:passive',
    'gap',
    'anchor',
    'fuse:determiner',
    'fuse:premodifier',
  ];
  const orphans = emitted.filter((d) => !taught.has(d) && !(d in NOT_IN_COURSE_ONE));
  assert.deepEqual(
    orphans,
    [],
    'each of these is a row a learner can pick that no lesson introduces — ' +
      'teach it, or add a line to NOT_IN_COURSE_ONE saying why not',
  );
});

test('nothing is both taught and excused', () => {
  const taught = new Set(COURSE_LESSONS.flatMap((l) => l.teaches));
  for (const decision of Object.keys(NOT_IN_COURSE_ONE)) {
    assert.ok(!taught.has(decision), `${decision} is taught, so drop its excuse`);
  }
});
