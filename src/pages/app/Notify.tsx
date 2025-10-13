import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useEffect } from 'react';
import Header from '@/components/Header';

export default function NotifyScreen() {
  const theme = Colors.light;

  return (
    <View
      style={[
        { backgroundColor: theme.background },
      ]}
    >
      <Header title="Notificações" subtitle="Aqui você verá todas as notificações importantes." />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text, fontSize: 16 }}>
          Nenhuma notificação no momento.
        </Text>
      </View>



    </View>
  );
}