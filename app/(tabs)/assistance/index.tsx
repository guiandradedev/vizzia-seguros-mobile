import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = Colors.light;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        { paddingTop: insets.top }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Alguma dúvida?
        </Text>
        <Text style={styles.headerSubTitle}>
          Nulla vehicula tortor in neque scelerisque, nec porttitor nisl sollicitudin.
        </Text>
      </View>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE6"
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'medium',
    fontFamily: "Roboto-Medium",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  headerSubTitle: {
    fontSize: 16,
    fontWeight: 'regular',
    fontFamily: "Roboto-Regular",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  header: {
    paddingVertical: 16
  }
});