import assert from 'node:assert/strict';
import test from 'node:test';
import { COURSE_LESSONS } from '../course/course.ts';
import { replaySentence } from '../course/sentence-renderer.ts';
import { scopeThrough, targetReading } from '../course/scope.ts';
import { emptyBuild } from '../grammar/builder.ts';
import { answer, emptySession, sessionChoices, type Session } from '../grammar/session.ts';
import { canonicalReading } from '../grammar/types.ts';
import { isPickable } from '../grammar/options.ts';
import { buildSignature, tutorialScript } from '../tutorial/script.ts';
import {
  COMPLETION_VERSION,
  SNAPSHOT_VERSION,
  decodeCompletion,
  decodeSnapshot,
  earnsCompletion,
  encodeCompletion,
  encodeSnapshot,
  wordHash,
} from './record.ts';

const INTRO = COURSE_LESSONS[0]!;
const INTRO_SCOPE = scopeThrough(COURSE_LESSONS, INTRO.number);

/** Play a sentence's guided run through the real transaction, snapshotting
    the session after every accepted answer. The same walk script.test.ts
    proves; here it manufactures honest mid-flight and finished sessions. */
function playThrough(lessonNumber: number, sentenceIndex = 0) {
  const lesson = COURSE_LESSONS.find((l) => l.number === lessonNumber)!;
  const scope = scopeThrough(COURSE_LESSONS, lesson.number);
  const sentence = lesson.sentences[sentenceIndex]!;
  const target = targetReading(canonicalReading(sentence), scope);
  const { beats } = tutorialScript(sentence, scope, target ?? undefined);
  const states: Session[] = [];
  let s = emptySession();
  for (const beat of beats) {
    s = { ...s, selection: beat.select, verdict: null };
    const panel = sessionChoices(s, sentence, sentence.words, scope);
    const row = panel.groups.flatMap((g) => g.options).find((o) => o.key === beat.key);
    assert.ok(row && isPickable(row), `${sentence.id} step ${beat.index}: run not takeable`);
    s = answer(s, sentence, sentence.words, row, scope);
    assert.notEqual(s.verdict?.kind, 'wrong', `${sentence.id} step ${beat.index}: refused`);
    states.push(s);
  }
  return { sentence, target, states, final: s };
}

test('a session survives the round trip through a stored snapshot', () => {
  const { sentence, states } = playThrough(1);
  for (const [i, s] of states.entries()) {
    const back = decodeSnapshot(encodeSnapshot(s, sentence.words), sentence.words);
    assert.ok(back, `step ${i}: snapshot refused its own encoding`);
    assert.equal(
      buildSignature(back.build.constituents),
      buildSignature(s.build.constituents),
      `step ${i}: the restored build says something different`,
    );
    assert.deepEqual(back.build, JSON.parse(JSON.stringify(s.build)));
    assert.deepEqual(back.misses, s.misses);
    assert.deepEqual(back.rejected, s.rejected);
    // What a reload ends stays ended: no selection, no verdict in flight.
    assert.deepEqual(back.selection, { kind: 'none' });
    assert.equal(back.verdict, null);
  }
});

test('a wrong answer stays in the record across the round trip', () => {
  const sentence = INTRO.sentences[0]!;
  const { beats } = tutorialScript(
    sentence,
    INTRO_SCOPE,
    targetReading(canonicalReading(sentence), INTRO_SCOPE) ?? undefined,
  );
  const start: Session = { ...emptySession(), selection: beats[0]!.select };
  const panel = sessionChoices(start, sentence, sentence.words, INTRO_SCOPE);
  // Any pickable row that actually grades wrong — being offered is no promise
  // of being right, and being right is what most siblings of a form question
  // are not.
  let s: Session | null = null;
  for (const row of panel.groups.flatMap((g) => g.options)) {
    if (row.key === beats[0]!.key || !isPickable(row)) continue;
    const graded = answer(start, sentence, sentence.words, row, INTRO_SCOPE);
    if (graded.verdict?.kind === 'wrong') {
      s = graded;
      break;
    }
  }
  assert.ok(s, 'no offered row grades wrong on the opening question');
  const back = decodeSnapshot(encodeSnapshot(s, sentence.words), sentence.words);
  assert.ok(back);
  assert.deepEqual(back.misses, s.misses);
  assert.deepEqual(back.rejected, s.rejected);
  assert.ok(Object.keys(back.rejected).length > 0, 'the refusal was not kept');
});

