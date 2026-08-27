/**
 * Which keystrokes a lesson figure claims.
 *
 * A lesson page can hold several figures and is itself inside the workspace, so
 * "which camera does this key mean" cannot be answered by focus alone. Nobody
 * tabs to a diagram before pressing a key, so the pointer decides: the figure
 * under it is the one being read.
 *
 * The modifier check is load-bearing. The workspace canvas already owns ⌘0
 * ("100%, recentred on the content"), so a figure that also answered ⌘0 would
 * fight it and both would run.
 */
export type KeyChord = {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

export type PointerContext = {
  /** The pointer is inside this figure. */
  hovered: boolean;
  /** The keystroke is going to a text field, so no camera may take it. */
  typing: boolean;
};

export function refitsFigure(event: KeyChord, context: PointerContext): boolean {
  if (!context.hovered || context.typing) return false;
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return false;
  return event.key === '0';
}
