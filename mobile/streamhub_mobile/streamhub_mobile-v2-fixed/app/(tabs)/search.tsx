import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../src/constants/colors';
import { Layout } from '../../src/constants/layout';
import { ContentService } from '../../src/services/contentService';
import { AgeBadge } from '../../src/components/Badge';
import { useFormatters } from '../../src/hooks/useFormatters';

const TRENDING = ['Duna', 'Esportes ao vivo', 'Série', 'Netflix', 'Documentários'];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { formatRating, formatDuration } = useFormatters();

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => ContentService.searchContent(query),
    enabled: query.trim().length >= 2,
  });

  const handlePress = (item: any) => {
    router.push({ pathname: '/details', params: { id: item.id, type: item.kind } });
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
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
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
            const isSerie = item.kind === 'serie';
            const isChannel = item.kind === 'channel';

            const thumb = isChannel ? (item as any).logo : (item as any).poster;
            const title = isChannel ? (item as any).name : (item as any).title;

            let sub = '';
            if (isMovie) {
              sub = `${(item as any).year} · ${formatDuration((item as any).duration)} · ⭐ ${formatRating((item as any).rating)}`;
            } else if (isSerie) {
              sub = `${(item as any).seasons} ${(item as any).seasons > 1 ? 'temporadas' : 'temporada'} · ⭐ ${formatRating((item as any).rating)}`;
            } else {
              sub = `${(item as any).category} · ${(item as any).isLive ? 'Ao vivo' : ''}`;
            }

            const kindLabel = isMovie ? 'FILME' : isSerie ? 'SÉRIE' : 'CANAL';
            const kindColor = isChannel ? Colors.live : Colors.accentBright;
            const kindBg = isChannel ? Colors.liveDim : Colors.accentDim;

            return (
              <TouchableOpacity style={styles.result} onPress={() => handlePress(item)} activeOpacity={0.75}>
                <Image source={{ uri: thumb }} style={styles.thumb} contentFit="cover" />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle} numberOfLines={1}>{title}</Text>
                  <Text style={styles.resultSub} numberOfLines={1}>{sub}</Text>
                  <View style={styles.resultMeta}>
                    <View style={[styles.kindBadge, { backgroundColor: kindBg }]}>
                      <Text style={[styles.kindText, { color: kindColor }]}>
                        {kindLabel}
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
});
