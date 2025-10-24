import { axiosNoAuth } from '@/lib/axios';
import { Tokens } from '@/types/auth';
import { saveSecure } from '@/utils/secure-store';
import axios, { AxiosResponse } from 'axios';
import { jwtDecode } from "jwt-decode";
import React, { createContext, ReactNode, useContext, useState } from 'react';

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
  phone: string;
  birthDate: Date | null;
  cpf: string;
  cnh: string;
  cnhEmissionDate: Date | null;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string | null;
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
  changeUserProperty: (property: keyof User, value: string | Date | null) => void;
  updateAddressFields: (fields: Partial<Pick<User, 'street' | 'neighborhood' | 'city' | 'state'>>) => void;
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
    setUser({
      nome: data.nome,
      email: data.email,
      passwordHash: '',
      phone: '',
      birthDate: null,
      cpf: '',
      cnh: '',
      cnhEmissionDate: null,
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: null
    });
  }

  function changeUserProperty(property: keyof User, value: string | Date | null) {
    if (user) {
      const newUser = { ...user, [property]: value };
      setUser(newUser);
    } else {
      console.log('User is null, cannot update property');
    }
  }

  function updateAddressFields(fields: Partial<Pick<User, 'street' | 'neighborhood' | 'city' | 'state'>>) {
    if (user) {
      const newUser = { ...user, ...fields };
      setUser(newUser);
    } else {
      console.log('User is null, cannot update address fields');
    }
  }

  async function handleRegisterSocialLogin() {
    try {
      if (!user || !initialData) return false;

      const decodedToken = jwtDecode<CreateUserSocialTokenDecode>(initialData.createusersocialtoken);
      if (!decodedToken) return false;

      const data = {
        email: user.email,
        name: user.nome,
        provider: decodedToken.provider,
        provider_email: decodedToken.provider_email,
        id_provider: decodedToken.sub,
        passwordHash: user.passwordHash,
        phone_number: user.phone.replace(/\D/g, ''),
        type: "pessoal",
        status: true,
        birthDate: user.birthDate,
        cpf: user.cpf.replace(/\D/g, ''),
        cnhNumber: user.cnh.replace(/\D/g, ''),
        cnhIssueDate: user.cnhEmissionDate,
        cep: user.cep.replace(/\D/g, ''),
        street: user.street,
        addressNumber: user.number,
        complement: user.complement,
        neighborhood: user.neighborhood,
        city: user.city,
        state: user.state,
      }
      const response: AxiosResponse<Tokens> = await axiosNoAuth.post('/social-auth/register', data, {
        headers: {
          Authorization: `Bearer ${initialData.createusersocialtoken}`,
        }
      })

      const { accessToken, refreshToken } = response.data

      await saveSecure('accessToken', accessToken)
      await saveSecure('refreshToken', refreshToken)

      return true
    } catch (err) {
      if(axios.isAxiosError(err)) {
        console.log(err.status, err.response?.data)
      }
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
    updateAddressFields,
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