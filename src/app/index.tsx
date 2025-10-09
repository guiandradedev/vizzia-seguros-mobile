import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, Text } from 'react-native';
import Colors from '@/constants/Colors';
import { useState } from 'react';

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, Button, Alert } from 'react-native';
// import * as LocalAuthentication from 'expo-local-authentication';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.light.background 
      }}>
        <Text style={{ fontSize: 18, color: Colors.light.text }}>Carregando...</Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}

//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   async function verifyAvaiableAuthentication() {
//     const compatible = await LocalAuthentication.hasHardwareAsync();
//     console.log(compatible);

//     const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
//     console.log(types.map(type => LocalAuthentication.AuthenticationType[type]));
//   }

// async function handleAuthentication() {
//   const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

//   if (!isBiometricEnrolled) {
//     return Alert.alert('Login', 'Nenhuma biometria encontrada. Por favor, cadastre no dispositivo.');
//   }

//   const auth = await LocalAuthentication.authenticateAsync({
//     promptMessage: 'Login com Biometria',
//     fallbackLabel: 'Biometria não reconhecida'
//   });

//   setIsAuthenticated(auth.success);
// }

//   useEffect(() => {
//     verifyAvaiableAuthentication();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text>
//         Usuário conectado: {isAuthenticated ? 'Sim' : 'Não'}
//       </Text>

//       <Button 
//         title='teste'
//         onPress={handleAuthentication}
//       />
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 30,
//         backgroundColor: '#fff',
//     },
// });