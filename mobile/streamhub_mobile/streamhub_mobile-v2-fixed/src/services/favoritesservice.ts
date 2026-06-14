import { StorageService } from './storageservice';

export interface FavoriteItem {
  id: string;
  type: 'movie' | 'channel' | 'serie';
  title: string;
  thumb: string;
  addedAt: number;
}

const KEY = StorageService.KEYS.FAVORITES;

async function getAll(): Promise<FavoriteItem[]> {
  return (await StorageService.get<FavoriteItem[]>(KEY)) ?? [];
}

async function isFavorite(id: string): Promise<boolean> {
  const list = await getAll();
  return list.some((f) => f.id === id);
}

async function add(item: Omit<FavoriteItem, 'addedAt'>): Promise<void> {
  const list = await getAll();
  if (list.some((f) => f.id === item.id)) return;
  await StorageService.set(KEY, [{ ...item, addedAt: Date.now() }, ...list]);
}

async function remove(id: string): Promise<void> {
  const list = await getAll();
  await StorageService.set(KEY, list.filter((f) => f.id !== id));
}

async function toggle(item: Omit<FavoriteItem, 'addedAt'>): Promise<boolean> {
  if (await isFavorite(item.id)) {
    await remove(item.id);
    return false;
  } else {
    await add(item);
    return true;
  }
}

async function count(): Promise<number> {
  return (await getAll()).length;
}

export const FavoritesService = { getAll, isFavorite, add, remove, toggle, count };