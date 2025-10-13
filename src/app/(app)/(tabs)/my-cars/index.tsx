import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';

export default function MyCarsScreen() {
  const router = useRouter();

  const { user } = useAuth()

  const handleRedirect = () => {
    router.push('/(app)/(tabs)/my-cars/create'); // Redireciona para login
  };

  return (
    <SafeAreaView
      style={[
        styles.container_outside,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Meus Veículos
        </Text>
        <Text style={styles.headerSubTitle}>
          Aqui você pode gerenciar seus veículos assegurados.
        </Text>
      </View>

      <View style={styles.container}>
        {
          user?.vehicles.length == 0 &&
          <Text>Você ainda não possui veículos cadastrados.</Text>
        }


        <TouchableOpacity
          style={styles.button}
          onPress={handleRedirect}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Cadastre seu veículo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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