import { FONTS } from '@/styles/global';
import { fs, hp, spacing } from '@/utils/responsive';
import { StyleSheet, Text, View } from 'react-native';

type SettingsTitleProps = {
  title: string;
};

export function SettingsTitle({ title }: SettingsTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(10),
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: fs(16),
    fontFamily: FONTS.bold,
    color: '#000000',
  },
});
