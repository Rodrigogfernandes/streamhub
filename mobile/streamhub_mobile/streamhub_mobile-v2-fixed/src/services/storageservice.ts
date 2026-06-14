import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// expo-secure-store tem limite de ~2KB por chave no Android.
// Usamos o AsyncStorage para grandes conjuntos de dados (como favoritos e histórico)
// e reservamos o SecureStore para dados sensíveis (tokens de login, dados do usuário e PIN).
// Se o SecureStore falhar ou não estiver disponível (ex: na Web ou emuladores), caímos de volta no AsyncStorage.

const KEYS = {
  FAVORITES: 'streamhub_favorites',
  HISTORY:   'streamhub_history',
  PROFILE:   'streamhub_profile',
} as const;

function isSensitive(key: string): boolean {
  const k = key.toLowerCase();
  return k.includes('token') || k.includes('profile') || k.includes('pin');
}

async function get<T>(key: string): Promise<T | null> {
  try {
    if (isSensitive(key)) {
      try {
        const isAvailable = await SecureStore.isAvailableAsync();
        if (isAvailable) {
          const raw = await SecureStore.getItemAsync(key);
          if (!raw) return null;
          return JSON.parse(raw) as T;
        }
      } catch (e) {
        console.log('[StorageService] SecureStore indisponível, usando AsyncStorage:', e);
      }
      // Fallback para AsyncStorage
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } else {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    }
  } catch (error) {
    console.warn(`[StorageService] Erro ao ler a chave "${key}":`, error);
    return null;
  }
}

async function set<T>(key: string, value: T): Promise<void> {
  try {
    const raw = JSON.stringify(value);
    if (isSensitive(key)) {
      try {
        const isAvailable = await SecureStore.isAvailableAsync();
        if (isAvailable) {
          await SecureStore.setItemAsync(key, raw);
          return;
        }
      } catch (e) {
        console.log('[StorageService] SecureStore falhou ou indisponível ao salvar, usando AsyncStorage:', e);
      }
      // Fallback para AsyncStorage
      await AsyncStorage.setItem(key, raw);
    } else {
      await AsyncStorage.setItem(key, raw);
    }
  } catch (error) {
    console.warn(`[StorageService] Erro ao salvar a chave "${key}":`, error);
  }
}

async function remove(key: string): Promise<void> {
  try {
    if (isSensitive(key)) {
      try {
        const isAvailable = await SecureStore.isAvailableAsync();
        if (isAvailable) {
          await SecureStore.deleteItemAsync(key);
          return;
        }
      } catch (e) {
        console.log('[StorageService] SecureStore falhou ou indisponível ao remover, usando AsyncStorage:', e);
      }
      // Fallback para AsyncStorage
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`[StorageService] Erro ao deletar a chave "${key}":`, error);
  }
}

export const StorageService = { KEYS, get, set, remove };