import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { useCreateVehicle } from '@/hooks/useCreateVehicle';
import api from '@/lib/axios';
import { commonStyles } from '@/styles/CommonStyles';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';

interface EstimatedPriceResponse {
    estimated_price: number;
}

export default function Finalize() {
    const router = useRouter();
    const { vehicle } = useCreateVehicle();
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [finalizing, setFinalizing] = useState(false);

    useEffect(() => {
        async function fetchEstimatedPrice() {
            try {
                const response = await api.post<EstimatedPriceResponse>(`/vehicle/step/4`);
                setEstimatedPrice(response.data.estimated_price);
            } catch (error) {
                console.error('Erro ao buscar preço estimad aa:', error);
                if(axios.isAxiosError(error) && error.response?.data?.message) {
                    console.log("Payload de erro:", error.response.data);
                    Alert.alert('Erro', error.response.data.message);
                } else {
                    Alert.alert('Erro', 'Não foi possível calcular o preço do seguro. Tente novamente.');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchEstimatedPrice();
    }, [vehicle.id]);

    function handleBack() {
        router.back();
    }

    async function handleFinalize() {
        setFinalizing(true);
        try {
            await api.post(`/vehicle/finalize`);
            Alert.alert(
                'Sucesso!',
                'Sua solicitação de seguro foi enviada com sucesso. Você será notificado em breve.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/(app)/(tabs)/my-cars')
                    }
                ]
            );
        } catch (error) {
            console.error('Erro ao finalizar:', error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                Alert.alert('Erro', error.response.data.message);
            } else {
                Alert.alert('Erro', 'Não foi possível finalizar a solicitação. Tente novamente.');
            }
        } finally {
            setFinalizing(false);
        }
    }

    function formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Calculando preço do seguro...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.safeArea, { backgroundColor: Colors.background }]}>
            <ScrollView
                contentContainerStyle={[commonStyles.scrollContent, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={commonStyles.title}>Cotação Final</Text>

                <Text style={commonStyles.subtitle}>
                    Aqui está o valor estimado do seu seguro baseado nas informações fornecidas.
                </Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Valor Total do Seguro</Text>
                    <Text style={styles.priceValue}>
                        {estimatedPrice !== null ? formatCurrency(estimatedPrice) : 'N/A'}
                    </Text>
                    <Text style={styles.priceNote}>
                        *Este valor é uma estimativa e pode sofrer alterações após análise completa.
                    </Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>O que acontece agora?</Text>
                    <Text style={styles.infoText}>
                        • Sua solicitação será analisada pela nossa equipe{'\n'}
                        • Você receberá uma proposta detalhada por email{'\n'}
                        • O pagamento será processado apenas após sua aprovação{'\n'}
                        • A apólice será emitida digitalmente
                    </Text>
                </View>

                <View style={commonStyles.footer}>
                    <View style={commonStyles.footerRow}>
                        <Button
                            onPress={handleBack}
                            title="Voltar"
                            variant="outline"
                            disabled={finalizing}
                        />
                        <Button
                            onPress={handleFinalize}
                            title={finalizing ? "Finalizando..." : "Confirmar Solicitação"}
                            variant="primary"
                            disabled={finalizing}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    priceContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        marginVertical: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    priceLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
    },
    priceValue: {
        fontSize: 36,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 8,
    },
    priceNote: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    infoContainer: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
});