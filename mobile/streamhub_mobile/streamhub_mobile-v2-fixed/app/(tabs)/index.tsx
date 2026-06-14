import React, { useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet, FlatList, StatusBar, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../src/constants/colors';
import { Layout } from '../../src/constants/layout';
import { ContentService } from '../../src/services/contentService';
import { HeroBanner } from '../../src/components/HeroBanner';
import { MovieCard } from '../../src/components/MovieCard';
import { ChannelCard } from '../../src/components/ChannelCard';
import { SectionHeader } from '../../src/components/SectionHeader';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useWatchHistory } from '../../src/hooks/useWatchHistory';
import type { HeroItem, Channel, Movie } from '../../src/types';
import { HomeSkeleton } from '../../src/components/Skeleton';

export default function HomeScreen() {
  const router = useRouter();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const { add: addHistory } = useWatchHistory();
  const [refreshing, setRefreshing] = useState(false);

  // Queries para buscar dados reais (ou mock local se offline/falhar)
  const { data: heroItems = [], isLoading: loadingHero, refetch: refetchHero } = useQuery({
    queryKey: ['featured'],
    queryFn: ContentService.getFeatured,
  });

  const { data: channels = [], isLoading: loadingChannels, refetch: refetchChannels } = useQuery({
    queryKey: ['channels'],
    queryFn: () => ContentService.getChannels(),
  });

  const { data: movies = [], isLoading: loadingMovies, refetch: refetchMovies } = useQuery({
    queryKey: ['movies'],
    queryFn: () => ContentService.getMovies(),
  });

  const loading = loadingHero || loadingChannels || loadingMovies;

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchHero(), refetchChannels(), refetchMovies()]);
    setRefreshing(false);
  };

  const handlePlay = useCallback((item: HeroItem) => {
    if (item.streamUrl) {
      const type = item.type === 'channel' ? 'channel' : 'movie';
      addHistory({
        id: item.id,
        type,
        title: item.title,
        thumb: item.backdrop,
        streamUrl: item.streamUrl,
      });
      router.push({
        pathname: '/player',
        params: { id: item.id, type, url: item.streamUrl, title: item.title, thumb: item.backdrop }
      });
    }
  }, [router, addHistory]);

  const handleInfo = useCallback((item: HeroItem) => {
    // Redireciona para detalhes ao invés de exibir apenas um alerta básico
    router.push({ pathname: '/details', params: { id: item.id, type: item.type === 'channel' ? 'channel' : 'movie' } });
  }, [router]);

  const handleChannelPress = useCallback((channel: Channel) => {
    router.push({ pathname: '/details', params: { id: channel.id, type: 'channel' } });
  }, [router]);

  const handleMoviePress = useCallback((movie: Movie) => {
    router.push({ pathname: '/details', params: { id: movie.id, type: 'movie' } });
  }, [router]);

  const handleToggleFavorite = useCallback((item: Movie | Channel, type: 'movie' | 'channel') => {
    toggleFavorite({
      id: item.id,
      type,
      title: type === 'movie' ? (item as Movie).title : (item as Channel).name,
      thumb: type === 'movie' ? (item as Movie).poster : (item as Channel).logo,
    });
  }, [toggleFavorite]);

  const handleMovieFavorite = useCallback((movie: Movie) => {
    handleToggleFavorite(movie, 'movie');
  }, [handleToggleFavorite]);

  const handleChannelFavorite = useCallback((channel: Channel) => {
    handleToggleFavorite(channel, 'channel');
  }, [handleToggleFavorite]);

  const featuredChannels = channels.filter(c => c.isFeatured);
  const liveChannels = channels.filter(c => c.isLive);
  const newMovies = movies.filter(m => m.isNew);

  if (loading && !refreshing) {
    return <HomeSkeleton />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
            progressBackgroundColor={Colors.surface}
          />
        }
      >
        <HeroBanner items={heroItems} onPlay={handlePlay} onInfo={handleInfo} />

        <View style={styles.sections}>
          {featuredChannels.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Canais em Destaque" onSeeAll={() => router.push('/(tabs)/channels')} />
              <FlatList
                data={featuredChannels}
                keyExtractor={(c) => c.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hList}
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                renderItem={({ item }) => (
                  <ChannelCard
                    channel={item}
                    onPress={handleChannelPress}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={handleChannelFavorite}
                  />
                )}
              />
            </View>
          )}

          {liveChannels.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Ao Vivo Agora" onSeeAll={() => router.push('/(tabs)/channels')} />
              <FlatList
                data={liveChannels}
                keyExtractor={(c) => c.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hList}
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                renderItem={({ item }) => (
                  <ChannelCard
                    channel={item}
                    onPress={handleChannelPress}
                    variant="wide"
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={handleChannelFavorite}
                  />
                )}
              />
            </View>
          )}

          {newMovies.length > 0 && (
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
                    onToggleFavorite={handleMovieFavorite}
                  />
                )}
              />
            </View>
          )}

          {movies.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Filmes" onSeeAll={() => router.push('/(tabs)/catalog')} />
              <FlatList
                data={movies}
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
                    onToggleFavorite={handleMovieFavorite}
                  />
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { flex: 1 },
  content: { paddingBottom: Layout.tabBarHeight + Layout.xl },
  sections: { paddingTop: Layout.lg },
  section: { marginBottom: Layout.xl },
  hList: { paddingHorizontal: Layout.md },
});