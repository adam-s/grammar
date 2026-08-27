/**
 * The live theme, and the one place that touches `documentElement`.
 *
 * A module singleton rather than context, deliberately: the theme is a property
 * of the document, of which there is exactly one, and its value comes from the
 * reader's own machine rather than from anything request-derived. Every DOM
 * access is guarded, so importing this on the server is inert.
 *
 * The class this writes is also written by a tiny inline script in `app.html`,
 * before first paint. That duplication is the point — without it the page
 * renders in the wrong theme for a frame and then jumps.
 */
import {
  DARK_QUERY,
  THEME_KEY,
  readPref,
  resolveTheme,
  type Theme,
  type ThemePref,
} from './theme.ts';

const canUseDom = typeof document !== 'undefined';

function stored(): ThemePref {
  if (!canUseDom) return 'system';
  try {
    return readPref(localStorage.getItem(THEME_KEY));
  } catch {
    // Private windows and blocked site data throw on access, not on write.
    return 'system';
  }
}

class ThemeController {
  pref = $state<ThemePref>(stored());
  systemDark = $state(canUseDom ? window.matchMedia(DARK_QUERY).matches : false);

  get resolved(): Theme {
    return resolveTheme(this.pref, this.systemDark);
  }

  set = (pref: ThemePref): void => {
    this.pref = pref;
    if (!canUseDom) return;
    try {
      localStorage.setItem(THEME_KEY, pref);
    } catch {
      // A remembered theme is a convenience; failing to remember is not an error.
    }
    this.apply();
  };

  /** Mirror the resolved theme onto the document. Safe to call repeatedly. */
  apply = (): void => {
    if (!canUseDom) return;
    const dark = this.resolved === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    // Native scrollbars, form controls and the canvas backdrop follow this,
    // and nothing in the stylesheet can set it for them.
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  };

  /**
   * Track the OS while `system` is in force. Returns a teardown; call it from
   * an effect so a hot reload does not stack listeners.
   */
  watchSystem = (): (() => void) => {
    if (!canUseDom) return () => {};
    const mq = window.matchMedia(DARK_QUERY);
    const onChange = (e: MediaQueryListEvent) => {
      this.systemDark = e.matches;
      this.apply();
    };
    mq.addEventListener('change', onChange);
    this.apply();
    return () => mq.removeEventListener('change', onChange);
  };
}

export const theme = new ThemeController();
