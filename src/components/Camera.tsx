import { View, Text, TouchableOpacity, StyleSheet, Image, Button, ActivityIndicator, Platform } from 'react-native';
import { CameraCapturedPicture, CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface CameraProps {
    setPhoto: (photo_uri: string) => void,
    title?: string,
    closeCamera: () => void
}

export default function Camera({ setPhoto, title, closeCamera }: CameraProps) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<FlashMode>('auto');
    const cameraRef = useRef<CameraView | null>(null); // Referência para a câmera
    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraReady, setIsCameraReady] = useState(false); // Estado para verificar se a câmera está pronta
    const theme = Colors.light;

    //     const [selectedLens, setSelectedLens] = useState<Lens | undefined>(
    //     Platform.OS === 'ios' ? Lens.UltraWide : undefined // Exemplo: começar com UltraWide no iOS
    // );
    
    // const cameraProps = Platform.select({
    //     ios: {
    //         // Se for iOS, inclui a prop selectedLens
    //         selectedLens: selectedLens,
    //     },
    //     android: {
    //         // Se for Android, não inclui a prop (ou inclui props específicas do Android se necessário)
    //         // Aqui, o objeto está vazio, ou seja, nenhuma prop 'selectedLens' é passada.
    //     },
    //     default: {},
    // });
    // console.log(cameraRef.current?.getAvailableLensesAsync())

    if (!permission) {
        return <View />
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }


    // Tirar foto
    const takePhoto = async () => {
        if (cameraRef.current) {
            const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync();

            setPhoto(photo.uri);
        }
    };

    function toggleCameraFlash() {
        setFlash((current) => {
            if (current === 'auto') return 'on';
            if (current === 'on') return 'off';
            return 'auto';
        });
        console.log(flash)
    }


    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }
    return (
    <View style={styles.container}>
        {/* Contêiner para alinhar o botão de retorno e o texto absoluto */}
        <View style={styles.headerContainer}>
            <TouchableOpacity
                style={styles.returnButton}
                onPress={closeCamera}
            >
                <FontAwesome size={32} name="backward" color={"#fff"} />
            </TouchableOpacity>
            {title && <Text style={styles.textAbsolute}>{title}</Text>}
        </View>

        {!isCameraReady && (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6D94C5" />
                <Text style={styles.loadingText}>Carregando câmera...</Text>
            </View>
        )}

        <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            onCameraReady={() => setIsCameraReady(true)}
            flash={flash}
        />

        {isCameraReady && (
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={toggleCameraFacing}>
                    <FontAwesome size={32} name="refresh" color={"#fff"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto}>
                    <FontAwesome size={32} name="camera" color={"#fff"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCameraFlash}>
                    <FontAwesome size={32} name="bolt" color={"#fff"} />
                </TouchableOpacity>
            </View>
        )}
    </View>
);
}

const styles = StyleSheet.create({
        container: {
        flex: 1,
    },
    headerContainer: {
        position: 'absolute',
        top: 30, // Ajuste a altura para uma posição confortável
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Espaça o botão e o texto
        paddingHorizontal: 20, // Espaçamento lateral
        zIndex: 2, // Garante que fique acima da câmera
    },
    returnButton: {
        padding: 10, // Área clicável maior
    },
    textAbsolute: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 64,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '100%',
        justifyContent: "space-between",
        paddingHorizontal: 64,
    },
    camera: {
        flex: 1,
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
    cameraContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
        zIndex: 1,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: 'white',
    },
});