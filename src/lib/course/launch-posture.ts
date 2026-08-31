/**
 * What the empty canvas should say first — and how loudly.
 *
 * The guided run is the way IN exactly once: on the introduction, where the
 * learner has never seen the palette and watching is the right first move.
 * There it gets the full welcome — a big invitation with "Start here"
 * pointing at it. On every later lesson the run is a tool, not a doorway:
 * the launcher sits flush with the top toolbar, styled like the view toggle
 * beside it, and reads "Step through" — what it does, one step at a time.
 * "Start here" moves to the words, where the work actually begins, and any
 * arrow over a diagram that already holds work is noise: the learner has
 * started; stop telling them where to.
 *
 * Pure on purpose: facts in, posture out, every row of the table testable
 * under `node --test`. Components render this; they never decide it.
 */

export interface LaunchPosture {
  /** Where "Start here" points: at the launcher, at the words, or nowhere. */
  arrow: 'launcher' | 'words' | null;
  /** The launcher's idle label. (After a run it says "Watch it again".) */
  label: string;
  /** How the launcher presents: the invitation, or a quiet toolbar control. */
  tone: 'invite' | 'quiet';
}

export function launchPosture(facts: {
  /** Is this the course's introduction — the learner's first exposure? */
  introduction: boolean;
  /** Is the diagram bare words — no work started or restored? */
  canvasEmpty: boolean;
}): LaunchPosture {
  const { introduction, canvasEmpty } = facts;
  if (introduction) {
    return {
      arrow: canvasEmpty ? 'launcher' : null,
      label: 'Watch how it is built',
      tone: 'invite',
    };
  }
  return {
    arrow: canvasEmpty ? 'words' : null,
    label: 'Step through',
    tone: 'quiet',
  };
}
