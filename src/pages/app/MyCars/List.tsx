import Button from '@/components/Button';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Vehicle } from '@/types/auth';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VehicleComponent from './components/Vehicle';

export default function MyCarsListPage() {
  const router = useRouter();

  const { user } = useAuth()

  const handleRedirect = () => {
    router.push('/(app)/(tabs)/my-cars/create'); // Navegação para create
  };

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    async function getVehicles() {
      try {

        const response: AxiosResponse<Vehicle[]> = await api.get('/vehicle');

        setVehicles(response.data)
      } catch(err) {
        if(axios.isAxiosError(err)) {
          const status = err.response?.status;
          if(status === 404) {
            setVehicles([])
            return;
          }
          console.log('Erro na requisição:', err.response?.data);
        } else {
          console.log('Erro ao buscar veículos:', err);
        }
      }
    }
    
    getVehicles();
    // Aqui você pode carregar os veículos do usuário, se necessário
  }, []);

  return (
    <View
      style={[
        styles.container_outside,
      ]}
    >
      <Header title="Meus Veículos" subtitle="Aqui você pode gerenciar seus veículos assegurados." />

      <View style={styles.container}>
        {
          vehicles.length == 0 &&
          <Text>Você ainda não possui veículos cadastrados.</Text>
        }

        {
          vehicles.map((vehicle) => (
            <VehicleComponent key={vehicle.id} vehicle={vehicle} />
          ))
        }

        <Button title="Solicitar Seguro" onPress={handleRedirect} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container_outside: {
    flex: 1,
    justifyContent: 'space-between', // empurra o botão para o final
  },
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6D94C5',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '60%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: '500',
    fontFamily: "Roboto-Medium",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  headerSubTitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: "Roboto-Regular",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  header: {
    paddingVertical: 16
  },
});