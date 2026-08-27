export const PHONE_MAX_WIDTH = 700;
export const COMPACT_WORKSPACE_MAX_WIDTH = 1100;

/** The point where the grammar chooser becomes a one-pane bottom sheet. */
export const PHONE_QUERY = `(max-width: ${PHONE_MAX_WIDTH}px)`;

/** Sidebars become overlay drawers before they can squeeze the working area. */
export const COMPACT_WORKSPACE_QUERY = `(max-width: ${COMPACT_WORKSPACE_MAX_WIDTH}px)`;
