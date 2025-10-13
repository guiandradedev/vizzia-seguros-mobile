import { Stack } from 'expo-router';
import { CreateVehicleProvider } from '@/contexts/CreateVehicleContext';

export default function MyCarsLayout() {
    return (
        <CreateVehicleProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="create" />
            </Stack>
        </CreateVehicleProvider>
    );
}