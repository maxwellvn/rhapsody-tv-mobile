import { FONTS } from '@/styles/global';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../badge';

type ChannelCardProps = {
  logoSource: ImageSourcePropType;
  channelName: string;
  isLive?: boolean;
  onPress?: () => void;
};

export function ChannelCard({ 
  logoSource, 
  channelName, 
  isLive = false,
  onPress 
}: ChannelCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.logoContainer}>
        {isLive && (
          <View style={styles.badgeContainer}>
            <Badge label="Live" dotColor="#FF0000" />
          </View>
        )}
        <Image 
          source={logoSource} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.channelName} numberOfLines={1}>
        {channelName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 16,
  },
  logoContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
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
    marginTop: 2,
    fontSize: 16,
    fontFamily: FONTS.semibold,
    color: '#000000',
    textAlign: 'left',
  },
});
