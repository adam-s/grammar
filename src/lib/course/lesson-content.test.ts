import assert from 'node:assert/strict';
import { test } from 'node:test';

import { FIXTURES } from '../grammar/fixtures.ts';
import { canonicalReading, type Constituent, type SentenceEntry } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';
import { LESSON_DOCS, citedSentenceIds, diagramScopes, lessonDoc } from './lesson-content.ts';
import { MENU_DECISIONS, MENU_EXAMPLES } from './menu-example-coverage.ts';
import { firstTaughtIn, scopeThrough } from './scope.ts';

/* There are no length budgets here, on purpose. A cap cannot tell a complete
   answer from compressed filler, and every number this file has held — 350
   words of prose, 18 for a lede, 24 for a caption, 60 before the first figure —
   was a guess that edited the page to fit itself. What a page must do is
   answer, cite sentences that exist, and draw nothing it has not taught. Those
   are checked below; length is read, not counted. */
test('every authored lesson belongs to the course', () => {
  const ids = new Set(COURSE_LESSONS.map((lesson) => lesson.id));
  for (const doc of LESSON_DOCS) assert.ok(ids.has(doc.id), `${doc.id} is not a course lesson`);
});

test('every cited sentence is one the app can actually diagram', () => {
  // Fixtures and the course's own graded sentences — both audited, replayed
  // and swept by the same machinery, so both are citable evidence.
  const known = new Set([
    ...FIXTURES.map((sentence) => sentence.id),
    ...COURSE_LESSONS.flatMap((lesson) => lesson.sentences.map((sentence) => sentence.id)),
  ]);
  for (const doc of LESSON_DOCS) {
    for (const id of citedSentenceIds(doc)) {
      assert.ok(known.has(id), `${doc.id} cites unknown sentence ${id}`);
    }
  }
});

/* The contract's scope rule, as a check: a page may explain in any words it
   likes, and may not DRAW a label its reader has not been taught — unless the
   block declares the preview in `plus`, which the next test holds to labels
   the course really does teach later. Pruning is `targetReading`, the same
   function the practice scope uses. */
test('no diagram shows a label the lesson has not reached', () => {
  for (const doc of LESSON_DOCS) {
    const lesson = COURSE_LESSONS.find(({ id }) => id === doc.id)!;
    const scopes = diagramScopes(doc);
    const figures = doc.blocks.filter(
      (block) => block.kind === 'diagram' || block.kind === 'contrast' || block.kind === 'hero',
    );
    assert.ok(figures.length > 0, `${doc.id} has no diagram`);
    for (const { sentenceId, through } of scopes) {
      assert.equal(
        through,
        lesson.number,
        `${doc.id} draws ${sentenceId} at scope ${through ?? 'none'}, not ${lesson.number}`,
      );
    }
    const scope = scopeThrough(COURSE_LESSONS, lesson.number);
    for (const block of doc.blocks) {
      if (block.kind !== 'label-key') continue;
      for (const row of [{ form: block.form, function: block.function }, ...block.rows]) {
        assert.ok(scope.has(`form:${row.form}`), `${doc.id} label key shows untaught ${row.form}`);
        assert.ok(
          scope.has(`func:${row.function}`),
          `${doc.id} label key shows untaught ${row.function}`,
        );
      }
    }
  }
});

/* A figure that names a reading must name one the sentence actually stores —
   a missing id would throw at render time, in front of a learner. */
test('every cited reading exists on its sentence', () => {
  const entries = new Map(
    [...FIXTURES, ...COURSE_LESSONS.flatMap((lesson) => lesson.sentences)].map((s) => [s.id, s]),
  );
  const check = (sentenceId: string, readingId: string | undefined, where: string) => {
    if (readingId === undefined) return;
    const entry = entries.get(sentenceId);
    assert.ok(entry, `${where} cites unknown sentence ${sentenceId}`);
    assert.ok(
      entry.readings.some((reading) => reading.id === readingId),
      `${where} cites reading "${readingId}", which ${sentenceId} does not store`,
    );
  };
  for (const doc of LESSON_DOCS) {
    for (const block of doc.blocks) {
      if (block.kind === 'diagram') check(block.sentenceId, block.readingId, doc.id);
      if (block.kind === 'contrast') {
        check(block.left.sentenceId, block.left.readingId, doc.id);
        check(block.right.sentenceId, block.right.readingId, doc.id);
      }
    }
  }
});

/* A preview is a promise the course keeps later. An entry nothing teaches is
   a typo; an entry the lesson already has is noise that would hide a real
   preview among false ones. */
test('a figure previews only decisions a later lesson teaches', () => {
  for (const doc of LESSON_DOCS) {
    const lesson = COURSE_LESSONS.find(({ id }) => id === doc.id)!;
    for (const block of doc.blocks) {
      if ((block.kind !== 'diagram' && block.kind !== 'contrast') || block.plus === undefined) {
        continue;
      }
      for (const decision of block.plus) {
        const home = firstTaughtIn(COURSE_LESSONS, decision);
        assert.ok(home, `${doc.id} previews "${decision}", which no lesson teaches`);
        assert.ok(
          home.number > lesson.number,
          `${doc.id} previews "${decision}", already in scope since lesson ${home.number}`,
        );
      }
    }
  }
});

