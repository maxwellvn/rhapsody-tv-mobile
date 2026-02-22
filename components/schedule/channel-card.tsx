import { FONTS } from '@/styles/global';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { getCardDimensions } from '@/utils/card-dimensions';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { borderRadius, dimensions, fs, spacing, wp } from '@/utils/responsive';

type ChannelCardProps = {
  thumbnailSource: ImageSourcePropType;
  fallbackSource: ImageSourcePropType;
  finalFallbackSource?: ImageSourcePropType;
  thumbnailKey?: string;
  thumbnailResizeMode?: 'cover' | 'contain';
  fallbackResizeMode?: 'cover' | 'contain';
  channelName: string;
  isLive?: boolean;
  isSelected?: boolean;
  fitToContainer?: boolean;
  onPress?: () => void;
};

function ChannelCardInner({
  thumbnailSource,
  fallbackSource,
  finalFallbackSource = require('@/assets/logo/Logo.png') as ImageSourcePropType,
  thumbnailKey,
  thumbnailResizeMode = 'cover',
  fallbackResizeMode = 'contain',
  channelName,
  isLive = false,
  isSelected = false,
  fitToContainer = false,
  onPress
}: ChannelCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [imageLevel, setImageLevel] = useState<0 | 1 | 2>(0);
  const cardDimensions = useMemo(
    () => getCardDimensions(windowWidth),
    [windowWidth],
  );
  useEffect(() => {
    setImageLevel(0);
  }, [thumbnailKey]);

  const handleImageError = useCallback(
    () => setImageLevel((prev) => (prev < 2 ? ((prev + 1) as 0 | 1 | 2) : prev)),
    [],
  );

  const displaySource =
    imageLevel === 0
      ? thumbnailSource
      : imageLevel === 1
        ? fallbackSource
        : finalFallbackSource;
  const displayResizeMode =
    imageLevel === 0
      ? thumbnailResizeMode
      : imageLevel === 1
        ? fallbackResizeMode
        : 'contain';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        fitToContainer && styles.fitContainer,
        isSelected && styles.selectedContainer,
        !fitToContainer && { width: cardDimensions.channelCardWidth },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(15, 23, 42, 0.06)', borderless: false }}
    >
      <View style={[styles.logoContainer, isSelected ? styles.selectedLogoContainer : styles.deselectedLogoContainer]}>
        {isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        <Image
          source={displaySource}
          defaultSource={
            typeof finalFallbackSource === 'number'
              ? finalFallbackSource
              : undefined
          }
          style={styles.logo}
          resizeMode={displayResizeMode}
          onError={handleImageError}
        />
      </View>
      <Text
        style={[styles.channelName, isSelected && styles.selectedChannelName]}
        numberOfLines={1}
      >
        {channelName}
      </Text>
    </Pressable>
  );
}

export const ChannelCard = memo(ChannelCardInner);

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: '#FFFFFF',
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: spacing.sm,
  },
  fitContainer: {
    marginRight: 0,
    width: '100%',
  },
  selectedContainer: {
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.18,
    elevation: 4,
  },
  pressed: {
    opacity: 0.78,
  },
  logoContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  selectedLogoContainer: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#FFFFFF',
  },
  deselectedLogoContainer: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  liveBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    backgroundColor: '#EF4444',
    paddingHorizontal: wp(6),
    paddingVertical: wp(2),
    borderRadius: borderRadius.full,
  },
  liveDot: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: fs(8),
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  channelName: {
    marginTop: spacing.sm,
    fontSize: dimensions.isTablet ? fs(15) : fs(13),
    fontFamily: FONTS.semibold,
    color: '#0F172A',
    textAlign: 'center',
  },
  selectedChannelName: {
    color: '#1D4ED8',
    fontFamily: FONTS.bold,
  },
});
