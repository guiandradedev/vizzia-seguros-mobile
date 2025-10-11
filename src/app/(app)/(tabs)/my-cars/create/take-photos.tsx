import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import { useRouter } from 'expo-router';
import Camera from '@/components/Camera';
import VehiclePhoto from '@/components/VehiclePhoto';
import PhotoButton from '@/components/PhotoButton';
import { commonStyles } from '@/styles/CommonStyles';

export default function MyCarsScreen() {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<number>(0);
    const { vehiclePhotos, changeVehiclePhoto } = useCreateVehicle();
    const router = useRouter();
    const [canRedirect, setCanRedirect] = useState(false);

    useEffect(() => {
        setCanRedirect(vehiclePhotos.every(photo => photo.uri));
    }, [vehiclePhotos]);

    const openCamera = (photoIndex: number) => {
        setEditingPhoto(photoIndex);
        setIsCameraOpen(true);
    };

    const closeCamera = () => {
        setEditingPhoto(0);
        setIsCameraOpen(false);
    };
    const addPhoto = (photoUri: string) => {
        changeVehiclePhoto(editingPhoto, photoUri);
        closeCamera();
    };

    const handleRedirect = () => router.push('/(app)/(tabs)/my-cars/create/conductors');
    const handleBack = () => router.back();

    if (isCameraOpen) {
        return <Camera setPhoto={addPhoto} title={vehiclePhotos[editingPhoto].title} closeCamera={closeCamera} />;
    }

    return (
        <View style={commonStyles.container}>
            <ScrollView 
                contentContainerStyle={[commonStyles.scrollContent, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={commonStyles.title}>Fotos do veículo</Text>

                <View style={styles.photoGrid}>
                    {vehiclePhotos.map((photo, index) => (
                    <View key={index} style={styles.photoWrapper}>
                        {photo.uri ? (
                        <>
                            <Text style={commonStyles.text}>{photo.title}</Text>
                            <VehiclePhoto photoUri={photo.uri} onEdit={() => openCamera(index)} />
                        </>
                        ) : (
                        <PhotoButton title={`Adicionar ${photo.title}`} onPress={() => openCamera(index)} />
                        )}
                    </View>
                    ))}
                </View>

                <View style={commonStyles.footer}>
                    <View style={commonStyles.footerRow}>
                        <TouchableOpacity style={[commonStyles.footerButton, commonStyles.backButton]} onPress={handleBack}>
                            <Text style={commonStyles.buttonText}>Voltar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[commonStyles.button, !canRedirect && commonStyles.backButton]}
                            onPress={handleRedirect}
                            disabled={!canRedirect}
                        >
                            <Text style={commonStyles.buttonText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </ScrollView>


            
        </View>
    );
}

const styles = StyleSheet.create({
  
    photoList: { paddingBottom: 20 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto' },
    buttonText: { color: 'white', fontSize: 14, fontWeight: '600' },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    photoWrapper: {
        width: '48%', // duas colunas com espaçamento
        marginBottom: 16,
    },
});
