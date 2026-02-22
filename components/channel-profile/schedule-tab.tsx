import { AppSpinner } from "@/components/app-spinner";
import { useChannelSchedule } from "@/hooks/queries/useChannelQueries";
import { FONTS } from "@/styles/global";
import { borderRadius, fs, hp, spacing, wp } from "@/utils/responsive";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type ScheduleTabProps = {
  slug: string;
};

export function ScheduleTab({ slug }: ScheduleTabProps) {
  const { data: schedule = [], isLoading } = useChannelSchedule(slug);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <AppSpinner size="small" color="#1A237E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Weekly Schedule</Text>

      {schedule.length > 0 ? (
        schedule.map((item) => (
          <View key={item.id} style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {new Date(item.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <View style={styles.timelineDot} />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.programTitle}>{item.title}</Text>
              <Text style={styles.programDesc} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.categoryBadge}>{item.category}</Text>
                <Text style={styles.duration}>
                  {item.durationInMinutes} mins
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No programs scheduled for this date
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  sectionTitle: {
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginBottom: hp(20),
  },
  loadingContainer: {
    padding: hp(40),
    alignItems: "center",
  },
  scheduleItem: {
    flexDirection: "row",
    marginBottom: hp(24),
  },
  timeContainer: {
    width: wp(80),
    alignItems: "flex-end",
    marginRight: spacing.md,
    paddingTop: hp(2),
  },
  timeText: {
    fontSize: fs(14),
    fontFamily: FONTS.semibold,
    color: "#1A237E",
  },
  timelineDot: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#1A237E",
    marginTop: hp(8),
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: "#1A237E",
  },
  programTitle: {
    fontSize: fs(16),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginBottom: hp(4),
  },
  programDesc: {
    fontSize: fs(13),
    fontFamily: FONTS.regular,
    color: "#666",
    marginBottom: hp(8),
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    fontSize: fs(11),
    fontFamily: FONTS.medium,
    color: "#1A237E",
    backgroundColor: "#E8EAF6",
    paddingHorizontal: wp(8),
    paddingVertical: hp(2),
    borderRadius: borderRadius.xs,
  },
  duration: {
    fontSize: fs(11),
    fontFamily: FONTS.regular,
    color: "#999",
  },
  emptyContainer: {
    padding: hp(40),
    alignItems: "center",
  },
  emptyText: {
    fontFamily: FONTS.regular,
    color: "#737373",
  },
});
