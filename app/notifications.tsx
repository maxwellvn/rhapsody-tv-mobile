import { AppSpinner } from "@/components/app-spinner";
import { NotificationItem } from "@/components/notifications/notification-item";
import { NotificationsHeader } from "@/components/notifications/notifications-header";
import {
    useDeleteNotification,
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
    useNotifications,
} from "@/hooks/queries/useNotificationQueries";
import { styles } from "@/styles/notifications.styles";
import { NotificationDto } from "@/types/api.types";
import { formatRelativeTime } from "@/utils/formatters";
import { Href, router, Stack } from "expo-router";
import { Linking } from "react-native";
import { useCallback, useMemo, useState } from "react";
import {
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    View,
} from "react-native";
import { useAlert } from "@/context/AlertContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<"All" | "Comments" | "Reminders">(
    "All",
  );
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: notificationsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useNotifications(1, 20);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);
  const { mutateAsync: markRead, isPending: isMarkingRead } =
    useMarkNotificationRead();
  const { mutateAsync: deleteNotification, isPending: isDeletingNotification } =
    useDeleteNotification();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) {
      setSearchQuery("");
    }
  };

  const handleMenu = () => {
    showAlert("Notifications", "Choose an action", [
      {
        text: "Mark all as read",
        onPress: () => markAllRead(),
      },
      {
        text: "Refresh",
        onPress: () => refetch(),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const pickStringFromData = (
    data: Record<string, unknown> | undefined,
    paths: string[][],
  ): string | undefined => {
    if (!data) return undefined;

    for (const path of paths) {
      let current: unknown = data;
      for (const key of path) {
        if (!current || typeof current !== "object") {
          current = undefined;
          break;
        }
        current = (current as Record<string, unknown>)[key];
      }

      if (typeof current === "string" && current.trim().length > 0) {
        return current.trim();
      }
    }

    return undefined;
  };

  const isLikelyObjectId = (value?: string) =>
    !!value && /^[a-fA-F0-9]{24}$/.test(value);

  const resolveNotificationRoute = (notification: NotificationDto): Href | { __externalUrl: string } => {
    const data = notification.data as Record<string, unknown> | undefined;

    // Handle custom notification action types
    if (notification.type === "custom" && data?.actionType) {
      const actionType = data.actionType as string;
      if (actionType === "external_url" && typeof data.actionUrl === "string") {
        return { __externalUrl: data.actionUrl };
      }
      if (actionType === "open_app") {
        return "/notifications";
      }
      // For channel/program/video/livestream, fall through to existing resolution
    }

    const videoId = pickStringFromData(data, [
      ["videoId"],
      ["video", "id"],
      ["video", "_id"],
    ]);
    const livestreamId = pickStringFromData(data, [
      ["livestreamId"],
      ["liveStreamId"],
      ["livestream", "id"],
      ["livestream", "_id"],
    ]);
    const programId = pickStringFromData(data, [
      ["programId"],
      ["program", "id"],
      ["program", "_id"],
    ]);
    const channelId = pickStringFromData(data, [["channelId"], ["channel", "id"], ["channel", "_id"]]);
    const channelSlug = pickStringFromData(data, [
      ["channelSlug"],
      ["channel", "slug"],
    ]);

    if (isLikelyObjectId(videoId)) {
      return { pathname: "/video", params: { id: videoId } };
    }

    if (isLikelyObjectId(livestreamId)) {
      return { pathname: "/live-video", params: { liveStreamId: livestreamId } };
    }

    if (isLikelyObjectId(programId)) {
      return {
        pathname: "/program-profile",
        params: {
          id: programId,
          channelId: channelId || "",
          channelSlug: channelSlug || "",
        },
      };
    }

    if (channelSlug) return "/(tabs)";

    if (
      notification.type === "channel_go_live" ||
      notification.type === "channel_new_video" ||
      notification.type === "channel_new_program" ||
      notification.type === "channel_new_schedule"
    ) {
      return "/(tabs)/schedule";
    }

    return "/notifications";
  };

  const handleNotificationPress = async (notification: NotificationDto) => {
    if (!notification.isRead) {
      try {
        await markRead(notification.id);
      } catch {
        // Continue navigation even if read status update fails.
      }
    }

    const route = resolveNotificationRoute(notification);

    // Handle external URL
    if (route && typeof route === "object" && "__externalUrl" in route) {
      Linking.openURL(route.__externalUrl).catch(() => {});
      return;
    }

    if (route !== "/notifications") {
      router.push(route as Href);
    }
  };

  const notifications = notificationsData?.notifications ?? [];

  const resolveImageFromData = (
    data: Record<string, unknown> | undefined,
    key: string,
  ) => {
    const url = data?.[key];
    if (typeof url === "string" && url.trim().length > 0) {
      return { uri: url };
    }
    return undefined;
  };
  const filteredNotifications = useMemo(() => {
    let result = notifications;

    if (activeTab === "Comments") {
      result = result.filter((item) =>
        ["comment_liked", "comment_replied"].includes(item.type),
      );
    } else if (activeTab === "Reminders") {
      result = result.filter((item) =>
        ["channel_go_live", "channel_new_program", "channel_new_video"].includes(
          item.type,
        ),
      );
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return result;

    return result.filter((item) => {
      const title = item.title.toLowerCase();
      const body = item.body.toLowerCase();
      return title.includes(q) || body.includes(q);
    });
  }, [activeTab, notifications, searchQuery]);

  const handleNotificationMenu = (notification: NotificationDto) => {
    showAlert("Notification", "Choose an action", [
      {
        text: "Open",
        onPress: () => handleNotificationPress(notification),
      },
      !notification.isRead
        ? {
            text: "Mark as read",
            onPress: () => markRead(notification.id),
          }
        : {
            text: "Already read",
          },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteNotification(notification.id);
          } catch {
            showAlert("Error", "Failed to delete notification.");
          }
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <NotificationsHeader
          title="Notifications"
          onBackPress={handleBack}
          onSearchPress={handleSearch}
          onMenuPress={handleMenu}
        />
        {isSearchVisible && (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search notifications..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, activeTab === "All" && styles.activeTab]}
            onPress={() => setActiveTab("All")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "All" && styles.activeTabText,
              ]}
            >
              All
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === "Comments" && styles.activeTab]}
            onPress={() => setActiveTab("Comments")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Comments" && styles.activeTabText,
              ]}
            >
              Comments
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === "Reminders" && styles.activeTab]}
            onPress={() => setActiveTab("Reminders")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Reminders" && styles.activeTabText,
              ]}
            >
              Reminders
            </Text>
          </Pressable>
        </View>

        {(isLoading ||
          isMarkingAll ||
          isMarkingRead ||
          isDeletingNotification) && (
          <View style={styles.loadingContainer}>
            <AppSpinner size="small" color="#000" />
          </View>
        )}

        {!!error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Failed to load notifications. Please try again.
            </Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No notifications yet.</Text>
            </View>
          ) : (
            filteredNotifications.map((notification) => {
              const notificationData = notification.data as
                | Record<string, unknown>
                | undefined;
              const avatar = resolveImageFromData(notificationData, "avatarUrl");
              const thumbnail = resolveImageFromData(
                notificationData,
                "thumbnailUrl",
              );

              return (
              <NotificationItem
                key={notification.id}
                avatar={avatar}
                title={notification.title}
                subtitle={notification.body}
                timeAgo={formatRelativeTime(notification.createdAt)}
                thumbnail={thumbnail}
                isRead={notification.isRead}
                onPress={() => handleNotificationPress(notification)}
                onMenuPress={() => handleNotificationMenu(notification)}
              />
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
