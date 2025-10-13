// src/contexts/ThemeContext.tsx

import Colors, { ColorTheme } from '@/constants/Colors';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ColorTheme;
  toggleTheme: () => void;
  followSystemTheme: () => void;
  isSystemTheme: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(colorScheme ?? 'light');
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  React.useEffect(() => {
    if (isSystemTheme && colorScheme) {
      setCurrentTheme(colorScheme);
    }
  }, [colorScheme, isSystemTheme]);

  const toggleTheme = () => {
    if (isSystemTheme) {
      setIsSystemTheme(false);
      setCurrentTheme(colorScheme === 'light' ? 'dark' : 'light');
    } else {
      setCurrentTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }
  };

  const followSystemTheme = () => {
    setIsSystemTheme(true);
    setCurrentTheme(colorScheme ?? 'light');
  };

  const colors = Colors[currentTheme];

  const value: ThemeContextType = {
    theme: currentTheme,
    colors,
    toggleTheme,
    followSystemTheme,
    isSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};