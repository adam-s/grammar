import assert from 'node:assert/strict';
import test from 'node:test';

import { FIXTURES } from '../grammar/fixtures.ts';
import { canonicalReading } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';
import { focusedFigure } from './figure-focus.ts';
import { LESSON_DOCS } from './lesson-content.ts';
import { replaySentence } from './sentence-renderer.ts';
import { scopeThrough, targetReading } from './scope.ts';

const entry = (id: string) => FIXTURES.find((sentence) => sentence.id === id)!;

/**
 * The lesson-6 view of *Those red doors creaked* — the page's actual input:
 * lesson-6 scope plus the block's declared adjective preview.
 */
function thoseDoorsAtSix(plus: string[] = []) {
  const sentence = entry('fix-determiner-those-doors');
  const scope = new Set([...scopeThrough(COURSE_LESSONS, 6), ...plus]);
  const reading = targetReading(canonicalReading(sentence), scope);
  return { sentence, build: replaySentence(sentence, reading).final };
}

test('focusing the subject crops the figure to the noun phrase', () => {
  const { sentence, build } = thoseDoorsAtSix(['form:Adj', 'func:premodifier']);
  const figure = focusedFigure(sentence.words, build.constituents, 'subject');
  assert.ok(figure, 'the subject exists at lesson-6 scope');

  assert.deepEqual(
    figure.words.map((w) => w.text),
    ['Those', 'red', 'doors'],
    'the verb and the full stop are gone',
  );
  assert.deepEqual(
    figure.words.map((w) => w.i),
    [0, 1, 2],
    'words are re-indexed from zero',
  );

  const ids = Object.keys(figure.constituents);
  const roots = ids.filter((id) => figure.constituents[id]!.parent === null);
  assert.equal(roots.length, 1, 'the phrase is the whole tree');
  const root = figure.constituents[roots[0]!]!;
  assert.equal(root.form, 'NP');
  assert.equal(root.function, null, 'a root does no job in a cropped figure');
  assert.deepEqual(root.span, [0, 2]);

  const forms = ids.map((id) => figure.constituents[id]!.form).sort();
  assert.deepEqual(
    forms,
    ['Adj', 'Det', 'N', 'NP', 'Nom'],
    'the previewed adjective label is drawn',
  );

  const nom = ids.map((id) => figure.constituents[id]!).find((c) => c.form === 'Nom')!;
  assert.deepEqual(nom.span, [1, 2], 'the nominal spans *red doors*');
});

test('without the preview, the untaught adjective label stays absent', () => {
  const { sentence, build } = thoseDoorsAtSix();
  const figure = focusedFigure(sentence.words, build.constituents, 'subject')!;
  const forms = Object.values(figure.constituents)
    .map((c) => c.form)
    .sort();
  assert.deepEqual(forms, ['Det', 'N', 'NP', 'Nom']);
});

test('a job nothing does gives no figure rather than a wrong one', () => {
  const { sentence, build } = thoseDoorsAtSix();
  assert.equal(focusedFigure(sentence.words, build.constituents, 'directObject'), null);
});

test('every focused lesson figure resolves against its pruned reading', () => {
  for (const doc of LESSON_DOCS) {
    const lesson = COURSE_LESSONS.find(({ id }) => id === doc.id)!;
    for (const block of doc.blocks) {
      if (block.kind !== 'diagram' || block.focus === undefined) continue;
      const sentence = entry(block.sentenceId);
      const scope = new Set([
        ...scopeThrough(COURSE_LESSONS, lesson.number),
        ...(block.plus ?? []),
      ]);
      const reading = targetReading(canonicalReading(sentence), scope);
      const build = replaySentence(sentence, reading).final;
      assert.ok(
        focusedFigure(sentence.words, build.constituents, block.focus),
        `${doc.id} focuses ${block.sentenceId} on "${block.focus}", which its scoped figure does not contain`,
      );
    }
  }
});
