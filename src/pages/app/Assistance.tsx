import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useEffect } from 'react';

export default function AssistancePage() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        // { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Assistencia?
        </Text>
        <Text style={styles.headerSubTitle}>
          Em breve mais informações.
        </Text>
      </View>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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