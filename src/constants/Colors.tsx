// constants/Colors.ts

// Paleta de cores primárias
export const PrimaryColors = {
  blue: '#6D94C5',
  teal: '#2DD4BF',
  purple: '#A855F7',
  emerald: '#10B981',
} as const;

// Tons de cinza
export const Grays = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
} as const;

// Cores semânticas
export const SemanticColors = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export interface ColorTheme {
  // Cores principais
  primary: string;
  secondary: string;

  // Texto
  text: string;
  textSecondary: string;

  // Fundo
  background: string;
  backgroundSecondary: string;

  // Bordas
  border: string;

  // Estados interativos
  tint: string;

  // Estados semânticos
  success: string;
  warning: string;
  error: string;
  info: string;

  // Tab bar
  tabIconDefault: string;
  tabIconSelected: string;
  tabBackground: string;

  // Header
  headerBackground: string;
}

const light: ColorTheme = {
  // Cores principais
  primary: PrimaryColors.blue,
  secondary: PrimaryColors.teal,

  // Texto
  text: Grays[900],
  textSecondary: Grays[600],

  // Fundo
  background: Grays[50],
  backgroundSecondary: '#FFFFFF',

  // Bordas
  border: Grays[200],

  // Estados interativos
  tint: PrimaryColors.blue,

  // Estados semânticos
  success: SemanticColors.success,
  warning: SemanticColors.warning,
  error: SemanticColors.error,
  info: SemanticColors.info,

  // Tab bar
  tabIconDefault: Grays[400],
  tabIconSelected: PrimaryColors.blue,
  tabBackground: '#FFFFFF',

  // Header
  headerBackground: PrimaryColors.blue,
};

export default light;