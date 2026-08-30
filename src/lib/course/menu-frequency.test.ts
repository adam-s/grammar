import assert from 'node:assert/strict';
import { test } from 'node:test';

import { emptyBuild } from '../grammar/builder.ts';
import { optionsFor } from '../grammar/options.ts';
import { menuSections } from '../grammar/panel-presentation.ts';
import type { Form } from '../grammar/types.ts';
import { COURSE_STAGES } from './course.ts';

test('form menus run from the most-used course label to the least-used', () => {
  const uses = new Map<Form, number>();
  for (const stage of COURSE_STAGES) {
    for (const lesson of stage.lessons) {
      for (const sentence of lesson.sentences) {
        const reading = sentence.readings.find(
          (candidate) => candidate.id === sentence.canonicalId,
        );
        assert.ok(reading, `${sentence.id} has its canonical reading`);
        for (const constituent of Object.values(reading.constituents)) {
          uses.set(constituent.form, (uses.get(constituent.form) ?? 0) + 1);
        }
      }
    }
  }

  const panel = optionsFor(emptyBuild(), [], { kind: 'none' });
  for (const group of panel.groups.filter((candidate) =>
    ['word-class', 'phrase-form'].includes(candidate.id),
  )) {
    for (const section of menuSections(group)) {
      const counts = section.options.map((option) => uses.get(option.form!) ?? 0);
      assert.deepEqual(
        counts,
        counts.toSorted((a, b) => b - a),
        `${group.id} / ${section.name || 'other'}`,
      );
    }
  }
});
