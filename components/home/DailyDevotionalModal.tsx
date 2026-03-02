import { FONTS } from '@/styles/global';
import { devotionalService, DevotionalData } from '@/services/devotional.service';
import { borderRadius, dimensions, fs, hp, spacing, wp } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';

const READ_RHAPSODY_URL =
  'https://web.lwappstore.com/share/appId-32181354074e5cf63319371178894acd';
const GET_APP_URL =
  'https://web.lwappstore.com/share/appId-32181354074e5cf63319371178894acd';
const ANDROID_PACKAGE = 'org.rhapsodyofrealities.rhapsody';

async function openRhapsodyApp() {
  try {
    if (Platform.OS === 'android') {
      const intentUrl = `intent://#Intent;package=${ANDROID_PACKAGE};action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end`;
      const canOpen = await Linking.canOpenURL(intentUrl);
      if (canOpen) {
        await Linking.openURL(intentUrl);
        return;
      }
    } else {
      const canOpen = await Linking.canOpenURL(READ_RHAPSODY_URL);
      if (canOpen) {
        await Linking.openURL(READ_RHAPSODY_URL);
        return;
      }
    }
  } catch {
    // Fall through
  }
  await Linking.openURL(GET_APP_URL);
}

type DevotionalPayload = DevotionalData & { audioUrl: string; plainBody: string };

function getAudioUrlCandidates(rawUrl?: string): string[] {
  if (!rawUrl) return [];

  const candidates: string[] = [rawUrl];

  try {
    const parsed = new URL(rawUrl);
    const parts = parsed.pathname.split('/');
    const fileName = parts[parts.length - 1];
    const match = /^(\d{1,2})(\.[a-z0-9]+)$/i.exec(fileName);
    if (match && match[1].length === 1) {
      parts[parts.length - 1] = `${match[1].padStart(2, '0')}${match[2]}`;
      parsed.pathname = parts.join('/');
      const normalizedUrl = parsed.toString();
      if (!candidates.includes(normalizedUrl)) {
        candidates.push(normalizedUrl);
      }
    }
  } catch {
    // Keep original URL only.
  }

  return candidates;
}

