import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Switch,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';
import { StorageService } from '../src/services/storageservice';

export default function ParentalControlScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isEnabled, setIsEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [step, setStep] = useState<'view' | 'setup_pin' | 'verify_pin'>('view');

  useEffect(() => {
    async function loadConfig() {
      const storedEnabled = await StorageService.get<boolean>('parental_enabled');
      const storedPin = await StorageService.get<string>('parental_pin');
      
      setIsEnabled(!!storedEnabled);
      setIsConfigured(!!storedPin);
    }
    loadConfig();
  }, []);

  const handleToggleRestriction = async (value: boolean) => {
    if (value && !isConfigured) {
      // Abre tela de configurar PIN se for a primeira vez
      setStep('setup_pin');
      return;
    }

    if (isConfigured) {
      // Pede o PIN atual para ligar/desligar
      setStep('verify_pin');
      return;
    }

    setIsEnabled(value);
    await StorageService.set('parental_enabled', value);
  };

  const handleSavePin = async () => {
    if (pin.length !== 4 || isNaN(Number(pin))) {
      Alert.alert('Erro', 'O PIN deve conter exatamente 4 números.');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Erro', 'Os PINs não coincidem.');
      return;
    }

    await StorageService.set('parental_pin', pin);
    await StorageService.set('parental_enabled', true);
    setIsConfigured(true);
    setIsEnabled(true);
    setPin('');
    setConfirmPin('');
    setStep('view');
    Alert.alert('Sucesso', 'Controle parental ativado com sucesso!');
  };

  const handleVerifyPin = async () => {
    const storedPin = await StorageService.get<string>('parental_pin');
    if (currentPinInput === storedPin) {
      const nextValue = !isEnabled;
      setIsEnabled(nextValue);
      await StorageService.set('parental_enabled', nextValue);
      setCurrentPinInput('');
      setStep('view');
      Alert.alert(
        'Sucesso',
        nextValue ? 'Controle parental ativado.' : 'Controle parental desativado.'
      );
    } else {
      Alert.alert('Erro', 'PIN incorreto.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          onPress={() => step === 'view' ? router.back() : setStep('view')} 
          style={styles.backBtn} 
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Controle Parental</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {step === 'view' && (
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Ionicons name="shield-checkmark" size={40} color={Colors.accent} />
              <Text style={styles.cardTitle}>Bloqueio de Classificação Indicativa</Text>
              <Text style={styles.cardDesc}>
                Restrinja o acesso a filmes, séries e canais com classificação indicativa elevada (+16 e +18) configurando uma senha PIN de 4 dígitos.
              </Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Restringir Conteúdo Adulto</Text>
                <Text style={styles.settingSub}>Exigir PIN para conteúdos +16 / +18</Text>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={handleToggleRestriction}
                trackColor={{ false: Colors.border, true: Colors.accent }}
                thumbColor={isEnabled ? '#fff' : Colors.textSecondary}
              />
            </View>

            {isConfigured && (
              <TouchableOpacity 
                style={styles.changePinBtn} 
                onPress={() => setStep('setup_pin')}
                activeOpacity={0.8}
              >
                <Ionicons name="key-outline" size={18} color={Colors.textPrimary} />
                <Text style={styles.changePinText}>Alterar Senha PIN</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {step === 'setup_pin' && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Definir Novo PIN de Segurança</Text>
            <Text style={styles.formDesc}>Insira um código de 4 dígitos que será usado para acessar e gerenciar o controle parental.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Novo PIN (4 dígitos)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1234"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                value={pin}
                onChangeText={setPin}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar Novo PIN</Text>
              <TextInput
                style={styles.input}
                placeholder="Repita o PIN"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                value={confirmPin}
                onChangeText={setConfirmPin}
              />
            </View>

            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={handleSavePin}
              activeOpacity={0.8}
            >
              <Text style={styles.submitBtnText}>Salvar PIN</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'verify_pin' && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Confirmar Acesso</Text>
            <Text style={styles.formDesc}>Digite seu PIN atual para alterar as configurações de restrição.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha PIN</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o PIN de 4 dígitos"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                value={currentPinInput}
                onChangeText={setCurrentPinInput}
                autoFocus
              />
            </View>

            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={handleVerifyPin}
              activeOpacity={0.8}
            >
              <Text style={styles.submitBtnText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  section: {
    gap: Layout.lg,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.lg,
    alignItems: 'center',
    gap: Layout.sm,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },
  cardDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.md,
  },
  settingInfo: {
    flex: 1,
    gap: 4,
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
  changePinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.radiusMd,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
  },
  changePinText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.lg,
    gap: Layout.md,
  },
  formTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  formDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.radiusMd,
    height: 52,
    color: Colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: Layout.md,
    textAlign: 'center',
    letterSpacing: 4,
  },
  submitBtn: {
    height: 52,
    backgroundColor: Colors.accent,
    borderRadius: Layout.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.sm,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
