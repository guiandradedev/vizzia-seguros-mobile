import Button from '@/components/Button';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Insurance, Vehicle } from '@/types/auth';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import VehicleComponent from './components/Vehicle';

export default function MyCarsListPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleRedirect = () => {
    router.push('/(app)/(tabs)/my-cars/create'); // Navegação para create
  };

  const [vehicles, setVehicles] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getVehicles() {
      try {
        setLoading(true);
        const response: AxiosResponse<Insurance[]> = await api.get('/insurance');
        console.log('Veículos carregados:', response.data);
        setVehicles(response.data);
      } catch(err) {
        if(axios.isAxiosError(err)) {
          const status = err.response?.status;
          if(status === 404) {
            setVehicles([]);
            return;
          }
          console.log('Erro na requisição:', err.response?.data);
        } else {
          console.log('Erro ao buscar veículos:', err);
        }
      } finally {
        setLoading(false);
      }
    }

    getVehicles();
  }, []);

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <FontAwesome name="car" size={64} color="#cbd5e1" />
      </View>
      <Text style={styles.emptyTitle}>Nenhum veículo encontrado</Text>
      <Text style={styles.emptySubtitle}>
        Você ainda não possui veículos assegurados.{'\n'}
        Comece solicitando um seguro para seu veículo.
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleRedirect} activeOpacity={0.8}>
        <MaterialIcons name="add" size={20} color="#fff" />
        <Text style={styles.emptyButtonText}>Solicitar Seguro</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Meus Veículos" subtitle="Aqui você pode gerenciar seus veículos assegurados." />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6D94C5" />
            <Text style={styles.loadingText}>Carregando veículos...</Text>
          </View>
        ) : vehicles.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.vehiclesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Veículos Assegurados</Text>
              <Text style={styles.sectionCount}>{vehicles.length} veículo{vehicles.length !== 1 ? 's' : ''}</Text>
            </View>

            {vehicles.map((insurance) => (
              <VehicleComponent key={insurance.id_insurance} vehicle={insurance} />
            ))}
          </View>
        )}
      </ScrollView>

      {vehicles.length > 0 && (
        <View style={styles.footer}>
          <Button title="Solicitar Novo Seguro" onPress={handleRedirect} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espaço para o footer
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6D94C5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#6D94C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  vehiclesContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  sectionCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  // Estilos antigos mantidos para compatibilidade
  container_outside: {
    flex: 1,
    justifyContent: 'space-between',
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
    width: '60%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: '500',
    fontFamily: "Roboto-Medium",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  headerSubTitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: "Roboto-Regular",
    marginHorizontal: 20,
    marginBottom: 10,
  },
});