import React from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, View, Text } from 'react-native';
import RegisterPage from '../../../components/RegisterPage';

export default function RegisterScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>

        <View>
          <Text style={styles.headerTitle}>Crie sua Conta</Text>
          <Text style={styles.headerSubtitle}>Preencha os dados para começar</Text>
        </View>

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
});