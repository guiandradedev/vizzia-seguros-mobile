import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';

export default function AppLayout() {
  const topInset = Platform.OS === 'ios' ? 44 : 64;

  return (
    <View style={{ flex: 1, paddingTop: topInset, backgroundColor: Colors.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="notify" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}