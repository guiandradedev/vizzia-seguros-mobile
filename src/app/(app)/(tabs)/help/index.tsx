import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
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
  category: string,
}

export default function HelpScreen({ navigation }: any) {
  const theme = Colors.light
  const insets = useSafeAreaInsets();
  const [faq, setFaq] = useState<Record<string, FAQData[]>>({})
    useEffect(()=>{
      async function get_faq() {
        const res: AxiosResponse<FAQData[]> = await axios.get("/faq?isActive=true")
        // Agrupa os FAQs por categoria
        const grouped = res.data.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
    }, {} as Record<string, FAQData[]>)

     setFaq(grouped)
      }
      get_faq()
    }, [])

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
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'regular',
    fontFamily: "Roboto-Regular",
    color: "black",
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 8,
    textTransform: 'capitalize', // ou uppercase se quiser tudo maiúsculo
  },

});