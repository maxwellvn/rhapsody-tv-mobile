import { UserAvatar } from '@/components/user-avatar';
import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

type ProfileInfoProps = {
  avatarKey?: string;
  gender?: string;
  seed?: string;
  name: string;
  subtitle?: string;
  onEditPress?: () => void;
};

export function ProfileInfo({
  avatarKey,
  gender,
  seed,
  name,
  subtitle,
  onEditPress,
}: ProfileInfoProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 370;

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        <UserAvatar
          avatarKey={avatarKey}
          gender={gender}
          seed={seed}
          size={isCompact ? wp(52) : wp(60)}
          style={styles.avatar}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {name}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <Pressable style={styles.editButton} onPress={onEditPress}>
        <Image
          source={require('@/assets/Icons/edit.png')}
          style={styles.editIcon}
          resizeMode="contain"
        />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.xl,
    marginTop: hp(8),
    paddingHorizontal: spacing.lg,
    paddingVertical: hp(16),
    borderRadius: wp(18),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: hp(12),
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 3,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(14),
  },
  avatar: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(40),
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: fs(24),
    fontFamily: FONTS.bold,
    color: '#0F172A',
    lineHeight: fs(30),
  },
  subtitle: {
    marginTop: hp(2),
    fontSize: fs(13),
    fontFamily: FONTS.regular,
    color: '#64748B',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
    alignSelf: 'flex-start',
    paddingHorizontal: wp(14),
    paddingVertical: hp(9),
    borderRadius: wp(999),
    backgroundColor: '#1D4ED8',
  },
  editIcon: {
    width: wp(16),
    height: wp(16),
    tintColor: '#FFFFFF',
  },
  editButtonText: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
});
