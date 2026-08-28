/**
 * Lesson 18 — Adverbs and adverb phrases. An adverbial the verb does not need.
 *
 * Take it away and the sentence stands, which is what separates this from
 * lesson 14. The clause patterns vary because an optional adverbial can hang
 * off any of them, and ten sentences that were all S V would have taught that
 * adverbials belong to intransitive verbs.
 *
 * **Three things this lesson does not yet do**, recorded here because they are
 * the next thing anyone writing sentences for it should fix:
 *
 * 1. **Every adverb phrase in both corpora is one word.** All 27 of them, while
 *    12 of the 76 adjective phrases hold more than one. So the lesson teaches a
 *    phrase layer that has never contained anything but its head, and a learner
 *    is right to ask what the `AdvP` node is for. *very quickly*, *far too late*
 *    would answer it — and no fixture proves that shape either, so the contract
 *    set needs one first.
 * 2. **Place adverbs are one word: *outside*.** No *here*, *there*,
 *    *everywhere*, *upstairs*. Place as a ROLE is well covered by prepositional
 *    phrases, so the gap is narrow, but it is real.
 * 3. **Frequency is two: *again*, *twice*.** No *always*, *never*, *often*,
 *    *rarely*, which is the commonest kind of adverb a learner meets.
 *
 * The semantic types themselves — manner, time, place, frequency — are not
 * labelled and should not be; see `ClauseFunction.adverbial` in `types.ts` for
 * why. Showing the range is the point, not naming it.
 */
import { adj, adv, det, pron, svPlus, svcPlus, svoPlus, v } from './shape.ts';

export const LESSON_18 = [
  svPlus(
    'c18-a',
    18,
    det('The', 'train'),
    v('arrived', 'arrive', 'Vint'),
    adv('late'),
    'The train came in behind time.',
  ),
  svoPlus(
    'c18-b',
    18,
    det('The', 'auditor'),
    v('checked', 'check', 'Vtr'),
    det('the', 'ledger'),
    adv('twice'),
    'The auditor went through the ledger two times.',
  ),
  svPlus(
    'c18-c',
    18,
    pron('She'),
    v('answered', 'answer', 'Vint'),
    adv('immediately'),
    'She replied at once.',
  ),
  svcPlus(
    'c18-d',
    18,
    det('The', 'room'),
    v('grew', 'grow', 'Vlink'),
    adj('quiet'),
    adv('again'),
    'The room went quiet once more.',
  ),
  svPlus(
    'c18-e',
    18,
    det('Those', 'negotiations'),
    v('resumed', 'resume', 'Vint'),
    adv('yesterday'),
    'Those talks started again yesterday.',
  ),
  svoPlus(
    'c18-f',
    18,
    det('The', 'crew'),
    v('cleared', 'clear', 'Vtr'),
    det('the', 'track'),
    adv('quickly'),
    'The crew made the track passable fast.',
  ),
  svPlus(
    'c18-g',
    18,
    det('The', 'audience'),
    v('waited', 'wait', 'Vint'),
    adv('patiently'),
    'The audience waited without complaint.',
  ),
  svcPlus(
    'c18-h',
    18,
    det('The', 'evidence'),
    v('seemed', 'seem', 'Vlink'),
    adj('thin'),
    adv('afterwards'),
    'Later on the evidence looked thin.',
  ),
  svPlus(
    'c18-i',
    18,
    det('That', 'ice'),
    v('melted', 'melt', 'Vint'),
    adv('overnight'),
    'That ice turned to water during the night.',
  ),
  svoPlus(
    'c18-j',
    18,
    det('The', 'landlord'),
    v('raised', 'raise', 'Vtr'),
    det('the', 'rent'),
    adv('again'),
    'The landlord put the rent up once more.',
  ),
];
