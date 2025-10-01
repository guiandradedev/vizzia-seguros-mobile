// constants/Colors.ts

export const TintColor = '#4CAF50'; // Verde: Cor de destaque principal
export const BackgroundColor = '#F5F5F5'; // Fundo claro para o corpo da tela
export const TabBarColor = '#FFFFFF'; // Fundo da Navbar inferior (branco)
export const HeaderColor = TintColor; // Fundo do Header superior

export default {
  light: {
    text: '#000',
    background: BackgroundColor,
    tint: TintColor,
    tabIconDefault: '#ccc',
    tabIconSelected: TintColor,
    tabBackground: TabBarColor,
    headerBackground: HeaderColor,
  },
  dark: {
    // Você pode definir cores escuras aqui para suporte a tema escuro
    text: '#fff',
    background: '#000',
    tint: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
    tabBackground: '#121212',
    headerBackground: '#1E1E1E',
  },
};