// app/(tabs)/index.tsx (Rota: /)

import { useAuth } from '@/hooks/useAuth';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  const { signOut, user } = useAuth()
  async function handleLogout() {
    signOut()
    alert("Deslogado.")
    router.replace('/(auth)');
  }

  const handleRedirect = () => {
    router.push('/(app)/(tabs)/my-cars/create'); // Redireciona para login
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom, paddingHorizontal: 20 },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text>Bem-vindo, {user?.name}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/(app)/notify')}>
            <FontAwesome name="bell" size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/(app)/profile')}>
            <FontAwesome name="user-circle" size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <FontAwesome name="angle-double-right" size={30} />
          </TouchableOpacity>
        </View>
      </View>

      <Text>Aparentemente você não tem nenhum seguro ativo</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleRedirect}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Cadastre seu veículo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerButton: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 0,
    // backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6D94C5',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});