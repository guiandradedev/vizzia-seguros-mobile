import Colors from "@/constants/Colors";
import { CreateUserSocialTokenDecode, useLogin } from "@/contexts/LoginContext";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Modal } from "react-native";
import axios, { AxiosResponse } from "axios";
import { axiosNoAuth } from "@/lib/axios";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Tokens } from "@/types/auth";
import { saveSecure } from "@/utils/secure-store";
import { decodeJWT } from "@/utils/jwt";
import MaskInput from 'react-native-mask-input';
import { Picker } from '@react-native-picker/picker';
import { isValidCEP, isValidCPF, isValidCNH } from '@/utils/formatters';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function SocialRegisterPage() {
    const [isCreatingAccount, setisCreatingAccount] = useState(false);
    const { user, initialData, changeUserProperty, updateAddressFields, handleRegisterSocialLogin } = useLogin();
    const router = useRouter()
    const { setAuthenticated } = useAuth()

    const [modalVisible, setModalVisible] = useState(false);
    const [isDatePickerBirthdateVisible, setDatePickerBirthdateVisible] = useState(false);
    const [isDatePickerCnhEmissionVisible, setDatePickerCnhEmissionVisible] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    // Debug: monitorar mudanças no user
    useEffect(() => {
        console.log('User state changed in component:', user);
        console.log('Street value:', user?.street);
        console.log('City value:', user?.city);
        console.log('State value:', user?.state);
    }, [user]);

    const ufs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

    async function handleCreateAccount() {
        setisCreatingAccount(true);

        // Validações dos campos obrigatórios
        const newErrors: Record<string, boolean> = {};

        if (!user?.nome?.trim()) {
            newErrors.nome = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "Nome é obrigatório.");
            return;
        }

        if (!user?.email?.trim()) {
            newErrors.email = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "Email é obrigatório.");
            return;
        }

        if (!user?.passwordHash?.trim()) {
            newErrors.passwordHash = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "Senha é obrigatória.");
            return;
        }

        if (!user?.phone?.trim()) {
            newErrors.phone = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "Telefone é obrigatório.");
            return;
        }

        if (!user?.birthDate) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Data de nascimento é obrigatória.");
            return;
        }

        if (!user?.cpf?.trim() || !isValidCPF(user.cpf)) {
            newErrors.cpf = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "CPF é obrigatório e deve ser válido.");
            return;
        }

        if (!user?.cnh?.trim()) {
            newErrors.cnh = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "CNH é obrigatória e deve ser válida.");
            return;
        }

        if (!user?.cnhEmissionDate) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Data de emissão da CNH é obrigatória.");
            return;
        }

        if (!user?.cep?.trim() || !isValidCEP(user.cep)) {
            newErrors.CEP = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "CEP é obrigatório e deve ser válido.");
            return;
        }

        if (!user?.street?.trim()) {
            newErrors.street = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "Rua/Logradouro é obrigatório.");
            return;
        }

        if (!user?.number?.trim()) {
            newErrors.number = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "Número é obrigatório.");
            return;
        }

        if (!user?.neighborhood?.trim()) {
            newErrors.neighborhood = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "Bairro é obrigatório.");
            return;
        }

        if (!user?.city?.trim()) {
            newErrors.city = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "Cidade é obrigatório.");
            return;
        }

        if (!user?.state?.trim()) {
            newErrors.state = true;
            setisCreatingAccount(false);
            Alert.alert("Erro", "Estado é obrigatório.");
            return;
        }

        setErrors(newErrors);

        const result = await handleRegisterSocialLogin()
        if (!result) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Erro ao criar conta. Tente novamente.");
            return;
        }

        setAuthenticated()
        router.replace('/(app)/(tabs)');
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.headerContent}>
                            {/* <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()} // Ação para voltar
                            >
                                <Text style={styles.backButtonText}>‹</Text>
                            </TouchableOpacity> */}
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>Crie sua Conta</Text>
                                <Text style={styles.subtitle}>Complete suas informações para finalizar seu cadastro</Text>
                            </View>
                        </View>
                    </View>
                    {/* <Text style={styles.title}>Cadastro de usuário</Text>
                    <Text style={styles.subtitle}>Complete suas informações para finalizar seu cadastro</Text> */}

                    {/* Dados Pessoais */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
                        <TextInput
                            style={[styles.input, errors.nome && styles.inputError]}
                            placeholder="Nome"
                            placeholderTextColor="#999"
                            value={user?.nome}
                            onChangeText={(value) => {
                                changeUserProperty('nome', value);
                                setErrors(prev => ({ ...prev, nome: !value?.trim() }));
                            }}
                            editable={!isCreatingAccount}
                        />
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={user?.email}
                            onChangeText={(value) => {
                                changeUserProperty('email', value);
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                setErrors(prev => ({ ...prev, email: !emailRegex.test(value) }));
                            }}
                            editable={!isCreatingAccount}
                        />
                        <TextInput
                            style={[styles.input, errors.passwordHash && styles.inputError]}
                            placeholder="Senha"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={user?.passwordHash}
                            onChangeText={(value) => {
                                changeUserProperty('passwordHash', value);
                                setErrors(prev => ({ ...prev, passwordHash: value.length < 6 }));
                            }}
                            editable={!isCreatingAccount}
                        />
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Telefone</Text>
                            <MaskInput
                                style={[styles.input, errors.phone && styles.inputError]}
                                value={user?.phone || ''}
                                onChangeText={(masked) => {
                                    changeUserProperty('phone', masked);
                                    const plainPhone = masked.replace(/\D/g, '');
                                    setErrors(prev => ({ ...prev, phone: plainPhone.length < 10 }));
                                }}
                                mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                placeholder="(XX) XXXXX-XXXX"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Data de Nascimento</Text>
                            <TouchableOpacity onPress={() => setDatePickerBirthdateVisible(true)} style={styles.input}>
                                <Text>{user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'Selecione a data'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Documentos */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Documentos</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>CPF</Text>
                            <MaskInput
                                style={[styles.input, errors.cpf && styles.inputError]}
                                value={user?.cpf || ''}
                                onChangeText={(masked) => {
                                    changeUserProperty('cpf', masked);
                                    // Validar CPF em tempo real
                                    const plainCPF = masked.replace(/\D/g, '');
                                    if (plainCPF.length === 11) {
                                        setErrors(prev => ({ ...prev, cpf: !isValidCPF(masked) }));
                                    }
                                }}
                                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                placeholder="000.000.000-00"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>CNH</Text>
                            <MaskInput
                                style={[styles.input, errors.cnh && styles.inputError]}
                                value={user?.cnh || ''}
                                onChangeText={(masked) => {
                                    changeUserProperty('cnh', masked);
                                    // Validar CNH em tempo real
                                    const plainCNH = masked.replace(/\D/g, '');
                                    if (plainCNH.length >= 9) {
                                        setErrors(prev => ({ ...prev, cnh: !isValidCNH(masked) }));
                                    }
                                }}
                                placeholder="Número da CNH"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Data de Emissão da Primeira CNH</Text>
                            <TouchableOpacity onPress={() => setDatePickerCnhEmissionVisible(true)} style={styles.input}>
                                <Text>{user?.cnhEmissionDate ? new Date(user.cnhEmissionDate).toLocaleDateString() : 'Selecione a data'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Endereço */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Endereço</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>CEP</Text>
                            <MaskInput
                                style={[styles.input, errors.CEP && styles.inputError]}
                                value={user?.cep || ''}
                                onChangeText={(masked, unmasked) => {
                                    changeUserProperty('cep', masked);
                                }}
                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                                placeholder="00000-000"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                onBlur={async () => {
                                    // Usar o valor atual do campo CEP (já mascarado)
                                    const currentCep = user?.cep || '';
                                    const plain = currentCep.replace(/\D/g, '');

                                    // Validar CEP
                                    const isValid = isValidCEP(plain);
                                    console.log('CEP válido:', isValid);
                                    setErrors((prev) => ({ ...prev, CEP: !isValid }));

                                    if (plain.length === 8) {
                                        try {
                                            const response = await fetch(`https://viacep.com.br/ws/${plain}/json/`);
                                            const data = await response.json();
                                            console.log('ViaCEP raw response:', data);
                                            console.log('ViaCEP data.logradouro:', data.logradouro);
                                            console.log('ViaCEP data.bairro:', data.bairro);
                                            console.log('ViaCEP data.localidade:', data.localidade);
                                            console.log('ViaCEP data.uf:', data.uf);

                                            if (!data.erro) {
                                                console.log('Atualizando todos os campos de endereço de uma vez...');

                                                // Atualizar todos os campos de endereço de uma vez
                                                updateAddressFields({
                                                    street: data.logradouro,
                                                    neighborhood: data.bairro,
                                                    city: data.localidade,
                                                    state: data.uf
                                                });

                                                console.log('Campos que serão definidos:', {
                                                    street: data.logradouro,
                                                    neighborhood: data.bairro,
                                                    city: data.localidade,
                                                    state: data.uf
                                                });

                                                // Limpar erros dos campos preenchidos automaticamente
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    street: false,
                                                    neighborhood: false,
                                                    city: false,
                                                    state: false,
                                                }));
                                            } else {
                                                console.log('CEP não encontrado');
                                                alert("CEP não encontrado.");
                                                // Limpar campos quando CEP não é encontrado
                                                updateAddressFields({
                                                    street: '',
                                                    neighborhood: '',
                                                    city: '',
                                                    state: ''
                                                });
                                            }
                                        } catch (error) {
                                            console.error('Erro ao buscar CEP:', error);
                                            alert("Erro ao buscar CEP. Tente novamente.");
                                        }
                                    } else {
                                        console.log('CEP não tem 8 dígitos:', plain.length);
                                    }
                                }}
                            />
                        </View>

                        <TextInput
                            style={[styles.input, errors.street && styles.inputError]}
                            placeholder="Rua / Logradouro"
                            placeholderTextColor="#999"
                            value={user?.street || ''}
                            onChangeText={(value) => changeUserProperty('street', value)}
                        />
                        <TextInput
                            style={[styles.input, errors.number && styles.inputError]}
                            placeholder="Número"
                            placeholderTextColor="#999"
                            value={user?.number || ''}
                            onChangeText={(value) => changeUserProperty('number', value)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Complemento (Opcional)"
                            placeholderTextColor="#999"
                            value={user?.complement || ''}
                            onChangeText={(value) => changeUserProperty('complement', value)}
                        />
                        <TextInput
                            style={[styles.input, errors.neighborhood && styles.inputError]}
                            placeholder="Bairro"
                            placeholderTextColor="#999"
                            value={user?.neighborhood || ''}
                            onChangeText={(value) => changeUserProperty('neighborhood', value)}
                        />
                        <TextInput
                            style={[styles.input, errors.city && styles.inputError]}
                            placeholder="Cidade"
                            placeholderTextColor="#999"
                            value={user?.city || ''}
                            onChangeText={(value) => changeUserProperty('city', value)}
                        />
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Estado</Text>
                            <TouchableOpacity
                                style={[styles.pickerDisplay, errors.state && styles.inputError]}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.pickerDisplayText}>
                                    {user?.state && user.state.trim() !== '' ? user.state : "Selecione um Estado"}
                                </Text>
                                <Text style={styles.pickerIcon}>▼</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.primaryButton, isCreatingAccount && styles.buttonDisabled]} onPress={handleCreateAccount}>
                        {isCreatingAccount ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Finalizar Cadastro</Text>}
                    </TouchableOpacity>
                </View>

                {/* Date Pickers */}
                <DateTimePickerModal
                    isVisible={isDatePickerBirthdateVisible}
                    mode="date"
                    maximumDate={new Date()}
                    onConfirm={(date) => {
                        setDatePickerBirthdateVisible(false);
                        changeUserProperty('birthDate', date);
                    }}
                    onCancel={() => setDatePickerBirthdateVisible(false)}
                />
                <DateTimePickerModal
                    isVisible={isDatePickerCnhEmissionVisible}
                    mode="date"
                    maximumDate={new Date()}
                    onConfirm={(date) => {
                        setDatePickerCnhEmissionVisible(false);
                        changeUserProperty('cnhEmissionDate', date);
                    }}
                    onCancel={() => setDatePickerCnhEmissionVisible(false)}
                />

                {/* Modal for State Picker */}
                <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                    <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Selecione o Estado</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                        <Picker
                            selectedValue={user?.state || ''}
                            onValueChange={(itemValue) => {
                                changeUserProperty('state', itemValue || '');
                                if (itemValue) {
                                    setModalVisible(false);
                                }
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item label="Selecione um Estado" value="" />
                            {ufs.map((uf) => (
                                <Picker.Item key={uf} label={uf} value={uf} />
                            ))}
                        </Picker>
                    </View>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    card: {
        padding: 10,
        width: '100%',
        maxWidth: 420,
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 18,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
        justifyContent: 'center',
    },
    inputError: {
        borderColor: '#FF3B30',
        borderWidth: 2,
    },
    pickerDisplay: {
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderColor: '#E0E0E0',
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    pickerDisplayText: {
        color: '#333',
        fontSize: 16,
    },
    pickerIcon: {
        color: '#666',
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 275,
    },
    modalHeader: {
        alignItems: 'center',
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 2,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    modalButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    picker: {
        flex: 1,
        paddingHorizontal: 20,
    },
    primaryButton: {
        backgroundColor: Colors.tint || '#0A84FF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    // Estilos antigos que podem não ser usados, mas mantidos para compatibilidade
    secondaryButton: {
        marginTop: 12,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 14,
    },
    ghostButton: {
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        fontSize: 14,
        color: '#444',
        flexDirection: 'row',
    },
    ghostButtonText: {
        color: '#444',
        fontSize: 14,
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    link: {
        marginTop: 15,
        color: '#007AFF',
        textAlign: 'center',
        fontSize: 14,
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 18,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border || '#E0E0E0',
    },
    separatorText: {
        marginHorizontal: 12,
        fontSize: 13,
        color: '#8F9BB3',
        textTransform: 'lowercase',
        fontWeight: '600',
    },
    buttonColumn: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
    socialButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.border || '#E0E0E0',
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        marginBottom: 12,
    },
    socialIcon: {
        marginRight: 8,
    },
    socialText: {
        color: '#222',
        fontSize: 14,
        fontWeight: '600',
    },
    biometricButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.tint || '#0A84FF',
        paddingVertical: 12,
        borderRadius: 10,
    },
    biometricIcon: {
        marginRight: 8,
    },
    biometricText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    backButtonText: {
        fontSize: 32,
        color: '#333',
        fontWeight: 'bold',
    },
    cardHeader: {
        flex: 1,
        marginBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
    },
});