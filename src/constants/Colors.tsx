// constants/Colors.ts

export const TintColor = '#6D94C5'; // Verde: Cor de destaque principal
export const BackgroundColor = '#f0efeeff'; // Fundo claro para o corpo da tela
export const TabBarColor = '#FFFFFF'; // Fundo da Navbar inferior (branco)
export const HeaderColor = TintColor; // Fundo do Header superior
export const Border = "#e4e1d8ff"

export default {
  light: {
    appTheme: '#6D94C5',
    text: '#000',
    background: BackgroundColor,
    tint: TintColor,
    tabIconDefault: '#ccc',
    tabIconSelected: TintColor,
    tabBackground: TabBarColor,
    headerBackground: HeaderColor,
    border: Border
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