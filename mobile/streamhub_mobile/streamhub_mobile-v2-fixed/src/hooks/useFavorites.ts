import { useState, useEffect, useCallback } from 'react';
import { FavoritesService, FavoriteItem } from '../services/favoritesservice';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const list = await FavoritesService.getAll();
    setFavorites(list);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const toggle = useCallback(
    async (item: Omit<FavoriteItem, 'addedAt'>) => {
      await FavoritesService.toggle(item);
      await load();
    },
    [load],
  );

  const remove = useCallback(
    async (id: string) => {
      await FavoritesService.remove(id);
      await load();
    },
    [load],
  );

  return { favorites, loading, isFavorite, toggle, remove, count: favorites.length };
}