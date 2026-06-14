import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useFormatters } from '../hooks/useFormatters';

interface BadgeProps {
  ageRating: string;
  size?: 'sm' | 'md';
}

export function AgeBadge({ ageRating, size = 'md' }: BadgeProps) {
  const { ageRatingColor } = useFormatters();
  const color = ageRatingColor(ageRating);
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { borderColor: color }, isSmall && styles.badgeSm]}>
      <Text style={[styles.text, { color }, isSmall && styles.textSm]}>
        {ageRating === 'L' ? 'L' : `${ageRating}+`}
      </Text>
    </View>
  );
}

interface LiveBadgeProps {
  viewers?: number;
}

export function LiveBadge({ viewers }: LiveBadgeProps) {
  const { formatViewers } = useFormatters();
  return (
    <View style={styles.liveBadge}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>AO VIVO</Text>
      {viewers ? (
        <Text style={styles.viewersText}> · {formatViewers(viewers)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
  textSm: {
    fontSize: 9,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.liveDim,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.live,
    marginRight: 5,
  },
  liveText: {
    color: Colors.live,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  viewersText: {
    color: Colors.textSecondary,
    fontSize: 10,
  },
});
