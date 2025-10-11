import { CreateVehicleProvider } from '@/contexts/CreateVehicleContext';
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <CreateVehicleProvider>
      <Slot />
    </CreateVehicleProvider>
  );
}