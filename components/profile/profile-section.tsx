import { FONTS } from '@/styles/global';
import { fs, hp, spacing } from '@/utils/responsive';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProfileVideoCard } from './video-card';

type ProfileSectionProps = {
  title: string;
  onSeeAllPress?: () => void;
  items: {
    imageSource: any;
    title: string;
    badgeLabel?: string;
    badgeColor?: string;
    showBadge?: boolean;
    onPress?: () => void;
  }[];
};

export function ProfileSection({ title, onSeeAllPress, items }: ProfileSectionProps) {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>View all</Text>
        </Pressable>
      </View>

      {/* Videos Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {items.map((item, index) => (
          <ProfileVideoCard
            key={index}
            imageSource={item.imageSource}
            title={item.title}
            badgeLabel={item.badgeLabel}
            badgeColor={item.badgeColor}
            showBadge={item.showBadge}
            onPress={item.onPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(10),
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  title: {
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: '#000000',
  },
  seeAllText: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: '#666666',
  },
  scrollView: {
    marginLeft: 0,
  },
  scrollContent: {
    paddingRight: 0,
  },
});
