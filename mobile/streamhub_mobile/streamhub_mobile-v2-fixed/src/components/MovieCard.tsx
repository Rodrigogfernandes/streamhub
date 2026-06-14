import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';
import { Movie } from '../types';
import { AgeBadge } from './Badge';
import { useFormatters } from '../hooks/useFormatters';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  variant?: 'poster' | 'wide';
  isFavorite?: boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

export function MovieCard({
  movie,
  onPress,
  variant = 'poster',
  isFavorite = false,
  onToggleFavorite,
}: MovieCardProps) {
  const { formatDuration, formatRating } = useFormatters();
  const isWide = variant === 'wide';

  const handleFavorite = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleFavorite?.(movie);
  }, [movie, onToggleFavorite]);

  if (isWide) {
    return (
      <TouchableOpacity style={styles.wideCard} onPress={() => onPress(movie)} activeOpacity={0.75}>
        <Image
          source={{ uri: movie.poster }}
          style={styles.widePoster}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient colors={Colors.gradientCard} style={styles.wideGradient} />

        {/* Botão de favorito */}
        {onToggleFavorite && (
          <TouchableOpacity style={styles.favBtn} onPress={handleFavorite} hitSlop={8}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorite ? Colors.live : '#fff'}
            />
          </TouchableOpacity>
        )}

        <View style={styles.wideInfo}>
          {movie.isNew && <View style={styles.newBadge}><Text style={styles.newText}>NOVO</Text></View>}
          <Text style={styles.wideTitle} numberOfLines={2}>{movie.title}</Text>
          <View style={styles.wideMetaRow}>
            <Ionicons name="star" size={11} color="#FBBF24" />
            <Text style={styles.wideMeta}>{formatRating(movie.rating)}</Text>
            <Text style={styles.wideDot}>·</Text>
            <Text style={styles.wideMeta}>{formatDuration(movie.duration)}</Text>
            <Text style={styles.wideDot}>·</Text>
            <AgeBadge ageRating={movie.ageRating} size="sm" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(movie)} activeOpacity={0.75}>
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: movie.poster }}
          style={styles.poster}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient colors={Colors.gradientCard} style={styles.gradient} />

        {movie.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NOVO</Text>
          </View>
        )}

        {/* Botão de favorito */}
        {onToggleFavorite && (
          <TouchableOpacity style={styles.favBtn} onPress={handleFavorite} hitSlop={8}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={15}
              color={isFavorite ? Colors.live : '#fff'}
            />
          </TouchableOpacity>
        )}

        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FBBF24" />
          <Text style={styles.ratingText}>{formatRating(movie.rating)}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.year}>{movie.year}</Text>
        <AgeBadge ageRating={movie.ageRating} size="sm" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: Layout.cardWidth,
  },
  posterContainer: {
    width: Layout.cardWidth,
    height: Layout.cardHeight,
    borderRadius: Layout.radiusMd,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceElevated,
    marginBottom: Layout.xs,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.accent,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Layout.radiusFull,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.overlay,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  year: {
    color: Colors.textSecondary,
    fontSize: 11,
  },

  // Wide variant
  wideCard: {
    width: Layout.screenWidth * 0.6,
    height: 130,
    borderRadius: Layout.radiusMd,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceElevated,
  },
  widePoster: {
    width: '100%',
    height: '100%',
  },
  wideGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  wideInfo: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
  },
  wideTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },
  wideMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  wideMeta: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  wideDot: {
    color: Colors.textMuted,
    fontSize: 11,
  },
});