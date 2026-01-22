import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type SettingsItemRadioProps = {
  label: string;
  description?: string;
  selected?: boolean;
  onPress?: () => void;
};

export function SettingsItemRadio({ 
  label, 
  description, 
  selected = false, 
  onPress 
}: SettingsItemRadioProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      {selected && (
        <Image
          source={require('@/assets/Icons/check.png')}
          style={styles.checkmark}
          resizeMode="contain"
        />
      )}
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
  content: {
    flex: 1,
    paddingRight: wp(16),
  },
  label: {
    fontSize: fs(16),
    fontFamily: FONTS.regular,
    color: '#000000',
  },
  description: {
    fontSize: fs(13),
    fontFamily: FONTS.regular,
    color: '#999999',
    marginTop: hp(4),
    lineHeight: fs(18),
  },
  checkmark: {
    width: wp(24),
    height: wp(24),
    tintColor: '#000000',
  },
});
