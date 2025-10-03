import Colors from "@/constants/Colors";
import React, { useState } from 'react';
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
import { Link, Redirect } from 'expo-router';
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Consome o hook de autenticação
    const { signIn, user } = useAuth();

    // Se o usuário já estiver logado, redireciona imediatamente para o app principal
    // Isso é um fallback, pois o app/_layout já deveria ter feito o redirecionamento
    if (user) {
        return <Redirect href="/(app)/(tabs)" />;
    }

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setIsLoggingIn(true);

        // Chama a função de login do seu contexto
        const success = await signIn({ username: email, password });

        setIsLoggingIn(false);

        if (success) {
            // O redirecionamento real acontece via estado do Contexto no app/_layout.tsx,
            // mas podemos adicionar uma confirmação visual aqui.
            Alert.alert('Sucesso', 'Login realizado com êxito!');
            // Não precisa de redirect manual aqui, pois a mudança no estado de 'user' no useAuth
            // acionará o Redirect no app/_layout.tsx.
        } else {
            // Mensagem de erro que viria da API
            Alert.alert('Erro', 'Credenciais inválidas. Tente novamente.');
        }
    };

    return (
        // Usa KeyboardAvoidingView para evitar que o teclado esconda os inputs
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Text style={styles.title}>Bem-vindo de volta!</Text>

            {/* Input de Email */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
            // value={email}
            // onChangeText={setEmail}
            // editable={!isLoggingIn}
            />

            {/* Input de Senha */}
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry
            // value={password}
            // onChangeText={setPassword}
            // editable={!isLoggingIn}
            />

            {/* Botão de Login */}
            <View style={styles.buttonContainer}>
                <Button
                    title="Login"
                // title={isLoggingIn ? 'Entrando...' : 'Entrar'}
                // onPress={handleLogin}
                // disabled={isLoggingIn}
                />
            </View>

            {/* Link para cadastro (usa o nome do arquivo register.tsx) */}
            <Link href="/(auth)/register" style={styles.link}>
                Não tem conta? Cadastre-se
            </Link>
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