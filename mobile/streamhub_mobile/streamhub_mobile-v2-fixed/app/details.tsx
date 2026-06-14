import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';
import { ContentService } from '../src/services/contentService';
import { useFavorites } from '../src/hooks/useFavorites';
import { useMyList } from '../src/hooks/useMyList';
import { useWatchHistory } from '../src/hooks/useWatchHistory';
import { LinearGradient } from 'expo-linear-gradient';

export default function DetailsScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: 'movie' | 'channel' | 'serie' }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const { isAdded: isBookmarked, toggle: toggleBookmark } = useMyList();
  const { add: addHistory } = useWatchHistory();

  const [selectedSeason, setSelectedSeason] = useState(1);

  // Busca detalhes do item correspondente
  const { data: item, isLoading } = useQuery({
    queryKey: ['details', id, type],
    queryFn: async () => {
      if (type === 'movie') {
        const list = await ContentService.getMovies();
        return list.find((m) => m.id === id);
      } else if (type === 'serie') {
        const list = await ContentService.getSeries();
        return list.find((s) => s.id === id);
      } else {
        const list = await ContentService.getChannels();
        return list.find((c) => c.id === id);
      }
    },
    enabled: !!id && !!type,
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Conteúdo não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: '#fff' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isMovie = type === 'movie';
  const isSerie = type === 'serie';
  const isChannel = type === 'channel';

  const title = isChannel ? (item as any).name : (item as any).title;
  const image = isChannel ? (item as any).logo : (item as any).backdrop;
  const poster = isChannel ? (item as any).logo : (item as any).poster;

  const handlePlay = (episodeTitle?: string, customUrl?: string) => {
    const playUrl = customUrl || (item as any).streamUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const playTitle = episodeTitle ? `${title} - ${episodeTitle}` : title;

    addHistory({
      id: item.id,
      type,
      title: playTitle,
      thumb: poster,
      streamUrl: playUrl,
      durationMinutes: isMovie ? (item as any).duration : 30,
    });

    router.push({
      pathname: '/player',
      params: { id: item.id, type, url: playUrl, title: playTitle, thumb: poster }
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: item.id,
      type,
      title,
      thumb: poster,
    });
  };

  const handleToggleBookmark = () => {
    toggleBookmark({
      id: item.id,
      type,
      title,
      thumb: poster,
    });
  };

  // Geração de episódios mockados se for Série
  const mockEpisodes = isSerie 
    ? Array.from({ length: 8 }, (_, i) => ({
        id: `ep-${i + 1}`,
        title: `Episódio ${i + 1}`,
        desc: `Breve sinopse do episódio ${i + 1} da temporada ${selectedSeason}.`,
        duration: '45 min',
        thumb: image,
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      }))
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* HEADER OVERLAY */}
      <TouchableOpacity 
        style={[styles.headerBackBtn, { top: insets.top + 10 }]} 
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
        {/* HERO BACKDROP */}
        <View style={styles.hero}>
          <Image source={{ uri: image }} style={styles.backdrop} contentFit="cover" />
          <LinearGradient
            colors={['rgba(7,9,15,0)', 'rgba(7,9,15,0.6)', '#07090F']}
            style={styles.gradient}
          />
        </View>

        {/* METADATA SECTION */}
        <View style={styles.infoContainer}>
          <Text style={styles.titleText}>{title}</Text>

          <View style={styles.metaRow}>
            {isMovie && <Text style={styles.metaText}>{(item as any).year}</Text>}
            {isMovie && <Text style={styles.metaText}>{(item as any).duration} min</Text>}
            {isSerie && <Text style={styles.metaText}>{(item as any).seasons} Temporadas</Text>}
            <Text style={styles.metaText}>⭐ {(item as any).rating ?? 8.0}</Text>
            <View style={styles.ageBadge}>
              <Text style={styles.ageText}>{item.ageRating}</Text>
            </View>
            <Text style={styles.metaText}>{isChannel ? 'CANAL' : isSerie ? 'SÉRIE' : 'FILME'}</Text>
          </View>

          {/* DESC */}
          <Text style={styles.descriptionText}>
            {item.description || 'Nenhuma descrição disponível para este conteúdo.'}
          </Text>

          {/* ACTIONS */}
          <View style={styles.actionsRow}>
            {!isSerie && (
              <TouchableOpacity style={styles.playBtn} onPress={() => handlePlay()} activeOpacity={0.8}>
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.playBtnText}>Assistir Agora</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.actionIconBtn, isFavorite(item.id) && styles.actionIconBtnActive]} 
              onPress={handleToggleFavorite}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isFavorite(item.id) ? 'heart' : 'heart-outline'} 
                size={22} 
                color={isFavorite(item.id) ? Colors.live : '#fff'} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionIconBtn, isBookmarked(item.id) && styles.actionIconBtnActive]} 
              onPress={handleToggleBookmark}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isBookmarked(item.id) ? 'bookmark' : 'bookmark-outline'} 
                size={22} 
                color={isBookmarked(item.id) ? Colors.accentBright : '#fff'} 
              />
            </TouchableOpacity>
          </View>

          {/* EPISODES & SEASONS FOR SERIES */}
          {isSerie && (
            <View style={styles.episodesSection}>
              <Text style={styles.sectionTitle}>Episódios</Text>
              
              {/* Temporadas Selector */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.seasonsList}>
                {Array.from({ length: (item as any).seasons }, (_, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.seasonChip, selectedSeason === idx + 1 && styles.seasonChipActive]}
                    onPress={() => setSelectedSeason(idx + 1)}
                  >
                    <Text style={[styles.seasonText, selectedSeason === idx + 1 && styles.seasonTextActive]}>
                      Temporada {idx + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Lista de episódios */}
              <View style={styles.episodeList}>
                {mockEpisodes.map((ep) => (
                  <TouchableOpacity 
                    key={ep.id} 
                    style={styles.episodeCard} 
                    onPress={() => handlePlay(ep.title, ep.url)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: ep.thumb }} style={styles.episodeThumb} contentFit="cover" />
                    <View style={styles.episodeInfo}>
                      <Text style={styles.episodeTitle}>{ep.title}</Text>
                      <Text style={styles.episodeDuration}>{ep.duration}</Text>
                      <Text style={styles.episodeDesc} numberOfLines={2}>{ep.desc}</Text>
                    </View>
                    <Ionicons name="play-circle-outline" size={28} color={Colors.accentBright} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loading: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  backBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Layout.radiusMd,
  },
  headerBackBtn: {
    position: 'absolute',
    left: Layout.md,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    width: '100%',
    height: Dimensions ? Dimensions.get('window').height * 0.4 : 300,
    backgroundColor: Colors.surface,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  infoContainer: {
    paddingHorizontal: Layout.md,
    marginTop: -20,
  },
  titleText: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: Layout.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Layout.md,
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  ageBadge: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ageText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  descriptionText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Layout.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Layout.xl,
  },
  playBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: Layout.radiusMd,
    height: 52,
  },
  playBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  actionIconBtn: {
    width: 52,
    height: 52,
    borderRadius: Layout.radiusMd,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBtnActive: {
    borderColor: Colors.accent,
  },
  episodesSection: {
    marginTop: Layout.md,
    gap: Layout.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  seasonsList: {
    gap: 8,
    paddingBottom: 4,
  },
  seasonChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  seasonChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  seasonText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  seasonTextActive: {
    color: '#fff',
  },
  episodeList: {
    gap: 12,
    marginTop: Layout.sm,
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.sm,
    gap: 12,
  },
  episodeThumb: {
    width: 80,
    height: 60,
    borderRadius: 6,
    backgroundColor: Colors.surfaceElevated,
  },
  episodeInfo: {
    flex: 1,
    gap: 2,
  },
  episodeTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  episodeDuration: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  episodeDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
});
