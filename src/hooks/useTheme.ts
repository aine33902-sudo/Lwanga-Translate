import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export type Theme = 'light' | 'dark';
const THEME_KEY = 'lwanga-theme-v1';

function readPreference(): Theme | null {
  try {
    const preference = localStorage.getItem(THEME_KEY);
    return preference === 'dark' || preference === 'light' ? preference : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111b17' : '#f8f8f3');
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => readPreference() ?? systemTheme());
  const explicitPreference = useRef(readPreference() !== null);

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (!explicitPreference.current) setTheme(media.matches ? 'dark' : 'light');
    };
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== THEME_KEY && event.key !== null) return;
      const preference = readPreference();
      explicitPreference.current = preference !== null;
      setTheme(preference ?? systemTheme());
    };
    media.addEventListener('change', handleSystemChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      media.removeEventListener('change', handleSystemChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const selectTheme = useCallback((next: Theme) => {
    explicitPreference.current = true;
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Keep the choice for this visit when browser storage is restricted.
    }
  }, []);

  return { theme, selectTheme };
}