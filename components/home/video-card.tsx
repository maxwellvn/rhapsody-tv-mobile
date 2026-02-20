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
import { Badge } from '../badge';
import { fs, spacing, borderRadius, dimensions } from '@/utils/responsive';
import {
  getCardDimensions,
  VIDEO_MEDIA_ASPECT_RATIO,
} from '@/utils/card-dimensions';
import { useMemo } from 'react';

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
  const { width: windowWidth } = useWindowDimensions();
  const cardDimensions = useMemo(
    () => getCardDimensions(windowWidth),
    [windowWidth],
  );

  return (
    <Pressable
      style={[
        styles.container,
        {
          width: cardDimensions.compactVideoCardWidth,
          marginRight: cardDimensions.compactVideoCardGap,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={imageSource} 
          style={styles.image}
          resizeMode="contain"
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
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: VIDEO_MEDIA_ASPECT_RATIO,
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
