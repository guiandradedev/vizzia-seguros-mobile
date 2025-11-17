import Header from '@/components/Header';
import api from '@/lib/axios';
import { Insurance, Vehicle } from '@/types/auth';
import axios, { AxiosResponse } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Conductor } from '@/contexts/CreateVehicleContext';
import { useAuth } from '@/hooks/useAuth';

export default function ShowVehiclePage() {
  const { id } = useLocalSearchParams() as { id?: string };
  const router = useRouter();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Insurance   | null>(null);
  const [loading, setLoading] = useState(true);
  const [conductors, setConductors] = useState<Conductor[]>([]);
  const [conductorsLoading, setConductorsLoading] = useState(false);

  useEffect(() => {
    // fetch conductors for this vehicle
    async function loadConductors(vehicle_id: number) {
      setConductorsLoading(true);
      try {
        const res = await api.get(`/conductor/vehicle/${vehicle_id}`);
        console.log('Conductors response:', res.data);
          // API returns conductor list in the API shape. Map to local Conductor shape.
          const apiList = Array.isArray(res.data) ? res.data : [];
          const adapted = apiList.map((a: any) => ({
            name: a.name ?? '',
            licenseNumber: a.cnhNumber ?? '',
            // convert to Date when possible, otherwise null
            licenseExpiry: a.cnhExpiryDate ? new Date(a.cnhExpiryDate) : null,
            licenseFirstEmission: a.cnhIssueDate ? new Date(a.cnhIssueDate) : null,
            licensePhoto: a.cnhPhoto ?? undefined,
            relationship: a.relationship ?? '',
            phone: a.phone ?? '',
            email: a.email ?? '',
            document: a.cpf ?? '',
            birthDate: a.birthDate ? new Date(a.birthDate) : null,
          }));

          // Always add logged user as primary conductor first
          const allConductors = adapted as Conductor[];

          if (user) {
            console.log("User", user)
            const userConductor: Conductor = {
              name: user.name,
              licenseNumber: (user as any).cnhNumber,
              licenseExpiry: user.expedition_cnh_date ? new Date(user.expedition_cnh_date * 1000) : null,
              licenseFirstEmission: null, // Not available in user data
              licensePhoto: undefined,
              relationship: 'Proprietário',
              phone: user.phone_id,
              email: user.email,
              document: user.cpf,
              birthDate: user.birthday_date,
            };

            // Remove user from list if already exists (to avoid duplicates)
            const filteredConductors = allConductors.filter(c => c.document !== userConductor.document);
            setConductors([userConductor, ...filteredConductors]);
          } else {
            setConductors(allConductors);
          }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log('Erro ao buscar condutores:', err.response?.data);
        } else {
          console.log('Erro desconhecido ao buscar condutores:', err);
        }
        setConductors([]);
      } finally {
        setConductorsLoading(false);
      }
    }
    async function load() {
      if (!id) return;
      try {
        const res: AxiosResponse<Insurance> = await api.get(`/insurance/${id}`);

        loadConductors(res.data.vehicle.id);
        setVehicle(res.data);
      } catch(err) {
        if (axios.isAxiosError(err)) {
          console.log('Erro ao buscar veículo:', err.response?.data);
        } else {
          console.log('Erro desconhecido:', err);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function getInitials(name?: string) {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  function getTransmissionLabel(transmission?: string): string {
    if (!transmission) return '—';
    return transmission === 'Automatic' ? 'Automático' : 'Manual';
  }

  function getParkTypeLabel(parkType?: string): string {
    if (!parkType) return '—';
    switch (parkType) {
      case 'Garage': return 'Garagem';
      case 'Street': return 'Rua';
      case 'Condominium': return 'Condomínio';
      default: return parkType;
    }
  }

  function getFuelLabel(fuel?: string): string {
    if (!fuel) return '—';
    return fuel;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 12 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <FontAwesome name="chevron-left" size={18} color="#1f6feb" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Header title="Veículo" subtitle="Detalhes do veículo" />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading && <ActivityIndicator />}

        {!loading && !vehicle && (
          <Text style={styles.emptyText}>Veículo não encontrado.</Text>
        )}

        {vehicle && (
          <>
            {/* Header Banner */}
            <View style={styles.headerBanner}>
              <View style={styles.vehicleIconContainer}>
                <FontAwesome name="car" size={32} color="#6D94C5" />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.bannerTitle}>{vehicle.vehicle.brand} {(vehicle as any).model_name ?? vehicle.vehicle.model}</Text>
                <Text style={styles.bannerSubtitle}>{vehicle.vehicle.plate} • {vehicle.vehicle.year}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Ativo</Text>
              </View>
            </View>

            {/* Vehicle Details Card */}
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Detalhes do Veículo</Text>

              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <MaterialIcons name="color-lens" size={20} color="#6D94C5" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Cor</Text>
                    <Text style={styles.detailValue}>{vehicle.vehicle.color || '—'}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <FontAwesome name="tachometer" size={20} color="#6D94C5" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Odômetro</Text>
                    <Text style={styles.detailValue}>{vehicle.vehicle.odometer ? `${parseInt(vehicle.vehicle.odometer).toLocaleString()} km` : '—'}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <MaterialIcons name="local-gas-station" size={20} color="#6D94C5" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Combustível</Text>
                    <Text style={styles.detailValue}>{getFuelLabel((vehicle.vehicle as any).fuel || vehicle.vehicle.motorization)}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <FontAwesome name="cogs" size={20} color="#6D94C5" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Transmissão</Text>
                    <Text style={styles.detailValue}>{getTransmissionLabel(vehicle.vehicle.transmission)}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <MaterialIcons name="garage" size={20} color="#6D94C5" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Estacionamento</Text>
                    <Text style={styles.detailValue}>{getParkTypeLabel(vehicle.vehicle.park_type)}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <FontAwesome name="briefcase" size={20} color="#6D94C5" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Uso</Text>
                    <Text style={styles.detailValue}>{vehicle.vehicle.use_type ?? '—'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Insurance Card */}
            <View style={styles.insuranceCard}>
              <View style={styles.insuranceHeader}>
                <View style={styles.insuranceIcon}>
                  <FontAwesome name="shield" size={24} color="#10B981" />
                </View>
                <View style={styles.insuranceInfo}>
                  <Text style={styles.insuranceTitle}>Seguro Ativo</Text>
                  <Text style={styles.insuranceSubtitle}>Apólice #{vehicle.id_insurance}</Text>
                </View>
              </View>

              <View style={styles.priceSection}>
                <Text style={styles.priceLabel}>Valor Anual</Text>
                <Text style={styles.priceValue}>
                  {vehicle.estimated_price ? formatCurrency(vehicle.estimated_price) : '—'}
                </Text>
                <Text style={styles.priceNote}>
                  Valor mensal: {vehicle.estimated_price ? formatCurrency(vehicle.estimated_price / 12) : '—'}
                </Text>
              </View>

              <View style={styles.coverageInfo}>
                <Text style={styles.coverageTitle}>Coberturas Incluídas</Text>
                <View style={styles.coverageList}>
                  <View style={styles.coverageItem}>
                    <FontAwesome name="check-circle" size={16} color="#10B981" />
                    <Text style={styles.coverageText}>Roubo e Furto</Text>
                  </View>
                  <View style={styles.coverageItem}>
                    <FontAwesome name="check-circle" size={16} color="#10B981" />
                    <Text style={styles.coverageText}>Colisão</Text>
                  </View>
                  <View style={styles.coverageItem}>
                    <FontAwesome name="check-circle" size={16} color="#10B981" />
                    <Text style={styles.coverageText}>Assistência 24h</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Conductors Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <FontAwesome name="users" size={20} color="#6D94C5" />
                </View>
                <Text style={styles.cardTitle}>Condutores Autorizados</Text>
              </View>

              {conductorsLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#6D94C5" />
                  <Text style={styles.loadingText}>Carregando condutores...</Text>
                </View>
              )}

              {!conductorsLoading && conductors.length === 0 && (
                <View style={styles.emptyState}>
                  <FontAwesome name="user-times" size={32} color="#ccc" />
                  <Text style={styles.emptyStateText}>Nenhum condutor cadastrado</Text>
                  <Text style={styles.emptyStateSubtext}>Adicione condutores para completar o cadastro</Text>
                </View>
              )}

              {!conductorsLoading && conductors.map((c, idx) => (
                <View key={idx} style={styles.conductorCard}>
                  <View style={styles.conductorDetails}>
                    <Text style={styles.conductorName}>{c.name}</Text>
                    <View style={styles.conductorMeta}>
                      <Text style={styles.conductorInfo}>CPF: {c.document || 'Não informado'}</Text>
                      <Text style={styles.conductorInfo}>CNH: {c.licenseNumber || 'Não informado'}</Text>
                    </View>
                    <Text style={styles.conductorRelation}>{c.relationship}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  sectionTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600'
  },
  text: {
    marginTop: 6,
    color: '#666'
  },
  conductorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777'
  },
  headerBanner: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  vehicleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
    marginTop: 2,
  },
  insuranceCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  insuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  insuranceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  insuranceInfo: {
    flex: 1,
  },
  insuranceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  insuranceSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  priceNote: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  coverageInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  coverageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  coverageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  coverageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  coverageText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  conductorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  conductorDetails: {
    flex: 1,
  },
  conductorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  conductorMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  conductorInfo: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 16,
    marginBottom: 2,
  },
  conductorRelation: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginBottom: 8,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#1f6feb',
    fontWeight: '600',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#f0f4ff',
  }
});
