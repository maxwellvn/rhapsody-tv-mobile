import { Button } from '@/components/button';
import { FONTS } from '@/styles/global';
import { borderRadius, fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, StyleSheet, Text, View } from 'react-native';

type ChannelProfileHeaderProps = {
  logoImage: any;
  avatarImage: any;
  channelName: string;
  subscriberCount: string;
  videoCount: string;
  description: string;
  onSubscribe?: () => void;
};

export function ChannelProfileHeader({
  logoImage,
  avatarImage,
  channelName,
  subscriberCount,
  videoCount,
  description,
  onSubscribe,
}: ChannelProfileHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Blue Background with Full Width Logo/Banner */}
      <View style={styles.bannerContainer}>
        <Image 
          source={logoImage}
          style={styles.banner}
          resizeMode="contain"
        />
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        {/* Avatar and Channel Name */}
        <View style={styles.infoRow}>
          <Image 
            source={avatarImage}
            style={styles.avatar}
            resizeMode="contain"
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
    height: hp(150),
    backgroundColor: '#1A237E',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: '80%',
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
    width: wp(64),
    height: wp(64),
    borderRadius: wp(32),
    marginRight: spacing.md,
    overflow: 'hidden',
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
