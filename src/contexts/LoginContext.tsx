import React, { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";
import { AxiosResponse } from 'axios';
import { Tokens } from '@/types/auth';
import { axiosNoAuth } from '@/lib/axios';
import { saveSecure } from '@/utils/secure-store';

export interface ResponseSocialAuthUserNotExistsAPI {
  email: string,
  nome: string,
  createusersocialtoken: string,
  provider: string
}

interface User {
  nome: string;
  email: string;
  passwordHash: string;
}

interface InitialData {
  createusersocialtoken: string;
  provider: string;
}

interface LoginContextType {
  initialData: InitialData | null;
  user: User | null;
  changeUser: (user: User) => void;
  changeInitialData: (data: ResponseSocialAuthUserNotExistsAPI) => void;
  changeUserProperty: (property: keyof User, value: string) => void;
  handleRegisterSocialLogin: () => Promise<boolean>;
}

export interface CreateUserSocialTokenDecode {
  sub: number,
  type: string,
  provider: string,
  provider_email: string,
  name: string,
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [initialData, setInitialData] = useState<InitialData | null>(null);
  const [user, setUser] = useState<User | null>(null);

  function changeInitialData(data: ResponseSocialAuthUserNotExistsAPI) {
    setInitialData({ createusersocialtoken: data.createusersocialtoken, provider: data.provider });
    setUser({ nome: data.nome, email: data.email, passwordHash: '' });
  }

  function changeUserProperty(property: keyof User, value: string) {
    if (user) {
      setUser({ ...user, [property]: value });
    }
  }

  async function handleRegisterSocialLogin() {
    try {
      if (!user || !initialData) return false;

      const decodedToken = jwtDecode<CreateUserSocialTokenDecode>(initialData.createusersocialtoken);
      if (!decodedToken) return false;

      const response: AxiosResponse<Tokens> = await axiosNoAuth.post('/social-auth/register', {
        email: user.email,
        name: user.nome,
        provider: decodedToken.provider,
        provider_email: decodedToken.provider_email,
        id_provider: decodedToken.sub,
        passwordHash: user.passwordHash
      }, {
        headers: {
          Authorization: `Bearer ${initialData.createusersocialtoken}`,
        }
      })

      const { accessToken, refreshToken } = response.data

      await saveSecure('accessToken', accessToken)
      await saveSecure('refreshToken', refreshToken)

      return true
    } catch (err) {
      return false;
    }
  }


  function changeUser(user: User) {
    setUser(user);
  }
  const value = {
    initialData,
    user,
    changeUser,
    changeUserProperty,
    changeInitialData,
    handleRegisterSocialLogin
  }

  return (
    <LoginContext.Provider value={value}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) throw new Error('useLogin must be used within LoginProvider');
  return context;
};