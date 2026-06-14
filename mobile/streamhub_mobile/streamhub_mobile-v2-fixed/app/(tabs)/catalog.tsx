import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../src/constants/colors';
import { Layout } from '../../src/constants/layout';
import { ContentService } from '../../src/services/contentService';
import { MovieCard } from '../../src/components/MovieCard';
import { Movie } from '../../src/types';
import { CatalogSkeleton } from '../../src/components/Skeleton';

const GENRE_FILTERS = ['Todos', 'Ação', 'Drama', 'Comédia', 'Ficção Científica', 'Terror', 'Documentário'];
const SORT_OPTIONS = ['Relevância', 'Nota', 'Ano', 'Duração'];

export default function CatalogScreen() {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [sortBy, setSortBy] = useState('Relevância');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { ScrollView } = require('react-native');
  const { Ionicons } = require('@expo/vector-icons');

  const { data: filtered = [], isLoading, refetch } = useQuery({
    queryKey: ['movies-catalog', selectedGenre, sortBy],
    queryFn: () => ContentService.getMovies(selectedGenre, sortBy),
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleMoviePress = (movie: Movie) => {
    router.push({ pathname: '/details', params: { id: movie.id, type: 'movie' } });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catálogo</Text>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSortMenu(!showSortMenu)} activeOpacity={0.8}>
          <Ionicons name="funnel-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.sortText}>{sortBy}</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {showSortMenu && (
        <View style={styles.sortMenu}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.sortOption, sortBy === opt && styles.sortOptionActive]}
              onPress={() => { setSortBy(opt); setShowSortMenu(false); }}
            >
              <Text style={[styles.sortOptionText, sortBy === opt && styles.sortOptionTextActive]}>{opt}</Text>
              {sortBy === opt && <Ionicons name="checkmark" size={14} color={Colors.accent} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Genre chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genreList}
        style={styles.genreScroll}
      >
        {GENRE_FILTERS.map((genre) => {
          const isActive = selectedGenre === genre;
          return (
            <TouchableOpacity
              key={genre}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setSelectedGenre(genre)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{genre}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.resultCount}>{filtered.length} títulos</Text>

      {isLoading && !refreshing ? (
        <CatalogSkeleton />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(m) => m.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.accent}
              colors={[Colors.accent]}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="film-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Nenhum título encontrado</Text>
            </View>
          }
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={handleMoviePress} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusFull,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  sortMenu: {
    marginHorizontal: Layout.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.sm,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.md,
    paddingVertical: 12,
  },
  sortOptionActive: { backgroundColor: Colors.accentDim },
  sortOptionText: { color: Colors.textSecondary, fontSize: 14 },
  sortOptionTextActive: { color: Colors.accentBright, fontWeight: '600' },
  genreScroll: { marginBottom: Layout.sm },
  genreList: { paddingHorizontal: Layout.md, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  resultCount: {
    color: Colors.textMuted,
    fontSize: 12,
    paddingHorizontal: Layout.md,
    marginBottom: Layout.sm,
  },
  grid: {
    paddingHorizontal: Layout.md,
    paddingBottom: Layout.tabBarHeight + Layout.xl,
  },
  row: { gap: 10, marginBottom: 10 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { color: Colors.textSecondary, fontSize: 15 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
});
