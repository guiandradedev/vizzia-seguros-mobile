import Colors from "@/constants/Colors";
import { useLogin } from "@/contexts/LoginContext";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { jwtDecode } from "jwt-decode";
import axios, { AxiosResponse } from "axios";
import { axiosNoAuth } from "@/lib/axios";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Tokens } from "@/types/auth";
import { saveSecure } from "@/utils/secure-store";

type CreateUserSocialTokenDecode = {
    sub: number,
    type: string,
    provider: string,
    provider_email: string,
    name: string,
}

const theme = Colors.light
export default function SocialRegisterScreen() {
    const [isCreatingAccount, setisCreatingAccount] = useState(false);
    const { user, initialData, changeUserProperty } = useLogin();
    const router = useRouter()
    const { setAuthenticated } = useAuth()

    async function handleCreateAccount() {
        setisCreatingAccount(true);

        if (!user?.email || !user?.nome || !initialData?.createusersocialtoken || !initialData?.provider) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Dados incompletos. Por favor, verifique suas informações.");
            return;
        }

        let decoded: CreateUserSocialTokenDecode | undefined;
        try {
            decoded = jwtDecode(initialData.createusersocialtoken) as CreateUserSocialTokenDecode;
        } catch (err) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Token inválido. Por favor, tente novamente.");
            return;
        }

        if (!decoded) {
            setisCreatingAccount(false);
            Alert.alert("Erro", "Token inválido. Por favor, tente novamente.");
            return;
        }

        try {

            const response: AxiosResponse<Tokens> = await axiosNoAuth.post('/social-auth/register', {
                email: user.email,
                name: user.nome,
                provider: decoded.provider,
                provider_email: decoded.provider_email,
                id_provider: decoded.sub,
                passwordHash: user.passwordHash
            }, {
                headers: {
                    Authorization: `Bearer ${initialData.createusersocialtoken}`,
                }
            })

            console.log("resposta", response)
            const { accessToken, refreshToken } = response.data

            await saveSecure('accessToken', accessToken)
            await saveSecure('refreshToken', refreshToken)

            setAuthenticated()
            router.replace('/(app)/(tabs)');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log("axios", err.response?.data ?? err.message);
            } else if (err instanceof Error) {
                console.log("erro", err.message);
            } else {
                console.log(String(err));
            }

            setisCreatingAccount(false);
            Alert.alert("Erro", "Falha ao criar conta. Por favor, tente novamente.");
        }
    }

    return <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <View style={styles.card}>
            <Text style={styles.title}>Cadastro de usuário</Text>

            <Text style={styles.subtitle}>Complete suas informações para finalizar seu cadastro</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={user?.nome}
                onChangeText={(value)=>changeUserProperty('nome', value)}
                editable={!isCreatingAccount}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={user?.email}
                onChangeText={(value)=>changeUserProperty('email', value)}
                editable={!isCreatingAccount}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry
                value={user?.passwordHash}
                onChangeText={(value)=>changeUserProperty('passwordHash', value)}
                editable={!isCreatingAccount}
            />

            <TouchableOpacity style={[styles.primaryButton, isCreatingAccount && styles.buttonDisabled]} onPress={handleCreateAccount}>
                {isCreatingAccount ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Finalizar Cadastro</Text>}
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
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