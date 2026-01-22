import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type ProfileInfoProps = {
  avatarSource: any;
  name: string;
  onEditPress?: () => void;
};

export function ProfileInfo({ avatarSource, name, onEditPress }: ProfileInfoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={avatarSource}
        style={styles.avatar}
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
      </View>
      
      <Pressable style={styles.editButton} onPress={onEditPress}>
        <Image
          source={require('@/assets/Icons/edit.png')}
          style={styles.editIcon}
          resizeMode="contain"
        />
        <Text style={styles.editButtonText}>Edit profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(14),
    gap: wp(16),
  },
  avatar: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(40),
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: fs(24),
    fontFamily: FONTS.bold,
    color: '#000000',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  editIcon: {
    width: wp(18),
    height: wp(18),
    tintColor: '#000000',
  },
  editButtonText: {
    fontSize: fs(16),
    fontFamily: FONTS.medium,
    color: '#000000',
  },
});
