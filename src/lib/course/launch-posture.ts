/**
 * What the empty canvas should say first — and how loudly.
 *
 * The guided run's role changes across a learner's life, and the launcher
 * must change with it. To someone who has never finished a sentence, the
 * demonstration IS the way in: point the arrow at it and invite. To someone
 * with even one finish behind them, the right first move is trying — the
 * launcher steps back to quiet help, and the arrow moves to the words, where
 * the work actually starts. And any arrow over a diagram that already holds
 * work is noise: the learner has started; stop telling them where to.
 *
 * The decision reads EVIDENCE, not position: "has this learner ever finished
 * a sentence" is the truth that "is this lesson one" only guesses at. A
 * learner who opens lesson 40 cold has never seen the palette and needs the
 * invitation exactly as much as one on lesson 1. The completion set is the
 * learner record's; it arrives here as a bare fact and no answer can leak
 * back out — the posture knows nothing about any sentence.
 *
 * Pure on purpose: facts in, posture out, every row of the table testable
 * under `node --test`. Components render this; they never decide it.
 */

export interface LaunchPosture {
  /** Where "Start here" points: at the launcher, at the words, or nowhere. */
  arrow: 'launcher' | 'words' | null;
  /** The launcher's idle label. (After a run it says "Watch it again".) */
  label: string;
  /** How much room the launcher takes: the invitation, or quiet help. */
  tone: 'invite' | 'quiet';
}

export function launchPosture(facts: {
  /** Has this learner ever finished any sentence? */
  finishedAny: boolean;
  /** Is the diagram bare words — no work started or restored? */
  canvasEmpty: boolean;
}): LaunchPosture {
  const { finishedAny, canvasEmpty } = facts;
  return {
    arrow: !canvasEmpty ? null : finishedAny ? 'words' : 'launcher',
    label: finishedAny ? 'See one built' : 'Watch how it is built',
    tone: finishedAny ? 'quiet' : 'invite',
  };
}
