import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import AccordionFAQ from '@/components/AccordionFAQ';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { AxiosResponse } from 'axios';

const theme = Colors.light;

interface FAQData {
  id: string,
  question: string,
  answer: string,
  category: string,
}

const phone = "19999999999"
const email = "contato@vizzia.com.br"

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [faq, setFaq] = useState<Record<string, FAQData[]>>({});

  useEffect(() => {
    async function get_faq() {
      try {
        const res: AxiosResponse<FAQData[]> = await axios.get("/faq?active=true");
        // Agrupa os FAQs por categoria
        const grouped = res.data.reduce((acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {} as Record<string, FAQData[]>);
        setFaq(grouped);
      } catch (error) {
        console.error('Erro ao buscar FAQs:', error);
      }
    }
    get_faq();
  }, []);

  const handleCall = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        { paddingTop: insets.top }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Alguma dúvida?
        </Text>
        <Text style={styles.headerSubTitle}>
          Encontre respostas para as perguntas mais frequentes ou fale conosco.
        </Text>
      </View>

      <ScrollView style={styles.listContainer}>
        {Object.entries(faq).map(([categoria, items]) => (
          <View key={categoria}>
            <Text style={styles.categoryTitle}>{categoria.toUpperCase()}</Text>
            {items.map((item, index) => (
              <AccordionFAQ
                key={item.id}
                question={item.question}
                answer={item.answer}
                isFirst={index === 0}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Não encontrou o que buscava?</Text>
        <Text style={styles.contactSubtitle}>Fale com a gente pelo chat ou telefone.</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleEmail}>
            <Text style={styles.buttonText}>E-mail</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCall}>
            <Text style={styles.buttonText}>Telefone</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '500',
    fontFamily: "Roboto-Medium",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  headerSubTitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: "Roboto-Regular",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  header: {
    paddingVertical: 16
  },
  listContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '400',
    fontFamily: "Roboto-Regular",
    color: "black",
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  contactContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',  // Fundo leve para destacar
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: "Roboto-Medium",
    color: '#333',
    marginBottom: 5,
  },
  contactSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: "Roboto-Regular",
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#6D94C5',  // Cor do tema
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: "Roboto-Medium",
  },
});