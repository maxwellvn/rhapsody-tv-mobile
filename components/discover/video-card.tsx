import { FONTS } from '@/styles/global';
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
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1.4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
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
