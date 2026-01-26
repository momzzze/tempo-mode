import { useEffect, useState } from 'react';

export const PALETTES = ['green', 'amber', 'mono'] as const;
export type Palette = (typeof PALETTES)[number];
export type Mode = 'dark' | 'light';
export type Theme = `${Palette}-${Mode}`;

const THEME_KEY = 'tempo-mode-theme';
const defaultTheme: Theme = 'green-dark';

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
  return isTheme(stored) ? stored : null;
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return defaultTheme;
  const mode: Mode = window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
  return buildTheme('green', mode);
}

function buildTheme(palette: Palette, mode: Mode): Theme {
  return `${palette}-${mode}` as Theme;
}

function isTheme(value: unknown): value is Theme {
  if (typeof value !== 'string') return false;
  const [pal, md] = value.split('-') as [Palette, Mode];
  return (
    (PALETTES as readonly string[]).includes(pal) &&
    (md === 'dark' || md === 'light')
  );
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_KEY, theme);
}

export function initThemeOnce() {
  const stored = getStoredTheme();
  const initial = stored ?? getSystemTheme();
  applyTheme(initial);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => getStoredTheme() ?? getSystemTheme()
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setPalette = (palette: Palette) => {
    setTheme((prev) => {
      const mode: Mode = prev.endsWith('-light') ? 'light' : 'dark';
      return buildTheme(palette, mode);
    });
  };

  const setMode = (mode: Mode) => {
    setTheme((prev) => {
      const palette = prev.split('-')[0] as Palette;
      return buildTheme(palette, mode);
    });
  };

  return {
    theme,
    setTheme,
    setPalette,
    setMode,
    palettes: PALETTES as readonly Palette[],
    modes: ['dark', 'light'] as const,
  };
}
