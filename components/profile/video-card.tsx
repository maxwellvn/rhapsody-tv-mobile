import { FONTS } from '@/styles/global';
import { borderRadius, fs, hp, wp } from '@/utils/responsive';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../badge';

type ProfileVideoCardProps = {
  imageSource: ImageSourcePropType;
  title: string;
  badgeLabel?: string;
  badgeColor?: string;
  showBadge?: boolean;
  onPress?: () => void;
};

export function ProfileVideoCard({ 
  imageSource, 
  title, 
  badgeLabel, 
  badgeColor, 
  showBadge = false,
  onPress 
}: ProfileVideoCardProps) {
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
    width: wp(160),
    marginRight: wp(12),
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: hp(90),
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: hp(8),
    left: wp(8),
  },
  title: {
    marginTop: hp(8),
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: '#000000',
    lineHeight: fs(18),
  },
});
