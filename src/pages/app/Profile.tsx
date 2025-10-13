import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useEffect } from 'react';
import Header from '@/components/Header';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = Colors.light;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        { paddingTop: insets.top }
      ]}
    >
      <Header title="Perfil" subtitle="Aqui você pode gerenciar suas informações pessoais." />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text, fontSize: 16 }}>
          Nenhuma informação de perfil disponível.
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});