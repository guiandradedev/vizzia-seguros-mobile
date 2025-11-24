import Colors from '@/constants/Colors';
import type { Insurance } from '@/types/auth';
import { useNavigation } from '@react-navigation/native';
import { AlertTriangle, ChevronLeft, Mail, Phone, Wrench } from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface VehicleAssistanceProps {
  insurance: Insurance;
}

export default function VehicleAssistance({ insurance }: VehicleAssistanceProps) {
  const navigation = useNavigation();

  const handleAssistanceRequest = (type: string) => {
    Alert.alert(
      'Solicitar Assistência',
      `Deseja solicitar ${type} para o veículo ${insurance.vehicle?.model_name || 'selecionado'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // TODO: Implementar chamada da API para solicitar assistência
            Alert.alert('Sucesso', 'Sua solicitação foi enviada! Entraremos em contato em breve.');
          },
        },
      ]
    );
  };

  const handleContact = (type: 'phone' | 'email') => {
    if (type === 'phone') {
      Linking.openURL('tel:+5511999999999'); // TODO: Usar telefone real da seguradora
    } else {
      Linking.openURL('mailto:assistência@vizzia.com.br'); // TODO: Usar email real da seguradora
    }
  };

  const vehicle = insurance.vehicle;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Assistência Veicular
          </Text>
          <Text style={styles.headerSubtitle}>
            {vehicle?.model_name || vehicle?.model} • {vehicle?.plate}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Wrench size={48} color={Colors.primary} style={styles.welcomeIcon} />
          <Text style={styles.welcomeTitle}>Como podemos ajudar?</Text>
          <Text style={styles.welcomeText}>
            Selecione o tipo de assistência que você precisa. Nossa equipe está pronta para atender você 24 horas por dia.
          </Text>
        </View>

        <View style={styles.assistanceOptions}>
          <TouchableOpacity
            style={styles.assistanceCard}
            onPress={() => handleAssistanceRequest('Reboque')}
            activeOpacity={0.8}
          >
            <View style={styles.assistanceIcon}>
              <Wrench size={24} color={Colors.primary} />
            </View>
            <View style={styles.assistanceContent}>
              <Text style={styles.assistanceTitle}>Reboque 24h</Text>
              <Text style={styles.assistanceDescription}>
                Seu veículo quebrou? Solicite reboque para qualquer lugar do Brasil.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.assistanceCard}
            onPress={() => handleAssistanceRequest('Pane Seca')}
            activeOpacity={0.8}
          >
            <View style={styles.assistanceIcon}>
              <AlertTriangle size={24} color={Colors.primary} />
            </View>
            <View style={styles.assistanceContent}>
              <Text style={styles.assistanceTitle}>Pane Seca</Text>
              <Text style={styles.assistanceDescription}>
                Ficou sem combustível? Solicite entrega de combustível no local.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.assistanceCard}
            onPress={() => handleAssistanceRequest('Chaveiro')}
            activeOpacity={0.8}
          >
            <View style={styles.assistanceIcon}>
              <Wrench size={24} color={Colors.primary} />
            </View>
            <View style={styles.assistanceContent}>
              <Text style={styles.assistanceTitle}>Chaveiro</Text>
              <Text style={styles.assistanceDescription}>
                Perdeu as chaves? Solicite atendimento de chaveiro especializado.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.assistanceCard}
            onPress={() => handleAssistanceRequest('Guincho')}
            activeOpacity={0.8}
          >
            <View style={styles.assistanceIcon}>
              <Wrench size={24} color={Colors.primary} />
            </View>
            <View style={styles.assistanceContent}>
              <Text style={styles.assistanceTitle}>Guincho</Text>
              <Text style={styles.assistanceDescription}>
                Precisa de guincho? Solicite transporte do seu veículo.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Precisa de ajuda imediata?</Text>
          <Text style={styles.contactText}>
            Entre em contato diretamente com nossa central de atendimento 24 horas.
          </Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContact('phone')}
            >
              <Phone size={20} color={Colors.primary} />
              <Text style={styles.contactButtonText}>Ligar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContact('email')}
            >
              <Mail size={20} color={Colors.primary} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
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
});