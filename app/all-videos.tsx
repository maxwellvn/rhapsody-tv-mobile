import { useInfiniteVodVideos } from "@/hooks/queries/useVodQueries";
import { VideoCard } from "@/components/home/video-card";
import { FONTS } from "@/styles/global";
import { VodVideoResponseDto } from "@/types/api.types";
import { dimensions, fs, spacing } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const fallbackImage = require("@/assets/images/carusel-2.png");
const NUM_COLUMNS = dimensions.isTablet ? 3 : 2;
const PAGE_SIZE = 20;

/**
 * Simple daily-seed shuffle so the FYP order changes each day
 * but stays consistent within a session.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Score videos for the FYP: blend of recency and popularity */
function fypSort(videos: VodVideoResponseDto[], seed: number): VodVideoResponseDto[] {
  const now = Date.now();
  const scored = videos.map((v) => {
    const ageHours = Math.max(1, (now - new Date(v.createdAt).getTime()) / 3_600_000);
    const score = (v.viewCount + v.likeCount * 3 + 1) / Math.pow(ageHours, 0.8);
    return { video: v, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topHalf = scored.slice(0, Math.ceil(scored.length / 2));
  const bottomHalf = scored.slice(Math.ceil(scored.length / 2));

  const shuffledTop = seededShuffle(topHalf, seed);
  const shuffledBottom = seededShuffle(bottomHalf, seed + 1);

  const result: VodVideoResponseDto[] = [];
  let ti = 0;
  let bi = 0;
  while (ti < shuffledTop.length || bi < shuffledBottom.length) {
    if (ti < shuffledTop.length) result.push(shuffledTop[ti++].video);
    if (ti < shuffledTop.length) result.push(shuffledTop[ti++].video);
    if (bi < shuffledBottom.length) result.push(shuffledBottom[bi++].video);
  }

  return result;
}

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string | number;
}

/* ═══════════════════════════════════════════════
   ALL VIDEOS (FYP) SCREEN
   ═══════════════════════════════════════════════ */

export default function AllVideosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const seedRef = useRef(Math.floor(Date.now() / 86_400_000));

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVodVideos(PAGE_SIZE);

  const videos = useMemo<VideoItem[]>(() => {
    if (!data?.pages) return [];
    const allVods = data.pages.flatMap((page) => page.videos ?? []);
    const sorted = fypSort(allVods, seedRef.current);
    return sorted.map((v) => ({
      id: v.id,
      title: v.title,
      thumbnail: v.thumbnailUrl || fallbackImage,
    }));
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={["top", "left", "right", "bottom"]}>
        <StatusBar style="dark" />

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </Pressable>
          <Text style={styles.headerTitle}>All Videos</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#1D4ED8" />
          </View>
        ) : videos.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="videocam-off-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No videos yet</Text>
            <Text style={styles.emptySubtitle}>
              Check back later for new content.
            </Text>
          </View>
        ) : (
          <FlatList
            data={videos}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={NUM_COLUMNS}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 24 },
            ]}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={7}
            removeClippedSubviews
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator
                  size="small"
                  color="#1D4ED8"
                  style={styles.footerLoader}
                />
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: dimensions.isTablet ? fs(20) : fs(18),
    fontFamily: FONTS.bold,
    color: "#0F172A",
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
    paddingTop: spacing.md,
    flexGrow: 1,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: dimensions.isTablet ? fs(18) : fs(16),
    fontFamily: FONTS.bold,
    color: "#334155",
  },
  emptySubtitle: {
    fontSize: dimensions.isTablet ? fs(14) : fs(13),
    fontFamily: FONTS.regular,
    color: "#94A3B8",
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: spacing.lg,
  },
});
