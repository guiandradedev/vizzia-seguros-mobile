// app/(tabs)/index.tsx (Rota: /)

import { useAuth } from '@/hooks/useAuth';
import { Car, Bell, User, LogOut, Plus, Eye } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Colors from '@/constants/Colors';
import { commonStyles } from '@/styles/CommonStyles';

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
    router.push('/(app)/(tabs)/my-cars/create'); // Redireciona para criar veículo
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
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top, paddingHorizontal: 20 }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>Olá, {user?.name}!</Text>
          <Text style={styles.subtitleText}>Bem-vindo ao Vizzia Seguros</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/(app)/notify')}>
            <Bell size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/(app)/profile')}>
            <User size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <LogOut size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
      >
        <View style={styles.content}>
          <View style={styles.heroCard}>
            <Car size={48} color={Colors.primary} style={styles.heroIcon} />
            <Text style={styles.heroTitle}>Gerencie seus Veículos</Text>
            <Text style={styles.heroSubtitle}>Mantenha seus seguros sempre em dia</Text>
          </View>

          <View style={styles.card}>
            {loadingVehicles ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Carregando seus veículos...</Text>
              </View>
            ) : vehiclesCount === null ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.infoText}>Buscando seus veículos...</Text>
              </View>
            ) : vehiclesCount === 0 ? (
              <View style={styles.emptyContainer}>
                <Car size={32} color={Colors.textSecondary} style={styles.emptyIcon} />
                <Text style={styles.emptyTitle}>Nenhum veículo cadastrado</Text>
                <Text style={styles.emptySubtitle}>Adicione seu primeiro veículo para começar</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={handleRedirect} activeOpacity={0.8}>
                  <Plus size={20} color="white" />
                  <Text style={styles.primaryButtonText}>Cadastrar Veículo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.vehiclesContainer}>
                <Car size={32} color={Colors.primary} style={styles.vehiclesIcon} />
                <Text style={styles.vehiclesTitle}>
                  Você tem <Text style={styles.vehiclesCount}>{vehiclesCount}</Text> veículo{vehiclesCount !== 1 ? 's' : ''} cadastrado{vehiclesCount !== 1 ? 's' : ''}
                </Text>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(app)/(tabs)/my-cars')} activeOpacity={0.8}>
                  <Eye size={20} color={Colors.primary} />
                  <Text style={styles.secondaryButtonText}>Ver Meus Veículos</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  heroCard: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 24,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroIcon: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  vehiclesContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  vehiclesIcon: {
    marginBottom: 16,
  },
  vehiclesTitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  vehiclesCount: {
    fontWeight: '700',
    color: Colors.primary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  countText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
});