import FormField from "@/components/FormField";
import FormRow from "@/components/FormRow";
import ModalSheet from "@/components/ModalSheet";
import PhotoButton from "@/components/PhotoButton";
import Camera from "@/components/Camera";
import Colors from '@/constants/Colors';
import { Conductor } from '@/contexts/CreateVehicleContext';
import { Insurance } from "@/types/auth";
import api from '../../../lib/axios';
import { commonStyles } from '@/styles/CommonStyles';
import axios, { AxiosResponse } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const relationshipOptions = [
    { label: 'Pai', value: 'Father' },
    { label: 'Mãe', value: 'Mother' },
    { label: 'Filho(a)', value: 'Child' },
    { label: 'Cônjuge', value: 'Spouse' },
    { label: 'Irmão(ã)', value: 'Sibling' },
    { label: 'Outro', value: 'Other' }
] as const;

const maritalStatusOptions = [
    { label: 'Solteiro(a)', value: 'Single' },
    { label: 'Casado(a)', value: 'Married' },
    { label: 'Divorciado(a)', value: 'Divorced' },
    { label: 'Viúvo(a)', value: 'Widow' },
    { label: 'União Estável', value: 'CivilUnion' }
] as const;

const genderOptions = [
    { label: 'Masculino', value: 'Male' },
    { label: 'Feminino', value: 'Female' },
    { label: 'Outro', value: 'Other' }
] as const;

type RelationshipOption = typeof relationshipOptions[number];
type MaritalStatusOption = typeof maritalStatusOptions[number];
type GenderOption = typeof genderOptions[number];

type RelationshipType = RelationshipOption['value'];
type MaritalStatusType = MaritalStatusOption['value'];
type GenderType = GenderOption['value'];

