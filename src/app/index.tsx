import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, Text } from 'react-native';
import Colors from '@/constants/Colors';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.light.background 
      }}>
        <Text style={{ fontSize: 18, color: Colors.light.text }}>Carregando...</Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}