/**
 * Lesson 7 — Pronouns. A pronoun replaces a noun PHRASE, not a noun.
 *
 * The built set was two words a sentence, which made it the shortest lesson in
 * the whole course at lesson seven of forty, and picks fell against lesson 6.
 * More importantly it never showed the idea the lesson exists for.
 *
 * Items 6 and 7 are that idea in one line: *The man in blue laughed* becomes
 * *He laughed*, never *The he in blue laughed*. Item 9 is the structural
 * evidence for the same thing — a pronoun takes a postmodifier under a `Nom`,
 * exactly as a noun does, because it is filling the noun phrase's slot.
 */
import { adv, bare, det, postmod, pp, pron, pronmod, sv, svPlus, svMedial, v } from './shape.ts';

export const LESSON_07 = [
  svPlus(
    'c07-a',
    7,
    pron('She'),
    v('paused', 'pause', 'Vint'),
    adv('briefly'),
    'She stopped for a moment.',
  ),
  svMedial(
    'c07-b',
    7,
    pron('They'),
    adv('quietly'),
    v('agreed', 'agree', 'Vint'),
    'They said yes without fuss.',
  ),
  svPlus(
    'c07-c',
    7,
    pron('It'),
    v('vanished', 'vanish', 'Vint'),
    adv('completely'),
    'The thing disappeared entirely.',
  ),
  svPlus(
    'c07-d',
    7,
    pron('We'),
    v('waited', 'wait', 'Vint'),
    pp('outside', det('the', 'station')),
    'We stayed put beyond the station doors.',
  ),
  svPlus(
    'c07-e',
    7,
    pron('Someone'),
    v('knocked', 'knock', 'Vint'),
    adv('twice'),
    'A person rapped two times.',
  ),
  sv(
    'c07-f',
    7,
    postmod('The', 'man', pp('in', bare('blue'))),
    v('laughed', 'laugh', 'Vint'),
    'The man wearing blue found it funny.',
  ),
  sv('c07-g', 7, pron('He'), v('laughed', 'laugh', 'Vint'), 'He found it funny.'),
  svPlus(
    'c07-h',
    7,
    pron('Nothing'),
    v('moved', 'move', 'Vint'),
    adv('upstairs'),
    'Not one thing stirred on the floor above.',
  ),
  sv(
    'c07-i',
    7,
    pronmod('Nobody', pp('in', det('the', 'row'))),
    v('complained', 'complain', 'Vint'),
    'Not one person seated there objected.',
  ),
  svPlus(
    'c07-j',
    7,
    pron('Everyone'),
    v('left', 'leave', 'Vint'),
    pp('before', bare('sunset')),
    'All of them went while it was still light.',
  ),
];
