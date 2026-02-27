import { memo, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { FONTS } from '@/styles/global';
import { fs, spacing, borderRadius, dimensions, wp } from '@/utils/responsive';
import { getCardDimensions } from '@/utils/card-dimensions';

const HOME_VIDEO_MEDIA_ASPECT_RATIO = 2;

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

type VideoCardProps = {
  imageSource: string | number; // uri string or require() number
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  badgeColor?: string;
  showBadge?: boolean;
  fitToContainer?: boolean;
  onPress?: () => void;
};

export const VideoCard = memo(function VideoCard({
  imageSource,
  title,
  subtitle,
  badgeLabel,
  badgeColor = '#2563EB',
  showBadge = false,
  fitToContainer = false,
  onPress,
}: VideoCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardDimensions = useMemo(
    () => getCardDimensions(windowWidth),
    [windowWidth],
  );

  const isLive = badgeLabel?.toLowerCase() === 'live';

  const source = typeof imageSource === 'string' ? { uri: imageSource } : imageSource;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        !fitToContainer && {
          width: cardDimensions.compactVideoCardWidth,
          marginRight: cardDimensions.compactVideoCardGap,
        },
        fitToContainer && styles.fitContainer,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={source}
          style={styles.image}
          contentFit="cover"
          placeholder={{ blurhash }}
          transition={200}
          recyclingKey={typeof imageSource === 'string' ? imageSource : undefined}
          cachePolicy="memory-disk"
        />
        {showBadge && badgeLabel && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            {isLive && <View style={styles.badgeDot} />}
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 3,
  },
  fitContainer: {
    width: '100%',
    marginRight: 0,
  },
  pressed: {
    opacity: 0.78,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: HOME_VIDEO_MEDIA_ASPECT_RATIO,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    paddingHorizontal: wp(8),
    paddingVertical: wp(3),
    borderRadius: borderRadius.full,
  },
  badgeDot: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(3),
    backgroundColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: fs(9),
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  title: {
    marginTop: spacing.xs,
    fontSize: dimensions.isTablet ? fs(14) : fs(12.5),
    fontFamily: FONTS.semibold,
    color: '#0F172A',
    lineHeight: dimensions.isTablet ? fs(19) : fs(16),
  },
  subtitle: {
    marginTop: 2,
    fontSize: dimensions.isTablet ? fs(12) : fs(10.5),
    fontFamily: FONTS.medium,
    color: '#1D4ED8',
  },
});
