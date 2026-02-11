import { NotificationItem } from "@/components/notifications/notification-item";
import { NotificationsHeader } from "@/components/notifications/notifications-header";
import {
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
    useNotifications,
} from "@/hooks/queries/useNotificationQueries";
import { styles } from "@/styles/notifications.styles";
import { NotificationDto } from "@/types/api.types";
import { formatRelativeTime } from "@/utils/formatters";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<"All" | "Comments" | "Reminders">(
    "All",
  );
  const {
    data: notificationsData,
    isLoading,
    isFetching,
    error,
  } = useNotifications(1, 20);
  const { mutate: markRead, isPending: isMarkingRead } =
    useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    console.log("Search pressed");
  };

  const handleMenu = () => {
    markAllRead();
  };

  const handleNotificationPress = (notification: NotificationDto) => {
    if (!notification.isRead) {
      markRead(notification.id);
    }
  };

  const notifications = notificationsData?.notifications ?? [];
  const filteredNotifications = useMemo(() => {
    if (activeTab === "Comments") {
      return notifications.filter((item) =>
        ["comment_liked", "comment_replied"].includes(item.type),
      );
    }

    if (activeTab === "Reminders") {
      return notifications.filter((item) =>
        ["channel_go_live", "channel_new_program"].includes(item.type),
      );
    }

    return notifications;
  }, [activeTab, notifications]);

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

        {(isLoading || isFetching || isMarkingAll || isMarkingRead) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000" />
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
        >
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No notifications yet.</Text>
            </View>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                avatar={require("@/assets/images/Avatar.png")}
                title={notification.title}
                subtitle={notification.body}
                timeAgo={formatRelativeTime(notification.createdAt)}
                thumbnail={require("@/assets/images/Image-11.png")}
                onPress={() => handleNotificationPress(notification)}
                onMenuPress={() => handleNotificationPress(notification)}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
