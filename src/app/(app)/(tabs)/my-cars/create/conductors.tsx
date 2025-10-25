import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { commonStyles } from '@/styles/CommonStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VehicleConductorsScreen() {
  const router = useRouter();

  const handleSkip = () => {
    router.push('/(app)/(tabs)/my-cars/create/take-photos');
  };

  const handleContinue = () => {
    router.push('/(app)/(tabs)/my-cars/create/add-conductors');
  };

  function handleBack() {
    router.back();
  }

  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: Colors.background }
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
          <Button onPress={handleBack} title="Voltar" variant="outline" />
          <Button onPress={handleSkip} title="Pular" variant="outline" />
          <Button onPress={handleContinue} title="Continuar" variant="primary" />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});
