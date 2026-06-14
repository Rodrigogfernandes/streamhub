import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput, StatusBar, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Layout } from '../../src/constants/layout';
import { CHANNELS, CATEGORIES_LIST } from '../../src/constants/mockData';
import { ChannelCard } from '../../src/components/ChannelCard';
import { CategoryFilter } from '../../src/components/CategoryFilter';
import { Channel } from '../../src/types';

const CHANNEL_CATEGORIES = ['Todos', 'TV Aberta', 'Esportes', 'Notícias', 'Documentários', 'Música', 'Infantil'];

export default function ChannelsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filtered = useMemo(() => {
    return CHANNELS.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'Todos' || c.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [search, selectedCategory]);

  const handlePress = (channel: Channel) => {
    router.push({ pathname: '/player', params: { url: channel.streamUrl, title: channel.name } });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Canais</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveCount}>{CHANNELS.filter(c => c.isLive).length} ao vivo</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar canais..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category filter */}
      <View style={styles.filterWrap}>
        <ScrollCategories
          categories={CHANNEL_CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="tv-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum canal encontrado</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ChannelCard channel={item} onPress={handlePress} />
        )}
      />
    </View>
  );
}

function ScrollCategories({
  categories, selected, onSelect,
}: { categories: string[]; selected: string; onSelect: (s: string) => void }) {
  const { ScrollView } = require('react-native');
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: Layout.md }}>
      {categories.map((cat) => {
        const isActive = selected === cat;
        return (
          <TouchableOpacity
            key={cat}
            style={[chipStyles.chip, isActive && chipStyles.chipActive]}
            onPress={() => onSelect(cat)}
            activeOpacity={0.75}
          >
            <Text style={[chipStyles.text, isActive && chipStyles.textActive]}>{cat}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  text: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  textActive: { color: '#fff' },
});

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
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.liveDim,
    borderRadius: Layout.radiusFull,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.live,
  },
  liveCount: { color: Colors.live, fontSize: 12, fontWeight: '700' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusMd,
    marginHorizontal: Layout.md,
    marginBottom: Layout.md,
    paddingHorizontal: Layout.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  filterWrap: { marginBottom: Layout.md },
  grid: {
    paddingHorizontal: Layout.md,
    paddingBottom: Layout.tabBarHeight + Layout.xl,
  },
  row: { gap: 10, marginBottom: 10 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { color: Colors.textSecondary, fontSize: 15 },
});
