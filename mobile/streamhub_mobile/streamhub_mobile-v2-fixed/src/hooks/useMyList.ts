import { useState, useEffect, useCallback } from 'react';
import { MyListService, MyListItem } from '../services/mylistservice';

export function useMyList() {
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const list = await MyListService.getAll();
    setMyList(list);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const isAdded = useCallback(
    (id: string) => myList.some((f) => f.id === id),
    [myList],
  );

  const toggle = useCallback(
    async (item: Omit<MyListItem, 'addedAt'>) => {
      await MyListService.toggle(item);
      await load();
    },
    [load],
  );

  const remove = useCallback(
    async (id: string) => {
      await MyListService.remove(id);
      await load();
    },
    [load],
  );

  return { myList, loading, isAdded, toggle, remove, count: myList.length };
}
