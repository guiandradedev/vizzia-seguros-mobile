//src/providers/CreateAccountContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { isValidCPF, formatCPF, formatPhone } from '@/utils/formatters';
interface Address {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    CEP: string;
}

interface Phone {
    type: 'comercial' | 'pessoal' | 'fixo';
    number: string;
}

interface AccountData {
    name: string;
    email: string;
    password: string;
    birthDate: Date;
    CPF: string;
    CNH: string;
    CHH_emission_date: Date;
    address: Address;
    phone: Phone;

}

interface CreateAccountContextType {
    accountData: AccountData;
    updateAccountData: (field: keyof AccountData, value: any) => void;
    updateAddress: (field: keyof Address, value: string) => void;
    submitRegistration: () => Promise<Tokens>;
    errors: { [key: string]: boolean };
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

import axios, { AxiosResponse } from 'axios'
import { Tokens } from '@/types/auth';
import { axiosNoAuth } from '@/lib/axios';

export const CreateAccountContext = createContext<CreateAccountContextType | undefined>(undefined);

interface CreateAccountProviderProps {
    children: ReactNode;
}

interface ResponseAPI {
    savedUser: any,
    tokens: Tokens
}

export const CreateAccountProvider: React.FC<CreateAccountProviderProps> = ({ children }) => {
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [accountData, setAccountData] = useState<AccountData>({
        name: '',
        email: '',
        password: '',
        CPF: '',
        CNH: '',
        birthDate: new Date(),
        CHH_emission_date: new Date(),
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

    const submitRegistration = async () => {
        try {
            // console.log('Enviando dados de registro:', accountData);

            const data = {
                name: accountData.name,
                email: accountData.email.replace(" ", "").toLowerCase(),
                passwordHash: accountData.password,
                cpf: accountData.CPF.replace(/\D/g, ''),
                cnhNumber: accountData.CNH.replace(/\D/g, ''),
                birthDate: accountData.birthDate,
                cnhIssueDate: accountData.CHH_emission_date,
                street: accountData.address.street,
                neighborhood: accountData.address.neighborhood,
                // complement: accountData.address.complement,
                addressNumber: accountData.address.number,
                city: accountData.address.city,
                state: accountData.address.state,
                cep: accountData.address.CEP,
                phone_number: accountData.phone.number.replace(/\D/g, ''),
                type: accountData.phone.type,
                status: true
            }

            console.log(JSON.stringify(data, null, 2));

            const response: AxiosResponse<ResponseAPI> = await axiosNoAuth.post(`/users/create`, data);

            return response.data.tokens
            // Aqui é pra fazer as requisições da API do backend

        } catch (error) {
            console.error('Erro ao registrar conta:', error);
            throw new Error('Erro ao registrar conta');
        }
    };


    const value: CreateAccountContextType = {
        accountData,
        updateAccountData,
        updateAddress,
        submitRegistration,
        errors,
        setErrors
    }
    return <CreateAccountContext.Provider value={value}>{children}</CreateAccountContext.Provider>;
};