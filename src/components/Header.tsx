import { StyleSheet, Text, View } from "react-native"

interface HeaderProps {
    title: string,
    subtitle: string
}

export default function Header({ title, subtitle }: HeaderProps) {
    return (
        <View style={styles.header}>
        <Text style={styles.headerText}>
            {title}
        </Text>
        <Text style={styles.headerSubTitle}>
            {subtitle}
        </Text>
        </View>
    )
}


const styles = StyleSheet.create({
  headerText: {
    fontSize: 32,
    fontWeight: 'medium',
    fontFamily: "Roboto-Medium",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  headerSubTitle: {
    fontSize: 16,
    fontWeight: 'regular',
    fontFamily: "Roboto-Regular",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  header: {
    paddingVertical: 16
  }
});