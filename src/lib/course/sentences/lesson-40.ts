/**
 * Lesson 40 — Final synthesis.
 *
 * No new idea. Each of these needs most of the course at once, so the only way
 * through is the same first question — find the verb, ask what it needs —
 * asked as many times as there are verbs.
 *
 * The main clause is a different pattern almost every time. A synthesis whose
 * ten sentences all had the same frame would be testing one procedure ten
 * times rather than the six the course spent stage 2 building.
 */
import { adj, adv, det, modifiedBy, pp, svClause, svc, svo, svoa, svoc, svoo, v } from './shape.ts';

const who = (noun: string, verb: ReturnType<typeof v>, late?: string) =>
  modifiedBy('The', noun, {
    marker: 'who',
    subjectGap: true,
    verb,
    kind: 'relative' as const,
    ...(late ? { adverbial: adv(late) } : {}),
  });

const that = (subject: ReturnType<typeof det>, verb: ReturnType<typeof v>) => ({
  marker: 'that',
  subject,
  verb,
  kind: 'nominal' as const,
});

export const LESSON_40 = [
  svClause(
    'c40-a',
    40,
    who('inspector', v('arrived', 'arrive', 'Vint'), 'late'),
    v('reported', 'report', 'Vtr'),
    that(det('the', 'wiring'), v('smoked', 'smoke', 'Vint')),
    'The late-arriving inspector said the wiring smoked.',
  ),
  svoc(
    'c40-b',
    40,
    who('surveyor', v('objected', 'object', 'Vint')),
    v('called', 'call', 'Vc'),
    det('the', 'boundary'),
    adj('wrong'),
    'The objecting surveyor said the boundary was wrong.',
  ),
  svClause(
    'c40-c',
    40,
    who('clerk', v('resigned', 'resign', 'Vint')),
    v('claimed', 'claim', 'Vtr'),
    that(det('the', 'deeds'), v('vanished', 'vanish', 'Vint')),
    'The clerk who left said the deeds had gone.',
  ),
  svoo(
    'c40-d',
    40,
    who('tenant', v('complained', 'complain', 'Vint'), 'twice'),
    v('sent', 'send', 'Vg'),
    det('her', 'landlord'),
    det('a', 'notice'),
    'The twice-complaining tenant sent the landlord a notice.',
  ),
  svClause(
    'c40-e',
    40,
    who('witness', v('hesitated', 'hesitate', 'Vint')),
    v('admitted', 'admit', 'Vtr'),
    that(det('the', 'driver'), v('braked', 'brake', 'Vint')),
    'The hesitant witness admitted the driver braked.',
  ),
  svc(
    'c40-f',
    40,
    who('auditor', v('returned', 'return', 'Vint')),
    v('was', 'be', 'Vbe'),
    adj('satisfied'),
    'The auditor who came back was content.',
  ),
  svoa(
    'c40-g',
    40,
    who('guard', v('waited', 'wait', 'Vint'), 'outside'),
    v('put', 'put', 'Vtr'),
    det('that', 'ledger'),
    pp('in', det('the', 'safe')),
    'The waiting guard placed the ledger in the safe.',
  ),
  svClause(
    'c40-h',
    40,
    who('engineer', v('testified', 'testify', 'Vint')),
    v('showed', 'show', 'Vtr'),
    that(det('the', 'valve'), v('failed', 'fail', 'Vint')),
    'The engineer who gave evidence showed the valve failed.',
  ),
  svo(
    'c40-i',
    40,
    who('baker', v('protested', 'protest', 'Vint'), 'loudly'),
    v('closed', 'close', 'Vtr'),
    det('the', 'shop'),
    'The loudly protesting baker shut the shop.',
  ),
  svClause(
    'c40-j',
    40,
    who('trustee', v('abstained', 'abstain', 'Vint')),
    v('accepted', 'accept', 'Vtr'),
    that(det('the', 'archive'), v('flooded', 'flood', 'Vint')),
    'The abstaining trustee accepted the archive had flooded.',
  ),
];
