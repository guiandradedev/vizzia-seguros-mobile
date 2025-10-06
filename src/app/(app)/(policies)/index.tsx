import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

export default function MyCarsScreen() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/take_photo'); // Redireciona para login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tira!</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRedirect}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>dsadas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});