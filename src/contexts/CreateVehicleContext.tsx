// src/providers/CreateVehicleContext.tsx

import React, { createContext, ReactNode, useState } from 'react';

interface CreateVehicleContextType {
    vehicle: Vehicle,
    vehiclePhotos: PhotoType[],
    initialCarPhoto: string,
    setVehicle: (data: Vehicle) => void,
    changeInitialCarPhoto: (uri: string) => void,
    changeVehiclePhoto: (photoIndex: number, uri: string) => void,
    conductors: Conductor[],
    addConductor: (conductor: Conductor) => void,
    maxConductors: number
}

export const CreateVehicleContext = createContext<CreateVehicleContextType | undefined>(undefined);

interface CreateVehicleProviderProps {
    children: ReactNode;
}

interface PhotoType {
    uri: string,
    title: string
}
export const fuelTypes = ["Gasolina", "Álcool", "Diesel", "Elétrico","Flex", "Híbrido"] as const;
export type FuelTypes = typeof fuelTypes[number];

export const carBrands = ['Acura','Audi','BMW','Chevrolet','Citroen','Fiat','Ford','Honda','Hyundai','KIA','Land Rover','Lexus','Mazda','Mercedes','Mitsubishi','Nissan','Peugeot','Porsche','Renault','Suzuki','Toyota','Volkswagen','Volvo'] as const
export type CarBrands = typeof carBrands[number];

interface Vehicle {
    model: string,
    brand: string,
    year: number,
    color: string,
    odomether: number,
    plate: string,
    fuel: string
}

export interface Conductor {
    name: string;
    licenseNumber: string;
    licenseExpiry: string;
    licenseFirstEmission: number; // ano de primeira emissao
    licensePhoto?: string // foto da cnh
    relationship: string;
    phone: string;
    email: string;
    document: string, // cpf
    birthDate: Date,
}

export const CreateVehicleProvider: React.FC<CreateVehicleProviderProps> = ({ children }) => {
    // Constantes
    const maxConductors = 3;

    // Estados
    const [vehiclePhotos, setVehiclePhotos] = useState<PhotoType[]>([
        { title: "Frente", uri: "" },
        { title: "Trás", uri: "" },
        { title: "Lado Esquerdo", uri: "" },
        { title: "Lado Direito", uri: "" },
        { title: "Capô", uri: "" },
    ]);
    const [initialCarPhoto, setInitialCarPhoto] = useState('') // Foto inicial do carro que busca a placa do carro
    const [vehicle, setVehicle] = useState<Vehicle>({
        model: "",
        brand: "",
        year: 0,
        color: "",
        odomether: 0,
        plate: "",
        fuel: ""
    })
    const [conductors, setConductors] = useState<Conductor[]>([])

    // Funções Modificadoras de Estado
    function changeVehiclePhoto(photoIndex: number, uri: string): void {
        if (photoIndex > vehiclePhotos.length) {
            throw new Error("Invalid photo index")
        }
        setVehiclePhotos(prevPhotos => {
            const updatedPhotos = [...prevPhotos];
            updatedPhotos[photoIndex] = { ...updatedPhotos[photoIndex], uri };
            return updatedPhotos;
        });
    }
    function addConductor(conductor: Conductor): void {
        setConductors(prevConductors => [...prevConductors, conductor]);
    }
    function changeInitialCarPhoto(uri: string): void {
        setInitialCarPhoto(uri);
    }

    const value = {
        vehicle,
        vehiclePhotos,
        initialCarPhoto,
        setVehicle,
        changeInitialCarPhoto,
        changeVehiclePhoto,
        conductors,
        addConductor,
        maxConductors
    };

    return <CreateVehicleContext.Provider value={value}>{children}</CreateVehicleContext.Provider>;
};