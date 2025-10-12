import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Grupo de tabs (home, assistance, help, my-cars) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Páginas individuais fora das tabs */}
      <Stack.Screen name="notify" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}