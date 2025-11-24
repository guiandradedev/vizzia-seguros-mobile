import VehicleAssistance from '@/components/VehicleAssistance';
import type { Insurance } from '@/types/auth';
import { useLocalSearchParams } from 'expo-router';

export default function VehicleAssistanceScreen() {
  const { insurance } = useLocalSearchParams<{ insurance: string }>();

  // Parse the insurance object from params
  const parsedInsurance: Insurance = insurance ? JSON.parse(insurance) : null;

  if (!parsedInsurance) {
    return null; // Or show an error screen
  }

  return <VehicleAssistance insurance={parsedInsurance} />;
}