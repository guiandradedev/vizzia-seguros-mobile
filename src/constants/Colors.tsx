// constants/Colors.ts

export const TintColor = '#6D94C5'; // Verde: Cor de destaque principal
export const BackgroundColor = '#f0efeeff'; // Fundo claro para o corpo da tela
export const TabBarColor = '#FFFFFF'; // Fundo da Navbar inferior (branco)
export const HeaderColor = TintColor; // Fundo do Header superior
export const Border = "#e4e1d8ff"

export interface ColorTheme {
  appTheme: string;
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  tabBackground: string;
  headerBackground: string;
  border: string;
}

const light = {
  appTheme: '#6D94C5',
  text: '#000',
  background: BackgroundColor,
  tint: TintColor,
  tabIconDefault: '#ccc',
  tabIconSelected: TintColor,
  tabBackground: TabBarColor,
  headerBackground: HeaderColor,
  border: Border,
};

const dark = {
  // Você pode definir cores escuras aqui para suporte a tema escuro
  appTheme: '#4A90E2', // Azul mais claro para tema escuro
  text: '#fff',
  background: '#000',
  tint: '#4A90E2',
  tabIconDefault: '#666',
  tabIconSelected: '#4A90E2',
  tabBackground: '#121212',
  headerBackground: '#1E1E1E',
  border: '#333', // Borda mais escura para tema escuro
};

export const themes = { light, dark };

export default themes