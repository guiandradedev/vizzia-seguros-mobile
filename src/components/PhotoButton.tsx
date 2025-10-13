import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const theme = Colors.light;

interface PhotoButtonProps {
  photoUri?: string;
  title?: string;
  size?: number;
  onPress: () => void;
}

export default function PhotoButton({ photoUri, title, size = 150, onPress }: PhotoButtonProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TouchableOpacity
        style={[styles.button, { width: size, height: size }]}
        onPress={onPress}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <MaterialIcons name="camera-alt" size={size / 2} color="#6D94C5" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    marginBottom: 5,
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.tabBackground,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
