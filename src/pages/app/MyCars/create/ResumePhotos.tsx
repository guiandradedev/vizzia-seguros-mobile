import Colors from '@/constants/Colors';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import { commonStyles } from '@/styles/CommonStyles';
import axiosLib from 'axios';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResumePhotos() {
  const router = useRouter();
  const { initialCarPhoto, vehiclePhotos } = useCreateVehicle();
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => router.back();
  const handleContinue = () => router.push('/(app)/(tabs)/my-cars/create/resume-conductors');

  async function handleSubmitFinal() {
    // Gather vehicle data from context via navigation flow (ResumeVehicle handles validation previously).
    // This page acts as final submit: send photos + (assumed) vehicle payload.
    setSubmitting(true);
    try {
      const formData = new FormData();

      if (initialCarPhoto) {
        formData.append('initial_photo', {
          uri: initialCarPhoto,
          name: 'initial_photo.jpg',
          type: 'image/jpeg'
        } as any);
      }

      // append other photos
      vehiclePhotos.forEach((p, idx) => {
        if (p.uri) {
          formData.append('photos', {
            uri: p.uri,
            name: `vehicle_photo_${idx}.jpg`,
            type: 'image/jpeg'
          } as any);
        }
      });

      // NOTE: the server endpoint and additional vehicle fields payload are not known here.
      // We'll POST the photos to the assumed endpoint '/vehicle'. Adjust keys as needed.
    //   const res = await api.post('/vehicle', formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' }
    //   });

      Alert.alert('Sucesso', 'Veículo cadastrado com sucesso.');
      // navigate back to vehicles list
      router.push('/(app)/(tabs)/my-cars');
    } catch (error) {
      if (axiosLib.isAxiosError(error)) {
        console.log('Erro ao enviar fotos do veículo:', error.response?.data);
        Alert.alert('Erro', 'Houve um problema ao enviar as fotos. Por favor, tente novamente.');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: Colors.background }]}> 
      <ScrollView contentContainerStyle={[commonStyles.scrollContent, { flexGrow: 1 }]} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Fotos do veículo</Text>

        <View style={styles.card}>
          <Text style={commonStyles.sectionTitle}>Foto principal</Text>
          {initialCarPhoto ? (
            <Image source={{ uri: initialCarPhoto }} style={styles.photo} />
          ) : (
            <Text style={commonStyles.text}>Nenhuma foto fornecida</Text>
          )}

          <Text style={[commonStyles.sectionTitle, { marginTop: 12 }]}>Outras fotos</Text>
          {vehiclePhotos.map((photo, index) => (
            <View key={index} style={{ marginTop: 12 }}>
              <Text style={commonStyles.label}>{photo.title}</Text>
              {photo.uri ? (
                <Image source={{ uri: photo.uri }} style={[styles.photo, { width: '100%' }]} />
              ) : (
                <Text>Não fornecida</Text>
              )}
            </View>
          ))}
        </View>

        <View style={commonStyles.footer}>
          <View style={commonStyles.footerRow}>
            <TouchableOpacity style={[commonStyles.footerButton, commonStyles.backButton]} onPress={handleBack} disabled={submitting}>
              <Text style={commonStyles.buttonText}>Voltar</Text>
            </TouchableOpacity>

            {/* If this page is the final step, submit here. Otherwise continue the flow. */}
            <TouchableOpacity
              style={[commonStyles.footerButton, commonStyles.buttonSecondary, submitting && { opacity: 0.7 }]}
              onPress={handleSubmitFinal}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={commonStyles.buttonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  }
});