import * as SecureStore from 'expo-secure-store';

// expo-secure-store tem limite de ~2KB por chave
// Usamos prefixos para separar domínios

const KEYS = {
  FAVORITES: 'streamhub_favorites',
  HISTORY:   'streamhub_history',
  PROFILE:   'streamhub_profile',
} as const;

async function get<T>(key: string): Promise<T | null> {
  try {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function set<T>(key: string, value: T): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[StorageService] set error:', e);
  }
}

async function remove(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {}
}

export const StorageService = { KEYS, get, set, remove };