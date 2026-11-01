import { useEffect } from 'react';

// Gerätebezogene Anzeige-Einstellung, darum nicht im (exportierbaren) Fortschritt. index.html setzt sie schon vor dem ersten Rendern.
export type ThemePref = 'system' | 'light' | 'dark';
const KEY = 'netcloud-theme';
const lightMedia = () => window.matchMedia('(prefers-color-scheme: light)');

export function readTheme(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function applyTheme(pref: ThemePref) {
  const light = pref === 'light' || (pref === 'system' && lightMedia().matches);
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f2f2f7' : '#000000');
}

export function setTheme(pref: ThemePref) {
  try {
    localStorage.setItem(KEY, pref);
  } catch {
    // ohne Speicher gilt die Wahl nur bis zum Neuladen
  }
  applyTheme(pref);
}

/** Folgt dem System-Hell/Dunkel-Wechsel, solange „System“ gewählt ist. */
export function useThemeSync() {
  useEffect(() => {
    const on = () => applyTheme(readTheme());
    on();
    const m = lightMedia();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
}
