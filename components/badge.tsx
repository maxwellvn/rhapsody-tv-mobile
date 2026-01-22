import { FONTS } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';

type BadgeProps = {
  label: string;
  dotColor?: string;
  showDot?: boolean;
};

export function Badge({ label, dotColor = '#FF0000', showDot = true }: BadgeProps) {
  return (
    <View style={styles.container}>
      {showDot && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: FONTS.semibold,
  },
});
