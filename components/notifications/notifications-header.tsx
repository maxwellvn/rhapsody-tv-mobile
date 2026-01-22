import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type NotificationsHeaderProps = {
  title?: string;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onMenuPress?: () => void;
};

export function NotificationsHeader({
  title = 'Notifications',
  onBackPress,
  onSearchPress,
  onMenuPress,
}: NotificationsHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Back Button */}
      <Pressable onPress={onBackPress} style={styles.backButton} hitSlop={8}>
        <Image
          source={require('@/assets/Icons/back.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right Actions */}
      <View style={styles.headerRight}>
        <Pressable onPress={onSearchPress} hitSlop={8}>
          <Image
            source={require('@/assets/Icons/search.png')}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </Pressable>

        <Pressable onPress={onMenuPress} hitSlop={8}>
          <Image
            source={require('@/assets/Icons/ellipsis.png')}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: hp(10),
    paddingBottom: hp(12),
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: wp(4),
    marginRight: spacing.md,
  },
  backIcon: {
    width: wp(24),
    height: wp(24),
    tintColor: '#000000',
  },
  title: {
    flex: 1,
    fontSize: fs(24),
    fontFamily: FONTS.bold,
    color: '#000000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(16),
  },
  headerIcon: {
    width: wp(24),
    height: wp(24),
    tintColor: '#000000',
  },
});