test('a snapshot from another schema version, other words, or a broken build is refused whole', () => {
  const { sentence, final } = playThrough(1);
  const good = encodeSnapshot(final, sentence.words);
  assert.ok(decodeSnapshot(good, sentence.words), 'the control snapshot must restore');

  const bump = (edit: (s: Record<string, unknown>) => void) => {
    const parsed = JSON.parse(good) as Record<string, unknown>;
    edit(parsed);
    return JSON.stringify(parsed);
  };

  assert.equal(decodeSnapshot(null, sentence.words), null);
  assert.equal(decodeSnapshot('not json {', sentence.words), null);
  assert.equal(decodeSnapshot('"a string"', sentence.words), null);
  assert.equal(
    decodeSnapshot(
      bump((s) => (s['v'] = SNAPSHOT_VERSION + 1)),
      sentence.words,
    ),
    null,
    'another schema version restored instead of starting fresh',
  );
  const otherWords = COURSE_LESSONS[1]!.sentences[0]!.words;
  assert.equal(decodeSnapshot(good, otherWords), null, 'a hash from different words restored');
  assert.equal(
    decodeSnapshot(
      bump((s) => {
        const build = s['build'] as { constituents: Record<string, { children: string[] }> };
        const first = Object.keys(build.constituents)[0]!;
        build.constituents[first]!.children = ['missing-id'];
      }),
      sentence.words,
    ),
    null,
    'a build with a dangling child restored',
  );
  assert.equal(
    decodeSnapshot(
      bump((s) => ((s['build'] as { seq: number }).seq = 0)),
      sentence.words,
    ),
    null,
    'a seq behind its own ids restored — new nodes would collide',
  );
});

test('editing the sentence changes the hash; reordering the same words does too', () => {
  const words = INTRO.sentences[0]!.words;
  const edited = words.map((w, i) => (i === 0 ? { ...w, text: `${w.text}x` } : w));
  assert.notEqual(wordHash(words), wordHash(edited));
  assert.equal(wordHash(words), wordHash(words.map((w) => ({ ...w }))));
});

test('a half-built tree never earns completion; the finished run always does', () => {
  const problems: string[] = [];
  for (const lesson of COURSE_LESSONS) {
    const scope = scopeThrough(COURSE_LESSONS, lesson.number);
    for (const sentence of lesson.sentences) {
      const target = targetReading(canonicalReading(sentence), scope);
      const { beats } = tutorialScript(sentence, scope, target ?? undefined);
      let s = emptySession();
      if (earnsCompletion(s.build, sentence, target))
        problems.push(`${sentence.id}: an empty build graded as finished`);
      for (const beat of beats) {
        s = { ...s, selection: beat.select, verdict: null };
        const panel = sessionChoices(s, sentence, sentence.words, scope);
        const row = panel.groups.flatMap((g) => g.options).find((o) => o.key === beat.key);
        if (!row || !isPickable(row)) {
          problems.push(`${sentence.id}: run not takeable at step ${beat.index}`);
          break;
        }
        s = answer(s, sentence, sentence.words, row, scope);
      }
      if (!earnsCompletion(s.build, sentence, target))
        problems.push(`${sentence.id}: the finished run did not grade as finished`);
    }
  }
  assert.deepEqual(problems, [], `${problems.length} completion problem(s)`);
});

test('an equivalent correct tree earns the same completion', () => {
  const withAlternates = COURSE_LESSONS.flatMap((l) => l.sentences).find(
    (s) => (canonicalReading(s).equivalentStructures?.length ?? 0) > 0,
  );
  assert.ok(withAlternates, 'no course sentence carries an equivalent structure');
  const alternate = canonicalReading(withAlternates).equivalentStructures![0]!;
  const ids = Object.keys(alternate).map((id) => Number(id.replace(/^c/, '')) || 0);
  const build = { constituents: alternate, seq: Math.max(0, ...ids) };
  assert.ok(
    earnsCompletion(build, withAlternates, null),
    `${withAlternates.id}: the grader accepts this tree but completion refused it`,
  );
});

test('the completion set round-trips, and anything else decodes as empty', () => {
  const ids = new Set(['c01-1', 'c02-3']);
  assert.deepEqual(decodeCompletion(encodeCompletion(ids)), ids);
  assert.deepEqual(decodeCompletion(null), new Set());
  assert.deepEqual(decodeCompletion('nonsense {'), new Set());
  assert.deepEqual(
    decodeCompletion(JSON.stringify({ v: COMPLETION_VERSION + 1, ids: ['c01-1'] })),
    new Set(),
    'another schema version must read as no completions, not a crash',
  );
  assert.deepEqual(decodeCompletion(JSON.stringify({ v: COMPLETION_VERSION, ids: 'c01-1' })), new Set());
});

test('an empty session encodes to a snapshot that restores empty', () => {
  const words = INTRO.sentences[0]!.words;
  const back = decodeSnapshot(encodeSnapshot(emptySession(), words), words);
  assert.ok(back);
  assert.deepEqual(back.build, emptyBuild());
});

test('every course sentence’s full canonical build survives the trip', () => {
  // The whole corpus, because the odd shapes live in the tail: gaps with
  // their backwards spans, anchored pairs, fusions. Any build the course can
  // produce must restore whole or be refused whole — never bend.
  for (const lesson of COURSE_LESSONS) {
    for (const sentence of lesson.sentences) {
      const final = replaySentence(sentence).final;
      const session = { ...emptySession(), build: final };
      const back = decodeSnapshot(encodeSnapshot(session, sentence.words), sentence.words);
      assert.deepEqual(back?.build, final, `${sentence.id} bent in storage`);
    }
  }
});
