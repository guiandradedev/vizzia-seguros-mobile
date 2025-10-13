import { CreateVehicleProvider } from '@/contexts/CreateVehicleContext';
import { Slot } from 'expo-router';

export default function CreateVehicleLayout() {
  return (
    <CreateVehicleProvider>
      <Slot />
    </CreateVehicleProvider>
  );
}