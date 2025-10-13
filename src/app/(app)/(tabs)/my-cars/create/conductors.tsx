import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { commonStyles } from '@/styles/CommonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';

export default function VehicleConductorsScreen() {
  const router = useRouter();

  const handleSkip = () => {
    router.push('/(app)/(tabs)/my-cars/create/resume');
  };

  const handleContinue = () => {
    router.push('/(app)/(tabs)/my-cars/create/add-conductors');
  };

  function handleBack() {
    router.back();
  }

  const theme = Colors.light
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background }
      ]}
    >
      <View style={commonStyles.content}>
        <Text style={commonStyles.title}>Condutores adicionais</Text>

        <Text style={commonStyles.text}>Existem condutores adicionais?</Text>
        <Text style={commonStyles.subtitle}>
          Você pode adicionar até 3 condutores adicionais para este veículo.
        </Text>

        <TouchableOpacity
          style={[commonStyles.button, { flexDirection: 'row', justifyContent: 'center', marginTop: 20, width: '60%' }]}
          onPress={handleContinue}
        >
          <MaterialIcons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={commonStyles.buttonText}>Adicionar condutor</Text>
        </TouchableOpacity>
      </View>

      <View style={commonStyles.footer}>
        <View style={commonStyles.footerRow}>
          <TouchableOpacity style={[commonStyles.footerButton, commonStyles.backButton]} onPress={handleBack}>
            <Text style={commonStyles.buttonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[commonStyles.footerButton, commonStyles.buttonSecondary]} onPress={handleSkip}>
            <Text style={commonStyles.buttonText}>Pular</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});
