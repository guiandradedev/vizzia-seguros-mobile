import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import Camera from '@/components/Camera'; // Importe o componente Camera

interface PhotoType {
    uri: string,
    title: string
}

export default function MyCarsScreen() {
    const MAX_PHOTOS = 5;
    const [photos, setPhotos] = useState<PhotoType[]>([
        { title: "Frente", uri: "" },
        { title: "Trás", uri: "" },
        { title: "Lado Esquerdo", uri: "" },
        { title: "Lado Direito", uri: "" },
        { title: "Capô", uri: "" },
        // {title: "", uri: ""},
        // {title: "", uri: ""},
        // {title: "", uri: ""},
    ]); // Estado para armazenar URIs das fotos
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState(0);

    const openCamera = (photoIndex: number) => {
        setIsCameraOpen(true);
        setEditingPhoto(photoIndex)
    };
    const closeCamera = () => {
        setIsCameraOpen(false);
    };

    const addPhoto = (photoUri: string) => {
        setPhotos((prevPhotos) => {
            const updatedPhotos = [...prevPhotos]; // Cria uma cópia do estado atual
            updatedPhotos[editingPhoto] = { ...updatedPhotos[editingPhoto], uri: photoUri }; // Atualiza o item específico
            return updatedPhotos; // Retorna o novo estado
        });
        closeCamera(); // Fecha a câmera após tirar a foto
    };

    if (isCameraOpen) {
        return <View style={{ flex: 1 }}>
            <Camera setPhoto={addPhoto} />
        </View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro do seguro!</Text>

            {/* <TouchableOpacity
                style={styles.button}
                onPress={openCamera} // Abre a câmera
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>Abrir Câmera</Text>
            </TouchableOpacity> */}

            <View style={styles.photoList}>
                {photos.map((photo, index) => (
                    <View key={index}>
                        <Text>{photo.title}</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => openCamera(index)}
                        >

                            {
                                photo.uri && <Image key={index} source={{ uri: photo.uri }} style={styles.photo} />
                            }
                            {
                                !photo.uri && <Text>Adicionar</Text>
                            }
                        </TouchableOpacity>


                    </View>
                ))}
            </View>
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    photo: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 8,
    },
});