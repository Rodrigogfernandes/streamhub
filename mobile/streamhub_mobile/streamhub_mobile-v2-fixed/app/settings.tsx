import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';
import { StorageService } from '../src/services/storageservice';
import { useAuth } from '../src/contexts/auth';

const QUALITY_OPTIONS = ['Automático', 'Alta (1080p)', 'Média (720p)', 'Economia (480p)'] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [autoplay, setAutoplay] = useState(true);
  const [videoQuality, setVideoQuality] = useState<'Automático' | 'Alta (1080p)' | 'Média (720p)' | 'Economia (480p)'>('Automático');
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const storedAutoplay = await StorageService.get<boolean>('settings_autoplay');
      if (storedAutoplay !== null) setAutoplay(storedAutoplay);

      const storedQuality = await StorageService.get<typeof videoQuality>('settings_quality');
      if (storedQuality) setVideoQuality(storedQuality);
    }
    loadSettings();
  }, []);

  const handleAutoplayChange = async (value: boolean) => {
    setAutoplay(value);
    await StorageService.set('settings_autoplay', value);
  };

  const handleQualitySelect = async (opt: typeof videoQuality) => {
    setVideoQuality(opt);
    await StorageService.set('settings_quality', opt);
    setShowQualityMenu(false);
  };

  const handleWipeData = () => {
    Alert.alert(
      'Limpar todos os dados',
      'Isso apagará permanentemente seu histórico, favoritos, configurações locais e controle parental. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar tudo',
          style: 'destructive',
          onPress: async () => {
            await StorageService.remove(StorageService.KEYS.FAVORITES);
            await StorageService.remove(StorageService.KEYS.HISTORY);
            await StorageService.remove('streamhub_mylist');
            await StorageService.remove('parental_pin');
            await StorageService.remove('parental_enabled');
            await StorageService.remove('settings_autoplay');
            await StorageService.remove('settings_quality');
            Alert.alert('Dados limpos', 'Todos os dados locais foram apagados com sucesso.');
          },
        },
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
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* CONTA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sua Conta</Text>
          <View style={styles.sectionCard}>
            <View style={styles.accountRow}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.accountRow}>
              <Text style={styles.infoLabel}>Plano Atual</Text>
              <Text style={[styles.infoValue, { color: '#FBBF24', fontWeight: '700' }]}>
                {user?.plan || 'PREMIUM'}
              </Text>
            </View>
          </View>
        </View>

        {/* PREFERENCIAS DE REPRODUÇÃO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reprodução</Text>
          
          <View style={styles.sectionCard}>
            {/* Autoplay */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Reprodução Automática</Text>
                <Text style={styles.settingSub}>Iniciar próximo episódio/vídeo automaticamente</Text>
              </View>
              <Switch
                value={autoplay}
                onValueChange={handleAutoplayChange}
                trackColor={{ false: Colors.border, true: Colors.accent }}
                thumbColor={autoplay ? '#fff' : Colors.textSecondary}
              />
            </View>

            <View style={styles.divider} />

            {/* Qualidade */}
            <TouchableOpacity
              style={styles.qualityBtn}
              onPress={() => setShowQualityMenu(!showQualityMenu)}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Qualidade de Vídeo Padrão</Text>
                <Text style={styles.settingSub}>{videoQuality}</Text>
              </View>
              <Ionicons
                name={showQualityMenu ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>

            {showQualityMenu && (
              <View style={styles.qualityDropdown}>
                {QUALITY_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.qualityOption, videoQuality === opt && styles.qualityOptionActive]}
                    onPress={() => handleQualitySelect(opt)}
                  >
                    <Text style={[styles.qualityOptionText, videoQuality === opt && styles.qualityOptionTextActive]}>
                      {opt}
                    </Text>
                    {videoQuality === opt && <Ionicons name="checkmark" size={16} color={Colors.accent} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ARMAZENAMENTO E DADOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidade e Dados</Text>
          <TouchableOpacity
            style={styles.wipeBtn}
            onPress={handleWipeData}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.live} />
            <Text style={styles.wipeBtnText}>Limpar Todos os Dados Locais</Text>
          </TouchableOpacity>
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
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.md,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.md,
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  settingSub: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  qualityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.md,
  },
  qualityDropdown: {
    backgroundColor: Colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  qualityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(28, 35, 56, 0.5)',
  },
  qualityOptionActive: {
    backgroundColor: Colors.accentDim,
  },
  qualityOptionText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  qualityOptionTextActive: {
    color: Colors.accentBright,
    fontWeight: '600',
  },
  wipeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.liveDim,
    borderWidth: 1,
    borderColor: Colors.live + '30',
    borderRadius: Layout.radiusMd,
    paddingVertical: 14,
  },
  wipeBtnText: {
    color: Colors.live,
    fontSize: 14,
    fontWeight: '600',
  },
});