export default function AddConductorPage() {
    const { id } = useLocalSearchParams() as { id?: string };
    const [vehicle, setVehicle] = useState<Insurance | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Form state
    const [conductor, setConductor] = useState<Partial<Conductor>>({
        name: '',
        licenseNumber: '',
        relationship: '',
        phone: '',
        email: '',
        document: '',
        marital_status: '',
        gender: '',
        licenseExpiry: null,
        licenseFirstEmission: null,
        birthDate: null,
    });

    // Photo states
    const [licensePhoto, setLicensePhoto] = useState<string>('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // Modal states
    const [relationshipModalVisible, setRelationshipModalVisible] = useState(false);
    const [selectedRelationship, setSelectedRelationship] = useState<RelationshipType | null>(null);
    const [maritalStatusModalVisible, setMaritalStatusModalVisible] = useState(false);
    const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<MaritalStatusType | null>(null);
    const [genderModalVisible, setGenderModalVisible] = useState(false);
    const [selectedGender, setSelectedGender] = useState<GenderType | null>(null);

    // Validation states
    const [nameError, setNameError] = useState<string | null>(null);
    const [licenseNumberError, setLicenseNumberError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [documentError, setDocumentError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (!id) return;
            try {
                const res: AxiosResponse<Insurance> = await api.get(`/insurance/${id}`);
                setVehicle(res.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    console.log('Erro ao buscar veículo:', err.response?.data);
                } else {
                    console.log('Erro desconhecido:', err);
                }
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    const validateName = (name: string) => {
        if (!name || name.trim().length < 2) {
            setNameError('Nome deve ter pelo menos 2 caracteres');
            return false;
        }
        setNameError(null);
        return true;
    };

    const validateLicenseNumber = (license: string) => {
        const licenseRegex = /^[0-9]{11}$/;
        if (!license || !licenseRegex.test(license.replace(/\D/g, ''))) {
            setLicenseNumberError('CNH deve ter 11 dígitos');
            return false;
        }
        setLicenseNumberError(null);
        return true;
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
        if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
            setPhoneError('Telefone inválido');
            return false;
        }
        setPhoneError(null);
        return true;
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError('E-mail inválido');
            return false;
        }
        setEmailError(null);
        return true;
    };

    const validateDocument = (document: string) => {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
        const cleanDocument = document.replace(/\D/g, '');
        if (!document || !cpfRegex.test(cleanDocument)) {
            setDocumentError('CPF inválido');
            return false;
        }
        setDocumentError(null);
        return true;
    };

    const getRelationshipLabel = (value: string | undefined) => {
        const option = relationshipOptions.find(opt => opt.value === value);
        return option ? option.label : '';
    };

    const getMaritalStatusLabel = (value: string | undefined) => {
        const option = maritalStatusOptions.find(opt => opt.value === value);
        return option ? option.label : '';
    };

    const getGenderLabel = (value: string | undefined) => {
        const option = genderOptions.find(opt => opt.value === value);
        return option ? option.label : '';
    };

    const formatCPF = (value: string) => {
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length <= 11) {
            return cleanValue
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return cleanValue;
    };

    const formatPhone = (value: string) => {
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length <= 11) {
            return cleanValue
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
        }
        return cleanValue;
    };

    const openCamera = useCallback(() => setIsCameraOpen(true), []);
    const closeCamera = useCallback(() => setIsCameraOpen(false), []);

    const addLicensePhoto = useCallback(async (photoUri: string) => {
        setLicensePhoto(photoUri);
        setConductor(prev => ({ ...prev, licensePhoto: photoUri }));
        closeCamera();
    }, [closeCamera]);

    const handleSubmit = async () => {
        const isNameValid = validateName(conductor.name || '');
        const isLicenseValid = validateLicenseNumber(conductor.licenseNumber || '');
        const isPhoneValid = validatePhone(conductor.phone || '');
        const isEmailValid = validateEmail(conductor.email || '');
        const isDocumentValid = validateDocument(conductor.document || '');

        if (!isNameValid || !isLicenseValid || !isPhoneValid || !isEmailValid || !isDocumentValid) {
            Alert.alert('Erro', 'Por favor, corrija os campos inválidos');
            return;
        }

        if (!conductor.relationship) {
            Alert.alert('Erro', 'Por favor, selecione o grau de parentesco');
            return;
        }

        try {
            const conductorData = {
                ...conductor,
                vehicleId: id,
            };

            // await api.post('/conductors', conductorData);

            Alert.alert(
                'Sucesso',
                'Condutor adicionado com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Erro ao adicionar condutor:', error);
            Alert.alert('Erro', 'Não foi possível adicionar o condutor. Tente novamente.');
        }
    };

    const canSubmit = conductor.name && conductor.licenseNumber && conductor.relationship &&
                     conductor.phone && conductor.email && conductor.document && licensePhoto;

    if (isCameraOpen) {
        return <View style={{ flex: 1 }}>
            <Camera setPhoto={addLicensePhoto} closeCamera={closeCamera} />
        </View>;
    }

    if (loading) {
        return (
            <View style={[commonStyles.container, styles.center]}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    if (!vehicle) {
        return (
            <View style={[commonStyles.container, styles.center]}>
                <Text>Veículo não encontrado</Text>
            </View>
        );
    }

    return (
        <View style={[styles.safeArea, { backgroundColor: Colors.background }]}>
            <View style={commonStyles.container}>
                <ScrollView contentContainerStyle={[commonStyles.scrollContent, { flexGrow: 1 }]}
                    keyboardShouldPersistTaps="handled">

                    <Text style={[commonStyles.title, { marginBottom: 10 }]}>Adicionar Condutor</Text>
                    <Text style={commonStyles.text}>
                        Adicione um condutor adicional para o veículo {vehicle.vehicle?.plate}
                    </Text>

                    <View style={commonStyles.formContainer}>
                        <FormRow>
                            <FormField
                                label="Nome Completo"
                                value={conductor.name}
                                onChangeText={(text: string) => {
                                    setConductor({ ...conductor, name: text });
                                    if (nameError) validateName(text);
                                }}
                                error={nameError}
                                placeholder="Nome completo"
                                autoCapitalize="words"
                            />
                        </FormRow>

                        <FormRow>
                            <FormField
                                label="Número da CNH"
                                value={conductor.licenseNumber}
                                onChangeText={(text: string) => {
                                    const cleanValue = text.replace(/\D/g, '');
                                    setConductor({ ...conductor, licenseNumber: cleanValue });
                                    if (licenseNumberError) validateLicenseNumber(cleanValue);
                                }}
                                error={licenseNumberError}
                                placeholder="00000000000"
                                keyboardType="numeric"
                                maxLength={11}
                            />
                        </FormRow>

                        {/* Photo section */}
                        <Text style={commonStyles.sectionTitle}>Foto da CNH</Text>
                        <Text style={commonStyles.text}>
                            Tire uma foto da Carteira Nacional de Habilitação do condutor.
                        </Text>
                        <PhotoButton
                            photoUri={licensePhoto}
                            title="Adicionar foto da CNH"
                            onPress={openCamera}
                        />

                        <FormRow>
                            <View style={styles.pickerWrapper}>
                                <Text style={styles.pickerLabel}>Grau de Parentesco</Text>
                                <TouchableOpacity
                                    style={styles.pickerTrigger}
                                    onPress={() => {
                                        setSelectedRelationship(conductor.relationship as RelationshipType || null);
                                        setRelationshipModalVisible(true);
                                    }}
                                >
                                    <Text style={[styles.pickerTriggerText, { color: conductor.relationship ? '#000' : '#888' }]}>
                                        {conductor.relationship ? getRelationshipLabel(conductor.relationship) : 'Selecione'}
                                    </Text>
                                    <Text style={styles.pickerTriggerIcon}>
                                        <FontAwesome name="chevron-down" size={16} color="#000" />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </FormRow>

                        <FormRow>
                            <FormField
                                label="Telefone"
                                value={conductor.phone}
                                onChangeText={(text: string) => {
                                    const formatted = formatPhone(text);
                                    setConductor({ ...conductor, phone: formatted });
                                    if (phoneError) validatePhone(formatted);
                                }}
                                error={phoneError}
                                placeholder="(00) 00000-0000"
                                keyboardType="phone-pad"
                            />
                            <FormField
                                label="E-mail"
                                value={conductor.email}
                                onChangeText={(text: string) => {
                                    setConductor({ ...conductor, email: text });
                                    if (emailError) validateEmail(text);
                                }}
                                error={emailError}
                                placeholder="email@exemplo.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </FormRow>

                        <FormRow>
                            <FormField
                                label="CPF"
                                value={conductor.document}
                                onChangeText={(text: string) => {
                                    const formatted = formatCPF(text);
                                    setConductor({ ...conductor, document: formatted });
                                    if (documentError) validateDocument(formatted);
                                }}
                                error={documentError}
                                placeholder="000.000.000-00"
                            />
                        </FormRow>

                        <FormRow>
                            <View style={styles.pickerWrapper}>
                                <Text style={styles.pickerLabel}>Estado Civil</Text>
                                <TouchableOpacity
                                    style={styles.pickerTrigger}
                                    onPress={() => {
                                        setSelectedMaritalStatus(conductor.marital_status as MaritalStatusType || null);
                                        setMaritalStatusModalVisible(true);
                                    }}
                                >
                                    <Text style={[styles.pickerTriggerText, { color: conductor.marital_status ? '#000' : '#888' }]}>
                                        {conductor.marital_status ? getMaritalStatusLabel(conductor.marital_status) : 'Selecione'}
                                    </Text>
                                    <Text style={styles.pickerTriggerIcon}>
                                        <FontAwesome name="chevron-down" size={16} color="#000" />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.pickerWrapper}>
                                <Text style={styles.pickerLabel}>Gênero</Text>
                                <TouchableOpacity
                                    style={styles.pickerTrigger}
                                    onPress={() => {
                                        setSelectedGender(conductor.gender as GenderType || null);
                                        setGenderModalVisible(true);
                                    }}
                                >
                                    <Text style={[styles.pickerTriggerText, { color: conductor.gender ? '#000' : '#888' }]}>
                                        {conductor.gender ? getGenderLabel(conductor.gender) : 'Selecione'}
                                    </Text>
                                    <Text style={styles.pickerTriggerIcon}>
                                        <FontAwesome name="chevron-down" size={16} color="#000" />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </FormRow>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.backButton]}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.backButtonText}>Voltar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={!canSubmit}
                        >
                            <Text style={styles.submitButtonText}>Adicionar Condutor</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {/* Modals */}
            <ModalSheet
                visible={relationshipModalVisible}
                onClose={() => setRelationshipModalVisible(false)}
                onConfirm={() => {
                    if (selectedRelationship) {
                        setConductor({ ...conductor, relationship: selectedRelationship });
                    }
                }}
                title="Grau de Parentesco"
            >
                <ScrollView style={styles.optionsList}>
                    {relationshipOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[styles.optionItem, selectedRelationship === option.value && styles.optionItemSelected]}
                            onPress={() => setSelectedRelationship(option.value)}
                        >
                            <Text style={[styles.optionText, selectedRelationship === option.value && styles.optionTextSelected]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ModalSheet>

            <ModalSheet
                visible={maritalStatusModalVisible}
                onClose={() => setMaritalStatusModalVisible(false)}
                onConfirm={() => {
                    if (selectedMaritalStatus) {
                        setConductor({ ...conductor, marital_status: selectedMaritalStatus });
                    }
                }}
                title="Estado Civil"
            >
                <ScrollView style={styles.optionsList}>
                    {maritalStatusOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[styles.optionItem, selectedMaritalStatus === option.value && styles.optionItemSelected]}
                            onPress={() => setSelectedMaritalStatus(option.value)}
                        >
                            <Text style={[styles.optionText, selectedMaritalStatus === option.value && styles.optionTextSelected]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ModalSheet>

            <ModalSheet
                visible={genderModalVisible}
                onClose={() => setGenderModalVisible(false)}
                onConfirm={() => {
                    if (selectedGender) {
                        setConductor({ ...conductor, gender: selectedGender });
                    }
                }}
                title="Gênero"
            >
                <ScrollView style={styles.optionsList}>
                    {genderOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[styles.optionItem, selectedGender === option.value && styles.optionItemSelected]}
                            onPress={() => setSelectedGender(option.value)}
                        >
                            <Text style={[styles.optionText, selectedGender === option.value && styles.optionTextSelected]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ModalSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerWrapper: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 14,
        marginBottom: 5,
        color: '#555',
        fontWeight: '600',
    },
    pickerTrigger: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 12,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 48,
    },
    pickerTriggerIcon: {
        fontSize: 12,
        color: '#000',
    },
    pickerTriggerText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
        flexWrap: 'wrap'
    },
    optionsList: {
        maxHeight: 260,
    },
    optionItem: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff'
    },
    optionText: {
        fontSize: 16,
        color: '#111'
    },
    optionItemSelected: {
        backgroundColor: '#e8f0ff'
    },
    optionTextSelected: {
        fontWeight: '700',
        color: '#0a3d8f'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 15,
    },
    backButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    submitButton: {
        flex: 2,
        backgroundColor: Colors.tint,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});