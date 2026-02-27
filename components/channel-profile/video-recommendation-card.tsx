import { Badge } from '@/components/badge';
import { FONTS } from '@/styles/global';
import { borderRadius, fs, hp, spacing, wp } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { memo } from 'react';

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

type VideoRecommendationCardProps = {
  thumbnailSource: ImageSourcePropType;
  title: string;
  channelName: string;
  programName?: string;
  channelAvatar: ImageSourcePropType;
  viewCount: string;
  timeAgo: string;
  isLive?: boolean;
  duration?: string;
  onPress?: () => void;
  onMenuPress?: () => void;
};

export const VideoRecommendationCard = memo(function VideoRecommendationCard({
  thumbnailSource,
  title,
  channelName,
  programName,
  channelAvatar,
  viewCount,
  timeAgo,
  isLive = false,
  duration,
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
          contentFit="cover"
          placeholder={{ blurhash }}
          transition={200}
          cachePolicy="memory-disk"
        />

        {/* Bottom Left - Live Badge */}
        {isLive && (
          <View style={styles.liveBadge}>
            <Badge label="Live" dotColor="#DC2626" showDot={true} />
          </View>
        )}
        
        {/* Bottom Right - Duration */}
        {duration ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        ) : null}
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          {programName ? (
            <Text style={styles.programName} numberOfLines={1}>{programName}</Text>
          ) : null}

          <View style={styles.metaContainer}>
            <Image
              source={channelAvatar}
              style={styles.channelAvatar}
              contentFit="contain"
              cachePolicy="memory-disk"
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
});

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
  programName: {
    fontSize: fs(13),
    fontFamily: FONTS.semibold,
    color: '#1D4ED8',
    marginBottom: hp(4),
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
    flexShrink: 0,
  },
  channelName: {
    fontSize: fs(13),
    fontWeight: '500',
    color: '#000000',
    fontFamily: FONTS.medium,
    flexShrink: 1,
  },
  eyeIcon: {
    marginLeft: wp(4),
    flexShrink: 0,
  },
  viewCount: {
    fontSize: fs(13),
    color: '#737373',
    fontFamily: FONTS.regular,
    flexShrink: 0,
  },
  separator: {
    fontSize: fs(13),
    color: '#737373',
    fontFamily: FONTS.regular,
    flexShrink: 0,
  },
  timeAgo: {
    fontSize: fs(13),
    color: '#737373',
    fontFamily: FONTS.regular,
    flexShrink: 0,
  },
  menuButton: {
    padding: wp(4),
  },
});
