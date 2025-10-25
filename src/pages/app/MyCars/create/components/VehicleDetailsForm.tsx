import FormField from "@/components/FormField";
import FormRow from "@/components/FormRow";
import ModalSheet from '@/components/ModalSheet';
import Colors from '@/constants/Colors';
import { CarBrand, CarBrandName, carBrands, fuelTypes, FuelTypes, vehicleUses, VehicleUses } from '@/contexts/CreateVehicleContext';
import { useCreateVehicle } from "@/hooks/useCreateVehicle";
import { axiosIA } from "@/lib/axios";
import { commonStyles } from "@/styles/CommonStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VehicleDetailsForm() {
    const { vehicle, setVehicle, changeInitialCarPhoto, initialCarPhoto } = useCreateVehicle();
    const [modalVisible, setModalVisible] = useState(false);
    const [brandModalVisible, setBrandModalVisible] = useState(false);
    const [selectedFuel, setSelectedFuel] = useState<FuelTypes | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<CarBrandName | null>(null);
    const [usageModalVisible, setUsageModalVisible] = useState(false);
    const [selectedUsage, setSelectedUsage] = useState<VehicleUses | null>(null);
    const [modelModalVisible, setModelModalVisible] = useState(false);
    // selectedModel armazena o código do modelo (string)
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    type ModelOption = { code: string; name: string };
    const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);
    const [plateError, setPlateError] = useState<string | null>(null);

    async function getVehicles(brand: number, year: number, fuel: string) {
        try {
            const fuelIndex = fuelTypes.findIndex((ft: FuelTypes) => ft === fuel);
            const fuel_code = fuelIndex >= 0 ? fuelIndex + 1 : null;

            const body = { brand_code: brand, year_code: `${year}-${fuel_code}` };
            const response = await axiosIA.post(`/get_models_by_year`, body);
            return response.data as unknown;
        } catch (error) {
            console.warn('Erro ao buscar veículos:', error);
            return [];
        }
    }

    // Resolve o nome da marca atual a partir do código salvo em vehicle.brand
    const currentBrandName: string | undefined = carBrands.find((item: CarBrand) => item.code === vehicle.brand)?.name;

    useEffect(() => {
        // Carrega opções de modelo a partir do endpoint getVehicles
        async function loadModelsFromApi() {
            if (!currentBrandName || !vehicle.year || !vehicle.fuel) {
                setModelOptions([]);
                setSelectedModel(null);
                return;
            }

            try {
                const apiModels = await getVehicles((vehicle as any).brand, vehicle.year, vehicle.fuel);
                if (Array.isArray(apiModels) && apiModels.length > 0 && typeof apiModels[0] === 'object') {
                    // Assume formato [{ code: '6090', name: '...' }, ...]
                    setModelOptions(apiModels as ModelOption[]);
                } else {
                    // Se a API não retornar o formato esperado, limpa as opções
                    setModelOptions([]);
                }
            } catch (err) {
                console.warn('Erro ao carregar modelos da API:', err);
                setModelOptions([]);
            }

            setSelectedModel(null);
        }

        loadModelsFromApi();
    }, [currentBrandName, vehicle.year, vehicle.fuel]);

    // Resolve o nome do modelo atual a partir do código salvo em vehicle.model
    const currentModelName: string | undefined = modelOptions.find(item => item.code === vehicle.model)?.name;

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
        <View style={[commonStyles.formContainer, styles.formCard]}>
            <FormRow>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Marca</Text>
                    <TouchableOpacity style={styles.pickerTrigger} onPress={() => { setSelectedBrand((currentBrandName ?? null) as CarBrandName | null); setBrandModalVisible(true); }}>
                        <Text style={[styles.pickerTriggerText, { color: currentBrandName ? Colors.text : Colors.textSecondary }]}>{currentBrandName || 'Selecione'}</Text>
                        <Text style={styles.pickerTriggerIcon}><FontAwesome name="chevron-down" size={16} color="#000" /></Text>
                    </TouchableOpacity>
                </View>
                <FormField
                    label="Ano"
                    keyboardType="numeric"
                    value={vehicle.year ? String(vehicle.year) : ''}
                    onChangeText={(text: string) => setVehicle({ ...vehicle, year: parseInt(text) || 0 })}
                    placeholder="Ano"
                />

            </FormRow>

            <FormRow>
                <View style={[styles.pickerWrapper, { flex: 1 }]}>
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
                        <Text style={[styles.pickerTriggerText, { color: currentModelName ? Colors.text : Colors.textSecondary }]}>{currentModelName || 'Selecione'}</Text>
                        <Text style={styles.pickerTriggerIcon}><FontAwesome name="chevron-down" size={16} color="#000" /></Text>
                    </TouchableOpacity>
                </View>
            </FormRow>


            <FormRow>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Combustível</Text>
                    <TouchableOpacity style={styles.pickerTrigger} onPress={() => { setSelectedFuel(vehicle.fuel ?? null); setModalVisible(true); }}>
                        <Text style={[styles.pickerTriggerText, { color: vehicle.fuel ? Colors.text : Colors.textSecondary }]}>{vehicle.fuel || 'Selecione'}</Text>
                        <Text style={styles.pickerTriggerIcon}><FontAwesome name="chevron-down" size={16} color="#000" /></Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Uso do veículo</Text>
                    <TouchableOpacity style={styles.pickerTrigger} onPress={() => { setSelectedUsage(vehicle.usage ?? null); setUsageModalVisible(true); }}>
                        {/** ensure we always render a visible string (avoid empty/undefined) */}
                        {(() => {
                            const display = (vehicle.usage && String(vehicle.usage).trim().length > 0) ? String(vehicle.usage) : (selectedUsage ? String(selectedUsage) : 'Selecione');
                            return <Text style={[styles.pickerTriggerText, { color: (vehicle.usage && String(vehicle.usage).trim().length > 0) ? Colors.text : Colors.textSecondary }]}>{display}</Text>;
                        })()}
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
                    value={vehicle.odomether !== undefined ? String(vehicle.odomether) : ''}
                    onChangeText={(text: string) => setVehicle({ ...vehicle, odomether: parseInt(text) || 0 })}
                    placeholder="Odômetro"
                    keyboardType="numeric"
                />
            </FormRow>

            <FormRow>
                <FormField
                    label="Cor"
                    value={vehicle.color}
                    onChangeText={(text: string) => setVehicle({ ...vehicle, color: text })}
                    placeholder="Cor"
                />

                <View style={{ flex: 1 }} />
            </FormRow>

            <ModalSheet
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={() => { if (selectedFuel) { setVehicle({ ...vehicle, fuel: selectedFuel }); } }}
            >
                {Platform.OS === 'ios' ? (
                    <ScrollView style={styles.optionsList}>
                        {fuelTypes.map((ft: FuelTypes) => (
                            <TouchableOpacity
                                key={ft}
                                style={[styles.optionItem, selectedFuel === ft && styles.optionItemSelected]}
                                onPress={() => { setSelectedFuel(ft); /* only select; do not save/close until Confirm */ }}
                            >
                                <Text style={[styles.optionText, selectedFuel === ft && styles.optionTextSelected]}>{ft}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <Picker
                        selectedValue={selectedFuel ?? vehicle.fuel ?? ''}
                        onValueChange={(v) => setSelectedFuel(v as FuelTypes)}
                        style={[styles.pickerLarge, { backgroundColor: '#fff', color: '#000' }]}
                        itemStyle={[styles.pickerItemLarge, { color: '#000' }]}
                        dropdownIconColor="#000"
                    >
                        <Picker.Item label="Selecione" value="" />
                        {fuelTypes.map((ft: FuelTypes) => (
                            <Picker.Item key={ft} label={ft} value={ft} />
                        ))}
                    </Picker>
                )}
            </ModalSheet>
            {/* Usage modal */}
            <ModalSheet
                visible={usageModalVisible}
                onClose={() => setUsageModalVisible(false)}
                onConfirm={() => { if (selectedUsage) { setVehicle({ ...vehicle, usage: selectedUsage }); } }}
            >
                {Platform.OS === 'ios' ? (
                    <ScrollView style={styles.optionsList}>
                        {vehicleUses.map((u: VehicleUses) => (
                            <TouchableOpacity
                                key={u}
                                style={[styles.optionItem, selectedUsage === u && styles.optionItemSelected]}
                                onPress={() => { setSelectedUsage(u); /* only select; save on Confirm */ }}
                            >
                                <Text style={[styles.optionText, selectedUsage === u && styles.optionTextSelected]}>{u}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <Picker
                        selectedValue={selectedUsage ?? vehicle.usage ?? ''}
                        onValueChange={(v) => {
                            const val = v as VehicleUses;
                            setSelectedUsage(val);
                            setVehicle({ ...vehicle, usage: val });
                        }}
                        style={[styles.pickerLarge, { backgroundColor: '#fff', color: '#000' }]}
                        itemStyle={[styles.pickerItemLarge, { color: '#000' }]}
                        dropdownIconColor="#000"
                    >
                        <Picker.Item label="Selecione" value="" />
                        {vehicleUses.map((u: VehicleUses) => (
                            <Picker.Item key={u} label={u} value={u} />
                        ))}
                    </Picker>
                )}
            </ModalSheet>
            {/* Brand modal */}
            <ModalSheet
                visible={brandModalVisible}
                onClose={() => setBrandModalVisible(false)}
                onConfirm={() => {
                    if (selectedBrand) {
                        const found = carBrands.find(x => x.name === selectedBrand);
                        if (found) {
                            setVehicle({ ...vehicle, brand: found.code as any });
                        }
                    }
                }}
            >
                {Platform.OS === 'ios' ? (
                    <ScrollView style={styles.optionsList}>
                        {carBrands.map((b: CarBrand) => (
                            <TouchableOpacity
                                key={b.code}
                                style={[styles.optionItem, selectedBrand === b.name && styles.optionItemSelected]}
                                onPress={() => setSelectedBrand(b.name)}
                            >
                                <Text style={[styles.optionText, selectedBrand === b.name && styles.optionTextSelected]}>{b.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <Picker
                        selectedValue={selectedBrand ?? currentBrandName ?? ''}
                        onValueChange={(v) => setSelectedBrand(v as CarBrandName)}
                        style={[styles.pickerLarge, { backgroundColor: '#fff', color: '#000' }]}
                        itemStyle={[styles.pickerItemLarge, { color: '#000' }]}
                        dropdownIconColor="#000"
                    >
                        <Picker.Item label="Selecione" value="" />
                        {carBrands.map((b: CarBrand) => (
                            <Picker.Item key={b.code} label={b.name} value={b.name} />
                        ))}
                    </Picker>
                )}
            </ModalSheet>
            {/* Model modal */}
            <ModalSheet
                visible={modelModalVisible}
                onClose={() => setModelModalVisible(false)}
                onConfirm={() => {
                    if (selectedModel) {
                        const found = modelOptions.find(m => m.code === selectedModel);
                        setVehicle({ ...vehicle, model: selectedModel || '', model_name: found ? found.name : '' });
                    } else {
                        setVehicle({ ...vehicle, model: '' });
                    }
                }}
            >
                {modelOptions.length === 0 ? (
                    <Text style={styles.noOptionsText}>Nenhum modelo disponível. Preencha Marca, Ano e Combustível corretamente.</Text>
                ) : Platform.OS === 'ios' ? (
                    <ScrollView style={styles.optionsList}>
                        {modelOptions.map((m: ModelOption) => (
                            <TouchableOpacity
                                key={m.code}
                                style={[styles.optionItem, selectedModel === m.code && styles.optionItemSelected]}
                                onPress={() => setSelectedModel(m.code)}
                            >
                                <Text style={[styles.optionText, selectedModel === m.code && styles.optionTextSelected]}>{m.name}</Text>
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
                        {modelOptions.map((m: ModelOption) => (
                            <Picker.Item key={m.code} label={m.name} value={m.code} />
                        ))}
                    </Picker>
                )}
            </ModalSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    formCard: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 14,
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    pickerWrapper: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 14,
        marginBottom: 6,
        color: Colors.textSecondary,
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
        width: '100%',
        color: '#000',
        backgroundColor: '#fff'
    },
    pickerItem: {
        height: 44,
    }
    ,
    pickerTrigger: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 12,
        backgroundColor: Colors.backgroundSecondary,
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
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 1000,
        elevation: 30
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
        zIndex: 1001,
        elevation: 31,
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
        backgroundColor: 'rgba(109,148,197,0.12)'
    },
    optionTextSelected: {
        fontWeight: '700',
        color: Colors.tint
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
