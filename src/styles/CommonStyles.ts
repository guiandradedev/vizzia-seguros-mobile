// @styles/commonStyles.ts
import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  // Container geral da tela
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
    // marginBottom: -20
  },

  scrollContent: {
    padding: 20,
    // espaço para footer fixo
  },

  // Textos principais
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 30,
    marginTop:10,
    textAlign: 'center',
  },

  // Formulários
  formContainer: {
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
    fontWeight: '600',
  },
  
  input: { 
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 12, backgroundColor: '#fff' 
  },

  // Botões
  button: {
    backgroundColor: '#6D94C5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
    elevation: 2,
    paddingBottom: 10,
  },
  buttonSmall: {
    backgroundColor: '#6D94C5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: 140,
  },
  addButton: {
    backgroundColor: '#6D94C5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Footer
  footer: {
    padding: 20,
    backgroundColor: 'transparent',
    marginTop: 'auto',
    alignSelf: 'stretch',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: '#ccc',
  },
  buttonSecondary: {
    backgroundColor: Colors.light.appTheme,
  },

  text: { fontSize: 15, color: '#333', lineHeight: 22, textAlign: 'center' },

  content: { flex: 1, padding: 20, alignItems: 'center', width: '100%' },

  sectionTitle: {
      fontSize: 17, fontWeight: '500', marginBottom: 10
  },
  

});
