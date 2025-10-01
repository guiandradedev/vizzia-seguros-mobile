// constants/Colors.ts

export const TintColor = '#4CAF50'; // Verde: Cor de destaque principal
export const BackgroundColor = '#F5EFE6'; // Fundo claro para o corpo da tela
export const TabBarColor = '#FFFFFF'; // Fundo da Navbar inferior (branco)
export const HeaderColor = TintColor; // Fundo do Header superior
export const Border = "#E8DFCA"

export default {
  light: {
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