import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { commonStyles } from '@/styles/CommonStyles';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function VehicleConductorsScreen() {
  const router = useRouter();

  const handleSkip = () => {
    router.push('/(app)/(tabs)/my-cars/create/resume-conductors');
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

        <Button onPress={handleContinue} title="Adicionar condutores" variant="primary" icon='plus' iconPosition='left' />
      </View>

      <View style={commonStyles.footer}>
        <View style={commonStyles.footerRow}>
          <Button onPress={handleBack} title="Voltar" variant="outline" />
          <Button onPress={handleSkip} title="Pular" variant="primary" />
          {/* <Button onPress={handleContinue} title="Continuar" variant="primary" /> */}
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
