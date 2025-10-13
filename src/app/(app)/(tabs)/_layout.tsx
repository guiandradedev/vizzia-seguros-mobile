import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { CreateVehicleProvider } from '@/contexts/CreateVehicleContext';

export default function TabLayout() {
    const theme = Colors.light;

    return (
        <CreateVehicleProvider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#6D94C5',
                    tabBarStyle: {
                        height: 93,
                        paddingTop: 10,
                        paddingBottom: 10,
                        backgroundColor: theme.background,
                        // borderWidth: 2,
                        borderColor: theme.border,
                        borderStyle: 'solid',
                        borderTopWidth: 2,
                        

                    },

                    headerShown: false,
                    headerStyle: { backgroundColor: theme.background }
                }}
            >
                <Tabs.Screen
                    name="my-cars/index"
                    options={{
                        title: 'Meus Carros',
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="car" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Início', // Título que aparece na aba
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="assistance/index"
                    options={{
                        title: 'Assistência',
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="help/index"
                    options={{
                        title: 'Ajuda',
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="info-circle" color={color} />,
                    }}
                />

                {/* Rotas invisiveis na tab */}
                <Tabs.Screen
                    name="my-cars/create"
                    options={{
                        title: 'Cadastre novo veículo',
                        href: null
                    }}
                />            
            </Tabs>
        </CreateVehicleProvider>
    );
}