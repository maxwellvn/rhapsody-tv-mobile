import { BottomNav } from "@/components/bottom-nav";
import { ChannelsListSection } from "@/components/home/channels-list-section";
import { useUnreadNotificationCount } from "@/hooks/queries/useNotificationQueries";
import { homepageKeys } from "@/hooks/queries/useHomepageQueries";
import { SearchBar } from "@/components/search-bar";
import { styles } from "@/styles/home.styles";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
} from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const unreadCount = useUnreadNotificationCount();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.refetchQueries({ queryKey: homepageKeys.all });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  const handleSearchSubmit = (text: string) => {
    const q = text.trim();
    if (!q) return;
    router.push(`/(tabs)/discover?query=${encodeURIComponent(q)}`);
  };

  const handleTabPress = (tab: string) => {
    if (tab === "Discover") {
      router.push("/(tabs)/discover");
    } else if (tab === "Schedule") {
      router.push("/(tabs)/schedule");
    } else if (tab === "Profile") {
      router.push("/(tabs)/profile");
    } else if (tab === "Home") {
      // Already on home
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Pressable
          onPress={handleNotificationPress}
          style={styles.notificationButton}
        >
          <Image
            source={require("@/assets/Icons/Bell.png")}
            style={styles.notificationIcon}
            resizeMode="contain"
          />
          {unreadCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "#EF4444",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 4,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "700" }}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search channels and programs..."
          onSubmit={handleSearchSubmit}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingHorizontal: 0 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ChannelsListSection />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="Home" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
