import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  function changeUser(user: User) {
    setUser(user);
  }
  const value = {
    initialData,
    user,
    changeUser,
    changeUserProperty,
    changeInitialData
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