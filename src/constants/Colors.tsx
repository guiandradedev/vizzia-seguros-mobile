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
  appTheme: '#6D94C5', // Mantém a cor principal do tema claro
  text: '#F8F9FA', // Branco quase puro para melhor legibilidade
  background: '#121212', // Fundo principal escuro mas não preto absoluto
  tint: '#8BB3D8', // Azul um pouco mais claro que o tema claro para destaque
  tabIconDefault: '#9AA0A6', // Cinza médio para ícones não selecionados
  tabIconSelected: '#8BB3D8', // Mesmo tom do tint para consistência
  tabBackground: '#1E1E1E', // Fundo da tab bar um pouco mais claro que o principal
  headerBackground: '#1A1A1A', // Header com fundo ligeiramente diferente
  border: '#37474F', // Borda em cinza azulado escuro para sofisticação
};

export const themes = { light, dark };

export default themes