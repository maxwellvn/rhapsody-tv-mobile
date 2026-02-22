import { AppSpinner } from "@/components/app-spinner";
import {
  useRemoveFromWatchlist,
  useWatchlist,
} from "@/hooks/queries/useUserQueries";
import { FONTS } from "@/styles/global";
import { formatRelativeTime } from "@/utils/formatters";
import { fs, hp, spacing, wp } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WatchlistScreen() {
  const { data, isLoading, refetch } = useWatchlist(1, 100);
  const removeFromWatchlist = useRemoveFromWatchlist();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const items = data?.items?.filter((item) => !!item.video) ?? [];

  const handleRemove = (videoId: string) => {
    Alert.alert("Remove from Watchlist", "Remove this video from your watchlist?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          setRemovingIds((prev) => new Set(prev).add(videoId));
          try {
            await removeFromWatchlist.mutateAsync(videoId);
            refetch();
          } finally {
            setRemovingIds((prev) => {
              const next = new Set(prev);
              next.delete(videoId);
              return next;
            });
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
            <Image
              source={require("@/assets/Icons/back.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.headerTitle}>Watchlist</Text>
          <View style={styles.headerSpacer} />
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <AppSpinner size="small" color="#000" />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="bookmark-outline" size={28} color="#737373" />
            <Text style={styles.emptyText}>Your watchlist is empty</Text>
            <Text style={styles.emptySubtext}>
              Save videos to watch them later
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            {items.map((item, index) => {
              const videoId = item.video?.id;
              const isRemoving = videoId ? removingIds.has(videoId) : false;

              return (
                <Pressable
                  key={videoId ?? index}
                  style={styles.item}
                  onPress={() =>
                    videoId && router.push(`/video?id=${videoId}`)
                  }
                >
                  <Image
                    source={
                      item.video?.thumbnailUrl
                        ? { uri: item.video.thumbnailUrl }
                        : require("@/assets/images/Image-4.png")
                    }
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.itemContent}>
                    <Text style={styles.title} numberOfLines={2}>
                      {item.video?.title || "Untitled Video"}
                    </Text>
                    {item.video?.channel?.name ? (
                      <Text style={styles.meta} numberOfLines={1}>
                        {item.video.channel.name}
                      </Text>
                    ) : null}
                    {item.addedAt ? (
                      <Text style={styles.meta}>
                        Added {formatRelativeTime(item.addedAt)}
                      </Text>
                    ) : null}
                  </View>

                  <Pressable
                    onPress={() => videoId && handleRemove(videoId)}
                    hitSlop={8}
                    style={styles.removeButton}
                    disabled={isRemoving}
                  >
                    {isRemoving ? (
                      <AppSpinner size="small" color="#737373" />
                    ) : (
                      <Ionicons name="bookmark" size={20} color="#E50914" />
                    )}
                  </Pressable>
                </Pressable>
              );
            })}
          </ScrollView>
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
    paddingHorizontal: spacing.xl,
    paddingTop: hp(10),
    paddingBottom: hp(12),
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: wp(4),
  },
  backIcon: {
    width: wp(24),
    height: hp(24),
    tintColor: "#000000",
  },
  headerTitle: {
    flex: 1,
    fontSize: fs(20),
    fontFamily: FONTS.bold,
    color: "#000000",
    marginLeft: spacing.md,
  },
  headerSpacer: {
    width: wp(32),
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fs(15),
    fontFamily: FONTS.medium,
    color: "#737373",
  },
  emptySubtext: {
    fontSize: fs(13),
    fontFamily: FONTS.regular,
    color: "#AFAFAF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: hp(24),
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(10),
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    gap: wp(10),
  },
  thumbnail: {
    width: wp(112),
    height: hp(64),
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
  },
  itemContent: {
    flex: 1,
  },
  title: {
    fontSize: fs(14),
    fontFamily: FONTS.medium,
    color: "#000000",
    marginBottom: hp(4),
  },
  meta: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: "#737373",
  },
  removeButton: {
    padding: wp(4),
  },
});
