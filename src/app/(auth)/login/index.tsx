import Colors from "@/constants/Colors";
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Link, Redirect, useRouter } from 'expo-router';
import { useAuth } from "@/hooks/useAuth";
import * as LocalAuthentication from 'expo-local-authentication';
import { getSecure, saveSecure } from "@/utils/secure-store";
import { FontAwesome } from "@expo/vector-icons";
import { GoogleSignin, User, isSuccessResponse } from '@react-native-google-signin/google-signin'
import api from "@/lib/axios";
import { ResponseSocialAuthUserNotExistsAPI, useLogin } from "@/contexts/LoginContext";
import axios, { AxiosResponse } from "axios";
import { Tokens } from "@/types/auth";
import env from "@/utils/env";
GoogleSignin.configure({
    iosClientId: env.GOOGLE_IOS_CLIENT_ID,
    webClientId: env.GOOGLE_ANDROID_CLIENT_ID
})

const theme = Colors.light;

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [token, setToken] = useState<string | null>(null)
    const { changeInitialData } = useLogin()
    const { signIn, user, loginBiometric, setAuthenticated, handleLoginWithProvider } = useAuth();

    async function handleGoogleSignIn() {
        try {
            await GoogleSignin.hasPlayServices() // verifica se ta disponivel
            const response = await GoogleSignin.signIn()

            if (response && response.data?.idToken) {
                const result = await handleLoginWithProvider!({ provider: 'Google', token: response.data.idToken || '' });

                if(result === true) {
                    router.replace("/(app)/(tabs)");
                    return;
                }

                if(result) {
                    changeInitialData(result);
                    router.replace("/(auth)/login/social-register");
                    return
                }

                Alert.alert('Erro', 'Não foi possível fazer login com o Google. Tente novamente.');
            } else {
                Alert.alert('Erro', 'Não foi possível fazer login com o Google. Tente novamente.');
            }

        } catch (error) {
            console.error('Google Sign-In Error:', error);
            Alert.alert('Erro', 'Não foi possível fazer login com o Google. Tente novamente.');
        }
    }


    const router = useRouter();

    async function verifyAvaiableAuthentication() {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        console.log(compatible);

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        console.log(types.map(type => LocalAuthentication.AuthenticationType[type]));
    }

    async function handleAuthentication() {
        setIsLoggingIn(true)
        const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!isBiometricEnrolled) {
            setIsLoggingIn(false)
            return Alert.alert('Login', 'Nenhuma biometria encontrada. Por favor, cadastre no dispositivo.');
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login com Biometria',
            fallbackLabel: 'Biometria não reconhecida'
        });

        if (auth.success) {
            const user = await loginBiometric()

            setIsLoggingIn(false)
            if (user) {
                setAuthenticated()
                router.replace('/(app)/(tabs)');
            } else {
                Alert.alert('Erro', 'Credenciais inválidas. Tente novamente.');
                return
            }
        } else {
            setIsLoggingIn(false)
            Alert.alert('Erro', 'Biometria não reconhecida. Tente novamente.');
            return
        }
    }

    useEffect(() => {
        async function getToken() {
            setToken(await getSecure('accessToken'))
        }
        getToken()
        verifyAvaiableAuthentication();

    }, []);

    if (user) {
        return <Redirect href="/(app)/(tabs)" />;
    }

    const handleLogin = async () => {
        console.log(email, password)
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setIsLoggingIn(true);

        const success = await signIn({ email: email.replace(" ", ""), password });

        setIsLoggingIn(false);

        if (!success) {
            Alert.alert('Erro', 'Credenciais inválidas. Tente novamente.');
            return
        }

        router.replace('/(app)/(tabs)');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Bem-vindo de volta</Text>

                <Text style={styles.subtitle}>Faça login para acessar seus veículos e condutores</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoggingIn}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!isLoggingIn}
                />

                <TouchableOpacity style={[styles.primaryButton, isLoggingIn && styles.buttonDisabled]} onPress={handleLogin} disabled={isLoggingIn}>
                    {isLoggingIn ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Entrar</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)/register')}>
                    <Text style={styles.secondaryButtonText}>Não tem conta? Cadastre-se</Text>
                </TouchableOpacity>

                <View style={styles.separator}>
                    <View style={styles.separatorLine} />
                    <Text style={styles.separatorText}>ou então</Text>
                    <View style={styles.separatorLine} />
                </View>

                <View style={styles.buttonColumn}>
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

                    {token && (
                        <TouchableOpacity
                            style={[styles.biometricButton, isLoggingIn && styles.buttonDisabled]}
                            onPress={handleAuthentication}
                            accessibilityLabel="Entrar com biometria"
                            activeOpacity={0.8}
                            disabled={isLoggingIn}
                        >
                            <FontAwesome name="unlock-alt" size={18} color="#fff" style={styles.biometricIcon} />
                            <Text style={styles.biometricText}>{isLoggingIn ? 'Processando...' : 'Biometria'}</Text>
                        </TouchableOpacity>
                    )}


                </View>
            </View>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        padding: 10,
        width: '100%',
        maxWidth: 420,
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 18,
    },
    input: {
        height: 50,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    primaryButton: {
        backgroundColor: theme.tint || '#0A84FF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    secondaryButton: {
        marginTop: 12,
        alignItems: 'center',
    },
    secondaryButtonText: {
        // color: Colors.light.tint || '#0A84FF',
        fontSize: 14,
    },
    ghostButton: {
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        fontSize: 14,
        color: '#444',
        flexDirection: 'row',
    },
    ghostButtonText: {
        color: '#444',
        fontSize: 14,
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    link: {
        marginTop: 15,
        color: '#007AFF',
        textAlign: 'center',
        fontSize: 14,
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 18,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.border || '#E0E0E0',
    },
    separatorText: {
        marginHorizontal: 12,
        fontSize: 13,
        color: '#8F9BB3',
        textTransform: 'lowercase',
        fontWeight: '600',
    },
    buttonColumn: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
    socialButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.border || '#E0E0E0',
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

    biometricButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.tint || '#0A84FF',
        paddingVertical: 12,
        borderRadius: 10,
    },
    biometricIcon: {
        marginRight: 8,
    },
    biometricText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});