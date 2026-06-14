import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';

export function Skeleton({ width, height, borderRadius = Layout.radiusSm, style }: {
  width: any;
  height: any;
  borderRadius?: number;
  style?: any;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
        style
      ]}
    />
  );
}

export function HomeSkeleton() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner Skeleton */}
      <Skeleton width="100%" height={Layout.heroBannerHeight} borderRadius={0} />

      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Skeleton width={180} height={18} />
          <Skeleton width={60} height={14} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width={Layout.channelCardWidth} height={Layout.channelCardHeight} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Skeleton width={150} height={18} />
          <Skeleton width={60} height={14} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width={Layout.screenWidth * 0.6} height={Layout.screenWidth * 0.6 * 0.56} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Skeleton width={120} height={18} />
          <Skeleton width={60} height={14} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width={Layout.cardWidth} height={Layout.cardHeight} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

export function CatalogSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Skeleton width={140} height={26} style={{ marginTop: 56, marginBottom: 20 }} />
        <Skeleton width={90} height={32} borderRadius={Layout.radiusFull} style={{ marginTop: 56, marginBottom: 20 }} />
      </View>
      <View style={styles.chipsRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} width={70 + (i % 2) * 20} height={32} borderRadius={Layout.radiusFull} />
        ))}
      </View>
      <View style={styles.grid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} width={(Layout.screenWidth - 32 - 20) / 3} height={((Layout.screenWidth - 32 - 20) / 3) * 1.5} style={{ marginBottom: 10 }} />
        ))}
      </View>
    </View>
  );
}

export function ChannelsSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Skeleton width={120} height={26} style={{ marginTop: 56, marginBottom: 20 }} />
        <Skeleton width={100} height={30} borderRadius={Layout.radiusFull} style={{ marginTop: 56, marginBottom: 20 }} />
      </View>
      <Skeleton width="92%" height={40} style={{ alignSelf: 'center', marginBottom: Layout.md }} />
      <View style={styles.chipsRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} width={80 + (i % 2) * 15} height={32} borderRadius={Layout.radiusFull} />
        ))}
      </View>
      <View style={styles.gridTwo}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} width={(Layout.screenWidth - 32 - 10) / 2} height={((Layout.screenWidth - 32 - 10) / 2) * 0.6} style={{ marginBottom: 10 }} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skeleton: {
    backgroundColor: Colors.surfaceElevated,
  },
  section: {
    marginTop: Layout.lg,
    gap: Layout.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.md,
  },
  hList: {
    paddingHorizontal: Layout.md,
    gap: Layout.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Layout.md,
    marginBottom: Layout.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: Layout.md,
  },
  gridTwo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: Layout.md,
  },
});
