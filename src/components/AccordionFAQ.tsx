// components/FAQItem.tsx (Crie este arquivo)

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
// Você pode usar o FontAwesome que já tem
import { FontAwesome } from '@expo/vector-icons'; 
import Colors from '@/constants/Colors';

// Habilita LayoutAnimation no Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItemProps {
  question: string;
  answer: string;
  isFirst: boolean;
  category?: string;
}
const theme = Colors.light;

export default function AccordionFAQ({ question, answer, isFirst }: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  

  const toggleExpand = () => {
    // 1. Configura a animação suave (Native-side)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    // 2. Inverte o estado
    setIsExpanded(!isExpanded);
  };

  const iconName = isExpanded ? 'chevron-up' : 'chevron-down';

  return (
    <View style={[styles.container, isFirst && styles.firstItem]}>
      {/* CABEÇALHO CLICÁVEL (Pergunta) */}
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <Text style={styles.questionText}>{question}</Text>
        <FontAwesome name={iconName} size={20} color="#666" />
        {/* <FontAwesome name="" size={20} color="#666" /> */}
      </TouchableOpacity>

      {/* CORPO DO CONTEÚDO (Resposta) */}
      {/* O conteúdo só é renderizado (e animado) se isExpanded for true */}
      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    marginHorizontal: 15, 
  },
  firstItem: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  questionText: {
    flex: 1, // Permite que o texto ocupe o espaço antes do ícone
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingRight: 10,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 5,
    // O LayoutAnimation lida com a mudança de altura
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});