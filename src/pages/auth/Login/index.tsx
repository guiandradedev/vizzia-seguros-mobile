import Colors from "@/constants/Colors";
import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from "@/hooks/useAuth";
import * as LocalAuthentication from 'expo-local-authentication';
import { getSecure } from "@/utils/secure-store";
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from "@expo/vector-icons";
import GoogleAuthComponent from "./components/GoogleAuth";
import Button from "@/components/Button";
import Separator from "@/components/Separator";
import Input from "@/components/Input";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const { signIn, user, loginBiometric, setAuthenticated } = useAuth();

    const router = useRouter();

    const handleAuthentication = useCallback(async () => {
        setIsLoggingIn(true);
        const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!isBiometricEnrolled) {
            setIsLoggingIn(false);
            return Alert.alert('Login', 'Nenhuma biometria encontrada. Por favor, cadastre no dispositivo.');
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login com Biometria',
            fallbackLabel: 'Biometria não reconhecida'
        });

        if (auth.success) {
            const user = await loginBiometric();
            setIsLoggingIn(false);
            if (user) {
                setAuthenticated();
                router.replace('/(app)/(tabs)');
            } else {
                Alert.alert('Erro', 'Credenciais inválidas. Tente novamente.');
            }
        } else {
            setIsLoggingIn(false);
            Alert.alert('Erro', 'Biometria não reconhecida. Tente novamente.');
        }
    }, [loginBiometric, setAuthenticated, router]);

    useEffect(() => {
        const initialize = async () => {
            const storedToken = await getSecure('accessToken');
            setToken(storedToken);
        };
        initialize();
    }, []);

    if (user) {
        return <Redirect href="/(app)/(tabs)" />;
    }

    const handleLogin = useCallback(async () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setIsLoggingIn(true);

        const success = await signIn({ email: trimmedEmail, password });

        setIsLoggingIn(false);

        if (success === false) {
            Alert.alert('Erro', 'Credenciais inválidas. Tente novamente.');
        } else if (success === null) {
            Alert.alert('Erro', 'Erro na autenticação. Por favor, tente novamente mais tarde.');
        } else {
            router.replace('/(app)/(tabs)');
        }
    }, [email, password, signIn, router]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.card}>
                    <Text style={[styles.title, { color: Colors.text }]}>Bem-vindo de volta</Text>

                    <Text style={[styles.subtitle, { color: Colors.text }]}>Faça login para acessar seus veículos e condutores</Text>

                    <Input
                        label="Email"
                        placeholder="Email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        value={email}
                        onChangeText={setEmail}
                        editable={!isLoggingIn}
                        leftIcon={<FontAwesome name="envelope" size={16} color="#666" />}
                    />

                    <Input
                        label="Senha"
                        placeholder="Senha"
                        placeholderTextColor="#999"
                        secureTextEntry
                        autoComplete="password"
                        textContentType="password"
                        value={password}
                        onChangeText={setPassword}
                        editable={!isLoggingIn}
                        leftIcon={<FontAwesome name="lock" size={16} color="#666" />}
                    />

                    <Button title="Entrar" onPress={handleLogin} loading={isLoggingIn} />

                    <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)/register')}>
                        <Text style={styles.secondaryButtonText}>Não tem conta? Cadastre-se</Text>
                    </TouchableOpacity>

                    <Separator text="ou então" />

                    <View style={styles.buttonColumn}>
                        <GoogleAuthComponent />
                        {token && (
                            <Button icon="unlock-alt" onPress={handleAuthentication} title="Desbloquear com biometria" disabled={isLoggingIn} />
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
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
        tintColor: Colors.tint || '#0A84FF',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 18,
    },
    secondaryButton: {
        marginTop: 12,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: Colors.tint || '#0A84FF',
        fontSize: 14,
    },
    buttonColumn: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    }
});