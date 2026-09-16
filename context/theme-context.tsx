import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

import { loadThemeMode, saveThemeMode } from '@/lib/storage';
import type { ThemeMode } from '@/types/diary';

type ThemeContextValue = {
  mode: ThemeMode;
  paperTheme: MD3Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1565C0',
    secondary: '#2E7D32',
  },
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90CAF9',
    secondary: '#A5D6A7',
  },
};

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    loadThemeMode().then((saved) => {
      if (saved) {
        setMode(saved);
      }
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      paperTheme: mode === 'dark' ? darkTheme : lightTheme,
      toggleTheme: () => {
        setMode((current) => {
          const next = current === 'dark' ? 'light' : 'dark';
          saveThemeMode(next);
          return next;
        });
      },
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useThemeMode должен вызываться внутри ThemeModeProvider');
  }
  return value;
}
