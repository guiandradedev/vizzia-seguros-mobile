import { ColorTheme } from "@/constants/Colors";
import { View, Text, StyleSheet } from "react-native";

interface SeparatorProps {
    colors: ColorTheme
    text: string;
}

export default function Separator({ colors, text }: SeparatorProps) {
    const styles = StyleSheet.create({
        separator: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 18,
        },
        separatorLine: {
            flex: 1,
            height: 1,
            backgroundColor: colors.border,
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