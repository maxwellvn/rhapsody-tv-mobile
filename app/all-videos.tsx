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
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const fallbackImage = require("@/assets/images/carusel-2.png");
const NUM_COLUMNS = dimensions.isTablet ? 3 : 2;
const PAGE_SIZE = 20;

function normalizeText(text?: string): string {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text?: string): string[] {
  return normalizeText(text)
    .split(" ")
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

function uniqueTokens(text?: string): string[] {
  return Array.from(new Set(tokenize(text)));
}

function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  setA.forEach((token) => {
    if (setB.has(token)) intersection += 1;
  });
  const union = setA.size + setB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

function videoSemanticText(video: VodVideoResponseDto): string {
  return [
    video.title,
    video.program?.title,
    video.channel?.name,
    video.description,
  ]
    .filter(Boolean)
    .join(" ");
}

function stableHash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * MMR-style feed ranking: balances popularity/recency relevance with semantic diversity.
 * This avoids long runs of near-duplicate titles/programs while keeping strong videos near top.
 */
function fypSort(videos: VodVideoResponseDto[], seed: number): VodVideoResponseDto[] {
  if (videos.length <= 2) return videos;

  const now = Date.now();
  const candidates = videos.map((v) => {
    const ageHours = Math.max(1, (now - new Date(v.createdAt).getTime()) / 3_600_000);
    const popularity = Math.log1p(v.viewCount) * 1.7 + Math.log1p(v.likeCount) * 2.3;
    const freshness = 1 / Math.pow(ageHours, 0.55);
    const programBoost = v.program?.id ? 0.35 : 0;
    const baseScore = popularity + freshness * 8 + programBoost;
    const semanticTokens = uniqueTokens(videoSemanticText(v));
    return { video: v, baseScore, semanticTokens };
  });

  const minBase = Math.min(...candidates.map((c) => c.baseScore));
  const maxBase = Math.max(...candidates.map((c) => c.baseScore));
  const normalized = candidates.map((c) => ({
    ...c,
    relevance:
      maxBase > minBase ? (c.baseScore - minBase) / (maxBase - minBase) : 1,
  }));

  const remaining = [...normalized];
  const selected: typeof normalized = [];
  const lambda = 0.82;

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < remaining.length; i += 1) {
      const candidate = remaining[i];
      const redundancy =
        selected.length === 0
          ? 0
          : Math.max(
              ...selected.map((picked) =>
                jaccard(candidate.semanticTokens, picked.semanticTokens),
              ),
            );

      const dailyJitter = ((stableHash(candidate.video.id) ^ seed) % 1000) / 1000_000;
      const mmrScore = lambda * candidate.relevance - (1 - lambda) * redundancy + dailyJitter;

      if (mmrScore > bestScore) {
        bestScore = mmrScore;
        bestIndex = i;
      }
    }

    selected.push(remaining.splice(bestIndex, 1)[0]);
  }

  return selected.map((item) => item.video);
}

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string | number;
  programName?: string;
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
    isRefetching,
    refetch,
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
      programName: v.program?.title,
    }));
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: VideoItem }) => (
      <View style={styles.cardWrapper}>
        <VideoCard
          imageSource={item.thumbnail}
          title={item.title}
          subtitle={item.programName}
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
            refreshControl={
              <RefreshControl
                refreshing={isRefetching && !isLoading}
                onRefresh={handleRefresh}
                tintColor="#1D4ED8"
              />
            }
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
