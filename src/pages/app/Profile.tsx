import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import api from '@/lib/axios';
import { Calendar, CreditCard, Heart, Mail, MapPin, Phone, Shield, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  cpf: string;
  age: number;
  birthDate: string;
  gender: string;
  marital_status: string;
  cnhNumber: string;
  cnhIssueDate: string;
  role: string;
  status: boolean;
  // Campos que serão adicionados futuramente
  phone?: string;
  address?: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
  // Ignorar insurances e vehicles por enquanto
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/users/me');
      // console.log('Retorno da API /users/me:', response.data); // Removido após análise

      setUserProfile(response.data);
    } catch (err) {
      console.error('Erro ao buscar perfil do usuário:', err);
      setError('Erro ao carregar informações do perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Header title="Perfil" subtitle="Aqui você pode gerenciar suas informações pessoais." />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {userProfile ? (
          <View>
            {/* Informações pessoais */}
            <View style={styles.profileCard}>
              <View style={styles.sectionHeader}>
                <User size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                <View style={[styles.statusBadgeHeader, {
                  backgroundColor: userProfile.status ? '#dcfce7' : '#fef2f2',
                  borderColor: userProfile.status ? '#bbf7d0' : '#fecaca',
                }]}>
                  <Text style={[styles.statusTextHeader, {
                    color: userProfile.status ? '#166534' : '#991b1b',
                  }]}>
                    {userProfile.status ? '✓ Ativo' : '✗ Inativo'}
                  </Text>
                </View>
              </View>

              {/* Nome */}
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <User size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Nome</Text>
                  <Text style={styles.detailValue}>{userProfile.name}</Text>
                </View>
              </View>

              {/* Email */}
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Mail size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{userProfile.email}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <CreditCard size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>CPF</Text>
                  <Text style={styles.detailValue}>{userProfile.cpf}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Calendar size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Idade</Text>
                  <Text style={styles.detailValue}>{userProfile.age} anos</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Calendar size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Data de Nascimento</Text>
                  <Text style={styles.detailValue}>
                    {new Date(userProfile.birthDate).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Heart size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Estado Civil</Text>
                  <Text style={styles.detailValue}>
                    {userProfile.marital_status === 'Single' ? 'Solteiro' : userProfile.marital_status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Documentação */}
            <View style={styles.profileCard}>
              <View style={styles.sectionHeader}>
                <Shield size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Documentação</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <CreditCard size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>CNH</Text>
                  <Text style={styles.detailValue}>{userProfile.cnhNumber}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Calendar size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Emissão CNH</Text>
                  <Text style={styles.detailValue}>
                    {new Date(userProfile.cnhIssueDate).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Contato */}
            <View style={styles.profileCard}>
              <View style={styles.sectionHeader}>
                <Phone size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Contato</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Phone size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Telefone</Text>
                  <Text style={styles.detailValue}>(11) 99999-9999</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <MapPin size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Endereço</Text>
                  <View style={styles.addressContainer}>
                    <Text style={styles.detailValue}>Rua das Flores, 123</Text>
                    <Text style={styles.detailValue}>São Paulo, SP</Text>
                    <Text style={styles.detailValue}>CEP: 01234-567</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Nenhuma informação de perfil disponível.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary + '20',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  addressContainer: {
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeInline: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeHeader: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextInline: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusTextHeader: {
    fontSize: 12,
    fontWeight: '600',
  },
});