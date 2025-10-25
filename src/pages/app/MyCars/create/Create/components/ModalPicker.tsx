import ModalSheet from "@/components/ModalSheet";
import { Picker } from "@react-native-picker/picker";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

interface ModalPickerProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: any[] | ReadonlyArray<any>;
    selected: any;
    onChange: (value: any) => void;
}

export default function ModalPicker(props: ModalPickerProps) {
    return (
        <ModalSheet
            visible={props.visible}
            onClose={props.onClose}
            onConfirm={props.onConfirm}
        >
            {Platform.OS === 'ios' ? (
                <ScrollView style={styles.optionsList}>
                    {props.data.map((u) => (
                        <TouchableOpacity
                            key={u}
                            style={[styles.optionItem, props.selected === u && styles.optionItemSelected]}
                            onPress={props.onChange.bind(null, u)}
                        >
                            <Text style={[styles.optionText, props.selected === u && styles.optionTextSelected]}>{u}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : (
                <Picker
                    selectedValue={props.selected}
                    onValueChange={props.onChange}
                    style={[styles.pickerLarge, { backgroundColor: '#fff', color: '#000' }]}
                    itemStyle={[styles.pickerItemLarge, { color: '#000' }]}
                    dropdownIconColor="#000"
                >
                    <Picker.Item label="Selecione" value="" />
                    {props.data.map((u) => (
                        <Picker.Item key={u} label={u} value={u} />
                    ))}
                </Picker>
            )}
        </ModalSheet>
    )
}


const styles = StyleSheet.create({
    pickerLarge: {
        width: '100%',
        height: 180,
    },
    pickerItemLarge: {
        height: 48,
        fontSize: 18
    },
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
    },
    optionItemSelected: {
        backgroundColor: '#e8f0ff'
    },
    optionTextSelected: {
        fontWeight: '700',
        color: '#0a3d8f'
    }
});
