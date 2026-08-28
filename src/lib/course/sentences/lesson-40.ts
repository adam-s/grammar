/**
 * Lesson 40 — Final synthesis.
 *
 * Every one of the built set's ten sentences opened the same way — a noun phrase
 * with a relative clause modifying its subject — so a learner could start each
 * one identically and only think from the main verb on. And it contained only
 * nominal and relative clauses: six of the seven things Stage 5 taught were
 * absent from the lesson meant to gather everything.
 *
 * These open five different ways and bring the passive, the participial, the
 * gerund, the infinitive, coordination and a supplement back. *The inspector
 * photographed the engineer in the office* carries two readings, which lesson 27
 * had a monopoly on.
 */
import {
  adjn,
  adv,
  ambiguous,
  clauseSubject,
  det,
  joined,
  modifiedBy,
  passive,
  passiveWhy,
  pp,
  remark,
  sv,
  svClause,
  svoo,
  v,
} from './shape.ts';

export const LESSON_40 = [
  ambiguous(
    'c40-a',
    40,
    det('The', 'inspector'),
    v('photographed', 'photograph', 'Vtr'),
    'the',
    'engineer',
    'in',
    det('the', 'office'),
    'The inspector was in the office when the picture was taken.',
    'The engineer who works in the office.',
  ),
  passiveWhy(
    'c40-b',
    40,
    det('The', 'harbour'),
    passive(v('dredged', 'dredge', 'Vtr'), 'was'),
    {
      marker: 'before',
      subject: det('the', 'season'),
      verb: v('ended', 'end', 'Vint'),
      kind: 'adverbial',
    },
    'Somebody cleared the harbour bed ahead of the season finishing.',
  ),
  clauseSubject(
    'c40-c',
    40,
    {
      kind: 'nominal',
      finiteness: 'gerund-participial',
      verb: v('Reading', 'read', 'Vtr'),
      object: det('the', 'warning'),
    },
    v('prevented', 'prevent', 'Vtr'),
    adjn('a', 'serious', 'mistake'),
    'Going through the warning stopped a bad error.',
  ),
  svClause(
    'c40-d',
    40,
    modifiedBy('The', 'inspector', {
      marker: 'who',
      subjectGap: true,
      verb: v('arrived', 'arrive', 'Vint'),
      kind: 'relative',
    }),
    v('reported', 'report', 'Vtr'),
    {
      marker: 'that',
      subject: det('the', 'wiring'),
      verb: v('smoked', 'smoke', 'Vint'),
      kind: 'nominal',
    },
    'The inspector who turned up said the wiring was giving off smoke.',
  ),
  svClause(
    'c40-e',
    40,
    modifiedBy('The', 'clerk', {
      marker: 'who',
      subjectGap: true,
      verb: v('resigned', 'resign', 'Vint'),
      kind: 'relative',
    }),
    v('claimed', 'claim', 'Vtr'),
    {
      marker: 'that',
      subject: det('the', 'deeds'),
      verb: v('vanished', 'vanish', 'Vint'),
      kind: 'nominal',
    },
    'The clerk who left the post said the deeds had gone missing.',
  ),
  svoo(
    'c40-f',
    40,
    modifiedBy('The', 'tenant', {
      marker: 'who',
      subjectGap: true,
      verb: v('complained', 'complain', 'Vint'),
      kind: 'relative',
    }),
    v('sent', 'send', 'Vg'),
    det('her', 'landlord'),
    det('a', 'notice'),
    'The tenant who objected posted a notice to her landlord.',
  ),
  joined(
    'c40-g',
    40,
    { subject: det('The', 'station'), verb: passive(v('restored', 'restore', 'Vtr'), 'was') },
    'and',
    { subject: det('the', 'town'), verb: v('rejoiced', 'rejoice', 'Vint') },
    'Somebody put the station back in order and the town was glad.',
    true,
  ),
  sv(
    'c40-h',
    40,
    modifiedBy('The', 'plan', {
      finiteness: 'participial',
      kind: 'relative',
      objectGap: true,
      verb: v('drafted', 'draft', 'Vtr'),
      adverbial: pp('by', det('the', 'committee')),
    }),
    v('failed', 'fail', 'Vint'),
    'The plan the committee drew up came to nothing.',
  ),
  remark(
    'c40-i',
    40,
    'Fortunately',
    modifiedBy('the', 'visitors', {
      marker: 'who',
      subjectGap: true,
      verb: v('complained', 'complain', 'Vint'),
      kind: 'relative',
    }),
    v('returned', 'return', 'Vint'),
    'The visitors who objected came back, which is a good thing.',
  ),
  svClause(
    'c40-j',
    40,
    modifiedBy('The', 'surveyor', {
      marker: 'who',
      subjectGap: true,
      verb: v('returned', 'return', 'Vint'),
      kind: 'relative',
    }),
    v('promised', 'promise', 'Vtr'),
    {
      marker: 'to',
      infinitival: true,
      verb: v('wait', 'wait', 'Vint'),
      adverbial: adv('outside'),
      kind: 'nominal',
      finiteness: 'infinitival',
    },
    'The surveyor who came back gave his word that he would stay out there.',
  ),
];
