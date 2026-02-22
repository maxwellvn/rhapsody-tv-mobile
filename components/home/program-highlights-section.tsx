import { useProgramHighlights } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import { dimensions, fs, spacing } from "@/utils/responsive";
import { router } from "expo-router";
import {
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ProgramHighlightsSkeleton } from "../skeleton";
import { VideoCard } from "./video-card";

export function ProgramHighlightsSection() {
  const { data: highlightsData = [], isLoading } = useProgramHighlights(10);

  const handleCardPress = (videoId: string) => {
    router.push(`/video?id=${videoId}`);
  };

  const handleSeeAllPress = () => {
    router.push("/(tabs)/discover");
  };

  // Show loading state with skeleton
  if (isLoading) {
    return <ProgramHighlightsSkeleton />;
  }

  const displayData = highlightsData.map((highlight) => ({
    id: highlight.id,
    videoId: highlight.id,
    title: highlight.title,
    thumbnailUrl: highlight.thumbnailUrl
      ? ({ uri: highlight.thumbnailUrl } as ImageSourcePropType)
      : (require("@/assets/images/carusel-2.png") as ImageSourcePropType),
    badgeLabel: "Series",
    badgeColor: "#2563EB",
  }));

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Program Highlights</Text>
        <Pressable onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </View>
      {highlightsData.length === 0 && (
        <Text style={styles.noDataText}>No program highlights available</Text>
      )}

      {/* Videos Scroll */}
      {displayData.length > 0 && (
        <View style={styles.scrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
          >
            {displayData.map((highlight) => (
              <VideoCard
                key={highlight.id}
                imageSource={highlight.thumbnailUrl}
                title={highlight.title}
                badgeLabel={highlight.badgeLabel}
                badgeColor={highlight.badgeColor}
                showBadge={true}
                onPress={() => handleCardPress(highlight.videoId)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

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
  scrollView: {
    marginLeft: 0,
  },
  scrollContainer: {
    position: "relative",
  },
  scrollContent: {
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
  },
  noDataText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.regular,
    color: "#94A3B8",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
});
