/**
 * Which theme is in force.
 *
 * Three preferences, two outcomes: `system` is not a third look, it is a
 * deferral to the OS. Keeping it distinct from an explicit `light` or `dark`
 * is the whole reason this is not a boolean — a learner who has chosen dark
 * should stay dark when their laptop switches at sunset, and a learner who has
 * chosen nothing should follow it.
 *
 * Browser-free: the resolution is a pure function of the preference and what
 * the OS reports, so it is testable without a DOM.
 */

export type ThemePref = 'light' | 'dark' | 'system';
export type Theme = 'light' | 'dark';

export const THEME_PREFS: readonly ThemePref[] = ['light', 'dark', 'system'];

/** Where the preference is kept. One key, so clearing it is obvious. */
export const THEME_KEY = 'grammar:theme';

export const isThemePref = (v: unknown): v is ThemePref =>
  typeof v === 'string' && (THEME_PREFS as readonly string[]).includes(v);

/**
 * Anything unrecognised — absent, corrupt, or from an older build — falls back
 * to following the OS rather than to a guess about what the reader wants.
 */
export const readPref = (raw: string | null | undefined): ThemePref =>
  isThemePref(raw) ? raw : 'system';

export const resolveTheme = (pref: ThemePref, systemPrefersDark: boolean): Theme =>
  pref === 'system' ? (systemPrefersDark ? 'dark' : 'light') : pref;

/** The media query the OS preference is read from, in one place. */
export const DARK_QUERY = '(prefers-color-scheme: dark)';
