/**
 * Which theme is in force.
 *
 * Three preferences, two outcomes: `system` is not a third look, it is a
 * deferral to the OS. It remains a valid stored preference for existing users,
 * while a learner who has chosen nothing starts in light mode.
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
 * Anything unrecognised — absent, corrupt, or from an older build — starts in
 * the app's light default.
 */
export const readPref = (raw: string | null | undefined): ThemePref =>
  isThemePref(raw) ? raw : 'light';

export const resolveTheme = (pref: ThemePref, systemPrefersDark: boolean): Theme =>
  pref === 'system' ? (systemPrefersDark ? 'dark' : 'light') : pref;

/** The media query the OS preference is read from, in one place. */
export const DARK_QUERY = '(prefers-color-scheme: dark)';
