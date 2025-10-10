import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useEffect, useState } from 'react';
import Camera from '@/components/Camera'; // Importe o componente Camera
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import { useRouter } from 'expo-router';

const theme = Colors.light

export default function MyCarsScreen() {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<number>(0);

    const { vehicle, vehiclePhotos, changeVehiclePhoto, initialCarPhoto } = useCreateVehicle();
    const router = useRouter();

    const [canRedirect, setCanRedirect] = useState(false);

    useEffect(() => {
        setCanRedirect(vehiclePhotos.every(photo => photo.uri))
    }, [vehiclePhotos])

    const openCamera = (photoIndex: number) => {
        setIsCameraOpen(true);
        setEditingPhoto(photoIndex)
    };
    const closeCamera = () => {
        setEditingPhoto(0)
        setIsCameraOpen(false);
    };

    function addPhoto(photoUri: string) {
        closeCamera();
        changeVehiclePhoto(editingPhoto, photoUri)
    }

    if (isCameraOpen) {
        return <View style={{ flex: 1 }}>
            <Camera setPhoto={addPhoto} title={vehiclePhotos[editingPhoto].title} closeCamera={closeCamera} />
        </View>;
    }

    const handleRedirect = () => {

        router.push('/(app)/(tabs)/my-cars/create/conductors'); // Redireciona para login
    };

    function handleBack() {
        router.back();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fotos do veiculo!</Text>

            <View style={styles.photoList}>
                {vehiclePhotos.map((photo, index) => (
                    <View key={index} style={styles.photosContainer}>
                        <Text>{photo.title}</Text>
                        <TouchableOpacity
                            style={styles.imageButton}
                            onPress={() => openCamera(index)}
                        >
                            {photo.uri && <Image key={index} source={{ uri: photo.uri }} style={styles.photo} />}
                            {!photo.uri && <FontAwesome size={28} name="plus" color={"#000"} />}
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleBack}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, !canRedirect && styles.buttonDisabled]} onPress={handleRedirect} disabled={!canRedirect}>
                <Text style={styles.buttonText}>Continuar</Text>
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
    photosContainer: {
        width: '50%', // Cada foto ocupa 50% da largura da tela
        padding: 10, // Espaçamento entre as fotos
        alignItems: 'center', // Centraliza o conteúdo dentro de cada item
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
        alignItems: "center"
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
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    photoList: {
        marginTop: 20,
        flexDirection: 'row', // Alinha os itens em linha
        flexWrap: 'wrap', // Permite que os itens quebrem para a próxima linha
        justifyContent: 'space-between', // Espaçamento entre as fotos
    },
    photo: {
        width: "100%",
        height: "100%",
        // margin: 5,r
        borderRadius: 8,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.5,  // Diminui a cor adicionando opacidade
    },
});