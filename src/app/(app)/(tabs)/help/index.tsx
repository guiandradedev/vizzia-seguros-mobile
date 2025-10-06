import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import AccordionFAQ from '@/components/AccordionFAQ';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { AxiosResponse } from 'axios';
// Remova esta linha:
// import { ScrollView } from 'react-native-gesture-handler';

const theme = Colors.light;

interface FAQData {
  id: string,
  question: string,
  answer: string,
}

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [faq, setFaq] = useState<FAQData[]>([])
    useEffect(()=>{
      async function get_faq() {
        const data: AxiosResponse<FAQData[]> = await axios.get("/faq?active=true")
        setFaq(data.data)
      }
      get_faq()
    }, [])

  // const faqData = [
  //   {
  //     id: '1',
  //     question: 'O que é considerado no cálculo do meu seguro?	',
  //     answer: 'O preço é calculado com base no seu perfil de risco (idade, histórico de condução, localização), as características do bem segurado (modelo, ano) e as coberturas que você escolheu.'
  //   },
  //   {
  //     id: '2',
  //     question: 'Como aciono o meu guincho (assistência 24h)?',
  //     answer: 'Você pode solicitar o guincho diretamente pelo nosso aplicativo (mais rápido) ou ligando para o número 0800-XXX-XXXX. Tenha em mãos sua placa e sua localização exata.'
  //   },
  //   {
  //     id: '3',
  //     question: 'Posso escolher a oficina para reparo?',
  //     answer: 'Sim, mas recomendamos nossa Rede de Oficinas Credenciadas. Elas oferecem garantia de serviço estendida e prazos de reparo mais ágeis.'
  //   },
  // ];

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
          Nulla vehicula tortor in neque scelerisque, nec porttitor nisl sollicitudin.
        </Text>
      </View>

      <ScrollView style={styles.listContainer}>
        {faq.map((item, index) => (
          <AccordionFAQ
            key={item.id} 
            question={item.question} 
            answer={item.answer} 
            isFirst={index === 0}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'medium',
    fontFamily: "Roboto-Medium",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  headerSubTitle: {
    fontSize: 16,
    fontWeight: 'regular',
    fontFamily: "Roboto-Regular",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  header: {
    paddingVertical: 16
  },
    listContainer: {
    // borderTopWidth: 1,
    // borderTopColor: theme.border,
  }
});