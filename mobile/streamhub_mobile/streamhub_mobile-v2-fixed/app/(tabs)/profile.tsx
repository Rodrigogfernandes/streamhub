import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Layout } from '../../src/constants/layout';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useWatchHistory } from '../../src/hooks/useWatchHistory';
import { useFormatters } from '../../src/hooks/useFormatters';
import { useAuth } from '../../src/contexts/auth';

const MENU_ITEMS = [
  { icon: 'heart-outline',             label: 'Favoritos',          badge: 'favorites' },
  { icon: 'time-outline',              label: 'Histórico',           badge: null },
  { icon: 'list-outline',              label: 'Minha Lista',         badge: null },
  { icon: 'shield-checkmark-outline',  label: 'Controle Parental',   badge: null },
  { icon: 'notifications-outline',     label: 'Notificações',        badge: null },
  { icon: 'settings-outline',          label: 'Configurações',       badge: null },
  { icon: 'help-circle-outline',       label: 'Ajuda',               badge: null },
] as const;

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { count: favCount, favorites, loading: favLoading } = useFavorites();
  const { count: histCount, hours, history, loading: histLoading } = useWatchHistory();
  const { formatViewers } = useFormatters();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const scrollOffset = useRef(0);

  const loading = favLoading || histLoading;

  const handleMenuPress = (label: string) => {
    const routes: Record<string, string> = {
      'Favoritos': '/favorites',
      'Histórico': '/history',
      'Minha Lista': '/my-list',
      'Controle Parental': '/parental-control',
      'Notificações': '/notifications',
      'Configurações': '/settings',
      'Ajuda': '/help',
    };
    if (routes[label]) router.push(routes[label] as any);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const getBadge = (key: string | null) => {
    if (key === 'favorites') return favCount > 0 ? String(favCount) : null;
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ 
          paddingBottom: Layout.tabBarHeight + Layout.xl * 3,
          paddingTop: insets.top + 16,
        }}
      >

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarBg}>
            <Ionicons name="person" size={40} color={Colors.accent} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Usuário StreamHub'}</Text>
          <Text style={styles.userPlan}>Plano {user?.plan || 'PREMIUM'}</Text>
          <View style={styles.planBadge}>
            <Ionicons name="star" size={11} color="#FBBF24" />
            <Text style={styles.planText}>{user?.plan || 'PREMIUM'}</Text>
          </View>
        </View>

        {/* Stats reais */}
        <View style={styles.statsRow}>
          {loading ? (
            <View style={styles.statsLoading}>
              <ActivityIndicator size="small" color={Colors.accent} />
            </View>
          ) : (
            <>
              <View style={[styles.statItem, { borderRightWidth: 1, borderRightColor: Colors.border }]}>
                <Text style={styles.statValue}>{histCount}</Text>
                <Text style={styles.statLabel}>Assistidos</Text>
              </View>
              <View style={[styles.statItem, { borderRightWidth: 1, borderRightColor: Colors.border }]}>
                <Text style={styles.statValue}>{favCount}</Text>
                <Text style={styles.statLabel}>Favoritos</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{hours}</Text>
                <Text style={styles.statLabel}>Horas</Text>
              </View>
            </>
          )}
        </View>

        {/* Últimos assistidos */}
        {history.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Continuar assistindo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentList}>
              {history.slice(0, 6).map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.recentItem}
                  onPress={() => router.push({ pathname: '/details', params: { id: item.id, type: item.type } })}
                  activeOpacity={0.75}
                >
                  <Image
                    source={{ uri: item.thumb }}
                    style={styles.recentThumb}
                    contentFit="cover"
                    transition={300}
                  />
                  <Text style={styles.recentItemTitle} numberOfLines={2}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Menu */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => {
            const badge = getBadge(item.badge);
            return (
              <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.7} onPress={() => handleMenuPress(item.label)}>
                <View style={styles.menuIconWrap}>
                  <Ionicons name={item.icon as any} size={20} color={Colors.accent} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <View style={styles.menuRight}>
                  {badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout} disabled={loggingOut}>
          <Ionicons name="log-out-outline" size={18} color={Colors.live} />
          <Text style={styles.logoutText}>{loggingOut ? 'Saindo...' : 'Sair'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Layout.md,
    paddingTop: 56,
    paddingBottom: Layout.md,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  avatarSection: { alignItems: 'center', paddingVertical: Layout.lg },
  avatarBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
    marginBottom: Layout.sm,
  },
  userName: { color: Colors.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 3 },
  userPlan: { color: Colors.textSecondary, fontSize: 13, marginBottom: 8 },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251,191,36,0.1)',
    borderRadius: Layout.radiusFull,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  planText: { color: '#FBBF24', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Layout.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.lg,
    overflow: 'hidden',
    minHeight: 72,
  },
  statsLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Layout.md,
  },
  statValue: { color: Colors.textPrimary, fontSize: 22, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },

  // Continuar assistindo
  recentSection: {
    marginBottom: Layout.lg,
  },
  recentTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: Layout.md,
    marginBottom: Layout.sm,
  },
  recentList: {
    paddingHorizontal: Layout.md,
    gap: 10,
  },
  recentItem: {
    width: 100,
  },
  recentThumb: {
    width: 100,
    height: 60,
    borderRadius: Layout.radiusSm,
    backgroundColor: Colors.surfaceElevated,
    marginBottom: 5,
  },
  recentItemTitle: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 14,
  },

  menu: {
    marginHorizontal: Layout.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Layout.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    gap: 12,
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: Layout.radiusSm,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, color: Colors.textPrimary, fontSize: 15, fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    backgroundColor: Colors.accent,
    borderRadius: Layout.radiusFull,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: Layout.md,
    marginTop: Layout.lg,
    paddingVertical: 14,
    borderRadius: Layout.radiusMd,
    backgroundColor: Colors.liveDim,
    borderWidth: 1,
    borderColor: Colors.live + '30',
  },
  logoutText: { color: Colors.live, fontSize: 15, fontWeight: '600' },
});