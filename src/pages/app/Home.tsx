// app/(tabs)/index.tsx (Rota: /)

import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { useRouter } from 'expo-router';
import { AlertCircle, Bell, Car, Eye, LogOut, Phone, Plus, User } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomePage() {
  const router = useRouter();

  const { signOut, user } = useAuth()
  const [vehiclesCount, setVehiclesCount] = useState<number | null>(null);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  // Vetor de textos aleatórios para a seção de destaque
  const randomTexts = [
    "Seu carro foi roubado ou furtado?",
    "Ocorreu algum problema com seu veículo?",
    "Emergência com seu seguro?"
  ];

  // Selecionar um texto aleatório
  const [randomText] = useState(() => randomTexts[Math.floor(Math.random() * randomTexts.length)]);

  // Animação para o sinal "live" piscando
  const liveOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(liveOpacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(liveOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    blinkAnimation.start();
    return () => blinkAnimation.stop();
  }, [liveOpacity]);

  async function handleLogout() {
    signOut()
    Alert.alert("Vizzia Seguros", "Deslogado.")
    router.replace('/(auth)/login');
  }

  const handleRedirect = () => {
    router.push('/(app)/(tabs)/my-cars/create'); // Redireciona para criar veículo
  };

  const handleContact = () => {
    setContactModalVisible(true);
  };

  const handleCall = () => {
    setContactModalVisible(false);
    Linking.openURL('tel:19999999999');
  };

  const handleEmail = () => {
    setContactModalVisible(false);
    Linking.openURL('mailto:contato@vizzia.com.br');
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

          {/* Seção de destaque com texto aleatório - só aparece se tiver mais de 1 veículo */}
          {vehiclesCount !== null && vehiclesCount >= 1 && (
            <View style={styles.highlightCard}>
              <View style={styles.highlightHeader}>
                <AlertCircle size={24} color="white" />
                <Text style={styles.highlightTitle}>Assistência 24h</Text>
              </View>
              <Text style={styles.highlightText}>{randomText}</Text>
              <View style={styles.liveContainer}>
                <Animated.View style={{ opacity: liveOpacity }}>
                  <View style={styles.liveDot} />
                </Animated.View>
                <Text style={styles.liveText}>Central de atendimento 24h</Text>
              </View>
              <TouchableOpacity style={styles.contactCTA} onPress={handleContact}>
                <Phone size={20} color="white" />
                <Text style={styles.contactText}>Ligue Agora</Text>
              </TouchableOpacity>
            </View>
          )}

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

      {/* Modal de contato */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setContactModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Conte com a gente</Text>
              <Text style={styles.modalSubtitle}>Como deseja começar seu chamado?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={handleEmail}>
                  <Text style={styles.modalButtonText}>E-mail</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleCall}>
                  <Text style={styles.modalButtonText}>Telefone</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setContactModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
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
  highlightCard: {
    backgroundColor: Colors.primary, // Fundo azul primário para destaque
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0, // Remover borda
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white', // Branco para contraste com fundo azul
    marginLeft: 8,
  },
  highlightText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white', // Branco para contraste
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white', // Branco para piscar no fundo azul
    marginRight: 8,
  },
  liveText: {
    fontSize: 14,
    color: 'white', // Branco para contraste
    fontWeight: '600',
  },
  contactCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A7FA0', // Azul mais escuro que o primary
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  contactText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCloseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalCloseText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});