import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { FIXTURES } from './fixtures.ts';
import type { VerbForms } from './morphology.ts';
import {
  IRREGULAR,
  PRONOUNS,
  beFor,
  formsOf,
  objectCase,
  regularIng,
  regularPast,
  regularS,
  subjectCase,
} from './morphology.ts';

describe('the forms a transform cannot move into place', () => {
  it('derives a regular verb rather than listing it', () => {
    assert.equal(regularPast('repair'), 'repaired');
    assert.equal(regularPast('like'), 'liked');
    assert.equal(regularPast('carry'), 'carried');
    assert.equal(regularPast('play'), 'played', 'a vowel before the y keeps it');
    assert.equal(regularS('fix'), 'fixes');
    assert.equal(regularS('carry'), 'carries');
    assert.equal(regularIng('like'), 'liking');
    assert.equal(regularIng('see'), 'seeing', 'a double e keeps both');
  });

  it('says where every form came from, because that is what a caller acts on', () => {
    assert.equal(formsOf('break')!.source, 'listed');
    assert.equal(formsOf('break')!.participle, 'broken');
    assert.equal(formsOf('repair')!.source, 'derived');
    assert.equal(formsOf('')!, null);
  });

  it('takes the sentence at its word before anything else', () => {
    // No rule can tell *smite* from *repair*, and both come out *-ed*. The
    // person who wrote the sentence knows, so what they wrote wins.
    const authored = formsOf('smite', { participle: 'smitten', past: 'smote' })!;
    assert.equal(authored.participle, 'smitten');
    assert.equal(authored.source, 'authored');
    // And it wins over the table too, which is a convenience and not an
    // authority — a fixture may be quoting a dialect the table does not have.
    const over = formsOf('break', { participle: 'broke' })!;
    assert.equal(over.participle, 'broke');
    assert.equal(over.source, 'authored');
  });

  it('fills the gaps around what was authored', () => {
    const partial = formsOf('smite', { participle: 'smitten' })!;
    assert.equal(partial.participle, 'smitten');
    assert.equal(partial.ing, 'smiting', 'the rest is still derived');
  });

  it('lists nothing the regular rules would have got right anyway', () => {
    for (const v of IRREGULAR) {
      const derived =
        regularPast(v.lemma) === v.past &&
        regularPast(v.lemma) === v.participle &&
        regularS(v.lemma) === v.s &&
        regularIng(v.lemma) === v.ing;
      assert.equal(derived, false, `${v.lemma} is regular and does not need an entry`);
    }
  });

  it('has no blanks and no duplicates', () => {
    const lemmas = IRREGULAR.map((v) => v.lemma);
    assert.equal(new Set(lemmas).size, lemmas.length);
    for (const v of IRREGULAR) {
      for (const [k, form] of Object.entries(v)) {
        assert.ok(form.length > 0, `${v.lemma}.${k} is blank`);
      }
    }
  });

  it('changes the case of a pronoun and nothing else', () => {
    assert.equal(objectCase('she'), 'her');
    assert.equal(objectCase('I'), 'me');
    assert.equal(objectCase('it'), 'it');
    assert.equal(objectCase('mechanic'), 'mechanic');
    assert.equal(subjectCase('them'), 'they');
    assert.equal(subjectCase('you'), 'you', 'a form that is both stays put');
  });

  it('is a closed list, and every entry has both cases', () => {
    for (const p of PRONOUNS) {
      assert.ok(p.subject.length > 0 && p.object.length > 0);
    }
    assert.equal(new Set(PRONOUNS.map((p) => p.subject)).size, PRONOUNS.length);
  });

  it('agrees "be" with what is being promoted', () => {
    assert.equal(beFor('past', true), 'was');
    assert.equal(beFor('past', false), 'were');
    assert.equal(beFor('present', true), 'is');
    assert.equal(beFor('present', false), 'are');
  });
});

describe('what an author writes, checked against what they wrote it on', () => {
  it('every authored form agrees with the word as it is spelled', () => {
    // The check an author most needs. A sentence saying *broke* with
    // `forms: { past: 'broken' }` is a typo nothing else would catch, and it
    // would surface later as a transform producing a word nobody said.
    const BY_TAG: Record<string, keyof VerbForms> = {
      VBD: 'past',
      VBN: 'participle',
      VBG: 'ing',
      VBZ: 's',
    };
    for (const s of FIXTURES) {
      for (const w of s.words) {
        const key = BY_TAG[w.xpos];
        const written = key ? w.forms?.[key] : undefined;
        if (!written) continue;
        assert.equal(
          written.toLowerCase(),
          w.text.toLowerCase(),
          `${s.id}: "${w.text}" is tagged ${w.xpos}, so forms.${key} should be "${w.text}"`,
        );
      }
    }
  });

  it('an authored form is the lemma’s form, not another word', () => {
    // A weaker check that still catches the commonest slip: pasting the forms
    // of a neighbouring verb.
    for (const s of FIXTURES) {
      for (const w of s.words) {
        if (!w.forms) continue;
        const known = formsOf(w.lemma, w.forms)!;
        assert.equal(known.lemma, w.lemma);
        assert.equal(known.source, 'authored');
      }
    }
  });

  it('the fixture that shows the shape actually uses it', () => {
    const broke = FIXTURES.find((s) => s.id === 'fix-irregular')!.words.find(
      (w) => w.lemma === 'break',
    )!;
    assert.deepEqual(broke.forms, { past: 'broke', participle: 'broken' });
  });
});
