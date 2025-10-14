import Colors from "@/constants/Colors";
import React, { useState } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from "@/hooks/useAuth";
import { FontAwesome } from "@expo/vector-icons";
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useLogin } from "@/contexts/LoginContext";
import env from "@/utils/env";

GoogleSignin.configure({
    iosClientId: env.GOOGLE_IOS_CLIENT_ID,
    webClientId: env.GOOGLE_WEB_CLIENT_ID,
    // offlineAccess: true, 
})

export default function GoogleAuthComponent() {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { changeInitialData } = useLogin()
    const { handleLoginWithProvider } = useAuth();

    async function handleGoogleSignIn() {
        try {
            setIsLoggingIn(true)
            await GoogleSignin.hasPlayServices() // verifica se ta disponivel
            const response = await GoogleSignin.signIn()

            if (response && response.data?.idToken) {
                const result = await handleLoginWithProvider!({ provider: 'Google', token: response.data.idToken || '' });

                console.log(result)

                if (result === true) {
                    router.replace("/(app)/(tabs)");
                    return;
                }

                if (result) {
                    Alert.alert(
                        'Conta não linkada',
                        'Este email não está associado a nenhuma conta. Deseja criar uma nova conta? Caso deseje associar a conta, realize o login e entre em seu perfil.',
                        [
                            {
                                text: 'Cadastrar',
                                onPress: () => {
                                    changeInitialData(result);
                                    router.replace("/(auth)/login/social-register");
                                }
                            },
                            {
                                text: 'Logar manualmente',
                            }
                        ]
                    );
                    return;
                }

                Alert.alert('Erro', 'Não foi possível fazer login com o Google. Tente novamente.');
            } else {
                console.log(response.data)
                Alert.alert('Erro', 'Não foi possível fazer login com o Google. Tente novamente.');
            }

        } catch (error) {
            console.error('Google Sign-In Error:', error);
            Alert.alert('Erro', 'Não foi possível fazer login com o Google. Tente novamente.');
        } finally {
            setIsLoggingIn(false)
        }
    }


    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            accessibilityLabel="Entrar com Google"
            activeOpacity={0.8}
            disabled={isLoggingIn}
        >
            <FontAwesome name="google" size={20} color="#DB4437" style={styles.socialIcon} />
            <Text style={styles.socialText}>Entrar com Google</Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    socialButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.border || '#E0E0E0',
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        marginBottom: 12,
    },
    socialIcon: {
        marginRight: 8,
    },
    socialText: {
        color: '#222',
        fontSize: 14,
        fontWeight: '600',
    },
});