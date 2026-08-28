/**
 * Lesson 38 — Interjections and sentence-edge words.
 *
 * `form:Interj` was taught here and used in none of the four hundred sentences
 * this set replaced — the last of the two decisions taught and never exercised.
 * *Oh, the gate opened* and *Well, the clerk waited* use it.
 *
 * Every built supplement was sentence-initial with a comma, so free position —
 * the clearest evidence of what a supplement is — was never shown. The three
 * *surprisingly* sentences move one word through three places with nothing else
 * changing.
 *
 * *Yesterday the children waited* and *Sadly, the children waited* are the pair
 * the lesson most needs. Both start with a word and a
 * comma before a clause, and one is an adverbial while the other is a
 * supplement. The removal test does NOT separate them — both drop. The question
 * test does: *When did they play? Yesterday* works, and *How did they play?
 * Sadly* does not, because *sadly* is the writer's view rather than the manner.
 */
import {
  adv,
  det,
  interjection,
  pron,
  remark,
  remarkLast,
  remarkMedial,
  svFronted,
  v,
} from './shape.ts';

export const LESSON_38 = [
  interjection(
    'c38-a',
    38,
    'Oh',
    det('the', 'gate'),
    v('opened', 'open', 'Vint'),
    'The gate came open, and that is a surprise.',
  ),
  interjection(
    'c38-b',
    38,
    'Well',
    det('the', 'clerk'),
    v('waited', 'wait', 'Vint'),
    'The clerk stayed put, and that is how it went.',
  ),
  remark(
    'c38-c',
    38,
    'Unfortunately',
    det('that', 'ferry'),
    v('sank', 'sink', 'Vint'),
    'That ferry went down, which is a bad thing.',
  ),
  remark(
    'c38-d',
    38,
    'Surprisingly',
    det('the', 'engine'),
    v('restarted', 'restart', 'Vint'),
    'The engine got going again, which was unexpected.',
  ),
  remarkMedial(
    'c38-e',
    38,
    det('The', 'engine'),
    'surprisingly',
    v('restarted', 'restart', 'Vint'),
    'The engine got going again, which was unexpected.',
  ),
  remarkLast(
    'c38-f',
    38,
    det('The', 'engine'),
    v('restarted', 'restart', 'Vint'),
    'surprisingly',
    'The engine got going again, which was unexpected.',
  ),
  svFronted(
    'c38-g',
    38,
    adv('Yesterday'),
    det('the', 'children'),
    v('waited', 'wait', 'Vint'),
    'The children stayed put the day before.',
  ),
  remark(
    'c38-h',
    38,
    'Sadly',
    det('the', 'children'),
    v('waited', 'wait', 'Vint'),
    'The children stayed put, which is a shame.',
  ),
  remark(
    'c38-i',
    38,
    'Frankly',
    pron('everyone'),
    v('hesitated', 'hesitate', 'Vint'),
    'Every one of them held back, and I will say so plainly.',
  ),
  remark(
    'c38-j',
    38,
    'Happily',
    det('the', 'crew'),
    v('saved', 'save', 'Vtr'),
    'The crew got the archive out, which is a good thing.',
    { object: det('the', 'archive') },
  ),
];
