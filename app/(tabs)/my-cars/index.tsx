// app/(tabs)/index.tsx (Rota: /)

import { View, Text } from 'react-native';

export default function MyCarsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Bem-vindo meus carros!</Text>
    </View>
  );
}