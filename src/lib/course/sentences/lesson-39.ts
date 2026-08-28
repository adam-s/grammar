/**
 * Lesson 39 — Punctuation is evidence.
 *
 * The built set asked for one distinct tree across all ten sentences and the
 * same pick count every time — two clauses, eleven words, a comma before the
 * coordinator. That is the least informative comma in English: it marks a
 * boundary the coordinator has already marked.
 *
 * Items 6 and 7 are why the lesson exists. Six words, one pair of commas, and
 * the relative goes from identifying WHICH visitors to adding something about
 * the ones already named. Items 3, 4, 5 and 9 bring in the commas the course has
 * already built and never collected — an appositive from 22, fronted clauses
 * from 29, a list from 26.
 *
 * Items 1, 2 and 8 keep the controlled pair with lesson 33, which has these
 * shapes without commas.
 */
import {
  adjn,
  adjpostmod,
  apposName,
  bare,
  det,
  helped,
  joined,
  joinedThree,
  listOf,
  modifiedBy,
  pp,
  pron,
  supplemented,
  sv,
  svo,
  v,
  whyFirst,
} from './shape.ts';

export const LESSON_39 = [
  svo(
    'c39-a',
    39,
    det('The', 'boat'),
    v('carried', 'carry', 'Vtr'),
    listOf('NP', bare('food'), bare('water'), 'and', bare('blankets')),
    'The boat took food, water and blankets on board.',
  ),
  joined(
    'c39-b',
    39,
    {
      subject: det('The', 'surveyor'),
      verb: v('measured', 'measure', 'Vtr'),
      object: det('the', 'field'),
    },
    'and',
    {
      subject: det('the', 'clerk'),
      verb: v('recorded', 'record', 'Vtr'),
      object: pron('it'),
    },
    'The surveyor sized the field and the clerk wrote it down.',
    true,
  ),
  joinedThree(
    'c39-c',
    39,
    { subject: det('The', 'rain'), verb: v('stopped', 'stop', 'Vint') },
    { subject: det('the', 'clouds'), verb: v('lifted', 'lift', 'Vint') },
    'and',
    { subject: bare('children'), verb: v('ran', 'run', 'Vint') },
    'The rain came to an end, the clouds cleared and children went outside.',
  ),
  joined(
    'c39-d',
    39,
    {
      subject: det('The', 'mechanic'),
      verb: v('checked', 'check', 'Vtr'),
      object: det('the', 'brakes'),
    },
    'but',
    { subject: det('the', 'driver'), verb: v('waited', 'wait', 'Vint') },
    'The mechanic looked at the brakes, and even so the driver stayed put.',
    true,
  ),
  whyFirst(
    'c39-e',
    39,
    {
      marker: 'When',
      subject: det('the', 'gate'),
      verb: v('opened', 'open', 'Vint'),
      kind: 'adverbial',
    },
    det('the', 'visitors'),
    v('entered', 'enter', 'Vint'),
    'The visitors went in at the moment the gate came open.',
  ),
  whyFirst(
    'c39-f',
    39,
    {
      marker: 'Before',
      subject: adjn('the', 'last', 'bus'),
      verb: v('arrived', 'arrive', 'Vint'),
      kind: 'adverbial',
    },
    det('our', 'guests'),
    v('gathered', 'gather', 'Vint'),
    'Our guests came together ahead of the final bus coming in.',
  ),
  joined(
    'c39-g',
    39,
    { subject: adjn('The', 'brass', 'bell'), verb: v('rang', 'ring', 'Vint') },
    'and',
    { subject: adjn('the', 'heavy', 'doors'), verb: v('opened', 'open', 'Vint') },
    'The brass bell sounded and the heavy doors came open.',
    true,
  ),
  sv(
    'c39-h',
    39,
    apposName('Mara', adjpostmod('our', 'new', 'captain', pp('of', det('the', 'crew')))),
    v('waved', 'wave', 'Vint'),
    "Mara, who is the crew's new captain, raised a hand.",
  ),
  sv(
    'c39-i',
    39,
    modifiedBy('The', 'visitors', {
      marker: 'who',
      subjectGap: true,
      verb: helped(v('missed', 'miss', 'Vtr'), 'had', 'have', 'perfect'),
      object: det('their', 'train'),
      kind: 'relative',
    }),
    v('waited', 'wait', 'Vint'),
    'Of the visitors, the ones with no train stayed put.',
  ),
  sv(
    'c39-j',
    39,
    supplemented('The', 'visitors', {
      marker: 'who',
      subjectGap: true,
      verb: helped(v('missed', 'miss', 'Vtr'), 'had', 'have', 'perfect'),
      object: det('their', 'train'),
    }),
    v('waited', 'wait', 'Vint'),
    'The visitors stayed put, and none of them had a train.',
  ),
];
