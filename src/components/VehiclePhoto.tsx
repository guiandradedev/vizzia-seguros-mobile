// src/components/VehiclePhoto.tsx
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState } from 'react';

const theme = Colors.light;

interface VehiclePhotoProps {
  photoUri: string;
  onEdit: () => void;
}

export default function VehiclePhoto({ photoUri, onEdit }: VehiclePhotoProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!photoUri) return null;

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);


  return (
    <View style={styles.photoContainer}>
      <Image source={{ uri: photoUri }} style={styles.photo} />
      <TouchableOpacity style={styles.editPhotoButton} onPress={onEdit}>
        <MaterialIcons name="edit" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.expandPhotoButton} onPress={openModal}>
        <MaterialIcons name="fullscreen" size={20} color="#fff" />
      </TouchableOpacity>


      {/* Modal para exibir foto completa */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
            {/* Área para fechar clicando fora */}
            <TouchableOpacity style={styles.modalCloseArea} onPress={closeModal} />

            {/* Botão de fechar no canto superior direito */}
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
            <MaterialIcons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Imagem */}
            <Image 
                source={{ uri: photoUri }} 
                style={styles.expandedPhoto} 
                contentFit="contain" 
            />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

    photo: {
        width: '100%',       // ocupa a largura do wrapper
        aspectRatio: 1.5,    // mantém proporção (ajuste conforme necessidade)
        borderRadius: 12,
        backgroundColor: '#eaeaea',
    },

    expandedPhoto: {
        width: '100%',          // ocupa a largura máxima do modal
        height: '100%',         // ocupa a altura máxima
        resizeMode: 'contain',  // evita distorção
        borderRadius: 0,        // geralmente sem borda para expandida
    },
  editPhotoButton: {
    position: 'absolute',
    bottom: 10,           // distância da borda inferior
    right: 10,            // distância da borda direita
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6D94C5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    elevation: 2,
  },

  expandPhotoButton: {
    position: 'absolute',
    bottom: 10,           // distância da borda inferior
    left: 10,            // distância da borda direita
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6D94C5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    elevation: 2,
  },

   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },

  modalImage: {
    width: '90%',
    height: '90%',
    borderRadius: 12,
    resizeMode: 'contain',
  },

  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
    },
});

