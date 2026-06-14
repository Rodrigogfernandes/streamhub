import { useState, useEffect, useCallback } from 'react';
import { HistoryService, HistoryItem } from '../services/historyService';

export function useWatchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState(0);

  const load = useCallback(async () => {
    const [list, h] = await Promise.all([
      HistoryService.getAll(),
      HistoryService.estimatedHours(),
    ]);
    setHistory(list);
    setHours(h);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(
    async (item: Omit<HistoryItem, 'watchedAt'>) => {
      await HistoryService.add(item);
      await load();
    },
    [load],
  );

  const remove = useCallback(
    async (id: string) => {
      await HistoryService.remove(id);
      await load();
    },
    [load],
  );

  const clear = useCallback(async () => {
    await HistoryService.clear();
    await load();
  }, [load]);

  return {
    history,
    loading,
    hours,
    count: history.length,
    add,
    remove,
    clear,
  };
}