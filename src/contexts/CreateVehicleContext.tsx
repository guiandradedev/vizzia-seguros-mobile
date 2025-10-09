// src/providers/CreateVehicleContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface CreateVehicleContextType {
    vehicle: Vehicle,
    vehiclePhotos: PhotoType[],
    initialCarPhoto: string,
    setVehicle: (data: Vehicle) => void,
    changeInitialCarPhoto: (uri: string) => void,
    changeVehiclePhoto: (photoIndex: number, uri: string) => void,
    conductors: Conductor[],
    addConductor: (conductor: Conductor) => void,
}

export const CreateVehicleContext = createContext<CreateVehicleContextType | undefined>(undefined);

interface CreateVehicleProviderProps {
    children: ReactNode;
}

interface PhotoType {
    uri: string,
    title: string
}

interface Vehicle {
    model: string,
    brand: string,
    year: number,
    color: string,
    odomether: number,
    plate: string
}

interface Conductor {
    id: string;
    name: string;
    licenseNumber: string;
    licenseExpiry: string;
    licenseEmitter: string;
    relationship: string;
    phone: string;
    email: string;
    document: string, // cpf
    birthDate: Date,

}


export const CreateVehicleProvider: React.FC<CreateVehicleProviderProps> = ({ children }) => {
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
        plate: ""
    })
    const [conductors, setConductors] = useState<Conductor[]>([])

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
        addConductor
    };

    return <CreateVehicleContext.Provider value={value}>{children}</CreateVehicleContext.Provider>;
};