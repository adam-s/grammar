/**
 * Lesson 40 — Final synthesis.
 *
 * No new idea. Each of these needs most of the course at once — a relative
 * clause postmodifying the subject and a nominal clause in the object slot —
 * so the only way through is the same first question, asked as many times as
 * there are verbs.
 */
import { adv, det, modifiedBy, svClause, v } from './shape.ts';

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
  svClause(
    'c40-b',
    40,
    who('surveyor', v('objected', 'object', 'Vint')),
    v('insisted', 'insist', 'Vtr'),
    that(det('the', 'boundary'), v('shifted', 'shift', 'Vint')),
    'The objecting surveyor insisted the boundary had moved.',
  ),
  svClause(
    'c40-c',
    40,
    who('clerk', v('resigned', 'resign', 'Vint')),
    v('claimed', 'claim', 'Vtr'),
    that(det('the', 'deeds'), v('vanished', 'vanish', 'Vint')),
    'The clerk who left said the deeds had gone.',
  ),
  svClause(
    'c40-d',
    40,
    who('tenant', v('complained', 'complain', 'Vint'), 'twice'),
    v('argued', 'argue', 'Vtr'),
    that(det('the', 'roof'), v('leaked', 'leak', 'Vint')),
    'The twice-complaining tenant argued the roof leaked.',
  ),
  svClause(
    'c40-e',
    40,
    who('witness', v('hesitated', 'hesitate', 'Vint')),
    v('admitted', 'admit', 'Vtr'),
    that(det('the', 'driver'), v('braked', 'brake', 'Vint')),
    'The hesitant witness admitted the driver braked.',
  ),
  svClause(
    'c40-f',
    40,
    who('auditor', v('returned', 'return', 'Vint')),
    v('confirmed', 'confirm', 'Vtr'),
    that(det('the', 'ledger'), v('balanced', 'balance', 'Vint')),
    'The auditor who came back confirmed it balanced.',
  ),
  svClause(
    'c40-g',
    40,
    who('guard', v('waited', 'wait', 'Vint'), 'outside'),
    v('denied', 'deny', 'Vtr'),
    that(det('the', 'gate'), v('opened', 'open', 'Vint')),
    'The waiting guard denied the gate had opened.',
  ),
  svClause(
    'c40-h',
    40,
    who('engineer', v('testified', 'testify', 'Vint')),
    v('showed', 'show', 'Vtr'),
    that(det('the', 'valve'), v('failed', 'fail', 'Vint')),
    'The engineer who gave evidence showed the valve failed.',
  ),
  svClause(
    'c40-i',
    40,
    who('baker', v('protested', 'protest', 'Vint'), 'loudly'),
    v('proved', 'prove', 'Vtr'),
    that(det('the', 'queue'), v('lengthened', 'lengthen', 'Vint')),
    'The loudly protesting baker proved the queue grew.',
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
