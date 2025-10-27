import FormField from "@/components/FormField";
import FormRow from "@/components/FormRow";
import { CarBrand, CarBrandName, carBrands, fuelTypes, FuelTypes, vehicleUses, VehicleUses } from '@/contexts/CreateVehicleContext';
import { useCreateVehicle } from "@/hooks/useCreateVehicle";
import { axiosIA } from "@/lib/axios";
import { commonStyles } from "@/styles/CommonStyles";
import { FontAwesome } from "@expo/vector-icons";

import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ModalPicker from "./ModalPicker";

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
            // calcula o índice do combustível em fuelTypes e soma 1
            const fuelIndex = fuelTypes.findIndex((ft: FuelTypes) => ft === fuel);
            const fuel_code = fuelIndex >= 0 ? fuelIndex + 1 : null;

            const body = { brand_code: brand, year_code: `${year}-${fuel_code}` };
            const response = await axiosIA.post(`/get_models_by_year`, body);
            return response.data as [{ code: string; name: string }];
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

    // Resolve o nome do modelo atual. Preferimos procurar pelo `model_code` (código usado para a API).
    // Se não existir `model_code`, caímos para `vehicle.model` (nome legível) para compatibilidade retroativa.
    const currentModelName: string | undefined =
        modelOptions.find(item => item.code === (vehicle as any).model_code)?.name
        ?? modelOptions.find(item => item.name === vehicle.model)?.name
        ?? (vehicle.model && String(vehicle.model).length > 0 ? String(vehicle.model) : undefined);

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
                    <TouchableOpacity style={styles.pickerTrigger} onPress={() => { setSelectedBrand((currentBrandName ?? null) as CarBrandName | null); setBrandModalVisible(true); }}>
                        <Text style={[styles.pickerTriggerText, { color: currentBrandName ? '#000' : '#888' }]}>{currentBrandName || 'Selecione'}</Text>
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
                                // set the selected value to the model's display name (ModalPicker works with display strings)
                                // Prefer using the model_code to lookup the display name; fall back to stored model name.
                                const currentName = modelOptions.find(m => m.code === (vehicle as any).model_code)?.name ?? vehicle.model ?? '';
                                setSelectedModel(currentName || null);
                                setModelModalVisible(true);
                            }}
                    >
                            <Text style={[styles.pickerTriggerText, { color: currentModelName ? '#000' : '#888' }]}>{currentModelName || 'Selecione'}</Text>
                        <Text style={styles.pickerTriggerIcon}><FontAwesome name="chevron-down" size={16} color="#000" /></Text>
                    </TouchableOpacity>
                </View>
            </FormRow>


            <FormRow>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Combustível</Text>
                    <TouchableOpacity style={styles.pickerTrigger} onPress={() => { setSelectedFuel(vehicle.fuel ?? null); setModalVisible(true); }}>
                        <Text style={[styles.pickerTriggerText, { color: vehicle.fuel ? '#000' : '#888' }]}>{vehicle.fuel || 'Selecione'}</Text>
                        <Text style={styles.pickerTriggerIcon}><FontAwesome name="chevron-down" size={16} color="#000" /></Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Uso do veículo</Text>
                    <TouchableOpacity style={styles.pickerTrigger} onPress={() => { setSelectedUsage(vehicle.usage ?? null); setUsageModalVisible(true); }}>
                        {/** ensure we always render a visible string (avoid empty/undefined) */}
                        {(() => {
                            const display = (vehicle.usage && String(vehicle.usage).trim().length > 0) ? String(vehicle.usage) : (selectedUsage ? String(selectedUsage) : 'Selecione');
                            return <Text style={[styles.pickerTriggerText, { color: (vehicle.usage && String(vehicle.usage).trim().length > 0) ? '#000' : '#888' }]}>{display}</Text>;
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

            <ModalPicker
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={() => { if (selectedFuel) { setVehicle({ ...vehicle, fuel: selectedFuel }); } }}
                data={fuelTypes}
                selected={selectedFuel}
                onChange={setSelectedFuel}
            />

            <ModalPicker
                visible={usageModalVisible}
                onClose={() => setUsageModalVisible(false)}
                onConfirm={() => { if (selectedUsage) { setVehicle({ ...vehicle, usage: selectedUsage }); } }}
                data={vehicleUses}
                selected={selectedUsage}
                onChange={setSelectedUsage}
            />

            <ModalPicker
                visible={brandModalVisible}
                onClose={() => setBrandModalVisible(false)}
                onConfirm={() => {
                    if (selectedBrand) {
                        const found = carBrands.find((x: CarBrand) => x.name === selectedBrand);
                        if (found) {
                            setVehicle({ ...vehicle, brand: found.code });
                        }
                    }
                }}
                data={carBrands.map((b: CarBrand) => b.name)}
                selected={selectedBrand}
                onChange={(v) => setSelectedBrand(v as CarBrandName)}
            />

            <ModalPicker
                visible={modelModalVisible}
                onClose={() => setModelModalVisible(false)}
                onConfirm={() => {
                    if (selectedModel) {
                        // selectedModel here is the model name (display). Map it back to the code.
                        const found = modelOptions.find(m => m.name === selectedModel);
                        // store human-readable model name in `model`, keep code in `model_code`
                        setVehicle({ ...vehicle, model: found ? found.name : selectedModel, model_name: found ? found.name : selectedModel, model_code: found ? found.code : selectedModel });
                    } else {
                        setVehicle({ ...vehicle, model: '' });
                    }
                }}
                data={modelOptions.map((m: ModelOption) => m.name)}
                selected={selectedModel}
                onChange={(v) => setSelectedModel(String(v))}
            />
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
        width: '100%',
        color: '#000',
        backgroundColor: '#fff'
    },
    pickerItem: {
        height: 44,
    },
    pickerTrigger: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 12,
        backgroundColor: '#fff',
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
    disabledTrigger: {
        opacity: 0.6
    },
});
