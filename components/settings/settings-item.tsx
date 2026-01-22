import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

type SettingsItemProps = {
  icon: ImageSourcePropType;
  label: string;
  onPress?: () => void;
  isDestructive?: boolean;
};

export function SettingsItem({ icon, label, onPress, isDestructive = false }: SettingsItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image
          source={icon}
          style={[styles.icon, isDestructive && styles.iconDestructive]}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.label, isDestructive && styles.labelDestructive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(10),
    gap: wp(10),
    backgroundColor: '#F5F5F5',
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
    tintColor: '#000000',
  },
  iconDestructive: {
    tintColor: '#DC2626',
  },
  label: {
    fontSize: fs(16),
    fontFamily: FONTS.regular,
    color: '#000000',
  },
  labelDestructive: {
    color: '#DC2626',
  },
});
