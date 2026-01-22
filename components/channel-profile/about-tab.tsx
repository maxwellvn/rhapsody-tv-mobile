import { FONTS } from '@/styles/global';
import { fs, hp, spacing, wp } from '@/utils/responsive';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

type AboutTabProps = {
  description?: string;
  website?: string;
  joinedDate?: string;
  subscriberCount?: string;
};

export function AboutTab({
  description = "This Morning with Rhapsody of Realities is a daily live program broadcast on Mondays to Saturdays. Its sole purpose is to inspire, uplift, and keep viewers up-to-date with the amazing feats of our Messenger Angel, Rhapsody of Realities, through insightful interviews, testimonies and discussions with guests from all over the globe.",
  website = "https://rhapsodydailies.org",
  joinedDate = "Joined 14 Jul 2016",
  subscriberCount = "500k subscribers",
}: AboutTabProps) {
  const handleWebsitePress = () => {
    Linking.openURL(website).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <View style={styles.container}>
      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>

      {/* More Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More info</Text>

        {/* Website */}
        <Pressable onPress={handleWebsitePress} style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Image
              source={require('@/assets/Icons/globe.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.linkText}>{website}</Text>
        </Pressable>

        {/* Joined Date */}
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Image
              source={require('@/assets/Icons/info.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.infoText}>{joinedDate}</Text>
        </View>

        {/* Subscriber Count */}
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Image
              source={require('@/assets/Icons/persons.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.infoText}>{subscriberCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: hp(32),
  },
  sectionTitle: {
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: '#000000',
    marginBottom: hp(12),
  },
  descriptionText: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#737373',
    lineHeight: fs(22),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(16),
  },
  iconContainer: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  linkText: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: '#0000FF',
    flex: 1,
  },
  infoText: {
    fontSize: fs(14),
    fontFamily: FONTS.regular,
    color: '#737373',
    flex: 1,
  },
  icon: {
    width: wp(24),
    height: wp(24),
    tintColor: '#737373',
  },
});
