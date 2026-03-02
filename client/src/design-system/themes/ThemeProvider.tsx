import React, { createContext, useContext, useState } from 'react';
import { colors as lightColors } from '../tokens/colors';

const darkColors = {
  ...lightColors,
  background: '#0f172a', // slate-900
  surface: '#1e293b', // slate-800
  text: '#f8fafc', // slate-50
  border: '#334155', // slate-700
};

const themes: Record<string, typeof lightColors> = {
  light: lightColors,
  dark: darkColors,
};

interface ThemeContextValue {
  theme: string;
  colors: typeof lightColors;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  colors: lightColors,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');
  const value: ThemeContextValue = {
    theme,
    colors: themes[theme] || lightColors,
    setTheme,
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
