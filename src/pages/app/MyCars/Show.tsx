import Header from '@/components/Header';
import api from '@/lib/axios';
import { Vehicle } from '@/types/auth';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ShowVehiclePage() {
  const { id } = useLocalSearchParams() as { id?: string };
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, [id]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#007aff', marginBottom: 8 }}>{'< Voltar'}</Text>
        </TouchableOpacity>
        <Header title="Veículo" subtitle="Detalhes do veículo" />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading && <ActivityIndicator />}

        {!loading && !vehicle && (
          <Text>Veículo não encontrado.</Text>
        )}

        {vehicle && (
            <View style={styles.card}>
            <Text style={styles.title}>{vehicle.brand} { (vehicle as any).model_name ?? vehicle.model }</Text>
            <Text style={styles.info}>Ano: {vehicle.year}</Text>
            <Text style={styles.info}>Cor: {vehicle.color}</Text>
            <Text style={styles.info}>Placa: {vehicle.plate}</Text>
            <Text style={styles.sectionTitle}>Odômetro</Text>
            <Text style={styles.text}>{vehicle.odometer + "km" || 'Não informado'}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
});
