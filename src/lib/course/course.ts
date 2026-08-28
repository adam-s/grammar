/**
 * The course order, as a dependency graph rather than a table of contents.
 *
 * `teaches` is the load-bearing field. It says what a lesson is the FIRST to
 * introduce, and everything else — what the palette offers at lesson 10, which
 * sentences a lesson may use, whether the order is even consistent — is derived
 * from it by `scope.ts` and checked by `scope.test.ts`.
 *
 * **A verb-type lesson teaches the phrase form its new slot needs, on the day
 * the slot appears.** That is why `AdjP` arrives with the linking verb and `PP`
 * with the required adverbial, rather than waiting for the phrase stage. The
 * alternative is a lesson that asks the learner to fill a slot with a shape the
 * course has forbidden, which is not a course order at all.
 *
 * Lessons 2 and 4 teach no new label on purpose. They add a test — replace the
 * run with *it*, ask what the sentence is about — and a test is a thing worth a
 * lesson even when it names nothing new.
 */
import { LESSON_01 } from './sentences/lesson-01.ts';
import { LESSON_02 } from './sentences/lesson-02.ts';
import { LESSON_03 } from './sentences/lesson-03.ts';
import { LESSON_04 } from './sentences/lesson-04.ts';
import { LESSON_05 } from './sentences/lesson-05.ts';
import { LESSON_06 } from './sentences/lesson-06.ts';
import { LESSON_07 } from './sentences/lesson-07.ts';
import { LESSON_08 } from './sentences/lesson-08.ts';
import { LESSON_09 } from './sentences/lesson-09.ts';
import { LESSON_10 } from './sentences/lesson-10.ts';
import { LESSON_11 } from './sentences/lesson-11.ts';
import { LESSON_12 } from './sentences/lesson-12.ts';
import { LESSON_13 } from './sentences/lesson-13.ts';
import { LESSON_14 } from './sentences/lesson-14.ts';
import { LESSON_15 } from './sentences/lesson-15.ts';
import { LESSON_16 } from './sentences/lesson-16.ts';
import { LESSON_17 } from './sentences/lesson-17.ts';
import { LESSON_18 } from './sentences/lesson-18.ts';
import { LESSON_19 } from './sentences/lesson-19.ts';
import { LESSON_20 } from './sentences/lesson-20.ts';
import { LESSON_21 } from './sentences/lesson-21.ts';
import { LESSON_22 } from './sentences/lesson-22.ts';
import { LESSON_23 } from './sentences/lesson-23.ts';
import { LESSON_24 } from './sentences/lesson-24.ts';
import { LESSON_25 } from './sentences/lesson-25.ts';
import { LESSON_26 } from './sentences/lesson-26.ts';
import { LESSON_27 } from './sentences/lesson-27.ts';
import { LESSON_28 } from './sentences/lesson-28.ts';
import { LESSON_29 } from './sentences/lesson-29.ts';
import { LESSON_30 } from './sentences/lesson-30.ts';
import { LESSON_31 } from './sentences/lesson-31.ts';
import { LESSON_32 } from './sentences/lesson-32.ts';
import { LESSON_33 } from './sentences/lesson-33.ts';
import { LESSON_34 } from './sentences/lesson-34.ts';
import { LESSON_35 } from './sentences/lesson-35.ts';
import { LESSON_36 } from './sentences/lesson-36.ts';
import { LESSON_37 } from './sentences/lesson-37.ts';
import { LESSON_38 } from './sentences/lesson-38.ts';
import { LESSON_39 } from './sentences/lesson-39.ts';
import { LESSON_40 } from './sentences/lesson-40.ts';
import type { CourseStage } from './types.ts';

