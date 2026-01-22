import { FONTS } from '@/styles/global';
import { fs, hp, spacing } from '@/utils/responsive';
import { StyleSheet, Text, View } from 'react-native';

type SettingsGroupTitleProps = {
  title: string;
};

export function SettingsGroupTitle({ title }: SettingsGroupTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(20),
    paddingBottom: hp(10),
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: fs(16),
    fontFamily: FONTS.bold,
    color: '#000000',
  },
});
