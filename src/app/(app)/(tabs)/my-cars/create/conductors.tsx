import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import Camera from '@/components/Camera';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';

const theme = Colors.light

export default function VehicleConductorsScreen() {
    const router = useRouter();

    const handleSkip = () => {
        router.push('/(app)/(tabs)/my-cars/create/resume'); // Redireciona para login
    };

    const handleContinue = () => {
        router.push('/(app)/(tabs)/my-cars/create/add-conductors'); // Redireciona para login
    };

    const { vehicle, setVehicle, initialCarPhoto, vehiclePhotos } = useCreateVehicle()

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Condutores adicionais</Text>

            <Text>Existem condutores adicionais?</Text>
            <Text>Você pode adicionar até 3 condutores adicionais para este veículo.</Text>

            <TouchableOpacity
                style={[styles.button, { marginTop: 20 }]}
                onPress={handleContinue}
            >
                <Text style={styles.buttonText}>Adicionar condutor</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { marginTop: 20, backgroundColor: '#ccc' }]}
                onPress={handleSkip}
            >
                <Text style={styles.buttonText}>Pular</Text>
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
    photo: {
        width: '100%',
        height: 200,  // Altura fixa para evitar problemas de layout
        borderRadius: 8,
        marginVertical: 10,
    },
});