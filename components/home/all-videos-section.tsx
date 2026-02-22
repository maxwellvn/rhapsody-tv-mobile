import { useVodVideos } from "@/hooks/queries/useVodQueries";
import { FONTS } from "@/styles/global";
import { dimensions, fs, spacing } from "@/utils/responsive";
import { useRouter } from "expo-router";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FeaturedVideosSkeleton } from "../skeleton";
import { VideoCard } from "./video-card";

export function AllVideosSection() {
  const router = useRouter();
  const { data, isLoading } = useVodVideos(1, 200);

  if (isLoading) {
    return <FeaturedVideosSkeleton />;
  }

  const videos = data?.videos ?? [];

  const displayData = videos.map((video) => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnailUrl
      ? ({ uri: video.thumbnailUrl } as ImageSourcePropType)
      : (require("@/assets/images/carusel-2.png") as ImageSourcePropType),
    badgeLabel: "Video",
    badgeColor: "#0EA5E9",
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Videos</Text>
      </View>

      {displayData.length === 0 && (
        <Text style={styles.noDataText}>No videos available</Text>
      )}

      {displayData.length > 0 && (
        <View style={styles.grid}>
          {displayData.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <VideoCard
                imageSource={item.thumbnail}
                title={item.title}
                badgeLabel={item.badgeLabel}
                badgeColor={item.badgeColor}
                showBadge={true}
                fitToContainer
                onPress={() => router.push(`/video?id=${item.id}`)}
              />
            </View>
          ))}
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
