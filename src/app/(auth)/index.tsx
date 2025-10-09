import Colors from "@/constants/Colors";
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Link, Redirect, useRouter } from 'expo-router';
import { useAuth } from "@/hooks/useAuth";
import * as LocalAuthentication from 'expo-local-authentication';
import { getSecure } from "@/utils/secure-store";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [token, setToken] = useState<string | null>(null)

    const router = useRouter();

    const { signIn, user, loginBiometric, setAuthenticated } = useAuth();

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
            return Alert.alert('Login', 'Nenhuma biometria encontrada. Por favor, cadastre no dispositivo.');
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login com Biometria',
            fallbackLabel: 'Biometria não reconhecida'
        });

        const user = await loginBiometric()

        setIsLoggingIn(false)
        if (user) {
            setAuthenticated()
            router.replace('/(app)/(tabs)');
        } else {
            Alert.alert('Erro', 'Credenciais inválidas. Tente novamente.');
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

        const success = await signIn({ email, password });

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
            <Text style={styles.title}>Bem-vindo de volta!</Text>

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

            <View style={styles.buttonContainer}>
                <Button
                    title={isLoggingIn ? 'Entrando...' : 'Entrar'}
                    onPress={handleLogin}
                    disabled={isLoggingIn}
                />
            </View>

            <Link href="/(auth)/register" style={styles.link}>
                Não tem conta? Cadastre-se
            </Link>

            {
                token && (
                    <Button
                        title={"Usar biometria"}
                        onPress={handleAuthentication}
                        disabled={isLoggingIn}
                    />
                )
            }
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 40,
        textAlign: 'center',
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
    buttonContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    link: {
        marginTop: 15,
        color: '#007AFF',
        textAlign: 'center',
        fontSize: 14,
    }
});