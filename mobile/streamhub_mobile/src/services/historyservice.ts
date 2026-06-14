import { StorageService } from './storageService';

export interface HistoryItem {
  id: string;
  type: 'movie' | 'channel' | 'serie';
  title: string;
  thumb: string;
  streamUrl: string;
  watchedAt: number;
  durationMinutes?: number;
}

const KEY = StorageService.KEYS.HISTORY;
const MAX_ITEMS = 50;

async function getAll(): Promise<HistoryItem[]> {
  return (await StorageService.get<HistoryItem[]>(KEY)) ?? [];
}

async function add(item: Omit<HistoryItem, 'watchedAt'>): Promise<void> {
  let list = await getAll();
  // Remove entrada anterior do mesmo item (evita duplicatas)
  list = list.filter((h) => h.id !== item.id);
  // Insere no topo e limita tamanho
  list = [{ ...item, watchedAt: Date.now() }, ...list].slice(0, MAX_ITEMS);
  await StorageService.set(KEY, list);
}

async function remove(id: string): Promise<void> {
  const list = await getAll();
  await StorageService.set(KEY, list.filter((h) => h.id !== id));
}

async function clear(): Promise<void> {
  await StorageService.remove(KEY);
}

async function count(): Promise<number> {
  return (await getAll()).length;
}

// Calcula total estimado de horas assistidas (1 canal = 30min por entrada)
async function estimatedHours(): Promise<number> {
  const list = await getAll();
  const minutes = list.reduce((acc, h) => acc + (h.durationMinutes ?? 30), 0);
  return Math.round(minutes / 60);
}

export const HistoryService = { getAll, add, remove, clear, count, estimatedHours };