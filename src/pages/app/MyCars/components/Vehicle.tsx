import { Vehicle } from "@/types/auth";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';

interface VehicleProps {
  vehicle: Vehicle;
}

export default function VehicleComponent({ vehicle }: VehicleProps) {
  const router = useRouter();

  const handleOpen = () => {
    // rota dinâmica: /(app)/(tabs)/my-cars/[id]
    // cast any para evitar checagem estrita das rotas geradas
    router.push(`/(app)/(tabs)/my-cars/${vehicle.id}` as any);
  }

  return (
    <TouchableOpacity onPress={handleOpen} style={styles.container} activeOpacity={0.8}>
      <View style={styles.row}>
  <Image source={{ uri: 'https://via.placeholder.com/144x96.png?text=Car' }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title}>{vehicle.brand} {vehicle.model}</Text>
          <Text style={styles.info}>Ano: {vehicle.year} • Cor: {vehicle.color}</Text>
          <Text style={styles.plate}>Placa: {vehicle.plate}</Text>
        </View>

        <View style={styles.chevron}>
          <Text style={{ color: '#888' }}>{'>'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
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
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
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
  chevron: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center'
  }
});