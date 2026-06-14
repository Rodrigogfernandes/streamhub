import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Colors } from '../../src/constants/colors';
import { Layout } from '../../src/constants/layout';
import { MOVIES, CHANNELS } from '../../src/constants/mockData';
import { AgeBadge } from '../../src/components/Badge';
import { useFormatters } from '../../src/hooks/useFormatters';

const TRENDING = ['Duna', 'Esportes ao vivo', 'Série', 'Netflix', 'Documentários'];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { formatRating, formatDuration } = useFormatters();

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    const movies = MOVIES
      .filter((m) => m.title.toLowerCase().includes(q) || m.genres.some(g => g.toLowerCase().includes(q)))
      .map((m) => ({ ...m, kind: 'movie' as const }));
    const channels = CHANNELS
      .filter((c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
      .map((c) => ({ ...c, kind: 'channel' as const }));
    return [...movies, ...channels];
  }, [query]);

  const handlePress = (item: any) => {
    if (item.kind === 'movie') {
      router.push({ pathname: '/player', params: { url: item.streamUrl, title: item.title } });
    } else {
      router.push({ pathname: '/player', params: { url: item.streamUrl, title: item.name } });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Filmes, canais, gêneros..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoFocus={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {query.trim().length < 2 ? (
        <View style={styles.trending}>
          <Text style={styles.trendingTitle}>Em alta</Text>
          <View style={styles.trendingList}>
            {TRENDING.map((t) => (
              <TouchableOpacity
                key={t}
                style={styles.trendingChip}
                onPress={() => setQuery(t)}
                activeOpacity={0.75}
              >
                <Ionicons name="trending-up" size={14} color={Colors.accent} />
                <Text style={styles.trendingText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.kind}-${item.id}`}
          contentContainerStyle={styles.resultList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Sem resultados para "{query}"</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isMovie = item.kind === 'movie';
            const thumb = isMovie ? (item as any).poster : (item as any).logo;
            const title = isMovie ? (item as any).title : (item as any).name;
            const sub = isMovie
              ? `${(item as any).year} · ${formatDuration((item as any).duration)} · ⭐ ${formatRating((item as any).rating)}`
              : `${(item as any).category} · ${(item as any).isLive ? 'Ao vivo' : ''}`;
            return (
              <TouchableOpacity style={styles.result} onPress={() => handlePress(item)} activeOpacity={0.75}>
                <Image source={{ uri: thumb }} style={styles.thumb} contentFit="cover" />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle} numberOfLines={1}>{title}</Text>
                  <Text style={styles.resultSub} numberOfLines={1}>{sub}</Text>
                  <View style={styles.resultMeta}>
                    <View style={[styles.kindBadge, { backgroundColor: isMovie ? Colors.accentDim : Colors.liveDim }]}>
                      <Text style={[styles.kindText, { color: isMovie ? Colors.accentBright : Colors.live }]}>
                        {isMovie ? 'FILME' : 'CANAL'}
                      </Text>
                    </View>
                    <AgeBadge ageRating={(item as any).ageRating} size="sm" />
                  </View>
                </View>
                <Ionicons name="play-circle-outline" size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Layout.md,
    paddingTop: 56,
    paddingBottom: Layout.md,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusMd,
    marginHorizontal: Layout.md,
    paddingHorizontal: Layout.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.lg,
  },
  input: { flex: 1, color: Colors.textPrimary, fontSize: 15 },
  trending: { paddingHorizontal: Layout.md },
  trendingTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: Layout.sm,
  },
  trendingList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusFull,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trendingText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '500' },
  resultList: { paddingHorizontal: Layout.md, paddingBottom: Layout.tabBarHeight + Layout.xl },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  thumb: {
    width: 60,
    height: 80,
    borderRadius: Layout.radiusSm,
    backgroundColor: Colors.surfaceElevated,
  },
  resultInfo: { flex: 1 },
  resultTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 3 },
  resultSub: { color: Colors.textSecondary, fontSize: 12, marginBottom: 6 },
  resultMeta: { flexDirection: 'row', gap: 6 },
  kindBadge: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  kindText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },
});
