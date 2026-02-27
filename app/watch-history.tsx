import { AppSpinner } from "@/components/app-spinner";
import {
  useClearWatchHistory,
  useRemoveFromHistory,
  useWatchHistory,
} from "@/hooks/queries/useUserQueries";
import { FONTS } from "@/styles/global";
import { formatRelativeTime } from "@/utils/formatters";
import { fs, hp, spacing, wp } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';
import { useAlert } from "@/context/AlertContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WatchHistoryScreen() {
  const { showAlert } = useAlert();
  const { data, isLoading, refetch } = useWatchHistory(1, 100);
  const { mutate: clearHistory, isPending: isClearing } = useClearWatchHistory();
  const { mutate: removeFromHistory, isPending: isRemoving } = useRemoveFromHistory();
  const items = data?.items?.filter((item) => !!item.video) ?? [];
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleClearAll = () => {
    if (!items.length || isClearing) return;
    showAlert("Clear Watch History", "Remove all watch history items?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => clearHistory(),
      },
    ]);
  };

  const handleRemoveItem = (videoId?: string) => {
    if (!videoId || isRemoving) return;
    showAlert("Remove from History", "Remove this video from watch history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFromHistory(videoId),
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
          <Text style={styles.headerTitle}>Watch History</Text>
          <Pressable
            onPress={handleClearAll}
            style={[styles.clearButton, (!items.length || isClearing) && styles.clearButtonDisabled]}
            disabled={!items.length || isClearing}
          >
            {isClearing ? (
              <AppSpinner size="small" color="#DC2626" />
            ) : (
              <Text style={styles.clearButtonText}>Clear all</Text>
            )}
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <AppSpinner size="small" color="#000" />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="time-outline" size={28} color="#737373" />
            <Text style={styles.emptyText}>No watch history yet</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item, index) => item.video?.id ?? String(index)}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Pressable
                  style={styles.itemMain}
                  onPress={() => item.video?.id && router.push(`/video?id=${item.video.id}`)}
                >
                  <Image
                    source={
                      item.video?.thumbnailUrl
                        ? { uri: item.video.thumbnailUrl }
                        : require("@/assets/images/Image-4.png")
                    }
                    style={styles.thumbnail}
                    contentFit="cover"
                    placeholder={{ blurhash }}
                    cachePolicy="memory-disk"
                  />
                  <View style={styles.itemContent}>
                    <Text style={styles.title} numberOfLines={2}>
                      {item.video?.title || "Untitled Video"}
                    </Text>
                    {item.video?.program?.title ? (
                      <Text style={styles.programName} numberOfLines={1}>
                        {item.video.program.title}
                      </Text>
                    ) : null}
                    {item.watchedAt ? (
                      <Text style={styles.meta}>
                        {formatRelativeTime(item.watchedAt)}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.video?.id)}
                  disabled={isRemoving}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                </Pressable>
              </View>
            )}
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
  clearButton: {
    minWidth: wp(64),
    alignItems: "flex-end",
    justifyContent: "center",
  },
  clearButtonDisabled: {
    opacity: 0.45,
  },
  clearButtonText: {
    fontSize: fs(13),
    fontFamily: FONTS.semibold,
    color: "#DC2626",
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
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  itemMain: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(10),
    flex: 1,
    gap: wp(10),
  },
  removeButton: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(8),
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
  programName: {
    fontSize: fs(12),
    fontFamily: FONTS.semibold,
    color: "#1D4ED8",
    marginBottom: hp(2),
  },
  meta: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: "#737373",
  },
});
