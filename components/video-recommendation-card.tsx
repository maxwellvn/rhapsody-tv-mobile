import { Ionicons } from '@expo/vector-icons';
import { VIDEO_MEDIA_ASPECT_RATIO } from '@/utils/card-dimensions';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from './badge';

type VideoRecommendationCardProps = {
  thumbnailSource: ImageSourcePropType;
  title: string;
  channelName: string;
  channelAvatar: ImageSourcePropType;
  viewCount: string;
  timeAgo: string;
  isNew?: boolean;
  onPress?: () => void;
  onMenuPress?: () => void;
};

export function VideoRecommendationCard({
  thumbnailSource,
  title,
  channelName,
  channelAvatar,
  viewCount,
  timeAgo,
  isNew = false,
  onPress,
  onMenuPress,
}: VideoRecommendationCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={thumbnailSource}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {isNew && (
          <View style={styles.newBadge}>
            <Badge label="New" dotColor="#0000FF" />
          </View>
        )}
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          <View style={styles.metaContainer}>
            <Image
              source={channelAvatar}
              style={styles.channelAvatar}
              resizeMode="contain"
            />
            <Text style={styles.channelName} numberOfLines={1}>{channelName}</Text>
            <Ionicons name="eye-outline" size={14} color="#737373" style={styles.eyeIcon} />
            <Text style={styles.viewCount} numberOfLines={1}>{viewCount}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.timeAgo} numberOfLines={1}>{timeAgo}</Text>
          </View>
        </View>

        <Pressable onPress={onMenuPress} style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#000000" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: VIDEO_MEDIA_ASPECT_RATIO,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  newBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
    fontFamily: 'Inter_600SemiBold',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  channelAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    flexShrink: 0,
  },
  channelName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Inter_500Medium',
    flexShrink: 1,
  },
  eyeIcon: {
    marginLeft: 4,
    flexShrink: 0,
  },
  viewCount: {
    fontSize: 13,
    color: '#737373',
    fontFamily: 'Inter_400Regular',
    flexShrink: 0,
  },
  separator: {
    fontSize: 13,
    color: '#737373',
    fontFamily: 'Inter_400Regular',
    flexShrink: 0,
  },
  timeAgo: {
    fontSize: 13,
    color: '#737373',
    fontFamily: 'Inter_400Regular',
    flexShrink: 0,
  },
  menuButton: {
    padding: 4,
  },
});
