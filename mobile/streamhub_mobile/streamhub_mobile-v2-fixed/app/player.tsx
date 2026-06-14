import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';

export default function PlayerScreen() {
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
  const router = useRouter();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<VideoView>(null);

  const player = useVideoPlayer(url ?? '', (p) => {
    p.play();
  });

  // ── Eventos do player ────────────────────────────────────────────────────
  useEffect(() => {
    const subs = [
      player.addListener('playingChange', ({ isPlaying: playing }) => {
        setIsPlaying(playing);
      }),
      player.addListener('statusChange', ({ status }) => {
        setIsLoading(status === 'loading');
      }),
      player.addListener('mutedChange', ({ muted }) => {
        setIsMuted(muted);
      }),
    ];

    return () => subs.forEach((s) => s.remove());
  }, [player]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleTap = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3500);
  };

  const togglePlay = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const toggleMute = () => {
    player.muted = !player.muted;
  };

  const seek = (seconds: number) => {
    player.currentTime = Math.max(0, player.currentTime + seconds);
  };

  const toggleFullscreen = () => {
    videoRef.current?.enterFullscreen();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Vídeo na base — não consome toques */}
      <VideoView
        ref={videoRef}
        player={player}
        style={styles.video}
        nativeControls={false}
        allowsPictureInPicture
        contentFit="contain"
      />

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      )}

      {/* Overlay transparente que captura toques sobre o vídeo */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={handleTap}
      >
        {showControls && !isLoading && (
          <View style={styles.controls}>

            {/* TOP BAR */}
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.iconBtn}
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.titleText} numberOfLines={1}>
                {title}
              </Text>

              <TouchableOpacity onPress={toggleMute} style={styles.iconBtn}>
                <Ionicons
                  name={isMuted ? 'volume-mute' : 'volume-high'}
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            {/* CENTER */}
            <View style={styles.centerControls}>
              <TouchableOpacity style={styles.seekBtn} onPress={() => seek(-10)}>
                <Ionicons name="play-back" size={28} color="#fff" />
                <Text style={styles.seekLabel}>10</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.playPauseBtn} onPress={togglePlay}>
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={36}
                  color="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.seekBtn} onPress={() => seek(10)}>
                <Ionicons name="play-forward" size={28} color="#fff" />
                <Text style={styles.seekLabel}>10</Text>
              </TouchableOpacity>
            </View>

            {/* BOTTOM */}
            <View style={styles.bottomBar}>
              <View style={styles.liveBar}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>AO VIVO</Text>
              </View>

              <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="heart-outline" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="share-outline" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="settings-outline" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn} onPress={toggleFullscreen}>
                  <Ionicons name="expand-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Vídeo ocupa tela toda na base
  video: {
    ...StyleSheet.absoluteFillObject,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },

  controls: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'space-between',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.md,
    paddingTop: 16,
    gap: 12,
  },

  titleText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },

  seekBtn: {
    alignItems: 'center',
    gap: 3,
  },

  seekLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  playPauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomBar: {
    paddingHorizontal: Layout.md,
    paddingBottom: 20,
    gap: 14,
  },

  liveBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.live,
  },

  liveText: {
    color: Colors.live,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  bottomActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});