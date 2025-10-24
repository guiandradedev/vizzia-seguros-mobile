import Camera from '@/components/Camera';
import PhotoButton from '@/components/PhotoButton';
import VehiclePhoto from '@/components/VehiclePhoto'; // ✅ componente novo
import Colors from '@/constants/Colors';
import { carBrands } from '@/contexts/CreateVehicleContext';
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

    // consider vehicle detected when any of the key fields from IA are present
    const isVehicleDetected = !!(vehicle.brand || vehicle.plate || vehicle.color || vehicle.model);

    useEffect(() => {
        // strict validation: all required fields must be present and valid
        const modelValid = typeof vehicle.model === 'string' && vehicle.model.trim().length > 0;
        const brandValid = typeof vehicle.brand === 'number' && vehicle.brand > 0;
        const yearValid = typeof vehicle.year === 'number' && !isNaN(vehicle.year) && vehicle.year > 1900;
        const colorValid = typeof vehicle.color === 'string' && vehicle.color.trim().length > 0;
        const plateValid = typeof vehicle.plate === 'string' && vehicle.plate.trim().length > 0;
        const odometherValid = typeof vehicle.odomether === 'number' && !isNaN(vehicle.odomether);
        const fuelValid = !!vehicle.fuel;
        const usageValid = !!vehicle.usage;

        const ok = modelValid && brandValid && yearValid && colorValid && plateValid && odometherValid && fuelValid && usageValid;
        setCanRedirect(ok);
    }, [vehicle]);

    const openCamera = () => setIsCameraOpen(true);
    const closeCamera = () => setIsCameraOpen(false);

    const handleRedirect = () => {
        if (!canRedirect) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios antes de continuar.');
            return;
        }
        router.push('/(app)/(tabs)/my-cars/create/resume-vehicle');
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
            const { brand, color, plate } = response.data;
            // try to map brand name returned by IA to our brand codes
            const foundBrand = carBrands.find(b => b.name.toLowerCase() === (brand.name || '').toLowerCase());
            const brandCode = foundBrand ? foundBrand.code : (vehicle.brand || 0);
            const data = {
                model: "",
                brand: brandCode,
                year: 2025,
                color: color.text,
                plate: plate.text,
                odomether: 0
            };
            setVehicle({ ...vehicle, ...data });
            console.log(response.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Erro ao enviar imagem para IA axios statusssr:", error);
                if(error.response?.status === 400) {
                    Alert.alert("Erro", error.response.data.error || "Imagem inválida. Por favor, tente novamente com uma imagem clara do veículo.");
                    return;
                }
                if(error.response?.status === 422) {
                    Alert.alert("Erro", error.response.data.error || "Imagem inválida. Por favor, tente novamente com uma imagem clara do veículo.");
                    return;
                }
                console.error("Erro ao enviar imagem para IA axios:", error.response?.data);
            } else {
                Alert.alert("Erro", "Não foi possível obter os dados do veículo a partir da imagem. Por favor, tente novamente.");
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

                    {(!photo || !isVehicleDetected) && (
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

                    {photo && isVehicleDetected && (
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