import { FONTS } from "@/styles/global";
import { dimensions, fs, hp, spacing } from "@/utils/responsive";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ProfileVideoCard } from "./video-card";

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
    onRemovePress?: () => void;
  }[];
};

export function ProfileSection({
  title,
  onSeeAllPress,
  items,
}: ProfileSectionProps) {
  const hasItems = items.length > 0;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAllPress ? (
          <Pressable onPress={onSeeAllPress} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>View all</Text>
          </Pressable>
        ) : null}
      </View>

      {hasItems ? (
        <View style={styles.grid}>
          {items.map((item, index) => (
            <View key={index} style={styles.cardWrapper}>
              <ProfileVideoCard
                imageSource={item.imageSource}
                title={item.title}
                badgeLabel={item.badgeLabel}
                badgeColor={item.badgeColor}
                showBadge={item.showBadge}
                fitToContainer
                onPress={item.onPress}
                onRemovePress={item.onRemovePress}
              />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No videos yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(16),
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(14),
  },
  title: {
    fontSize: dimensions.isTablet ? fs(23) : fs(19),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  seeAllButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: hp(4),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  seeAllText: {
    fontSize: dimensions.isTablet ? fs(13) : fs(12),
    fontFamily: FONTS.semibold,
    color: "#475569",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: spacing.lg,
  },
  cardWrapper: {
    width: dimensions.isTablet ? "31.5%" : "47.5%",
  },
  emptyState: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    paddingVertical: hp(20),
    alignItems: "center",
  },
  emptyText: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: "#64748B",
  },
});
