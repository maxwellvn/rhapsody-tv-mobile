import { useCallback, useMemo } from "react";
import { useInfiniteVodVideos } from "@/hooks/queries/useVodQueries";
import { FONTS } from "@/styles/global";
import { dimensions, fs, spacing } from "@/utils/responsive";
import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FeaturedVideosSkeleton } from "../skeleton";
import { VideoCard } from "./video-card";

const fallbackImage = require("@/assets/images/carusel-2.png");
const NUM_COLUMNS = dimensions.isTablet ? 3 : 2;
const PREVIEW_LIMIT = 10;

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string | number;
}

export function AllVideosSection() {
  const router = useRouter();

  const { data, isLoading } = useInfiniteVodVideos(20);

  const videos = useMemo<VideoItem[]>(() => {
    if (!data?.pages) return [];
    const all = data.pages.flatMap((page) =>
      (page.videos ?? []).map((video) => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnailUrl || fallbackImage,
      })),
    );
    return all.slice(0, PREVIEW_LIMIT);
  }, [data]);

  const renderItem = useCallback(
    ({ item }: { item: VideoItem }) => (
      <View style={styles.cardWrapper}>
        <VideoCard
          imageSource={item.thumbnail}
          title={item.title}
          badgeLabel="Video"
          badgeColor="#0EA5E9"
          showBadge
          fitToContainer
          onPress={() => router.push(`/video?id=${item.id}`)}
        />
      </View>
    ),
    [router],
  );

  const keyExtractor = useCallback((item: VideoItem) => item.id, []);

  if (isLoading) {
    return <FeaturedVideosSkeleton />;
  }

  if (videos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Videos</Text>
        </View>
        <Text style={styles.noDataText}>No videos available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Videos</Text>
        <Pressable onPress={() => router.push("/all-videos")}>
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </View>

      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
        initialNumToRender={PREVIEW_LIMIT}
      />
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
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardWrapper: {
    width: dimensions.isTablet ? "31.5%" : "47.5%",
  },
  listContent: {
    flexGrow: 1,
  },
  noDataText: {
    fontSize: dimensions.isTablet ? fs(16) : fs(14),
    fontFamily: FONTS.regular,
    color: "#94A3B8",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
});
