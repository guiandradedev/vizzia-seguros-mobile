import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import Camera from '@/components/Camera';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import PhotoButton from '@/components/PhotoButton';
import VehiclePhoto from '@/components/VehiclePhoto'; // ✅ componente novo
import { commonStyles } from '@/styles/CommonStyles'
import FormRow from '@/components/FormRow';
import FormField from '@/components/FormField';

const theme = Colors.light;

export default function CreateVehicleScreen() {
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
        closeCamera();
        await new Promise(resolve => setTimeout(resolve, 500));
        changeInitialCarPhoto(photoUri);

        const data = {
            model: "Onix LTZ",
            brand: "Chevrolet",
            year: 2024,
            color: "Preto",
            plate: "ABC1D23",
            odomether: 15000
        };
        setVehicle({ ...vehicle, ...data });
    }

    if (isCameraOpen) {
        return <View style={{ flex: 1 }}>
            <Camera setPhoto={addPhoto} closeCamera={closeCamera} />
        </View>;
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // ajusta o deslocamento
        >
        <View style={ commonStyles.container }>
            <ScrollView contentContainerStyle={[commonStyles.scrollContent, { flexGrow: 1 }]} 
            keyboardShouldPersistTaps="handled">
                
                <Text style={[commonStyles.title, {marginBottom: 10}]}>Dados do veículo</Text>

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

                        {/* Campos em duas colunas */}
                        <View style={commonStyles.formContainer}>
                            <FormRow>
                                <FormField
                                    label="Modelo"
                                    value={vehicle.model || 'Onix LTZ'}
                                    onChangeText={text => setVehicle({ ...vehicle, model: text })}
                                    placeholder="Modelo"
                                />

                                <FormField
                                    label="Marca"
                                    value={vehicle.brand || 'Chevrolet'}
                                    onChangeText={(text) => setVehicle({ ...vehicle, brand: text })}
                                    placeholder="Marca"
                                />
                            </FormRow>

                            <FormRow>
                                <FormField
                                    label="Ano"
                                    value={(vehicle.year || 2024).toString()}
                                    onChangeText={(text) => setVehicle({ ...vehicle, year: parseInt(text) || 0 })}
                                    placeholder="Ano"
                                />

                                <FormField
                                    label="Cor"
                                    value={vehicle.color || 'Preto'}
                                    onChangeText={(text) => setVehicle({ ...vehicle, color: text})}
                                    placeholder="Cor"
                                />
                            </FormRow>

                            <FormRow>
                                <FormField
                                    label="Placa"
                                    value={vehicle.plate || 'ABC1D23'}
                                    onChangeText={(text) => setVehicle({ ...vehicle, plate: text })}
                                    placeholder="Placa"
                                />

                                <FormField
                                    label="Odômetro"
                                    value={(vehicle.odomether || 1500).toString()}
                                    onChangeText={(text) => setVehicle({ ...vehicle, odomether: parseInt(text)})}
                                    placeholder="Odômetro"
                                />
                            </FormRow>
                        </View>

                        <Text style={commonStyles.subtitle}>
                            Se algum dado estiver incorreto, você pode editar.
                        </Text>
                    </View>
                )}

                <View style={[commonStyles.footer, {alignItems:"center"}]}>
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

        </KeyboardAvoidingView>
    );
}