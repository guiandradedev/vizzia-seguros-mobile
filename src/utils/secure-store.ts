import * as SecureStore from 'expo-secure-store';

// Função para salvar o token
export async function saveSecure(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
}

// Função para recuperar o token
export async function getSecure(key: string) {
  try {
    const token = await SecureStore.getItemAsync(key);
    return token || null
  } catch (error) {
    return null;
  }
}

// Função para deletar o token
export async function deleteSecure(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Erro ao deletar token:', error);
  }
}