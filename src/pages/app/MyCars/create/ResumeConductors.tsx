import FormRow from '@/components/FormRow';
import Colors from '@/constants/Colors';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import { commonStyles } from '@/styles/CommonStyles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResumeConductors() {
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
        <View
            style={[
                styles.safeArea,
                { backgroundColor: Colors.background }
            ]}
        >
            <ScrollView contentContainerStyle={[commonStyles.scrollContent, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={commonStyles.title}>Resumo do cadastro!</Text>

                <Text style={commonStyles.subtitle}>Quase lá! Revise as informações do veículo antes de finalizar o cadastro.</Text>
                <View>

                    <Text style={commonStyles.sectionTitle}>
                        Informações do veículo
                    </Text>

                    <View style={[commonStyles.formContainer, { paddingLeft: 20, paddingRight: 20 }]}>
                        <FormRow>
                            <View style={{ flex: 1 }}>
                                <Text style={commonStyles.label}>Modelo:</Text>
                                <Text style={commonStyles.input}>{vehicle.model}</Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={commonStyles.label}>Marca:</Text>
                                <Text style={commonStyles.input}>{vehicle.brand}</Text>
                            </View>

                        </FormRow>

                        <FormRow>
                            <View style={{ flex: 1 }}>
                                <Text style={commonStyles.label}>Ano:</Text>
                                <Text style={commonStyles.input}>{vehicle.year}</Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={commonStyles.label}>Cor:</Text>
                                <Text style={commonStyles.input}>{vehicle.color}</Text>
                            </View>

                        </FormRow>

                        <FormRow>
                            <View style={{ flex: 1 }}>
                                <Text style={commonStyles.label}>Placa:</Text>
                                <Text style={commonStyles.input}>{vehicle.plate}</Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={commonStyles.label}>Odômetro:</Text>
                                <Text style={commonStyles.input}>{vehicle.odomether}</Text>
                            </View>

                        </FormRow>


                    </View>
                </View>
                <View>
                    <Text style={commonStyles.label}>Foto principal:</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={{ uri: initialCarPhoto }} style={[styles.photo, { width: '80%' }]} />
                    </View>
                    {
                        vehiclePhotos.map((photo, index) => (
                            <View key={index} >
                                <Text style={commonStyles.label}>
                                    {photo.title}:
                                </Text>

                                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                                    {photo.uri ? (
                                        <Image source={{ uri: photo.uri }} style={[styles.photo, { width: '80%' }]} />
                                    ) : (
                                        <Text>Não fornecida</Text>
                                    )}
                                </View>

                            </View>
                        ))
                    }
                </View>
                <View>
                    <Text style={commonStyles.sectionTitle}>Condutores adicionais:</Text>
                    {
                        conductors.length > 0 ? conductors.map((conductor, index) => (
                            <View key={index}>
                                <FormRow>
                                    <View style={{ flex: 1 }}>
                                        <Text style={commonStyles.label}>Nome Completo:</Text>
                                        <Text style={commonStyles.input}>{conductor.name}</Text>
                                    </View>
                                </FormRow>

                                <FormRow>
                                    <View style={{ flex: 1 }}>
                                        <Text style={commonStyles.label}>Email:</Text>
                                        <Text style={commonStyles.input}>{conductor.email}</Text>
                                    </View>
                                </FormRow>

                                <FormRow>
                                    <View style={{ flex: 1 }}>
                                        <Text style={commonStyles.label}>CPF:</Text>
                                        <Text style={commonStyles.input}>{conductor.document}</Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={commonStyles.label}>Telefone:</Text>
                                        <Text style={commonStyles.input}>{conductor.phone}</Text>
                                    </View>
                                </FormRow>

                                <FormRow>
                                    <View style={{ flex: 1 }}>
                                        <Text style={commonStyles.label}>CNH:</Text>
                                        <Text style={commonStyles.input}>{conductor.licenseNumber}</Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={commonStyles.label}>Vencimento da CNH:</Text>
                                        <Text style={commonStyles.input}>{conductor.licenseExpiry}</Text>
                                    </View>
                                </FormRow>

                                <FormRow>
                                    <View style={{ flex: 1 }}>
                                        <Text style={commonStyles.label}>Relacionamento:</Text>
                                        <Text style={commonStyles.input}>{conductor.relationship}</Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={commonStyles.label}>Data de Nascimento:</Text>
                                        <Text style={commonStyles.input}>{conductor.birthDate.toLocaleDateString()}</Text>
                                    </View>
                                </FormRow>
                                <Text style={commonStyles.label}>Foto da CNH:</Text>
                                <View style={{ alignItems: 'center', marginBottom: 30 }} >
                                    <Image source={{ uri: conductor.licensePhoto }} style={[styles.photo, { width: '80%' }]} />
                                </View>
                            </View>
                        )) : <Text>Nenhum condutor adicional adicionado.</Text>
                    }
                </View>


                <View style={commonStyles.footer}>
                    <View style={commonStyles.footerRow}>
                        <TouchableOpacity style={[commonStyles.footerButton, commonStyles.backButton]} onPress={handleBack}>
                            <Text style={commonStyles.buttonText}>Voltar</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={[commonStyles.footerButton, commonStyles.buttonSecondary]} onPress={handleSubmit}>
                            <Text style={commonStyles.buttonText}>Finalizar</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </ScrollView>
        </View>
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
        backgroundColor: Colors.tabBackground,
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


    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 15,
    },
    safeArea: {
        flex: 1,
    },
});