import { View, Text, Image, StyleSheet, Pressable, ImageSourcePropType } from 'react-native';
import { FONTS } from '@/styles/global';
import { Badge } from '../badge';
import { wp, hp, fs, spacing, borderRadius, dimensions } from '@/utils/responsive';

type VideoCardProps = {
  imageSource: ImageSourcePropType;
  title: string;
  badgeLabel?: string;
  badgeColor?: string;
  showBadge?: boolean;
  onPress?: () => void;
};

export function VideoCard({ 
  imageSource, 
  title, 
  badgeLabel, 
  badgeColor, 
  showBadge = false,
  onPress 
}: VideoCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={imageSource} 
          style={styles.image}
          resizeMode="cover"
        />
        {showBadge && badgeLabel && (
          <View style={styles.badgeContainer}>
            <Badge label={badgeLabel} dotColor={badgeColor} />
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
    width: dimensions.isTablet ? wp(200) : wp(160),
    marginRight: spacing.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: dimensions.isTablet ? hp(120) : hp(90),
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  title: {
    marginTop: spacing.sm,
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.medium,
    color: '#000000',
    lineHeight: dimensions.isTablet ? fs(22) : fs(18),
  },
});
