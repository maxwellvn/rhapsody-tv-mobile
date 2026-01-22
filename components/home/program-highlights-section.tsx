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

  // Mock data for fallback
  const mockData = [
    {
      id: "mock-1",
      videoId: "mock-video-1",
      title: "Your Loveworld Special with Pastor Chris Season 2 Phase 5",
      thumbnailUrl: require("@/assets/images/carusel-2.png"),
      badgeLabel: "Series",
      badgeColor: "#2563EB",
    },
    {
      id: "mock-2",
      videoId: "mock-video-2",
      title: "Night Of A Thousand Crusades HIGHLIGHT 3",
      thumbnailUrl: require("@/assets/images/Image-2.png"),
      badgeLabel: "New",
      badgeColor: "#2563EB",
    },
    {
      id: "mock-3",
      videoId: "mock-video-3",
      title: "Your Loveworld Special with Pastor Chris Season 2 Phase 5",
      thumbnailUrl: require("@/assets/images/carusel-2.png"),
      badgeLabel: "Live",
      badgeColor: "#DC2626",
    },
  ];

  // Show loading state with skeleton
  if (isLoading) {
    return <ProgramHighlightsSkeleton />;
  }

  // Show mock data if no highlights data available
  const displayData =
    highlightsData.length > 0
      ? highlightsData.map((highlight) => ({
        id: highlight.id,
        videoId: highlight.id,
        title: highlight.title,
        thumbnailUrl: highlight.thumbnailUrl
          ? ({ uri: highlight.thumbnailUrl } as ImageSourcePropType)
          : (require("@/assets/images/carusel-2.png") as ImageSourcePropType),
        badgeLabel: "Series",
        badgeColor: "#2563EB",
      }))
      : mockData;

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
  },
  title: {
    fontSize: dimensions.isTablet ? fs(24) : fs(20),
    fontFamily: FONTS.bold,
    color: "#000000",
  },
  seeAllText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.medium,
    color: "#666666",
  },
  scrollView: {
    marginLeft: 0,
  },
  scrollContent: {
    paddingRight: 0,
  },
  noDataText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.regular,
    color: "#666666",
    marginBottom: spacing.sm,
  },
});