export function DailyDevotionalModal() {
  const [visible, setVisible] = useState(false);
  const [devotional, setDevotional] = useState<DevotionalPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const { height: screenHeight } = useWindowDimensions();
  const isSmallScreen = screenHeight < 700;

  // Audio state
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const slotLock = devotionalService.tryAcquireSessionModalSlotLock();
      if (!slotLock) {
        setLoading(false);
        return;
      }

      try {
        const shouldShow = await devotionalService.shouldShowNow();
        if (!shouldShow || cancelled) {
          devotionalService.releaseSessionModalSlotLock(slotLock);
          setLoading(false);
          return;
        }

        const data = await devotionalService.getTodayDevotional({ forceRefresh: true });
        if (cancelled) {
          devotionalService.releaseSessionModalSlotLock(slotLock);
          return;
        }

        if (data) {
          setDevotional(data);
          setVisible(true);
          await devotionalService.markShownNow();
        } else {
          // Allow retry if fetch failed / returned no data.
          devotionalService.releaseSessionModalSlotLock(slotLock);
        }
      } catch {
        devotionalService.releaseSessionModalSlotLock(slotLock);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Stop and unload devotional audio (used on close and unmount)
  const stopAndUnloadSound = useRef(async () => {
    const sound = soundRef.current;
    if (!sound) return;
    soundRef.current = null;
    setIsPlaying(false);
    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.stopAsync();
      }
    } catch {
      // ignore
    }
    try {
      await sound.unloadAsync();
    } catch {
      // ignore
    }
  });

  // When modal is hidden, always stop audio (safety net for any close path)
  useEffect(() => {
    if (!visible) {
      stopAndUnloadSound.current();
    }
  }, [visible]);

  // Cleanup audio on unmount (e.g. user navigates away while modal open)
  useEffect(() => {
    return () => {
      void stopAndUnloadSound.current();
    };
  }, []);

  const handleClose = async () => {
    await stopAndUnloadSound.current();
    setVisible(false);
  };

  const toggleAudio = async () => {
    if (!devotional) return;

    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
      return;
    }

    try {
      setAudioLoading(true);
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const audioCandidates = getAudioUrlCandidates(devotional.audioUrl);
      let sound: Audio.Sound | null = null;

      for (const candidateUrl of audioCandidates) {
        try {
          const created = await Audio.Sound.createAsync(
            { uri: candidateUrl },
            { shouldPlay: true },
          );
          sound = created.sound;
          break;
        } catch {
          // Try next candidate URL.
        }
      }

      if (!sound) {
        setIsPlaying(false);
        return;
      }

      soundRef.current = sound;
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch {
      // Audio unavailable — silently ignore
    } finally {
      setAudioLoading(false);
    }
  };

  if (!visible || !devotional) return null;

  // Truncate body — shorter on small screens
  const maxBodyLen = isSmallScreen ? 100 : 150;
  const bodyPreview =
    devotional.plainBody.length > maxBodyLen
      ? devotional.plainBody.slice(0, maxBodyLen).trimEnd() + '...'
      : devotional.plainBody;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { maxHeight: screenHeight * 0.85 }]}>
          {/* Close button */}
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Ionicons name="close" size={wp(20)} color="#666" />
          </Pressable>

          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header image */}
            {devotional.image ? (
              <Image
                source={{ uri: devotional.image }}
                style={[styles.image, isSmallScreen && styles.imageSmall]}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
              />
            ) : null}

            {/* Date */}
            <Text style={styles.date}>{devotional.fulldate}</Text>

            {/* Title */}
            <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
              {devotional.title}
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Opening Scripture */}
            <Text style={styles.scripture}>{devotional.opening_scripture}</Text>

            {/* Body preview */}
            <Text style={styles.body}>{bodyPreview}</Text>

            {/* Audio player row */}
            <Pressable style={styles.audioRow} onPress={toggleAudio}>
              {audioLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={fs(16)}
                  color="#FFFFFF"
                />
              )}
              <Text style={styles.audioText}>
                {isPlaying ? 'Pause Audio' : 'Listen to Devotional'}
              </Text>
            </Pressable>

            {/* Action buttons */}
            <View style={styles.actions}>
              <Pressable
                style={styles.readBtn}
                onPress={openRhapsodyApp}
              >
                <Ionicons name="book-outline" size={fs(15)} color="#FFFFFF" />
                <Text style={styles.readBtnText}>Read Rhapsody</Text>
              </Pressable>

              <Pressable
                style={styles.getAppBtn}
                onPress={openRhapsodyApp}
              >
                <Ionicons name="download-outline" size={fs(15)} color="#1D4ED8" />
                <Text style={styles.getAppBtnText}>Get App</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: hp(18),
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10,
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: hp(150),
  },
  imageSmall: {
    height: hp(110),
  },
  date: {
    fontSize: fs(11),
    fontFamily: FONTS.medium,
    color: '#888888',
    textAlign: 'center',
    marginTop: hp(12),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: fs(18),
    fontFamily: FONTS.bold,
    color: '#1A1A2E',
    textAlign: 'center',
    marginTop: hp(4),
    marginHorizontal: spacing.lg,
  },
  titleSmall: {
    fontSize: fs(16),
  },
  divider: {
    height: 2,
    backgroundColor: '#C0392B',
    width: wp(50),
    alignSelf: 'center',
    marginTop: hp(8),
    borderRadius: 1,
  },
  scripture: {
    fontSize: fs(13),
    fontFamily: FONTS.semibold,
    color: '#333333',
    marginTop: hp(10),
    marginHorizontal: spacing.lg,
    lineHeight: fs(19),
  },
  body: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: '#555555',
    marginTop: hp(8),
    marginHorizontal: spacing.lg,
    lineHeight: fs(18),
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#555555',
    borderRadius: borderRadius.full,
    paddingHorizontal: wp(14),
    paddingVertical: hp(7),
    marginTop: hp(12),
    gap: wp(6),
  },
  audioText: {
    fontSize: fs(12),
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    marginTop: hp(12),
    marginHorizontal: spacing.lg,
    gap: wp(8),
  },
  readBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D4ED8',
    borderRadius: borderRadius.full,
    paddingVertical: hp(11),
    gap: wp(6),
  },
  readBtnText: {
    fontSize: fs(13),
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },
  getAppBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.full,
    paddingVertical: hp(11),
    borderWidth: 1.5,
    borderColor: '#1D4ED8',
    gap: wp(6),
  },
  getAppBtnText: {
    fontSize: fs(13),
    fontFamily: FONTS.bold,
    color: '#1D4ED8',
  },
});
