import { useContext } from 'react';
import { CreateVehicleContext } from '../contexts/CreateVehicleContext';

export const useCreateVehicle = () => {
  const context = useContext(CreateVehicleContext);

  if (context === undefined) {
    throw new Error('useCreateVehicle deve ser usado dentro de um CreateVehicleProvider');
  }

  return context;
};