import Colors from "@/constants/Colors";
import { CreateUserSocialTokenDecode, useLogin } from "@/contexts/LoginContext";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
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



const theme = Colors.light
export default function SocialRegisterPage() {
    const [isCreatingAccount, setisCreatingAccount] = useState(false);
    const { user, initialData, changeUserProperty, handleRegisterSocialLogin } = useLogin();
    const router = useRouter()
    const { setAuthenticated } = useAuth()

    const [modalVisible, setModalVisible] = useState(false);
    const [isDatePickerBirthdateVisible, setDatePickerBirthdateVisible] = useState(false);
    const [isDatePickerCnhEmissionVisible, setDatePickerCnhEmissionVisible] = useState(false);

    const ufs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

    async function handleCreateAccount() {
        setisCreatingAccount(true);

        // Validações dos campos obrigatórios
        if (!user?.nome?.trim()) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Nome é obrigatório.");
            return;
        }

        if (!user?.email?.trim()) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Email é obrigatório.");
            return;
        }

        if (!user?.passwordHash?.trim()) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Senha é obrigatória.");
            return;
        }

        if (!user?.phone?.trim()) {
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
            setisCreatingAccount(false);
            Alert.alert("Erro", "CPF é obrigatório e deve ser válido.");
            return;
        }

        if (!user?.cnh?.trim()) {
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
            setisCreatingAccount(false);
            Alert.alert("Erro", "CEP é obrigatório e deve ser válido.");
            return;
        }

        if (!user?.street?.trim()) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Rua/Logradouro é obrigatório.");
            return;
        }

        if (!user?.number?.trim()) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Número é obrigatório.");
            return;
        }

        if (!user?.neighborhood?.trim()) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Bairro é obrigatório.");
            return;
        }

        if (!user?.city?.trim()) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Cidade é obrigatória.");
            return;
        }

        if (!user?.state?.trim()) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Estado é obrigatório.");
            return;
        }

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
                    <Text style={styles.title}>Cadastro de usuário</Text>
                    <Text style={styles.subtitle}>Complete suas informações para finalizar seu cadastro</Text>

                    {/* Dados Pessoais */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            placeholderTextColor="#999"
                            value={user?.nome}
                            onChangeText={(value) => changeUserProperty('nome', value)}
                            editable={!isCreatingAccount}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={user?.email}
                            onChangeText={(value) => changeUserProperty('email', value)}
                            editable={!isCreatingAccount}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={user?.passwordHash}
                            onChangeText={(value) => changeUserProperty('passwordHash', value)}
                            editable={!isCreatingAccount}
                        />
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Telefone</Text>
                            <MaskInput
                                style={styles.input}
                                value={user?.phone || ''}
                                onChangeText={(masked) => changeUserProperty('phone', masked)}
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
                                style={styles.input}
                                value={user?.cpf || ''}
                                onChangeText={(masked) => changeUserProperty('cpf', masked)}
                                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                placeholder="000.000.000-00"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>CNH</Text>
                            <MaskInput
                                style={styles.input}
                                value={user?.cnh || ''}
                                onChangeText={(masked) => changeUserProperty('cnh', masked)}
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
                                style={styles.input}
                                value={user?.cep || ''}
                                onChangeText={(masked) => changeUserProperty('cep', masked)}
                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                                placeholder="00000-000"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Rua / Logradouro"
                            placeholderTextColor="#999"
                            value={user?.street || ''}
                            onChangeText={(value) => changeUserProperty('street', value)}
                        />
                        <TextInput
                            style={styles.input}
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
                            style={styles.input}
                            placeholder="Bairro"
                            placeholderTextColor="#999"
                            value={user?.neighborhood || ''}
                            onChangeText={(value) => changeUserProperty('neighborhood', value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Cidade"
                            placeholderTextColor="#999"
                            value={user?.city || ''}
                            onChangeText={(value) => changeUserProperty('city', value)}
                        />
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Estado</Text>
                            <TouchableOpacity
                                style={styles.pickerDisplay}
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
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                        <Picker selectedValue={user?.state || ''} onValueChange={(itemValue) => {
                            changeUserProperty('state', itemValue || null);
                            if (itemValue) {
                                setModalVisible(false);
                            }
                        }}>
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
        alignItems: 'flex-end',
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 2,
        padding: 20,
    },
    modalButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    primaryButton: {
        backgroundColor: theme.tint || '#0A84FF',
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
        backgroundColor: theme.border || '#E0E0E0',
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
        borderColor: theme.border || '#E0E0E0',
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
        backgroundColor: Colors.light.tint || '#0A84FF',
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
});