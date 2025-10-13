import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext } from 'react';

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }

  return context;
};