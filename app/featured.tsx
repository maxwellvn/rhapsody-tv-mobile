import { AppSpinner } from "@/components/app-spinner";
import { useFeaturedVideos } from "@/hooks/queries/useHomepageQueries";
import { FONTS } from "@/styles/global";
import { fs, spacing } from "@/utils/responsive";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeaturedPage() {
  const { data: featuredVideos = [], isLoading, isError } = useFeaturedVideos(150);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Image
              source={require("@/assets/Icons/back.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.title}>Featured Videos</Text>
        </View>

        {isLoading ? (
          <View style={styles.loaderWrap}>
            <AppSpinner size="large" color="#1D4ED8" />
          </View>
        ) : isError ? (
          <View style={styles.loaderWrap}>
            <Text style={styles.emptyText}>Unable to load featured videos right now.</Text>
          </View>
        ) : featuredVideos.length === 0 ? (
          <View style={styles.loaderWrap}>
            <Text style={styles.emptyText}>No featured videos available.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {featuredVideos.map((video) => (
              <Pressable
                key={video.id}
                style={styles.item}
                onPress={() => router.push(`/video?id=${video.id}`)}
              >
                <Image
                  source={
                    video.thumbnailUrl
                      ? { uri: video.thumbnailUrl }
                      : require("@/assets/images/carusel-2.png")
                  }
                  style={styles.thumb}
                  resizeMode="cover"
                />
                <View style={styles.meta}>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <Text style={styles.channelName} numberOfLines={1}>
                    {video.channel?.name || "Channel"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  backButton: { padding: spacing.xs },
  backIcon: { width: 22, height: 22, tintColor: "#111827" },
  title: { fontSize: fs(22), fontFamily: FONTS.bold, color: "#0F172A" },
  loaderWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.md },
  item: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  thumb: { width: "100%", height: 190, backgroundColor: "#E5E7EB" },
  meta: { padding: spacing.md },
  videoTitle: { fontSize: fs(16), fontFamily: FONTS.bold, color: "#0F172A" },
  channelName: { marginTop: 4, fontSize: fs(13), fontFamily: FONTS.regular, color: "#64748B" },
  emptyText: { fontSize: fs(14), fontFamily: FONTS.regular, color: "#64748B", textAlign: "center" },
});
