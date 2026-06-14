import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';
import { Channel } from '../types';
import { useFormatters } from '../hooks/useFormatters';

interface ChannelCardProps {
  channel: Channel;
  onPress: (channel: Channel) => void;
  variant?: 'default' | 'wide';
  isFavorite?: boolean;
  onToggleFavorite?: (channel: Channel) => void;
}

export function ChannelCard({ channel, onPress, variant = 'default', isFavorite = false, onToggleFavorite }: ChannelCardProps) {
  const { formatViewers } = useFormatters();
  const isWide = variant === 'wide';

  const handleFavorite = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleFavorite?.(channel);
  }, [channel, onToggleFavorite]);

  if (isWide) {
    return (
      <TouchableOpacity style={styles.wideCard} onPress={() => onPress(channel)} activeOpacity={0.75}>
        <View style={styles.wideLogoWrap}>
          <Image
            source={{ uri: channel.logo }}
            style={styles.wideLogo}
            contentFit="contain"
            transition={200}
          />
        </View>
        <View style={styles.wideInfo}>
          <Text style={styles.wideName} numberOfLines={1}>{channel.name}</Text>
          {channel.currentProgram && (
            <Text style={styles.wideProgram} numberOfLines={1}>{channel.currentProgram}</Text>
          )}
          <View style={styles.wideMetaRow}>
            {channel.isLive && (
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>AO VIVO</Text>
              </View>
            )}
            {channel.viewers != null && (
              <Text style={styles.wideMeta}>{formatViewers(channel.viewers)} viewers</Text>
            )}
          </View>
        </View>
        {onToggleFavorite && (
          <TouchableOpacity style={styles.favBtn} onPress={handleFavorite} hitSlop={8}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorite ? Colors.live : '#fff'}
            />
          </TouchableOpacity>
        )}
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(channel)} activeOpacity={0.75}>
      <View style={styles.logoWrap}>
        <Image
          source={{ uri: channel.logo }}
          style={styles.logo}
          contentFit="contain"
          transition={200}
        />
        {channel.isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
        )}
        {onToggleFavorite && (
          <TouchableOpacity style={styles.favBtn} onPress={handleFavorite} hitSlop={8}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={15}
              color={isFavorite ? Colors.live : '#fff'}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>{channel.name}</Text>
      {channel.currentProgram && (
        <Text style={styles.program} numberOfLines={1}>{channel.currentProgram}</Text>
      )}
      {channel.viewers != null && (
        <Text style={styles.viewers}>{formatViewers(channel.viewers)} viewers</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Default card (grid)
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.sm,
    alignItems: 'center',
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: Layout.radiusSm,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.xs,
    overflow: 'hidden',
    position: 'relative',
  },
  logo: {
    width: 48,
    height: 48,
  },
  liveBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: Colors.liveDim,
    paddingVertical: 2,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.live,
  },
  liveText: {
    color: Colors.live,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  program: {
    color: Colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  viewers: {
    color: Colors.textMuted,
    fontSize: 9,
    marginTop: 2,
  },

  // Wide variant (horizontal list)
  wideCard: {
    width: Layout.screenWidth * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Layout.md,
    paddingVertical: Layout.sm,
    gap: Layout.sm,
  },
  wideLogoWrap: {
    width: 48,
    height: 48,
    borderRadius: Layout.radiusSm,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wideLogo: {
    width: 36,
    height: 36,
  },
  wideInfo: {
    flex: 1,
    gap: 3,
  },
  wideName: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  wideProgram: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  wideMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.liveDim,
    borderRadius: Layout.radiusFull,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  wideMeta: {
    color: Colors.textMuted,
    fontSize: 10,
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
});
