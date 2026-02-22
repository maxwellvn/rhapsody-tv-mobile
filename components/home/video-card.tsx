import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
  useWindowDimensions,
} from 'react-native';
import { FONTS } from '@/styles/global';
import { fs, spacing, borderRadius, dimensions, wp } from '@/utils/responsive';
import { getCardDimensions } from '@/utils/card-dimensions';
import { useMemo } from 'react';

const HOME_VIDEO_MEDIA_ASPECT_RATIO = 2;

type VideoCardProps = {
  imageSource: ImageSourcePropType;
  title: string;
  badgeLabel?: string;
  badgeColor?: string;
  showBadge?: boolean;
  fitToContainer?: boolean;
  onPress?: () => void;
};

export function VideoCard({
  imageSource,
  title,
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
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
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
    </Pressable>
  );
}

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
});
