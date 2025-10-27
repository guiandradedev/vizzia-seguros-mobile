import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import FormField from '@/components/FormField';
import Colors from '@/constants/Colors';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import api from '@/lib/axios';
import { commonStyles } from '@/styles/CommonStyles';
import axios from 'axios';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { formatCPF, formatPhone, isValidCPF } from '@/utils/formatters';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function ResumeConductors() {
    const router = useRouter();
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const { vehicle, conductors, removeConductor, updateConductor } = useCreateVehicle()

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedConductor, setEditedConductor] = useState<any>(null);
    const [isEditBirthPickerVisible, setEditBirthPickerVisible] = useState(false);
    const [isEditExpiryPickerVisible, setEditExpiryPickerVisible] = useState(false);
    const [isEditIssuePickerVisible, setEditIssuePickerVisible] = useState(false);

    function handleBack() {
        router.back();
    }

    function handleRemove(index: number) {
        Alert.alert('Remover condutor', 'Tem certeza que deseja remover este condutor?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Remover', style: 'destructive', onPress: () => removeConductor(index) }
        ]);
    }

    function handleEdit(index: number) {
        const c = conductors[index];
        setEditingIndex(index);
        // clone conductor to local state
        setEditedConductor({ ...c });
        setEditModalVisible(true);
    }

    function saveEdit() {
        if (editingIndex === null || !editedConductor) return;
        // basic validation
        // Validate CPF
        if (!editedConductor.name || !editedConductor.document) {
            Alert.alert('Erro', 'Nome e CPF são obrigatórios.');
            return;
        }
        if (!isValidCPF(String(editedConductor.document))) {
            Alert.alert('Erro', 'CPF inválido.');
            return;
        }

        // Validate phone (digits only, min 11)
        const phoneDigits = String(editedConductor.phone || '').replace(/\D/g, '');
        if (!phoneDigits || phoneDigits.length < 11) {
            Alert.alert('Erro', 'Telefone inválido. Informe DDD + número (min. 11 dígitos).');
            return;
        }

        // Validate CNH (numeric, min length 11)
        const cnhDigits = String(editedConductor.licenseNumber || '').replace(/\D/g, '');
        if (!cnhDigits || cnhDigits.length < 11) {
            Alert.alert('Erro', 'Número da CNH inválido. Informe os dígitos (mín. 11).');
            return;
        }

        // Ensure formatted values are saved
        const toSave = { ...editedConductor, document: formatCPF(String(editedConductor.document)), phone: formatPhone(String(editedConductor.phone)), licenseNumber: cnhDigits } as any;
        updateConductor(editingIndex, toSave);
        setEditModalVisible(false);
        setEditedConductor(null);
        setEditingIndex(null);
    }

    async function handleRedirect() {
        // Salvar na API os condutores extra
        try {
            
            const payloadConductors = conductors.map(conductor => {
                const cnhExpiryISO = conductor.licenseExpiry instanceof Date && !isNaN(conductor.licenseExpiry.getTime()) ? conductor.licenseExpiry.toISOString() : null;
                const cnhIssueISO = conductor.licenseFirstEmission instanceof Date && !isNaN(conductor.licenseFirstEmission.getTime()) ? conductor.licenseFirstEmission.toISOString() : null;

                // phone: strip non-digits. API expects number string with at least 11 digits
                const phoneDigits = (conductor.phone || '').toString().replace(/\D/g, '');

                return {
                    name: conductor.name,
                    email: conductor.email,
                    cpf: conductor.document,
                    phone_number: phoneDigits,
                    // default phone type to 'pessoal' if caller didn't set one
                    type: 'pessoal',
                    cnhNumber: conductor.licenseNumber,
                    cnhExpiryDate: cnhExpiryISO,
                    relationship: conductor.relationship,
                    cnhIssueDate: cnhIssueISO,
                    birthDate: conductor.birthDate instanceof Date ? conductor.birthDate.toISOString() : null,
                    // license_photo: conductor.licensePhoto,
                };
            });

            const response = await api.post(`/vehicle/conductors`, {
                id_vehicle: vehicle.id,
                conductors: payloadConductors
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            console.log(response.data);
            router.push('/(app)/(tabs)/my-cars/create/take-photos');
        } catch(err) {
            console.log('Erro ao salvar condutores adicionais:', err);
            if(axios.isAxiosError(err)) {
                console.log('Erro na resposta da API:', err.response?.data);
            }
            Alert.alert('Erro', 'Houve um problema ao salvar os condutores adicionais. Por favor, tente novamente.');
        }

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
                {/* Edit modal */}
                <Modal visible={editModalVisible} animationType="slide" transparent={true}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
                        <View style={{ margin: 20, backgroundColor: '#fff', borderRadius: 8, padding: 16, maxHeight: '90%' }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Editar Condutor</Text>
                            {editedConductor && (
                                <ScrollView>
                                    <FormRow>
                                        <FormField label="Nome" value={editedConductor.name} onChangeText={(text: string) => setEditedConductor((p: any) => ({ ...p, name: text }))} />
                                    </FormRow>
                                    <FormRow>
                                        <FormField label="Email" value={editedConductor.email} onChangeText={(text: string) => setEditedConductor((p: any) => ({ ...p, email: text }))} keyboardType="email-address" />
                                    </FormRow>
                                    <FormRow>
                                        <FormField label="CPF" value={editedConductor.document} onChangeText={(text: string) => setEditedConductor((p: any) => ({ ...p, document: formatCPF(text) }))} keyboardType="numeric" />
                                        <FormField label="Telefone" value={editedConductor.phone} onChangeText={(text: string) => setEditedConductor((p: any) => ({ ...p, phone: formatPhone(text) }))} keyboardType="phone-pad" />
                                    </FormRow>
                                    <FormRow>
                                        <FormField label="CNH" value={editedConductor.licenseNumber} onChangeText={(text: string) => setEditedConductor((p: any) => ({ ...p, licenseNumber: text.replace(/\D/g, '') }))} keyboardType="numeric" maxLength={11} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={commonStyles.label}>Validade da CNH</Text>
                                            <TouchableOpacity style={[commonStyles.input]} onPress={() => setEditExpiryPickerVisible(true)}>
                                                <Text>{editedConductor.licenseExpiry ? (editedConductor.licenseExpiry as Date).toLocaleDateString() : 'Selecione a data'}</Text>
                                            </TouchableOpacity>
                                            <DateTimePickerModal isVisible={isEditExpiryPickerVisible} mode="date" maximumDate={new Date()} onConfirm={(date) => { setEditExpiryPickerVisible(false); setEditedConductor((p: any) => ({ ...p, licenseExpiry: date })); }} onCancel={() => setEditExpiryPickerVisible(false)} />
                                        </View>
                                    </FormRow>

                                    <FormRow>
                                        <FormField label="Relacionamento" value={editedConductor.relationship} onChangeText={text => setEditedConductor((p: any) => ({ ...p, relationship: text }))} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={commonStyles.label}>Data de Nascimento</Text>
                                            <TouchableOpacity style={[commonStyles.input]} onPress={() => setEditBirthPickerVisible(true)}>
                                                <Text>{editedConductor.birthDate ? (editedConductor.birthDate as Date).toLocaleDateString() : 'Selecione a data'}</Text>
                                            </TouchableOpacity>
                                            <DateTimePickerModal isVisible={isEditBirthPickerVisible} mode="date" maximumDate={new Date()} onConfirm={(date) => { setEditBirthPickerVisible(false); setEditedConductor((p: any) => ({ ...p, birthDate: date })); }} onCancel={() => setEditBirthPickerVisible(false)} />
                                        </View>
                                    </FormRow>

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                                        <Button title="Cancelar" variant="outline" onPress={() => { setEditModalVisible(false); setEditedConductor(null); setEditingIndex(null); }} />
                                        <Button title="Salvar" variant="primary" onPress={saveEdit} />
                                    </View>
                                </ScrollView>
                            )}
                        </View>
                    </View>
                </Modal>
                <Text style={commonStyles.title}>Resumo do cadastro!</Text>

                <Text style={commonStyles.subtitle}>Quase lá! Revise as informações de condutores adicionais antes de finalizar o cadastro.</Text>
                <View>
                    <Text style={commonStyles.sectionTitle}>Condutores adicionais:</Text>
                    {
                        conductors.length === 0 && (
                            <Text>Nenhum condutor adicional adicionado.</Text>
                        )
                    }
                    {
                        conductors.length > 0 && conductors.map((conductor, index) => (
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
                                        <Text style={commonStyles.input}>{conductor.licenseExpiry ? (conductor.licenseExpiry as Date).toLocaleDateString() : ''}</Text>
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
                                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity onPress={() => handleEdit(index)} style={[commonStyles.buttonSmall, { alignItems: 'center' }]}>
                                            <Text style={commonStyles.buttonText}>Editar</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity onPress={() => handleRemove(index)} style={[commonStyles.buttonSmall, { backgroundColor: '#ffdddd', alignItems: 'center' }]}>
                                            <Text style={[commonStyles.buttonText, { color: '#a00' }]}>Remover</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={commonStyles.label}>Foto da CNH:</Text>
                                <View style={{ alignItems: 'center', marginBottom: 30 }} >
                                    <Image source={{ uri: conductor.licensePhoto }} style={[styles.photo, { width: '80%' }]} />
                                </View>
                            </View>
                        ))
                    }
                </View>


                <View style={commonStyles.footer}>
                    <View style={commonStyles.footerRow}>
                        <Button onPress={handleBack} title="Voltar" variant="outline" />
                        <Button onPress={handleRedirect} title="Finalizar" variant="primary" />
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