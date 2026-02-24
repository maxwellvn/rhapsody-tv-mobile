import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '@/styles/global';
import { borderRadius, fs, hp, wp } from '@/utils/responsive';
import { getCardDimensions, VIDEO_MEDIA_ASPECT_RATIO } from '@/utils/card-dimensions';
import { useMemo } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

type HorizontalVideoCardProps = {
  thumbnailSource: ImageSourcePropType;
  duration: string;
  title: string;
  channelName: string;
  viewCount: string;
  timeAgo: string;
  onPress?: () => void;
  onMenuPress?: () => void;
};

export function HorizontalVideoCard({
  thumbnailSource,
  duration,
  title,
  channelName,
  viewCount,
  timeAgo,
  onPress,
  onMenuPress,
}: HorizontalVideoCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardDimensions = useMemo(
    () => getCardDimensions(windowWidth),
    [windowWidth],
  );

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Thumbnail */}
      <View
        style={[
          styles.thumbnailContainer,
          { width: cardDimensions.horizontalVideoThumbWidth },
        ]}
      >
        <Image
          source={thumbnailSource}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <Text style={styles.channelName}>{channelName}</Text>

        <View style={styles.metaContainer}>
          <Text style={styles.viewCount} numberOfLines={1}>{viewCount}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.timeAgo} numberOfLines={1}>{timeAgo}</Text>
        </View>
      </View>

      {/* Menu Button */}
      <Pressable onPress={onMenuPress} style={styles.menuButton} hitSlop={8}>
        <Ionicons name="ellipsis-vertical" size={20} color="#000000" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: hp(16),
    gap: wp(12),
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: VIDEO_MEDIA_ASPECT_RATIO,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: hp(4),
    right: wp(4),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderRadius: borderRadius.sm,
  },
  durationText: {
    fontSize: fs(12),
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: fs(14),
    fontFamily: FONTS.semibold,
    color: '#000000',
    marginBottom: hp(4),
    lineHeight: fs(18),
  },
  channelName: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: '#737373',
    marginBottom: hp(4),
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  viewCount: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: '#737373',
  },
  separator: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: '#737373',
  },
  timeAgo: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: '#737373',
  },
  menuButton: {
    padding: wp(4),
  },
});
