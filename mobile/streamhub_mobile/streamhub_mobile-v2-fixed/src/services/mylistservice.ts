import { StorageService } from './storageservice';

export interface MyListItem {
  id: string;
  type: 'movie' | 'channel' | 'serie';
  title: string;
  thumb: string;
  addedAt: number;
}

const KEY = 'streamhub_mylist';

async function getAll(): Promise<MyListItem[]> {
  return (await StorageService.get<MyListItem[]>(KEY)) ?? [];
}

async function isAdded(id: string): Promise<boolean> {
  const list = await getAll();
  return list.some((f) => f.id === id);
}

async function add(item: Omit<MyListItem, 'addedAt'>): Promise<void> {
  const list = await getAll();
  if (list.some((f) => f.id === item.id)) return;
  await StorageService.set(KEY, [{ ...item, addedAt: Date.now() }, ...list]);
}

async function remove(id: string): Promise<void> {
  const list = await getAll();
  await StorageService.set(KEY, list.filter((f) => f.id !== id));
}

async function toggle(item: Omit<MyListItem, 'addedAt'>): Promise<boolean> {
  if (await isAdded(item.id)) {
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

export const MyListService = { getAll, isAdded, add, remove, toggle, count };
