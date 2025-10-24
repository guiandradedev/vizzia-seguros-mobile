import Camera from '@/components/Camera';
import PhotoButton from '@/components/PhotoButton';
import VehiclePhoto from '@/components/VehiclePhoto'; // ✅ componente novo
import Colors from '@/constants/Colors';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import { axiosIA } from '@/lib/axios';
import { commonStyles } from '@/styles/CommonStyles';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VehicleDetailsForm from './components/VehicleDetailsForm';

export default function CreateVehiclePage() {
    const { vehicle, setVehicle, changeInitialCarPhoto, initialCarPhoto } = useCreateVehicle();
    const router = useRouter();
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [canRedirect, setCanRedirect] = useState(false);
    const [photo, setPhoto] = useState<string>(initialCarPhoto);

    useEffect(() => {
        setCanRedirect(!!(vehicle.model && vehicle.brand && vehicle.year && vehicle.color && vehicle.plate && vehicle.odomether));
    }, [vehicle]);

    const openCamera = () => setIsCameraOpen(true);
    const closeCamera = () => setIsCameraOpen(false);

    const handleRedirect = () => {
        router.push('/(app)/(tabs)/my-cars/create/take-photos');
    };

    async function addPhoto(photoUri: string) {
        setPhoto(photoUri);
        await new Promise(resolve => setTimeout(resolve, 500));
        changeInitialCarPhoto(photoUri);
        closeCamera();

        const formData = new FormData();
        formData.append('file', {
            uri: photoUri,
            name: 'vehicle_photo.jpg',
            type: 'image/jpeg'
        } as any);
        try {
            console.log("Enviando imagem para IA...")
            const response = await axiosIA.post('/process_image', formData, {
                headers: {
                    'Content-Type': undefined, // força o axios a definir o correto
                    Accept: 'application/json',
                },
                transformRequest: (data, headers) => {
                    delete headers['Content-Type']; // remove o default herdado
                    return data;
                },
            });
            const { brand, color, plate} = response.data
            const data = {
                model: "",
                brand: brand.name,
                // year: 2024/,
                color: color.text,
                plate: plate.text,
                // odomether: 15000
            };
            setVehicle({ ...vehicle, ...data });
            console.log(response.data)
        } catch (error) {
            Alert.alert("Erro", "Não foi possível obter os dados do veículo a partir da imagem. Por favor, preencha os dados manualmente.");
            if (axios.isAxiosError(error)) {
                console.error("Erro ao enviar imagem para IA axios:", error.response?.data);
            } else {
                console.error("Erro ao enviar imagem para IA:", error);
            }
        }
    }

    if (isCameraOpen) {
        return <View style={{ flex: 1 }}>
            <Camera setPhoto={addPhoto} closeCamera={closeCamera} />
        </View>;
    }

    return (
        <View
            style={[
                styles.safeArea,
                { backgroundColor: Colors.background }
            ]}
        >
            <View style={commonStyles.container}>
                <ScrollView contentContainerStyle={[commonStyles.scrollContent, { flexGrow: 1 }]}
                    keyboardShouldPersistTaps="handled">

                    <Text style={[commonStyles.title, { marginBottom: 10 }]}>Dados do veículo</Text>

                    {!photo && (
                        <>
                            <Text style={commonStyles.text}>Para começar, tire uma foto do carro.</Text>
                            <Text style={commonStyles.subtitle}>A foto deve ser de boa qualidade de frente, mostrando a placa e os detalhes do veículo.</Text>

                            <PhotoButton
                                photoUri={photo}
                                title="Adicionar foto"
                                onPress={openCamera}
                            />
                        </>
                    )}

                    {photo && (
                        <View style={commonStyles.formContainer}>
                            {/*  VehiclePhoto */}
                            <Text style={commonStyles.sectionTitle}>Foto</Text>
                            <VehiclePhoto photoUri={photo} onEdit={openCamera} />

                            <Text style={commonStyles.sectionTitle}>Confirme os dados</Text>

                            <VehicleDetailsForm />

                            <Text style={commonStyles.subtitle}>
                                Observação: Alguns dados são obtidos por meio de Inteligência Artificial e pode ser necessário atualizar alguns campos.
                            </Text>
                        </View>
                    )}

                    <View style={[commonStyles.footer, { alignItems: "center" }]}>
                        <TouchableOpacity
                            style={[commonStyles.button, !canRedirect && commonStyles.backButton]}
                            onPress={handleRedirect}
                            disabled={!canRedirect}
                        >
                            <Text style={commonStyles.buttonText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});