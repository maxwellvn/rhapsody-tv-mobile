import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type SettingsItemArrowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
};

export function SettingsItemArrow({ label, value, onPress }: SettingsItemArrowProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.rightContainer}>
        {value && <Text style={styles.value}>{value}</Text>}
        <Image
          source={require('@/assets/Icons/dropdown.png')}
          style={styles.arrow}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(14),
    backgroundColor: '#F5F5F5',
  },
  label: {
    fontSize: fs(16),
    fontFamily: FONTS.regular,
    color: '#000000',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
  },
  value: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#999999',
  },
  arrow: {
    width: wp(20),
    height: wp(20),
    tintColor: '#999999',
    transform: [{ rotate: '-90deg' }],
  },
});
