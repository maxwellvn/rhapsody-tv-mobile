import { FONTS } from '@/styles/global';
import { VIDEO_MEDIA_ASPECT_RATIO } from '@/utils/card-dimensions';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../badge';

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
    <Pressable
      style={styles.container}
      onPress={onPress}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.06)', borderless: false }}
    >
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
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: VIDEO_MEDIA_ASPECT_RATIO,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  title: {
    marginTop: 8,
    fontSize: 15,
    fontFamily: FONTS.semibold,
    color: '#000000',
    lineHeight: 20,
  },
});
