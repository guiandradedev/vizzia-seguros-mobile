import Camera from '@/components/Camera';
import Colors from '@/constants/Colors';
import { Conductor } from '@/contexts/CreateVehicleContext';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import { formatCPF, formatPhone, isValidCPF, isValidEmail } from '@/utils/formatters';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import MaskInput from 'react-native-mask-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { MaritalStatusOptions, MaritalStatusLabelPT, getMaritalStatusDisplayLabel } from '@/constants/maritalStatus';
import { GenderOptions, GenderLabelPT, getGenderDisplayLabel } from '@/constants/gender';

import Button from '@/components/Button';
import FormField from '@/components/FormField';
import FormRow from '@/components/FormRow';
import PhotoButton from '@/components/PhotoButton';
import VehiclePhoto from '@/components/VehiclePhoto';
import { commonStyles } from '@/styles/CommonStyles';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View, Modal, StyleSheet } from 'react-native';

export default function AddConductorsScreen() {
  const router = useRouter();
  const { addConductor, conductors, maxConductors } = useCreateVehicle();

  const emptyConductor: Conductor = {
    name: '',
    licenseNumber: '',
    licenseExpiry: null,
    licenseFirstEmission: null,
    licensePhoto: '',
    relationship: '',
    phone: '',
    email: '',
    document: '',
    birthDate: null,
    marital_status: '',
    gender: '',
  };

  const [conductor, setConductor] = useState<Conductor>(emptyConductor);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isExpiryPickerVisible, setExpiryPickerVisible] = useState(false);
  const [isIssuePickerVisible, setIssuePickerVisible] = useState(false);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [canRedirect, setCanRedirect] = useState(false);
  const [maritalModalVisible, setMaritalModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [tempMarital, setTempMarital] = useState<string>('');
  const [tempGender, setTempGender] = useState<string>('');

  useEffect(() => {
    // Validate required fields strictly. Dates must be valid Date objects.
    const hasName = typeof conductor.name === 'string' && conductor.name.trim().length > 0;
    const hasDocument = typeof conductor.document === 'string' && isValidCPF(conductor.document);
    const hasEmail = typeof conductor.email === 'string' && isValidEmail(conductor.email);
    const phoneDigits = String(conductor.phone || '').replace(/\D/g, '');
    const hasPhone = phoneDigits.length >= 10; // allow 10 or 11 depending on format
    const hasLicenseNumber = typeof conductor.licenseNumber === 'string' && conductor.licenseNumber.replace(/\D/g, '').length >= 11;
    const hasLicensePhoto = !!conductor.licensePhoto;
    const hasRelationship = typeof conductor.relationship === 'string' && conductor.relationship.trim().length > 0;
    const birthValid = conductor.birthDate instanceof Date && !isNaN(conductor.birthDate.getTime());
    const expiryValid = conductor.licenseExpiry instanceof Date && !isNaN(conductor.licenseExpiry.getTime());
    const issueValid = conductor.licenseFirstEmission instanceof Date && !isNaN(conductor.licenseFirstEmission.getTime());
    const hasMaritalStatus = typeof conductor.marital_status === 'string' && MaritalStatusOptions.includes(conductor.marital_status as any);
    const hasGender = typeof conductor.gender === 'string' && GenderOptions.includes(conductor.gender as any);

    setCanRedirect(hasName && hasDocument && hasEmail && hasPhone && hasLicenseNumber && hasLicensePhoto && hasRelationship && birthValid && expiryValid && issueValid && hasMaritalStatus && hasGender);
  }, [conductor]);


  const handleBack = useCallback(() => router.back(), [router]);
  const handleRedirect = useCallback(() => router.push('/(app)/(tabs)/my-cars/create/resume-conductors'), [router]);

  // function handleRedirect() {
  //     alert('Cadastro finalizado com sucesso!');
  //     router.push('/(app)/(tabs)/my-cars');
  // }
  const handleChangeInput = useCallback((name: keyof Conductor, value: string | number | Date) => {
    setConductor(prev => {
      const next = { ...prev } as any;

      // // Only licenseFirstEmission is stored as number (year or similar).
      // if (name === 'licenseFirstEmission') {
      //   if (typeof value === 'string') {
      //     const numericValue = value.replace(/\D/g, '');
      //     next[name] = parseInt(numericValue, 10) || 0;
      //   } else if (typeof value === 'number') next[name] = value;
      //   return next;
      // }

      // Keep licenseNumber and licenseExpiry as strings so leading zeros are preserved.
      if (name === 'document' && typeof value === 'string') {
        next[name] = formatCPF(value);
        setCpfError(null);
        return next;
      }

      if (name === 'email' && typeof value === 'string') {
        next[name] = value.replace(" ", "");
        setEmailError(null);
        return next;
      }

          if (name === 'birthDate' || name === 'licenseExpiry' || name === 'licenseFirstEmission') {
            const date = value instanceof Date ? value : new Date(String(value));
            if (!isNaN(date.getTime())) next[name] = date;
            else next[name] = null;
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

    // Additional strict validations to prevent incomplete dates or missing required fields
    if (!(conductor.birthDate instanceof Date) || isNaN(conductor.birthDate.getTime())) {
      Alert.alert('Erro', 'Data de nascimento inválida ou não selecionada.');
      return;
    }

    if (!(conductor.licenseExpiry instanceof Date) || isNaN(conductor.licenseExpiry.getTime())) {
      Alert.alert('Erro', 'Validade da CNH inválida ou não selecionada.');
      return;
    }

    if (!(conductor.licenseFirstEmission instanceof Date) || isNaN(conductor.licenseFirstEmission.getTime())) {
      Alert.alert('Erro', 'Data de primeira emissão da CNH inválida ou não selecionada.');
      return;
    }

    if (!conductor.licensePhoto) {
      Alert.alert('Erro', 'Foto da CNH é obrigatória.');
      return;
    }

    if (!MaritalStatusOptions.includes(conductor.marital_status as any)) {
      Alert.alert('Erro', 'Status de relacionamento é obrigatório.');
      return;
    }

    if (!GenderOptions.includes(conductor.gender as any)) {
      Alert.alert('Erro', 'Gênero é obrigatório.');
      return;
    }

    const phoneDigits = String(conductor.phone || '').replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10) {
      Alert.alert('Erro', 'Telefone inválido. Informe DDD + número (min. 10 dígitos).');
      return;
    }

    const cnhDigits = String(conductor.licenseNumber || '').replace(/\D/g, '');
    if (!cnhDigits || cnhDigits.length < 11) {
      Alert.alert('Erro', 'Número da CNH inválido. Informe os dígitos (mín. 11).');
      return;
    }

    addConductor(conductor);
    Alert.alert('Sucesso', `Condutor adicionado! Total de condutores: ${conductors.length + 1}`);
    setConductor(emptyConductor);
  }, [addConductor, conductor, conductors.length, maxConductors]);

  const openCamera = () => setIsCameraOpen(true);

  // Câmera em tela cheia
  if (isCameraOpen) {
    return (
      <Camera
        setPhoto={async (uri: string) => {
          setConductor(prev => ({ ...prev, licensePhoto: uri }));
          await new Promise(resolve => setTimeout(resolve, 500));
          setIsCameraOpen(false);
        }}
        closeCamera={() => setIsCameraOpen(false)}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // ajusta o deslocamento
      >
        <View style={commonStyles.container}>
          <ScrollView contentContainerStyle={[commonStyles.scrollContent, { paddingBottom: 140 }]}>
            <Text style={commonStyles.title}>Adicionar condutores</Text>
            <Text style={commonStyles.subtitle}>
              Você pode adicionar até {maxConductors} condutores adicionais para este veículo.
              Condutores adicionados: {conductors.length}
            </Text>

            <View style={commonStyles.formContainer}>
              <FormRow>
                <FormField
                  label="Nome Completo"
                  value={conductor.name}
                  onChangeText={text => handleChangeInput('name', text)}
                  placeholder="Nome do condutor"
                />
              </FormRow>

              <FormRow>
                <FormField
                  label="Email"
                  value={conductor.email}
                  onChangeText={text => handleChangeInput('email', text)}
                  placeholder="email@exemplo.com"
                  keyboardType="email-address"
                  onBlur={() => conductor.email && !isValidEmail(conductor.email) && setEmailError('Email inválido')}
                  error={emailError}
                />
              </FormRow>

              <FormRow>
                <FormField
                  label="CPF"
                  value={conductor.document}
                  onChangeText={text => handleChangeInput('document', text)}
                  placeholder="000.000.000-00"
                  keyboardType="numeric"
                  maxLength={14}
                  onBlur={() => !isValidCPF(conductor.document) && setCpfError('CPF inválido')}
                  error={cpfError}
                />
                <FormField
                  label="Telefone"
                  value={conductor.phone}
                  onChangeText={text => handleChangeInput('phone', formatPhone(text))}
                  placeholder="(00) 90000-0000"
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </FormRow>

              <FormRow>
                <FormField
                  label="Número da CNH"
                  value={String(conductor.licenseNumber || '')}
                  onChangeText={text => handleChangeInput('licenseNumber', text)}
                  placeholder="00000000000"
                  keyboardType="numeric"
                  maxLength={11}
                />
                <View style={{ flex: 1 }}>
                  <Text style={commonStyles.label}>Validade da CNH</Text>
                  <TouchableOpacity
                    style={[commonStyles.input]}
                    onPress={() => setExpiryPickerVisible(true)}
                  >
                    <Text>{conductor.licenseExpiry ? (conductor.licenseExpiry as Date).toLocaleDateString() : 'Selecione a data'}</Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isExpiryPickerVisible}
                    mode="date"
                    minimumDate={new Date(1900, 0, 1)}
                    // Allow CNH expiry to be a future date (people have valid CNHs beyond today)
                    maximumDate={new Date(2100, 11, 31)}
                    onConfirm={date => {
                      setExpiryPickerVisible(false);
                      handleChangeInput('licenseExpiry', date);
                    }}
                    onCancel={() => setExpiryPickerVisible(false)}
                  />
                </View>
              </FormRow>

              <FormRow>
                <FormField
                  label="Relacionamento"
                  value={conductor.relationship}
                  onChangeText={text => handleChangeInput('relationship', text)}
                  placeholder="Ex: Cônjuge"
                />
                <View>
                  <Text style={commonStyles.label}>Data de Nascimento</Text>
                  <TouchableOpacity
                    style={[commonStyles.input]}
                    onPress={() => setDatePickerVisible(true)}
                  >
                    <Text>{conductor.birthDate ? conductor.birthDate.toLocaleDateString() : 'Selecione a data'}</Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    maximumDate={new Date()}
                    onConfirm={date => {
                      setDatePickerVisible(false);
                      handleChangeInput('birthDate', date);
                    }}
                    onCancel={() => setDatePickerVisible(false)}
                  />
                </View>
              </FormRow>
              <FormRow>
                <View style={{ flex: 1 }}>
                  <Text style={commonStyles.label}>Status de relacionamento</Text>
                  <TouchableOpacity
                    style={[commonStyles.input]}
                    onPress={() => { setTempMarital(conductor.marital_status || ''); setMaritalModalVisible(true); }}
                  >
                    <Text style={{ color: conductor.marital_status ? '#000' : '#999' }}>
                      {conductor.marital_status ? getMaritalStatusDisplayLabel(conductor.marital_status) : 'Selecione o status'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={commonStyles.label}>Gênero</Text>
                  <TouchableOpacity
                    style={[commonStyles.input]}
                    onPress={() => { setTempGender(conductor.gender || ''); setGenderModalVisible(true); }}
                  >
                    <Text style={{ color: conductor.gender ? '#000' : '#999' }}>
                      {conductor.gender ? getGenderDisplayLabel(conductor.gender) : 'Selecione o gênero'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </FormRow>
              <FormRow>
                <View style={{ flex: 1 }}>
                  <Text style={commonStyles.label}>Primeira emissão de CNH</Text>
                  <TouchableOpacity
                    style={[commonStyles.input]}
                    onPress={() => setIssuePickerVisible(true)}
                  >
                    <Text>{conductor.licenseFirstEmission ? (conductor.licenseFirstEmission as Date).toLocaleDateString() : 'Selecione a data'}</Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isIssuePickerVisible}
                    mode="date"
                    minimumDate={new Date(1900, 0, 1)}
                    maximumDate={new Date()}
                    onConfirm={date => {
                      setIssuePickerVisible(false);
                      handleChangeInput('licenseFirstEmission', date);
                    }}
                    onCancel={() => setIssuePickerVisible(false)}
                  />
                </View>
                
              </FormRow>

              {/* Foto da CNH */}
              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Foto da CNH</Text>
                {conductor.licensePhoto ? (
                  <VehiclePhoto photoUri={conductor.licensePhoto} onEdit={openCamera} />
                ) : (
                  <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <View style={{ width: 150, alignItems: 'center' }}>
                      <PhotoButton
                        photoUri={conductor.licensePhoto}
                        title="Adicionar foto"
                        onPress={openCamera}
                      />

                    </View>
                  </View>
                )}


                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <TouchableOpacity
                    style={[commonStyles.buttonSmall, { marginTop: 0, alignItems: 'center' }]}
                    onPress={async () => {
                      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Permissão necessária', 'Permita acesso à galeria para selecionar uma foto.');
                        return;
                      }
                      const result = await ImagePicker.launchImageLibraryAsync({
                        allowsEditing: true,
                        quality: 0.8,
                      });
                      if (!result.canceled) {
                        const uri =
                          (result.assets && result.assets[0] && result.assets[0].uri) || (result as any).uri;
                        setConductor(prev => ({ ...prev, licensePhoto: uri }));
                      }
                    }}
                  >
                    <Text style={commonStyles.buttonText}>Galeria</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={[commonStyles.footer]}>
              <View style={commonStyles.footerRow}>
                <Button onPress={handleBack} title="Voltar" variant="outline" />
                <Button onPress={handleAddConductor} title="Adicionar" variant="primary" disabled={!canRedirect} />
                <Button onPress={handleRedirect} title="Continuar" variant="primary" disabled={conductors.length === 0} />
              </View>
            </View>
          </ScrollView>
        </View>

      </KeyboardAvoidingView>

      {/* Modal for Marital Status Picker */}
      <Modal transparent={true} visible={maritalModalVisible} animationType="slide" onRequestClose={() => setMaritalModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMaritalModalVisible(false)} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setMaritalModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Selecione o Status</Text>
            <TouchableOpacity onPress={() => {
              if (!MaritalStatusOptions.includes(tempMarital as any)) {
                Alert.alert('Erro', 'Selecione um status válido.');
                return;
              }
              handleChangeInput('marital_status', tempMarital);
              setMaritalModalVisible(false);
            }}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          <Picker
            selectedValue={tempMarital}
            itemStyle={styles.contentPicker}
            onValueChange={(itemValue) => {
              if (itemValue !== '') {
                setTempMarital(itemValue || '');
              }
            }}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um status" value="" enabled={false} color="#999" />
            {MaritalStatusOptions.map((m) => (
              <Picker.Item key={m} label={MaritalStatusLabelPT[m]} value={m} />
            ))}
          </Picker>
        </View>
      </Modal>

      {/* Modal for Gender Picker */}
      <Modal transparent={true} visible={genderModalVisible} animationType="slide" onRequestClose={() => setGenderModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setGenderModalVisible(false)} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setGenderModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Selecione o Gênero</Text>
            <TouchableOpacity onPress={() => {
              if (!GenderOptions.includes(tempGender as any)) {
                Alert.alert('Erro', 'Selecione um gênero válido.');
                return;
              }
              handleChangeInput('gender', tempGender);
              setGenderModalVisible(false);
            }}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          <Picker
            selectedValue={tempGender}
            itemStyle={styles.contentPicker}
            onValueChange={(itemValue) => {
              if (itemValue !== '') {
                setTempGender(itemValue || '');
              }
            }}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o gênero" value="" enabled={false} color="#999" />
            {GenderOptions.map((g) => (
              <Picker.Item key={g} label={(GenderLabelPT as any)[g]} value={g} />
            ))}
          </Picker>
        </View>
      </Modal>
    </View>

  );
}

const styles = StyleSheet.create({
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
  contentPicker: {
    color: '#000',
    fontSize: 20,
  },
  picker: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
