// src/providers/CreateAccountContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface CreateAccountContextType {

}

export const CreateAccountContext = createContext<CreateAccountContextType | undefined>(undefined);

interface CreateAccountProviderProps {
    children: ReactNode;
}

export const CreateAccountProvider: React.FC<CreateAccountProviderProps> = ({ children }) => {
    

    const value = {
        
    };

    return <CreateAccountContext.Provider value={value}>{children}</CreateAccountContext.Provider>;
};