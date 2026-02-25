import { memo } from 'react';
import { FONTS } from '@/styles/global';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Badge } from '../badge';

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

type ChannelCardProps = {
  logoSource: string | number;
  channelName: string;
  isLive?: boolean;
  onPress?: () => void;
};

export const ChannelCard = memo(function ChannelCard({
  logoSource,
  channelName,
  isLive = false,
  onPress,
}: ChannelCardProps) {
  const source = typeof logoSource === 'string' ? { uri: logoSource } : logoSource;

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.06)', borderless: false }}
    >
      <View style={styles.logoContainer}>
        {isLive && (
          <View style={styles.badgeContainer}>
            <Badge label="Live" dotColor="#FF0000" />
          </View>
        )}
        <Image
          source={source}
          style={styles.logo}
          contentFit="contain"
          placeholder={{ blurhash }}
          transition={150}
          cachePolicy="memory-disk"
        />
      </View>
      <Text style={styles.channelName} numberOfLines={1}>
        {channelName}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  logoContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  channelName: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: FONTS.semibold,
    color: '#1F2937',
    marginTop: 8,
  },
});