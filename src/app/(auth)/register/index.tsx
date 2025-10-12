import React from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, View, Text, TouchableOpacity } from 'react-native';
import RegisterPage from '../../../components/RegisterPage';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Ação para voltar
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Crie sua Conta</Text>
          <Text style={styles.headerSubtitle}>Preencha os dados para começar</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <RegisterPage />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#F0F4F7',
  },
  container: {
    paddingBottom: 40
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginTop: 20,
    paddingTop: 50,
    paddingHorizontal: 20
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20
  },

  backButton: {
    position: 'absolute', // Permite posicionar livremente
    top: 60, // Distância do topo (ajuste conforme necessário)
    left: 20, // Distância da esquerda
    zIndex: 1, // Garante que o botão fique sobre os outros elementos
    padding: 10,
    borderRadius: 20,
  },
  // Estilo do texto (ícone) da seta
  backButtonText: {
    fontSize: 38, // Tamanho do ícone
    color: '#333',
    fontWeight: 'bold',
  },
});