import Colors from "@/constants/Colors";
import React, { useCallback, useEffect, useState } from 'react';
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
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from "@/hooks/useAuth";
import * as LocalAuthentication from 'expo-local-authentication';
import { getSecure } from "@/utils/secure-store";
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from "@expo/vector-icons";
import GoogleAuthComponent from "./components/GoogleAuth";

const theme = Colors.light;

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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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
                    autoComplete="email"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoggingIn}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#999"
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
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
                    <GoogleAuthComponent />
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
        color: theme.tint || '#0A84FF',
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
    biometricButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.tint || '#0A84FF',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 12,
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