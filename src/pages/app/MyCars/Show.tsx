import Header from '@/components/Header';
import api from '@/lib/axios';
import { Vehicle } from '@/types/auth';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Conductor } from '@/contexts/CreateVehicleContext';

export default function ShowVehiclePage() {
  const { id } = useLocalSearchParams() as { id?: string };
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [conductors, setConductors] = useState<Conductor[]>([]);
  const [conductorsLoading, setConductorsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const res = await api.get(`/vehicle/${id}`);
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

    // fetch conductors for this vehicle
    async function loadConductors() {
      if (!id) return;
      setConductorsLoading(true);
      try {
        const res = await api.get(`/conductor/vehicle/${id}`);
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
            birthDate: a.birthDate ? new Date(a.birthDate) : new Date(),
          }));

          setConductors(adapted as Conductor[]);
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

    loadConductors();
  }, [id]);

  function getInitials(name?: string) {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
            <View style={styles.headerBanner}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Image source={{ uri: (vehicle as any).photo || undefined }} style={styles.bannerImage} /> */}
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.bannerTitle}>{vehicle.brand} {(vehicle as any).model_name ?? vehicle.model}</Text>
                  <Text style={styles.bannerSubtitle}>{vehicle.plate} • {vehicle.year}</Text>
                </View>
                {!vehicle.finished && <View style={styles.badge}><Text style={styles.badgeText}>Incompleto</Text></View>}
              </View>
            </View>

            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailCell}>
                  <Text style={styles.detailLabel}>Cor</Text>
                  <Text style={styles.detailValue}>{vehicle.color || '—'}</Text>
                </View>
                <View style={styles.detailCell}>
                  <Text style={styles.detailLabel}>Odômetro</Text>
                  <Text style={styles.detailValue}>{vehicle.odometer ? `${vehicle.odometer} km` : '—'}</Text>
                </View>
              </View>
              <View style={styles.detailRow}> 
                <View style={styles.detailCell}>
                  <Text style={styles.detailLabel}>Uso</Text>
                  <Text style={styles.detailValue}>{(vehicle as any).usage ?? '—'}</Text>
                </View>
                <View style={styles.detailCell} />
              </View>
            </View>

            <View style={styles.card}> 
              <Text style={[styles.sectionTitle, {marginTop: 4}]}>Condutores</Text>
              {conductorsLoading && <ActivityIndicator />}
              {!conductorsLoading && conductors.length === 0 && (
                <Text style={styles.text}>Nenhum condutor cadastrado para este veículo.</Text>
              )}
              {!conductorsLoading && conductors.map((c, idx) => (
                <View key={idx} style={styles.conductorRow}>
                  <View style={styles.avatar}><Text style={{ color: '#fff', fontWeight: '700' }}>{getInitials(c.name)}</Text></View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.conductorName}>{c.name}</Text>
                    <Text style={styles.conductorInfo}>CPF: {c.document}</Text>
                    <Text style={styles.conductorInfo}>Telefone: {c.phone}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.conductorInfo}>CNH: {c.licenseNumber}</Text>
                    <Text style={styles.conductorInfo}>Venc.: {c.licenseExpiry ? new Date(c.licenseExpiry).toLocaleDateString() : '—'}</Text>
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
  }
  ,
  conductorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  conductorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222'
  },
  conductorInfo: {
    fontSize: 13,
    color: '#666'
  }
  ,
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777'
  },
  headerBanner: {
    backgroundColor: '#f7ffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center'
  },
  bannerImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#e6eef9'
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121212'
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4
  },
  badge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailCell: {
    flex: 1
  },
  detailLabel: {
    fontSize: 12,
    color: '#888'
  },
  detailValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
    marginTop: 4
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2b6cb0',
    alignItems: 'center',
    justifyContent: 'center'
  }
  ,
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginBottom: 8
  },
  backButtonText: {
    marginLeft: 8,
    color: '#1f6feb',
    fontWeight: '600'
  }
});
