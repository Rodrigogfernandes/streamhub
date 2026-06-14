import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Dimensions, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';
import { HeroItem } from '../types';
import { AgeBadge } from './Badge';

interface HeroBannerProps {
  items: HeroItem[];
  onPlay: (item: HeroItem) => void;
  onInfo?: (item: HeroItem) => void;
}

const { width } = Dimensions.get('window');

export function HeroBanner({ items, onPlay, onInfo }: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    autoScrollTimer.current = setInterval(() => {
      const next = (activeIndex + 1) % items.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }, 5000);
    return () => clearInterval(autoScrollTimer.current);
  }, [activeIndex, items.length]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
          clearInterval(autoScrollTimer.current);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item.backdrop }}
              style={styles.backdrop}
              contentFit="cover"
              transition={400}
            />
            <LinearGradient
              colors={Colors.gradientHero}
              style={styles.gradient}
            />
            <View style={styles.content}>
              <View style={styles.metaRow}>
                {item.genres.slice(0, 2).map((g) => (
                  <View key={g} style={styles.genreTag}>
                    <Text style={styles.genreText}>{g}</Text>
                  </View>
                ))}
                <AgeBadge ageRating={item.ageRating} />
              </View>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.playBtn} onPress={() => onPlay(item)} activeOpacity={0.85}>
                  <Ionicons name="play" size={18} color="#fff" />
                  <Text style={styles.playText}>Assistir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoBtn} onPress={() => onInfo?.(item)} activeOpacity={0.8}>
                  <Ionicons name="information-circle-outline" size={18} color={Colors.textPrimary} />
                  <Text style={styles.infoText}>Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      {/* Dots */}
      <View style={styles.dots}>
        {items.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Layout.heroBannerHeight,
  },
  slide: {
    width,
    height: Layout.heroBannerHeight,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'absolute',
    bottom: 28,
    left: Layout.md,
    right: Layout.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  genreTag: {
    backgroundColor: Colors.accentDim,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  genreText: {
    color: Colors.accentBright,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.accent,
    borderRadius: Layout.radiusFull,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  playText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  infoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Layout.radiusFull,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  infoText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    height: 3,
    borderRadius: 2,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.accent,
  },
  dotInactive: {
    width: 6,
    backgroundColor: Colors.textMuted,
  },
});
