import Colors from '@/constants/Colors';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function ModalSheet({ visible, onClose, onConfirm, children, title }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
        <SafeAreaView style={styles.modalSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.modalHeaderRow}>
            <TouchableOpacity onPress={onClose} style={[styles.headerButton, styles.headerButtonCancel]}>
              <Text style={[styles.modalAction, styles.cancelText]}>Cancelar</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer} pointerEvents="none">
              <Text style={styles.titleText}>{title ?? ''}</Text>
            </View>
            <TouchableOpacity onPress={() => { onConfirm && onConfirm(); onClose(); }} style={[styles.headerButton, styles.headerButtonConfirm]}>
              <Text style={[styles.modalAction, styles.confirmText]}>Confirmar</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.pickerContainer, styles.pickerContainerInner]}>
            {children}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 1000,
    elevation: 30,
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
    maxHeight: '60%',
    zIndex: 1001,
    elevation: 31,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  sheetHandle: {
    height: 5,
    width: 60,
    alignSelf: 'center',
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  headerButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonCancel: {
    backgroundColor: 'transparent',
  },
  headerButtonConfirm: {
    backgroundColor: 'transparent',
  },
  modalAction: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    color: Colors.textSecondary,
  },
  confirmText: {
    color: Colors.tint,
  },
  pickerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  pickerContainerInner: {
    backgroundColor: '#f2f2f4',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});
