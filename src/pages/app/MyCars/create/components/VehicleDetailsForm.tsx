import FormField from "@/components/FormField";
import FormRow from "@/components/FormRow";
import { carBrands, fuelTypes } from '@/contexts/CreateVehicleContext';
import { useCreateVehicle } from "@/hooks/useCreateVehicle";
import { commonStyles } from "@/styles/CommonStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleDetailsForm() {
    const { vehicle, setVehicle, changeInitialCarPhoto, initialCarPhoto } = useCreateVehicle();
    const [modalVisible, setModalVisible] = useState(false);
    const [brandModalVisible, setBrandModalVisible] = useState(false);
    const [selectedFuel, setSelectedFuel] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [modelModalVisible, setModelModalVisible] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [modelOptions, setModelOptions] = useState<string[]>([]);
    const [plateError, setPlateError] = useState<string | null>(null);

    async function getVehicles(brand: string, year: number, fuel: string) {
        try {
            // const response = await axiosIA.get(`/get_models_by_year`, {
            //     params: { brand, year, fuel }
            // });
            // return response.data;
        } catch (error) {
            console.error("Erro ao buscar veículos:", error);
            return [];
        }
    }

    useEffect(() => {
        // Atualiza opções de modelo dinamicamente conforme marca/ano/combustível
        if (vehicle.brand && vehicle.year && vehicle.fuel) {
            // Mapeamento simples por marca (exemplo). Em produção isso viria de API.
            const mapping: Record<string, string[]> = {
                Chevrolet: ['Onix LTZ', 'Tracker', 'Cruze'],
                Fiat: ['Argo', 'Cronos', 'Toro'],
                Toyota: ['Corolla', 'Yaris', 'Hilux'],
                Volkswagen: ['Golf', 'Polo', 'T-Cross']
            };

            const options = mapping[vehicle.brand] || [`${vehicle.brand} Modelo A`, `${vehicle.brand} Modelo B`];
            setModelOptions(options);
        } else {
            setModelOptions([]);
        }
        setSelectedModel(null);
    }, [vehicle.brand, vehicle.year, vehicle.fuel]);

    function handleChangePlate(text: string) {
        // Normaliza entrada para maiúsculas e sem espaços
        const normalized = text.toUpperCase().replace(/\s+/g, '');
        const mask = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2,3}$/;
        const plate_filtered = mask.test(normalized);
        if (plate_filtered) {
            setVehicle({ ...vehicle, plate: normalized });
            setPlateError(null);
        } else {
            // Não sobrescrever o valor do usuário (permite digitação parcial)
            setVehicle({ ...vehicle, plate: normalized });
            setPlateError('Placa inválida. Formato esperado: AAA0A00 ou AAA0000.');
        }
    }

    return (
        <View style={commonStyles.formContainer}>
            <FormRow>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Marca</Text>
                    <TouchableOpacity style={styles.pickerTrigger} onPress={() => { setSelectedBrand(vehicle.brand || ''); setBrandModalVisible(true); }}>
                        <Text style={[styles.pickerTriggerText, { color: vehicle.brand ? '#000' : '#888' }]}>{vehicle.brand || 'Selecione'}</Text>
                        <Text style={styles.pickerTriggerIcon}><FontAwesome name="chevron-down" size={16} color="#000" /></Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Modelo</Text>
                    <TouchableOpacity
                        style={[styles.pickerTrigger, (!vehicle.brand || !vehicle.year || !vehicle.fuel) && styles.disabledTrigger]}
                        onPress={() => {
                            if (!vehicle.brand || !vehicle.year || !vehicle.fuel) {
                                Alert.alert('Atenção', 'Preencha Marca, Ano e Combustível antes de selecionar o Modelo.');
                                return;
                            }
                            setSelectedModel(vehicle.model || '');
                            setModelModalVisible(true);
                        }}
                    >
                        <Text style={[styles.pickerTriggerText, { color: vehicle.model ? '#000' : '#888' }]}>{vehicle.model || 'Selecione'}</Text>
                        <Text style={styles.pickerTriggerIcon}><FontAwesome name="chevron-down" size={16} color="#000" /></Text>
                    </TouchableOpacity>
                </View>
            </FormRow>

            <FormRow>
                <FormField
                    label="Ano"
                    keyboardType="numeric"
                    value={(vehicle.year || 2024).toString()}
                    onChangeText={(text) => setVehicle({ ...vehicle, year: parseInt(text) || 0 })}
                    placeholder="Ano"
                />

                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Combustível</Text>
                    <TouchableOpacity style={styles.pickerTrigger} onPress={() => { setSelectedFuel(vehicle.fuel || ''); setModalVisible(true); }}>
                        <Text style={[styles.pickerTriggerText, { color: vehicle.fuel ? '#000' : '#888' }]}>{vehicle.fuel || 'Selecione'}</Text>
                        <Text style={styles.pickerTriggerIcon}><FontAwesome name="chevron-down" size={16} color="#000" /></Text>
                    </TouchableOpacity>
                </View>

                
            </FormRow>

            <FormRow>
                <FormField
                    label="Placa"
                    value={vehicle.plate}
                    onChangeText={handleChangePlate}
                    error={plateError}
                    placeholder="Placa"
                />

                <FormField
                    label="Odômetro"
                    value={(vehicle.odomether).toString()}
                    onChangeText={(text) => setVehicle({ ...vehicle, odomether: parseInt(text) })}
                    placeholder="Odômetro"
                    keyboardType="numeric"
                />
            </FormRow>

            <FormRow>
                <FormField
                    label="Cor"
                    value={vehicle.color}
                    onChangeText={(text) => setVehicle({ ...vehicle, color: text })}
                    placeholder="Cor"
                />

                <View style={{ flex: 1 }} />
            </FormRow>

            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)} />
                    <SafeAreaView style={styles.modalSheet}>
                        {/* handle visual */}
                        <View style={styles.sheetHandle} />
                        <View style={styles.modalHeaderRow}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.headerButton}>
                                <Text style={styles.modalAction}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setVehicle({ ...vehicle, fuel: selectedFuel || '' }); setModalVisible(false); }} style={styles.headerButton}>
                                <Text style={[styles.modalAction, { fontWeight: '700' }]}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.pickerContainer, styles.pickerContainerInner]}>
                            {Platform.OS === 'ios' ? (
                                <ScrollView style={styles.optionsList}>
                                    {fuelTypes.map((ft) => (
                                        <TouchableOpacity
                                            key={ft}
                                            style={styles.optionItem}
                                            onPress={() => { setSelectedFuel(ft); setVehicle({ ...vehicle, fuel: ft }); setModalVisible(false); }}
                                        >
                                            <Text style={styles.optionText}>{ft}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <Picker
                                    selectedValue={selectedFuel ?? vehicle.fuel ?? ''}
                                    onValueChange={(v) => setSelectedFuel(String(v))}
                                    style={[styles.pickerLarge, { backgroundColor: '#fff', color: '#000' }]}
                                    itemStyle={[styles.pickerItemLarge, { color: '#000' }]}
                                    dropdownIconColor="#000"
                                >
                                    <Picker.Item label="Selecione" value="" />
                                    {fuelTypes.map((ft) => (
                                        <Picker.Item key={ft} label={ft} value={ft} />
                                    ))}
                                </Picker>
                            )}
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
            {/* Brand modal */}
            <Modal visible={brandModalVisible} transparent animationType="slide" onRequestClose={() => setBrandModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setBrandModalVisible(false)} />
                    <SafeAreaView style={styles.modalSheet}>
                        <View style={styles.sheetHandle} />
                        <View style={styles.modalHeaderRow}>
                            <TouchableOpacity onPress={() => setBrandModalVisible(false)} style={styles.headerButton}>
                                <Text style={styles.modalAction}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setVehicle({ ...vehicle, brand: selectedBrand || '' }); setBrandModalVisible(false); }} style={styles.headerButton}>
                                <Text style={[styles.modalAction, { fontWeight: '700' }]}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.pickerContainer, styles.pickerContainerInner]}>
                            {Platform.OS === 'ios' ? (
                                <ScrollView style={styles.optionsList}>
                                    {carBrands.map((b: string) => (
                                        <TouchableOpacity
                                            key={b}
                                            style={[styles.optionItem, selectedBrand === b && styles.optionItemSelected]}
                                            onPress={() => setSelectedBrand(b)}
                                        >
                                            <Text style={[styles.optionText, selectedBrand === b && styles.optionTextSelected]}>{b}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <Picker
                                    selectedValue={selectedBrand ?? vehicle.brand ?? ''}
                                    onValueChange={(v) => setSelectedBrand(String(v))}
                                    style={[styles.pickerLarge, { backgroundColor: '#fff', color: '#000' }]}
                                    itemStyle={[styles.pickerItemLarge, { color: '#000' }]}
                                    dropdownIconColor="#000"
                                >
                                    <Picker.Item label="Selecione" value="" />
                                    {carBrands.map((b: string) => (
                                        <Picker.Item key={b} label={b} value={b} />
                                    ))}
                                </Picker>
                            )}
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
            {/* Model modal */}
            <Modal visible={modelModalVisible} transparent animationType="slide" onRequestClose={() => setModelModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModelModalVisible(false)} />
                    <SafeAreaView style={styles.modalSheet}>
                        <View style={styles.sheetHandle} />
                        <View style={styles.modalHeaderRow}>
                            <TouchableOpacity onPress={() => setModelModalVisible(false)} style={styles.headerButton}>
                                <Text style={styles.modalAction}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setVehicle({ ...vehicle, model: selectedModel || '' }); setModelModalVisible(false); }} style={styles.headerButton}>
                                <Text style={[styles.modalAction, { fontWeight: '700' }]}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.pickerContainer, styles.pickerContainerInner]}>
                            {modelOptions.length === 0 ? (
                                <Text style={styles.noOptionsText}>Nenhum modelo disponível. Preencha Marca, Ano e Combustível corretamente.</Text>
                            ) : Platform.OS === 'ios' ? (
                                <ScrollView style={styles.optionsList}>
                                    {modelOptions.map((m: string) => (
                                        <TouchableOpacity
                                            key={m}
                                            style={[styles.optionItem, selectedModel === m && styles.optionItemSelected]}
                                            onPress={() => setSelectedModel(m)}
                                        >
                                            <Text style={[styles.optionText, selectedModel === m && styles.optionTextSelected]}>{m}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <Picker
                                    selectedValue={selectedModel ?? vehicle.model ?? ''}
                                    onValueChange={(v) => setSelectedModel(String(v))}
                                    style={[styles.pickerLarge, { backgroundColor: '#fff', color: '#000' }]}
                                    itemStyle={[styles.pickerItemLarge, { color: '#000' }]}
                                    dropdownIconColor="#000"
                                >
                                    <Picker.Item label="Selecione" value="" />
                                    {modelOptions.map((m: string) => (
                                        <Picker.Item key={m} label={m} value={m} />
                                    ))}
                                </Picker>
                            )}
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    pickerWrapper: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 14,
        marginBottom: 5,
        color: '#555',
        fontWeight: '600',
    },
    pickerBox: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    picker: {
        height: 44,
        width: '100%'
    },
    pickerItem: {
        height: 44,
    }
    ,
    pickerTrigger: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // height: 50,
    },
    pickerTriggerIcon: {
        fontSize: 12,
        color: '#000',
    },
    pickerTriggerText: {
        fontSize: 16,
        color: '#000',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 0,
        elevation: 0
    },
    modalSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        paddingTop: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        maxHeight: '50%',
        zIndex: 1000,
        elevation: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.12,
        shadowRadius: 6
    },
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 8,
        alignItems: 'center'
    },
    headerButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        minWidth: 72,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalAction: {
        color: '#007aff',
        fontSize: 16,
        fontWeight: '600'
    }
    ,
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end'
    },
    sheetHandle: {
        height: 5,
        width: '100%',
        backgroundColor: '#ccc',
        borderRadius: 2,
        marginBottom: 10,
    },
    pickerContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24
    },
    pickerContainerInner: {
        backgroundColor: '#f2f2f4',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 8
    },
    pickerLarge: {
        width: '100%',
        height: 180,
    },
    pickerItemLarge: {
        height: 48,
        fontSize: 18
    }
    ,
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
    }
    ,
    optionItemSelected: {
        backgroundColor: '#e8f0ff'
    },
    optionTextSelected: {
        fontWeight: '700',
        color: '#0a3d8f'
    }
    ,
    disabledTrigger: {
        opacity: 0.6
    },
    noOptionsText: {
        color: '#666',
        textAlign: 'center',
        padding: 12
    }
});
