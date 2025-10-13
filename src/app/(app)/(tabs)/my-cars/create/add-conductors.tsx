import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import React, { useCallback, useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import Camera from '@/components/Camera';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import { Conductor } from '@/contexts/CreateVehicleContext';
import { formatCPF, formatPhone, isValidCPF, isValidEmail } from '@/utils/formatters';

import { commonStyles } from '@/styles/CommonStyles';
import FormField from '@/components/FormField';
import FormRow from '@/components/FormRow';
import PhotoButton from '@/components/PhotoButton';
import VehiclePhoto from '@/components/VehiclePhoto';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';

const theme = Colors.light;

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
  const [canRedirect, setCanRedirect] = useState(false);

   useEffect(() => {
        setCanRedirect(!!(conductor.birthDate && conductor.document &&
            conductor.email && conductor.licenseExpiry && conductor.licenseFirstEmission &&
            conductor.licenseNumber, conductor.licensePhoto, conductor.name, conductor.phone &&
            conductor.relationship));
    }, [conductor]);


  const handleBack = useCallback(() => router.back(), [router]);
  const handleRedirect = useCallback(() => router.push('/(app)/(tabs)/my-cars/create/resume'), [router]);

  const handleChangeInput = useCallback((name: keyof Conductor, value: string | number | Date) => {
    setConductor(prev => {
      const next = { ...prev } as any;

      if (name === 'licenseFirstEmission' || name === 'licenseNumber' || name === 'licenseExpiry') {
        if (typeof value === 'string') {
          const numericValue = value.replace(/\D/g, '');
          next[name] = parseInt(numericValue, 10) || 0;
        } else if (typeof value === 'number') next[name] = value;
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
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
                    <FormField
                    label="Validade da CNH"
                    value={conductor.licenseExpiry}
                    onChangeText={text => handleChangeInput('licenseExpiry', text)}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                    maxLength={10}
                    />
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
                                style={[commonStyles.buttonSmall, { marginTop: 0, alignItems:'center' }]}
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
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <TouchableOpacity style={[commonStyles.button, !canRedirect && commonStyles.backButton]} onPress={handleAddConductor} disabled={!canRedirect} >
                            <Text style={commonStyles.buttonText}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                    

                    <View style={commonStyles.footerRow}>
                        <TouchableOpacity style={[commonStyles.footerButton, commonStyles.backButton]} onPress={handleBack}>
                            <Text style={commonStyles.buttonText}>Voltar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[commonStyles.footerButton, commonStyles.buttonSecondary]} onPress={handleRedirect}>
                            <Text style={commonStyles.buttonText}>Pular</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>     
        </View>

    </KeyboardAvoidingView>
    </SafeAreaView>
    
  );
}