test('unknown lessons report nothing rather than a placeholder', () => {
  assert.equal(lessonDoc('not-a-course-lesson'), undefined);
});

test('a lesson page answers its title before it asks anything of the reader', () => {
  // The search-result test, as far as a machine can check it: the first prose
  // block comes before the first section heading, so a reader who arrived from
  // a search engine gets the answer rather than the course's running order.
  for (const doc of LESSON_DOCS) {
    const firstProse = doc.blocks.findIndex((block) => block.kind === 'prose');
    const firstSection = doc.blocks.findIndex((block) => block.kind === 'section');
    assert.ok(firstProse >= 0, `${doc.id} has no prose`);
    assert.ok(
      firstSection === -1 || firstProse < firstSection,
      `${doc.id} opens with a section heading instead of an answer`,
    );
  }
});

function demonstrates(decision: string, sentence: SentenceEntry): boolean {
  const nodes = Object.values(canonicalReading(sentence).constituents);
  const has = (test: (node: Constituent) => boolean) => nodes.some(test);

  if (decision.startsWith('form:')) {
    const form = decision.slice('form:'.length);
    return has((node) => node.form === form);
  }
  if (decision === 'func:obligatoryAdverbial') {
    return has((node) => node.function === 'adverbial' && node.obligatory === true);
  }
  if (decision.startsWith('func:')) {
    const fn = decision.slice('func:'.length);
    return has((node) => node.function === fn);
  }
  if (decision.startsWith('vt:')) {
    const type = decision.slice('vt:'.length);
    return has((node) => node.verbType === type);
  }
  if (decision.startsWith('kind:')) {
    const kind = decision.slice('kind:'.length);
    return has((node) => node.clauseKind === kind);
  }
  if (decision.startsWith('fin:')) {
    const value = decision.slice('fin:'.length);
    return has(
      (node) =>
        (node.form === 'S' || node.form === 'Cl') && (node.finiteness ?? 'finite') === value,
    );
  }
  if (decision.startsWith('part:')) {
    const kind = decision.slice('part:'.length);
    return has((node) => node.partKind === kind);
  }
  if (decision.startsWith('aux:')) {
    const kind = decision.slice('aux:'.length);
    return has((node) => node.auxKind === kind);
  }
  if (decision.startsWith('voice:')) {
    const voice = decision.slice('voice:'.length);
    return has((node) => node.form === 'V' && (node.voice ?? 'active') === voice);
  }
  if (decision.startsWith('fuse:')) {
    const fn = decision.slice('fuse:'.length);
    return has((node) => node.fusedWith === fn);
  }
  if (decision === 'gap') return has((node) => node.gap === true);
  if (decision === 'anchor') {
    return has((node) => node.function === 'postnucleus' && node.index !== undefined);
  }
  if (decision === 'stack') {
    const reading = canonicalReading(sentence);
    return Object.values(reading.constituents).some((node) => {
      if (node.parent === null) return false;
      const parent = reading.constituents[node.parent];
      return (
        parent !== undefined && parent.span[0] === node.span[0] && parent.span[1] === node.span[1]
      );
    });
  }
  return false;
}

test('every stable menu item has one visible, parsed example in a lesson blog', () => {
  const inventory = new Set(MENU_DECISIONS);
  assert.equal(inventory.size, MENU_DECISIONS.length, 'the menu inventory repeats a decision');

  const byDecision = new Map<string, (typeof MENU_EXAMPLES)[number]>();
  for (const example of MENU_EXAMPLES) {
    assert.ok(inventory.has(example.decision), `${example.decision} is not a stable menu item`);
    assert.equal(
      byDecision.get(example.decision),
      undefined,
      `${example.decision} has more than one designated example`,
    );
    byDecision.set(example.decision, example);

    const doc = lessonDoc(example.lessonId);
    assert.ok(doc, `${example.decision} cites unknown lesson ${example.lessonId}`);
    assert.ok(
      citedSentenceIds(doc).includes(example.sentenceId),
      `${example.lessonId} does not visibly cite ${example.sentenceId} for ${example.decision}`,
    );

    // Fixtures and graded course sentences are equally valid examples — a
    // page may cite either, and both carry approved parses.
    const sentence = [...FIXTURES, ...COURSE_LESSONS.flatMap((l) => l.sentences)].find(
      ({ id }) => id === example.sentenceId,
    );
    assert.ok(sentence, `${example.decision} cites unknown sentence ${example.sentenceId}`);
    assert.ok(
      demonstrates(example.decision, sentence),
      `${example.sentenceId} does not demonstrate ${example.decision}`,
    );

    if (example.decision !== 'func:obligatoryAdverbial' && example.decision !== 'stack') {
      const lesson = COURSE_LESSONS.find(({ id }) => id === example.lessonId)!;
      assert.ok(
        scopeThrough(COURSE_LESSONS, lesson.number).has(example.decision),
        `${example.lessonId} draws ${example.decision} before the course teaches it`,
      );
    }
  }

  assert.deepEqual(
    [...inventory].filter((decision) => !byDecision.has(decision)),
    [],
    'these stable menu items have no lesson-blog example',
  );
});
