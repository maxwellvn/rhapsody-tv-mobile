import { BottomNav } from "@/components/bottom-nav";
import { ContinueWatchingSection } from "@/components/home/continue-watching-section";
import { FeaturedVideosSection } from "@/components/home/featured-videos-section";
import { LiveStreamsSection } from "@/components/home/live-streams-section";
import { ProgramsSection } from "@/components/home/programs-section";
import { useUnreadNotificationCount } from "@/hooks/queries/useNotificationQueries";
import { SearchBar } from "@/components/search-bar";
import { styles } from "@/styles/home.styles";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscoverScreen() {
  const router = useRouter();
  const unreadCount = useUnreadNotificationCount();

  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  const handleSearchSubmit = (text: string) => {
    const q = text.trim();
    if (!q) return;
    router.push(`/(tabs)/discover?query=${encodeURIComponent(q)}`);
  };

  const handleTabPress = (tab: string) => {
    if (tab === "Home") {
      router.push("/(tabs)");
    } else if (tab === "Schedule") {
      router.push("/(tabs)/schedule");
    } else if (tab === "Profile") {
      router.push("/(tabs)/profile");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar style="dark" />

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

      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search videos and programs..."
          onSubmit={handleSearchSubmit}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ProgramsSection />
        <ContinueWatchingSection />
        <FeaturedVideosSection />
        <LiveStreamsSection />
      </ScrollView>

      <BottomNav activeTab="Discover" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
