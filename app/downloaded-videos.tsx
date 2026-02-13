import { offlineDownloadService } from "@/services/offline-download.service";
import { FONTS } from "@/styles/global";
import { formatRelativeTime } from "@/utils/formatters";
import { fs, hp, spacing, wp } from "@/utils/responsive";
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
          <Text style={styles.headerTitle}>Downloaded Videos</Text>
          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : items.length === 0 ? (
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
                  <Ionicons name="trash-outline" size={20} color="#737373" />
                </Pressable>
              </Pressable>
            ))}
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
