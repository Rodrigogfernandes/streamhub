import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: 'Como favoritar canais ou filmes?',
    answer: 'Para favoritar um conteúdo, basta clicar no ícone de coração localizado no card do conteúdo (na tela inicial ou no catálogo) ou no botão de favoritar no menu de controle durante a reprodução do vídeo.',
  },
  {
    id: 'f2',
    question: 'Como funciona o controle parental?',
    answer: 'O controle parental permite bloquear conteúdos classificados como +16 e +18. Você define uma senha PIN de 4 dígitos nas configurações do perfil e, a partir disso, qualquer tentativa de assistir a esses conteúdos exigirá a senha definida.',
  },
  {
    id: 'f3',
    question: 'Por que o vídeo está travando?',
    answer: 'Problemas de travamento geralmente estão relacionados à velocidade da sua conexão com a internet. Você pode ir em Perfil > Configurações > Qualidade de Vídeo e alterar a qualidade padrão para uma resolução menor (como 480p ou Automático).',
  },
  {
    id: 'f4',
    question: 'Como limpar meu histórico de reprodução?',
    answer: 'Você pode apagar itens individuais arrastando/clicando no botão "X" ao lado do item no histórico. Se preferir limpar todo o histórico de uma vez, clique no ícone de lixeira no cabeçalho da tela de Histórico.',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSupportContact = () => {
    Alert.alert(
      'Falar com o Suporte',
      'Deseja abrir seu aplicativo de e-mail para enviar uma mensagem para nosso suporte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar E-mail', 
          onPress: () => {
            Linking.openURL('mailto:suporte@streamhub.com?subject=Ajuda - App Mobile').catch(() => {
              Alert.alert('Erro', 'Não foi possível abrir o aplicativo de e-mail.');
            });
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda & FAQ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* INFO CARD */}
        <View style={styles.supportCard}>
          <Ionicons name="help-buoy-outline" size={40} color={Colors.accent} />
          <Text style={styles.supportTitle}>Precisa de mais ajuda?</Text>
          <Text style={styles.supportDesc}>
            Nossa equipe está disponível para tirar dúvidas e resolver quaisquer problemas de reprodução.
          </Text>
          <TouchableOpacity 
            style={styles.supportBtn} 
            onPress={handleSupportContact}
            activeOpacity={0.8}
          >
            <Text style={styles.supportBtnText}>Fale Conosco</Text>
          </TouchableOpacity>
        </View>

        {/* FAQS SECTION */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          
          {FAQS.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(faq.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.faqBody}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.md,
    paddingBottom: Layout.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    paddingHorizontal: Layout.md,
    paddingTop: Layout.lg,
    gap: Layout.lg,
  },
  supportCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.lg,
    alignItems: 'center',
    gap: Layout.sm,
  },
  supportTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },
  supportDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  supportBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Layout.radiusMd,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  supportBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  faqSection: {
    gap: 10,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: 4,
    marginBottom: 4,
  },
  faqItem: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.md,
    gap: 10,
  },
  faqQuestion: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  faqBody: {
    paddingHorizontal: Layout.md,
    paddingBottom: Layout.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: Layout.sm,
  },
  faqAnswer: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
