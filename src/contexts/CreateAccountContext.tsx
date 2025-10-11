//src/providers/CreateAccountContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';

 interface Address{
    street: string;
    number: string;
    complement?:string;
    neighborhood:string;
    city: string;
    state: string;
    CEP: string;
}

interface Phone{
    type: 'comercial' | 'pessoal' | 'fixo';
    number: string;
}

interface AccountData {
    name: string;
    email: string;
    password:string;
    CPF: string;
    CNH: string;
    CHH_emission_date: string;
    address: Address;
    phone: Phone;

}

interface CreateAccountContextType {
  accountData: AccountData; 
  updateAccountData: (field: keyof AccountData, value: any) => void;
  updateAddress: (field: keyof Address, value: string) => void;
  updatePhone: (field: keyof Phone, value: string) => void;
  submitRegistration: () => void;

}

export const CreateAccountContext = createContext<CreateAccountContextType | undefined>(undefined);

interface CreateAccountProviderProps {
    children: ReactNode;
}

export const CreateAccountProvider: React.FC<CreateAccountProviderProps> = ({ children }) => {
    const [accountData, setAccountData] = useState<AccountData>({
        name: '',
        email: '',
        password: '',
        CPF: '',
        CNH: '',
        CHH_emission_date: '',
        address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            CEP: '',
        },
        phone: {
            type: 'pessoal',
            number: '',
        },
    });

    const updateAccountData = (field: keyof AccountData, value: any) => {
        setAccountData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateAddress = (field: keyof Address, value: string) => {
    setAccountData((prev) => ({
      ...prev,
      address: {
            ...prev.address,
            [field]: value,
        },
       }));
    };

    const updatePhone = (field: keyof Phone, value: string) => {
    setAccountData((prev) => ({
      ...prev,
      phone: {
        ...prev.phone,
        [field]: value,
        },
     }));
    };

    const submitRegistration = async () => {
    try {
      console.log('Enviando dados de registro:', accountData);

      // Aqui é pra fazer as requisições da API do backend

        } catch (error) {
            console.error('Erro ao registrar conta:', error);
        }
    };


    const value : CreateAccountContextType = {
        accountData,
        updateAccountData,
        updateAddress,
        updatePhone,
        submitRegistration,
    }
    return <CreateAccountContext.Provider value={value}>{children}</CreateAccountContext.Provider>;
};