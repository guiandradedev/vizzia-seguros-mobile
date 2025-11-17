import { Insurance, Vehicle } from "@/types/auth";
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

interface VehicleProps {
  vehicle: Insurance;
}

export default function VehicleComponent({ vehicle }: VehicleProps) {
  const router = useRouter();

  const handleOpen = () => {
    router.push(`/(app)/(tabs)/my-cars/${vehicle.id_insurance}` as any);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusLabel = (status?: string): string => {
    if (!status) return 'Desconhecido';
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'denied':
        return 'Negado';
      case 'cancel':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status?: string): string => {
    if (!status) return '#64748b';
    switch (status.toLowerCase()) {
      case 'pending':
        return '#F59E0B'; // Amarelo para pendente
      case 'approved':
        return '#10B981'; // Verde para aprovado
      case 'denied':
        return '#EF4444'; // Vermelho para negado
      case 'cancel':
        return '#6B7280'; // Cinza para cancelado
      default:
        return '#64748b';
    }
  };

  return (
    <TouchableOpacity onPress={handleOpen} style={styles.container} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.vehicleIcon}>
          <FontAwesome name="car" size={24} color="#6D94C5" />
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(vehicle.status)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {vehicle.vehicle.brand} {vehicle.vehicle.model_name ?? vehicle.vehicle.model}
        </Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <MaterialIcons name="calendar-today" size={16} color="#64748b" />
            <Text style={styles.detailText}>{vehicle.vehicle.year}</Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="palette" size={16} color="#64748b" />
            <Text style={styles.detailText}>{vehicle.vehicle.color || '—'}</Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="confirmation-number" size={16} color="#64748b" />
            <Text style={styles.detailText}>{vehicle.vehicle.plate}</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Valor Anual</Text>
          <Text style={styles.priceValue}>
            {vehicle.estimated_price ? formatCurrency(vehicle.estimated_price) : '—'}
          </Text>
        </View>
      </View>

      <View style={styles.chevron}>
        <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 6,
    fontWeight: '500',
  },
  priceSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
  },
  chevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  // Estilos antigos mantidos para compatibilidade
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 72,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#eee'
  },
  info: {
    fontSize: 13,
    color: '#666',
  },
  plate: {
    marginTop: 6,
    fontSize: 13,
    color: '#444',
    fontWeight: '500'
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#e33',
    marginRight: 8,
    alignSelf: 'center'
  }
});