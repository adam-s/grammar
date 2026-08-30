import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { THEME_PREFS, isThemePref, readPref, resolveTheme } from './theme.ts';

describe('the theme preference', () => {
  it('resolves an explicit choice regardless of the OS', () => {
    for (const systemDark of [true, false]) {
      assert.equal(resolveTheme('light', systemDark), 'light');
      assert.equal(resolveTheme('dark', systemDark), 'dark');
    }
  });

  it('can still honor a stored system preference', () => {
    assert.equal(resolveTheme('system', true), 'dark');
    assert.equal(resolveTheme('system', false), 'light');
  });

  it('uses light when nothing valid was saved', () => {
    for (const junk of [null, undefined, '', 'DARK', 'auto', '{}']) {
      assert.equal(readPref(junk), 'light');
    }
    for (const p of THEME_PREFS) assert.equal(readPref(p), p);
  });

  it('recognises exactly the three preferences', () => {
    assert.deepEqual(THEME_PREFS.filter(isThemePref), [...THEME_PREFS]);
    assert.ok(!isThemePref('system-dark'));
  });
});