export const COURSE_STAGES: CourseStage[] = [
  {
    id: 'frame',
    title: 'Frame',
    lessons: [
      {
        id: '01-introduction',
        number: 1,
        stage: 'Frame',
        title: 'Introduction',
        teaches: ['form:S', 'form:NP', 'form:VP', 'func:subject', 'func:predicate'],
        sentences: LESSON_01,
      },
      {
        id: '02-sentence-frame',
        number: 2,
        stage: 'Frame',
        title: 'A sentence has two parts',
        teaches: [],
        sentences: LESSON_02,
      },
      {
        id: '03-main-verb',
        number: 3,
        stage: 'Frame',
        title: 'Find the main verb',
        // `head` lands here and not at lesson 5 because the palette makes you
        // give every word a job, and the job of the verb at the centre of a
        // predicate is head. Lesson 5 generalises it to the noun.
        teaches: ['form:V', 'func:head'],
        sentences: LESSON_03,
      },
      {
        id: '04-noun-phrases',
        number: 4,
        stage: 'Frame',
        title: 'Noun phrases',
        teaches: [],
        sentences: LESSON_04,
      },
      {
        id: '05-find-the-head',
        number: 5,
        stage: 'Frame',
        title: 'Find the head',
        teaches: ['form:N'],
        sentences: LESSON_05,
      },
      {
        id: '06-determiners',
        number: 6,
        stage: 'Frame',
        title: 'Determiners',
        teaches: ['form:Det', 'func:determiner'],
        sentences: LESSON_06,
      },
      {
        id: '07-pronouns',
        number: 7,
        stage: 'Frame',
        title: 'Pronouns',
        teaches: ['form:Pron'],
        sentences: LESSON_07,
      },
    ],
  },
  {
    id: 'predict',
    title: 'Predict',
    lessons: [
      {
        id: '08-verbs-alone',
        number: 8,
        stage: 'Predict',
        title: 'Verbs that stand alone',
        teaches: ['vt:Vint'],
        sentences: LESSON_08,
      },
      {
        id: '09-verbs-with-objects',
        number: 9,
        stage: 'Predict',
        title: 'Verbs that take an object',
        teaches: ['func:directObject', 'vt:Vtr'],
        sentences: LESSON_09,
      },
      {
        id: '10-linking-verbs',
        number: 10,
        stage: 'Predict',
        title: 'Linking verbs',
        // The natural subject complement is an adjective — *the soup tasted
        // salty*. Holding `AdjP` back to the phrase stage would leave this
        // lesson with nothing but noun complements to work with.
        teaches: ['form:Adj', 'form:AdjP', 'func:subjectComplement', 'vt:Vlink'],
        sentences: LESSON_10,
      },
      {
        id: '11-the-verb-be',
        number: 11,
        stage: 'Predict',
        title: 'The verb be',
        teaches: ['vt:Vbe'],
        sentences: LESSON_11,
      },
      {
        id: '12-two-objects',
        number: 12,
        stage: 'Predict',
        title: 'Two objects',
        teaches: ['func:indirectObject', 'vt:Vg'],
        sentences: LESSON_12,
      },
      {
        id: '13-naming-the-object',
        number: 13,
        stage: 'Predict',
        title: 'Naming the object',
        teaches: ['func:objectComplement', 'vt:Vc'],
        sentences: LESSON_13,
      },
      {
        id: '14-required-adverbials',
        number: 14,
        stage: 'Predict',
        title: 'When an adverbial is required',
        // An adverbial has to be made of something. The two shapes it comes in
        // are a prepositional phrase and an adverb phrase, so both arrive with
        // the function that needs them, along with the `complement` a
        // preposition takes.
        teaches: [
          'form:P',
          'form:PP',
          'form:Adv',
          'form:AdvP',
          'func:adverbial',
          'func:complement',
        ],
        sentences: LESSON_14,
      },
      {
        id: '15-one-procedure',
        number: 15,
        stage: 'Predict',
        title: 'The six types, one procedure',
        teaches: [],
        sentences: LESSON_15,
      },
    ],
  },
  {
    id: 'phrases',
    title: 'Phrases',
    lessons: [
      {
        id: '16-adjectives-before-nouns',
        number: 16,
        stage: 'Phrases',
        title: 'Adjectives before nouns',
        // An adjective before a noun modifies the NOUN, not the phrase, so it
        // needs a layer to share with it. `Nom` is that layer, and it arrives
        // here because this is the first sentence that cannot be drawn without
        // one.
        teaches: ['form:Nom', 'func:premodifier'],
        sentences: LESSON_16,
      },
      {
        id: '17-adjective-phrases',
        number: 17,
        stage: 'Phrases',
        title: 'Adjective phrases',
        teaches: [],
        sentences: LESSON_17,
      },
      {
        id: '18-adverb-phrases',
        number: 18,
        stage: 'Phrases',
        title: 'Adverbs and adverb phrases',
        teaches: [],
        sentences: LESSON_18,
      },
      {
        id: '19-prepositional-phrases',
        number: 19,
        stage: 'Phrases',
        title: 'Prepositional phrases',
        teaches: [],
        sentences: LESSON_19,
      },
      {
        id: '20-form-is-not-function',
        number: 20,
        stage: 'Phrases',
        title: 'Form is not function',
        teaches: [],
        sentences: LESSON_20,
      },
      {
        id: '21-modifiers-after-the-head',
        number: 21,
        stage: 'Phrases',
        title: 'Modifiers after the head',
        teaches: ['func:postmodifier'],
        sentences: LESSON_21,
      },
      {
        id: '22-appositives',
        number: 22,
        stage: 'Phrases',
        title: 'Appositives',
        teaches: ['func:appositive'],
        sentences: LESSON_22,
      },
      {
        id: '23-numbers-in-noun-phrases',
        number: 23,
        stage: 'Phrases',
        title: 'Numbers in noun phrases',
        teaches: ['form:Num'],
        sentences: LESSON_23,
      },
      {
        id: '24-auxiliary-verbs',
        number: 24,
        stage: 'Phrases',
        title: 'Auxiliary verbs',
        teaches: [
          'form:Aux',
          'func:auxiliary',
          'aux:modal',
          'aux:perfect',
          'aux:progressive',
          'aux:do',
        ],
        sentences: LESSON_24,
      },
      {
        id: '25-particles',
        number: 25,
        stage: 'Phrases',
        title: 'Particles',
        teaches: ['form:Part', 'func:particle', 'part:verbal'],
        sentences: LESSON_25,
      },
      {
        id: '26-coordination-in-phrases',
        number: 26,
        stage: 'Phrases',
        title: 'Coordination inside phrases',
        teaches: ['form:Conj', 'func:coordinate', 'func:coordinator'],
        sentences: LESSON_26,
      },
      {
        id: '27-attachment-changes-meaning',
        number: 27,
        stage: 'Phrases',
        title: 'Attachment changes meaning',
        teaches: [],
        sentences: LESSON_27,
      },
    ],
  },
  {
    id: 'clauses',
    title: 'Clauses',
    lessons: [
      {
        id: '28-main-and-dependent',
        number: 28,
        stage: 'Clauses',
        title: 'Main and dependent clauses',
        // `kind:nominal` lands here and not at lesson 30 because a clause has
        // to be some kind of clause, and this is the first lesson that draws
        // one. Lesson 30 teaches the JOBS a nominal clause does — subject,
        // object, complement — which is where the work actually is.
        teaches: ['form:Cl', 'kind:nominal'],
        sentences: LESSON_28,
      },
      {
        id: '29-adverbial-clauses',
        number: 29,
        stage: 'Clauses',
        title: 'Adverbial clauses',
        teaches: ['form:Subord', 'func:marker', 'kind:adverbial'],
        sentences: LESSON_29,
      },
      {
        id: '30-nominal-clauses',
        number: 30,
        stage: 'Clauses',
        title: 'Nominal clauses',
        teaches: [],
        sentences: LESSON_30,
      },
      {
        id: '31-relative-clauses',
        number: 31,
        stage: 'Clauses',
        title: 'Relative clauses',
        teaches: ['kind:relative'],
        sentences: LESSON_31,
      },
      {
        id: '32-comparative-clauses',
        number: 32,
        stage: 'Clauses',
        title: 'Comparative clauses',
        teaches: ['kind:comparative', 'func:postnucleus'],
        sentences: LESSON_32,
      },
      {
        id: '33-coordination-between-clauses',
        number: 33,
        stage: 'Clauses',
        title: 'Coordination between clauses',
        teaches: [],
        sentences: LESSON_33,
      },
    ],
  },
  {
    id: 'reduced',
    title: 'Reduced and marked',
    lessons: [
      {
        id: '34-infinitive-clauses',
        number: 34,
        stage: 'Reduced and marked',
        title: 'Infinitive clauses',
        teaches: ['part:infinitival', 'fin:infinitival'],
        sentences: LESSON_34,
      },
      {
        id: '35-participial-clauses',
        number: 35,
        stage: 'Reduced and marked',
        title: 'Participial clauses',
        teaches: ['fin:participial'],
        sentences: LESSON_35,
      },
      {
        id: '36-gerund-clauses',
        number: 36,
        stage: 'Reduced and marked',
        title: 'Gerund clauses',
        teaches: ['fin:gerund-participial'],
        sentences: LESSON_36,
      },
      {
        id: '37-passive-voice',
        number: 37,
        stage: 'Reduced and marked',
        title: 'Passive voice',
        teaches: ['voice:passive', 'aux:passive'],
        sentences: LESSON_37,
      },
      {
        id: '38-sentence-edge-words',
        number: 38,
        stage: 'Reduced and marked',
        title: 'Interjections and edge words',
        teaches: ['form:Interj', 'func:supplement'],
        sentences: LESSON_38,
      },
      {
        id: '39-punctuation-is-evidence',
        number: 39,
        stage: 'Reduced and marked',
        title: 'Punctuation is evidence',
        teaches: [],
        sentences: LESSON_39,
      },
      {
        id: '40-final-synthesis',
        number: 40,
        stage: 'Reduced and marked',
        title: 'Final synthesis',
        teaches: [],
        sentences: LESSON_40,
      },
    ],
  },
];

export const COURSE_LESSONS = COURSE_STAGES.flatMap((stage) => stage.lessons);

export function lessonById(id: string) {
  return COURSE_LESSONS.find((lesson) => lesson.id === id) ?? COURSE_LESSONS[0]!;
}
