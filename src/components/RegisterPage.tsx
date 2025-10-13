import React, { useContext, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, Button, KeyboardAvoidingView,
  Platform, ActivityIndicator, TextInputProps, TouchableOpacity, Modal
} from 'react-native';
import { CreateAccountContext } from '../contexts/CreateAccountContext';
import MaskInput from 'react-native-mask-input';
import { Picker } from '@react-native-picker/picker';
import Colors from '@/constants/Colors';
import { isValidCEP, isValidCPF, isValidCNH } from '@/utils/formatters';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAuth } from '@/hooks/useAuth';
import { saveSecure } from '@/utils/secure-store';
import { useRouter } from 'expo-router';

const theme = Colors.light

const useCreateAccount = () => {
  const context = useContext(CreateAccountContext);
  if (!context) throw new Error('useCreateAccount must be used within a CreateAccountProvider');
  return context;
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (<View style={styles.card}><Text style={styles.cardTitle}>{title}</Text>{children}</View>);
interface FormFieldProps extends TextInputProps { label: string; hasError?: boolean; }
const FormField = ({ label, hasError, ...props }: FormFieldProps) => (<View style={styles.inputContainer}><Text style={styles.label}>{label}</Text><TextInput style={[styles.input, hasError && styles.inputError]} placeholderTextColor="#999" {...props} /></View>);

export default function RegistrationForm() {
  const { setAuthenticated } = useAuth()
  const [modalVisible, setModalVisible] = useState(false);
  const { accountData, updateAccountData, updateAddress, submitRegistration, errors, setErrors } = useCreateAccount();
  const [loading, setLoading] = useState(false);
  const [isDatePickerBirthdateVisible, setDatePickerBirthdateVisible] = useState(false);
  const [isDatePickerFirstCNHEmissionVisible, setDatePickerFirstCNHEmissionVisible] = useState(false);
  const ufs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  const router = useRouter()

  const validateFields = (): boolean => {
    const newErrors: { [key: string]: boolean } = {};
    if (!accountData.name) newErrors.name = true;
    if (!accountData.email) newErrors.email = true;
    if (!accountData.password) newErrors.password = true;
    if (!accountData.CPF) newErrors.CPF = true;
    if (accountData.CPF) {
      const plainCPF = accountData.CPF.replace(/\D/g, '');
      if (plainCPF.length !== 11) newErrors.CPF = true;
      if (!isValidCPF(plainCPF)) newErrors.CPF = true;
    }
    if (!accountData.CNH) newErrors.CNH = true;
    if (!accountData.CHH_emission_date) newErrors.CHH_emission_date = true;
    if (!accountData.address.CEP) newErrors.CEP = true;
    if (!accountData.address.street) newErrors.street = true;
    if (!accountData.address.number) newErrors.number = true;
    if (!accountData.address.neighborhood) newErrors.neighborhood = true;
    if (!accountData.address.city) newErrors.city = true;
    if (!accountData.address.state || accountData.address.state === "Selecione um Estado") newErrors.state = true;
    if (!accountData.phone.number) newErrors.phone = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = async () => {
    if (!validateFields()) {
      alert("Por favor, preencha todos os campos obrigatórios destacados em vermelho.");
      return;
    }
    setLoading(true);
    const response = await submitRegistration();
    saveSecure('accessToken', response.accessToken)
    saveSecure('refreshToken', response.refreshToken)
    setAuthenticated()

    router.replace('/(app)/(tabs)')

    setLoading(false);
  };

  return (
    <>
      <Card title="Dados Pessoais">
        {/* campos de dados pessoais */}
        <FormField label="Nome Completo" value={accountData.name} onChangeText={(text) => updateAccountData('name', text)} hasError={errors.name} placeholder="Digite seu nome completo" />
        <FormField label="Email" value={accountData.email} onChangeText={(text) => updateAccountData('email', text)} hasError={errors.email} placeholder="seu.email@exemplo.com" keyboardType="email-address" autoCapitalize="none" />
        <FormField label="Senha" value={accountData.password} onChangeText={(text) => updateAccountData('password', text)} hasError={errors.password} placeholder="Crie uma senha segura" secureTextEntry />

        <View>
          <Text style={styles.label}>Telefone</Text>
          <MaskInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={accountData.phone.number}
            onChangeText={(masked, unmasked) => {
              updateAccountData('phone', { ...accountData.phone, number: masked });
            }}
            mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholder="(XX) XXXXX-XXXX"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>
        <View>
          <Text style={styles.label}>Data de Nascimento</Text>
          <TouchableOpacity onPress={() => setDatePickerBirthdateVisible(true)} style={[styles.input, { justifyContent: 'center' }]}>
            <Text>{accountData.birthDate ? (accountData.birthDate instanceof Date ? accountData.birthDate.toLocaleDateString() : String(accountData.birthDate)) : 'Selecione a data'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerBirthdateVisible}
            mode="date"
            maximumDate={new Date()}
            onConfirm={(date: Date) => {
              setDatePickerBirthdateVisible(false);
              updateAccountData('birthDate', date);
            }}
            onCancel={() => setDatePickerBirthdateVisible(false)}
          />
        </View>
      </Card>

      <Card title="Documentos">
        {/* campos de documentos */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CPF</Text>
          <MaskInput
            style={[styles.input, errors.CPF && styles.inputError]}
            value={accountData.CPF}
            onChangeText={(masked, unmasked) => {
              updateAccountData('CPF', masked);
            }}
            mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
            placeholder="000.000.000-00"
            placeholderTextColor="#999"
            keyboardType="numeric"
            onBlur={() => {
              const plain = (accountData.CPF || '').replace(/\D/g, '');
              const isValid = isValidCPF(plain);
              setErrors((prev) => ({ ...prev, CPF: !isValid }));
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CNH</Text>
          <MaskInput
            style={[styles.input, errors.CNH && styles.inputError]}
            value={accountData.CNH}
            onChangeText={(masked, unmasked) => {
              updateAccountData('CNH', masked);
            }}
            // mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
            // placeholder="000.000.000-00"
            placeholderTextColor="#999"
            keyboardType="numeric"
            onBlur={() => {
              const plain = (accountData.CNH || '').replace(/\D/g, '');
              // const isValid = isValidCNH(plain);
              // setErrors((prev) => ({ ...prev, CNH: !isValid }));
            }}
          />
        </View>
        <View>
          <Text style={styles.label}>Data de Emissão da Primeira CNH</Text>
          <TouchableOpacity onPress={() => setDatePickerFirstCNHEmissionVisible(true)} style={[styles.input, { justifyContent: 'center' }]}>
            <Text>{accountData.CHH_emission_date ? (accountData.CHH_emission_date instanceof Date ? accountData.CHH_emission_date.toLocaleDateString() : String(accountData.CHH_emission_date)) : 'Selecione a data'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerFirstCNHEmissionVisible}
            mode="date"
            maximumDate={new Date()}
            onConfirm={(date: Date) => {
              setDatePickerFirstCNHEmissionVisible(false);
              updateAccountData('CHH_emission_date', date);
            }}
            onCancel={() => setDatePickerFirstCNHEmissionVisible(false)}
          />
        </View>
        {/* <DateTimePickerModal
                                isVisible={isDatePickerBirthdateVisible}
                                mode="date"
                                value={accountData.CHH_emission_date}
                                maximumDate={new Date()}
                                onConfirm={(date: Date) => {
                                    setDatePickerBirthdateVisible(false);
                                    updateAccountData('CHH_emission_date', date);
                                }}
                                onCancel={() => setDatePickerBirthdateVisible(false)}
                            /> */}
        {/* <FormField label="Data de Emissão da CNH" value={accountData.CHH_emission_date} onChangeText={(text) => updateAccountData('CHH_emission_date', text)} hasError={errors.CHH_emission_date} placeholder="DD/MM/AAAA" keyboardType="numeric" /> */}
      </Card>

      <Card title="Endereço">
        {/* campos de endereço */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CEP</Text>
          <MaskInput
            style={[styles.input, errors.CEP && styles.inputError]}
            value={accountData.address.CEP}
            onChangeText={(masked, unmasked) => {
              updateAddress('CEP', masked);
            }}
            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
            placeholder="00000-000"
            placeholderTextColor="#999"
            keyboardType="numeric"
            onBlur={async () => {
              const plain = (accountData.address.CEP || '').replace(/\D/g, '');
              const isValid = isValidCEP(plain);
              const response = await fetch(`https://viacep.com.br/ws/${plain}/json/`);
              const data = await response.json();
              if (!data.erro) {
                updateAddress('street', data.logradouro || '');
                updateAddress('neighborhood', data.bairro || '');
                updateAddress('city', data.localidade || '');
                updateAddress('state', data.uf || '');
                setErrors((prev) => ({
                  ...prev,
                  street: !data.logradouro,
                  neighborhood: !data.bairro,
                  city: !data.localidade,
                  state: !data.uf,
                }));
              } else {
                alert("CEP não encontrado.");
                updateAddress('street', '');
                updateAddress('neighborhood', '');
                updateAddress('city', '');
                updateAddress('state', '');
              }
              setErrors((prev) => ({ ...prev, CEP: !isValid }));
            }}
          />
        </View>
        <FormField label="Rua / Logradouro" value={accountData.address.street} onChangeText={(text) => updateAddress('street', text)} hasError={errors.street} placeholder="Ex: Av. Brasil" />
        <FormField label="Número" value={accountData.address.number} onChangeText={(text) => updateAddress('number', text)} hasError={errors.number} placeholder="123" keyboardType="numeric" />
        <FormField label="Complemento (Opcional)" value={accountData.address.complement || ''} onChangeText={(text) => updateAddress('complement', text)} placeholder="Apto, Bloco, etc." />
        <FormField label="Bairro" value={accountData.address.neighborhood} onChangeText={(text) => updateAddress('neighborhood', text)} hasError={errors.neighborhood} placeholder="Centro" />
        <FormField label="Cidade" value={accountData.address.city} onChangeText={(text) => updateAddress('city', text)} hasError={errors.city} placeholder="Ex: São Paulo" />
        <Text style={styles.label}>Estado</Text>
        <TouchableOpacity
          style={[styles.pickerDisplay, errors.state && styles.inputError]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.pickerDisplayText}>
            {accountData.address.state || "Selecione um Estado"}
          </Text>
          <Text style={styles.pickerIcon}>▼</Text>
        </TouchableOpacity>
      </Card>

      <TouchableOpacity style={[styles.primaryButton, loading && styles.buttonDisabled]} onPress={handleRegistration} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Finalizar Cadastro</Text>}
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          <Picker selectedValue={accountData.address.state} itemStyle={styles.contentPicker} onValueChange={(itemValue) => updateAddress('state', itemValue)}>
            <Picker.Item label="Selecione um Estado" value="" />
            {ufs.map((uf) => (
              <Picker.Item key={uf} label={uf} value={uf} />
            ))}
          </Picker>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#F0F4F7',
    paddingTop: 50,
  },
  container: {
    paddingBottom: 40,
  },

  headerTitle: {
    color: '#1E1E1E',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 20,
    // Sombra (iOS e Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
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
    backgroundColor: '#F8F9FA',
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 1,
    color: '#333',
    fontSize: 16,
    height: 50,
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: 'red',
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
    marginBottom: 15,
    paddingHorizontal: 15,
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
    fontSize: 30,

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
  contentPicker: {
    color: '#000',
    fontSize: 20,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: theme.tint || '#0A84FF',
    paddingVertical: 14,
    marginHorizontal: 14,
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
});