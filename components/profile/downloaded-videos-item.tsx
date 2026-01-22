import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type DownloadedVideosItemProps = {
  onPress?: () => void;
};

export function DownloadedVideosItem({ onPress }: DownloadedVideosItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image
          source={require('@/assets/Icons/download.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.text}>Downloaded Videos</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(16),
    gap: wp(16),
    marginTop: hp(24),
  },
  iconContainer: {
    width: wp(40),
    height: wp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp(24),
    height: wp(24),
    tintColor: '#737373',
  },
  text: {
    fontSize: fs(16),
    fontFamily: FONTS.medium,
    color: '#737373',
  },
});
