import { memo } from "react";
import { usePrograms } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import { dimensions, fs, spacing } from "@/utils/responsive";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ProgramsSkeleton } from "../skeleton";
import { VideoCard } from "./video-card";

const fallbackImage = require("@/assets/images/Image-4.png");

export const ProgramsSection = memo(function ProgramsSection() {
  const { data: programsData = [], isLoading } = usePrograms(10);

  const handleCardPress = (
    programId: string,
    channelId?: string,
    channelSlug?: string,
  ) => {
    router.push(
      `/program-profile?id=${programId}&channelId=${channelId || ""}&channelSlug=${channelSlug || ""}`,
    );
  };

  const handleSeeAllPress = () => {
    router.push("/programs");
  };

  if (isLoading) {
    return <ProgramsSkeleton />;
  }

  const displayData = programsData
    .filter((program) => (program.videoCount ?? 0) > 0)
    .slice(0, 8)
    .map((program) => ({
      id: program.id,
      channelId: program.channel?.id,
      channelSlug: program.channel?.slug,
      title: program.title,
      coverImageUrl:
        program.thumbnailUrl ||
        program.channel?.coverImageUrl ||
        fallbackImage,
      badgeLabel: program.isLive ? "Live" : "Series",
      badgeColor: program.isLive ? "#DC2626" : "#2563EB",
    }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Programs</Text>
        <Pressable onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </View>
      {displayData.length === 0 && (
        <Text style={styles.noDataText}>No programs available</Text>
      )}

      {displayData.length > 0 && (
        <View style={styles.grid}>
          {displayData.map((program) => (
            <View key={program.id} style={styles.cardWrapper}>
              <VideoCard
                imageSource={program.coverImageUrl}
                title={program.title}
                badgeLabel={program.badgeLabel}
                badgeColor={program.badgeColor}
                showBadge
                fitToContainer
                onPress={() =>
                  handleCardPress(
                    program.id,
                    program.channelId,
                    program.channelSlug,
                  )
                }
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: dimensions.isTablet ? fs(24) : fs(20),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  seeAllText: {
    fontSize: dimensions.isTablet ? fs(14) : fs(13),
    fontFamily: FONTS.semibold,
    color: "#475569",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  cardWrapper: {
    width: dimensions.isTablet ? "31.5%" : "47.5%",
  },
  noDataText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.regular,
    color: "#94A3B8",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
});
