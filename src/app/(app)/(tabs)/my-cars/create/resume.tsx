import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import Camera from '@/components/Camera';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';

const theme = Colors.light

export default function ResumeCreateVehicleScreen() {
    const router = useRouter();
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const { vehicle, vehiclePhotos, initialCarPhoto, conductors } = useCreateVehicle()

    function handleBack() {
        router.back();
    }

    function handleSubmit() {
        alert('Cadastro finalizado com sucesso!');
        router.push('/(app)/(tabs)/my-cars'); 
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Resumo do cadastro!</Text>

            <Text>Quase lá! Revise as informações do veículo antes de finalizar o cadastro.</Text>
            <View>
                <Image source={{ uri: initialCarPhoto }} style={styles.photo} />
                <Text>Modelo: {vehicle.model}</Text>
                <Text>Marca: {vehicle.brand}</Text>
                <Text>Ano: {vehicle.year}</Text>
                <Text>Cor: {vehicle.color}</Text>
                <Text>Placa: {vehicle.plate}</Text>
                <Text>Odômetro: {vehicle.odomether} km</Text>
            </View>
            <View>
                <Text>Fotos do veículo:</Text>
                {
                    vehiclePhotos.map((photo, index) => (
                        <View key={index}>
                            {photo.uri ? (
                                <Image source={{ uri: photo.uri }} style={styles.photo} />
                            ) : (
                                <Text>{photo.title} - Não fornecida</Text>
                            )}
                        </View>
                    ))
                }
            </View>
            <View>
                <Text>Condutores adicionais:</Text>
                {
                    conductors.length > 0 ? conductors.map((conductor, index) => (
                        <View key={index}>
                            <Text>Nome: {conductor.name}</Text>
                            <Text>CNH: {conductor.document}</Text>
                            <Text>Data de Nascimento: {conductor.birthDate.toLocaleDateString()}</Text>
                            <Text>Telefone: {conductor.phone}</Text>
                            <Text>Email: {conductor.email}</Text>
                            <Text>Relacionamento: {conductor.relationship}</Text>
                            <Text>Emissor da CNH: {conductor.licenseFirstEmission}</Text>
                            <Text>Número da CNH: {conductor.licenseNumber}</Text>
                            <Text>Validade da CNH: {conductor.licenseExpiry}</Text>
                            <Image source={{ uri: conductor.licensePhoto }} style={styles.photo} />
                        </View>
                    )) : <Text>Nenhum condutor adicional adicionado.</Text>
                }
            </View>

            <TouchableOpacity style={styles.button} onPress={handleBack}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Finalizar cadastro</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
        textAlign: 'center',
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
        marginTop: 20,
        alignSelf: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    imageButton: {
        width: 150,
        height: 150,
        backgroundColor: theme.tabBackground,
        padding: 8,
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        marginVertical: 20,
    },
    formContainer: {
        marginTop: 20,
    },
    photo: {
        width: '100%',
        height: 200,  // Altura fixa para evitar problemas de layout
        borderRadius: 8,
        marginVertical: 10,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
});