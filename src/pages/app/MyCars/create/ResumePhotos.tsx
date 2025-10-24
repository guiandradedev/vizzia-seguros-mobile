import Colors from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

export default function ResumePhotos() {

    return (
        <View
            style={[
                styles.safeArea,
                { backgroundColor: Colors.background }
            ]}
        >
            <Text>Resume Vehicle Page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});