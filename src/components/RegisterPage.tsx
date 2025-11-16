import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Modal
} from 'react-native';
import { CreateAccountContext } from '../contexts/CreateAccountContext';
import MaskInput from 'react-native-mask-input';
import { Picker } from '@react-native-picker/picker';
import Colors from '@/constants/Colors';
import { MaritalStatusOptions, MaritalStatusLabelPT, MaritalStatus, getMaritalStatusDisplayLabel } from '@/constants/maritalStatus';
import { GenderOptions, GenderLabelPT, Gender, getGenderDisplayLabel } from '@/constants/gender';
import { isValidCEP, isValidCPF, isValidCNH } from '@/utils/formatters';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAuth } from '@/hooks/useAuth';
import { saveSecure } from '@/utils/secure-store';
import { useRouter } from 'expo-router';
import Input from './Input';
import Button from './Button';

const useCreateAccount = () => {
  const context = useContext(CreateAccountContext);
  if (!context) throw new Error('useCreateAccount must be used within a CreateAccountProvider');
  return context;
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (<View style={styles.card}><Text style={styles.cardTitle}>{title}</Text>{children}</View>);

export default function RegistrationForm() {
  const { setAuthenticated } = useAuth()
  const [modalVisible, setModalVisible] = useState(false);
  const [maritalModalVisible, setMaritalModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const { accountData, updateAccountData, updateAddress, submitRegistration, errors, setErrors } = useCreateAccount();
  const [loading, setLoading] = useState(false);
  const [isDatePickerBirthdateVisible, setDatePickerBirthdateVisible] = useState(false);
  const [isDatePickerFirstCNHEmissionVisible, setDatePickerFirstCNHEmissionVisible] = useState(false);
  const [tempState, setTempState] = useState<string>('');
  const [tempMarital, setTempMarital] = useState<string>('');
  const [tempGender, setTempGender] = useState<string>('');
  const ufs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  const router = useRouter()

  const validateFields = (): boolean => {
    const newErrors: { [key: string]: boolean } = {};
    if (!accountData.name) newErrors.name = true;
    if (!accountData.email) newErrors.email = true;
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
      if (!emailRegex.test(String(accountData.email))) newErrors.email = true;
    }
    if (!accountData.password) newErrors.password = true;
    if (!accountData.CPF) newErrors.CPF = true;
    if (accountData.CPF) {
      const plainCPF = accountData.CPF.replace(/\D/g, '');
      if (plainCPF.length !== 11) newErrors.CPF = true;
      if (!isValidCPF(plainCPF)) newErrors.CPF = true;
    }
    if (!accountData.CNH) newErrors.CNH = true;
  if (!accountData.CHH_emission_date) newErrors.CHH_emission_date = true;
  // required: marital status and gender
  // ensure selected values are valid options (not the placeholder)
  if (!MaritalStatusOptions.includes(accountData.marital_status as unknown as any)) newErrors.marital_status = true;
  if (!GenderOptions.includes(accountData.gender as unknown as any)) newErrors.gender = true;
    // valida presença da data de nascimento (idade é validada no momento da seleção)
    if (!accountData.birthDate) newErrors.birthDate = true;
    if (!accountData.address.CEP) newErrors.CEP = true;
    if (!accountData.address.street) newErrors.street = true;
    if (!accountData.address.number) newErrors.number = true;
    if (!accountData.address.neighborhood) newErrors.neighborhood = true;
    if (!accountData.address.city) newErrors.city = true;
  if (!ufs.includes(accountData.address.state || '')) newErrors.state = true;
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
        <Input
          label="Nome Completo"
          value={accountData.name}
          onChangeText={(text) => {
            updateAccountData('name', text);
            setErrors((prev) => ({ ...prev, name: false }));
          }}
          error={errors.name ? "Nome é obrigatório" : undefined}
          placeholder="Digite seu nome completo"
        />
        <Input
          label="Email"
          value={accountData.email}
          onChangeText={(text) => {
            // sanitize: remove spaces and force lowercase
            const cleaned = String(text).replace(/\s+/g, '').toLowerCase();
            updateAccountData('email', cleaned);
            setErrors((prev) => ({ ...prev, email: false }));
          }}
          onBlur={() => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
            setErrors((prev) => ({ ...prev, email: !emailRegex.test(String(accountData.email)) }));
          }}
          error={errors.email ? "Email inválido" : undefined}
          placeholder="seu.email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Senha"
          value={accountData.password}
          onChangeText={(text) => {
            updateAccountData('password', text);
            setErrors((prev) => ({ ...prev, password: false }));
          }}
          error={errors.password ? "Senha é obrigatória" : undefined}
          placeholder="Crie uma senha segura"
          secureTextEntry
        />

        <View>
          <Text style={styles.label}>Telefone</Text>
          <MaskInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={accountData.phone.number}
            onChangeText={(masked, unmasked) => {
              updateAccountData('phone', { ...accountData.phone, number: masked });
              setErrors((prev) => ({ ...prev, phone: false }));
            }}
            mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholder="(XX) XXXXX-XXXX"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>Telefone é obrigatório</Text>}
        </View>

        <View>
          <Text style={styles.label}>Data de Nascimento</Text>
          <TouchableOpacity onPress={() => setDatePickerBirthdateVisible(true)} style={[styles.input, { justifyContent: 'center' }, errors.birthDate && styles.inputError]}>
            <Text>{accountData.birthDate ? (accountData.birthDate instanceof Date ? accountData.birthDate.toLocaleDateString() : String(accountData.birthDate)) : 'Selecione a data'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerBirthdateVisible}
            mode="date"
            maximumDate={new Date()}
            onConfirm={(date: Date) => {
              setDatePickerBirthdateVisible(false);
              // valida idade no momento da seleção
              const today = new Date();
              const bd = date;
              let age = today.getFullYear() - bd.getFullYear();
              const m = today.getMonth() - bd.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
              if (age < 18) {
                setErrors((prev) => ({ ...prev, birthDate: true }));
              } else {
                setErrors((prev) => ({ ...prev, birthDate: false }));
              }
              updateAccountData('birthDate', date);
            }}
            onCancel={() => setDatePickerBirthdateVisible(false)}
          />
          {errors.birthDate && (
            <Text style={styles.errorText}>
              {accountData.birthDate ? 'Você precisa ter pelo menos 18 anos' : 'Data de nascimento é obrigatória'}
            </Text>
          )}
        </View>
        <View>
          <Text style={styles.label}>Status de relacionamento</Text>
          <TouchableOpacity
            style={[styles.pickerDisplay, errors.marital_status && styles.inputError]}
            onPress={() => {
              setTempMarital(accountData.marital_status || '');
              setMaritalModalVisible(true);
            }}
          >
            <Text style={styles.pickerDisplayText}>
              {accountData.marital_status ? getMaritalStatusDisplayLabel(accountData.marital_status as unknown as string) : 'Selecione o status'}
            </Text>
            <Text style={styles.pickerIcon}>▼</Text>
          </TouchableOpacity>
          {errors.marital_status && <Text style={styles.errorText}>Status de relacionamento é obrigatório</Text>}
        </View>
        <View>
          <Text style={styles.label}>Gênero</Text>
          <TouchableOpacity
            style={[styles.pickerDisplay, errors.gender && styles.inputError]}
            onPress={() => {
              setTempGender(accountData.gender || '');
              setGenderModalVisible(true);
            }}
          >
            <Text style={styles.pickerDisplayText}>
              {accountData.gender ? getGenderDisplayLabel(accountData.gender as unknown as string) : 'Selecione o gênero'}
            </Text>
            <Text style={styles.pickerIcon}>▼</Text>
          </TouchableOpacity>
          {errors.gender && <Text style={styles.errorText}>Gênero é obrigatório</Text>}
        </View>
      </Card>

      <Card title="Documentos">
        {/* campos de documentos */}
        <View>
          <Text style={styles.label}>CPF</Text>
          <MaskInput
            style={[styles.input, errors.CPF && styles.inputError]}
            value={accountData.CPF}
            onChangeText={(masked, unmasked) => {
              updateAccountData('CPF', masked);
              setErrors((prev) => ({ ...prev, CPF: false }));
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
          {errors.CPF && <Text style={styles.errorText}>CPF inválido</Text>}
        </View>

        <View>
          <Text style={styles.label}>CNH</Text>
          <MaskInput
            style={[styles.input, errors.CNH && styles.inputError]}
            value={accountData.CNH}
            onChangeText={(masked, unmasked) => {
              updateAccountData('CNH', masked);
              setErrors((prev) => ({ ...prev, CNH: false }));
            }}
            placeholder="Digite o número da CNH"
            placeholderTextColor="#999"
            keyboardType="numeric"
            onBlur={() => {
              const plain = (accountData.CNH || '').replace(/\D/g, '');
              // const isValid = isValidCNH(plain);
              // setErrors((prev) => ({ ...prev, CNH: !isValid }));
            }}
          />
          {errors.CNH && <Text style={styles.errorText}>CNH é obrigatória</Text>}
        </View>

        <View>
          <Text style={styles.label}>Data de Emissão da Primeira CNH</Text>
          <TouchableOpacity
            onPress={() => setDatePickerFirstCNHEmissionVisible(true)}
            style={[styles.input, { justifyContent: 'center' }, errors.CHH_emission_date && styles.inputError]}
          >
            <Text>{accountData.CHH_emission_date ? (accountData.CHH_emission_date instanceof Date ? accountData.CHH_emission_date.toLocaleDateString() : String(accountData.CHH_emission_date)) : 'Selecione a data'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerFirstCNHEmissionVisible}
            mode="date"
            maximumDate={new Date()}
            onConfirm={(date: Date) => {
              setDatePickerFirstCNHEmissionVisible(false);
              updateAccountData('CHH_emission_date', date);
              // clear error when user selects a valid date
              setErrors((prev) => ({ ...prev, CHH_emission_date: false }));
            }}
            onCancel={() => setDatePickerFirstCNHEmissionVisible(false)}
          />
          {errors.CHH_emission_date && <Text style={styles.errorText}>Data de emissão é obrigatória</Text>}
        </View>
      </Card>

      <Card title="Endereço">
        {/* campos de endereço */}
        <View>
          <Text style={styles.label}>CEP</Text>
          <MaskInput
            style={[styles.input, errors.CEP && styles.inputError]}
            value={accountData.address.CEP}
            onChangeText={(masked, unmasked) => {
              updateAddress('CEP', masked);
              setErrors((prev) => ({ ...prev, CEP: false }));
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
          {errors.CEP && <Text style={styles.errorText}>CEP inválido</Text>}
        </View>
        <Input
          label="Rua / Logradouro"
          value={accountData.address.street}
          onChangeText={(text) => {
            updateAddress('street', text);
            setErrors((prev) => ({ ...prev, street: false }));
          }}
          error={errors.street ? "Rua é obrigatória" : undefined}
          placeholder="Ex: Av. Brasil"
        />
        <Input
          label="Número"
          value={accountData.address.number}
          onChangeText={(text) => {
            updateAddress('number', text);
            setErrors((prev) => ({ ...prev, number: false }));
          }}
          error={errors.number ? "Número é obrigatório" : undefined}
          placeholder="123"
          keyboardType="numeric"
        />
        <Input
          label="Complemento (Opcional)"
          value={accountData.address.complement || ''}
          onChangeText={(text) => updateAddress('complement', text)}
          placeholder="Apto, Bloco, etc."
          hint="Opcional - apartamento, bloco, etc."
        />
        <Input
          label="Bairro"
          value={accountData.address.neighborhood}
          onChangeText={(text) => {
            updateAddress('neighborhood', text);
            setErrors((prev) => ({ ...prev, neighborhood: false }));
          }}
          error={errors.neighborhood ? "Bairro é obrigatório" : undefined}
          placeholder="Centro"
        />
        <Input
          label="Cidade"
          value={accountData.address.city}
          onChangeText={(text) => {
            updateAddress('city', text);
            setErrors((prev) => ({ ...prev, city: false }));
          }}
          error={errors.city ? "Cidade é obrigatória" : undefined}
          placeholder="Ex: São Paulo"
        />
        <Text style={styles.label}>Estado</Text>
        <TouchableOpacity
          style={[styles.pickerDisplay, errors.state && styles.inputError]}
          onPress={() => {
            setTempState(accountData.address.state || '');
            setModalVisible(true);
          }}
        >
          <Text style={styles.pickerDisplayText}>
            {accountData.address.state || "Selecione um Estado"}
          </Text>
          <Text style={styles.pickerIcon}>▼</Text>
        </TouchableOpacity>
      </Card>

      <Button
        title="Finalizar Cadastro"
        onPress={handleRegistration}
        loading={loading}
        disabled={loading}
        style={{ marginHorizontal: 14}}
      />

      <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              // validate state selection before saving
              if (!ufs.includes(tempState)) {
                setErrors((prev) => ({ ...prev, state: true }));
                return;
              }
              updateAddress('state', tempState);
              setErrors((prev) => ({ ...prev, state: false }));
              setModalVisible(false);
            }}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          <Picker selectedValue={tempState} itemStyle={styles.contentPicker} onValueChange={(itemValue) => { 
            if (itemValue !== '') {
              setTempState(itemValue); 
            }
          }}>
            <Picker.Item label="Selecione um Estado" value="" enabled={false} color="#999" />
            {ufs.map((uf) => (
              <Picker.Item key={uf} label={uf} value={uf} />
            ))}
          </Picker>
        </View>
      </Modal>

      <Modal transparent={true} visible={maritalModalVisible} animationType="slide" onRequestClose={() => setMaritalModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMaritalModalVisible(false)} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setMaritalModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              // prevent saving placeholder
              if (!MaritalStatusOptions.includes(tempMarital as any)) {
                setErrors((prev) => ({ ...prev, marital_status: true }));
                return;
              }
              updateAccountData('marital_status', tempMarital as any);
              setErrors((prev) => ({ ...prev, marital_status: false }));
              setMaritalModalVisible(false);
            }}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          <Picker selectedValue={tempMarital} itemStyle={styles.contentPicker} onValueChange={(itemValue) => { 
            if (itemValue !== '') {
              setTempMarital(itemValue); 
            }
          }}>
            <Picker.Item label="Selecione um status" value="" enabled={false} color="#999" />
            {MaritalStatusOptions.map((m) => (
              <Picker.Item key={m} label={MaritalStatusLabelPT[m]} value={m} />
            ))}
          </Picker>
        </View>
      </Modal>

      <Modal transparent={true} visible={genderModalVisible} animationType="slide" onRequestClose={() => setGenderModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setGenderModalVisible(false)} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setGenderModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (!GenderOptions.includes(tempGender as any)) {
                setErrors((prev) => ({ ...prev, gender: true }));
                return;
              }
              updateAccountData('gender', tempGender as any);
              setErrors((prev) => ({ ...prev, gender: false }));
              setGenderModalVisible(false);
            }}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          <Picker selectedValue={tempGender} itemStyle={styles.contentPicker} onValueChange={(itemValue) => { 
            if (itemValue !== '') {
              setTempGender(itemValue); 
            }
          }}>
            <Picker.Item label="Selecione o gênero" value="" enabled={false} color="#999" />
            {GenderOptions.map((g) => (
              <Picker.Item key={g} label={(GenderLabelPT as any)[g]} value={g} />
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
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
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
});