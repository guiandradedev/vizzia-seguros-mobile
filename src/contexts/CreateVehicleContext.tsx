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
    removeConductor: (index: number) => void,
    updateConductor: (index: number, conductor: Conductor) => void,
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

// Cada marca agora tem um código associado (ex: Volkswagen -> 59)
export const carBrands = [
    { code: 1, name: 'Acura' },
    { code: 6, name: 'Audi' },
    { code: 7, name: 'BMW' },
    { code: 23, name: 'Chevrolet' },
    { code: 13, name: 'Citroen' },
    { code: 21, name: 'Fiat' },
    { code: 22, name: 'Ford' },
    { code: 25, name: 'Honda' },
    { code: 26, name: 'Hyundai' },
    { code: 31, name: 'KIA' },
    { code: 33, name: 'Land Rover' },
    { code: 34, name: 'Lexus' },
    { code: 38, name: 'Mazda' },
    { code: 39, name: 'Mercedes' },
    { code: 41, name: 'Mitsubishi' },
    { code: 43, name: 'Nissan' },
    { code: 44, name: 'Peugeot' },
    { code: 47, name: 'Porsche' },
    { code: 48, name: 'Renault' },
    { code: 55, name: 'Suzuki' },
    { code: 56, name: 'Toyota' },
    { code: 59, name: 'Volkswagen' },
    { code: 58, name: 'Volvo' }
] as const;

export type CarBrand = typeof carBrands[number];
export type CarBrandName = CarBrand['name'];
export type CarBrandCode = CarBrand['code'];
export const vehicleUses = ['Particular', 'Comercial'] as const;
export type VehicleUses = typeof vehicleUses[number];

interface Vehicle {
    id?: number;
    model: string,
    // nome do modelo retornado pela API (para exibição). Se presente, preferir este campo.
    model_name?: string,
    // Agora armazenamos o código da marca no veículo (ex: Volkswagen -> 59)
    brand: CarBrandCode,
    // código do modelo retornado pela API (ex: '6090'). Mantemos tanto código quanto nome para compatibilidade.
    model_code?: string,
    // brand_name: CarBrandName,
    year: number,
    color: string,
    odomether: number,
    plate: string,
    fuel: FuelTypes,
    usage: VehicleUses
}

export interface Conductor {
    name: string;
    licenseNumber: string;
    licenseExpiry: Date | null;
    licenseFirstEmission: Date | null; // ano/mes da primeira emissao
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
    const [vehicle, setVehicle] = useState<Vehicle>({} as Vehicle)
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
    function removeConductor(index: number): void {
        setConductors(prev => prev.filter((_, i) => i !== index));
    }
    function updateConductor(index: number, conductor: Conductor): void {
        setConductors(prev => {
            const copy = [...prev];
            if (index >= 0 && index < copy.length) copy[index] = conductor;
            return copy;
        });
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
        removeConductor,
        updateConductor,
        maxConductors
    };

    return <CreateVehicleContext.Provider value={value}>{children}</CreateVehicleContext.Provider>;
};