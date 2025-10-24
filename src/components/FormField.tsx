// /components/FormField.js

import { commonStyles } from '@/styles/CommonStyles';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

// interface para definir as props do componente
interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string | null; 
}

// Aplique a interface às suas props
export default function FormField({ label, error, ...props }: FormFieldProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[commonStyles.input, error ? commonStyles.inputError : null]}
                placeholderTextColor="#999"
                {...props} // Agora o TypeScript sabe que 'props' são de um TextInput
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

// ... seus estilos permanecem os mesmos ...
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: '#555',
        fontWeight: '600',
    },
    input: {
        // kept for backwards-compatibility if needed, but primary input styles are in commonStyles
    },
    errorText: {
        color: 'red',
        marginTop: 6,
        fontSize: 12,
    },
});