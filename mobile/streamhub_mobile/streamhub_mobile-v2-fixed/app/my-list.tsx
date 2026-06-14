import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';
import { useMyList } from '../src/hooks/useMyList';
import { Image } from 'expo-image';

export default function MyListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { myList, toggle } = useMyList();

  const handlePress = (item: any) => {
    router.push({ pathname: '/details', params: { id: item.id, type: item.type } });
  };

  const handleRemove = (item: any) => {
    toggle({
      id: item.id,
      type: item.type,
      title: item.title,
      thumb: item.thumb,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Lista</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      {/* LIST */}
      <FlatList
        data={myList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Sua lista está vazia</Text>
            <Text style={styles.emptySubText}>
              Adicione filmes ou séries para assistir mais tarde clicando no ícone de salvar.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.cardContent} 
              onPress={() => handlePress(item)}
              activeOpacity={0.75}
            >
              <Image source={{ uri: item.thumb }} style={styles.thumb} contentFit="cover" />
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <View style={[styles.badge, { backgroundColor: item.type === 'channel' ? Colors.liveDim : Colors.accentDim }]}>
                  <Text style={[styles.badgeText, { color: item.type === 'channel' ? Colors.live : Colors.accentBright }]}>
                    {item.type === 'channel' ? 'CANAL' : item.type === 'serie' ? 'SÉRIE' : 'FILME'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleRemove(item)}
              style={styles.removeBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="bookmark" size={18} color={Colors.accent} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.md,
    paddingBottom: Layout.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  list: {
    paddingHorizontal: Layout.md,
    paddingTop: Layout.md,
    gap: Layout.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    paddingRight: Layout.md,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 90,
    height: 70,
    backgroundColor: Colors.surfaceElevated,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  removeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: Layout.lg,
    gap: 12,
  },
  emptyText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
