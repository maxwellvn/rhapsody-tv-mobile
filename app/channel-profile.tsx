import { AboutTab } from "@/components/channel-profile/about-tab";
import { HomeTab } from "@/components/channel-profile/home-tab";
import { LiveTab } from "@/components/channel-profile/live-tab";
import { ChannelProfileHeader } from "@/components/channel-profile/profile-header";
import { ScheduleTab } from "@/components/channel-profile/schedule-tab";
import { VideosTab } from "@/components/channel-profile/videos-tab";
import { Skeleton } from "@/components/skeleton";
import { useChannel, channelKeys } from "@/hooks/queries/useChannelQueries";
import { styles } from "@/styles/channel-profile.styles";
import { borderRadius, fs, hp, spacing, wp } from "@/utils/responsive";
import { useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
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

function ChannelProfileSkeleton() {
  return (
    <View style={skeletonStyles.container}>
      <View style={skeletonStyles.header}>
        <Skeleton width={wp(24)} height={wp(24)} borderRadius={wp(4)} />
        <View style={{ flex: 1 }} />
        <Skeleton width={wp(24)} height={wp(24)} borderRadius={wp(4)} />
        <Skeleton
          width={wp(24)}
          height={wp(24)}
          borderRadius={wp(4)}
          style={{ marginLeft: spacing.md }}
        />
      </View>

      <View style={skeletonStyles.banner}>
        <Skeleton width="100%" height={hp(150)} />
      </View>

      <View style={skeletonStyles.profileSection}>
        <View style={skeletonStyles.avatarRow}>
          <Skeleton width={wp(64)} height={wp(64)} borderRadius={wp(32)} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Skeleton
              width={wp(150)}
              height={fs(18)}
              borderRadius={borderRadius.xs}
              style={{ marginBottom: hp(8) }}
            />
            <Skeleton
              width={wp(120)}
              height={fs(12)}
              borderRadius={borderRadius.xs}
            />
          </View>
        </View>

        <Skeleton
          width="100%"
          height={fs(14)}
          borderRadius={borderRadius.xs}
          style={{ marginTop: hp(16), marginBottom: hp(8) }}
        />
        <Skeleton
          width="80%"
          height={fs(14)}
          borderRadius={borderRadius.xs}
          style={{ marginBottom: hp(24) }}
        />

        <Skeleton
          width={wp(120)}
          height={hp(40)}
          borderRadius={borderRadius.sm}
        />
      </View>

      <View style={skeletonStyles.tabs}>
        {["Home", "Videos", "Live", "Schedule", "About"].map((_, i) => (
          <Skeleton
            key={i}
            width={wp(50)}
            height={fs(14)}
            borderRadius={borderRadius.xs}
          />
        ))}
      </View>

      <View style={skeletonStyles.content}>
        <Skeleton
          width="100%"
          height={hp(200)}
          borderRadius={borderRadius.lg}
          style={{ marginBottom: hp(16) }}
        />
        <Skeleton
          width="100%"
          height={hp(80)}
          borderRadius={borderRadius.sm}
          style={{ marginBottom: hp(8) }}
        />
        <Skeleton
          width="100%"
          height={hp(80)}
          borderRadius={borderRadius.sm}
          style={{ marginBottom: hp(8) }}
        />
        <Skeleton width="100%" height={hp(80)} borderRadius={borderRadius.sm} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
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
  banner: {
    width: "100%",
    height: hp(150),
    backgroundColor: "#1A237E",
  },
  profileSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(16),
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.xl,
    paddingVertical: hp(12),
    gap: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: hp(16),
  },
});

export default function ChannelProfileScreen() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  const [activeTab, setActiveTab] = useState<
    "Home" | "Videos" | "Live" | "Schedule" | "About"
  >("Home");
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useChannel(slug || "");

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        queryClient.refetchQueries({ queryKey: channelKeys.videos(slug || "", 1) }),
        queryClient.refetchQueries({ queryKey: channelKeys.livestreams(slug || "") }),
        queryClient.refetchQueries({ queryKey: channelKeys.schedule(slug || "") }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, queryClient, slug]);

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {};

  const handleMenu = () => {};

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <ChannelProfileSkeleton />
        </SafeAreaView>
      </>
    );
  }

  if (!data && !isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <View
            style={[
              styles.container,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Text>Channel not found</Text>
            <Pressable onPress={handleBack} style={{ marginTop: 20 }}>
              <Text style={{ color: "#1A237E" }}>Go Back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header with Back, Search, and Menu */}
        <View style={styles.header}>
          {/* Back Button */}
          <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
            <Image
              source={require("@/assets/Icons/back.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>

          {/* Right Actions */}
          <View style={styles.headerRight}>
            <Pressable onPress={handleSearch} hitSlop={8}>
              <Image
                source={require("@/assets/Icons/search.png")}
                style={styles.headerIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable onPress={handleMenu} hitSlop={8}>
              <Image
                source={require("@/assets/Icons/ellipsis.png")}
                style={styles.headerIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Channel Profile Section */}
          {data && <ChannelProfileHeader channel={data.channel} />}

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {(["Home", "Videos", "Live", "Schedule", "About"] as const).map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === "Home" && data && <HomeTab detail={data} />}
            {activeTab === "Videos" && <VideosTab slug={slug || ""} />}
            {activeTab === "Live" && <LiveTab slug={slug || ""} />}
            {activeTab === "Schedule" && <ScheduleTab slug={slug || ""} />}
            {activeTab === "About" && data && (
              <AboutTab channel={data.channel} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
