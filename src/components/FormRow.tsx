// /components/FormRow.js

import React from 'react'; // React já está importado, o que é ótimo
import { View, StyleSheet } from 'react-native';

interface FormRowProps {
  children: React.ReactNode;
}

export default function FormRow({ children }: FormRowProps) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 15,
  },
});