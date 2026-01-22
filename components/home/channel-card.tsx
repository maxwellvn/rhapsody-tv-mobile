import { FONTS } from '@/styles/global';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../badge';
import { wp, hp, fs, spacing, borderRadius, dimensions } from '@/utils/responsive';

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
  onPress 
}: ChannelCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.logoContainer}>
        {isLive && (
          <View style={styles.badgeContainer}>
            <Badge label="Live" dotColor="#FF0000" />
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
    width: dimensions.isTablet ? wp(140) : wp(120),
    marginRight: spacing.lg,
  },
  logoContainer: {
    position: 'relative',
    width: '100%',
    height: dimensions.isTablet ? hp(150) : hp(120),
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 1,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  channelName: {
    marginTop: spacing.sm,
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.semibold,
    color: '#000000',
    textAlign: 'center',
  },
});
