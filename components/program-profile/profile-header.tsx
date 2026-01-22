import { Button } from '@/components/button';
import { FONTS } from '@/styles/global';
import { borderRadius, fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, StyleSheet, Text, View } from 'react-native';

type ProgramProfileHeaderProps = {
  bannerImage: any;
  avatarImage: any;
  channelName: string;
  subscriberCount: string;
  videoCount: string;
  description: string;
  onSubscribe?: () => void;
};

export function ProgramProfileHeader({
  bannerImage,
  avatarImage,
  channelName,
  subscriberCount,
  videoCount,
  description,
  onSubscribe,
}: ProgramProfileHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Banner Image */}
      <View style={styles.bannerContainer}>
        <Image 
          source={bannerImage}
          style={styles.banner}
          resizeMode="cover"
        />
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        {/* Avatar and Info */}
        <View style={styles.infoRow}>
          <Image 
            source={avatarImage}
            style={styles.avatar}
            resizeMode="cover"
          />
          
          <View style={styles.infoContainer}>
            <Text style={styles.channelName}>{channelName}</Text>
            <Text style={styles.stats}>
              {subscriberCount} | {videoCount}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* Subscribe Button */}
        <Button 
          onPress={onSubscribe}
          style={styles.subscribeButton}
          textStyle={styles.subscribeButtonText}
        >
          Subscribe
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  bannerContainer: {
    width: '100%',
    height: hp(120),
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: hp(200),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  profileSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(16),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  avatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(32),
    marginRight: spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  channelName: {
    fontSize: fs(18),
    fontFamily: FONTS.bold,
    color: '#000000',
    marginBottom: hp(4),
  },
  stats: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: '#737373',
  },
  description: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#737373',
    lineHeight: fs(20),
    marginBottom: hp(16),
  },
  subscribeButton: {
    backgroundColor: '#0000FF',
    borderRadius: borderRadius.sm,
    paddingVertical: hp(12),
    marginBottom: hp(24),
  },
  subscribeButtonText: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
