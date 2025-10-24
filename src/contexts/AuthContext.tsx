// src/providers/AuthContext.tsx

import React, { createContext, ReactNode, useEffect, useState } from 'react';
// Simulação de uma função de API
import { axiosNoAuth } from '@/lib/axios';
import { getSecure, saveSecure } from '@/utils/secure-store';
import axios, { AxiosResponse } from 'axios';
import { getStoredUser, loginApi, logoutApi } from '../services/authService';
import { Credentials, Tokens, User } from '../types/auth'; // Tipos definidos em outro local (ex: src/types/auth.ts)
import { ResponseSocialAuthUserNotExistsAPI } from './LoginContext';

// 1. Definição da Interface do Contexto
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: Credentials) => Promise<boolean | null>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean,
  setAuthenticated: () => void,
  loginBiometric: () => Promise<boolean>
  handleLoginWithProvider?: (data: LoginWithProviderProps) => Promise<boolean | ResponseSocialAuthUserNotExistsAPI>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface LoginWithProviderProps {
  provider: 'Google',
  token: string
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Efeito para carregar o usuário armazenado (token, etc.) ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const tokenExists = await getSecure('accessToken')
        console.log("token valido", tokenExists)
        if (isAuthenticated) {
          if (tokenExists) {
            const storedUser = await getStoredUser(); // Simula a verificação de token/usuário no AsyncStorage
            setUser(storedUser)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setIsLoading(false);
      }
      // logoutApi()
    };
    loadUser();
  }, [isAuthenticated]);

  async function handleLoginWithProvider({ provider, token }: LoginWithProviderProps) {
    try {
      const body = { provider, token }
      const response: AxiosResponse<Tokens> = await axiosNoAuth.post('/social-auth/login', body);
      const { accessToken, refreshToken } = response.data

      // console.log("Tokens recebidos:", response.data)
      // console.log("Access Token:", accessToken)
      // console.log("Refresh Token:", refreshToken)

      await saveSecure('accessToken', accessToken)
      await saveSecure('refreshToken', refreshToken)

      setAuthenticated()

      return true
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        console.log("Status:", status)
        console.log("Dados da resposta:", err.response?.data)

        if (status === 400 && err.response?.data) {
          const errorData = err.response.data as ResponseSocialAuthUserNotExistsAPI;
          return {
            email: errorData.email,
            nome: errorData.nome,
            createusersocialtoken: errorData.createusersocialtoken,
            provider: errorData.provider
          };
        }
        console.error("Erro na autenticação social:", err.response);
      }
      return false
    }
  }

  // Função de Login
  const signIn = async (credentials: Credentials): Promise<boolean | null> => {
    try {
      setIsLoading(true);
      const { accessToken, refreshToken } = await loginApi(credentials); // Chamada de API real
      saveSecure('accessToken', accessToken)
      saveSecure('refreshToken', refreshToken)
      setIsLoading(false);
      setIsAuthenticated(true)
      return true;
    } catch (error) {
      // console.error("Login falhou:", error);
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return false
        }
      }
      return null
    }
  };

  function setAuthenticated() {
    setIsAuthenticated(true)
  }

  async function loginBiometric(): Promise<boolean> {
    const tokenExists = await getSecure('accessToken')
    console.log("Login com biometria token", tokenExists)
    const storedUser = await getStoredUser(); // Simula a verificação de token/usuário no AsyncStorage
    setUser(storedUser)
    return !!storedUser
  }

  // Função de Logout
  const signOut = async () => {
    try {
      await logoutApi(); // Limpa tokens na API
      // Limpa dados locais (AsyncStorage)
      setIsAuthenticated(false)
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
    isAuthenticated,
    setAuthenticated,
    loginBiometric,
    handleLoginWithProvider
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};