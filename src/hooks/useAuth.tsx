import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook customizado para acessar o estado e as funções de autenticação.
 * Deve ser usado apenas dentro de componentes que são filhos de AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    // Erro útil se o desenvolvedor esquecer de envolver o componente no Provider
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};