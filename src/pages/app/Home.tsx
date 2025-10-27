// app/(tabs)/index.tsx (Rota: /)

import { useAuth } from '@/hooks/useAuth';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function HomePage() {
  const router = useRouter();

  const { signOut, user } = useAuth()
  const [vehiclesCount, setVehiclesCount] = useState<number | null>(null);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  async function handleLogout() {
    signOut()
    Alert.alert("Vizzia Seguros", "Deslogado.")
    router.replace('/(auth)/login');
  }

  const handleRedirect = () => {
    router.push('/(app)/(tabs)/my-cars/create'); // Redireciona para login
  };

  const insets = useSafeAreaInsets();

  console.log(user);

  useEffect(() => {
    let mounted = true;
    async function loadVehicles() {
      setLoadingVehicles(true);
      try {
        const res = await api.get('/vehicle');
        const data = res.data;
        const count = Array.isArray(data) ? data.length : (data?.length ?? 0);
        if (mounted) setVehiclesCount(count);
      } catch (err) {
        console.log('Erro ao buscar veículos:', err);
        if (mounted) setVehiclesCount(0);
      } finally {
        if (mounted) setLoadingVehicles(false);
      }
    }

    loadVehicles();
    return () => { mounted = false; };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: 20 },
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

      <View style={styles.card}>
        {loadingVehicles ? (
          <ActivityIndicator />
        ) : vehiclesCount === null ? (
          <Text style={styles.infoText}>Buscando seus veículos...</Text>
        ) : vehiclesCount === 0 ? (
          <>
            <Text style={styles.infoText}>Você ainda não tem veículos cadastrados.</Text>
            <TouchableOpacity style={styles.button} onPress={handleRedirect} activeOpacity={0.75}>
              <Text style={styles.buttonText}>Cadastre seu veículo</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.countText}>Você tem <Text style={{ fontWeight: '700' }}>{vehiclesCount}</Text> veículo(s) cadastrado(s)</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/(app)/(tabs)/my-cars')} activeOpacity={0.75}>
              <Text style={styles.buttonText}>Ver meus veículos</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
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
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    color: '#555',
    marginBottom: 12,
    fontSize: 15
  },
  countText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 12
  }
});