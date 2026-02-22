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
import { fs, spacing, borderRadius, dimensions, wp } from '@/utils/responsive';
import { getCardDimensions } from '@/utils/card-dimensions';
import { useMemo } from 'react';

type ChannelCardProps = {
  logoSource: ImageSourcePropType;
  channelName: string;
  isLive?: boolean;
  onPress?: () => void;
};

export function ChannelCard({
  logoSource,
  channelName,
  isLive = false,
  onPress,
}: ChannelCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardDimensions = useMemo(
    () => getCardDimensions(windowWidth),
    [windowWidth],
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { width: cardDimensions.channelCardWidth },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.logoContainer}>
        {isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        <Image
          source={logoSource}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.channelName} numberOfLines={1}>
        {channelName}
      </Text>
    </Pressable>
  );
}

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
});
