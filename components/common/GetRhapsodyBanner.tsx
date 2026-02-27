import { devotionalService } from '@/services/devotional.service';
import { FONTS } from '@/styles/global';
import { borderRadius, dimensions, fs, hp, spacing, wp } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';

const GET_APP_URL =
  'https://web.lwappstore.com/share/appId-32181354074e5cf63319371178894acd';
const READ_RHAPSODY_URL =
  'https://web.lwappstore.com/share/appId-32181354074e5cf63319371178894acd';
const ANDROID_PACKAGE = 'org.rhapsodyofrealities.rhapsody';

async function openRhapsodyApp() {
  try {
    if (Platform.OS === 'android') {
      // Try opening the app directly via Android intent
      const intentUrl = `intent://#Intent;package=${ANDROID_PACKAGE};action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end`;
      const canOpen = await Linking.canOpenURL(intentUrl);
      if (canOpen) {
        await Linking.openURL(intentUrl);
        return;
      }
    } else {
      // iOS: try the LoveWorld app store share link (universal link)
      const canOpen = await Linking.canOpenURL(READ_RHAPSODY_URL);
      if (canOpen) {
        await Linking.openURL(READ_RHAPSODY_URL);
        return;
      }
    }
  } catch {
    // Fall through to web link
  }
  // Fallback: open the smart link which redirects to store or web
  await Linking.openURL(GET_APP_URL);
}

interface DevotionalPreview {
  fulldate: string;
  title: string;
  image: string;
  excerpt: string;
  scripture?: string;
}

const IMAGE_HEIGHT = dimensions.isTablet ? hp(170) : hp(138);

export function GetRhapsodyBanner() {
  const [devotional, setDevotional] = useState<DevotionalPreview | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await devotionalService.getTodayDevotional({ forceRefresh: true });
      if (cancelled) return;
      if (data) {
        setDevotional({
          fulldate: data.fulldate,
          title: data.title,
          image: data.image,
          excerpt:
            (data.excerpt || data.opening_scripture || data.plainBody || '')
              .replace(/\s+/g, ' ')
              .trim(),
          scripture: data.opening_scripture,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!devotional) return null;

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={openRhapsodyApp}
      >
        <View style={styles.imageWrap}>
          {devotional.image ? (
            <Image
              source={{ uri: devotional.image }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="book-outline" size={fs(26)} color="#7C8DB5" />
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.label}>TODAY'S DEVOTIONAL</Text>
          {!!devotional.fulldate && (
            <Text style={styles.date} numberOfLines={1}>
              {devotional.fulldate}
            </Text>
          )}
          <Text style={styles.title} numberOfLines={2}>
            {devotional.title}
          </Text>
          {!!devotional.scripture && (
            <Text style={styles.scripture} numberOfLines={1}>
              {devotional.scripture}
            </Text>
          )}
          <Text style={styles.description} numberOfLines={3}>
            {devotional.excerpt || "Tap to read today's devotional and open the Rhapsody app."}
          </Text>

          <View style={styles.footerRow}>
            <Text style={styles.instruction}>Open in Rhapsody App</Text>
            <View style={styles.ctaPill}>
              <Text style={styles.ctaText}>Open</Text>
              <Ionicons name="chevron-forward" size={fs(12)} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    marginTop: hp(10),
    marginBottom: hp(4),
  },
  card: {
    width: '100%',
    borderRadius: borderRadius.lg,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pressed: {
    opacity: 0.92,
  },
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#EEF2FF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: hp(12),
    paddingBottom: hp(12),
  },
  label: {
    fontSize: fs(10),
    fontFamily: FONTS.bold,
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: hp(4),
  },
  date: {
    fontSize: fs(10),
    fontFamily: FONTS.medium,
    color: '#1D4ED8',
    marginBottom: hp(4),
  },
  title: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.bold,
    color: '#0F172A',
    lineHeight: dimensions.isTablet ? fs(22) : fs(19),
    marginBottom: hp(6),
  },
  scripture: {
    fontSize: fs(11),
    fontFamily: FONTS.semibold,
    color: '#334155',
    marginBottom: hp(6),
  },
  description: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: '#475569',
    lineHeight: fs(17),
    marginBottom: hp(10),
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  instruction: {
    flex: 1,
    fontSize: fs(11),
    fontFamily: FONTS.medium,
    color: '#1D4ED8',
  },
  ctaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    backgroundColor: '#1D4ED8',
    borderRadius: borderRadius.full,
    paddingHorizontal: wp(12),
    paddingVertical: hp(7),
  },
  ctaText: {
    fontSize: fs(11),
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },
});
