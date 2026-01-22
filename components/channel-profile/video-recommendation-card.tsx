import { Badge } from '@/components/badge';
import { FONTS } from '@/styles/global';
import { borderRadius, fs, hp, spacing, wp } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

type VideoRecommendationCardProps = {
  thumbnailSource: ImageSourcePropType;
  title: string;
  channelName: string;
  channelAvatar: ImageSourcePropType;
  viewCount: string;
  timeAgo: string;
  isLive?: boolean;
  duration?: string;
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
  isLive = false,
  duration = '30:58',
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
        
        {/* Bottom Left - Live Badge */}
        {isLive && (
          <View style={styles.liveBadge}>
            <Badge label="Live" dotColor="#DC2626" showDot={true} />
          </View>
        )}
        
        {/* Bottom Right - Duration */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
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
            <Text style={styles.channelName}>{channelName}</Text>
            <Ionicons name="eye-outline" size={14} color="#737373" style={styles.eyeIcon} />
            <Text style={styles.viewCount}>{viewCount}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
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
    marginBottom: hp(16),
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: hp(200),
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: hp(8),
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  liveBadge: {
    position: 'absolute',
    bottom: hp(8),
    left: wp(8),
  },
  durationBadge: {
    position: 'absolute',
    bottom: hp(8),
    right: wp(8),
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
    borderRadius: borderRadius.sm,
  },
  durationText: {
    fontSize: fs(12),
    fontFamily: FONTS.semibold,
    color: '#FFFFFF',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fs(20),
    fontWeight: '600',
    color: '#000000',
    marginBottom: hp(6),
    fontFamily: FONTS.bold,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  channelAvatar: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
  },
  channelName: {
    fontSize: fs(13),
    fontWeight: '500',
    color: '#000000',
    fontFamily: FONTS.medium,
  },
  eyeIcon: {
    marginLeft: wp(4),
  },
  viewCount: {
    fontSize: fs(13),
    color: '#737373',
    fontFamily: FONTS.regular,
  },
  separator: {
    fontSize: fs(13),
    color: '#737373',
    fontFamily: FONTS.regular,
  },
  timeAgo: {
    fontSize: fs(13),
    color: '#737373',
    fontFamily: FONTS.regular,
  },
  menuButton: {
    padding: wp(4),
  },
});
