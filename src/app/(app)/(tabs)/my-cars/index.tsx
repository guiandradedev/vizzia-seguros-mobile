import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

export default function MyCarsScreen() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/(app)/(tabs)/my-cars/create'); // Redireciona para login
  };

  return (
    <View style={styles.container}>
      <Text>Aparentemente você não tem nenhum seguro ativo</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRedirect}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Cadastre seu veículo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'space-between', // empurra o botão para o final
    
    padding: 20,
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
});