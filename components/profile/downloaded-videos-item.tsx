import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type DownloadedVideosItemProps = {
  onPress?: () => void;
  count?: number;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
};

export function DownloadedVideosItem({
  onPress,
  count,
  subtitle = 'Watch your saved videos offline',
  style,
}: DownloadedVideosItemProps) {
  const countLabel =
    typeof count === 'number'
      ? `${count} video${count === 1 ? '' : 's'}`
      : 'Open';
  const statusText =
    typeof count === 'number'
      ? count > 0
        ? 'Available offline'
        : 'No downloads yet'
      : subtitle;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, style, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Image
          source={require('@/assets/Icons/download.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>Downloaded Videos</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {statusText}
        </Text>
      </View>

      <View style={styles.trailing}>
        <Text style={styles.count}>{countLabel}</Text>
        <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: hp(76),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingVertical: hp(12),
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: {
    opacity: 0.84,
  },
  iconContainer: {
    width: wp(42),
    height: wp(42),
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp(22),
    height: wp(22),
    tintColor: '#2563EB',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    marginLeft: spacing.sm,
  },
  title: {
    fontSize: fs(16),
    fontFamily: FONTS.semibold,
    color: '#0F172A',
  },
  subtitle: {
    marginTop: hp(2),
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: '#64748B',
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
    marginLeft: spacing.md,
    flexShrink: 0,
  },
  count: {
    fontSize: fs(12),
    fontFamily: FONTS.semibold,
    color: '#334155',
  },
});
