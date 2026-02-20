import { AppSpinner } from "@/components/app-spinner";
import { BottomNav } from "@/components/bottom-nav";
import { DownloadedVideosItem } from "@/components/profile/downloaded-videos-item";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ProfileSection } from "@/components/profile/profile-section";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import {
    PaginatedWatchHistoryResponseDto,
    PaginatedWatchlistResponseDto,
    User,
} from "@/types/api.types";
import { hp, spacing, wp } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Image,
    Pressable,
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadData = useCallback(async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      const [profileRes, historyRes, watchlistRes] = await Promise.all([
        userService.getProfile(),
        userService.getWatchHistory(1, 50),
        userService.getWatchlist(1, 50),
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />

        <View style={styles.headerRight}>
          <Pressable onPress={handleNotificationPress} hitSlop={8}>
            <Image
              source={require("@/assets/Icons/bells.png")}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable onPress={handleSettingsPress} hitSlop={8}>
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
      >
        <View style={styles.contentInner}>
          <ProfileInfo
            avatarKey={user?.avatar}
            gender={user?.gender}
            seed={user?.id || user?.fullName || user?.email || "guest-user"}
            name={user?.fullName || "Guest User"}
            onEditPress={handleEditProfile}
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <AppSpinner size="small" color="#000" />
            </View>
          )}

          {error && !loading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* History Section */}
          <ProfileSection
            title="History"
            onSeeAllPress={() => router.push("/watch-history")}
            items={(watchHistory?.items || [])
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
              }))}
          />

          {/* Watchlist Section */}
          <ProfileSection
            title="Watchlist"
            onSeeAllPress={() => router.push("/watchlist")}
            items={(watchlist?.items || [])
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
              }))}
          />

          {/* Downloaded Videos */}
          <DownloadedVideosItem onPress={handleDownloadedVideos} />
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
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(12),
  },
  headerSpacer: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  headerIcon: {
    width: wp(20),
    height: hp(20),
    tintColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(110),
  },
  contentInner: {
    width: "100%",
    maxWidth: 980,
    alignSelf: "center",
  },
  loadingContainer: {
    paddingVertical: hp(8),
    alignItems: "center",
  },
  errorContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(8),
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
  },
});
