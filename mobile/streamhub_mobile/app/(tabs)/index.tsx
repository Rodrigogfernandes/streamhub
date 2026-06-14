import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet, FlatList, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { Layout } from '../../src/constants/layout';
import { HERO_ITEMS, CHANNELS, MOVIES } from '../../src/constants/mockData';
import { HeroBanner } from '../../src/components/HeroBanner';
import { MovieCard } from '../../src/components/MovieCard';
import { ChannelCard } from '../../src/components/ChannelCard';
import { SectionHeader } from '../../src/components/SectionHeader';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useWatchHistory } from '../../src/hooks/useWatchHistory';
import type { HeroItem, Channel, Movie } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const { add: addHistory } = useWatchHistory();

  const handlePlay = useCallback((item: HeroItem) => {
    if (item.streamUrl) {
      addHistory({
        id: item.id,
        type: item.type === 'channel' ? 'channel' : 'movie',
        title: item.title,
        thumb: item.backdrop,
        streamUrl: item.streamUrl,
      });
      router.push({ pathname: '/player', params: { url: item.streamUrl, title: item.title } });
    }
  }, [router, addHistory]);

  const handleChannelPress = useCallback((channel: Channel) => {
    addHistory({
      id: channel.id,
      type: 'channel',
      title: channel.name,
      thumb: channel.logo,
      streamUrl: channel.streamUrl,
    });
    router.push({ pathname: '/player', params: { url: channel.streamUrl, title: channel.name } });
  }, [router, addHistory]);

  const handleMoviePress = useCallback((movie: Movie) => {
    addHistory({
      id: movie.id,
      type: 'movie',
      title: movie.title,
      thumb: movie.poster,
      streamUrl: movie.streamUrl,
      durationMinutes: movie.duration,
    });
    router.push({ pathname: '/player', params: { url: movie.streamUrl, title: movie.title } });
  }, [router, addHistory]);

  const handleToggleFavorite = useCallback((movie: Movie) => {
    toggleFavorite({
      id: movie.id,
      type: 'movie',
      title: movie.title,
      thumb: movie.poster,
    });
  }, [toggleFavorite]);

  const featuredChannels = CHANNELS.filter(c => c.isFeatured);
  const liveChannels = CHANNELS.filter(c => c.isLive);
  const newMovies = MOVIES.filter(m => m.isNew);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HeroBanner items={HERO_ITEMS} onPlay={handlePlay} />

        <View style={styles.sections}>
          <View style={styles.section}>
            <SectionHeader title="Canais em Destaque" onSeeAll={() => router.push('/(tabs)/channels')} />
            <FlatList
              data={featuredChannels}
              keyExtractor={(c) => c.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              renderItem={({ item }) => <ChannelCard channel={item} onPress={handleChannelPress} />}
            />
          </View>

          <View style={styles.section}>
            <SectionHeader title="Novidades" onSeeAll={() => router.push('/(tabs)/catalog')} />
            <FlatList
              data={newMovies}
              keyExtractor={(m) => m.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={({ item }) => (
                <MovieCard
                  movie={item}
                  onPress={handleMoviePress}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <SectionHeader title="Filmes" onSeeAll={() => router.push('/(tabs)/catalog')} />
            <FlatList
              data={MOVIES}
              keyExtractor={(m) => m.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={({ item }) => (
                <MovieCard
                  movie={item}
                  onPress={handleMoviePress}
                  variant="wide"
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <SectionHeader title="Ao Vivo Agora" onSeeAll={() => router.push('/(tabs)/channels')} />
            <FlatList
              data={liveChannels}
              keyExtractor={(c) => c.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              renderItem={({ item }) => <ChannelCard channel={item} onPress={handleChannelPress} variant="wide" />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: Layout.tabBarHeight + Layout.xl },
  sections: { paddingTop: Layout.lg },
  section: { marginBottom: Layout.xl },
  hList: { paddingHorizontal: Layout.md },
});