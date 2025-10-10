import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import React, { useCallback, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import Camera from '@/components/Camera';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import { Conductor } from '@/contexts/CreateVehicleContext';
import { formatCPF, formatPhone, isValidCPF, isValidEmail } from '@/utils/formatters';

const theme = Colors.light;

function Field({ label, value, onChangeText, placeholder, keyboardType, maxLength, onBlur, error }: any) {
    return (
        <View style={styles.inputContainer}>
            <Text>{label}</Text>
            <TextInput
                style={[styles.input, error ? { borderColor: 'red' } : null]}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                keyboardType={keyboardType}
                maxLength={maxLength}
                onBlur={onBlur}
            />
            {error ? <Text style={{ color: 'red', marginTop: 6 }}>{error}</Text> : null}
        </View>
    );
}

export default function AddConductorsScreen() {
    const router = useRouter();

    const { addConductor, conductors, maxConductors } = useCreateVehicle();

    const emptyConductor: Conductor = {
        name: '',
        licenseNumber: '',
        licenseExpiry: '',
        licenseFirstEmission: 0,
        licensePhoto: '',
        relationship: '',
        phone: '',
        email: '',
        document: '',
        birthDate: new Date(),
    };

    const [conductor, setConductor] = useState<Conductor>(emptyConductor);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [cpfError, setCpfError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handleBack = useCallback(() => router.back(), [router]);

    const handleChangeInput = useCallback((name: keyof Conductor, value: string | number | Date) => {
        setConductor(prev => {
            const next = { ...prev } as any;

            if (name === 'licenseFirstEmission' || name === 'licenseNumber' || name === 'licenseExpiry') {
                if (typeof value === 'string') {
                    const numericValue = value.replace(/\D/g, '');
                    next[name] = parseInt(numericValue, 10) || 0;
                } else if (typeof value === 'number') {
                    next[name] = value;
                }
                return next;
            }

            if (name === 'document' && typeof value === 'string') {
                next[name] = formatCPF(value);
                setCpfError(null);
                return next;
            }

            if (name === 'email' && typeof value === 'string') {
                next[name] = value;
                setEmailError(null);
                return next;
            }

            if (name === 'birthDate') {
                const date = value instanceof Date ? value : new Date(String(value));
                if (!isNaN(date.getTime())) next[name] = date;
                return next;
            }

            next[name] = value as any;
            return next;
        });
    }, []);

    const handleAddConductor = useCallback(() => {
        if (conductors.length >= maxConductors) {
            Alert.alert('Limite atingido', `Você pode adicionar no máximo ${maxConductors} condutores adicionais.`);
            return;
        }

        if (!conductor.name.trim()) {
            Alert.alert('Erro', 'Nome do condutor é obrigatório.');
            return;
        }

        if (!isValidCPF(conductor.document)) {
            Alert.alert('Erro', 'CPF inválido.');
            return;
        }

        if (!isValidEmail(conductor.email)) {
            Alert.alert('Erro', 'Email inválido.');
            return;
        }

        // if(!conductor.document || !conductor.email || !conductor.name) {
        //     Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
        //     return;
        // }

        addConductor(conductor);
        Alert.alert('Sucesso', `Condutor adicionado! Total de condutores: ${conductors.length + 1}`);
        setConductor(emptyConductor);
    }, [addConductor, conductor, conductors.length]);

    const handleRedirect = useCallback(() => {
        router.push('/(app)/(tabs)/my-cars/create/resume');
    }, [router]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Adicionar condutores</Text>
            <Text>Você pode adicionar até 3 condutores adicionais para este veículo.</Text>

            <Text>Condutores adicionados: {conductors.length}</Text>

            <View style={styles.formContainer}>
                <Field label="Nome" value={conductor.name} onChangeText={(text: string) => handleChangeInput('name', text)} placeholder="Nome completo" />
                <Field label="CPF" value={conductor.document} onChangeText={(text: string) => handleChangeInput('document', formatCPF(text))} placeholder="000.000.000-00" keyboardType="numeric" maxLength={14} onBlur={() => {
                    const plain = (conductor.document || '').replace(/\D/g, '');
                    if (!isValidCPF(plain)) setCpfError('CPF inválido');
                }} error={cpfError} />
                <Field label="Email" value={conductor.email} onChangeText={(text: string) => handleChangeInput('email', text)} placeholder="email@exemplo.com" keyboardType="email-address" onBlur={() => {
                    if (conductor.email && !isValidEmail(conductor.email)) {
                        setEmailError('Email inválido');
                    }
                }} error={emailError} />
                <Field label="Telefone" value={conductor.phone} onChangeText={(text: string) => handleChangeInput('phone', formatPhone(text))} placeholder="(00) 90000-0000" keyboardType="phone-pad" />
                <Field label="Relacionamento" value={conductor.relationship} onChangeText={(text: string) => handleChangeInput('relationship', text)} placeholder="Ex: Cônjuge" />
                <Field label="Número da CNH" value={conductor.licenseNumber} onChangeText={(text: string) => handleChangeInput('licenseNumber', text)} placeholder="Número da CNH" maxLength={11} />
                <Field label="Emissão da primeira CNH (ano)" value={String(conductor.licenseFirstEmission || '')} onChangeText={(text: string) => handleChangeInput('licenseFirstEmission', text)} placeholder="Ex: 2023" maxLength={4} />
                <Field label="Validade da CNH" value={conductor.licenseExpiry} onChangeText={(text: string) => handleChangeInput('licenseExpiry', text)} placeholder="DD/MM/AAAA" />
                {/* Foto da CNH: preview + escolha de câmera/galeria */}
                <View style={styles.inputContainer}>
                    <Text>Foto da CNH</Text>
                    {conductor.licensePhoto ? (
                        <Image source={{ uri: conductor.licensePhoto }} style={styles.photo} />
                    ) : (
                        <View style={[styles.imageButton, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Text>Nenhuma foto</Text>
                        </View>
                    )}
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                        <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 8 }]} onPress={async () => {
                            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                            if (status !== 'granted') {
                                Alert.alert('Permissão necessária', 'Permita acesso à galeria para selecionar uma foto.');
                                return;
                            }
                            const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
                            if (!result.canceled) {
                                const uri = (result.assets && result.assets[0] && result.assets[0].uri) || (result as any).uri;
                                setConductor(prev => ({ ...prev, licensePhoto: uri }));
                            }
                        }}>
                            <Text style={styles.buttonText}>Galeria</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={() => setIsCameraOpen(true)}>
                            <Text style={styles.buttonText}>Abrir câmera</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {isCameraOpen && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <Camera setPhoto={(uri: string) => {
                            setConductor(prev => ({ ...prev, licensePhoto: uri }));
                            setIsCameraOpen(false);
                        }} closeCamera={() => setIsCameraOpen(false)} />
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <Text>Data de Nascimento</Text>
                    <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={[styles.input, { justifyContent: 'center' }]}>
                        <Text>{conductor.birthDate ? conductor.birthDate.toLocaleDateString() : 'Selecione a data'}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        maximumDate={new Date()}
                        onConfirm={(date: Date) => {
                            setDatePickerVisible(false);
                            handleChangeInput('birthDate', date);
                        }}
                        onCancel={() => setDatePickerVisible(false)}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.button, { marginTop: 20 }]}
                onPress={handleAddConductor}
            >
                <Text style={styles.buttonText}>Adicionar condutor</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleBack}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={handleRedirect} disabled={false}>
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