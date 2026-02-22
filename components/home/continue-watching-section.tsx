import { useContinueWatching } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import {
  borderRadius,
  dimensions,
  fs,
  hp,
  spacing,
  wp,
} from "@/utils/responsive";
import { useRouter } from "expo-router";
import {
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Skeleton } from "../skeleton";
import { VideoCard } from "./video-card";

export function ContinueWatchingSection() {
  const router = useRouter();
  const { data: continueWatchingData = [], isLoading } = useContinueWatching();

  const handleCardPress = (videoId: string, startAt?: number) => {
    router.push(`/video?id=${videoId}&startAt=${Math.max(0, Math.floor(startAt || 0))}`);
  };
  const handleViewMore = () => {
    router.push("/watch-history");
  };

  // Show loading state with skeleton
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton
          width={wp(180)}
          height={dimensions.isTablet ? fs(28) : fs(20)}
          borderRadius={borderRadius.xs}
          style={{ marginBottom: spacing.sm, marginLeft: spacing.xl }}
        />
        <View style={styles.grid}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.cardWrapper}>
              <Skeleton
                width="100%"
                height={dimensions.isTablet ? hp(120) : hp(90)}
                borderRadius={borderRadius.sm}
              />
              <Skeleton
                width="90%"
                height={dimensions.isTablet ? fs(18) : fs(14)}
                borderRadius={borderRadius.xs}
                style={{ marginTop: spacing.sm }}
              />
            </View>
          ))}
        </View>
      </View>
    );
  }

  const displayData = continueWatchingData.map((item) => ({
    imageSource: item.video.thumbnailUrl
      ? ({ uri: item.video.thumbnailUrl } as ImageSourcePropType)
      : (require("@/assets/images/carusel-2.png") as ImageSourcePropType),
    title: item.video.title,
    badgeLabel: undefined,
    badgeColor: undefined,
    showBadge: false,
    videoId: item.video.id,
    progressSeconds: item.progressSeconds ?? 0,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Continue Watching</Text>
        <Pressable onPress={handleViewMore}>
          <Text style={styles.viewMoreText}>View more</Text>
        </Pressable>
      </View>
      {continueWatchingData.length === 0 && (
        <Text style={styles.noDataText}>No videos to continue watching</Text>
      )}

      {displayData.length > 0 && (
        <View style={styles.grid}>
          {displayData.map((item, index) => (
            <View key={item.videoId || index} style={styles.cardWrapper}>
              <VideoCard
                imageSource={item.imageSource}
                title={item.title}
                badgeLabel={item.badgeLabel}
                badgeColor={item.badgeColor}
                showBadge={item.showBadge}
                fitToContainer
                onPress={() => handleCardPress(item.videoId, item.progressSeconds)}
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
  title: {
    fontSize: dimensions.isTablet ? fs(24) : fs(20),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  viewMoreText: {
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
