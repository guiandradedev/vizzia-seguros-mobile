import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import Camera from '@/components/Camera';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';

const theme = Colors.light

export default function CreateVehicleScreen() {
    const { vehicle, setVehicle, changeInitialCarPhoto } = useCreateVehicle()
    const router = useRouter();
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [canRedirect, setCanRedirect] = useState(false);

    useEffect(() => {
        if (vehicle.model && vehicle.brand && vehicle.year && vehicle.color && vehicle.plate && vehicle.odomether) {
            setCanRedirect(true)
        } else {
            setCanRedirect(false)
        }
    }, [vehicle])

    const openCamera = () => {
        setIsCameraOpen(true);
    };
    const closeCamera = () => {
        setIsCameraOpen(false);
    };

    const handleRedirect = () => {

        router.push('/(app)/(tabs)/my-cars/create/take-photos'); // Redireciona para login
    };

    const [photo, setPhoto] = useState<string>("");
    async function addPhoto(photoUri: string) {
        setPhoto(photoUri)
        closeCamera();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        changeInitialCarPhoto(photoUri)
        const data = {
            model: "Onix RS",
            brand: "Chevrolet",
            year: 2024,
            color: "Preto",
            plate: "ABC1D23"
        }
        setVehicle({ ...vehicle, ...data })
    }

    if (isCameraOpen) {
        return <View style={{ flex: 1 }}>
            <Camera setPhoto={addPhoto} closeCamera={closeCamera} />
        </View>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cadastre um veículo!</Text>

            <Text>Para começar, tire uma foto do carro.</Text>
            <Text>A foto deve ser de boa qualidade de frente, mostrando a placa e os detalhes do veículo.</Text>
            <TouchableOpacity
                style={styles.imageButton}
                onPress={openCamera}
            >
                {!photo ? <Text>Adicionar foto</Text> : <Text>Alterar foto</Text>}
            </TouchableOpacity>

            {photo && (
                <View style={styles.formContainer}>
                    <Text>Enviado</Text>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <Text>Confirme os dados do veículo:</Text>
                    <View style={styles.inputContainer}>
                        <Text>Modelo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Modelo"
                            value={vehicle.model}
                            onChangeText={(text) => setVehicle({ ...vehicle, model: text })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Marca</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Marca"
                            value={vehicle.brand}
                            onChangeText={(text) => setVehicle({ ...vehicle, brand: text })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Ano</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ano"
                            value={vehicle.year ? vehicle.year.toString() : ''}
                            onChangeText={(text) => setVehicle({ ...vehicle, year: parseInt(text) || 0 })}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Cor</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Cor"
                            value={vehicle.color}
                            onChangeText={(text) => setVehicle({ ...vehicle, color: text })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Placa</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Placa"
                            value={vehicle.plate}
                            onChangeText={(text) => setVehicle({ ...vehicle, plate: text })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Odômetro</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Odômetro"
                            value={vehicle.odomether ? vehicle.odomether.toString() : ''}
                            onChangeText={(text) => setVehicle({ ...vehicle, odomether: parseInt(text) || 0 })}
                            keyboardType="numeric"
                        />
                    </View>
                    <Text>Se algum dado estiver incorreto, você pode editar.</Text>
                </View>
            )}

            {!photo && (
                <View>
                    <Text>Aguardando foto...</Text>
                </View>
            )}

            <TouchableOpacity style={[styles.button, !canRedirect && styles.buttonDisabled]} onPress={handleRedirect} disabled={!canRedirect}>
                <Text style={styles.buttonText}>Continuar</Text>
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