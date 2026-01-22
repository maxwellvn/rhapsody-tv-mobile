import { FONTS } from '@/styles/global';
import { borderRadius, fs, hp, wp } from '@/utils/responsive';
import { Image, StyleSheet, Text, View } from 'react-native';

type ScheduleBadgeProps = {
  label?: string;
  isLive?: boolean;
};

export function ScheduleBadge({ label = 'Live', isLive = true }: ScheduleBadgeProps) {
  if (!isLive) return null;

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/Icons/live.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: borderRadius.md,
    gap: wp(6),
  },
  icon: {
    width: wp(16),
    height: hp(16),
    tintColor: '#FFFFFF',
  },
  label: {
    color: '#FFFFFF',
    fontSize: fs(14),
    fontFamily: FONTS.semibold,
  },
});
