import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { useSegments } from 'expo-router';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';

export function OfflineWarning() {
  const segments = useSegments();
  const [isOffline, setIsOffline] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const translateY = useRef(new Animated.Value(120)).current; // Inicia fora da tela

  const isInTabs = segments[0] === '(tabs)';
  const bottomPosition = isInTabs ? Layout.tabBarHeight + 16 : 16;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // Consideramos offline apenas se o estado for explicitamente resolvido como falso
      const offline = state.isConnected === false;
      
      if (offline) {
        setShouldRender(true);
        setIsOffline(true);
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }).start();
      } else {
        setIsOffline(false);
        Animated.timing(translateY, {
          toValue: 120,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          setShouldRender(false);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (!shouldRender) return null;

  return (
    <Animated.View 
      pointerEvents={isOffline ? 'auto' : 'none'}
      style={[
        styles.container, 
        { 
          bottom: bottomPosition,
          transform: [{ translateY }] 
        }
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="cloud-offline-outline" size={20} color="#fff" />
        <Text style={styles.text} numberOfLines={1}>
          Sem conexão. Modo offline ativo.
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Layout.md,
    right: Layout.md,
    backgroundColor: Colors.live,
    borderRadius: Layout.radiusMd,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 99999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
