import Colors from '@/constants/Colors';
import api from '@/lib/axios';
import { Insurance } from '@/types/auth';
import { useRouter } from 'expo-router';
import { Car, ChevronLeft, Map, Shield } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AssistancePage() {
  const router = useRouter();
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    try {
      setLoading(true);
      const response = await api.get('/insurance');
      const allInsurances = Array.isArray(response.data) ? response.data : [];
      // Filtrar apenas seguros aprovados
      const approvedInsurances = allInsurances.filter((insurance: Insurance) => 
        insurance.status?.toLowerCase() === 'approved'
      );
      setInsurances(approvedInsurances);
    } catch (error) {
      console.error('Erro ao buscar seguros:', error);
      setInsurances([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status?: string): string => {
    if (!status) return 'Desconhecido';
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'denied':
        return 'Negado';
      case 'cancel':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status?: string): string => {
    if (!status) return '#64748b';
    switch (status.toLowerCase()) {
      case 'pending':
        return '#F59E0B'; // Amarelo para pendente
      case 'approved':
        return '#10B981'; // Verde para aprovado
      case 'denied':
        return '#EF4444'; // Vermelho para negado
      case 'cancel':
        return '#6B7280'; // Cinza para cancelado
      default:
        return '#64748b';
    }
  };

  const handleInsuranceSelect = (insurance: Insurance) => {
    // Navegar para a tela de assistência do veículo específico
    router.push({
      pathname: '/(app)/vehicle-assistance',
      params: { insurance: JSON.stringify(insurance) }
    });
  };

  const handleContractInsurance = () => {
    // Navegar para a página de meus carros para contratar um seguro
    router.push('/(app)/(tabs)/my-cars');
  };

  // Se há apenas um veículo, navegar diretamente para a assistência
  useEffect(() => {
    if (!loading && insurances.length === 1) {
      router.push({
        pathname: '/(app)/vehicle-assistance',
        params: { insurance: JSON.stringify(insurances[0]) }
      });
    }
  }, [loading, insurances, router]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Buscando seus veículos assegurados...</Text>
        </View>
      </View>
    );
  }

  if (insurances.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconContainer}>
            <Shield size={48} color={Colors.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum seguro aprovado</Text>
          <Text style={styles.emptySubtitle}>
            Para solicitar assistência, você precisa ter pelo menos um veículo com seguro aprovado em nossa plataforma.
          </Text>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleContractInsurance}>
            <Shield size={20} color="white" />
            <Text style={styles.primaryButtonText}>Contratar Seguro</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Seleção de veículo quando há múltiplos
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Assistência Veicular
          </Text>
          <Text style={styles.headerSubtitle}>
            Imprevistos acontecem, estamos aqui para ajudar
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.selectionCard}>
          <View style={styles.selectionIcon}>
            <Map size={32} color={Colors.primary} />
          </View>
          <Text style={styles.selectionTitle}>Selecione o veículo</Text>
          <Text style={styles.selectionText}>
            Escolha qual veículo necessita de assistência. Nossa equipe especializada está pronta para atender você com rapidez e eficiência.
          </Text>
        </View>

        <View style={styles.vehiclesList}>
          {insurances.map((insurance) => {
            const vehicle = insurance.vehicle;
            return (
              <TouchableOpacity
                key={insurance.id_insurance}
                style={styles.vehicleCard}
                onPress={() => handleInsuranceSelect(insurance)}
                activeOpacity={0.8}
              >
                <View style={styles.vehicleIcon}>
                  <Car size={28} color={Colors.primary} />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>
                    {vehicle.model_name || vehicle.model}
                  </Text>
                  <Text style={styles.vehicleDetails}>
                    Placa: {vehicle.plate} • Ano: {vehicle.year}
                  </Text>
                  <View style={[styles.vehicleStatus, { backgroundColor: getStatusColor(insurance.status) + '20' }]}>
                    <Shield size={14} color={getStatusColor(insurance.status)} />
                    <Text style={[styles.vehicleStatusText, { color: getStatusColor(insurance.status) }]}>
                      {getStatusLabel(insurance.status)}
                    </Text>
                  </View>
                </View>
                <ChevronLeft
                  size={20}
                  color={Colors.primary}
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.backgroundSecondary,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeIcon: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  assistanceOptions: {
    marginBottom: 24,
  },
  assistanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assistanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  assistanceContent: {
    flex: 1,
  },
  assistanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  assistanceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  selectionCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectionIcon: {
    marginBottom: 16,
  },
  selectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  selectionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  vehiclesList: {
    paddingBottom: 20,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  vehicleCardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.05,
    elevation: 2,
  },
  vehicleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15', // Cor primária com 15% de opacidade
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  vehicleDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  vehicleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  vehicleStatusText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
    marginLeft: 4,
  },
});