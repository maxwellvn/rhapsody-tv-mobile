import {
  ActiveDownload,
  offlineDownloadService,
} from "@/services/offline-download.service";
import { FONTS } from "@/styles/global";
import { formatRelativeTime } from "@/utils/formatters";
import { borderRadius, fs, hp, spacing, wp } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DownloadedVideoItem = Awaited<
  ReturnType<typeof offlineDownloadService.getDownloads>
>[number];

export default function DownloadedVideosScreen() {
  const [items, setItems] = useState<DownloadedVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDownloads, setActiveDownloads] = useState<ActiveDownload[]>([]);

  const loadDownloads = useCallback(async () => {
    try {
      setLoading(true);
      const list = await offlineDownloadService.getDownloads();
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDownloads();
  }, [loadDownloads]);

  // Subscribe to active (in-progress) downloads
  useEffect(() => {
    const unsubscribe = offlineDownloadService.subscribeToActiveDownloads(
      (downloads) => {
        setActiveDownloads(downloads);
        // Reload completed list whenever active downloads change
        // (a download may have just finished)
        offlineDownloadService.getDownloads().then(setItems);
      },
    );
    return unsubscribe;
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleOpenVideo = (videoId: string) => {
    router.push(`/video?id=${videoId}`);
  };

  const handleRemove = (videoId: string) => {
    Alert.alert("Remove Download", "Remove this downloaded video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await offlineDownloadService.removeDownloadedVideo(videoId);
          setItems((prev) => prev.filter((item) => item.videoId !== videoId));
        },
      },
    ]);
  };

  const handleCancelDownload = (videoId: string) => {
    offlineDownloadService.cancelDownload(videoId);
  };

  const isEmpty = items.length === 0 && activeDownloads.length === 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
            <Image
              source={require("@/assets/Icons/back.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Downloaded Videos</Text>
            <Text style={styles.headerSubtitle}>Your offline library</Text>
          </View>
        </View>

        {loading && activeDownloads.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : isEmpty ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="download-outline" size={28} color="#737373" />
            <Text style={styles.emptyText}>No downloaded videos yet</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* In-Progress Downloads */}
            {activeDownloads.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Downloading</Text>
                {activeDownloads.map((dl) => (
                  <View key={dl.videoId} style={styles.item}>
                    <Image
                      source={
                        dl.thumbnailUrl
                          ? { uri: dl.thumbnailUrl }
                          : require("@/assets/images/Image-4.png")
                      }
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />

                    <View style={styles.itemContent}>
                      <Text style={styles.title} numberOfLines={2}>
                        {dl.title}
                      </Text>
                      {dl.channelName ? (
                        <Text style={styles.meta} numberOfLines={1}>
                          {dl.channelName}
                        </Text>
                      ) : null}

                      {/* Progress bar */}
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${Math.round(dl.progress * 100)}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressLabel}>
                        {Math.round(dl.progress * 100)}%
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => handleCancelDownload(dl.videoId)}
                      hitSlop={8}
                      style={styles.cancelButton}
                    >
                      <Ionicons name="close" size={14} color="#DC2626" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {/* Completed Downloads */}
            {items.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Downloaded</Text>
                {items.map((item) => (
                  <Pressable
                    key={item.videoId}
                    style={styles.item}
                    onPress={() => handleOpenVideo(item.videoId)}
                  >
                    <Image
                      source={
                        item.thumbnailUrl
                          ? { uri: item.thumbnailUrl }
                          : require("@/assets/images/Image-4.png")
                      }
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />

                    <View style={styles.itemContent}>
                      <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.meta} numberOfLines={1}>
                        {item.channelName || "Unknown channel"}
                      </Text>
                      <Text style={styles.meta}>
                        Downloaded {formatRelativeTime(item.downloadedAt)}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => handleRemove(item.videoId)}
                      hitSlop={8}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash-outline" size={16} color="#64748B" />
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            )}
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
    paddingBottom: hp(14),
    backgroundColor: "#FFFFFF",
    gap: spacing.sm,
  },
  backButton: {
    width: wp(34),
    height: wp(34),
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: wp(18),
    height: hp(18),
    tintColor: "#334155",
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fs(22),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  headerSubtitle: {
    marginTop: hp(1),
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  emptyText: {
    fontSize: fs(15),
    fontFamily: FONTS.medium,
    color: "#64748B",
    marginBottom: hp(18),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(24),
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: hp(14),
  },
  sectionTitle: {
    fontSize: fs(12),
    fontFamily: FONTS.semibold,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: hp(8),
    marginBottom: hp(8),
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: hp(10),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    gap: wp(10),
    marginBottom: hp(10),
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnail: {
    width: wp(110),
    height: hp(66),
    borderRadius: borderRadius.sm,
    backgroundColor: "#E2E8F0",
  },
  itemContent: {
    flex: 1,
    paddingTop: hp(1),
  },
  title: {
    fontSize: fs(14),
    fontFamily: FONTS.semibold,
    color: "#0F172A",
    marginBottom: hp(3),
  },
  meta: {
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    marginTop: hp(6),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#1A237E",
  },
  progressLabel: {
    fontSize: fs(11),
    fontFamily: FONTS.regular,
    color: "#1D4ED8",
    marginTop: hp(2),
  },
  removeButton: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: hp(2),
  },
  cancelButton: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    marginTop: hp(2),
  },
});
