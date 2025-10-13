// src/contexts/ThemeContext.tsx

import Colors, { ColorTheme } from '@/constants/Colors';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ColorTheme;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 4. Hook personalizado para usar o contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = Colors[currentTheme];

  const value: ThemeContextType = {
    theme: currentTheme,
    colors,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};