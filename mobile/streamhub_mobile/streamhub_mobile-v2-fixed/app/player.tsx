import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Share,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';
import { HistoryService } from '../src/services/historyservice';
import { useFavorites } from '../src/hooks/useFavorites';

export default function PlayerScreen() {
  const { id, type, url, title, thumb } = useLocalSearchParams<{
    id?: string;
    type?: 'movie' | 'channel' | 'serie';
    url: string;
    title: string;
    thumb?: string;
  }>();
  const router = useRouter();

  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<VideoView>(null);
  const hasSeeked = useRef(false);

  const player = useVideoPlayer(url ?? '', (p) => {
    p.timeUpdateEventInterval = 1; // updates currentTime event every second
    p.play();
  });

  // Observe state changes reactively using useEvent from Expo
  const playingEvent = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const isPlaying = playingEvent?.isPlaying ?? player.playing;

  const statusEvent = useEvent(player, 'statusChange', { status: player.status });
  const status = statusEvent?.status ?? player.status;

  const mutedEvent = useEvent(player, 'mutedChange', { muted: player.muted });
  const isMuted = mutedEvent?.muted ?? player.muted;

  const timeUpdateEvent = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  });
  const currentTime = timeUpdateEvent?.currentTime ?? player.currentTime;

  // Get available audio and subtitle tracks dynamically
  const audioTracksEvent = useEvent(player, 'availableAudioTracksChange', {
    availableAudioTracks: player.availableAudioTracks || [],
  });
  const availableAudioTracks = audioTracksEvent?.availableAudioTracks ?? player.availableAudioTracks ?? [];

  const subtitleTracksEvent = useEvent(player, 'availableSubtitleTracksChange', {
    availableSubtitleTracks: player.availableSubtitleTracks || [],
  });
  const availableSubtitleTracks = subtitleTracksEvent?.availableSubtitleTracks ?? player.availableSubtitleTracks ?? [];

  const isLoading = status === 'loading';

  // Seek to saved progress once player is ready
  useEffect(() => {
    if (status !== 'loading' && !hasSeeked.current && id && type !== 'channel') {
      hasSeeked.current = true;
      HistoryService.getAll().then((list) => {
        const saved = list.find((item) => item.id === id);
        if (saved && saved.progressPosition) {
          const duration = saved.progressDuration || player.duration || 0;
          if (duration > 0 && saved.progressPosition < duration * 0.95) {
            player.currentTime = saved.progressPosition;
          }
        }
      });
    }
  }, [status, id, type, player]);

  // Save progress periodically every 10 seconds
  useEffect(() => {
    if (!id || type === 'channel' || !isPlaying) return;

    const interval = setInterval(async () => {
      const current = player.currentTime;
      const duration = player.duration || 0;
      if (current > 0 && duration > 0) {
        await HistoryService.updateProgress(id, current, duration);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [id, type, isPlaying, player]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (id && type !== 'channel') {
        const current = player.currentTime;
        const duration = player.duration || 0;
        if (current > 0 && duration > 0) {
          HistoryService.updateProgress(id, current, duration);
        }
      }
    };
  }, [id, type, player]);

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

  const handleToggleFavorite = () => {
    if (!id) return;
    toggleFavorite({
      id,
      type: type || 'movie',
      title: title || '',
      thumb: thumb || '',
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Assista a "${title}" no StreamHub! ${url}`,
        title: 'Compartilhar',
      });
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
              {type !== 'channel' && (
                <TouchableOpacity style={styles.seekBtn} onPress={() => seek(-10)}>
                  <Ionicons name="play-back" size={28} color="#fff" />
                  <Text style={styles.seekLabel}>10</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.playPauseBtn} onPress={togglePlay}>
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={36}
                  color="#fff"
                />
              </TouchableOpacity>

              {type !== 'channel' && (
                <TouchableOpacity style={styles.seekBtn} onPress={() => seek(10)}>
                  <Ionicons name="play-forward" size={28} color="#fff" />
                  <Text style={styles.seekLabel}>10</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* BOTTOM */}
            <View style={styles.bottomBar}>
              {type === 'channel' ? (
                <View style={styles.liveBar}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>AO VIVO</Text>
                </View>
              ) : (
                <View style={styles.progressBarContainer}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <View style={styles.progressBarBg}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${player.duration ? (currentTime / player.duration) * 100 : 0}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.timeText}>{formatTime(player.duration)}</Text>
                </View>
              )}

              <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={handleToggleFavorite}>
                  <Ionicons 
                    name={id && isFavorite(id) ? 'heart' : 'heart-outline'} 
                    size={20} 
                    color={id && isFavorite(id) ? Colors.live : '#fff'} 
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                  <Ionicons name="share-outline" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSettings(true)}>
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

      {/* settings modal/overlay */}
      {showSettings && (
        <View style={styles.settingsOverlay}>
          <View style={styles.settingsCard}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Ajustes de Áudio e Legendas</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.settingsScroll}>
              <Text style={styles.settingsSubTitle}>Áudio</Text>
              {availableAudioTracks.length === 0 ? (
                <Text style={styles.noTracksText}>Apenas áudio padrão disponível</Text>
              ) : (
                availableAudioTracks.map((track, idx) => {
                  const isCurrent = player.audioTrack === track || (player.audioTrack?.language === track.language);
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.trackOption, isCurrent && styles.trackOptionActive]}
                      onPress={() => {
                        player.audioTrack = track;
                        setShowSettings(false);
                      }}
                    >
                      <Text style={[styles.trackLabel, isCurrent && styles.trackLabelActive]}>
                        {track.label || track.language || `Áudio ${idx + 1}`}
                      </Text>
                      {isCurrent && <Ionicons name="checkmark" size={18} color={Colors.accentBright} />}
                    </TouchableOpacity>
                  );
                })
              )}

              <View style={styles.divider} />

              <Text style={styles.settingsSubTitle}>Legendas</Text>
              <TouchableOpacity
                style={[styles.trackOption, !player.subtitleTrack && styles.trackOptionActive]}
                onPress={() => {
                  player.subtitleTrack = null;
                  setShowSettings(false);
                }}
              >
                <Text style={[styles.trackLabel, !player.subtitleTrack && styles.trackLabelActive]}>
                  Nenhuma
                </Text>
                {!player.subtitleTrack && <Ionicons name="checkmark" size={18} color={Colors.accentBright} />}
              </TouchableOpacity>

              {availableSubtitleTracks.length === 0 ? (
                <Text style={styles.noTracksText}>Nenhuma legenda embutida encontrada</Text>
              ) : (
                availableSubtitleTracks.map((track, idx) => {
                  const isCurrent = player.subtitleTrack === track || (player.subtitleTrack?.language === track.language);
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.trackOption, isCurrent && styles.trackOptionActive]}
                      onPress={() => {
                        player.subtitleTrack = track;
                        setShowSettings(false);
                      }}
                    >
                      <Text style={[styles.trackLabel, isCurrent && styles.trackLabelActive]}>
                        {track.label || track.language || `Legenda ${idx + 1}`}
                      </Text>
                      {isCurrent && <Ionicons name="checkmark" size={18} color={Colors.accentBright} />}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      )}
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

  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },

  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
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

  // Settings Overlay styles
  settingsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  settingsCard: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.md,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    paddingBottom: Layout.sm,
  },
  settingsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  settingsSubTitle: {
    color: Colors.accentBright,
    fontSize: 14,
    fontWeight: '600',
    marginTop: Layout.sm,
    marginBottom: 6,
  },
  settingsScroll: {
    maxHeight: 300,
  },
  noTracksText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginVertical: 6,
  },
  trackOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: Layout.radiusSm,
  },
  trackOptionActive: {
    backgroundColor: Colors.accentDim,
  },
  trackLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  trackLabelActive: {
    color: Colors.accentBright,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Layout.md,
  },
});