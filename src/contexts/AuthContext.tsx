// src/providers/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
// Simulação de uma função de API
import { loginApi, logoutApi, getStoredUser } from '../services/authService'; 
import { User, Credentials } from '../types/auth'; // Tipos definidos em outro local (ex: src/types/auth.ts)

// 1. Definição da Interface do Contexto
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: Credentials) => Promise<boolean>;
  signOut: () => Promise<void>;
}

// 2. Criação do Contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Criação do Provedor (Componente)
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para carregar o usuário armazenado (token, etc.) ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getStoredUser(); // Simula a verificação de token/usuário no AsyncStorage
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Função de Login
  const signIn = async (credentials: Credentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      await loginApi(credentials); // Chamada de API real
      // setUser(loggedUser);
      // Aqui você armazenaria o token/usuário no AsyncStorage ou SecureStore
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login falhou:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Função de Logout
  const signOut = async () => {
    try {
      await logoutApi(); // Limpa tokens na API
      // Limpa dados locais (AsyncStorage)
      setUser(null);
    } catch (error) {
      console.error("Logout falhou:", error);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};