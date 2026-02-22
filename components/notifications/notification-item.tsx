import { FONTS } from '@/styles/global';
import { borderRadius, fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

type NotificationItemProps = {
  avatar?: ImageSourcePropType;
  title: string;
  subtitle: string;
  timeAgo: string;
  thumbnail?: ImageSourcePropType;
  isRead?: boolean;
  onPress?: () => void;
  onMenuPress?: () => void;
};

export function NotificationItem({
  avatar,
  title,
  subtitle,
  timeAgo,
  thumbnail,
  isRead = true,
  onPress,
  onMenuPress,
}: NotificationItemProps) {
  return (
    <Pressable style={[styles.container, !isRead && styles.unreadContainer]} onPress={onPress}>
      {/* Avatar */}
      {avatar ? (
        <Image source={avatar} style={styles.avatar} resizeMode="cover" />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, !isRead && styles.titleUnread]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>

      {/* Thumbnail */}
      {thumbnail ? (
        <Image source={thumbnail} style={styles.thumbnail} resizeMode="cover" />
      ) : null}

      {!isRead && <View style={styles.unreadDot} />}

      {/* Menu Button */}
      <Pressable onPress={onMenuPress} style={styles.menuButton} hitSlop={8}>
        <Image
          source={require('@/assets/Icons/ellipsis.png')}
          style={styles.menuIcon}
          resizeMode="contain"
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(12),
    gap: wp(12),
    backgroundColor: '#FFFFFF',
  },
  unreadContainer: {
    backgroundColor: "#F8FAFF",
  },
  avatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(28),
  },
  avatarPlaceholder: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(28),
    backgroundColor: "#E5E7EB",
  },
  content: {
    flex: 1,
    gap: hp(4),
  },
  title: {
    fontSize: fs(15),
    fontFamily: FONTS.medium,
    color: '#000000',
  },
  titleUnread: {
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#737373',
  },
  timeAgo: {
    fontSize: fs(13),
    fontFamily: FONTS.regular,
    color: '#999999',
  },
  thumbnail: {
    width: wp(100),
    height: wp(56),
    borderRadius: borderRadius.md,
  },
  menuButton: {
    padding: wp(4),
  },
  menuIcon: {
    width: wp(20),
    height: wp(20),
    tintColor: '#737373',
    transform: [{ rotate: '90deg' }],
  },
  unreadDot: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#2563EB",
  },
});
