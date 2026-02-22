import { AppSpinner } from "@/components/app-spinner";
import { BottomNav } from "@/components/bottom-nav";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ProfileSection } from "@/components/profile/profile-section";
import { useAuth } from "@/context/AuthContext";
import { offlineDownloadService } from "@/services/offline-download.service";
import { userService } from "@/services/user.service";
import { FONTS } from "@/styles/global";
import {
    PaginatedWatchHistoryResponseDto,
    PaginatedWatchlistResponseDto,
    User,
} from "@/types/api.types";
import { borderRadius, dimensions, fs, hp, spacing, wp } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [watchHistory, setWatchHistory] =
    useState<PaginatedWatchHistoryResponseDto | null>(null);
  const [watchlist, setWatchlist] =
    useState<PaginatedWatchlistResponseDto | null>(null);
  const [downloadedVideos, setDownloadedVideos] = useState<
    Awaited<ReturnType<typeof offlineDownloadService.getDownloads>>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const isMountedRef = useRef(true);

  const loadData = useCallback(async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      const [profileRes, historyRes, watchlistRes, downloads] = await Promise.all([
        userService.getProfile(),
        userService.getWatchHistory(1, 50),
        userService.getWatchlist(1, 50),
        offlineDownloadService.getDownloads(),
      ]);

      if (!isMountedRef.current) return;

      if (profileRes.success) {
        setUser({
          ...profileRes.data,
          avatar: profileRes.data.avatar ?? authUser?.avatar,
          gender: profileRes.data.gender ?? authUser?.gender,
        });
      }

      if (historyRes.success) {
        setWatchHistory(historyRes.data);
      }

      if (watchlistRes.success) {
        setWatchlist(watchlistRes.data);
      }
      setDownloadedVideos(downloads);
    } catch (e: any) {
      if (!isMountedRef.current) return;
      setError(e?.message || "Failed to load profile data");
    } finally {
      if (isMountedRef.current && showLoading) {
        setLoading(false);
      }
    }
  }, [authUser?.avatar, authUser?.gender]);

  useEffect(() => {
    isMountedRef.current = true;
    loadData();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData(false);
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleDownloadedVideos = () => {
    router.push("/downloaded-videos");
  };

  const handleRemoveFromWatchlist = async (videoId: string) => {
    try {
      await userService.removeFromWatchlist(videoId);

      setWatchlist((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          items: prev.items.filter((item) => item.video?.id !== videoId),
        };
      });
    } catch (e: any) {
      setError(e?.message || "Failed to update watchlist");
    }
  };

  const handleTabPress = (tab: string) => {
    if (tab === "Home") {
      router.push("/(tabs)");
    } else if (tab === "Discover") {
      router.push("/(tabs)/discover");
    } else if (tab === "Schedule") {
      router.push("/(tabs)/schedule");
    } else if (tab === "Profile") {
      // Already on profile
    }
  };

  const historyItems = (watchHistory?.items || [])
    .filter((item) => !!item.video)
    .map((item) => ({
      imageSource: item.video?.thumbnailUrl
        ? { uri: item.video.thumbnailUrl }
        : require("@/assets/images/Image-4.png"),
      title: item.video?.title || "Untitled Video",
      badgeLabel: "History",
      badgeColor: "#2563EB",
      showBadge: true,
      onPress: () =>
        item.video?.id && router.push(`/video?id=${item.video.id}`),
    }))
    .slice(0, 4);

  const watchlistItems = (watchlist?.items || [])
    .filter((item) => !!item.video)
    .map((item) => ({
      imageSource: item.video?.thumbnailUrl
        ? { uri: item.video.thumbnailUrl }
        : require("@/assets/images/Image-1.png"),
      title: item.video?.title || "Untitled Video",
      badgeLabel: "Watchlist",
      badgeColor: "#2563EB",
      showBadge: true,
      onPress: () =>
        item.video?.id && router.push(`/video?id=${item.video.id}`),
      onRemovePress: () =>
        item.video?.id && handleRemoveFromWatchlist(item.video.id),
    }))
    .slice(0, 4);
  const downloadedItems = downloadedVideos
    .map((item) => ({
      imageSource: item.thumbnailUrl
        ? { uri: item.thumbnailUrl }
        : require("@/assets/images/Image-4.png"),
      title: item.title || "Untitled Video",
      badgeLabel: "Downloaded",
      badgeColor: "#2563EB",
      showBadge: true,
      onPress: () => item.videoId && router.push(`/video?id=${item.videoId}`),
    }))
    .slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Account, history and downloads</Text>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            onPress={handleNotificationPress}
            hitSlop={8}
            style={styles.iconButton}
          >
            <Image
              source={require("@/assets/Icons/bells.png")}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable
            onPress={handleSettingsPress}
            hitSlop={8}
            style={styles.iconButton}
          >
            <Image
              source={require("@/assets/Icons/settings.png")}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.contentInner}>
          <ProfileInfo
            avatarKey={user?.avatar}
            gender={user?.gender}
            seed={user?.id || user?.fullName || user?.email || "guest-user"}
            name={user?.fullName || "Guest User"}
            subtitle={user?.email || "Manage your account and saved videos"}
            onEditPress={handleEditProfile}
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <AppSpinner size="small" color="#2563EB" />
            </View>
          )}

          {error && !loading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && (
            <>
              {/* History Section */}
              <ProfileSection
                title="History"
                onSeeAllPress={() => router.push("/watch-history")}
                items={historyItems}
              />

              {/* Watchlist Section */}
              <ProfileSection
                title="Watchlist"
                onSeeAllPress={() => router.push("/watchlist")}
                items={watchlistItems}
              />

              <ProfileSection
                title="Downloaded Videos"
                onSeeAllPress={handleDownloadedVideos}
                items={downloadedItems}
              />
            </>
          )}
        </View>
      </ScrollView>

      <BottomNav activeTab="Profile" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.xl,
    paddingTop: hp(10),
    paddingBottom: hp(8),
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: dimensions.isTablet ? fs(28) : fs(24),
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  headerSubtitle: {
    marginTop: hp(2),
    fontSize: fs(12),
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: hp(2),
  },
  iconButton: {
    width: wp(36),
    height: wp(36),
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    width: wp(18),
    height: hp(18),
    tintColor: "#475569",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(120),
  },
  contentInner: {
    width: "100%",
    maxWidth: 980,
    alignSelf: "center",
  },
  loadingContainer: {
    marginTop: hp(14),
    marginHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    paddingVertical: hp(16),
    alignItems: "center",
  },
  errorContainer: {
    marginTop: hp(14),
    marginHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: spacing.lg,
    paddingVertical: hp(12),
  },
  errorText: {
    color: "#DC2626",
    fontSize: fs(13),
    fontFamily: FONTS.medium,
  },
});
