import { memo } from "react";
import { useFeaturedVideos } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import { dimensions, fs, spacing } from "@/utils/responsive";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FeaturedVideosSkeleton } from "../skeleton";
import { VideoCard } from "./video-card";

const fallbackImage = require("@/assets/images/carusel-2.png");

export const FeaturedVideosSection = memo(function FeaturedVideosSection() {
  const router = useRouter();
  const { data: featuredVideos = [], isLoading } = useFeaturedVideos(10);

  const handleCardPress = (videoId: string) => {
    router.push(`/video?id=${videoId}`);
  };

  const handleSeeAllPress = () => {
    router.push("/featured");
  };

  if (isLoading) {
    return <FeaturedVideosSkeleton />;
  }

  const displayData = featuredVideos.slice(0, 8).map((v) => ({
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnailUrl || fallbackImage,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Videos</Text>
        <Pressable onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </View>
      {featuredVideos.length === 0 && (
        <Text style={styles.noDataText}>No featured videos available</Text>
      )}

      {displayData.length > 0 && (
        <View style={styles.grid}>
          {displayData.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <VideoCard
                imageSource={item.thumbnail}
                title={item.title}
                badgeLabel="Featured"
                badgeColor="#2563EB"
                showBadge
                fitToContainer
                onPress={() => handleCardPress(item.id)}
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
