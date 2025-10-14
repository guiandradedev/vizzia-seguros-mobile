import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

interface SeparatorProps {
    text: string;
}

export default function Separator({ text }: SeparatorProps) {
    const styles = StyleSheet.create({
        separator: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 18,
        },
        separatorLine: {
            flex: 1,
            height: 1,
            backgroundColor: Colors.border,
        },
        separatorText: {
            marginHorizontal: 12,
            fontSize: 13,
            color: '#8F9BB3',
            textTransform: 'lowercase',
            fontWeight: '600',
        },
    });

    return (
        <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>{text}</Text>
            <View style={styles.separatorLine} />
        </View>
    )
}