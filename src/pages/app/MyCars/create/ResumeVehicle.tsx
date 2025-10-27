import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { CarBrand, carBrands, FuelTypes, fuelTypes } from '@/contexts/CreateVehicleContext';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import { commonStyles } from '@/styles/CommonStyles';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import api from '@/lib/axios';

export default function ResumeVehicle() {
  const router = useRouter();
  const { vehicle, setVehicle, vehiclePhotos, initialCarPhoto } = useCreateVehicle();

  const canRedirect = useMemo(() => {
    const modelValid = typeof vehicle.model === 'string' && vehicle.model.trim().length > 0;
    const brandValid = typeof vehicle.brand === 'number' && vehicle.brand > 0;
    const yearValid = typeof vehicle.year === 'number' && !isNaN(vehicle.year) && vehicle.year > 1900;
    const colorValid = typeof vehicle.color === 'string' && vehicle.color.trim().length > 0;
    const plateValid = typeof vehicle.plate === 'string' && vehicle.plate.trim().length > 0;
    const odometherValid = typeof vehicle.odomether === 'number' && !isNaN(vehicle.odomether);
    const fuelValid = !!vehicle.fuel;
    const usageValid = !!vehicle.usage;
    return modelValid && brandValid && yearValid && colorValid && plateValid && odometherValid && fuelValid && usageValid;
  }, [vehicle]);

  function handleBack() {
    router.back();
  }

  async function handleSubmit() {
    if (!canRedirect) {
      // simple guard — keep user on page if missing data
      Alert.alert('Preencha todos os campos obrigatórios antes de continuar.');
      return;
    }
    try {
        const formData = new FormData();
        formData.append('photos', {
            uri: initialCarPhoto,
            name: 'initial_photo.jpg',
            type: 'image/jpeg'
        } as any);
        const photoData = {
          file: "initial_photo.jpg",
          type: "initial"
        }
        formData.append('photos', photoData as any);

        const currentBrandName: string | undefined = carBrands.find((item: CarBrand) => item.code === vehicle.brand)?.name;
        formData.append('plate', vehicle.plate); //
        formData.append('brand', currentBrandName!); //
        formData.append('model', vehicle.model); //
        formData.append('year', String(vehicle.year)); //
        formData.append('color', vehicle.color); //
        formData.append('odometer', String(vehicle.odomether)); //

        const fuelIndex = fuelTypes.findIndex((ft: FuelTypes) => ft === vehicle.fuel);
        const fuel_code = fuelIndex >= 0 ? fuelIndex + 1 : null;
        formData.append('motorization', fuel_code!.toString());

        console.log(JSON.stringify(formData))

        const response = await api.post('/vehicle', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        const { id } = response.data;
        setVehicle({ ...vehicle, id });
        console.log(id)
        console.log(response.data);
        router.push('/(app)/(tabs)/my-cars/create/conductors');
    } catch (error) {
        if(axios.isAxiosError(error)) {
            console.log('Erro ao enviar dados do veículo:', error.response?.data);
            Alert.alert('Erro', 'Houve um problema ao enviar os dados do veículo. Por favor, tente novamente.');
        } else {
            Alert.alert('Erro', 'Ocorreu um erro inesperado. Por favor, tente novamente.');
        }
    }
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: Colors.background }]}> 
      <ScrollView contentContainerStyle={[commonStyles.scrollContent, { flexGrow: 1 }]} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Confirme os dados do veículo</Text>

        <View style={styles.card}>
          <Text style={commonStyles.sectionTitle}>Foto principal</Text>
          {initialCarPhoto ? (
            <Image source={{ uri: initialCarPhoto }} style={styles.photo} />
          ) : (
            <Text style={commonStyles.text}>Nenhuma foto fornecida</Text>
          )}

          <Text style={[commonStyles.sectionTitle, { marginTop: 12 }]}>Informações do veículo</Text>

          <View style={{ marginTop: 8 }}>
            <Text style={commonStyles.label}>Modelo</Text>
            <Text style={commonStyles.input}>{(vehicle as any).model_name ?? vehicle.model}</Text>

            <Text style={commonStyles.label}>Marca</Text>
            <Text style={commonStyles.input}>{vehicle.brand}</Text>

            <Text style={commonStyles.label}>Ano</Text>
            <Text style={commonStyles.input}>{vehicle.year}</Text>

            <Text style={commonStyles.label}>Cor</Text>
            <Text style={commonStyles.input}>{vehicle.color}</Text>

            <Text style={commonStyles.label}>Placa</Text>
            <Text style={commonStyles.input}>{vehicle.plate}</Text>

            <Text style={commonStyles.label}>Odômetro</Text>
            <Text style={commonStyles.input}>{vehicle.odomether}</Text>

            <Text style={commonStyles.label}>Combustível</Text>
            <Text style={commonStyles.input}>{vehicle.fuel}</Text>

            <Text style={commonStyles.label}>Uso</Text>
            <Text style={commonStyles.input}>{vehicle.usage}</Text>
          </View>

        </View>

        <View style={commonStyles.footer}>
          <View style={commonStyles.footerRow}>
            <Button onPress={handleBack} title="Voltar" variant="outline"/>
            <Button onPress={handleSubmit} title="Continuar" variant="primary"/>
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

